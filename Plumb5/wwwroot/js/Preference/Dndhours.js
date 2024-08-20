var DndHour = { IsTimeRestriction: true, WeekDays: true, Saturday: false, Sunday: false };
var startHour = 0, startMinutes = 0, endHour = 0, endMinutes = 0;
$(document).ready(function () {
    BindAccounts();
});

function BindAccounts() {
    $.ajax({
        url: "/Preference/IpRestrictions/GetAccounts",
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            $.each(response, function () {
                $('#ddlAccount').append('<option value=' + $(this)[0].AccountId + '>' + $(this)[0].AccountName + '</option>');
            });

            dnHourutil.GetGovernanceDetails();
        },
        error: ShowAjaxError
    });
};

var dnHourutil = {
    SaveHours: function () {
        //if (!dnHourutil.Validate()) {
        //    return false;
        //}

        ShowPageLoading();
        dnHourutil.AssignValue();

        $.ajax({
            url: "/Preference/DndHours/SaveDndHour",
            type: 'POST',
            data: JSON.stringify({ 'AccountId': $("#ddlAccount").val(), 'dndHour': DndHour, 'startHour': startHour, 'startMinutes': startMinutes, 'endHour': endHour, 'endMinutes': endMinutes }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != null && (response.Mail || response.Sms)) {
                    ShowSuccessMessage(GlobalErrorList.DndHours.SavedSuccessfuly);
                } else {
                    ShowErrorMessage(GlobalErrorList.DndHours.UnableToSave);
                }
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },
    Validate: function () {
        if ($("#ui_selectDndHours").val() == "0") {
            ShowErrorMessage(GlobalErrorList.DndHours.SelectDndHour);
            return false;
        }

        return true;
    },
    AssignValue: function () {
        if ($("#ui_selectDndHours option:selected").val() == "Weekdays") {
            DndHour.WeekDays = true;
            DndHour.Saturday = false;
            DndHour.Sunday = false;
        } else if ($("#ui_selectDndHours option:selected").val() == "Saturday") {
            DndHour.WeekDays = false;
            DndHour.Saturday = true;
            DndHour.Sunday = false;
        } else if ($("#ui_selectDndHours option:selected").val() == "Sunday") {
            DndHour.WeekDays = false;
            DndHour.Saturday = false;
            DndHour.Sunday = true;
        } else if ($("#ui_selectDndHours option:selected").val() == "0") {
            DndHour.WeekDays = false;
            DndHour.Saturday = false;
            DndHour.Sunday = false;
            DndHour.IsTimeRestriction = false;
        }

        if ($("#ui_selectDndHours option:selected").val() != "0") {
            if ($("#ui_selectStartPMAM option:selected").val() == "PM") {
                startHour = dnHourutil.ConvertHourTo24HourFormat($("#ui_selectStartHour").val());
                startMinutes = $("#ui_selectStartminute").val();
            } else {
                startHour = $("#ui_selectStartHour").val();
                if (startHour == "12") {
                    startHour = "0";
                }
                startMinutes = $("#ui_selectStartminute").val();
            }


            if ($("#ui_selectEndAMPM option:selected").val() == "PM") {
                endHour = dnHourutil.ConvertHourTo24HourFormat($("#ui_selectEndHour").val());
                endMinutes = $("#ui_selectEndminute").val();
            } else {
                endHour = $("#ui_selectEndHour").val();
                if (endHour == "12") {
                    endHour = "0";
                }
                endMinutes = $("#ui_selectEndminute").val();
            }
        } else {
            startHour = 0;
            startMinutes = 0;
            endHour = 0;
            endMinutes = 0;
        }

    },
    ConvertHourTo24HourFormat: function (hourValue) {
        switch (hourValue) {
            case "1":
                hourValue = "13";
                break;
            case "2":
                hourValue = "14";
                break;
            case "3":
                hourValue = "15";
                break;
            case "4":
                hourValue = "16";
                break;
            case "5":
                hourValue = "17";
                break;
            case "6":
                hourValue = "18";
                break;
            case "7":
                hourValue = "19";
                break;
            case "8":
                hourValue = "20";
                break;
            case "9":
                hourValue = "21";
                break;
            case "10":
                hourValue = "22";
                break;
            case "11":
                hourValue = "23";
                break;
            case "12":
                hourValue = "00";
                break;
        }
        return hourValue;
    },
    Convert24HourToHourFormat: function (hourValue) {
        switch (hourValue) {
            case "13":
                hourValue = "1";
                break;
            case "14":
                hourValue = "2";
                break;
            case "15":
                hourValue = "3";
                break;
            case "16":
                hourValue = "4";
                break;
            case "17":
                hourValue = "5";
                break;
            case "18":
                hourValue = "6";
                break;
            case "19":
                hourValue = "7";
                break;
            case "20":
                hourValue = "8";
                break;
            case "21":
                hourValue = "9";
                break;
            case "22":
                hourValue = "10";
                break;
            case "23":
                hourValue = "11";
                break;
            case "0":
                hourValue = "12";
                break;
        }
        return hourValue;
    },
    GetGovernanceDetails: function () {
        ShowPageLoading();
        $.ajax({
            url: "/Preference/DndHours/GetDndHourDetails",
            type: 'POST',
            data: JSON.stringify({ 'AccountId': parseInt($("#ddlAccount").val())}),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != null) {
                    if (response.WeekDays == true) {
                        $("#ui_selectDndHours").val("Weekdays");
                    } else if (response.Saturday == true) {
                        $("#ui_selectDndHours").val("Saturday");
                    } else if (response.Sunday == true) {
                        $("#ui_selectDndHours").val("Sunday");
                    }

                    if (response.startHour > 12) {
                        let Hour = dnHourutil.Convert24HourToHourFormat(response.startHour.toString());
                        $("#ui_selectStartHour").val(Hour);
                        $("#ui_selectStartPMAM").val("PM");
                    } else if (response.startHour == 12 && (response.startMinutes > 0 || response.endMinutes == 0)) {
                        $("#ui_selectStartHour").val(response.startHour);
                        $("#ui_selectStartPMAM").val("PM");
                    } else if (response.startHour == 0) {
                        $("#ui_selectStartHour").val("12");
                        $("#ui_selectStartPMAM").val("AM");
                    } else {
                        $("#ui_selectStartHour").val(response.startHour);
                        $("#ui_selectStartPMAM").val("AM");
                    }

                    $("#ui_selectStartminute").val(response.startMinutes);

                    if (response.endHour > 12) {
                        let Hour = dnHourutil.Convert24HourToHourFormat(response.endHour.toString());
                        $("#ui_selectEndHour").val(Hour);
                        $("#ui_selectEndAMPM").val("PM");
                    } else if (response.endHour == 12 && (response.endMinutes > 0 || response.endMinutes == 0)) {
                        $("#ui_selectEndHour").val(response.startHour);
                        $("#ui_selectEndAMPM").val("PM");
                    } else if (response.endHour == 0) {
                        $("#ui_selectEndHour").val("12");
                        $("#ui_selectEndAMPM").val("AM");
                    } else {
                        $("#ui_selectEndHour").val(response.endHour);
                        $("#ui_selectEndAMPM").val("AM");
                    }

                    $("#ui_selectEndminute").val(response.endMinutes);

                }
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    }
};

$(".adddndhourslot").click(function () {
    dnHourutil.SaveHours();
});

$("#ddlAccount").change(function () {
    clearfield();
    dnHourutil.GetGovernanceDetails();
});

function clearfield() {
    $("#ui_selectDndHours,#ui_selectStartminute,#ui_selectEndminute").val('0').change();
    $("#ui_selectStartHour").val('10').change();
    $("#ui_selectStartPMAM").val('AM').change();
    $("#ui_selectEndHour").val('7').change();
    $("#ui_selectEndAMPM").val('PM').change();
}