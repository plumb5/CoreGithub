var PushId = 0, ruleStatus = 0;
$(document).ready(function () {
    PushId = $.urlParam("PushId");
    if (PushId > 0) {
        BindBroadcast();
        $("#ui_btnSave").val("Update");
    }
    else {
        $("#ui_btnSave").val("Save");
    }

    if (window.location.href.toLowerCase().indexOf("notification/setting") > -1) {
        BindFBSettings();
    }
});

var AppType = 1;
function changerad(val, cond) {
    if (val == 1) {
        $("#ui_rad1").last().addClass("md-checked");
        $("#ui_rad2").last().removeClass("md-checked");
        $("#ui_txtappId").val("***********");
        $("#ui_txtappId").prop("disabled", true);
        $("#ui_txtappSecret").val("**********************");
        $("#dv_appUrl").hide();
        $("#ui_txtappSecret").prop("disabled", true);
        $("#ui_txtAccountUrl").prop("disabled", true);
        $("a#ui_testApp").attr("href", "https://apps.facebook.com/1705627793067162/?acid=p5m1a2i3sdk" + $("#hdn_AccId").val());
        AppType = 1;
    }
    else {
        $("#ui_txtappId").prop("disabled", false);
        $("#ui_txtappSecret").prop("disabled", false);
        $("#dv_appUrl").show();
        if (cond == "bind") {

        }
        else {
            $("#ui_txtappId").val("");
            $("#ui_txtappSecret").val("");
        }
        $("#ui_rad2").last().addClass("md-checked");
        $("#ui_rad1").last().removeClass("md-checked");
        $("#ui_txtAccountUrl").prop("disabled", true);
        $("a#ui_testApp").attr("href", "https://apps.facebook.com/App-ID/?acid=");
        AppType = 2;
    }
}


function BindFBSettings() {
    var inputs = { Action: 'Settings', PushId: 0 };
    $.ajax({
        url: "../Notification/BindSendNotification",
        type: "Post",
        data: JSON.stringify({ 'Data': inputs }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response.Table.length > 0) {
                $("#dv_active").show();
                $("#dv_App").hide();
                $.each(response.Table, function () {
                    changerad(this.FbAppType == 0 ? 1 : this.FbAppType, 'bind');

                    if (this.FbAppType == 0 || this.FbAppType == 1) {
                        $("#ui_txtappId").val("***********");
                        $("#ui_txtappSecret").val("**********************");
                    } else {
                        $("#ui_txtappId").val(this.AppId);
                        $("#ui_txtappSecret").val(this.AppSecret);
                    }

                    $("#drp_displayUrl2").val(this.RedirectDisplay);
                    $("#ui_txtredirectUrl").val(this.RedirectTo);
                });

                $.each(response.Table1, function () {
                    $("#ui_txtName").val(this.CampaignName);
                    $("#ui_txtMsg").val(this.Message);
                    $("#ui_txtdestinationUrl").val(this.RedirectTo);
                    $("#drp_displayUrl").val(this.RedirectDisplay);
                });
            }
            else {
                $("#dv_active").hide();
                $("#dv_App").show();
            }
        }
    });
}

function BindBroadcast() {
    var inputs = { Action: 'Notification', PushId: PushId };
    $.ajax({
        url: "../Notification/BindSendNotification",
        type: "Post",
        data: JSON.stringify({ 'Data': inputs }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response.Table.length > 0) {
                $.each(response.Table, function () {
                    $("#ui_txtName").val(this.CampaignName);
                    $("#ui_txtMsg").val(this.Message);
                    $("#ui_txtdestinationUrl").val(this.RedirectTo);
                    $("#drp_displayUrl").val(this.RedirectDisplay);

                    if (this.RuleStatus == 1)
                        BindRules(response.Table1[0]);
                    return;
                });
            }
        }
    });
}

function BindRules(data) {
    $("#div_Rule_Content").show();
    ruleConditions = data;
    BindAudienceData();
    BindBehaviorData();
    BindInteractionData();
    BindInteractionEventData();
    BindProfileData();
}

//// Setting
function SaveFBSettings() {
    $("#dvLoading").hide();
    if ($("#ui_txtappId").val() == "") {
        ShowErrorMessage("Please provide the App Id!");
    }
    else if ($("#ui_txtappSecret").val() == "") {
        ShowErrorMessage("Please provide the App Secret!");
    }
    else if ($("#ui_txtAccountUrl").val() == "") {
        ShowErrorMessage("Please provide the Configuration Url!");
    }
    else if ($("#ui_txtredirectUrl").val() == "") {
        ShowErrorMessage("Please provide the Defalut Destination Url!");
    }
    else if ($("#ui_txtredirectUrl").val().indexOf("http") == -1) {
        ShowErrorMessage("Please provide the valid 'http/https' Url!");
    }
    else if ($("#ui_txtName").val() == "") {
        ShowErrorMessage("Please provide the Name!");
    }
    else if ($("#ui_txtMsg").val() == "") {
        ShowErrorMessage("Please provide the Message!");
    }
    else if ($("#ui_txtdestinationUrl").val() == "") {
        ShowErrorMessage("Please provide the Destination Url!");
    }
    else if ($("#ui_txtdestinationUrl").val().indexOf("http") == -1) {
        ShowErrorMessage("Please provide the valid 'http/https' Url!");
    }
    else {
        $("#dvLoading").show();

        var inputs1 = {
            Action: 'saveSettings', appId: $("#ui_txtappId").val(), appSecret: $("#ui_txtappSecret").val(), accountUrl: $("#ui_txtAccountUrl").val(),
            displayDestinationUrl: $("#drp_displayUrl2").val(), defaultDestinationUrl: $("#ui_txtredirectUrl").val(), FbAppType: AppType
        };

        var inputs2 = {
            Action: 'saveSettings', Name: $("#ui_txtName").val().trim(), Message: $("#ui_txtMsg").val().trim(),
            destinationUrl: $("#ui_txtdestinationUrl").val(), welcomeMsgdisplayDestinationUrl: $("#drp_displayUrl").val()
        };

        $.ajax({
            url: "../Notification/SaveSettings",
            type: "Post",
            data: JSON.stringify({ 'Data': inputs1, 'Data2': inputs2 }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (parseInt(response) > 0) {
                    ShowErrorMessage("Successfully created the Notification");
                }
                else if (parseInt(response) === -3) {
                    ShowErrorMessage("Successfully updated the Notification");
                }
                else if (parseInt(response) === -2)
                    ShowErrorMessage("Notification name is already exists");

                $("#dvLoading").hide();

                if (AppType == 2) {
                    GetAppIdandSecret();
                }
            },
            error: function (objxmlRequest) {
                window.console.log(objxmlRequest.responseText);
            }
        });
    }
}

var AppId = "", AppSecret = "";
function GetAppIdandSecret() {
    var inputs = { Action: 'GetIdAppSecret', PushId: 0 };
    $.ajax({
        url: "../Notification/BindSendNotification",
        type: "Post",
        data: JSON.stringify({ 'Data': inputs }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response.Table.length > 0) {
                $.each(response.Table, function () {
                    AppId = this.AppId;
                    AppSecret = this.AppSecret;
                });
                SetAppAccessToken(AppId, AppSecret);
            }
        }
    });
}

function SetAppAccessToken(AppId, AppSecret) {
    var accessToken = '';
    var Url = "https://graph.facebook.com/oauth/access_token?client_id=" + AppId + "&client_secret=" + AppSecret + "&grant_type=client_credentials";

    $.ajax({
        type: "GET",
        url: Url,
        async: false,
        success: function (text) {
            accessToken = text.access_token;
        }
    });

    var inputs = { Action: 'saveAccessToken', PushId: 0, AppAccessToken: accessToken };

    $.ajax({
        url: "../Notification/BindSendNotification",
        type: "Post",
        data: JSON.stringify({ 'Data': inputs }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (parseInt(response) > 0) {
                window.log(response);
            }
        }
    });
}

///// Save Notification
function SaveNotification() {
    SaveAndSendNotification('saveNotification');
}

///// Send Notification
function SendNotification() {
    SaveAndSendNotification('sendNotification');
}

///// Save And SendNotification
function SaveAndSendNotification(val) {
    $("#dvLoading").hide();
    if ($("#ui_txtName").val() == "") {
        ShowErrorMessage("Please provide the Name!");
    }
    else if ($("#ui_txtMsg").val() == "") {
        ShowErrorMessage("Please provide the Message!");
    }
    else if ($("#ui_txtdestinationUrl").val() == "") {
        ShowErrorMessage("Please provide the Destination Url!");
    }
    else if ($("#ui_txtdestinationUrl").val().indexOf("http") == -1) {
        ShowErrorMessage("Please provide the valid 'http/https' Url!");
    }
    else if (!ValidationOfRules()) {
        $("#dvLoading").hide();
        return false;
    }
    else {
        $("#dvLoading").show();

        if ($("#div_Rule_Content input[type='checkbox']:checked").length > 0)
            ruleStatus = 1;

        var inputs = {
            Action: val, PushId: PushId, Name: $("#ui_txtName").val().trim(), Message: $("#ui_txtMsg").val().trim(),
            destinationUrl: $("#ui_txtdestinationUrl").val(), welcomeMsgdisplayDestinationUrl: $("#drp_displayUrl").val(), RuleStatus: ruleStatus
        };

        $.ajax({
            url: "../Notification/SaveSettings",
            type: "Post",
            data: JSON.stringify({ 'Data2': inputs }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (parseInt(response) > 0 && val == "sendNotification") {
                    ShowErrorMessage("Successfully created the Notification and started sending Notifications");
                    SaveRules(PushId, 'SaveAndSend');
                }
                else if (parseInt(response) > 0) {
                    SaveRules(response, '');
                    ShowErrorMessage("Successfully created the Notification");
                }
                else if (parseInt(response) === -3 && val == "sendNotification") {
                    SaveRules(PushId, 'SaveAndSend');
                }
                else if (parseInt(response) === -3) {
                    SaveRules(PushId, '');
                    ShowErrorMessage("Successfully updated the Notification");
                }
                else if (parseInt(response) === -2) {
                    ShowErrorMessage("Notification name is already exists");
                    $("#dvLoading").hide();
                }
                else if (parseInt(response) === -4) {
                    ShowErrorMessage("Push notification is disabled");
                    $("#dvLoading").hide();
                }
                else {
                    ShowErrorMessage("Something goes wrong!");
                    $("#dvLoading").hide();
                }
            },
            error: function (objxmlRequest) {
                window.console.log(objxmlRequest.responseText);
                $("#dvLoading").hide();
            }
        });
    }
}

function SaveRules(id, val) {
    $("#dvLoading").show();
    RulesData(id);
    $.ajax({
        url: "../Notification/SaveFbRules",
        type: "Post",
        data: JSON.stringify({ 'ruleConditions': ruleConditions, 'CampaignId': id, 'saveOrSend': val }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (parseInt(response) >= 0) {
                if (val == "SaveAndSend") {
                    ShowErrorMessage("Successfully notification has been sent, Number of notification sent is " + response);
                }
            }
            $("#dvLoading").hide();
        }
    });
}