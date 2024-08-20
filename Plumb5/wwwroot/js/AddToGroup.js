
var groupContacts = { Name: "", GroupDescription: "Group details" };

var ContactIdList = [];

$(document).ready(function () {
    ForPartialGroupName();
});

ForPartialGroupName = function () {

    $.ajax({
        url: "../Form/CommonDetailsForForms/GetGroups",
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            $.each(response, function () {
                $("#ui_ddlGroup,#ui_ddlRemoveGroup").append("<option value=" + $(this)[0].Id + ">" + $(this)[0].Name + "</option>");
            });
        },
        error: ShowAjaxError
    });
};


$("#btnAddToGroup").click(function () {
    $("#dvLoading").show();

    if (!ValidateAddGroup()) {
        $("#dvLoading").hide();
        return;
    }

    ContactIdList = GetSelectedIds();


    if (ContactIdList.length == 0) {
        ShowErrorMessage("Please select at least one contact to add.");
        $("#dvLoading").hide();
        return;
    }

    var GroupId = $("#ui_ddlGroup").val();
    groupContacts.Name = CleanText($("#txtNewGroupName").val());
    groupContacts.GroupDescription = groupContacts.Name + "Description";

    $.ajax({
        url: "../Form/AddToGroup/ImportNewContactList",
        type: 'POST',
        data: JSON.stringify({ 'contact': ContactIdList, 'GroupId': GroupId, 'group': groupContacts }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            ShowErrorMessage(response.Message);
            $("#dvLoading").hide();
            $(".bgShadedDiv").hide();
            setTimeout($("#dvAddToGroup").hide("fast"), 1000);
            ContactIdList = [];
        },
        error: ShowAjaxError
    });
});

ValidateAddGroup = function () {

    if ($("#ui_ddlGroup").get(0).selectedIndex == 0 && $.trim($("#txtNewGroupName").val()).length == 0) {
        ShowErrorMessage("Please select group or enter new group name.");
        return false;
    }
    return true;
};


GetSelectedIds = function () {

    if (ContactIdList.length == 0) {
        $("input:checkbox:checked:not(#chkAll,#ui_chkSoundNotificationOnEveryMessage,#ui_chkSoundNotiAgentOnVisitorMesg,#ui_chkSoundNotificationOnVisitorConnect)").map(function () {
            if ($(this).val().length > 0)
                ContactIdList.push($(this).val());
        });
    }
    return ContactIdList;
};

function PushAddToContact(ContactId) {
    $(".bgShadedDiv").show();
    ContactIdList = [];
    ContactIdList.push(ContactId);
    $("#dvAddToGroup").show("fast");
    $("#ui_ddlGroup").val(0);
    $("#txtNewGroupName").val('');
}

AddToGroup = function (action) {

    if (action == 1) {
        $(".bgShadedDiv").show();
        $("#dvAddToGroup").show("fast");
    }
    else if (action == 0) {
        $("#dvAddToGroup").hide("fast");
        $(".bgShadedDiv").hide();
    }
    ContactIdList = [];
    $("#ui_ddlGroup").val(0);
    $("#txtNewGroupName").val('');
};


function HideRemoveGroup() {

    $(".bgShadedDiv").hide();
    $("#dvRemoveFromGroup").hide("fast");
}

function RemoveGroup() {
    $(".bgShadedDiv").show();
    $("#dvRemoveFromGroup").show("fast");
}

$("#btnRemoveFromGroup").click(function () {

    if ($("#ui_ddlRemoveGroup").get(0).selectedIndex == 0) {
        ShowErrorMessage("Please select group");
        return false;
    }

    ContactIdList = GetSelectedIds();

    if (ContactIdList.length == 0) {
        ShowErrorMessage("Please select at least one contact to add.");
        $("#dvLoading").hide();
        return;
    }


    $("#dvLoading").show();
    var GroupId = $("#ui_ddlRemoveGroup").val();

    $.ajax({
        url: "../Sms/Contacts/RemoveFromGroup",
        type: 'POST',
        data: JSON.stringify({
            'contact': ContactIdList, 'GroupId': GroupId
        }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response) {
                ShowErrorMessage("Contacts removed successfully.");
            }
            $(".bgShadedDiv").hide();
            $("#dvRemoveFromGroup").hide("fast");
            $("#dvLoading").hide();
            ContactIdList = [];
        },
        error: ShowAjaxError
    });
});