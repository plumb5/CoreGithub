var AssignmentSettings = { PageId: "", PageName: "", IsAssignIndividualOrRoundRobin: 0, UserId: 0, UserGroupId: 0, GroupId: 0, LmsGroupId: 0 }
var pageIndex = 0;

$(document).ready(function () {
    //Bind dropdown values
    settingsUtil.GetGroupList();

})

var settingsUtil = {
    GetPages: function () {
        $.ajax({
            url: "/FacebookPage/Settings/GetFacebookPages",
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                let SelectedPageIndex = result.SelectedPageIndex != undefined && result.SelectedPageIndex != null ? result.SelectedPageIndex : 0;
                if (result.fbPages != undefined && result.fbPages != null) {
                    $.each(result.fbPages, function (i) {
                        if (i == SelectedPageIndex) {
                            $("#ui_dropdownMenuButton").html('<span id="spnSelectPage" data-index=' + i + ' page-id=' + $(this)[0].PageId + ' class="fbclntnametxt">' + $(this)[0].PageName + '</span> <i class="fbclientlogo" style="background-image: url(\'' + $(this)[0].ImageUrl + '\')"></i>');
                            settingsUtil.SelectPage(i, $(this)[0].PageId, $(this)[0].PageName, $(this)[0].ImageUrl);
                        }

                        $("#ddlPages").append('<a onclick="settingsUtil.SelectPage(' + i + ',\'' + $(this)[0].PageId + '\',\'' + $(this)[0].PageName + '\',\'' + $(this)[0].ImageUrl + '\')" class="dropdown-item" data-fbclientname="Plumb5" data-fbclientlogo="https://www.plumb5.com/favicon.ico" href="#"><i class="fa fa-file-o mr-2"></i>' + $(this)[0].PageName + '</a>');
                    });

                }
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },
    SelectPage: function (index, pageId, page, image) {
        pageIndex = index;
        ShowPageLoading();
        $("#ui_dropdownMenuButton").html('<span  id="spnSelectPage" data-index=' + index + ' page-id=' + pageId + ' class="fbclntnametxt">' + page + '</span> <i class="fbclientlogo" style="background-image: url(\'' + image + '\')"></i>');
        $("#ui_pageName").html(page);
        $('.fbpagelogo').css('background-image', 'url(' + image + ')');
        settingsUtil.GetSettingDetails(pageId);
    },
    GetGroupList: function () {
        $.ajax({
            url: "/ManageContact/Group/GetGroupsByStaticOrDynamic",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, GroupType: 1 }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != undefined && response != null && response.GroupDetails != null) {
                    GroupList = response;
                    $.each(response.GroupDetails, function () {
                        $("#ui_ddlGroupList").append('<option value="' + $(this)[0].Id + '">' + $(this)[0].Name + '</option>');
                    });
                }
                settingsUtil.GetUserList();
            },
            error: ShowAjaxError
        });
    },
    GetUserList: function () {
        $.ajax({
            url: "/FacebookPage/Settings/GetUserList",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'UserId': Plumb5UserId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != undefined && response != null) {
                    UserList = response;
                    $.each(response, function () {
                        $("#ui_ddlUserList").append('<option value="' + $(this)[0].UserInfoUserId + '">' + $(this)[0].FirstName + '</option>');
                    });
                }
                settingsUtil.GetUserGroupList();
            },
            error: ShowAjaxError
        });
    },
    GetUserGroupList: function () {
        $.ajax({
            url: "/FacebookPage/Settings/GetUserGroupList",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != undefined && response != null) {
                    UserGroupList = response;
                    $.each(response, function () {
                        //$("#ui_ddlUserGroupList").append(`<option value="${$(this)[0].Id}">${$(this)[0].Name}</option>`);
                        $("#ui_ddlUserGroupList").append('<option value="' + $(this)[0].Id + '">' + $(this)[0].Name + '</option>');
                    });
                }
                settingsUtil.GetLmsGroupsList();
            },
            error: ShowAjaxError
        });
    },
    GetLmsGroupsList: function () {
        $.ajax({
            url: "/FacebookPage/Settings/LmsGroupsList",
            data: JSON.stringify({ 'accountId': Plumb5AccountId }),
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != undefined && response != null && response.length > 0) {
                    $.each(response, function () {
                        $("#ui_ddlLmsGroupList").append("<option value=" + $(this)[0].LmsGroupId + ">" + $(this)[0].Name + "</option>");
                    });
                }
                //Bind facebook pages
                settingsUtil.GetPages();
            },
            error: ShowAjaxError
        });
    },
    GetSettingDetails: function (pageId) {
        AssignmentSettings.PageId = pageId;
        $.ajax({
            url: "/FacebookPage/Settings/GetSettings",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'PageIndex': pageIndex, 'AssignmentSettings': AssignmentSettings }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                var response = response.data;
                if (response != undefined && response != null) {
                    settingsUtil.BindSettingDetails(response);
                }
                else {
                    settingsUtil.BindDefaultValues();
                    HidePageLoading();
                }
            },
            error: ShowAjaxError
        });
    },
    BindSettingDetails: function (response) {

        if (response.IsAssignIndividualOrRoundRobin == true) {
            $("#ui_radAssignIndividual").prop("checked", true).trigger('click');
            $("#ui_ddlUserList").val(response.UserId).trigger("change");
        }
        else {
            $("#ui_radAssignRoundRobin").prop("checked", true).trigger('click');
            $("#ui_ddlUserGroupList").val(response.UserGroupId).trigger("change");
        }

        $("#ui_ddlGroupList").val(response.GroupId).trigger("change");
        $("#ui_ddlLmsGroupList").val(response.LmsGroupId).trigger("change");

        HidePageLoading();
    },
    SaveSettings: function () {
        ShowPageLoading();
        AssignmentSettings.PageId = $("#spnSelectPage").attr('page-id');
        AssignmentSettings.PageName = $("#ui_dropdownMenuButton").text().trim();
        AssignmentSettings.IsAssignIndividualOrRoundRobin = parseInt($('input[name="leadassignmenttype"]:checked').val());
        if (AssignmentSettings.IsAssignIndividualOrRoundRobin == 1)
            AssignmentSettings.UserId = $("#ui_ddlUserList").val();
        else
            AssignmentSettings.UserGroupId = $("#ui_ddlUserGroupList").val();

        AssignmentSettings.GroupId = $("#ui_ddlGroupList").val();
        AssignmentSettings.LmsGroupId = $("#ui_ddlLmsGroupList").val();

        $.ajax({
            url: "/FacebookPage/Settings/SaveSettings",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'AssignmentSettings': AssignmentSettings }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response > 0)
                    ShowSuccessMessage(GlobalErrorList.FacebookSettings.SaveSettingsSuccess);
                else
                    ShowErrorMessage(GlobalErrorList.FacebookSettings.UnableToSaveSettings);

                HidePageLoading();
            },
            error: ShowAjaxError
        });

    },
    RemoveAccessToken: function () {
        ShowPageLoading();
        $.ajax({
            url: "/FacebookPage/Settings/RemoveAccessToken",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response)
                    ShowSuccessMessage(GlobalErrorList.FacebookSettings.SuccessRemoveToken);

                setTimeout(function () { window.location.href = "/FacebookPage/FacebookLogin"; }, 3000);

                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },
    BindDefaultValues: function () {
        $("#ui_ddlUserList,#ui_ddlUserGroupList,#ui_ddlGroupList,#ui_ddlLmsGroupList").val(0).trigger("change");
    }
}

$('input[name="leadassignmenttype"]').click(function () {
    let getleadassignmenttype = $('input[name="leadassignmenttype"]:checked').val();
    if (getleadassignmenttype == "1") {
        $(".lmsaddrulselgrp").addClass("hideDiv");
        $(".lmsaddrulselusrs").removeClass("hideDiv");
    } else {
        $(".lmsaddrulselusrs").addClass("hideDiv");
        $(".lmsaddrulselgrp").removeClass("hideDiv");
    }
});

//Save Settings
$('#ui_btnSaveSettings').click(function () {
    settingsUtil.SaveSettings();
});

//Remove access token
$("#ui_btnRemoveToken").click(function () {
    settingsUtil.RemoveAccessToken();
});

$('#ui_ddlUserList, #ui_ddlUserGroupList, #ui_ddlGroupList,#ui_ddlLmsGroupList').select2({
    minimumResultsForSearch: '',
    dropdownAutoWidth: false,
    containerCssClass: "border"
});