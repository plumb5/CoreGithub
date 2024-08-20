$(document).ready(function () {
    BindMonthYearDropDown();
});

function BindMonthYearDropDown() {
    var monthNamesList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    for (var i = 0; i < 24; i++) {
        var currentdate = new Date();
        currentdate = new Date(currentdate.setMonth(currentdate.getMonth() - i));
        currentYear = currentdate.getFullYear();
        currentMonth = currentdate.getMonth();
        monthLastDate = new Date(currentYear, currentMonth + 1, 0).getDate();

        var optlist = document.createElement('option');
        optlist.text = monthNamesList[currentMonth] + " " + currentYear;
        optlist.value = currentYear + "-" + AddingPrefixZero(currentMonth + 1) + "-01_" + currentYear + "-" + AddingPrefixZero(currentMonth + 1) + "-" + AddingPrefixZero(monthLastDate);
        document.getElementById("ui_drpMonthYear").options.add(optlist);
    }
    ShowData($("#ui_drpMonthYear option:selected").val());
}


function ShowData(selectedDate) {
    $("#dvLoading").show();
    selectedDate = selectedDate.split("_");
    var fromDateTime = selectedDate[0];
    var toDateTime = selectedDate[1];
    getData(fromDateTime, toDateTime);
}

function getData(fromDateTime, toDateTime) {
    $.ajax({
        url: "/Account/GetPurchaseList",
        type: 'POST',
        data: JSON.stringify({ 'fromDateTime': fromDateTime, 'toDateTime': toDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: bindData,
        error: ShowAjaxError
    });
}
function bindData(response) {
    if (response.length > 0) {
        $("#ui_dvDataHeader").html("<div class='headerstyle'><div style='float: left; width: 70%; text-align: left;'>Details</div><div style='float: left; width: 30%; text-align: right;'>Total</div></div>");
        $("#ui_dvData").html('');
        $.each(response, function (i) {
            var divContent = "";
            divContent += "<div style='float: left; width: 70%; text-align: left;'>" + $(this)[0].featureName + "</div>";
            divContent += "<div style='float: left; width: 30%; text-align: right;'>" + $(this)[0].totalConsumed + "</div>";
            $("#ui_dvData").append("<div class='itemStyle'>" + divContent + "</div>");
        });
    }
    else {
        divContent = "<div class='itemStyle' style='background-color: #FFFEEA;'>No item to show</div>";
        $("#ui_dvDataHeader").html(divContent);
        $("#ui_dvData").html('');
    }
    $("#dvLoading").hide();
}

function AddingPrefixZero(n) {
    return (n < 10) ? ("0" + n) : n;
}

