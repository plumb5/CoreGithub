$(document).ready(function () {
    HidePageLoading();
    GetFromCookiee();
});


function UpdateOrSave() {
    let noofday = $("#setdaterangedrp").val();
    if (noofday == "-1") {
        ShowErrorMessage("Please select a date range or week, month, today");
    } else {
        if (noofday != "5") {
            setDateRangeCookie(p5daterangesetCookieeName, noofday, 365);
        } else {
            let startvalue = $("#startdate").val();
            let endvalue = $("#enddate").val();


            if (isFromBiggerThanTo(startvalue, endvalue)) {
                ShowErrorMessage("From date must be Less than To date.");
                $("#startdate").focus();
                return false;
            }

            setDateRangeCookie(p5daterangesetCookieeName, `5~${startvalue}~${endvalue}`, 365);
        }
        ShowSuccessMessage("Updated successfully");
    }
}

$("#setdaterangedrp").change(function () {
    let setdaterangeval = $("#setdaterangedrp option:selected").val();
    if (setdaterangeval == "5") {
        $(".customdatewrap .dateBoxWrap").addClass("showFlx");
    } else {
        $(".customdatewrap .dateBoxWrap").removeClass("showFlx");
    }
});

$("#startdate").datepicker({
    changeMonth: true,
    changeYear: true,
    prevText: "click for previous months",
    nextText: "click for next months",
    showOtherMonths: true,
    selectOtherMonths: false,
});
$("#enddate").datepicker({
    changeMonth: true,
    changeYear: true,
    prevText: "click for previous months",
    nextText: "click for next months",
    showOtherMonths: true,
    selectOtherMonths: true,
});


function setDateRangeCookie(name, value, daysToExpire) {
    var date = new Date();
    date.setTime(date.getTime() + (daysToExpire * 24 * 60 * 60 * 1000)); // Convert days to milliseconds
    var expires = "expires=" + date.toUTCString();
    document.cookie = `${name}_${Plumb5AccountId}` + "=" + value + ";" + expires + ";path=/";
    return true;
}

function clearDateRangeCookie(name) {
    /*document.cookie = `${name}_${Plumb5AccountId}` + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";*/
    setDateRangeCookie(name, 2, 365);
    ShowSuccessMessage("Cleared successfully");
    setTimeout(location.reload(), 10000);
    return true;
}


function GetFromCookiee() {
    let cookieevalue = getDateRangeCookie(p5daterangesetCookieeName);

    if (cookieevalue == "1") {
        $("#setdaterangedrp").val(cookieevalue).change();
    } else if (cookieevalue == "2") {
        $("#setdaterangedrp").val(cookieevalue).change();
    } else if (cookieevalue == "3") {
        $("#setdaterangedrp").val(cookieevalue).change();
    } else if (cookieevalue.split("~")[0] == "5") {
        $("#setdaterangedrp").val(cookieevalue.split("~")[0]).change();
        $("#startdate").val(cookieevalue.split("~")[1]);
        $("#enddate").val(cookieevalue.split("~")[2]);
        $(".customdatewrap .dateBoxWrap").addClass("showFlx");
    }
    else {
        $("#setdaterangedrp").val("-1").change()
    }

}

function getDateRangeCookie(name) {
    name = `${name}_${Plumb5AccountId}`;
    var cookieValue = null;
    var cookies = document.cookie.split(';');

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim();

        // Check if this cookie has the name we're looking for
        if (cookie.indexOf(name + '=') === 0) {
            // Get the value of the cookie
            cookieValue = cookie.substring(name.length + 1, cookie.length);
            break;
        }
    }

    return decodeURIComponent(cookieValue);
}