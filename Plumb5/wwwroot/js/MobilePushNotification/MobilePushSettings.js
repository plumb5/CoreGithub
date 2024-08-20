var MobileSettings = { Id: 0};
var IosPushType = 'fcm';
var pushFile='';



$(document).ready(function () {
    GetSettingsDetail();
});


$("#ui_btn").click(function () {

    if (!Validate()) {
        return;
    }

    ShowPageLoading();

    MobileSettings.AndroidPackageName = $("#txtPackageName").val();
    MobileSettings.FcmProjectNo = "";
    MobileSettings.FcmApiKey = $("#txtFcmKey").val();
    MobileSettings.FcmConfigurationUrl = "https://fcm.googleapis.com/fcm/send";
    MobileSettings.IosPackageName = $("#txtIosPackageName").val();
    MobileSettings.IosPushType = IosPushType;

    if (IosPushType == 'apn') {
        MobileSettings.IosCertificate = pushFile;
        MobileSettings.IosPassword = $("#txtPassword").val();

        MobileSettings.IosFcmConfigFile = "";
        MobileSettings.IosFcmTeamId = "";
        MobileSettings.IosFcmBundleIdentifier = "";
        MobileSettings.IsFcmAndroidAndIOS = false;
    } else {
        MobileSettings.IosFcmConfigFile = pushFile;
        MobileSettings.IosFcmTeamId = $("#txtTeamId").val();
        MobileSettings.IosFcmBundleIdentifier = $("#txtBundleIdentifier").val();

        MobileSettings.IosCertificate = "";
        MobileSettings.IosPassword = "";
        MobileSettings.IsFcmAndroidAndIOS = true;
    }

    MobileSettings.IosPushMode = $(".ddlPushMode option:selected").val();
    MobileSettings.Status = true;

    $.ajax({
        url: "/MobilePushNotification/MobilePushSettings/SaveOrUpdateSettings",
        type: 'POST',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'MobilePushSettings': MobileSettings }),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            if (MobileSettings.Id != 0)
                ShowSuccessMessage(GlobalErrorList.MobilePushSettings.Update);
            else
                ShowSuccessMessage(GlobalErrorList.MobilePushSettings.Sucess);


            HidePageLoading();
        },
        error: ShowAjaxError
    });
});

function Validate() {

    if ($.trim($("#txtPackageName").val()).length == 0) {
        ShowErrorMessage(GlobalErrorList.MobilePushSettings.AndroidPackageName);
        return false;
    }

    if ($.trim($("#txtIosPackageName").val()).length == 0) {
        ShowErrorMessage(GlobalErrorList.MobilePushSettings.IosPackageName);
        return false;
    }

    if ($.trim($("#txtFcmKey").val()).length == 0) {
        ShowErrorMessage(GlobalErrorList.MobilePushSettings.AndroidFcmKey);
        return false;
    }

    //APN.....
    if ($.trim($("#txtPassword").val()).length>0 && pushFile.length == 0 && IosPushType == 'apn') {
        ShowErrorMessage(GlobalErrorList.MobilePushSettings.IosFile);
        return false;
    }

    if ($.trim($("#txtPassword").val()).length == 0 && pushFile.length > 0 && IosPushType == 'apn') {
        ShowErrorMessage(GlobalErrorList.MobilePushSettings.IosPassword);
        return false;
    }
   
    //FCM.....
    if (pushFile.length == 0 && IosPushType == 'fcm' && ($.trim($("#txtTeamId").val()).length > 0 || $.trim($("#txtBundleIdentifier").val()).length>0)) {
        ShowErrorMessage(GlobalErrorList.MobilePushSettings.FcmFile);
        return false;
    }
    if ($.trim($("#txtTeamId").val()).length == 0 && IosPushType == 'fcm' && (pushFile.length > 0 || $.trim($("#txtBundleIdentifier").val()).length > 0)) {
        ShowErrorMessage(GlobalErrorList.MobilePushSettings.FcmTeamId);
        return false;
    }
    if ($.trim($("#txtBundleIdentifier").val()).length == 0 && IosPushType == 'fcm' && (pushFile.length > 0 || $.trim($("#txtTeamId").val()).length > 0)) {
        ShowErrorMessage(GlobalErrorList.MobilePushSettings.FcmBundleIdentifier);
        return false;
    }
    

    return true;
}

function GetSettingsDetail() {

    $.ajax({
        url: "/MobilePushNotification/MobilePushSettings/GetSettings",
        type: 'POST',
        data: JSON.stringify({ 'accountId': Plumb5AccountId}),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            MobileSettings.Id = response.Id;
            $("#txtPackageName").val(response.AndroidPackageName);
            $("#txtFcmKey").val(response.FcmApiKey);
            $("#txtIosPackageName").val(response.IosPackageName);
            $("#txtPassword").val(response.IosPassword);
            $(".ddlPushMode").val(response.IosPushMode);
            $("#txtTeamId").val(response.IosFcmTeamId);
            $("#txtBundleIdentifier").val(response.IosFcmBundleIdentifier);

            MobileSettings.IosPushType = response.IosPushType;
            if (response.IosPushType == 'fcm') {
                IosPushType='fcm'
                $("#mobauthkey").prop("checked", true);
                $(".mobcertifupld").addClass("hideDiv");
                $(".mobauthkeyupld").removeClass("hideDiv");
                pushFile = response.IosFcmConfigFile==null?'':response.IosFcmConfigFile;
            } else {
                IosPushType = 'apn'
                $("#mobcertif").prop("checked", true);
                $(".mobauthkeyupld").addClass("hideDiv");
                $(".mobcertifupld").removeClass("hideDiv");
                pushFile = response.IosCertificate==null?'':response.IosCertificate;
            }

            HidePageLoading();
        },
        error: ShowAjaxError
    });
   // HidePageLoading();
}

$('input[name="mobauthetictype"]').click(function () {
    let getmobauttypeval = $('input[name="mobauthetictype"]:checked').val();
    if (getmobauttypeval == "mobcertificate") {
        $(".mobauthkeyupld").addClass("hideDiv");
        $(".mobcertifupld").removeClass("hideDiv");
        IosPushType = 'apn';
    } else {
        $(".mobcertifupld").addClass("hideDiv");
        $(".mobauthkeyupld").removeClass("hideDiv");
        IosPushType = 'fcm';
    }
});

function SaveFile(fileid) {
    pushFile = '';
    ShowPageLoading();
    if ($("#" + fileid).val() != "") {
        var uploadFile = $("#" + fileid).get(0);
        var uploadedfile = uploadFile.files;
        var fromdata;
        if (typeof window.FormData == "undefined")
            fromdata = [];
        else
            fromdata = new window.FormData();
        for (var i = 0; i < uploadedfile.length; i++) {
            if (typeof window.FormData == "undefined")
                fromdata.push(uploadedfile[i].name, uploadedfile[i]);
            else
                fromdata.append(uploadedfile[i].name, uploadedfile[i]);
        }

        var choice = {};
        choice.url = "/MobilePushNotification/MobilePushSettings/SaveFile",
        choice.type = "POST";
        choice.data = fromdata;
        choice.contentType = false;
        choice.processData = false;
        choice.async = false;
        choice.success = function (response) {
            pushFile = response;
            HidePageLoading();
            if (response == 0) {
                ShowErrorMessage(GlobalErrorList.MobilePushSettings.FileFormat);
            }
            $(".chosefile").val('');
        };
        choice.error = function (result) {
            ShowErrorMessage(GlobalErrorList.MobilePushSettings.FileFormat);
        };
        $.ajax(choice);
        event.preventDefault();
    }
}