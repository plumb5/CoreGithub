var rulesName = "";
var userInfoList = [], userGroupList = [], contactGroupList = [];

$(document).ready(function () {
    notifyruleUtil.LoadingSymbol();
    notifyruleUtil.BindRulesList();
    notifyruleUtil.BindContactProperties();
});

function CallBackFunction() {
    ShowPageLoading();
    TotalRowCount = 0;
    CurrentRowCount = 0;
    NotificationRulesUtil.GetMaxCount();
}

function CallBackPaging() {
    ShowPageLoading();
    CurrentRowCount = 0;
    NotificationRulesUtil.GetReport();
}

var NotificationRulesUtil = {
    GetMaxCount: function () {
        $.ajax({
            url: "/Prospect/NotificationRules/GetNotificationRulesMaxCount",
            data: JSON.stringify({ 'AdsId': Plumb5AccountId, 'rulesName': rulesName }),
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                TotalRowCount = response;

                if (TotalRowCount > 0)
                    NotificationRulesUtil.GetReport();
                else {
                    SetNoRecordContent('ui_tbl_NotifiReportData', 9, 'ui_tbody_NotifiReportData');
                    //ShowExportDiv(false);
                    ShowPagingDiv(false);
                    HidePageLoading();
                }
            },
            error: ShowAjaxError
        });
    },
    GetReport: function () {
        FetchNext = GetNumberOfRecordsPerPage();
        $.ajax({
            url: "/Prospect/NotificationRules/GetNotificationRules",
            type: 'Post',
            data: JSON.stringify({ 'AdsId': Plumb5AccountId, 'OffSet': OffSet, 'FetchNext': FetchNext, 'rulesName': rulesName }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: NotificationRulesUtil.BindReport,
            error: ShowAjaxError
        });
    },
    BindReport: function (response) {
        SetNoRecordContent('ui_tbl_NotifiReportData', 9, 'ui_tbody_NotifiReportData');
        if (response != undefined && response != null) {
            CurrentRowCount = response.length;
            PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);

            var reportTableTrs = "";
            $.each(response, function () {
                var assignedEmail = parseInt(this.AssignUserInfoUserId) > 0 ? NotificationRulesUtil.GetAssignUserInfoUserName(parseInt(this.AssignUserInfoUserId)) : "NA";
                var isStatus = this.Status ? "<td id='ui_div_RuleStatus_" + this.Id + "' class='text-color-success'>Active</td>" : "<td id='ui_div_RuleStatus_" + this.Id + "' class='text-color-error'>In-Active</td>";
                var toggleStatus = this.Status ? "onclick=\"NotificationRulesUtil.ToggleStatus(" + this.Id + ",false);\"" : "onclick=\"NotificationRulesUtil.ToggleStatus(" + this.Id + ",true);\"";
                var userGroup = parseInt(this.AssignUserGroupId) > 0 ? NotificationRulesUtil.GetAssignUserGroupName(parseInt(this.AssignUserGroupId)) : "NA";
                var isMail = this.Mail ? "True" : "False";
                var isSms = this.Sms ? "True" : "False";
                var groupName = parseInt(this.AutoAssignToGroupId) > 0 ? NotificationRulesUtil.GetAutoAssignToGroupName(parseInt(this.AutoAssignToGroupId)) : "NA";
                var autoMail = parseInt(this.AutoMailSendingSettingId) > 0 ? "True" : "False";
                var autoSms = parseInt(this.AutoSmsSendingSettingId) > 0 ? "True" : "False";
                reportTableTrs += "<tr id='ui_tr_NotificationRules_" + this.Id + "' value='" + this.Id + "' rulesPriority='" + this.RulePriority + "'>" +
                    "<td><div class='groupnamewrap'><div id='ui_div_RuleName_" + this.Id + "' class='nametxticnwrp'><i class='griddragicn'></i><span class='wordbreak'>" + this.Name + "</span></div>" +
                    "<div class='tdcreatedraft d-flex align-items-center'><i class='icon ion-ios-information infocampresponse' data-toggle='popover' data-CreatedDate='" + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(this.CreatedDate)) + "' data-UpdatedDate='" + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(this.UpdatedDate)) + "'></i>" +
                    "<div class='dropdown'><button type='button' class='verticnwrp' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'><i class='icon ion-android-more-vertical mr-0'></i></button>" +
                    "<div class='dropdown-menu dropdown-menu-right' aria-labelledby='filterbycontacts'><a class='dropdown-item' href='javascript:void(0);' onclick=\"EditRuleContact(" + this.Id + ");\">Edit</a>" +
                    "<div class='dropdown-divider'></div><a id='ui_a_ChangeStatus_" + this.Id + "' class='dropdown-item' " + toggleStatus + " href='javascript:void(0);'>Change Status</a>" +
                    "<div class='dropdown-divider'></div><a id='ui_a_deleteNotifRules' data-toggle='modal' data-target='#deletegroups' data-grouptype='groupDelete' data-PopUpNotifRulesId=" + this.Id + " class='dropdown-item' href='javascript:void(0);'>Delete</a>" +
                    "</div></div></div></div></td>" +
                    "<td>" + assignedEmail + "</td>" +
                    isStatus +
                    "<td>" + userGroup + "</td>" +
                    "<td>" + isMail + "</td>" +
                    "<td>" + isSms + "</td>" +
                    "<td>" + groupName + "</td>" +
                    "<td>" + autoMail + "</td>" +
                    "<td>" + autoSms + "</td>" +
                    "</tr>";
            });
            $("#ui_tbl_NotifiReportData").removeClass('no-data-records');
            $("#ui_tbody_NotifiReportData").html(reportTableTrs);
            //ShowExportDiv(true);
            ShowPagingDiv(true);
            NotificationRulesUtil.BindDates();
        }
        else {
            //ShowExportDiv(false);
            ShowPagingDiv(false);
        }
        HidePageLoading();
    },
    BindDates: function () {
        $(".infocampresponse").popover({
            html: true,
            trigger: "hover",
            placement: "bottom",
            content: function () {
                $("#ui_span_CreatedDate").html($(this).attr("data-CreatedDate"));
                $("#ui_span_UpdatedDate").html($(this).attr("data-UpdatedDate"));
                return $(".camptypwrap").html();
            },
        });
    },
    DeleteNotificationRules: function () {
        $.ajax({
            url: "/Prospect/NotificationRules/Delete",
            type: 'POST',
            data: JSON.stringify({ 'AdsId': Plumb5AccountId, 'Id': notiRulesId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response) {
                    --CurrentRowCount;
                    --TotalRowCount;
                    $("#ui_tr_NotificationRules_" + notiRulesId).hide("slow");
                    PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);
                    ShowSuccessMessage(GlobalErrorList.NotificationRules.DeleteSuccessStatus);
                    if (CurrentRowCount <= 0 && TotalRowCount <= 0) {
                        //ShowExportDiv(false);
                        ShowPagingDiv(false);
                        SetNoRecordContent('ui_tbl_NotifiReportData', 9, 'ui_tbody_NotifiReportData');
                    }
                    else if (CurrentRowCount <= 0 && TotalRowCount > 0)
                        window.location.reload();
                }
                else
                    ShowErrorMessage(GlobalErrorList.NotificationRules.DeleteFailureStatus);
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },
    ChangePriority: function (contactNotificationRules) {
        $.ajax({
            url: "/Prospect/NotificationRules/ChangePriority",
            type: 'POST',
            data: JSON.stringify({ 'AdsId': Plumb5AccountId, 'Id': notiRulesId, 'contactNotificationRules': contactNotificationRules }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response)
                    ShowSuccessMessage(GlobalErrorList.NotificationRules.PrioritySuccessStatus);
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },
    ToggleStatus: function (Id, Status) {
        ShowPageLoading();
        $.ajax({
            url: "/Prospect/NotificationRules/ToggleStatus",
            type: 'POST',
            data: JSON.stringify({ 'AdsId': Plumb5AccountId, 'Id': Id, 'Status': Status }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response) {
                    ShowSuccessMessage(GlobalErrorList.NotificationRules.StatusChangeSuccess);
                    if (Status) {
                        $("#ui_div_RuleStatus_" + Id).removeClass("text-color-error").addClass("text-color-success").html("Active");
                        $("#ui_a_ChangeStatus_" + Id).attr("onclick", "NotificationRulesUtil.ToggleStatus(" + Id + ",false);");
                    }
                    else {
                        $("#ui_div_RuleStatus_" + Id).removeClass("text-color-success").addClass("text-color-error").html("In-Active");
                        $("#ui_a_ChangeStatus_" + Id).attr("onclick", "NotificationRulesUtil.ToggleStatus(" + Id + ",true);");
                    }
                }
                else
                    ShowErrorMessage(GlobalErrorList.NotificationRules.StatusChangeFailure);
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },
    GetAssignUserInfoUserName: function (Id) {
        var userName = "";
        for (var i = 0; i < userInfoList.length; i++) {
            if (parseInt(userInfoList[i].UserInfoUserId) == Id) {
                userName = userInfoList[i].EmailId;
                break;
            }
        }
        return userName;
    },
    GetAssignUserGroupName: function (Id) {
        var userGroupName = "";
        for (var i = 0; i < userGroupList.length; i++) {
            if (parseInt(userGroupList[i].Id) == Id) {
                userGroupName = userGroupList[i].Name;
                break;
            }
        }
        return userGroupName;
    },
    GetAutoAssignToGroupName: function (Id) {
        var groupName = "";
        for (var i = 0; i < contactGroupList.length; i++) {
            if (parseInt(contactGroupList[i].Id) == Id) {
                groupName = contactGroupList[i].Name;
                break;
            }
        }
        return groupName;
    },
    RedirectToPage: function () {
        ShowPageLoading();
        TotalRowCount = 0;
        CurrentRowCount = 0;
        rulesName = CleanText($("#ui_txt_SearchRulesName").val());
        NotificationRulesUtil.GetMaxCount();
    }
};

$(".lmsaddruletab").click(function () {
    $(".lmsaddrulewrp").removeClass("hideDiv");
});

$(".lmsclseaddrule").click(function () {
    $(".lmsaddrulewrp").addClass("hideDiv");
});

$("#close-popup, .clsepopup").click(function () {
    $(this).parents(".popupcontainer").addClass("hideDiv");
    $("tr").removeClass("activeBgRow");
});

var notiRulesId = 0;
$(document).on('click', "#ui_a_deleteNotifRules", function () {
    notiRulesId = parseInt($(this).attr("data-PopUpNotifRulesId"));
});
$(document).on('click', "#deleteRowConfirm", function () {
    ShowPageLoading();
    NotificationRulesUtil.DeleteNotificationRules();
});

$("#ui_txt_SearchRulesName").keypress(function (e) {
    if ((e.which && e.which === 13) || (e.keyCode && e.keyCode === 13)) {
        if (CleanText($.trim($("#ui_txt_SearchRulesName").val())).length == 0) {
            ShowErrorMessage(GlobalErrorList.NotificationRules.SearchErrorValue);
            return false;
        }
        ShowPageLoading();
        TotalRowCount = 0;
        CurrentRowCount = 0;
        rulesName = CleanText($("#ui_txt_SearchRulesName").val());
        NotificationRulesUtil.GetMaxCount();
    }
});

$("#ui_txt_SearchRulesName").keyup(function (e) {
    if (e.which && e.which === 8 || e.keyCode && e.keyCode === 46)
        if ($("#ui_txt_SearchRulesName").val().length === 0) {
            ShowPageLoading();
            TotalRowCount = 0;
            CurrentRowCount = 0;
            rulesName = "";
            NotificationRulesUtil.GetMaxCount();
        }
});

$("#ui_i_SearchRulesName").click(function () {
    if (CleanText($.trim($("#ui_txt_SearchRulesName").val())).length == 0) {
        ShowErrorMessage(GlobalErrorList.NotificationRules.SearchErrorValue);
        return false;
    }
    ShowPageLoading();
    TotalRowCount = 0;
    CurrentRowCount = 0;
    rulesName = CleanText($("#ui_txt_SearchRulesName").val());
    NotificationRulesUtil.GetMaxCount();
});

$('.sorted_table').sortable({
    containerSelector: 'table',
    itemPath: '> tbody',
    itemSelector: 'tr',
    placeholder: '<tr class="placeholder"/>',
    onDrop: function ($item, container, _super) {
        _super($item, container);
        var rulesIds = [];
        var rulesIdValues = [];
        var rulesPriorities = [];
        var rulesDetailsList = new Array();
        $("#ui_tbody_NotifiReportData tr").each(function () {
            rulesIds.push(this.id);
        });
        for (var i = 0; i < rulesIds.length; i++) {
            if ($("#" + rulesIds[i]).attr('value') != undefined && $("#" + rulesIds[i]).attr('value') != null && $("#" + rulesIds[i]).attr('value') != "") {
                rulesIdValues.push($("#" + rulesIds[i]).attr('value'));
            }
            if ($("#" + rulesIds[i]).attr('rulesPriority') != undefined && $("#" + rulesIds[i]).attr('rulesPriority') != null && $("#" + rulesIds[i]).attr('rulesPriority') != "") {
                rulesPriorities.push($("#" + rulesIds[i]).attr('rulesPriority'));
            }
        }
        //This i am doing to re-arrange the Rules priorities in ascending order
        rulesPriorities = rulesPriorities.sort(function (a, b) {
            return parseInt(a) - parseInt(b);
        });
        for (var i = 0; i < rulesIdValues.length; i++) {
            var ruleDetails = { Id: 0, RulePriority: 0 };
            ruleDetails.Id = rulesIdValues[i];
            ruleDetails.RulePriority = rulesPriorities[i];
            rulesDetailsList.push(ruleDetails);
        }
        NotificationRulesUtil.ChangePriority(rulesDetailsList);
    }
});

//Search text
$(".contsearchfocus")
    .on("focus", function () {
        $(this).parent().addClass("w-300");
    })
    .on("blur", function () {
        if ($(".contsearchfocus").val().length < 15)
            $(this).parent().removeClass("w-300");
    });
