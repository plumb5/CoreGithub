var TotalRowCount = 0, CurrentRowCount = 0;
var UserGroupIdForDelete = 0;
var IsLoadingShow = { IsAccount: false, IsRole: false };
var userGroupUtil = {
    Initialize: function () {
        userGroupUtil.GetAccounts();
        userGroupUtil.GetRoles();
    },
    GetAccounts: function () {
        $.ajax({
            url: "/ManageUsers/Groups/GetAccounts",
            type: 'Post',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                IsLoadingShow.IsAccount = true;
                if (response != undefined && response != null && response.length > 0) {
                    $.each(response, function () {
                        let htmlContent = `<tr>
                                               <td>${$(this)[0].AccountName}</td>
                                                <td>
                                                    <div class="checkcenter">
                                                        <div class="custom-control custom-checkbox">
                                                            <input type="checkbox" class="custom-control-input" id="acc_${$(this)[0].AccountId}" name="ui_account" value="${$(this)[0].AccountId}">
                                                            <label class="custom-control-label" for="acc_${$(this)[0].AccountId}"></label>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                          `;
                        $("#ui_SelectAccountData").append(htmlContent);
                    });
                } else {
                    SetNoRecordContent('ui_tbSelectAccount', 2, 'ui_SelectAccountData');
                }
            },
            error: ShowAjaxError
        });
    },
    GetRoles: function () {
        $.ajax({
            url: "/ManageUsers/Groups/GetPermissionsList",
            type: 'Post',
            data: JSON.stringify({ 'OffSet': 0, 'FetchNext': -1 }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                IsLoadingShow.IsRole = true;
                if (response != undefined && response != null && response.length > 0) {
                    $.each(response, function () {
                        let htmlContent = `<tr>
                                               <td>${$(this)[0].Name}</td>
                                                <td>
                                                    <div class="checkcenter">
                                                        <div class="custom-control custom-checkbox">
                                                            <input type="checkbox" class="custom-control-input" id="role_${$(this)[0].Id}" name="ui_Roles" value="${$(this)[0].Id}">
                                                            <label class="custom-control-label" for="role_${$(this)[0].Id}"></label>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                          `;
                        $("#ui_tbodyRoleData").append(htmlContent);
                    });
                } else {
                    SetNoRecordContent('ui_tbRole', 2, 'ui_tbodyRoleData');
                }
            },
            error: ShowAjaxError
        });
    },
    GetGroupMaxCount: function () {
        let GroupName = CleanText($.trim($("#ui_SearchByGroupName").val()));
        $.ajax({
            url: "/ManageUsers/Groups/GetMaxCount",
            type: 'Post',
            data: JSON.stringify({ 'UserGroupName': GroupName }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                TotalRowCount = 0;
                if (response != undefined && response != null) {
                    TotalRowCount = response;
                }

                if (TotalRowCount > 0) {
                    userGroupUtil.GetGroupDetails();
                }
                else {
                    SetNoRecordContent('ui_tbGroupDetails', 3, 'ui_tdbodyGroupData');
                    HidePageLoading();
                }
            },
            error: ShowAjaxError
        });
    },
    GetGroupDetails: function () {
        let GroupName = CleanText($.trim($("#ui_SearchByGroupName").val()));
        FetchNext = GetNumberOfRecordsPerPage();
        $.ajax({
            url: "/ManageUsers/Groups/GetUserGroupList",
            type: 'Post',
            data: JSON.stringify({ 'UserGroupName': GroupName, 'Offset': OffSet, 'FetchNext': FetchNext }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                SetNoRecordContent('ui_tbGroupDetails', 3, 'ui_tdbodyGroupData');
                if (response != undefined && response != null && response.length > 0) {
                    CurrentRowCount = response.length;
                    PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);
                    $("#ui_tdbodyGroupData").html('');
                    $("#ui_tbGroupDetails").removeClass('no-data-records');
                    ShowPagingDiv(true);

                    $.each(response, function () {
                        userGroupUtil.BindGroupDetails(this);
                    });

                } else {
                    ShowPagingDiv(false);
                }
                HidePageLoading();
                CheckAccessPermission("ManageUsers");
            },
            error: ShowAjaxError
        });
    },
    BindGroupDetails: function (GroupDetails) {
        let Date = GroupDetails.CreatedDate != null ? $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(GroupDetails.CreatedDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(GroupDetails.CreatedDate)) : "NA";
        let htmlContent = `<tr>
                                <td>
                                    <div class="groupnamewrap">
                                        <div class="nameTxtWrap">
                                        <a href="/ManageUsers/Users?GroupId=${GroupDetails.Id}&GroupName=${GroupDetails.Name}">${GroupDetails.Name}</a>
                                           </div>
                                        <div class="tdcreatedraft">
                                            <div class="dropdown">
                                                <button type="button" class="verticnwrp" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="icon ion-android-more-vertical mr-0"></i></button>
                                                <div class="dropdown-menu dropdown-menu-right" aria-labelledby="filterbycontacts">
                                                    <a data-grouptype="groupedit" class="dropdown-item ContributePermission" href="javascript:void(0)" onclick="userGroupUtil.EditUserGroups(${GroupDetails.Id})">Edit</a>
                                                    <a class="dropdown-item" href="/ManageUsers/Users?GroupId=${GroupDetails.Id}&GroupName=${GroupDetails.Name}">View Users</a>
                                                    <a  class="dropdown-item ContributePermission" href="javascript:void(0)" onclick="CopyGroupId(${GroupDetails.Id})">Copy Group Id</a>
                                                    <div class="dropdown-divider"></div>
                                                    <a data-toggle="modal" data-target="#deletegroups" data-grouptype="groupDelete" class="dropdown-item FullControlPermission" href="javascript:void(0)" onclick="userGroupUtil.AssignDeleteGroup(${GroupDetails.Id});">Delete</a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td class="td-wid-10 wordbreak">${GroupDetails.UserGroupDescription}</td>
                                <td>${Date}</td>
                           </tr>`;
        $("#ui_tdbodyGroupData").append(htmlContent);
    },
    AssignDeleteGroup: function (GroupId) {
        ShowPageLoading();
        UserGroupIdForDelete = GroupId;
        HidePageLoading();
    },
    DeleteUserGroup: function (UserGroupId) {
        $.ajax({
            url: "/ManageUsers/Groups/DeleteUserGroup",
            type: 'Post',
            data: JSON.stringify({ 'UserGroupId': UserGroupId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                ShowSuccessMessage(GlobalErrorList.UserManage.UserGroupDeleteError);
                setTimeout(function () { userGroupUtil.GetGroupMaxCount(); }, 1000);
            },
            error: ShowAjaxError
        });
    },
    SerachByGroupName: function () {
        if (CleanText($.trim($("#ui_SearchByGroupName").val())).length == 0) {
            ShowErrorMessage(GlobalErrorList.UserManage.SerachByUserGroupError);
            return false;
        }
        ShowPageLoading();
        userGroupUtil.GetGroupMaxCount();
    },
    ShowCreateGroupPopUp: function (Action) {
        $(".pagetitle").html(`${Action} Group`);
        $(".settcontainer").addClass("hideDiv");
        $(".mainpaneloverlap").removeClass("hideDiv");
    },
    SaveOrUpdateGroupDetails: function () {
        if (!userGroupUtil.ValidationUserGroup()) {
            HidePageLoading();
            return false;
        }

        var userGroup = new Object();
        let UserGroupId = $("#ui_btnSaveGroupDetails").attr("UserGroupId");
        if (UserGroupId != undefined && UserGroupId != null && UserGroupId != "") {
            userGroup.Id = parseInt(UserGroupId);
        }

        userGroup.Name = CleanText($.trim($("#ui_txtUserGroupName").val()));
        userGroup.UserGroupDescription = CleanText($.trim($("#ui_txtUserdescription").val()));

        let Accounts = [];
        $.each($("input[name='ui_account']:checked"), function () {
            Accounts.push($(this).val());
        });

        let Roles = [];
        $.each($("input[name='ui_Roles']:checked"), function () {
            Roles.push($(this).val());
        });

        $.ajax({
            url: "/ManageUsers/Groups/SaveOrUpdateGroup",
            type: 'Post',
            data: JSON.stringify({ 'userGroup': userGroup, 'Accounts': Accounts, 'permissionsList': Roles }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != undefined && response != null && response.UserGroup != null) {
                    if (response.UserGroup.Id > 0) {
                        if (userGroup.Id > 0) {
                            ShowSuccessMessage(GlobalErrorList.UserManage.UserGroupUpdated);
                        } else {
                            ShowSuccessMessage(GlobalErrorList.UserManage.UserGroupSaved);
                        }
                        userGroupUtil.ShowGroupsOnceSaved();
                    } else if (response.UserGroup.Id == -1) {
                        ShowErrorMessage(GlobalErrorList.UserManage.GroupAlreadyExists);
                    }
                } else {
                    ShowErrorMessage(GlobalErrorList.UserManage.UnableToSaveGroup);
                }
                HidePageLoading();
            },
            error: ShowAjaxError
        });

    },
    ShowGroupsOnceSaved: function () {
        setTimeout(function () {
            userGroupUtil.ClearFields();
            $(".mainpaneloverlap").addClass("hideDiv");
            $(".settcontainer").removeClass("hideDiv");
            userGroupUtil.GetGroupMaxCount();
        }, 1000);
    },
    ValidationUserGroup: function () {
        if (CleanText($.trim($("#ui_txtUserGroupName").val())).length == 0) {
            ShowErrorMessage(GlobalErrorList.UserManage.UserGroupNameError);
            $("#ui_txtUserGroupName").focus();
            return false;
        }

        if (CleanText($.trim($("#ui_txtUserdescription").val())).length == 0) {
            ShowErrorMessage(GlobalErrorList.UserManage.UserGroupDescription);
            $("#ui_txtUserdescription").focus();
            return false;
        }

        let Accounts = [];
        $.each($("input[name='ui_account']:checked"), function () {
            Accounts.push($(this).val());
        });

        if (Accounts.length == 0) {
            ShowErrorMessage(GlobalErrorList.UserManage.AccountError);
            return false;
        }

        let Roles = [];
        $.each($("input[name='ui_Roles']:checked"), function () {
            Roles.push($(this).val());
        });


        if (Roles.length == 0) {
            ShowErrorMessage(GlobalErrorList.UserManage.RoleError);
            return false;
        }


        return true;
    },
    ClearFields: function () {
        $("#ui_txtUserGroupName").val("");
        $("#ui_txtUserdescription").val("");

        $.each($("input[name='ui_account']:checked"), function () {
            $(this).prop("checked", false);
        });

        $.each($("input[name='ui_Roles']:checked"), function () {
            $(this).prop("checked", false);
        });

        $("#ui_btnSaveGroupDetails").removeAttr("UserGroupId");
        $("#ui_txtUserGroupName").removeClass("disableDiv");
        $("#ui_SearchByGroupName").val("");
    },
    EditUserGroups: function (UserGroupId) {
        userGroupUtil.ShowCreateGroupPopUp("Edit");
        $("#ui_btnSaveGroupDetails").removeAttr("UserGroupId").attr("UserGroupId", UserGroupId.toString()).html("Update");
        $("#ui_txtUserGroupName").addClass("disableDiv");
        userGroupUtil.GetGroupsDetailsForEdit(UserGroupId);
    },
    GetGroupsDetailsForEdit: function (UserGroupId) {
        ShowPageLoading();
        let UserGroup = new Object();
        UserGroup.Id = UserGroupId;
        $.ajax({
            url: "/ManageUsers/Groups/GetUserGroupToEdit",
            type: 'POST',
            data: JSON.stringify({ 'userGroup': UserGroup }),
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                if (response != undefined && response != null && response.length > 0) {
                    $("#ui_txtUserGroupName").val(response[0].Name);
                    $("#ui_txtUserdescription").val(response[0].UserGroupDescription);
                    $.each(response, function () {
                        $("#role_" + $(this)[0].PermissionLevelsId).prop('checked', true);
                    });
                }
                userGroupUtil.GetAccountDetailForEdit(UserGroupId);
            },
            error: ShowAjaxError
        });
    },
    GetAccountDetailForEdit: function (UserGroupId) {
        $.ajax({
            url: "/ManageUsers/Groups/GetGroupAccountsToEdit",
            type: 'POST',
            data: JSON.stringify({ 'UserGroupId': UserGroupId }),
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                if (response != undefined && response != null && response.length > 0) {
                    $.each(response, function () {
                        $("#acc_" + $(this)[0].AccountId).prop('checked', true);
                    });
                }
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    }
};


$(document).ready(() => {
    ShowPageLoading();
    userGroupUtil.Initialize();
    userGroupUtil.GetGroupMaxCount();
    setTimeout(function () {
        if (IsLoadingShow.IsAccount && IsLoadingShow.IsRole) {
            HidePageLoading();
        }
    }, 1000);
});

function CallBackPaging() {
    ShowPageLoading();
    CurrentRowCount = 0;
    userGroupUtil.GetGroupDetails();
}

$("#deleteRowConfirm").click(function () {
    ShowPageLoading();
    userGroupUtil.DeleteUserGroup(UserGroupIdForDelete);
});

$('#ui_SearchByGroupName').keypress(function (e) {
    var key = e.which;
    if (key == 13) {
        userGroupUtil.SerachByGroupName();
        return false;
    }
});

$("#ui_SearchByGroupName").keyup(function () {
    if (CleanText($.trim($("#ui_SearchByGroupName").val())).length == 0) {
        ShowPageLoading();
        userGroupUtil.GetGroupMaxCount();
    }
});

$("#ui_SearchUserGroupName").click(function () {
    userGroupUtil.SerachByGroupName();
});

$("#ui_btnCreateGroup").click(function () {
    ShowPageLoading();
    userGroupUtil.ClearFields();
    userGroupUtil.ShowCreateGroupPopUp("Create");
    $("#ui_btnSaveGroupDetails").removeAttr("UserGroupId").html("Save");
    $("#ui_txtUserGroupName").removeClass("disableDiv");
    HidePageLoading();
});

$('.clserolewrp .fa-times,.clsepopup').click(function () {
    userGroupUtil.ClearFields();
    $(".pagetitle").html("Manage Groups");
    $(".mainpaneloverlap").addClass("hideDiv");
    $(".settcontainer").removeClass("hideDiv");
});

$("#ui_btnSaveGroupDetails").click(function () {
    ShowPageLoading();
    userGroupUtil.SaveOrUpdateGroupDetails();
});

function CopyGroupId(GroupId) {
    navigator.clipboard.writeText(GroupId);
    ShowSuccessMessage("GroupId copied successfully");
}