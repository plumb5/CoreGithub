
var ContactId, AdsId, EmailId, MailSendingSettingId, DripSequence, DripConditionType, UnsubscribeQueryString;
var UnSubScribeGrpSelectedContacts = [];
var MailTrackPath = "";

$(document).ready(function () {
    AdsId = $.urlParam("AdsId");
    ContactId = $.urlParam("ContactId");
    MailSendingSettingId = $.urlParam("MailSendingSettingId");
    EmailId = $.urlParam("EmailId");
    DripSequence = $.urlParam("DripSequence");
    DripConditionType = $.urlParam("DripConditionType");
    // UnsubscribeQueryString = window.location.search;
    $("#dvdynamicGrp").children().hide();
    GetGroupList();
});

function GetGroupList() {
    $.ajax({
        url: "/Mail/UnSubscribePage/GetGroupList",
        type: 'POST',
        data: JSON.stringify({ 'ContactId': ContactId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindGroupDetails,
        error: ShowAjaxError
    });
}

function BindGroupDetails(response) {

    if (response.length > 0) {
        $.each(response, function (i) {
            $("input:checkbox[value='" + $(this)[0].Id + "']").parent().show();
        });
    }
}

$("#a_UnSubscribeLink").click(function () {
    $.ajax({
        url: "/MailTrack/UnsubscribeContact",
        type: 'POST',
        data: JSON.stringify({ 'AdsId': AdsId, 'MailSendingSettingId': MailSendingSettingId, 'ContactId': ContactId, 'EmailId': EmailId, 'DripSequence': DripSequence, 'DripConditionType': DripConditionType }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response) {
                alert("You have Successfully UnSubScribed!!");
            }
            else {
                alert("Unable to UnSubScribe!!");
            }
        },
        error: ShowAjaxError
    });
});

$("#ui_btnSelectedCheckBoxToUnSubScribe").click(function () {

    $("input[name='dvGroup']:checked").each(function () {
        UnSubScribeGrpSelectedContacts.push(parseInt($(this).val()));
    });

    if (UnSubScribeGrpSelectedContacts.length <= 0) {
        alert("Please select the checkbox to UnSubScribe");
        return;
    }

    $.ajax({
        url: "/MailTrack/UnSubScribeContactsFromSelectedGroup",
        type: 'POST',
        data: JSON.stringify({ 'ContactId': ContactId, 'UnSubScribeGrpSelectedContacts': UnSubScribeGrpSelectedContacts }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response) {
                alert("You have Successfully UnSubScribed from the selected Group!!");
            }
            else {
                alert("Unable to UnSubScribe from the selected Group!!");
            }
        },
        error: ShowAjaxError
    });
});

$.urlParam = function (name) {
    name = name.toLowerCase();
    var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href.toString().toLowerCase());
    if (!results) {
        return 0;
    }
    return results[1] || 0;
};

ShowAjaxError = function (error) {
    $("#dvLoading").hide();
    window.console.log(error);
}

