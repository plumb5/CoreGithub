var timeZoneUtil = {
    GetAccountDetails: function () {
        ShowPageLoading();
        $.ajax({
            url: "/Preference/IpRestrictions/GetAccounts",
            type: 'POST',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                $.each(response, function () {
                    $('#ddlAccount').append('<option value=' + $(this)[0].AccountId + '>' + $(this)[0].AccountName + '</option>');
                });

                $('#ddlAccount').val(Plumb5AccountId.toString());
                timeZoneUtil.GetTimeZoneDetails(Plumb5AccountId);
            },
            error: ShowAjaxError
        });
    },
    SaveTimeZone: function () {
        if ($("#ui_timezoneoffset option:selected").val() == "0") {
            ShowErrorMessage(GlobalErrorList.AccountTimeZone.SelectTimeZone);
            return false;
        }
        ShowPageLoading();
        $.ajax({
            url: "/Preference/TimeZone/SaveTimeZone",
            type: 'POST',
            data: JSON.stringify({ 'AccountId': $("#ddlAccount").val(), 'TimeZoneName': $("#ui_timezoneoffset").val(), 'TimeZoneTitle': CleanText($("#ui_timezoneoffset option:selected").attr("title")) }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response > 0) {
                    ShowSuccessMessage(GlobalErrorList.AccountTimeZone.SavedSuccessfully);
                } else {
                    ShowErrorMessage(GlobalErrorList.AccountTimeZone.UnableToSave);
                }

                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },
    GetTimeZoneDetails: function (AdsId) {
        ShowPageLoading();
        $.ajax({
            url: "/Preference/TimeZone/GetTimeZone",
            type: 'POST',
            data: JSON.stringify({ 'AccountId': AdsId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != null) {
                    $("#ui_timezoneoffset").val(response.TimeZone);
                }
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },
    BindTimeZoneByAccount: function () {
        let AdsId = $("#ddlAccount").val();
        timeZoneUtil.GetTimeZoneDetails(AdsId);
    }
};

$(document).ready(function () {
    timeZoneUtil.GetAccountDetails();
});

$("#ui_Savetimezone").click(function () {
    timeZoneUtil.SaveTimeZone();
});

$("#ddlAccount").change(function () {
    timeZoneUtil.BindTimeZoneByAccount();
});
