
$(document).ready(function () {
    GetClickToCallSettingsDetails();
});

function GetClickToCallSettingsDetails() {
    $.ajax({
        url: "/Prospect/CallSettings/GetClickToCallSettingsDetails",
        type: 'POST',
        data: JSON.stringify({ 'AdsId': Plumb5AccountId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response != null && response != undefined) {
                $(".lmscallsttdeftxt").addClass("hideDiv");
                $(".lmscallstatuspendwrp").removeClass("hideDiv");
                setTimeout(showlmsrecordcont, 3000);
            }
            else
                HidePageLoading();
        },
        error: ShowAjaxError
    });
}

$(".lmsenbcall").click(function () {
    SendClickToCallRequest();
});

function SendClickToCallRequest() {
    ShowPageLoading();
    $.ajax({
        url: "/Prospect/CallSettings/SendClickToCallRequest",
        type: 'POST',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'Plumb5AccountName': Plumb5AccountName, 'Plumb5AccountDomain': Plumb5AccountDomain }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response)
                ShowSuccessMessage(GlobalErrorList.CallSettings.SendClickToCallRequestSuccess);
            else
                ShowErrorMessage(GlobalErrorList.CallSettings.SendClickToCallRequestError);
            HidePageLoading();
        },
        error: ShowAjaxError
    });
}

function showlmsrecordcont() {
    $(".lmscallsettdefwrp").addClass("hideDiv");
    $(".lmscallsetmaimwrp").removeClass("hideDiv");

    $.ajax({
        url: "/Prospect/CallSettings/GetPrimaryPhone",
        type: 'POST',
        data: JSON.stringify({ 'userId': Plumb5UserId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response != null && response != undefined && response.SetPrimaryPhoneNumber != null)
                $("#ui_drpdwn_SetPrimaryPhone").val(response.SetPrimaryPhoneNumber);
            else
                $("#ui_drpdwn_SetPrimaryPhone").val(0);
            HidePageLoading();
        },
        error: ShowAjaxError
    });
}

$("#ui_drpdwn_SetPrimaryPhone").on('change', function () {
    ShowPageLoading();
    var setValue = $("#ui_drpdwn_SetPrimaryPhone").val() == 0 ? '' : $("#ui_drpdwn_SetPrimaryPhone").val();
    $.ajax({
        url: "/Prospect/CallSettings/UpdatePrimaryPhone",
        type: 'POST',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'setPrimaryPhone': setValue }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response)
                ShowSuccessMessage(GlobalErrorList.CallSettings.SetPrimaryPhoneSuccess);
            else
                ShowErrorMessage(GlobalErrorList.CallSettings.SetPrimaryPhoneError);
            HidePageLoading();
        },
        error: ShowAjaxError
    });
});