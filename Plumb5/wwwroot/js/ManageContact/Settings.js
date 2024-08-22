var settings = { PrimaryEmail: false, PrimarySMS: false, AlternateEmail: false, AlternateSMS: false };
settingUtil = {
    GetSettingsDetails: function () {
        $.ajax({
            url: "/ManageContact/Settings/GetSettingDetails",
            type: 'POST',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (settings) {
                if (settings != null && settings.contactMergeConfiguration != null) {

                    if (settings.contactMergeConfiguration.PrimaryEmail == true) {
                        if (!$(document.getElementsByClassName("toggle-on")[0]).hasClass("active"))
                            $(document.getElementsByClassName("toggle-on")[0]).click();
                    } else {
                        if ($(document.getElementsByClassName("toggle-on")[0]).hasClass("active"))
                            $(document.getElementsByClassName("toggle-on")[0]).click();
                    }

                    if (settings.contactMergeConfiguration.PrimarySMS == true) {
                        if (!$(document.getElementsByClassName("toggle-on")[1]).hasClass("active"))
                            $(document.getElementsByClassName("toggle-on")[1]).click();
                    } else {
                        if ($(document.getElementsByClassName("toggle-on")[1]).hasClass("active"))
                            $(document.getElementsByClassName("toggle-on")[1]).click();
                    }

                    if (settings.contactMergeConfiguration.AlternateEmail == true) {
                        if (!$(document.getElementsByClassName("toggle-on")[2]).hasClass("active"))
                            $(document.getElementsByClassName("toggle-on")[2]).click();
                    } else {
                        if ($(document.getElementsByClassName("toggle-on")[2]).hasClass("active"))
                            $(document.getElementsByClassName("toggle-on")[2]).click();
                    }

                    if (settings.contactMergeConfiguration.AlternateSMS == true) {
                        if (!$(document.getElementsByClassName("toggle-on")[3]).hasClass("active"))
                            $(document.getElementsByClassName("toggle-on")[3]).click();
                    } else {
                        if ($(document.getElementsByClassName("toggle-on")[3]).hasClass("active"))
                            $(document.getElementsByClassName("toggle-on")[3]).click();
                    }

                    $("#ui_btnSaveContactSetting").addClass("disableDiv");
                    $("#bwsnotisettcollapsetwo").addClass("disableDiv");

                } else {
                    //PrimaryEmail
                    if (!$(document.getElementsByClassName("toggle-on")[0]).hasClass("active"))
                        $(document.getElementsByClassName("toggle-on")[0]).click();

                    //PrimarySMS
                    if (!$(document.getElementsByClassName("toggle-on")[1]).hasClass("active"))
                        $(document.getElementsByClassName("toggle-on")[1]).click();

                    //AlternateEmail
                    if (!$(document.getElementsByClassName("toggle-on")[2]).hasClass("active"))
                        $(document.getElementsByClassName("toggle-on")[2]).click();

                    //AlternateSMS
                    if (!$(document.getElementsByClassName("toggle-on")[3]).hasClass("active"))
                        $(document.getElementsByClassName("toggle-on")[3]).click();
                }
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },
    SaveSettings: function () {
        ShowPageLoading();
        //PrimaryMail
        settings.PrimaryEmail = $(document.getElementsByClassName("toggle-on")[0]).hasClass("active") ? true : false;

        //PrimarySMS
        settings.PrimarySMS = $(document.getElementsByClassName("toggle-on")[1]).hasClass("active") ? true : false;

        //AlternateEmail
        settings.AlternateEmail = $(document.getElementsByClassName("toggle-on")[2]).hasClass("active") ? true : false;

        //AlternateSMS
        settings.AlternateSMS = $(document.getElementsByClassName("toggle-on")[3]).hasClass("active") ? true : false;

        if (settings.AlternateEmail == true && settings.PrimaryEmail == false) {
            ShowErrorMessage(GlobalErrorList.ManageContactSettings.PrimaryEmailMissing);
            HidePageLoading();
            return false;
        }

        if (settings.AlternateSMS == true && settings.PrimarySMS == false) {
            ShowErrorMessage(GlobalErrorList.ManageContactSettings.PrimarySMSMissing);
            HidePageLoading();
            return false;
        }

        $.ajax({
            url: "/ManageContact/Settings/Save",
            type: 'POST',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'settings': settings }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response > 0) {
                    ShowSuccessMessage(GlobalErrorList.ManageContactSettings.SaveSuccessMessage);
                } else {
                    ShowErrorMessage(GlobalErrorList.ManageContactSettings.UnableToSaveMessage);
                }
                HidePageLoading();
            },
            error: ShowAjaxError
        });

    }
};

$(document).ready(() => {
    settingUtil.GetSettingsDetails();
});

$(".contactssett").toggles({
    on: false,
    width: 50,
    height: 22,
    text: {
        on: '', // text for the ON position
        off: '' // and off
    }
});

$(document.getElementsByClassName("toggle-off")[2]).click(function () {
    if (!$(document.getElementsByClassName("toggle-on")[0]).hasClass("active")) {
        $(document.getElementsByClassName("toggle-on")[0]).click();
    }
});

$(document.getElementsByClassName("toggle-off")[3]).click(function () {
    if (!$(document.getElementsByClassName("toggle-on")[1]).hasClass("active")) {
        $(document.getElementsByClassName("toggle-on")[1]).click();
    }
});

$("#ui_btnSaveContactSetting").click(function () {
    settingUtil.SaveSettings();
});