var lmsStage = new Array();
var lmsStageNotificationlist;
var LmsStageList;
var userGroupList = new Array();
var UserList = new Array();
var lmsStageNotification = new Object();

$(document).ready(function () {
    LmsSettingUtil.BindAssignUserEmailds();
    LmsSettingUtil.GetWhatsappTemplates();
    LmsSettingUtil.GetSmsTemplates();
    LmsSettingUtil.GetMailTemplates();
});

var LmsSettingUtil = {
    BindAssignUserEmailds: function () {
        $.ajax({
            url: "/Prospect/Settings/GetUser",
            type: 'POST',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'UserId': Plumb5UserId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            success: function (userList) {
                var user;
                $.each(userList, function (i) {
                    if (this.ActiveStatus) {
                        user = { UserId: $(this)[0].UserInfoUserId, FirstName: $(this)[0].FirstName, EmailId: $(this)[0].EmailId };
                        UserList.push(user);
                        $('#drp_AssignUser').append("<option value='" + this.UserInfoUserId + "'>" + this.FirstName + " (" + this.EmailId + ")</option>");
                    }
                });
                LmsSettingUtil.BindUserGroup();
            },
            error: ShowAjaxError
        });
    },
    BindUserGroup: function () {
        $.ajax({
            url: "/Prospect/Settings/GetUserGroups",
            type: 'POST',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (userList) {
                window.drp_UserGroup.innerHTML = '';
                var userdata;
                $.each(userList, function () {
                    userdata = { UserGroupId: $(this)[0].Id, UserGroupName: $(this)[0].Name };
                    userGroupList.push(userdata);
                    window.drp_UserGroup.innerHTML += "<option value='" + this.Id + "'>" + this.Name + "</option>";
                    $('#drp_AssignRoundRobin').append("<option value='" + this.Id + "'>" + this.Name + "</option>");
                    $('#drp_MailSmsUserGroup').append("<option value='" + this.Id + "'>" + this.Name + "</option>");
                });
                LmsSettingUtil.GetReport();
            },
            error: ShowAjaxError
        });
    },
    GetWhatsappTemplates: function () {
        $.ajax({
            url: "/Prospect/Settings/GetWhatsAppTemplateList",
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ 'accountId': Plumb5AccountId }),
            dataType: "json",
            success: function (response) {
                if (response != undefined && response != null) {
                    $.each(response, function () {
                        $("#ui_dllwhatsapptemplates").append(`<option value="${$(this)[0].Id}">${$(this)[0].Name}</option>`);
                    });
                }
            },
            error: ShowAjaxError
        });
    },
    GetSmsTemplates: function () {
        $.ajax({
            url: "/Prospect/Settings/GetSmsTemplateList",
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ 'accountId': Plumb5AccountId }),
            dataType: "json",
            success: function (response) {
                if (response != undefined && response != null) {
                    $.each(response, function () {
                        $("#ui_dllsmstemplates").append(`<option value="${$(this)[0].Id}">${$(this)[0].Name}</option>`);
                    });
                }
            },
            error: ShowAjaxError
        });
    },

    GetMailTemplates: function()  {
        $.ajax({
            url: "/Prospect/Settings/GetMailTemplateList",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                $.each(response, function () {
                    optlist = document.createElement('option');
                    optlist.value = $(this)[0].Id;
                    optlist.text = $(this)[0].Name;
                    document.getElementById("ui_dllmailtemplates").options.add(optlist);
                });
            },
            error: ShowAjaxError
        });
},
    GetReport: function () {
        $("#ui_tbodyReportData").empty();
        $.ajax({
            url: "/Prospect/Settings/GetStageScore",
            data: JSON.stringify({ 'AccountId': Plumb5AccountId }),
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: LmsSettingUtil.BindReport,
            error: ShowAjaxError
        });
    },
    BindReport: function (response) {
        SetNoRecordContent('ui_tableReport', 5, 'ui_tbodyReportData');
        lmsStageNotificationlist = response.LmsNotificationList;
        LmsStageList = response.LmsStageList;
        if (response.LmsStageList !== undefined && response.LmsStageList !== null && response.LmsStageList.length > 0) {
            var reportTableTrs, tdDeleteContent;
            $.each(response.LmsStageList, function () {
                if (this.Stage.toLowerCase() === "closed lost" || this.Stage.toLowerCase() === "closed won" || this.Stage.toLowerCase() === "un-staged")
                    tdDeleteContent = "<div class='editDeleteWrap mt-0'><button class='td-delete delEventTrack'>NA</button><div>";
                else
                    tdDeleteContent = "<div class='editDeleteWrap mt-0'><button data-toggle='modal' data-target='#deleterow' class='td-delete delEventTrack' onclick=\"LmsSettingUtil.DeleteStageConfirm(" + this.Id + ");\">Delete</button><div>";

                reportTableTrs += "<tr>" +
                    "<td>" + this.Score + "</td>" +
                    "<td class='m-p-w-140 text-left'>" + this.Stage + "</td>" +
                    "<td class='text-center'><div class='lmsstagecolwrp'><div class='lmslblstage lmslblleadin ml-2' style='background-color:" + this.IdentificationColor + "; color:" + getReadableForeColor(this.IdentificationColor) + ";'>" + this.Stage + "</div></div></td>" +
                    "<td><div class='editDeleteWrap mt-0'><button  class='td-edit lmseditstage' onclick=\"LmsSettingUtil.EditStage(this,'" + this.IdentificationColor + "','" + this.UserGroupId + "'," + this.Id + ",'" + this.Stage + "');\">Edit</button><div></td>" +
                    "<td>" + tdDeleteContent + "</td>" +
                    "</tr>";
            });
            $("#ui_tableReport").removeClass('no-data-records');
            $("#ui_tbodyReportData").html(reportTableTrs);
        }
        HidePageLoading();
    },
    Validate: function () {
        if ($("#ui_btnUpdateStage").val() == 'Add Stage' && $('#ui_tbodyReportData').children().length > 100) {
            ShowErrorMessage(GlobalErrorList.LmsSettings.LmsStageLimit_ErrorMessage);
            return false;
        }

        if ($.trim($("#ui_txtStageName").val()).length == 0) {
            ShowErrorMessage(GlobalErrorList.LmsSettings.StageName_ErrorMessage);
            return false;
        }

        if ($.trim($("#ui_txtStageScore").val()).length == 0) {
            ShowErrorMessage(GlobalErrorList.LmsSettings.StageScore_ErrorMessage);
            return false;
        }

        if ($.trim($("#ui_txtStageScore").val()).indexOf(".") > -1) {
            $("#ui_txtStageScore").focus();
            ShowErrorMessage(GlobalErrorList.LmsSettings.StageScoreSpecialCharacters_ErrorMessage);
            return false;
        }

        if ($.trim($("#ui_txtStageName").val()) != "Un-Staged" && parseInt($("#ui_txtStageScore").val()) <= 0) {
            ShowErrorMessage(GlobalErrorList.LmsSettings.StageScore_lessErrorMessage);
            return false;
        }

        if (parseInt($("#ui_txtStageColor").val()) <= 0) {
            ShowErrorMessage(GlobalErrorList.LmsSettings.StageColor_ErrorMessage);
            return false;
        }
        if ($('#lmssendseniormail').prop('checked') == true && $('#lmssenior').prop('checked') == false && $('#drp_MailSmsUserGroup').val() == 0 && $('#ui_txtOtherEmail').val() == '') {
            ShowErrorMessage(GlobalErrorList.LmsSettings.LmsSendmailSelect_ErrorMessage);
            return false;
        }
       
        if ($('#lmssendseniorsms').prop('checked') == true && $('#lmssenior').prop('checked') == false && $('#drp_MailSmsUserGroup').val() == 0 && $('#ui_txtOtherPhoneNumber').val() == '') {
            ShowErrorMessage(GlobalErrorList.LmsSettings.LmsSendSmsSelect_ErrorMessage);
            return false;
        }

        if ($('#lmssassignuser').prop('checked') == true && $('#drp_AssignUser').val() == 0) {
            ShowErrorMessage(GlobalErrorList.LmsSettings.AssignUser_ErrorMesage);
            return false;
        }

        if ($('#lmssassignrrobin').prop('checked') == true && $('#drp_AssignRoundRobin').val() == 0) {
            ShowErrorMessage(GlobalErrorList.LmsSettings.AssignRoundRobin_ErrorMessage);
            return false;
        }
        if ($('#lmssendmailtoleads').prop('checked') == true && $('#ui_dllmailtemplates').val() == 0) {
            ShowErrorMessage(GlobalErrorList.LmsSettings.Lmsselectmailtemplate);
            return false;
        }
        if ($('#lmssendsmstoleads').prop('checked') == true && $('#ui_dllsmstemplates').val() == 0) {
            ShowErrorMessage(GlobalErrorList.LmsSettings.Lmsselectsmstemplate);
            return false;
        }
        if ($('#lmssendwhatsapptoleads').prop('checked') == true && $('#ui_dllwhatsapptemplates').val() == 0) {
            ShowErrorMessage(GlobalErrorList.LmsSettings.Lmsselectwhatsapptemplate);
            return false;
        }
        if ($("#ui_btnAddUpdateStage").attr('data-Id') == undefined) {
            //Add
            if (LmsStageList != null && LmsStageList.length > 0) {
                var stagename = $.trim($("#ui_txtStageName").val());
                var StageScore = $.trim($("#ui_txtStageScore").val());

                var stageItem = JSLINQ(LmsStageList).Where(function () {
                    return (this.Stage.toLowerCase() == stagename.toLowerCase());
                });

                if (stageItem != null && stageItem != undefined && stageItem.items[0] != null && stageItem.items[0] != "" && stageItem.items[0] != undefined) {
                    ShowErrorMessage(GlobalErrorList.LmsSettings.StageName_ExistMessage);
                    return false;
                }

                var stageScoreItem = JSLINQ(LmsStageList).Where(function () {
                    return (this.Score == parseInt(StageScore));
                });

                if (stageScoreItem != null && stageScoreItem != undefined && stageScoreItem.items[0] != null && stageScoreItem.items[0] != "" && stageScoreItem.items[0] != undefined) {
                    ShowErrorMessage(GlobalErrorList.LmsSettings.StageScore_ExistMessage);
                    return false;
                }
            }
        }
        else {
            //while updating we are checking here whether the stage name and score is already existing with other stages
            var Id = $("#ui_btnAddUpdateStage").attr('data-Id');

            if (LmsStageList != null && LmsStageList.length > 0) {
                var stagename = $.trim($("#ui_txtStageName").val());
                var StageScore = $.trim($("#ui_txtStageScore").val());

                var stageItem = JSLINQ(LmsStageList).Where(function () {
                    return (this.Stage.toLowerCase() == stagename.toLowerCase() && this.Id != Id);
                });

                if (stageItem != null && stageItem != undefined && stageItem.items[0] != null && stageItem.items[0] != "" && stageItem.items[0] != undefined) {
                    ShowErrorMessage(GlobalErrorList.LmsSettings.StageName_ExistMessage);
                    return false;
                }

                var stageScoreItem = JSLINQ(LmsStageList).Where(function () {
                    return (this.Score == parseInt(StageScore) && this.Id != Id);
                });

                if (stageScoreItem != null && stageScoreItem != undefined && stageScoreItem.items[0] != null && stageScoreItem.items[0] != "" && stageScoreItem.items[0] != undefined) {
                    ShowErrorMessage(GlobalErrorList.LmsSettings.StageScore_ExistMessage);
                    return false;
                }
            }
        }

        //if ($("#drp_UserGroup").val() == 0) {
        //    ShowErrorMessage(GlobalErrorList.LmsSettings.UserGroup_ErrorMessage);
        //    return false;
        //}
        //if ($("input[name='ddcl-ui_dllUserType_" + i + "']:checked").length <= 0) {
        //    ShowErrorMessage("Please select any one user group");
        //    return false;
        //}
        return true;
    },
    SaveOrUpdateStage: function () {
        ShowPageLoading();

        if (!LmsSettingUtil.Validate()) {
            HidePageLoading();
            return;
        }

        var lmsStage = new Object();

        lmsStage.Id = $("#ui_btnAddUpdateStage").attr('data-Id') == undefined ? 0 : $("#ui_btnAddUpdateStage").attr('data-Id');
        lmsStage.Stage = $('#ui_txtStageName').val();
        lmsStage.Score = parseInt($("#ui_txtStageScore").val());
        lmsStage.IdentificationColor = $('#ui_txtStageColor').val();
        var UserId = '';
        var lstUserGrpId = $('#drp_UserGroup').val();

        if (lstUserGrpId != null && lstUserGrpId.length > 0) {
            for (i = 0; i < lstUserGrpId.length; ++i) {
                UserId += lstUserGrpId[i] + ",";
            }
            lmsStage.UserGroupId = UserId.replace(/,\s*$/, "");
        }
        else {
            lmsStage.UserGroupId = "0";
        }

        lmsStageNotification.LmsStageId = lmsStage.Id;
        lmsStageNotification.Mail = $('#lmssendseniormail').prop('checked') == true ? true : false;
        lmsStageNotification.Sms = $('#lmssendseniorsms').prop('checked') == true ? true : false;
        lmsStageNotification.WhatsApp = $('#lmssendseniorwhatsapp').prop('checked') == true ? true : false;
        lmsStageNotification.ReportToSeniorId = $('#lmssenior').prop('checked') == true ? true : false;
        lmsStageNotification.UserGroupId = ($('#lmssendseniormail').prop('checked') == true || $('#lmssendseniorsms').prop('checked') == true) ? parseInt($('#drp_MailSmsUserGroup').val()) : 0;
        lmsStageNotification.EmailIds = $('#lmssendseniormail').prop('checked') == true ? $('#ui_txtOtherEmail').val() : '';
        lmsStageNotification.PhoneNos = $('#lmssendseniorsms').prop('checked') == true ? $('#ui_txtOtherPhoneNumber').val() : '';
        lmsStageNotification.WhatsappPhoneNos = $('#lmssendseniorwhatsapp').prop('checked') == true ? $('#ui_txtOtherPhoneNumberwhatsapp').val() : '';
        lmsStageNotification.AssignUserInfoUserId = $('#ui_CheckAssignUser').prop('checked') == true ? parseInt($('#drp_AssignUser').val()) : 0;
        lmsStageNotification.AssignUserGroupId = $('#ui_CheckAssignUser').prop('checked') == true ? parseInt($('#drp_AssignRoundRobin').val()) : 0;
        lmsStageNotification.IsOpenFollowUp = $('#lmsopenaddfollowup').prop('checked') == true ? true : false;
        lmsStageNotification.IsOpenNotes = $('#lmsOpenAddNotes').prop('checked') == true ? true : false;
        lmsStageNotification.MailTemplateId = $('#lmssendmailtoleads').prop('checked') == true ? parseInt($('#ui_dllmailtemplates').val()) : 0;
        lmsStageNotification.SmsTemplateId = $('#lmssendsmstoleads').prop('checked') == true ? parseInt($('#ui_dllsmstemplates').val()) : 0;
        lmsStageNotification.WhatsAppTemplateId = $('#lmssendwhatsapptoleads').prop('checked') == true ? parseInt($('#ui_dllwhatsapptemplates').val()) : 0;;

        $.ajax({
            url: "/Prospect/Settings/SaveOrUpdateUpdateStageDetails",
            type: 'POST',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'LmsStage': lmsStage, 'LmsStageNotification': lmsStageNotification }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if ($("#ui_btnAddUpdateStage").attr('data-Id') == undefined) {
                    if (response.resultId > 0) {
                        $(".popupcontainer").addClass("hideDiv");
                        ShowSuccessMessage(GlobalErrorList.LmsSettings.Save_SuccessMessage);
                        LmsSettingUtil.GetReport();
                    }
                }
                else {
                    if (response.status) {
                        $(".popupcontainer").addClass("hideDiv");
                        ShowSuccessMessage(GlobalErrorList.LmsSettings.Updated_SuccessMessage);
                        $("#ui_btnAddUpdateStage").removeAttr('data-Id');
                        LmsSettingUtil.GetReport();
                    }
                }

                //if (response > 0) {
                //    $(".popupcontainer").addClass("hideDiv");
                //    ShowSuccessMessage(GlobalErrorList.LmsSettings.Save_SuccessMessage);
                //    LmsSettingUtil.GetReport();
                //}
                //else {
                //    if (response == 0) {
                //        $(".popupcontainer").addClass("hideDiv");
                //        ShowSuccessMessage(GlobalErrorList.LmsSettings.Updated_SuccessMessage);
                //        $("#ui_btnAddUpdateStage").removeAttr('data-Id');
                //        LmsSettingUtil.GetReport();
                //    }
                //    else if (response == -1)
                //        ShowErrorMessage(GlobalErrorList.LmsSettings.StageName_ExistMessage);
                //    else if (response == -2)
                //        ShowErrorMessage(GlobalErrorList.LmsSettings.StageScore_ExistMessage);
                //    HidePageLoading();
                //}
            },
            error: ShowAjaxError
        });
    },
    ClearPopupFields: function () {
        $("#drp_UserGroup").val('').trigger("change");
        $("#ui_dllwhatsapptemplates,#ui_dllsmstemplates,#ui_dllmailtemplates").val('0').trigger("change");
        $('#lmssendseniormail,#lmssendseniorsms,#lmssenior,#ui_CheckAssignUser,#lmssendseniorwhatsapp,#lmssendwhatsapptoleads,#lmssendsmstoleads,#lmssendmailtoleads').prop('checked', false);
        $('#ui_txtOtherEmail,#ui_txtOtherPhoneNumber,#ui_txtOtherPhoneNumberwhatsapp').val('');
        $('#drp_MailSmsUserGroup,#drp_AssignUser,#drp_AssignRoundRobin').val('0');
        $('#select2-drp_AssignUser-container,#select2-drp_AssignRoundRobin-container,#select2-drp_MailSmsUserGroup-container').text('Select');
        $(".lmsaddphnnumbbtn,#dvMailSettings,#dvSmsSettings,#dvwhatsappSettings,#dvSeniorReport,.lmsassignuseroptwrp,#dvleadwhatsappstage,#dvleadsmsstage,#dvleadmailstage").addClass("hideDiv");
        $('input[name=lmsassingopttype]').prop('checked', false);
        $('#lmsopenaddfollowup').prop('checked', false);
        $('#lmsOpenAddNotes').prop('checked', false);
    },
    EditStage: function (response, color, UserGroupId, Id, Stage) {
        LmsSettingUtil.ClearPopupFields();
        var lstUserGrpId = [];
        $("#ui_txtStageName,#ui_txtStageScore").removeAttr("disabled");
        $(".lmsaddphnpopupwrp, .lmsverifnumwrp, .otp-error,.lmsaddphnnumbbtn").addClass("hideDiv");
        $(".popupcontainer,.lmsaddrulepopupwrp,.lmsaddstagebbtn").removeClass("hideDiv");

        $(".popuptitle h6").text("Manage Stage " + "(" + Stage + ")");
        let lmsstagenametr = response.closest("tr");
        let lmsstagescreval = lmsstagenametr.firstChild.innerText;
        let lmsstagenametxt = lmsstagenametr.firstChild.nextElementSibling.innerText;
        let lmsstagenameval = $.trim(lmsstagenametxt);
        $("#ui_txtStageName").val(lmsstagenameval);
        if (lmsstagenameval.toLowerCase() === "un-staged" || lmsstagenameval.toLowerCase() == 'closed won' || lmsstagenameval.toLowerCase() == 'closed lost')
            $("#ui_txtStageName").attr("disabled", "disabled");
        if (lmsstagescreval == 0)
            $("#ui_txtStageScore").attr("disabled", "disabled");
        $("#ui_txtStageScore").val(lmsstagescreval);
        $("#ui_txtStageColor").val(color);
        $(".lmsstagecolprev").css("background-color", color);
        $("#ui_btnAddUpdateStage").attr('data-Id', Id);
        $("#ui_btnAddUpdateStage").val("Update Stage");

        var SplittedUserGroupIds = new Array();
        SplittedUserGroupIds = UserGroupId.split(',');
        var Userdetails = "", UserGrpId = '', UserGroupName = "";
        if (SplittedUserGroupIds.length > 1) {
            for (var i = 0; i < SplittedUserGroupIds.length; i++) {
                Userdetails = JSLINQ(userGroupList).Where(function () { return (this.UserGroupId == SplittedUserGroupIds[i]); });
                if (Userdetails.items.length != 0) {
                    lstUserGrpId.push(Userdetails.items[0].UserGroupId);
                    UserGroupName += Userdetails.items[0].UserGroupName + ",";
                }
            }
            UserGroupName = UserGroupName == "" ? "Nothing selected" : UserGroupName.substring(0, UserGroupName.length - 1);
        }
        else {
            Userdetails = JSLINQ(userGroupList).Where(function () { return (this.UserGroupId == UserGroupId); });
            if (Userdetails.items.length != 0) {
                UserGroupName += Userdetails.items[0].UserGroupName;
                lstUserGrpId.push(Userdetails.items[0].UserGroupId);
            }
            else {
                UserGroupName = 'Nothing selected';
                lstUserGrpId.push(0);
            }

        }
        $('#drp_UserGroup').val(lstUserGrpId).trigger("change");
        
        $('.filter-option-inner-inner').text(UserGroupName);
        var LmsNotificationDetails = JSLINQ(lmsStageNotificationlist).Where(function () { return (this.LmsStageId == Id); });
        $('#ui_dllmailtemplates').val(LmsNotificationDetails.items[0].MailTemplateId).trigger("change");
        $('#ui_dllsmstemplates').val(LmsNotificationDetails.items[0].SmsTemplateId).trigger("change");
        $('#ui_dllwhatsapptemplates').val(LmsNotificationDetails.items[0].WhatsAppTemplateId).trigger("change");
        if (LmsNotificationDetails.items.length > 0) {
            if (LmsNotificationDetails.items[0].IsOpenFollowUp != null && LmsNotificationDetails.items[0].IsOpenFollowUp) {
                lmsStageNotification.IsOpenFollowUp = LmsNotificationDetails.items[0].IsOpenFollowUp;
                $('#lmsopenaddfollowup').prop('checked', true);
            }

            if (LmsNotificationDetails.items[0].IsOpenNotes != null && LmsNotificationDetails.items[0].IsOpenNotes) {
                lmsStageNotification.IsOpenNotes = LmsNotificationDetails.items[0].IsOpenNotes;
                $('#lmsOpenAddNotes').prop('checked', true);
            }

            lmsStageNotification.LmsStageId = LmsNotificationDetails.items[0].LmsStageId;
            if (LmsNotificationDetails.items[0].Mail == true) {
                $('#lmssendseniormail').prop('checked', true);
                $('#dvMailSettings').removeClass("hideDiv");
            }
            if (LmsNotificationDetails.items[0].Sms == true) {
                $('#lmssendseniorsms').prop('checked', true);
                $('#dvSmsSettings').removeClass("hideDiv");
            }
            if (LmsNotificationDetails.items[0].WhatsApp == true) {
                $('#lmssendseniorwhatsapp').prop('checked', true);
                $('#dvwhatsappSettings').removeClass("hideDiv");
            }
            if (LmsNotificationDetails.items[0].ReportToSeniorId == true) {
                $('#lmssenior').prop('checked', true);
                $('#dvSeniorReport').removeClass("hideDiv");
            }
            if (LmsNotificationDetails.items[0].SmsTemplateId > 0) {
                $('#lmssendsmstoleads').prop('checked', true);
                $('#dvleadsmsstage').removeClass("hideDiv");
            }
            if (LmsNotificationDetails.items[0].MailTemplateId > 0) {
                $('#lmssendmailtoleads').prop('checked', true);
                $('#dvleadmailstage').removeClass("hideDiv");
            }
            if (LmsNotificationDetails.items[0].WhatsAppTemplateId > 0) {
                $('#lmssendwhatsapptoleads').prop('checked', true);
                $('#dvleadwhatsappstage').removeClass("hideDiv");
            }
            $('#drp_MailSmsUserGroup').val(LmsNotificationDetails.items[0].UserGroupId);
            $('#ui_txtOtherEmail').val(LmsNotificationDetails.items[0].EmailIds);
            $('#ui_txtOtherPhoneNumber').val(LmsNotificationDetails.items[0].PhoneNos);
            $('#ui_txtOtherPhoneNumberwhatsapp').val(LmsNotificationDetails.items[0].WhatsappPhoneNos);

            if (LmsNotificationDetails.items[0].AssignUserInfoUserId > 0 || LmsNotificationDetails.items[0].AssignUserGroupId > 0) {
                $('#ui_CheckAssignUser').prop('checked', true);
                if ($(".lmsassignuseroptwrp").hasClass("hideDiv"))
                    $(".lmsassignuseroptwrp").removeClass("hideDiv");
            }
            else {
                $('#ui_CheckAssignUser').prop('checked', false);
                if (!$(".lmsassignuseroptwrp").hasClass("hideDiv"))
                    $(".lmsassignuseroptwrp").addClass("hideDiv");
            }

            if (LmsNotificationDetails.items[0].AssignUserInfoUserId > 0) {
                $('#lmssassignuser').prop('checked', true);
                $('.lmsassgnrrobinwrp').addClass('hideDiv');
                $('.lmsassgnuserwrp').removeClass('hideDiv');
                $('#drp_AssignUser').val(LmsNotificationDetails.items[0].AssignUserInfoUserId);
                var UserEmaildetails = JSLINQ(UserList).Where(function () { return (this.UserId == LmsNotificationDetails.items[0].AssignUserInfoUserId); });
                if (UserEmaildetails.items.length > 0)
                    $('#select2-drp_AssignUser-container').text(UserEmaildetails.items[0].FirstName + " (" + UserEmaildetails.items[0].EmailId + ")");
                else
                    $('#select2-drp_AssignUser-container').text('Select');
            }
            else {
                $('#lmssassignuser').prop('checked', false);
            }
            if (LmsNotificationDetails.items[0].AssignUserGroupId > 0) {
                $('#lmssassignrrobin').prop('checked', true);
                $('.lmsassgnuserwrp').addClass('hideDiv');
                $('.lmsassgnrrobinwrp').removeClass('hideDiv');
                $('#drp_AssignRoundRobin').val(LmsNotificationDetails.items[0].AssignUserGroupId);
                var AssignRoundRobinUserdetails = JSLINQ(userGroupList).Where(function () { return (this.UserGroupId == LmsNotificationDetails.items[0].AssignUserGroupId); });
                if (AssignRoundRobinUserdetails.items.length > 0)
                    $('#select2-drp_AssignRoundRobin-container').text(AssignRoundRobinUserdetails.items[0].UserGroupName);
                else
                    $('#select2-drp_AssignRoundRobin-container').text('Select');
            }
            Userdetails = JSLINQ(userGroupList).Where(function () { return (this.UserGroupId == LmsNotificationDetails.items[0].UserGroupId); });
            if (Userdetails.items.length > 0)
                $('#select2-drp_MailSmsUserGroup-container').text(Userdetails.items[0].UserGroupName);
            else
                $('#select2-drp_MailSmsUserGroup-container').text('Select');
        }
        else {
            lmsStageNotification.LmsStageId = 0;
        }
    },
    DeleteStageConfirm: function (Id) {
        $("#deleteRowConfirm").attr("onclick", "LmsSettingUtil.DeleteStage(" + Id + ");");
    },
    DeleteStage: function (Id) {
        ShowPageLoading();
        $.ajax({
            url: "/Prospect/Settings/DeleteStage",
            type: 'POST',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'lmsStageId': Id }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response) {
                    ShowSuccessMessage(GlobalErrorList.LmsSettings.Delete_SuccessMessage);
                    LmsSettingUtil.GetReport();
                }
            }
        });
    }
};

$(".lmsaddstage").click(function () {
    $("#drp_UserGroup").val('').trigger("change");
    $("#ui_dllwhatsapptemplates,#ui_dllsmstemplates,#ui_dllmailtemplates").val('0').trigger("change");
    $(".filter-option-inner-inner").text('Nothing selected');
    $("#ui_txtStageName,#ui_txtStageScore").removeAttr("disabled");
    $("#ui_btnAddUpdateStage").removeAttr('data-Id');
    $(".popuptitle h6").html("Add Stage");
    $("#ui_btnAddUpdateStage").val("Add Stage");
    $(".popupcontainer,.lmsaddrulepopupwrp,.lmsaddstagebbtn,.lmsassgnuserwrp").removeClass("hideDiv");
    $(".lmsaddphnnumbbtn,#dvMailSettings,#dvSmsSettings,#dvSeniorReport,.lmsassignuseroptwrp,#dvleadwhatsappstage,#dvwhatsappSettings,#dvleadsmsstage,#dvleadmailstage").addClass("hideDiv");
    $('#lmssendseniormail,#lmssendseniorsms,#lmssenior,#ui_CheckAssignUser,#lmssendwhatsapptoleads,#lmssendsmstoleads,#lmssendseniorwhatsapp,#lmssendmailtoleads').prop('checked', false);
    $('#lmssassignuser, #lmssassignrrobin').prop('checked', false);
    $('#drp_UserGroup,#drp_MailSmsUserGroup,#drp_AssignUser,#drp_AssignRoundRobin').val(0);
    $('#select2-drp_MailSmsUserGroup-container,#select2-drp_AssignUser-container,#select2-drp_AssignRoundRobin-container').text('Select');
    $("#ui_txtStageName,#ui_txtStageScore,#ui_txtOtherEmail,#ui_txtOtherPhoneNumber,#ui_txtOtherPhoneNumberwhatsapp").val("");

    $("#ui_txtStageColor").val("#1B84E7");
    $(".lmsstagecolprev").css("background-color", "#1B84E7");
});

$("#ui_txtStageColor").change(function () {
    let getlmsstagecolval = $(this).val();
    $(".lmsstagecolprev").css("background-color", getlmsstagecolval);
});

$("#ui_btnAddUpdateStage").click(function () {
    LmsSettingUtil.SaveOrUpdateStage();
});

$("#close-popup, .clsepopup").click(function () {
    $(this).parents(".popupcontainer").addClass("hideDiv");
});

$('input[name="lmssendseniormail"]').click(function () {
    if ($(this).prop('checked') == true)
        $('#dvMailSettings').removeClass("hideDiv");
    else
        $('#dvMailSettings').addClass("hideDiv");
 
});

$('input[name="lmssendseniorsms"]').click(function () {

    if ($(this).prop('checked') == true)
        $('#dvSmsSettings').removeClass("hideDiv");

    else
        $('#dvSmsSettings').addClass("hideDiv");
     
});

$('input[name="lmssenior"]').click(function () {

    if ($(this).prop('checked') == true)
        $('#dvSeniorReport').removeClass("hideDiv");

    else
        $('#dvSeniorReport').addClass("hideDiv");
     
});

$('input[name="lmsassingopttype"]').click(function () {
    let getlmsassgnoptval = $(this).attr("id");
    if (getlmsassgnoptval == "lmssassignrrobin") {
        $('#drp_AssignUser').val(0);
        $('#select2-drp_AssignUser-container').text('Select');
        $(".lmsassgnuserwrp").addClass("hideDiv");
        $(".lmsassgnrrobinwrp").removeClass("hideDiv");
    } else {
        $('#drp_AssignRoundRobin').val(0);
        $('#select2-drp_AssignRoundRobin-container').text('Select');
        $(".lmsassgnrrobinwrp").addClass("hideDiv");
        $(".lmsassgnuserwrp").removeClass("hideDiv");
    }
});

$('#ui_CheckAssignUser').click(function () {
    $(".lmsassignuseroptwrp").toggleClass("hideDiv");
    $('#lmssassignuser, #lmssassignrrobin').prop('checked', false);
    $('#select2-drp_AssignUser-container,#select2-drp_AssignRoundRobin-container').text('Select');
});

$('input[name="lmssendseniorwhatsapp"]').click(function () {

    if ($(this).prop('checked') == true)
        $('#dvwhatsappSettings').removeClass("hideDiv");

    else
        $('#dvwhatsappSettings').addClass("hideDiv");

    
});

$('input[name="lmssendmailtoleads"]').click(function () {
    if ($(this).prop('checked') == true)
        $('#dvleadmailstage').removeClass("hideDiv");
    else
        $('#dvleadmailstage').addClass("hideDiv");
     
});
$('input[name="lmssendsmstoleads"]').click(function () {
    if ($(this).prop('checked') == true)
        $('#dvleadsmsstage').removeClass("hideDiv");
    else
        $('#dvleadsmsstage').addClass("hideDiv");
     
});
$('input[name="lmssendwhatsapptoleads"]').click(function () {
    if ($(this).prop('checked') == true)
        $('#dvleadwhatsappstage').removeClass("hideDiv");
    else
        $('#dvleadwhatsappstage').addClass("hideDiv");
     
});