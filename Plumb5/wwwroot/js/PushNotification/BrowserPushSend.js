var pushSendingSetting = { UserInfoUserId: 0, UserGroupId: 0, Name: "", BrowserPushTemplateId: 0, GroupId: 0, IsSchedule: true };
var PushScheduled = { BrowserPushSendingSettingId: 0, ScheduledStatus: 0, ScheduledDate: "", ApprovalStatus: true };
var groupList = [];
var templateList = [];
var PushGroupName = "";
var PushTemplateName = "";
var senderDetails = { SendingSettingId: 0, CampaignName: 0, PushId: 0, Title: "", Message: "", ImageUrl: "", Icon: "", ExtraAction: "", RedirectTo: "", WelcomeMsg: 0, Browser: 0, Duration: 0, Image: "" };
var vendorType = "Vapid";

$(document).ready(function () {
    $("#dvLoading").show();
    DynamicDateAppend();
    BindTemplate();
    BindGroupsList();
    $("#dvLoading").hide();
});

/* Initization Methos*/

function BindTemplate() {
    $.ajax({
        url: "/Push/Send/GetAllTemplateDetails",
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            $.each(response, function () {
                templateList.push({ label: $(this)[0].CampaignName, value: $(this)[0].CampaignName, assignedValue: $(this)[0].PushId });
            });
        },
        error: ShowAjaxError
    });
}

$("#ui_txtPushTemplate").autocomplete({
    autoFocus: true,
    minLength: 1,
    source: templateList,
    select: function (events, selectedItem) {
        $("#ui_txtPushTemplate").attr("templateid", selectedItem.item.assignedValue);
        PushTemplateName = selectedItem.item.value;
    },
    change: function (event, ui) {
        if (ui.item === null) {
            $("#ui_txtPushTemplate").attr("templateid", 0);
            PushTemplateName = selectedItem.item.value;
        }
    }
});

function BindGroupsList() {
    $.ajax({
        url: "/Push/Send/GetAllBrowserGroups",
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            $.each(response, function () {
                groupList.push({ value: $(this)[0].Name, label: $(this)[0].Name, assignedValue: $(this)[0].Id });
            });
        },
        error: ShowAjaxError
    });
}

$("#ui_txtGroup").autocomplete({
    autoFocus: true,
    minLength: 1,
    source: groupList,
    select: function (events, selectedItem) {
        $("#ui_txtGroup").attr("groupid", selectedItem.item.assignedValue);
        PushGroupName = selectedItem.item.value;
        DynamicDateAppend();
    },
    change: function (event, ui) {
        if (ui.item === null) {
            $("#ui_txtGroup").attr("groupid", 0);
            PushGroupName = selectedItem.item.value;
        }
    }
});

$("#ui_txtTestGroups").autocomplete({
    autoFocus: true,
    minLength: 1,
    source: groupList,
    select: function (events, selectedItem) {
        $("#ui_txtTestGroups").attr("testgroupid", selectedItem.item.assignedValue);
        PushGroupName = selectedItem.item.value;
    },
    change: function (event, ui) {
        if (ui.item === null) {
            $("#ui_txtTestGroups").attr("testgroupid", 0);
            PushGroupName = selectedItem.item.value;
        }
    }
});

function DynamicDateAppend() {
    var today = new Date();
    var strYear = today.getMonth().toString() + 1 + today.getDate().toString() + today.getMilliseconds().toString();
    $("#ui_txtCampaignIdentifier").val("Push Campaign Identifier -" + strYear);
}


/* Group Test push notification testing*/
$("#btntestcampaign").click(function () {
    if (!ValidateTestPush()) {
        return;
    }
    SendGroupTestPushMessage();
});

function ValidateTestPush() {
    if (CleanText($("#ui_txtCampaignIdentifier").val()).length == 0) {
        ShowErrorMessage("Please enter the campaign identifier");
        return false;
    }

    if ($("#ui_txtPushTemplate").attr("templateid") == 0) {
        ShowErrorMessage("Please select template");
        return false;
    }

    if ($("#ui_txtGroup").attr("groupid") == 0) {
        ShowErrorMessage("Please select group from list");
        return false;
    }

    return true;
}

function SendGroupTestPushMessage() {
    $("#dvLoading").show();

    pushSendingSetting.Name = $("#ui_txtCampaignIdentifier").val();
    pushSendingSetting.BrowserPushTemplateId = $("#ui_txtPushTemplate").attr("templateid");
    pushSendingSetting.GroupId = $("#ui_txtGroup").attr("groupid");
    pushSendingSetting.IsSchedule = false;


    $.ajax({
        url: "/Push/Send/SendGroupTestPush",
        type: 'POST',
        data: JSON.stringify({ 'pushSendingSetting': pushSendingSetting, 'vendorType': vendorType }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            $("#dvLoading").hide();
            if (response.Result) {
                ShowErrorMessage(response.ErrorMessage);
            }
            else {
                ShowErrorMessage(response.ErrorMessage);
            }
        },
        error: ShowAjaxError
    });
}

//Schedule Push Notification
$("#ui_btnSendPush").click(function () {
    $("#dvLoading").show();
    if (!ValidationPush()) {
        $("#dvLoading").hide();
        return;
    }
    SchedulePushCampaign();
});

function ValidationPush() {

    if (CleanText($("#ui_txtCampaignIdentifier").val()).length == 0) {
        ShowErrorMessage("Please enter the campaign identifier");
        $("#ui_txtCampaignIdentifier").focus();
        return false;
    }

    if ($("#ui_txtPushTemplate").attr("templateid") == 0) {
        ShowErrorMessage("Please select template from list");
        return false;
    }

    if ($("#ui_txtGroup").attr("groupid") == 0) {
        ShowErrorMessage("Please select group from list");
        return false;
    }

    if ($("#txtDateFrom").val().length === 0) {
        ShowErrorMessage("Please select schedule date and time for next hour onwards");
        return false;
    }

    var selectedDatestring = $("#txtDateFrom").val().split("-");

    var hourAndMin = $("#ui_dllScheduleTime option:selected").text().split(":");
    var selectedDate = new Date(selectedDatestring[0], parseInt(selectedDatestring[1]) - 1, selectedDatestring[2], hourAndMin[0], hourAndMin[1]);

    if (selectedDate <= new Date()) {
        ShowErrorMessage("Please select correct schedule time and date for next hour onwards");
        return false;
    }

    return true;
}

function SchedulePushCampaign() {
    pushSendingSetting.Name = $("#ui_txtCampaignIdentifier").val();
    pushSendingSetting.BrowserPushTemplateId = $("#ui_txtPushTemplate").attr("templateid");
    pushSendingSetting.GroupId = $("#ui_txtGroup").attr("groupid");

    var pushScheduled = GetScheduledDetails();

    $.ajax({
        url: "/Push/Send/SaveSendPushSendingSetting",
        type: 'POST',
        data: JSON.stringify({ 'pushSendingSetting': pushSendingSetting, 'browserPushScheduled': pushScheduled }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response >= 1) {
                ShowErrorMessage("Successfully Scheduled");
            }
            else if (response == -1) {
                ShowErrorMessage("Campaign Name Already Exists");
            }
            else {
                ShowErrorMessage("please contact support or try again later");
            }
            $("#dvLoading").hide();
        },
        error: ShowAjaxError
    });
}

function GetScheduledDetails() {
    PushScheduled.ScheduledDate = $("#txtDateFrom").val();
    let selectedDatestring = PushScheduled.ScheduledDate.split("-");
    let hourAndMin = $("#ui_dllScheduleTime option:selected").text().split(":");
    let selectedDate = new Date(selectedDatestring[0], parseInt(selectedDatestring[1]) - 1, selectedDatestring[2], hourAndMin[0], hourAndMin[1]);
    let ScheduledDate = ConvertToGMT(selectedDate);
    PushScheduled.ScheduledDate = ScheduledDate.getFullYear() + '-' + AddingPrefixZero((ScheduledDate.getMonth() + 1)) + '-' + AddingPrefixZero(ScheduledDate.getDate()) + " " + AddingPrefixZero(ScheduledDate.getHours()) + ":" + AddingPrefixZero(ScheduledDate.getMinutes()) + ":" + AddingPrefixZero(ScheduledDate.getSeconds());
    PushScheduled.ScheduledStatus = true;
    pushSendingSetting.IsSchedule = true;
    PushScheduled.ApprovalStatus = true;
    return PushScheduled;
}

function GetgroupContacts(GroupName) {

    if ($("#ui_txtGroup").attr("groupid") > 0) {
        $("#dvLoading").show();
        EnableSend(true, "");

        var Group = { Id: 0, Name: "" };

        if (GroupName != undefined) {

            Group.Name = GroupName;
        }

        Group.Id = $("#ui_txtGroup").attr("groupid");
        var OffSet = 0;
        var FetchNext = 1;

        $.ajax({
            url: "/Push/Send/GetAllBrowserGroups",
            type: 'Post',
            data: JSON.stringify({ 'GroupName': GroupName, 'FetchNext': FetchNext, 'OffSet': OffSet }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: BindGroupDetails,
            error: ShowAjaxError
        });
    }
    else {
        $("#ui_divGroupDetails").hide();
    }
}

function BindGroupDetails(GroupDetails) {

    var Name;
    if (GroupDetails.length > 0) {

        $("#ui_divGroupDetails").show();
        TotalVerified = GroupDetails[0].Verified;
        if (GroupDetails[0].Name.length > 30) {
            Name = GroupDetails[0].Name.substring(0, 30) + "..";
            $("#ui_txtGroupName").html(Name).attr("title", GroupDetails[0].Name);
        }
        else {
            $("#ui_txtGroupName").html(GroupDetails[0].Name);
        }

        $("#ui_txttotalContacts").html(GroupDetails[0].GrpCount);
        $("#ui_txtUnSubscribe").html(GroupDetails[0].DisplayInUnsubscribe);

        if (GroupDetails[0].GrpCount > 0) {
            EnableSend(false, "");
        }
        else {
            EnableSend(true, "");
        }

        if (GroupDetails[0].GrpCount === 0) {
            ShowErrorMessage("Selected group have no contact(s).");
            $("#dvLoading").hide();
            return false;
        }

        if ($("#ui_dvCustomPopUpcampaigntest").is(":visible")) {
            if (GroupDetails[0].Total > 20) {
                $("#ui_btnProceed").prop("disabled", true).css({ backgroundColor: "#a2a2a2" });
                ShowErrorMessage("Please select a group which has 20 contacts presents");
            }
            else {
                $("#ui_btnProceed").removeAttr("disabled").css({ backgroundColor: "" });
            }


        }
    }
    $("#dvLoading").hide();
}

function PurchaseDetails() {

    $.ajax({
        url: "/Sms/Send/PurchaseFeature",
        type: 'Post',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindPurchaseDetails,
        error: ShowAjaxError
    });
}

function AddingPrefixZero(n) {
    return (n < 10) ? ("0" + n) : n;
}