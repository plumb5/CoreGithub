
var TimeRestrictionData = { IsTimeRestriction: 0, WeekDays: 0, WeekDayStartTime: null, WeekDayEndTime: null, Saturday: 0, SaturdayStartTime: null, SaturdayEndTime: null, Sunday: 0, SundayStartTime: null, SundayEndTime: null }

$(document).ready(function () {
    GetTimeRestrictionData();

});

$("#radTimeRestrictionYes").click(function () {
    $("#ui_dvContent").show();

});

$("#radTimeRestrictionNo").click(function () {
    $("#ui_dvContent").hide();
});

//Get the values
$("#btnsaveGovernance").click(function () {
    $("#dvLoading").show();
    if (!ValidationGovernance()) {
        $("#dvLoading").hide();
        return;
    }

    if ($("#radTimeRestrictionYes").prop("checked")) {
        TimeRestrictionData.IsTimeRestriction = 1;

        if ($("#chckweekdaysYes").is(":checked")) {
            TimeRestrictionData.WeekDays = 1;
            TimeRestrictionData.WeekDayStartTime = $("#weekdaysStartTime").val();
            TimeRestrictionData.WeekDayEndTime = $("#weekdaysEndTime").val();
        }

        if ($("#chckSaturdayYes").is(":checked")) {
            TimeRestrictionData.Saturday = 1;
            TimeRestrictionData.SaturdayStartTime = $("#saturdayStartTime").val();
            TimeRestrictionData.SaturdayEndTime = $("#saturdayEndTime").val();
        }

        if ($("#chckSundayYes").is(":checked")) {
            TimeRestrictionData.Sunday = 1;
            TimeRestrictionData.SundayStartTime = $("#sundayStartTime").val();
            TimeRestrictionData.SundayEndTime = $("#sundayEndTime").val();
        }
    }
    else if ($("#radTimeRestrictionNo").prop("checked")) {
        TimeRestrictionData = { IsTimeRestriction: 0, WeekDays: 0, WeekDayStartTime: null, WeekDayEndTime: null, Saturday: 0, SaturdayStartTime: null, SaturdayEndTime: null, Sunday: 0, SundayStartTime: null, SundayEndTime: null };
    }
    SaveSmsGovernanceConfiguration(TimeRestrictionData);

});


function ValidationGovernance() {

    if ($("#radTimeRestrictionYes").prop("checked")) {
        if (!($("#chckweekdaysYes").is(":checked") || $("#chckSaturdayYes").is(":checked") || $("#chckSundayYes").is(":checked"))) {
            ShowErrorMessage("Please select any one action");
            return false;
        }
    }
    return true;
};

//Save in GovernanceConfiguration in Sms
function SaveSmsGovernanceConfiguration(TimeRestrictionData) {
    $.ajax({
        url: "/GovernanceConfiguration/UpdateSmsGovernanceConfiguration",
        type: 'POST',
        data: JSON.stringify({ 'TimeRestrictionData': TimeRestrictionData }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response) {
                SaveMailGovernanceConfiguration(TimeRestrictionData);
            }
            else {
                ShowErrorMessage("Unable to Save data.");
                $("#dvLoading").hide();
            }

        },
        error: ShowAjaxError
    });

};

//Save in GovernanceConfiguration in Mail
function SaveMailGovernanceConfiguration(TimeRestrictionData) {
    $.ajax({
        url: "/GovernanceConfiguration/UpdateMailGovernanceConfiguration",
        type: 'POST',
        data: JSON.stringify({ 'TimeRestrictionData': TimeRestrictionData }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response) {
                ShowErrorMessage("TimeRestriction Saved Successfully.");
            }
            else {
                ShowErrorMessage("Unable to Save data.");
            }
            $("#dvLoading").hide();
        },
        error: ShowAjaxError
    });

};


//bind time restriction data

function GetTimeRestrictionData() {
    $("#dvLoading").show();
    $.ajax({
        url: "/GovernanceConfiguration/GetTimeRestrictionData",
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindDetails,
        error: ShowAjaxError
    });

}


function BindDetails(responseData) {

    if (responseData.IsTimeRestriction == 1) {
        $("#radTimeRestrictionYes").prop("checked", true);


        if (responseData.WeekDays == 1) {
            $("#chckweekdaysYes").prop("checked", true);
            if (responseData.WeekDayStartTime != null && responseData.WeekDayStartTime != "") {
                let Hours = responseData.WeekDayStartTime.Hours < 10 ? '0' + responseData.WeekDayStartTime.Hours : responseData.WeekDayStartTime.Hours;
                let Minutes = responseData.WeekDayStartTime.Minutes < 10 ? '0' + responseData.WeekDayStartTime.Minutes : responseData.WeekDayStartTime.Minutes;
                $("#weekdaysStartTime").val(Hours + ":" + Minutes);
            }

            if (responseData.WeekDayEndTime != null && responseData.WeekDayEndTime != "") {
                let Hours = responseData.WeekDayEndTime.Hours < 10 ? '0' + responseData.WeekDayEndTime.Hours : responseData.WeekDayEndTime.Hours;
                let Minutes = responseData.WeekDayEndTime.Minutes < 10 ? '0' + responseData.WeekDayEndTime.Minutes : responseData.WeekDayEndTime.Minutes;
                $("#weekdaysEndTime").val(Hours + ":" + Minutes);
            }

        }

        if (responseData.Saturday == 1) {
            $("#chckSaturdayYes").prop("checked", true);
            if (responseData.SaturdayStartTime != null && responseData.SaturdayStartTime != "") {
                let Hours = responseData.SaturdayStartTime.Hours < 10 ? '0' + responseData.SaturdayStartTime.Hours : responseData.SaturdayStartTime.Hours;
                let Minutes = responseData.SaturdayStartTime.Minutes < 10 ? '0' + responseData.SaturdayStartTime.Minutes : responseData.SaturdayStartTime.Minutes;
                $("#saturdayStartTime").val(Hours + ":" + Minutes);
            }

            if (responseData.SaturdayEndTime != null && responseData.SaturdayEndTime != "") {
                let Hours = responseData.SaturdayEndTime.Hours < 10 ? '0' + responseData.SaturdayEndTime.Hours : responseData.SaturdayEndTime.Hours;
                let Minutes = responseData.SaturdayEndTime.Minutes < 10 ? '0' + responseData.SaturdayEndTime.Minutes : responseData.SaturdayEndTime.Minutes;
                $("#saturdayEndTime").val(Hours + ":" + Minutes);
            }

        }

        if (responseData.Sunday == 1) {
            $("#chckSundayYes").prop("checked", true);
            if (responseData.SundayStartTime != null && responseData.SundayStartTime != "") {
                let Hours = responseData.SundayStartTime.Hours < 10 ? '0' + responseData.SundayStartTime.Hours : responseData.SundayStartTime.Hours;
                let Minutes = responseData.SundayStartTime.Minutes < 10 ? '0' + responseData.SundayStartTime.Minutes : responseData.SundayStartTime.Minutes;
                $("#sundayStartTime").val(Hours + ":" + Minutes);
            }

            if (responseData.SundayEndTime != null && responseData.SundayEndTime != "") {
                let Hours = responseData.SundayEndTime.Hours < 10 ? '0' + responseData.SundayEndTime.Hours : responseData.SundayEndTime.Hours;
                let Minutes = responseData.SundayEndTime.Minutes < 10 ? '0' + responseData.SundayEndTime.Minutes : responseData.SundayEndTime.Minutes;
                $("#sundayEndTime").val(Hours + ":" + Minutes);
            }
        }
        $("#ui_dvContent").show();
    }
    else {
        $("#radTimeRestrictionYes").prop("checked", false);
    }
    $("#dvLoading").hide();
}