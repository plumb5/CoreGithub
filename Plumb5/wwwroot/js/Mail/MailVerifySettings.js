var ProviderSetting = { Id: 0, UserInfoUserId: 0, ProviderName: null, IsDefaultProvider: null, IsActive: null, ApiKey: null, UserName: null, Password: null, CreatedDate: new Date() };

function GetEmailVerifySettingsDetails() {
    $.ajax({
        url: "/Mail/MailSettings/GetProviderSettingDetails",
        type: 'POST',
        data: JSON.stringify({ 'AdsId': Plumb5AccountId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response.length > 0) {
                $("#btnEmailVerify").hide();
                BindEmailVerifySettingsDetails(response);
            }
            else {
                SetNoRecordContent('ui_table_EmailVerifyReport', 4, 'ui_tbody_EmailVerifyData');
                HidePageLoading();
            }
        },
        error: ShowAjaxError
    });
}

function BindEmailVerifySettingsDetails(response) {
    var reportTableTrs;
    $.each(response, function () {
        reportTableTrs += "<tr>" +
            "<td><img src='/images/Mail/millionverifier.png' class='mr-2' alt=''><span>" + this.ProviderName + "</span></td>" +
            "<td id='ui_td_EmailVerifyIsActive_" + this.Id + "' class='text-center'>" + (this.IsActive ? "<i onclick='ToggleEmailVerifyStatus(" + this.Id + ", false);' class='icon ion-ios-checkmark-outline'></i>" : "<i onclick='ToggleEmailVerifyStatus(" + this.Id + ", true);' class='fa fa-ban'></i>") + "</td>" +
            "<td>" + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(this.CreatedDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(this.CreatedDate)) + "</td>" +
            "<td class='text-center'><i class='icon ion-edit' data-toggle='modal' data-target='#addEmailVerifySettings' onclick=\"EditProviderSetting(" + this.Id + ",'" + this.ProviderName + "','" + this.ApiKey + "','" + this.APIUrl + "');\"></i></td>" +
            "</tr>";
    });
    $("#ui_table_EmailVerifyReport").removeClass('no-data-records');
    $("#ui_tbody_EmailVerifyData").html(reportTableTrs);
    HidePageLoading();
}

function ToggleEmailVerifyStatus(Id, Status) {
    ShowPageLoading();
    ProviderSetting = new Object();
    ProviderSetting.Id = Id;
    ProviderSetting.IsDefaultProvider = true;
    ProviderSetting.IsActive = Status;
    $.ajax({
        url: "/Mail/MailSettings/SaveorUpdateEmailVerify",
        type: 'POST',
        data: JSON.stringify({ 'AdsId': Plumb5AccountId, 'ProviderSetting': ProviderSetting }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            if (result) {
                $('#ui_td_EmailVerifyIsActive_' + Id).empty();
                if (Status)
                    $('#ui_td_EmailVerifyIsActive_' + Id).append("<i onclick='ToggleEmailVerifyStatus(" + Id + ", false);' class='icon ion-ios-checkmark-outline'></i>");
                else
                    $('#ui_td_EmailVerifyIsActive_' + Id).append("<i onclick='ToggleEmailVerifyStatus(" + Id + ", true);' class='fa fa-ban'></i>");
                ShowSuccessMessage(GlobalErrorList.MailSettings.StatusUpdateEmailVerifySettings_Success);
            }
            HidePageLoading();
        }
    });
}

function EditProviderSetting(ProviderId, ProviderName, ApiKey, ApiUrl) {
    ShowPageLoading();
    ClearProviderSetting();
    $('#ui_h5_EmailVerifyPopUpHeading').html('Edit Provider Name');
    $('#ui_btn_addEmailVerifySettings').html('Update Provider');
    $('#ui_btn_addEmailVerifySettings').attr('data-Action', 'Update');
    $("#ui_btn_addEmailVerifySettings").attr("ProviderId", ProviderId);
    $("#ui_drpdwn_addEmailVerifySettings").val("Million Verifier");
    $('#ui_txt_MailVerifyApiKey').val(ApiKey);
    $('#ui_txt_MailVerifyApiUrl').val(ApiUrl);
    HidePageLoading();
}

function ClearProviderSetting() {
    $("#ui_btn_addEmailVerifySettings").removeAttr("ProviderId");
    $('#ui_h5_EmailVerifyPopUpHeading').html('Add Provider Name');
    $('#ui_btn_addEmailVerifySettings').html('Add Provider');
    $('#ui_btn_addEmailVerifySettings').attr('data-Action', 'Add');
    $("#ui_drpdwn_addEmailVerifySettings").val('Select');
    $('#ui_txt_MailVerifyApiKey').val('');
    $('#ui_txt_MailVerifyApiUrl').val('');
}

$('#ui_btn_addEmailVerifySettings').click(function () {
    var value = CleanText($('#ui_drpdwn_addEmailVerifySettings').val());
    if (value === 'Select') {
        ShowErrorMessage(GlobalErrorList.MailSettings.SelectAddSpamSettings_Error);
        return false;
    }
    if (CleanText($('#ui_txt_MailVerifyApiKey').val()) === "") {
        ShowErrorMessage(GlobalErrorList.MailSettings.emailVerifyApiKey_Error);
        return false;
    }
    if (CleanText($('#ui_txt_MailVerifyApiUrl').val()) === "") {
        ShowErrorMessage(GlobalErrorList.MailSettings.emailVerifyApiUrl_Error);
        return false;
    }

    let RegUrl = /^(http(s)?:\/\/)?(www\.)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
    if (!RegUrl.test(CleanText($("#ui_txt_MailVerifyApiUrl").val()))) {
        ShowErrorMessage(GlobalErrorList.MailSettings.emailVerifyCheckApiUrl_Error);
        return false;
    }
    ShowPageLoading();
    ProviderSetting = {};

    if ($("#ui_btn_addEmailVerifySettings").attr("ProviderId") !== undefined) {
        ProviderSetting.Id = $("#ui_btn_addEmailVerifySettings").attr("ProviderId");
    }
    else {
        ProviderSetting.Id = 0;
    }
    ProviderSetting.ProviderName = $("#ui_drpdwn_addEmailVerifySettings").val();
    ProviderSetting.ApiKey = CleanText($('#ui_txt_MailVerifyApiKey').val());
    ProviderSetting.APIUrl = CleanText($('#ui_txt_MailVerifyApiUrl').val());
    ProviderSetting.IsDefaultProvider = true;
    ProviderSetting.CreatedDate = new Date();
    $.ajax({
        url: "/Mail/MailSettings/SaveorUpdateEmailVerify",
        type: 'POST',
        data: JSON.stringify({ 'AdsId': Plumb5AccountId, 'ProviderSetting': ProviderSetting }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (response) {
            if (response !== null) {
                if (response.Id > 0) {
                    if (ProviderSetting.Id == 0)
                        ShowSuccessMessage(GlobalErrorList.MailSettings.AddEmailVerifySettings_Success);
                    else
                        ShowSuccessMessage(GlobalErrorList.MailSettings.UpdateEmailVerifySettings_Success);
                    $('#ui_tbody_EmailVerifyData').empty();
                    GetEmailVerifySettingsDetails();
                    PreviousTransAPIKey = '';
                }
                else {
                    ShowErrorMessage(GlobalErrorList.MailSettings.AddEmailVerifySettings_Error);
                    HidePageLoading();
                }
            }
            ClearProviderSetting();
        },
        error: ShowAjaxError
    });
});

var PreviousTransAPIKey = '';
$(function () {
    $('#ui_txt_MailVerifyApiKey').focusout(function () {
        if ($("#ui_btn_addEmailVerifySettings").attr("data-Action") != 'Save') {
            if ($('#ui_txt_MailVerifyApiKey').val() == '') {
                $('#ui_txt_MailVerifyApiKey').val(PreviousTransAPIKey);
            }
        }
    });
});
$(function () {
    $('#ui_txt_MailVerifyApiKey').focus(function () {
        if ($("#ui_btn_addEmailVerifySettings").attr("data-Action") != 'Save') {
            if (PreviousTransAPIKey == '')
                PreviousTransAPIKey = $('#ui_txt_MailVerifyApiKey').val();
            $('#ui_txt_MailVerifyApiKey').val('');
        }
    });
});