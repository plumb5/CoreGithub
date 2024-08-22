$(document).ready(function () {
    Top5ActiveUssd();
});
function Top5ActiveUssd() {
    $.ajax({
        url: "/USSD/DashBoard/Top5ActiveUssd",
        type: 'Post',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindUSSDDetails,
        error: ShowAjaxError
    });
}
function BindUSSDDetails(USSDDetailsList) {

    if (USSDDetailsList.length > 0) {
        $("#ui_dvussdContent").show();
        $.each(USSDDetailsList, function () {
            var tdContent = "";
            tdContent = "<div style='float: left; width: 25%;' title='" + $(this)[0].Name + "'>" + ($(this)[0].Name.length > 25 ? $(this)[0].Name.substring(0, 25) + ".." : $(this)[0].Name) + "</div>";
            tdContent += "<div style='float: left; width: 25%;'>" + $(this)[0].ServiceCode + "</div>";

            tdContent += "<div style='float: left; width: 25%;'>" + ($(this)[0].UssdType == 1 ? "Survey" : "Campaign") + "</div>";

            tdContent += "<div style='float: left; width: 25%;text-align: right;'>" + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj($(this)[0].CreatedDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj($(this)[0].CreatedDate)) + "</div>";
            tdContent = "<div id='ui_div_" + $(this)[0].Id + "' class='itemStyle'>" + tdContent + "</div>";

            $("#ui_dvussdData").append(tdContent);

        });
    }
    else {
        $("#ui_dvussdContent").hide();
        $("#dvDefault").show();

    }

}