var PermissionRoles = [];
var TotalRowCount = 0, CurrentRowCount = 0;
var UserHierarchyId = 0;
var UserInfoUserIdForDelete = 0;
var IsAddOrRemove = 0;
var IsLoadingHide = {
    IsRole: false, IsUserGroup: false, IsAccount: false
};

var UserDetailsWithPermissions = { UserInfoUserId: 0, SeniorUserId: 0, FirstName: "", LastName: "", EmailId: "", Senior: "", IsAdmin: false, ActiveStatus: false, PermissionLevelsId: 0, RegistrationDate: null }
var UserGroupId = 0;
var GroupName = '';

var userManageUtil = {
    Initialize: function () {
        userManageUtil.GetRoles();
    },
    GetRoles: function () {
        $.ajax({
            url: "/ManageUsers/Users/GetRoles",
            type: 'Post',
            data: JSON.stringify({}),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                IsLoadingHide.IsRole = true;
                if (response != undefined && response != null && response.length > 0) {
                    PermissionRoles = response;
                    $.each(response, function () {
                        $("#ui_selRoles").append(`<option value="${$(this)[0].Id}">${$(this)[0].Name}</option>`);
                        $("#ui_ddlRoles").append(`<option value="${$(this)[0].Id}">${$(this)[0].Name}</option>`);
                    });
                }
                userManageUtil.GetUserGroups();
            },
            error: ShowAjaxError
        });
    },
    GetUserGroups: function () {
        $.ajax({
            url: "/ManageUsers/Users/GetUserGroups",
            type: 'Post',
            data: JSON.stringify({}),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                IsLoadingHide.IsUserGroup = true;
                if (response != undefined && response != null && response.length > 0) {
                    $.each(response, function () {
                        $("#addgroupoperation").append(`<option value="${$(this)[0].Id}">${$(this)[0].Name}</option>`);
                        $("#ui_ddlGroups").append(`<option value="${$(this)[0].Id}">${$(this)[0].Name}</option>`);
                    });
                }
                userManageUtil.GetAccounts();
            },
            error: ShowAjaxError
        });
    },
    GetAccounts: function () {
        $.ajax({
            url: "/ManageUsers/Users/GetAccounts",
            type: 'Post',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                IsLoadingHide.IsAccount = true;
                if (response != undefined && response != null && response.length > 0) {
                    $.each(response, function () {
                        $("#ui_ddlAccount").append(`<option value="${$(this)[0].AccountId}">${$(this)[0].AccountName}</option>`);
                    });
                }
            },
            error: ShowAjaxError
        });
    },
    //GetUserMaxCount: function () {
    //    let EmailId = CleanText($.trim($("#ui_SerachByEmailId").val()));
    //    $.ajax({
    //        url: "/ManageUsers/Users/GetUserMaxCount",
    //        type: 'Post',
    //        data: JSON.stringify({
    //            'EmailId': EmailId, 'UserGroupId': UserGroupId
    //        }),
    //        contentType: "application/json; charset=utf-8",
    //        dataType: "json",
    //        success: function (response) {
    //            TotalRowCount = 0;
    //            if (response != undefined && response != null) {
    //                TotalRowCount = response;
    //            }

    //            if (TotalRowCount > 0) {
    //                userManageUtil.GetUserDetails();
    //            }
    //            else {
    //                SetNoRecordContent('ui_tbUserDetails', 5, 'ui_tdbodyUserData');
    //                HidePageLoading();
    //            }
    //        },
    //        error: ShowAjaxError
    //    });
    //},
    GetUserDetails: function () {
        UserDetailsWithPermissions.EmailId = CleanText($.trim($("#ui_SerachByEmailId").val()));
        UserDetailsWithPermissions.ActiveStatus = $("#ui_ddlStatus").val() == 'true' ? true : $("#ui_ddlStatus").val() == 'false' ? false : null;
        
        UserDetailsWithPermissions.PermissionLevelsId = parseInt($("#ui_ddlRoles").val());
        UserDetailsWithPermissions.SeniorUserId = parseInt($("#ui_ddlReportTo").val());
        //FetchNext = GetNumberOfRecordsPerPage();
        $.ajax({
            url: "/ManageUsers/Users/GetUserDetails",
            type: 'Post',
            data: JSON.stringify({ 'UserGroupId': UserGroupId, 'userDetailsWithPermissions': UserDetailsWithPermissions }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                SetNoRecordContent('ui_tbUserDetails', 5, 'ui_tdbodyUserData');
                if (response != undefined && response != null && response.length > 0) {
                    //CurrentRowCount = response.length;
                    //PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount)
                    $("#ui_tdbodyUserData").html('');
                    $("#ui_tbUserDetails").removeClass('no-data-records');
                    //ShowPagingDiv(true);

                    $.each(response, function () {
                        userManageUtil.BindUserDetails(this);
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
    BindUserDetails: function (UserDetails) {

        var RoleName = "NA";

        if (UserDetails.PermissionLevelsId > 0) {
            if (PermissionRoles != null && PermissionRoles.length > 0) {
                var sample = JSLINQ(PermissionRoles).Where(function () {
                    return (this.Id == UserDetails.PermissionLevelsId);
                });

                if (sample.items[0] != null && sample.items[0] != "" && sample.items[0] != undefined) {
                    RoleName = sample.items[0].Name;
                }
            }
        }

        let status = UserDetails.ActiveStatus == true ? { Class: "text-color-success", Status: "Active" } : { Class: "text-color-error", Status: "In-Active" };
        var date = $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(UserDetails.RegistrationDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(UserDetails.RegistrationDate));

        let htmlContent = `<tr>
                                <td>
                                    <div class="custom-control custom-checkbox">
                                        <input type="checkbox" class="custom-control-input selChk" id="check_${UserDetails.UserInfoUserId}" value="${UserDetails.UserInfoUserId}">
                                        <label class="custom-control-label" for="check_${UserDetails.UserInfoUserId}"></label>
                                    </div>
                                </td>
                                <td>
                                    <div class="groupnamewrap">
                                        <div class="nameTxtWrap" id="ui_divFirstName_${UserDetails.UserInfoUserId}">
                                            ${UserDetails.FirstName} ${UserDetails.LastName}
                                        </div>
                                        <div class="tdcreatedraft">
                                            <div class="dropdown">
                                                <button type="button" class="verticnwrp" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="icon ion-android-more-vertical mr-0"></i></button>
                                                <div class="dropdown-menu dropdown-menu-right" aria-labelledby="filterbycontacts">
                                                    <a data-grouptype="groupedit" class="dropdown-item ContributePermission" href="javascript:void(0);" onclick="userManageUtil.ShowUserPopUpForEdit(${UserDetails.UserInfoUserId})">Edit</a>
                                                    <a class="dropdown-item ContributePermission" href="javascript:void(0);" onclick="ShowUserPopUpForPasswordChange(${UserDetails.UserInfoUserId})">Change Password</a>
                                                    <a class="dropdown-item ContributePermission" href="javascript:void(0);" onclick="userManageUtil.ShowUserPopUpForGroups(${UserDetails.UserInfoUserId})">Show Groups</a>
                                                    <a class="dropdown-item ContributePermission" href="javascript:void(0);" onclick="userManageUtil.CopyUserId(${UserDetails.UserInfoUserId})">Copy UserId</a>
                                                    <div class="dropdown-divider"></div>
                                                    <a data-toggle="modal" data-target="#deletegroups" data-grouptype="groupDelete" class="dropdown-item FullControlPermission" href="javascript:void(0)" onclick="userManageUtil.AssignDeleteUser(${UserDetails.UserInfoUserId})">Delete</a>
                                                    <div class="dropdown-divider"></div>
                                                    <a data-grouptype="groupedit" class="dropdown-item ContributePermission" href="javascript:void(0)" onclick="userManageUtil.ChangeStatus(${UserDetails.UserInfoUserId})">Change Status</a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td class="td-wid-10 wordbreak" id="ui_divEmailId_${UserDetails.c}">${UserDetails.EmailId}</td>
                                <td class="${status.Class}" id="ui_divStatus_${UserDetails.UserInfoUserId}" status="${UserDetails.ActiveStatus}">${status.Status}</td>
                                <td id="ui_tdRole_${UserDetails.UserInfoUserId}">${RoleName}</td>
                                <td id="ui_tdReport_${UserDetails.UserInfoUserId}">${UserDetails.Senior}</td>
                                <td id="ui_tdRegisteredDate_${UserDetails.UserInfoUserId}">${date}</td>
                            </tr>`;
        $("#ui_tdbodyUserData").append(htmlContent);
    },
    SerachByEmailId: function () {
        if (CleanText($.trim($("#ui_SerachByEmailId").val())).length == 0) {
            ShowErrorMessage(GlobalErrorList.UserManage.SerachByEmaildError);
            return false;
        }
        ShowPageLoading();
        userManageUtil.GetUserDetails();
    },
    SaveUserDetails: function () {
        ShowPageLoading();
        if (!userManageUtil.ValidationUserDetails()) {
            HidePageLoading();
            return false;
        }

        let userInfo = new Object();
        userInfo.FirstName = CleanText($.trim($("#ui_FirstName").val()));
        userInfo.LastName = CleanText($.trim($("#ui_LastName").val()));
        userInfo.EmailId = CleanText($.trim($("#ui_UserEmailId").val()));
        userInfo.MobilePhone = CleanText($.trim($("#ui_MobileNumber").val()));
        userInfo.IsAdmin = false;
        userInfo.ActiveStatus = false;

        let userHierarchy = new Object();
        userHierarchy.PermissionLevelsId = parseInt($("#ui_selRoles").val());
        userHierarchy.SeniorUserId = parseInt($("#ui_ddlAllUsers").val());

        let AccountIds = $("#ui_ddlAccount").val();
        let GroupIds = $("#ui_ddlGroups").val();

        $.ajax({
            url: "/ManageUsers/Users/SaveUserDetails",
            type: 'Post',
            data: JSON.stringify({ 'userInfoData': userInfo, 'userHierarchyData': userHierarchy, 'AccountIds': AccountIds, 'GroupIds': GroupIds }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response > 0) {
                    $("#ui_SerachByEmailId").val("");
                    ShowSuccessMessage(GlobalErrorList.UserManage.SaveUserDetailsSuccess);
                    userManageUtil.ClearAndHideUserCreatePopUp();
                    setTimeout(function () { userManageUtil.GetUserDetails(); }, 1000);
                }
                else if (response = -1) {
                    ShowErrorMessage(GlobalErrorList.UserManage.AlreadyExistsError);
                }
                else {
                    ShowErrorMessage(GlobalErrorList.UserManage.SaveUserDetailsError);
                }
                HidePageLoading();
            },
            error: ShowAjaxError
        });

    },
    ValidationUserDetails: function () {
        if (CleanText($.trim($("#ui_FirstName").val())) == 0) {
            ShowErrorMessage(GlobalErrorList.UserManage.FirstNameError);
            $("#ui_FirstName").focus();
            return false;
        }

        if (CleanText($.trim($("#ui_LastName").val())) == 0) {
            ShowErrorMessage(GlobalErrorList.UserManage.LastNameError);
            $("#ui_LastName").focus();
            return false;
        }

        if (CleanText($.trim($("#ui_UserEmailId").val())) == 0) {
            ShowErrorMessage(GlobalErrorList.UserManage.UserEmailIdError);
            $("#ui_UserEmailId").focus();
            return false;
        }

        if (!regExpEmail.test(CleanText($.trim($("#ui_UserEmailId").val())))) {
            ShowErrorMessage(GlobalErrorList.UserManage.UserEmailIdError);
            $("#ui_UserEmailId").focus();
            return false;
        }

        if (CleanText($.trim($("#ui_MobileNumber").val())) == 0) {
            ShowErrorMessage(GlobalErrorList.UserManage.UserMobileError);
            $("#ui_MobileNumber").focus();
            return false;
        }

        if ($("#ui_ddlAllUsers").val() == 0) {
            ShowErrorMessage(GlobalErrorList.UserManage.SelectReporttoError);
            $("#ui_ddlAllUsers").focus();
            return false;
        }

        if ($("#ui_selRoles").val() == 0) {
            ShowErrorMessage(GlobalErrorList.UserManage.SelectUserRoleError);
            $("#ui_selRoles").focus();
            return false;
        }

        return true;
    },
    ClearAndHideUserCreatePopUp: function () {
        $(".popupcontainer").addClass('hideDiv');
        $("#ui_FirstName").val('');
        $("#ui_LastName").val('');
        $("#ui_UserEmailId").val('');
        $("#ui_MobileNumber").val('');
        $("#ui_selRoles").val('0').trigger("change");
        $("#ui_ddlAllUsers").val("0").trigger("change");
        $("#ui_ddlAccount").val("0").trigger("change");
        $("#ui_ddlGroups").val("0").trigger("change");
    },
    ShowUserPopUpForEdit: function (UserId) {
        if (UserId > 0) {
            $('#ui_ddlAllUsers option:not(:first)').remove();
            $("#ui_UserEmailId").attr("disabled", true);
            $("#dvedituser").removeClass('hideDiv');
            $("#dv_groups").hide();
            ShowPageLoading();
            $("#ui_btnSaveOrUpdate").html("Update").attr("onclick", `userManageUtil.UpdateUserDetails(${UserId})`);

            $.ajax({
                url: "/ManageUsers/Users/GetUserDetail",
                type: 'Post',
                data: JSON.stringify({ 'UserId': UserId }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) {
                    if (response != undefined && response != null && response.userInfo != null) {
                        if (response.ReportingUserInfo != null && response.ReportingUserInfo.length > 0) {
                            $.each(response.ReportingUserInfo, function () {
                                $("#ui_ddlAllUsers").append(`<option value="${$(this)[0].UserId}">${$(this)[0].FirstName}</option>`);
                            });
                        }
                        userManageUtil.AssignUserDetails(response.userInfo, response.userPermission, response.userHierarchy, response.myUserAccounts);
                    }
                    HidePageLoading();
                },
                error: ShowAjaxError
            });
        } else {
            ShowErrorMessage(GlobalErrorList.UserManage.NoUserIdFound);
        }
    },
    UpdateUserDetails: function (userId) {
        ShowPageLoading();
        if (!userManageUtil.ValidationUserDetails()) {
            HidePageLoading();
            return false;
        }

        let userInfo = new Object();
        userInfo.UserId = userId;
        userInfo.FirstName = CleanText($.trim($("#ui_FirstName").val()));
        userInfo.LastName = CleanText($.trim($("#ui_LastName").val()));
        userInfo.EmailId = CleanText($.trim($("#ui_UserEmailId").val()));
        userInfo.MobilePhone = CleanText($.trim($("#ui_MobileNumber").val()));
        userInfo.ActiveStatus = false;

        let userHierarchy = new Object();
        userHierarchy.Id = parseInt(UserHierarchyId);
        userHierarchy.PermissionLevelsId = parseInt($("#ui_selRoles").val());
        userHierarchy.SeniorUserId = parseInt($("#ui_ddlAllUsers").val());

        let AccountIds = $("#ui_ddlAccount").val();
        let GroupIds = null;

        $.ajax({
            url: "/ManageUsers/Users/UpdateUserDetails",
            type: 'Post',
            data: JSON.stringify({ 'userInfoData': userInfo, 'userHierarchyData': userHierarchy, 'AccountIds': AccountIds, 'GroupIds': GroupIds }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response > 0) {
                    $("#ui_SerachByEmailId").val("");
                    ShowSuccessMessage(GlobalErrorList.UserManage.SaveUserDetailsSuccess);
                    userManageUtil.ClearAndHideUserCreatePopUp();
                    //userManageUtil.BindUpdatedUserDetails(userInfo, userHierarchy);
                    userManageUtil.GetUserDetails();
                }
                else {
                    ShowErrorMessage(GlobalErrorList.UserManage.SaveUserDetailsError);
                }
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },
    AssignUserDetails: function (userDetails, userPermission, userHierarchy, myUserAccounts) {
        let UserAccounts = [];
        if (myUserAccounts != null && myUserAccounts.length > 0) {
            for (let i = 0; i < myUserAccounts.length; i++) {
                UserAccounts.push(myUserAccounts[i].AccountId);
            }
        }
        UserHierarchyId = userHierarchy.Id;
        $("#ui_FirstName").val(userDetails.FirstName);
        $("#ui_LastName").val(userDetails.LastName);
        $("#ui_UserEmailId").val(userDetails.EmailId);
        $("#ui_MobileNumber").val(userDetails.MobilePhone);
        $("#ui_selRoles").val(userPermission.Id).trigger("change");
        $("#ui_ddlAllUsers").val(userHierarchy.SeniorUserId).trigger("change");
        $("#ui_ddlAccount").val(UserAccounts).trigger("change");
        //$(".popupcontainer").removeClass('hideDiv');
        $("#dvedituser .popuptitle h6").html('EDIT USER');
        $("#dvedituser").removeClass('hideDiv');
    },
    BindUpdatedUserDetails: function (userDetails, userHierarchy) {
        $("#ui_divFirstName_" + userDetails.UserId).html(`${userDetails.FirstName} ${userDetails.LastName}`);
        $("#ui_divEmailId_" + userDetails.UserId).html(`${userDetails.EmailId}`);

        for (let i = 0; i < PermissionRoles.length; i++) {
            if (userHierarchy.PermissionLevelsId == PermissionRoles[i].Id) {
                $("#ui_tdRole_" + userDetails.UserId).html(`${PermissionRoles[i].Name}`);
                break;
            }
        }
    },
    AssignDeleteUser: function (UserId) {
        ShowPageLoading();
        UserInfoUserIdForDelete = UserId;
        $.ajax({
            url: "/ManageUsers/Users/GetUserDetail",
            type: 'Post',
            data: JSON.stringify({ 'UserId': UserId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != undefined && response != null && response.userPermission != null) {
                    if (response.userPermission.LeadManagement || response.userPermission.LeadManagementContribute || response.userPermission.LeadManagementDesign || response.userPermission.LeadManagementGuest || response.userPermission.LeadManagementHasFullControl || response.userPermission.LeadManagementView) {
                        $("#ui_deletemsg").html("This action can't be undone. The leads are will be deleted related to this user, You can assign to others or else delete");
                    } else {
                        $("#ui_deletemsg").html("This action can't be undone. Are you sure that you want to permanently delete this row?");
                    }
                } else {
                    $("#ui_deletemsg").html("This action can't be undone. Are you sure that you want to permanently delete this row?");
                }
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },
    DeleteByUserId: function () {
        ShowPageLoading();
        $.ajax({
            url: "/ManageUsers/Users/DeleteUserDetails",
            type: 'Post',
            data: JSON.stringify({ 'UserId': UserInfoUserIdForDelete }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                $("#ui_SerachByEmailId").val("");
                ShowSuccessMessage(GlobalErrorList.UserManage.DeleteUserError);
                setTimeout(function () { userManageUtil.GetUserDetails(); }, 1000);
            },
            error: ShowAjaxError
        });
    },
    ChangeStatus: function (UserId) {
        ShowPageLoading();
        var ActiveStatus = $("#ui_divStatus_" + UserId).attr("status") == "true" ? false : true;
        $.ajax({
            url: "/ManageUsers/Users/ChangeStatus",
            type: 'Post',
            data: JSON.stringify({ 'Id': UserId, 'Isactive': ActiveStatus }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                let status = ActiveStatus == true ? { Class: "text-color-success", Status: "Active" } : { Class: "text-color-error", Status: "In-Active" };
                $("#ui_divStatus_" + UserId).removeAttr("status").attr("status", ActiveStatus.toString());
                $("#ui_divStatus_" + UserId).removeAttr("class").addClass(status.Class).html(status.Status);
                ShowSuccessMessage(GlobalErrorList.UserManage.ActiveStatusSuccess);
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },
    AddToGroup: function () {
        let GroupIds = $("#addgroupoperation").val();

        let chkArrayUserId = new Array();
        $(".selChk:checked").each(function () {
            chkArrayUserId.push(parseInt($(this).val()));
        });

        if (GroupIds != null && chkArrayUserId.length > 0) {
            $.ajax({
                url: "/ManageUsers/Users/AddToGroup",
                type: 'Post',
                data: JSON.stringify({ 'UserIds': chkArrayUserId, 'GroupIds': GroupIds }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) {
                    if (response != undefined && response != null) {
                        ShowSuccessMessage(GlobalErrorList.UserManage.AddedToGroup);
                        userManageUtil.ClearSelectedGroups();
                    } else {
                        ShowErrorMessage(GlobalErrorList.UserManage.UnableToAddGroup);
                    }
                    HidePageLoading();
                },
                error: ShowAjaxError
            });
        } else {
            ShowErrorMessage(GlobalErrorList.UserManage.AddOrRemoveGroupError);
            HidePageLoading();
        }
    },
    RemoveFromGroup: function () {
        let GroupIds = $("#addgroupoperation").val();

        let chkArrayUserId = new Array();
        $(".selChk:checked").each(function () {
            chkArrayUserId.push(parseInt($(this).val()));
        });

        if (GroupIds != null && chkArrayUserId.length > 0) {
            $.ajax({
                url: "/ManageUsers/Users/RemoveFromGroup",
                type: 'Post',
                data: JSON.stringify({ 'UserIds': chkArrayUserId, 'GroupIds': GroupIds }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) {
                    if (response != undefined && response != null) {
                        ShowSuccessMessage(GlobalErrorList.UserManage.RemoveFromGroup);
                        userManageUtil.ClearSelectedGroups();
                    } else {
                        ShowErrorMessage(GlobalErrorList.UserManage.UnableToRemoveFromGroup);
                    }
                    HidePageLoading();
                },
                error: ShowAjaxError
            });
        } else {
            ShowErrorMessage(GlobalErrorList.UserManage.RemoveGroupError);
            HidePageLoading();
        }
    },
    ClearSelectedGroups: function () {
        $("#addgroupoperation").val("0").trigger("change");
        $(".selChk").prop("checked", false);
        $(".subdivWrap").removeClass("showDiv").addClass('hideDiv');
    },
    AssignAddToGroup: function () {
        $("#ui_hAddOrRemove").html(`Add To Groups`);
        IsAddOrRemove = 0;
    },
    AssingRemoveFromGroup: function () {
        $("#ui_hAddOrRemove").html(`Remove From Groups`);
        IsAddOrRemove = 1;
    },
    SavePassword: function (UserId) {
        if (UserId > 0) {
            if (!userManageUtil.ValidatePassword()) {
                return false;
            }

            
            $.ajax({
                url: "/ManageUsers/Users/UpdatePassword",
                type: 'POST',
                data: JSON.stringify({ 'UserId': UserId, "Password": CleanText($("#ui_txtNewPassword").val()) }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) {
                    if (response.Status) {
                        $("#dvchangepasswordpopup").addClass('hideDiv');
                        ShowSuccessMessage(GlobalErrorList.UserManage.UpdatePasswordSuccess);
                    }
                    else if (response.Message.length > 0) {
                        ShowErrorMessage(response.Message);
                    }
                    else {
                        ShowErrorMessage(GlobalErrorList.UserManage.UpdatePasswordError);
                    }
                },
                error: ShowAjaxError
            });
        }
    },
    ValidatePassword: function () {
        if ($.trim($("#ui_txtNewPassword").val()).length == 0) {
            ShowErrorMessage(GlobalErrorList.UserManage.NewPasswordError);
            $("#ui_txtNewPassword").focus();
            return false;
        }

        if ($.trim($("#ui_txtConfirmPassword").val()).length == 0) {
            ShowErrorMessage(GlobalErrorList.UserManage.ConfirmPassword);
            $("#ui_txtConfirmPassword").focus();
            return false;
        }

        if (!ValidatePasswordSymbol($.trim($("#ui_txtNewPassword").val()))) {
            ShowErrorMessage(GlobalErrorList.UserManage.NewPasswordNotValidError);
            $("#ui_txtNewPassword").focus();
            return false;
        }

        if (!($("#ui_txtNewPassword").val() == $("#ui_txtConfirmPassword").val())) {
            ShowErrorMessage(GlobalErrorList.UserManage.NewPasswordConfirmPasswordNotMatchError);
            $("#ui_txtNewPassword").focus();
            return false;
        }

        return true;
    },
    ShowUserPopUpForGroups: function (UserId) {
        if (UserId > 0) {
            ShowPageLoading();
            $("#dvusergroups").removeClass('hideDiv');

            $.ajax({
                url: "/ManageUsers/Users/GetUsersGroup",
                type: 'POST',
                data: JSON.stringify({ 'Id': UserId }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) {
                    SetNoRecordContent('ui_tblInnerReportData', 3, 'ui_tbodyInnerReportData');
                    if (response != undefined && response != null && response.length > 0) {
                        var reportTableTrs = "";

                        $.each(response, function (m) {
                            let Name = $(this)[0].Name == null ? "NA" : $(this)[0].Name.length > 15 ? $(this)[0].Name.substring(0, 15) + ".." : $(this)[0].Name;
                            let UserGroupDescription = $(this)[0].UserGroupDescription == null ? "NA" : $(this)[0].UserGroupDescription.length > 30 ? $(this)[0].UserGroupDescription.substring(0, 30) + ".." : $(this)[0].UserGroupDescription;
                            let RemoveIcon = "<td class='text-center'><i class='icon ion-android-delete' title='Remove from Group'  data-toggle='modal'' data-target='#removeuser' onclick='userManageUtil.ConfirmedRemove(" + $(this)[0].Id + ", " + UserId + ");'></i></td>"; deletegroups
                            //var RemoveIcon = "<td class='text-center'><img class='FullControlPermission' src='../images/removegrp.png' title='Remove from Group' style='cursor: pointer;data-toggle='modal'' data-target='#removeuser' onclick='userManageUtil.RemoveUserfromGroup(" + $(this)[0].Id + ", " + UserId + ")' /></td>";
                            reportTableTrs += '<tr id=grp' + $(this)[0].Id + '><td  class="text-left td-icon" title=' + $(this)[0].Name + '>' + Name + '</td>' +
                                '<td title=' + $(this)[0].Name + '>' + UserGroupDescription + '</td>' +
                                RemoveIcon
                            '</tr>';
                        });
                        $("#ui_tbodyInnerReportData").html(reportTableTrs);

                    }
                    else {
                        SetNoRecordContent('ui_tblInnerReportData', 3, 'ui_tbodyInnerReportData');
                    }
                    HidePageLoading();
                },
                error: ShowAjaxError

            });
        }
    },
    ConfirmedRemove: function (GroupId, UserId) {
        ShowPageLoading();
        userid = UserId;
        usergroupid = GroupId;
        HidePageLoading();
    },
    RemoveUserIdFromGroup: function () {
        $.ajax({
            url: "/ManageUsers/Users/RemoveUserfromGroup",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: "{usergroupid:" + usergroupid + ",userid:" + userid + "}",
            success: function (data) {
                $("#grp" + usergroupid).remove();
                ShowSuccessMessage(GlobalErrorList.UserManage.RemoveUserfromGroupSuccess);
                var htmlcontent = $.trim($("#ui_tbodyInnerReportData").html());
                if (htmlcontent == "") {
                    SetNoRecordContent('ui_tblInnerReportData', 3, 'ui_tbodyInnerReportData');
                    setTimeout(function () { $("#dvusergroups").addClass('hideDiv'); }, 2000);
                }
            },
            error: ShowAjaxError
        })
    },
    GetReportingUsers: function () {
        $.ajax({
            url: "/ManageUsers/Users/GetReportingUsersByHierarchy",
            type: 'Post',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != undefined && response != null && response != null) {
                    $.each(response, function () {
                        $("#ui_ddlAllUsers").append(`<option value="${$(this)[0].UserId}">${$(this)[0].FirstName}</option>`);
                        $("#ui_ddlReportTo").append(`<option value="${$(this)[0].UserId}">${$(this)[0].FirstName}</option>`);
                    });
                }
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },
    CopyUserId: (UserId) => {
        navigator.clipboard.writeText(UserId);
        ShowSuccessMessage("UserId copied successfully");
    }

}

$(document).ready(function () {
    $("#ui_SerachByEmailId").val("");
    ShowPageLoading();
    UserGroupId = urlParam("GroupId");
    GroupName = decodeURIComponent(urlParam("GroupName"));
    if (GroupName != undefined && GroupName != null && GroupName != '' && GroupName != "0")
        $('.pagetitle').html('MANAGE USERS(' + GroupName + ')');
    userManageUtil.Initialize();
    var LoadingTimeInverval = setInterval(function () {
        $("#ui_SerachByEmailId").val("");
        if (IsLoadingHide.IsRole && IsLoadingHide.IsUserGroup && IsLoadingHide.IsAccount) {
            userManageUtil.GetUserDetails();
            HidePageLoading();
            clearInterval(LoadingTimeInverval);
        }
    }, 1000);
});

function CallBackPaging() {
    ShowPageLoading();
    CurrentRowCount = 0;
    userManageUtil.GetUserDetails();
}


$(".selchbxall").click(function () {
    if ($(this).is(":checked")) {
        $(".selChk").prop('checked', true);
    } else {
        $(".selChk").prop('checked', false);
    }
});

var checkBoxClickCount, addGroupNameList;
$(document).on('click', '.selChk', function () {
    checkBoxClickCount = $('.selChk').filter(':checked').length;
    if (checkBoxClickCount > 0) {
        $(".subdivWrap").removeClass("hideDiv").addClass('showDiv');
    } else {
        $(".subdivWrap").removeClass("showDiv").addClass('hideDiv');
    }
    $(".checkedCount").html(checkBoxClickCount);
});

$(".selchbxall").click(function () {
    checkBoxClickCount = $('.selChk').filter(':checked').length;
    if (checkBoxClickCount > 0) {
        $(".subdivWrap").removeClass("hideDiv").addClass('showDiv');
    } else {
        $(".subdivWrap").removeClass("showDiv").addClass('hideDiv');
    }
    $(".checkedCount").html(checkBoxClickCount);
});

$(".selchbxall").click(function () {
    checkBoxClickCount = $('.selChk').filter(':checked').length;
    if (checkBoxClickCount > 0) {
        $(".subdivWrap").removeClass("hideDiv").addClass('showDiv');
    } else {
        $(".subdivWrap").removeClass("showDiv").addClass('hideDiv');
    }
    $(".checkedCount").html(checkBoxClickCount);
});

$('#addgroupoperation,#ui_ddlGroups').select2({
    placeholder: 'Select Group(s)',
    minimumResultsForSearch: '',
    dropdownAutoWidth: false
});

$('#ui_selRoles').select2({
    placeholder: 'Select Role',
    minimumResultsForSearch: '',
    dropdownAutoWidth: false,
});

$('#ui_ddlAccount').select2({
    placeholder: 'Select Account(s)',
    minimumResultsForSearch: '',
    dropdownAutoWidth: false,
});

$('#ui_ddlAllUsers').select2({
    placeholder: 'Select User',
    minimumResultsForSearch: '',
    dropdownAutoWidth: false,
});

$('#ui_SerachByEmailId').keypress(function (e) {
    var key = e.which;
    if (key == 13) {
        userManageUtil.SerachByEmailId();
        return false;
    }
});

$("#ui_SerachByEmailId").keyup(function (e) {
    if (e.which && e.which === 8 || e.keyCode && e.keyCode === 46)
        if (CleanText($.trim($("#ui_SerachByEmailId").val())).length == 0) {
            ShowPageLoading();
            userManageUtil.GetUserDetails();
        }
});

$(".createcamppref").click(function () {
    ShowPageLoading();

    if (urlParam("GroupId") > 0)
        history.pushState({ state: 1, rand: Math.random() }, '', window.location.href.split("?")[0]);

    $('#ui_ddlAllUsers option:not(:first)').remove();
    $("#ui_UserEmailId").removeAttr("disabled");
    userManageUtil.GetReportingUsers();
    //$.ajax({
    //    url: "/ManageUsers/Users/GetReportingUsersByHierarchy",
    //    type: 'Post',
    //    contentType: "application/json; charset=utf-8",
    //    dataType: "json",
    //    success: function (response) {
    //        if (response != undefined && response != null && response != null) {
    //            $.each(response, function () {
    //                $("#ui_ddlAllUsers").append(`<option value="${$(this)[0].UserId}">${$(this)[0].FirstName}</option>`);
    //            });
    //        }
    //        HidePageLoading();
    //    },
    //    error: ShowAjaxError
    //});

    $("#dv_groups").show();
    $("#ui_btnSaveOrUpdate").html("Save").attr("onclick", `userManageUtil.SaveUserDetails()`);
    $("#dvedituser .popuptitle h6").html('CREATE USER');
    $("#dvedituser").removeClass('hideDiv');
});

$("#close-popup, .clsepopup").click(function () {
    userManageUtil.ClearAndHideUserCreatePopUp();
});

$("#ui_AddOrRemoveFromGroup").click(function () {
    ShowPageLoading();
    if (IsAddOrRemove == 0) {
        userManageUtil.AddToGroup();
    } else {
        userManageUtil.RemoveFromGroup();
    }
});

function ShowUserPopUpForPasswordChange(UserId) {
    if (UserId > 0) {
        $("#dvchangepasswordpopup").removeClass('hideDiv');
        $("#ui_btnPasswordSaveOrUpdate").html("Update").attr("onclick", `userManageUtil.SavePassword(${UserId})`);
    }
}


ValidatePasswordSymbol = function (content) {
    var regExpPassword = /^(?=.*\d)(?=(.*[a-z]){3})(?=(.*[A-Z]){3})(?=(.*[0-9]){3})(?=(.*[!@@#\$%\_^&\`-~()*]){3})(?!.*\s).{12,}$/;
    return regExpPassword.test(content);
}


//filter 

$("#quickfiltusers").change(function () {
    let checkquickfiltab = $("#quickfiltusers option:selected").val();
    if (checkquickfiltab == "select") {
        event.preventDefault();
    }
    if (checkquickfiltab == "reporttowrap") {
        userManageUtil.GetReportingUsers();
    }
    $(".quickfltwrp").removeClass("hideDiv");
    $(`#${checkquickfiltab}`).removeClass("hideDiv");
});

function CloseQuikFilterTabs(id) {
    userManageUtil.GetUserDetails();
    let checkqukfilticonlnth = $(".lmsstagefilterwrp.hideDiv").length;
    if (checkqukfilticonlnth == 2) {
        $(id).parent().parent().parent().addClass("hideDiv");
        $(id).parent().parent().addClass("hideDiv");
    } else {
        $(id).parent().parent().addClass("hideDiv");
    }
};

$("#ui_ddlRoles,#ui_ddlStatus,#ui_ddlReportTo").change(function () {
    userManageUtil.GetUserDetails();
});


$("#ui_CloseRoles").click(function () {
    $("#ui_ddlRoles").val("0").change();
    CloseQuikFilterTabs("#ui_ddlRoles");

})

$("#ui_CloseStatus").click(function () {
    $("#ui_ddlStatus").val("-1").change();
    CloseQuikFilterTabs("#ui_ddlStatus");
})

$("#ui_CloseReportTo").click(function () {
    $("#ui_ddlReportTo").val("0").change();
    CloseQuikFilterTabs("#ui_ddlReportTo");
})


$('.useraccntdrp').select2({
    minimumResultsForSearch: '',
    dropdownAutoWidth: false
});