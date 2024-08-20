var RestrictionsAvaliable = 0;

$(document).ready(function () {
    BindAccounts();
    HidePageLoading();
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

            GetRestrictions();
        },
        error: ShowAjaxError
    });
};
function GetRestrictions() {
    ShowPageLoading();
    $.ajax({
        url: "/Preference/IpRestrictions/GetRestrictions",
        type: 'POST',
        data: JSON.stringify({ 'AccountId': $("#ddlAccount").val() }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindReport,
        error: ShowAjaxError
    });
}
function BindReport(response) {
    if (response != undefined && response != null) {
        RestrictionsAvaliable = 1;
        $("#IsDeviceTrackingRequired").prop('checked', false);
        if (response.IsDeviceTrackingRequired == true)
            $("#IsDeviceTrackingRequired").prop('checked', true);
        $("#txtIncludeIpAddress").val(response.IncludeIPAddress); $("#txtIncludeSubdirectory").val(response.IncludeSubDirectory); $("#txtIncludeCity").val(response.IncludeCity); $("#txtIncludeCountry").val(response.IncludeCountry);
        $("#txtExcludeIpAddress").val(response.ExcludeIPAddress); $("#txtExcludeSubdirectory").val(response.ExcludeSubDirectory); $("#txtExcludeCity").val(response.ExcludeCity); $("#txtExcludeCountry").val(response.ExcludeCountry);
    }
    HidePageLoading();
}

function SaveAndUpdare() {

    var incIpAddress, incDirectory, incCity, incCountry;
    incIpAddress = $("#txtIncludeIpAddress").val().replace(/[\t\n]+/g, '').trim(); incDirectory = $("#txtIncludeSubdirectory").val().replace(/[\t\n]+/g, '').trim(); incCity = $("#txtIncludeCity").val().replace(/[\t\n]+/g, '').trim(); incCountry = $("#txtIncludeCountry").val().replace(/[\t\n]+/g, '').trim();

    var exIpAddress, exDirectory, exCity, exCountry;
    exIpAddress = $("#txtExcludeIpAddress").val().replace(/[\t\n]+/g, '').trim(); exDirectory = $("#txtExcludeSubdirectory").val().replace(/[\t\n]+/g, '').trim(); exCity = $("#txtExcludeCity").val().replace(/[\t\n]+/g, '').trim(); exCountry = $("#txtExcludeCountry").val().replace(/[\t\n]+/g, '').trim();

    //if (incIpAddress.length == 0 && incDirectory.length == 0 && incCity.length == 0 && incCountry.length == 0 && exIpAddress.length == 0 && exDirectory.length == 0 && exCity.length == 0 && exCountry.length == 0) {
    //    ShowErrorMessage(GlobalErrorList.IpRestrictions.EmptyMessage);
    //    return false;
    //}

    $.ajax({
        url: "/Preference/IpRestrictions/SaveOrUpdateRestrictions",
        type: 'POST',
        data: JSON.stringify({ 'AccountId': $("#ddlAccount").val(), 'IpRestrictions': { 'IsAllowSubdomain':true, 'IncludeIPAddress': incIpAddress, 'IncludeSubDirectory': incDirectory, 'IncludeCity': incCity, 'IncludeCountry': incCountry, 'ExcludeIPAddress': exIpAddress, 'ExcludeSubDirectory': exDirectory, 'ExcludeCity': exCity, 'ExcludeCountry': exCountry, 'IsDeviceTrackingRequired': $("#IsDeviceTrackingRequired").is(":checked") } }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (RestrictionsAvaliable == 1) {
                ShowSuccessMessage(GlobalErrorList.IpRestrictions.Update);
                GetRestrictions();
            } else {
                ShowSuccessMessage(GlobalErrorList.IpRestrictions.Save);
            }
            $("#textchangereflect").removeClass("hideDiv");
        },
        error: ShowAjaxError
    });
}

$("#ddlAccount").change(function () {
    //var selValue = $(this).val();    
    clearfield();
    GetRestrictions();
});

$(".setttabitem").click(function () {
    var checktabcontname = $(this).attr("data-setttype");
    $(".setttabitem").removeClass("active");
    $(".setttabcontainer").addClass("hideDiv");
    $(this).addClass("active");
    $("#" + checktabcontname).removeClass("hideDiv");
});

function clearfield() {
    $("#txtIncludeIpAddress,#txtIncludeSubdirectory,#txtIncludeCity,#txtIncludeCountry").val('');
    $("#txtExcludeIpAddress,#txtExcludeSubdirectory,#txtExcludeCity,#txtExcludeCountry").val('');
}