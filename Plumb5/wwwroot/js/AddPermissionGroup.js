
var UserGroup = { Id: 0, Name: "", UserGroupDescription: "", UserGroupId: 0 };
var OffSet = 0;
var FetchNext = 0;

$(document).ready(function () {
    $("#dvLoading").css("display", "none");
    UserGroup.Id = urlParam("Id");
    BindGroups();

});

BindGroups = function () {
    $.ajax({
        url: "/User/GetUserGroupPermissionsList",
        type: 'POST',
        data: JSON.stringify({ 'OffSet': OffSet, 'FetchNext': FetchNext }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            $.each(response, function () {
                if (UserGroup.Id != $(this)[0].Id) {
                    optlist = document.createElement('option');
                    optlist.value = $(this)[0].Id;
                    optlist.text = $(this)[0].Name;
                    document.getElementById("ui_ddlReportTo").options.add(optlist);
                }
            });
            GetGroupPermissions();
        },
        error: ShowAjaxError
    });
};

function GetGroupPermissions() {

    $.ajax({
        url: "/User/GetPermissionsList",
        type: 'Post',
        data: JSON.stringify({ 'OffSet': 0, 'FetchNext': -1 }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindGroupPermissions,
        error: ShowAjaxError
    });
}

function BindGroupPermissions(GroupPermissions) {
    if (GroupPermissions.length > 0) {
        $.each(GroupPermissions, function (i) {
            if (i % 2 == 0) {
                var dvLeftContent = "<input id='chk_" + $(this)[0].Id + "' name='ui_grp' value=" + $(this)[0].Id + " type='checkbox'  ><span style='line-height: 2.3'>" + $(this)[0].Name + " - " + $(this)[0].PermissionDescription + "</span><br>";
                $('#dvleftUserRoles').append($(dvLeftContent));
            }
            else {
                var dvRightContent = "<input id='chk_" + $(this)[0].Id + "' name='ui_grp' value=" + $(this)[0].Id + " type='checkbox'  style='margin-left:3px;' ><span style='line-height: 2.3'>" + $(this)[0].Name + " - " + $(this)[0].PermissionDescription + "</span><br>";
                $('#dvRightUserRoles').append($(dvRightContent));
            }
        });
    }
    if (UserGroup.Id > 0) {
        BindUserGroupPermissions();
    }
    BindAccount();
}


$("#btnAdd").click(function () {
    $("#dvLoading").show();

    if ($("#name").val().length == 0) {
        ShowErrorMessage("Please enter the name.");
        $("#name").focus();
        $("#dvLoading").css("display", "none");
        return;
    }
    if ($("#message").val().length == 0) {
        ShowErrorMessage("Please enter the description.");
        $("#dvLoading").css("display", "none");
        $("#message").focus();
        return;
    }
    UserGroup.Name = CleanText($("#name").val());
    UserGroup.UserGroupDescription = CleanText($("#message").val());
    UserGroup.UserGroupId = $("#ui_ddlReportTo").val();
    var PermissionsList = GetSelectedIds();
    var Accounts = [];
    $.each($("input[name='ui_account']:checked"), function () {
        Accounts.push($(this).val());
    });

    var Groups = [];
    $.each($("input[name='ui_grp']:checked"), function () {
        Groups.push($(this).val());
    });
    if (Groups.length == 0) {
        ShowErrorMessage("Choose Group Permission!");
        $("#dvLoading").css("display", "none");
        return;
    }
    if ($("#btnAdd").attr("PermissionLevelId") != undefined) {
        UserGroup.Id = $("#btnAdd").attr("PermissionLevelId");
    }
    $.ajax({
        url: "/User/SaveOrUpdateGroupPermissions",
        type: 'POST',
        data: JSON.stringify({ 'userGroup': UserGroup, 'Accounts': Accounts, 'permissionsList': Groups }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if ($("#btnAdd").attr("PermissionLevelId") != undefined) {
                ShowErrorMessage("Updated Succesfully");
                setTimeout(function () { window.location.href = "/User/UserPermissions"; }, 3000);               
            }
            else if (response != undefined && response != null && response.UserGroup.Id > 0) {
                ShowErrorMessage("Saved");
                setTimeout(function () { window.location.href = "/User/UserPermissions"; }, 3000);
            }
            else if (response != undefined && response != null && response.UserGroup.Id <= 0) {
                ShowErrorMessage("The user group already exists, please try with another");
            }
            else {
                ShowErrorMessage("Something went wrong, try after some time");
            }
            $("#dvLoading").hide();
        },
        error: ShowAjaxError
    });
});



GetSelectedIds = function () {

    var PermissionsIdList = [];

    $("input:checkbox:checked").map(function () {
        PermissionsIdList.push($(this).val());
    });

    return PermissionsIdList;
};

function BindUserGroupPermissions() {
    $("#dvLoading").show();
    $.ajax({
        url: "/User/GetUserGroupPermissionsToBind",
        type: 'POST',
        data: JSON.stringify({ 'userGroup': UserGroup }),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            if (response.length > 0) {

                $.each(response, function () {
                    $("#name").val($(this)[0].Name);
                    $("#message").val($(this)[0].UserGroupDescription);
                    $("#ui_ddlReportTo").val($(this)[0].UserGroupId);
                    $("#chk_" + $(this)[0].PermissionLevelsId).prop('checked', true);
                });
                $("#btnAdd").val("Update").attr("PermissionLevelId", UserGroup.Id);
            }
            $("#dvLoading").hide();
        },
        error: ShowAjaxError
    });
}

function BindAccount() {
    $('#dvleftdata,#dvRightdata').empty();
    $("#dvLoading").show();
    $.ajax({
        url: "/User/GetAccounts",
        type: 'POST',
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            if (response.length > 0) {
                if (UserGroup.Id > 0) {
                    $.ajax({
                        url: "/User/GetGroupAccounts",
                        type: 'POST',
                        dataType: "json",
                        data: JSON.stringify({ 'UserGroupId': UserGroup.Id }),
                        contentType: "application/json; charset=utf-8",
                        success: function (response1) {
                            if (response1.length > 0) {
                                var r = 0;
                                $.each(response, function () {
                                    var accountID = $(this)[0].AccountId;
                                    var c = 0;
                                    $.each(response1, function (i) {
                                        if (accountID == $(this)[0].AccountId) {
                                            if (r % 2 == 0) {
                                                var dvLeftContent = "<input type='checkbox' name='ui_account' checked='checked'  value=" + $(this)[0].AccountId + " /><span style='margin-top:5px;margin-right: 15px;line-height: 2'>" + $(this)[0].AccountName + "</span><br>";
                                                $('#dvleftdata').append($(dvLeftContent));
                                            }
                                            else {
                                                var dvRightContent = "<input type='checkbox' name='ui_account' checked='checked'  value=" + $(this)[0].AccountId + " /><span style='margin-top:5px;margin-right: 15px;line-height: 2'>" + $(this)[0].AccountName + "</span><br>";
                                                $('#dvRightdata').append($(dvRightContent));
                                            }
                                            c++;
                                            r++;
                                        }
                                    });
                                    if (c == 0) {
                                        if (r % 2 == 0) {
                                            var dvLeftContent = "<input type='checkbox' name='ui_account'  value=" + $(this)[0].AccountId + " /><span style='margin-top:5px;margin-right: 15px;line-height: 2'>" + $(this)[0].AccountName + "</span><br>";
                                            $('#dvleftdata').append($(dvLeftContent));
                                        }
                                        else {
                                            var dvRightContent = "<input type='checkbox' name='ui_account'  value=" + $(this)[0].AccountId + " /><span style='margin-top:5px;margin-right: 15px;line-height: 2'>" + $(this)[0].AccountName + "</span><br>";
                                            $('#dvRightdata').append($(dvRightContent));
                                        }
                                        r++;
                                    }
                                });
                            }
                            else {
                                $.each(response, function (j) {
                                    if (j % 2 == 0) {
                                        var dvLeftContent = "<input type='checkbox' name='ui_account'  value=" + $(this)[0].AccountId + " /><span style='margin-top:5px;margin-right: 15px;line-height: 2'>" + $(this)[0].AccountName + "</span><br>";
                                        $('#dvleftdata').append($(dvLeftContent));
                                    }
                                    else {
                                        var dvRightContent = "<input type='checkbox' name='ui_account'  value=" + $(this)[0].AccountId + " /><span style='margin-top:5px;margin-right: 15px;line-height: 2'>" + $(this)[0].AccountName + "</span><br>";
                                        $('#dvRightdata').append($(dvRightContent));
                                    }
                                });
                            }
                        }
                    });
                }
                else {
                    $.each(response, function (k) {
                        if (k % 2 == 0) {
                            var dvLeftContent = "<input type='checkbox' name='ui_account'  value=" + $(this)[0].AccountId + " /><span style='margin-top:5px;margin-right: 15px;line-height: 2'>" + $(this)[0].AccountName + "</span><br>";
                            $('#dvleftdata').append($(dvLeftContent));
                        }
                        else {
                            var dvRightContent = "<input type='checkbox' name='ui_account'  value=" + $(this)[0].AccountId + " /><span style='margin-top:5px;margin-right: 15px;line-height: 2'>" + $(this)[0].AccountName + "</span><br>";
                            $('#dvRightdata').append($(dvRightContent));
                        }
                    });
                }
            }
            $("#dvLoading").hide();
        },
        error: ShowAjaxError
    });
}

function BindAccountGroupWise(UserGroupId) {
    $.ajax({
        url: "/User/GetGroupAccounts",
        type: 'POST',
        dataType: "json",
        data: JSON.stringify({ 'UserGroupId': UserGroupId }),
        contentType: "application/json; charset=utf-8",
        success: function (response1) {
            if (response1.length > 0) {
            }
        }
    });
}

$("#btnUserGrpBack").click(function () {
    window.history.back();
})

