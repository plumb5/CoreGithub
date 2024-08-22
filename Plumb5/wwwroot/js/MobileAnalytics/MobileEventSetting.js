
var MobileEventSetting = {};
var MobileEventSettingList = new Array();
var UserInfoUserId = 0, maxRowCount = 0, Offset = 0, rowIndex = 0;
var viewMoreDisable = false;

$(document).ready(function () {
    GetMaxCount();
});

function GetMaxCount() {
    $.ajax({
        url: "/MobileAnalytics/MobileApp/GetEventSettingMaxCount",
        type: 'POST',
        data: JSON.stringify({ 'mobileEventSetting': MobileEventSetting }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            maxRowCount = response;
            if (maxRowCount == 0) {
                $("#dvLoading, #ui_dvContent").hide();
                $("#dvDefault").show();
            }
            else if (maxRowCount > 0) {
                $("#dvDefault").hide();
                $(".SmallLabel,.SmallHeight,.dropdownSmallSize,.Export,.textBoxSmallSize,.Export").show();
                var numberOfRecords = GetNumberOfRecordsPerPage();
                CreateTable(numberOfRecords);
                if (maxRowCount > numberOfRecords) {
                    $("#ui_lnkViewMore").show();
                }
            }
        },
        error: ShowAjaxError
    });
}

function ViewMore() {
    if (!viewMoreDisable) {
        $("#dvLoading").show();
        viewMoreDisable = true;
        var numberOfRecords = GetNumberOfRecordsPerPage();
        CreateTable(numberOfRecords);
    }
}

function CreateTable(numberRowsCount) {
    var OffSet = rowIndex;
    var FetchNext = numberRowsCount;

    $.ajax({
        url: "/MobileAnalytics/MobileApp/GetEventSettingList",
        type: 'Post',
        data: JSON.stringify({ 'mobileEventSetting': MobileEventSetting, 'OffSet': OffSet, 'FetchNext': FetchNext }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindEventDetails,
        error: ShowAjaxError
    });
}

function BindEventDetails(response) {
    rowIndex = response.length + rowIndex;
    $("#div_Records").html(rowIndex + " out of " + maxRowCount + " records");

    if (rowIndex == maxRowCount) {
        $("#ui_lnkViewMore").hide();
    }

    if (response.length > 0)
        $("#ui_dvContent").show();

    $("#ui_dvContent").show();

    $.each(response, function () {
        GeneralBinding($(this)[0], "Bind");
    });
}

function GeneralBinding(data, isAddOrUpdate) {
    var tdContent = "<div style='float: left; width: 20%; text-align: left;'>" + data.EventIdentifier + "</div>";
    tdContent += "<div style='float: left; width: 20%; text-align: left;'>" + data.EventName + "</div>";
    tdContent += "<div style='float: left; width: 15%; text-align: left;'>" + data.EventSpecifier + "</div>";
    tdContent += "<div style='float: left; width: 10%; text-align: center;'><a class='DesignPermission' href='javascript:EditDetails(" + data.Id + ");'>Edit</a></div>";
    tdContent += "<div style='float: left; width: 10%; text-align: center;'><a class='FullControlPermission' href='javascript:void(0);' onclick='DeleteConfirmation(" + data.Id + ");'><img src='/images/img_trans.gif' border='0' class='DeleteImg' alt='Delete' title='Delete' style='cursor:pointer'></a></div>";

    var DateValue = new Date();
    if (isAddOrUpdate != "Add")
        DateValue = ConvertUTCDateTimeToLocal(data.UpdatedDate);

    tdContent += "<div style='float: left; width: 20%; text-align: right;'>" + $.datepicker.formatDate("M dd yy", DateValue) + " " + PlumbTimeFormat(DateValue) + "</div>";

    if (isAddOrUpdate == "Add") {
        $('#ui_dvData').prepend("<div id='ui_div_" + data.Id + "' class='itemStyle'>" + tdContent + "</div>");
        MobileEventSettingList.push(data);
    }
    else if (isAddOrUpdate == "Update") {
        $('#ui_div_' + data.Id).html(tdContent);
    }
    else if (isAddOrUpdate == "Bind") {
        $('#ui_dvData').append("<div id='ui_div_" + data.Id + "' class='itemStyle'>" + tdContent + "</div>");
        MobileEventSettingList.push(data);
    }

    $("#dvLoading").hide();
    viewMoreDisable = false;
}

var EditDetails = function (SettingId) {
    var details;
    for (var i = 0; i < MobileEventSettingList.length; i++) {
        if (MobileEventSettingList[i].Id == SettingId) {
            details = MobileEventSettingList[i];
            break;
        }
    }
    if (details != undefined) {
        $("#ui_txtIdentifierName").val(details.EventIdentifier);
        $("#ui_txtEventName").val(details.EventName);
        $("input[name=EventSpecifier][value='" + details.EventSpecifier + "']").prop("checked", true);
        $("#ui_btnAdd").val("Update").attr("EventSettingId", SettingId);
        $("#ui_divCreate").show("fast");
    }
};

$("#ui_lnkAddEvent").click(function () {
    $("#ui_txtIdentifierName").val("");
    $("#ui_txtEventName").val("");
    $("input[name=EventSpecifier][value='Id']").prop("checked", true);
    $("#ui_btnAdd").val("Add Event");
    $("#ui_btnAdd").removeAttr("EventSettingId");
    $("#ui_divCreate").show();
});

$("#ui_btnAdd").click(function () {

    if ($("#ui_txtIdentifierName").val().length == 0) {
        ShowErrorMessage("Please enter identifier name");
        return false;
    }

    if ($("#ui_txtEventName").val().length == 0) {
        ShowErrorMessage("Please enter event name");
        return false;
    }

    $("#dvLoading").show();

    MobileEventSetting = new Object();

    if ($("#ui_btnAdd").attr("EventSettingId") != undefined) {
        MobileEventSetting.Id = $("#ui_btnAdd").attr("EventSettingId");
    }

    MobileEventSetting.EventIdentifier = $("#ui_txtIdentifierName").val();
    MobileEventSetting.EventName = $("#ui_txtEventName").val();
    MobileEventSetting.EventSpecifier = $("input[name='EventSpecifier']:checked").val();

    $.ajax({
        url: "/MobileAnalytics/MobileApp/EventSettingSaveOrUpdate",
        type: 'POST',
        data: JSON.stringify({ 'mobileEventSetting': MobileEventSetting }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            OnCreateAndUpdate(response, MobileEventSetting)
        }
    });

});

var OnCreateAndUpdate = function (response, eventObject) {

    if ($("#ui_btnAdd").attr("EventSettingId") != undefined) {
        if (response.Id > 0) {
            for (var i = 0; i < MobileEventSettingList.length; i++) {
                if (MobileEventSettingList[i].Id == eventObject.Id) {
                    MobileEventSettingList[i].EventIdentifier = eventObject.EventIdentifier;
                    MobileEventSettingList[i].EventName = eventObject.EventName;
                    MobileEventSettingList[i].EventSpecifier = eventObject.EventSpecifier;
                    eventObject.UpdatedDate = MobileEventSettingList[i].UpdatedDate;
                    break;
                }
            }

            GeneralBinding(eventObject, "Update");
            ShowErrorMessage("Updated successfully");
            $("#ui_btnAdd").removeAttr("EventSettingId");
            $("#ui_divCreate").hide();
        }
        else {
            ShowErrorMessage("Please enter a different event as it already exists.");
        }
    }
    else {
        if (response.Id > 0) {
            GeneralBinding(response, "Add");
            setTimeout(function () { $("#ui_div_" + response.Id + "").css("background-color", "#FFF"); }, 3000);
            rowIndex++;
            maxRowCount++;
            $("#div_Records").html(rowIndex + " out of " + maxRowCount + " records");
            ShowErrorMessage("Added successfully");
            $("#ui_dvContent").show();
            $("#ui_divCreate").hide();
        }
        else {
            ShowErrorMessage("Please enter a different event as it already exists.");
        }
    }
    $("#dvLoading").hide();
};

$("#ui_btnCancel").click(function () {
    $("#ui_txtIdentifierName").val("");
    $("#ui_txtEventName").val("");
    $("input[name=EventSpecifier][value='Id']").prop("checked", true);
    $("#ui_btnAdd").val("Add Event");
    $("#ui_btnAdd").removeAttr("EventSettingId");
    $("#ui_divCreate").hide();
});

var ConfirmedDelete = function (Id) {
    $("#dvLoading").show();

    $("#dvDeletePanel").hide();
    $.ajax({
        url: "/MobileAnalytics/MobileApp/EventSettingDelete",
        type: 'POST',
        data: JSON.stringify({ 'Id': Id }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response) {
                --rowIndex;
                --maxRowCount;
                $("#div_Records").html(rowIndex + " out of " + maxRowCount + " records");
                $("#ui_div_" + Id).hide("slow");
                ShowErrorMessage("Deleted successfully");
                if (rowIndex <= 0 || maxRowCount <= 0) {
                    $("#dvLoading, #ui_dvContent,.SmallLabel,.SmallHeight,.dropdownSmallSize,.Export,.textBoxSmallSize").hide();
                    $("#dvDefault").show();
                }
            }
            $("#dvLoading").hide();
        },
        error: ShowAjaxError
    });
};
