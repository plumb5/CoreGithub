var ProviderSetting = { Id: 0, UserInfoUserId: 0, ProviderName: null, IsDefaultProvider: null, IsActive: null, ApiKey: null, UserName: null, Password: null, CreatedDate: new Date() };

function GetSpamVerifySettingsDetails() {
    $.ajax({
        url: "/Mail/MailSettings/GetSpamScoreSettingDetails",
        type: 'POST',
        data: JSON.stringify({ 'AdsId': Plumb5AccountId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response.length > 0) {
                $("#btnProvider").hide();
                BindSpamVerifySettingsDetails(response);
            }
            else {
                SetNoRecordContent('ui_table_SpamVerifyReport', 3, 'ui_tbody_SpamVerifyData');
                HidePageLoading();
            }
        },
        error: ShowAjaxError
    });
}

function BindSpamVerifySettingsDetails(response) {
    var reportTableTrs;
    $.each(response, function () {
        var status = this.IsActive ? "<i onclick='ToggleSpamVerifyStatus(" + this.Id + ", false);' class='icon ion-ios-checkmark-outline'></i>" : "<i onclick='ToggleSpamVerifyStatus(" + this.Id + ", true);' class='fa fa-ban'></i>";
        reportTableTrs += "<tr>" +
            "<td><img src='/images/Mail/mail-tester.png' class='mr-2' alt=''><span>" + this.ProviderName + "</span></td>" +
            "<td id='ui_td_SpamIsActive_" + this.Id + "' class='text-center'>" + status + "</td>" +
            "<td>" + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(this.CreatedDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(this.CreatedDate)) + "</td>" +
            "</tr>";
    });
    $("#ui_table_SpamVerifyReport").removeClass('no-data-records');
    $("#ui_tbody_SpamVerifyData").html(reportTableTrs);
    HidePageLoading();
}

function ToggleSpamVerifyStatus(Id, Status) {
    ShowPageLoading();
    ProviderSetting = new Object();
    ProviderSetting.Id = Id;
    ProviderSetting.IsDefaultProvider = true;
    ProviderSetting.IsActive = Status;
    $.ajax({
        url: "/Mail/MailSettings/SaveorUpdateSpamScore",
        type: 'POST',
        data: JSON.stringify({ 'AdsId': Plumb5AccountId, 'ProviderSetting': ProviderSetting }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            if (result) {
                $('#ui_td_SpamIsActive_' + Id).empty();
                if (Status)
                    $('#ui_td_SpamIsActive_' + Id).append("<i onclick='ToggleSpamVerifyStatus(" + Id + ", false);' class='icon ion-ios-checkmark-outline'></i>");
                else
                    $('#ui_td_SpamIsActive_' + Id).append("<i onclick='ToggleSpamVerifyStatus(" + Id + ", true);' class='fa fa-ban'></i>");
                ShowSuccessMessage(GlobalErrorList.MailSettings.StatusUpdateSpamSettings_Success);
            }
            HidePageLoading();
        }
    });
}

$('#ui_btn_AddSpamVerifySettings').click(function () {
    var value = CleanText($('#ui_drpdwn_AddSpamVerifySettings').val());
    if (value === 'Select') {
        ShowErrorMessage(GlobalErrorList.MailSettings.SelectAddSpamSettings_Error);
        return false;
    }
    ShowPageLoading();
    ProviderSetting = {};
    ProviderSetting.ProviderName = $("#ui_drpdwn_AddSpamVerifySettings").val();
    ProviderSetting.IsDefaultProvider = true;
    ProviderSetting.CreatedDate = new Date();
    $.ajax({
        url: "/Mail/MailSettings/SaveorUpdateSpamScore",
        type: 'POST',
        data: JSON.stringify({ 'AdsId': Plumb5AccountId, 'ProviderSetting': ProviderSetting }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (response) {
            if (response !== null) {
                if (response.Id > 0) {
                    ShowSuccessMessage(GlobalErrorList.MailSettings.AddSpamSettings_Success);
                    $('#ui_tbody_SpamVerifyData').empty();
                    GetSpamVerifySettingsDetails();
                }
                else {
                    ShowErrorMessage(GlobalErrorList.MailSettings.AddSpamSettings_Error);
                    HidePageLoading();
                }
            }
        },
        error: ShowAjaxError
    });
});