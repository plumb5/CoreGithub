var maxRowCount = 0, rowIndex = 0;
var userList = [], userIdList = [];

$(document).ready(function () {
    BindUsers();
    GetMaxCount();
});

function BindUsers() {
    $.ajax({
        url: "/User/GetUserDetailsToBind",
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response.length > 0) {
                $.each(response, function (i) {
                    userList.push($(this)[0].EmailId);
                    userIdList.push($(this)[0].UserInfoUserId);
                });
                $("#txtAddUsersToGroup").autocomplete({
                    source: userList
                });
            }
        }
    });
}

function GetMaxCount() {

    $.ajax({
        url: "/User/GetUserGroupPermissionsCount",
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            maxRowCount = response.returnVal;
            if (maxRowCount == 0) {
                $("#dvLoading, #ui_dvContent").hide();
                $("#dvDefault").show();
            }
            else if (maxRowCount > 0) {
                $("#dvDefault").hide();
                CreateTable(maxRowCount);
            }
        }
    });
}

function CreateTable(numberRowsCount) {

    var OffSet = rowIndex;
    var FetchNext = numberRowsCount;

    $.ajax({
        url: "/User/GetUserGroupPermissionsList",
        type: 'Post',
        data: JSON.stringify({ 'OffSet': OffSet, 'FetchNext': FetchNext }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindUserGroupPermissions
    });
}

function BindUserGroupPermissions(UserGroupPermissions) {

    rowIndex = UserGroupPermissions.length + rowIndex;
    if (UserGroupPermissions.length > 0) {
        $("#ui_dvContent").show();


        if (location.href.toLowerCase().indexOf("userpermissions") == -1) {
            tdContent = "";
            $.each(UserGroupPermissions, function () {
                tdContent = "<div class='itemStyle' style='padding: 10px 5px;height:25px;'><div style='float: left; width: 5%;margin-top: -6px;'><img src='../images/p-groups.png' /></div><div style='float: left; width: 23%; text-align: left; cursor:pointer;padding-left:10px;'  onclick='showusers(" + $(this)[0].Id + ")'>" + $(this)[0].Name + "</div>";
                tdContent += "<div style='float: right; width: 70%; text-align: right;'>" + $(this)[0].UserGroupDescription + "</div></div>";

                $('#ui_dvData').append(tdContent);
            });
        }
        else {
            $.each(UserGroupPermissions, function () {

                tdContent = "<div style='float: left; width: 25%; text-align: left; cursor:pointer'  onclick='showusers(" + $(this)[0].Id + ")'>" + $(this)[0].Name + "</div>";
                tdContent += "<div style='float: left; width: 35%; text-align: left;'>" + $(this)[0].UserGroupDescription + "</div>";


                tdContent += "<div style='float: left; width: 20%; text-align: left;'><a class='ContributePermission' href='javascript:void()' onclick='AddUsers(" + $(this)[0].Id + ")'>Add</a> &nbsp;| &nbsp;<a href='javascript:void()'  onclick='showusers(" + $(this)[0].Id + ")'>Show</a></div>";
                tdContent += "<div style='float: left; width: 10%; text-align: left;'><a class='ContributePermission' href='/User/AddPermissionGroup?Id=" + $(this)[0].Id + "'>Edit</a></div>";
                tdContent += "<div style='float: right; width: 10%;text-align: right;'><a class='FullControlPermission' onclick='DeleteFieldWithConform(" + $(this)[0].Id + ");'><img src='/images/img_trans.gif' border='0' class='DeleteImg' alt='Delete' title='Delete' style='cursor:pointer'/></a></div>";
                tdContent = "<div id='ui_div_" + $(this)[0].Id + "' class='itemStyle'>" + tdContent + "</div>";

                $('#ui_dvData').append(tdContent);
            });
        }
    }
    CheckAccessPermission("User");
    $("#dvLoading").hide();
}

function showusers(Id) {
    $(".CustomPopUp").hide();
    $(".bgShadedDiv").show();
    $.ajax({
        url: "/User/GetGroupUsers",
        type: 'POST',
        data: JSON.stringify({ 'Id': Id }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            var data = "";
            if (response.length > 0) {
                $.each(response, function () {
                    data += "<div class='itemStyle' id='grp" + $(this)[0].UserId + "' style='padding:8px;'><div style='float: left; width: 25%; margin-top: -16px;  text-align: left;'>" + $(this)[0].FirstName + "</div>";
                    data += "<div style='float: left; width: 55%; text-align: left; margin-top: -16px;' >" + $(this)[0].EmailId + "</div>";
                    data += "<div style='float: left; text-align: left; width:20%; margin-top: -16px;' ><img class='FullControlPermission' src='/images/removegrp.png' title='Remove from Group' style='cursor:pointer; ' onclick='removegroup(" + Id + "," + $(this)[0].UserId + ")' /></div></div> ";
                });
                $("#dv_users").html(data);
            }
            else {
                $("#dv_users").html("<div class='itemStyle' style='padding:8px;'><div style='float: left; width: 35%; text-align: left; margin-top: -16px;' >No Users Found</div></div>");
            }
            $("#divmsgs").show("fast");
            $("#dvLoading").hide();
        }
    });
    setTimeout(function () { CheckAccessPermission("User"); }, 1000);
}

function AddUsers(Id) {
    $(".CustomPopUp").hide();
    $(".bgShadedDiv").show();
    $("#dvAddUsersToGroup").show("fast");
    $("#btn_AddUsersToGroup").attr("GroupId", Id);
    $("#txtAddUsersToGroup").val("");
    $("#txtSubject").val("");
    $("#txtPersonalMessage").val("");
    $("#chk_SendMail").prop("checked", false);
}

DeleteFieldWithConform = function (Id) {
    $("#dialog-confirm").dialog({
        resizable: false,
        height: 170,
        modal: true,
        buttons: {
            "Delete": function () {
                ConfirmedDelete(Id);
                $(this).dialog("close");
            },
            "Cancel": function () {
                $(this).dialog("close");
            }
        }
    });
};

ConfirmedDelete = function (Id) {

    $("#dvDeletePanel").hide();
    $.ajax({
        url: "/User/DeleteUserGroupPermissions",
        type: 'POST',
        data: JSON.stringify({ 'Id': Id }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response) {
                --rowIndex;
                --maxRowCount;
                $("#ui_div_" + Id).hide("slow");
                if (rowIndex <= 0 || maxRowCount <= 0) {
                    $("#dvLoading, #ui_dvContent").hide();
                }
            }
            $("#dvLoading").hide();
        }
    });
};

function hideit() {
    $(".CustomPopUp").hide();
    $(".bgShadedDiv").hide();
    $("#divmsgs").hide("fast");
    $("#dvAddUsersToGroup").hide("fast");
}
function showdivs() {
    $("#divmsgs").show("fast");
}

$("#btnCancel").click(function () {
    $(".CustomPopUp").hide();
    $(".bgShadedDiv").hide();
    $("#dvAddUsersToGroup").hide("fast");
    $("#btn_AddUsersToGroup").removeAttr("GroupId");
})

$("#btnUserGrpBack").click(function () {
    window.history.back();
})

$("#btn_AddUsersToGroup").click(function () {

    var UserIds = [];
    var Emails = [];

    if (!Validate())
        return;

    if ($("#btn_AddUsersToGroup").attr("GroupId") != undefined)
        var usergroupid = $("#btn_AddUsersToGroup").attr("GroupId");

    var usergroupid = $("#btn_AddUsersToGroup").attr("GroupId");

    var index = userList.indexOf($("#txtAddUsersToGroup").val());
    if (index > -1)
        UserIds.push(userIdList[index]);

    Emails.push($("#txtAddUsersToGroup").val());

    $.ajax({
        url: "/User/AddMemberstoGroup",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ 'usergroupid': usergroupid, 'userid': UserIds, 'subject': $("#txtSubject").val(), 'body': $("#txtPersonalMessage").val(), 'Emails': Emails }),
        success: function (data) {
            ShowErrorMessage("User successfully added to the group!");
            $("#dvAddUsersToGroup,.bgShadedDiv").hide(1000);
            $("#btn_AddUsersToGroup").removeAttr("GroupId");
        },
        error: ShowAjaxError
    })
})


function Validate() {

    if (regExpEmail.test($("#txtAddUsersToGroup").val())) {
        if (userList.indexOf($("#txtAddUsersToGroup").val()) < 0) {
            ShowErrorMessage("Please enter correct Email ID");
            return false;
        }
    }
    else {
        ShowErrorMessage("Please enter correct Email ID");
        return false;
    }

    if ($('#chk_SendMail').is(':checked')) {
        if ($("#txtSubject").val() == "") {
            ShowErrorMessage("Enter Subject");
            $("#txtSubject").focus();
            return false;
        }
        if ($("#txtPersonalMessage").val() == "") {
            ShowErrorMessage("Enter Mail Body");
            $("#txtPersonalMessage").focus();
            return false;
        }
    }

    return true;
}


function removegroup(usergroupid, userid) {
    $.ajax({
        url: "/User/RemovefromGroup",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: "{usergroupid:" + usergroupid + ",userid:" + userid + "}",
        success: function (data) {
            $("#grp" + userid).remove();
            ShowErrorMessage("User successfully removed from group!");
            var htmlcontent = $.trim($("#dv_users").html());
            if (htmlcontent == "") {
                $("#dv_users").html("<div class='itemStyle' style='padding:8px;'><div style='float: left; width: 35%; text-align: left; margin-top: -16px;' >No Groups Found</div></div>");
            }
        },
        error: function (objxmlRequest) {

        }

    })
}

$('#chk_SendMail').click(function () {

    if ($('#chk_SendMail').is(':checked')) {
        $("#txtMailDetails").show();
        $('#dvAddUsersToGroup').css("height", "+=103px");
    }
    else {
        $("#txtMailDetails").hide();
        $('#dvAddUsersToGroup').height($("#dvAddUsersToGroup").height() - 103);
    }
});