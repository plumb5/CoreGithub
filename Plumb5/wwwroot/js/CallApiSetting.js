
var callApiConfiguration =
    {
        Id: 0, ProviderName: "", IsDefaultProvider: 0, ApiKey: "",
        ServiceCallbackUrlForReport: "",
        IsPromotionalOrTransactionalType: 0, AccountName: "", CallerId: ""
    };

var ConfigurationDetails = new Array();

$(document).ready(function () {
    $("#dvLoading").hide();
    Get();
});

function Get() {
    $.ajax({
        url: "/Connector/GetClickToCallDetails",
        type: 'Post',
        data: JSON.stringify({ 'callApiConfiguration': callApiConfiguration }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            BindConfigurationDetails(response);

        },
        error: ShowAjaxError
    });
}

function BindConfigurationDetails(ConfigDetails) {

    var IsPromoitional = 0, IsTransactional = 0;
    if (ConfigDetails.length > 0) {

        for (var i = 0; i < ConfigDetails.length; i++) {
            if (ConfigDetails[i].IsPromotionalOrTransactionalType == 0)
                IsPromoitional++;
            else if (ConfigDetails[i].IsPromotionalOrTransactionalType == 1)
                IsTransactional++;
        }

        if (IsPromoitional != 2)
            $("#link_Promotional").show();

        if (IsTransactional != 2)
            $("#link_Transactional").show();

        $("#ui_dvContent").show();

        $.each(ConfigDetails, function () {
            GeneralBinding($(this)[0], "Bind");
        });
    }
    else {
        $("#link_Promotional, #link_Transactional, #dvDefault").show();
        $("#ui_dvContent").hide();
    }
    $("#dvLoading").hide();
}

function GeneralBinding(data, isAddOrUpdate) {

    var tdContent = "<div style='float: left; width: 20%; text-align: left;' id='Provider_" + data.Id + "'>" + data.ProviderName + "</div>";

    if (data.IsPromotionalOrTransactionalType == false)
        tdContent += "<div style='float: left; width: 20%; text-align: left;' id='Promotional_" + data.Id + "'>Promotional</div>";
    else if (data.IsPromotionalOrTransactionalType == true)
        tdContent += "<div style='float: left; width: 20%; text-align: left;' id='Transactional_" + data.Id + "'>Transactional</div>";

    if (data.ActiveStatus == true)
        tdContent += "<div style='float: left; width: 20%;text-align: center;'><img id='imgStatus_" + data.Id + "' src='/images/img_trans.gif' class='ActiveImg ContributePermission' onclick='ToogleStatus(" + data.Id + ");' border='0' alt='Active' title='Toogle to active' style='border:0px;cursor:pointer'/></div>";
    else if (data.ActiveStatus == false)
        tdContent += "<div style='float: left; width: 20%;text-align: center;'><img id='imgStatus_" + data.Id + "' src='/images/img_trans.gif' class='InactiveImg ContributePermission'  src='/images/img_trans.gif' onclick='ToogleStatus(" + data.Id + ");' border='0' alt='Stoped' title='Toogle to Inactive' style='border:0px;cursor:pointer'/></div>";

    if (isAddOrUpdate == "Add")
        tdContent += "<div style='float: left; width: 20%; text-align: right'>" + $.datepicker.formatDate("M dd yy", new Date()) + " " + PlumbTimeFormat(new Date()) + "</div>";
    else if (isAddOrUpdate == "Bind" || isAddOrUpdate == "Update")
        tdContent += "<div style='float: left; width: 20%; text-align: right'>" + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(data.CreatedDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(data.CreatedDate)) + "</div>";

    tdContent += "<div style='float: left; width: 20%; text-align: right'><a href='javascript:EditDetails(" + data.Id + ");'>Edit</a></div>";

    if (isAddOrUpdate == "Add" || isAddOrUpdate == "Bind") {
        $('#ui_dvData').append("<div id='ui_div_" + data.Id + "' class='itemStyle'>" + tdContent + "</div>");
        ConfigurationDetails.push(data);
    }
    else if (isAddOrUpdate == "Update") {
        $('#ui_div_' + data.Id).html(tdContent);

        for (var i = 0; i < ConfigurationDetails.length; i++) {
            if (ConfigurationDetails[i].Id == data.Id) {
                ConfigurationDetails.splice(i, 1);
            }
        }
        ConfigurationDetails.push(data);
    }
    data = null;
    $("#dvLoading").hide();
}


$("input:radio[name='OnDefaultConfig']").click(function () {
    if ($("#ui_radYes").is(":checked"))
        $("#ui_txtCustomService").hide();
    else if ($("#ui_radNo").is(":checked"))
        $("#ui_txtCustomService").show();
});

$("#btnAdd").click(function () {

    if (!ValidateConfiguration()) {
        return;
    }

    var callApiConfigurationObject = new Object();

    callApiConfigurationObject.ProviderName = $("#ui_dvProviderName").val();
    if ($("input:radio[name='IsPromotionalOrTransactional']:checked").val() == "1")
        callApiConfigurationObject.IsPromotionalOrTransactionalType = 1;
    else
        callApiConfigurationObject.IsPromotionalOrTransactionalType = 0;

    if ($("input:radio[name='OnDefaultConfig']:checked").val() == "1") {
        callApiConfigurationObject.IsDefaultProvider = 1;
        callApiConfigurationObject.ApiKey = $("#txtApiKey").val();
        callApiConfigurationObject.AccountName = $("#txtAccountName").val();
        callApiConfigurationObject.CallerId = $("#txtExotelCallerId").val();
    }
    else {
        callApiConfigurationObject.IsDefaultProvider = 0;
    }

    if ($("#btnAdd").attr("ClickToCallConfigurationId") != undefined) {
        callApiConfigurationObject.Id = $("#btnAdd").attr("ClickToCallConfigurationId");
    }

    if (callApiConfigurationObject.Id == 0 || callApiConfigurationObject.Id == null || callApiConfigurationObject.Id == undefined) {
        for (var i = 0; i < ConfigurationDetails.length; i++) {
            if (ConfigurationDetails[i].ProviderName == $("#ui_dvProviderName").val() && ConfigurationDetails[i].IsPromotionalOrTransactionalType == $("input:radio[name='IsPromotionalOrTransactional']:checked").val()) {
                callApiConfigurationObject.Id = ConfigurationDetails[i].Id;
            }
        }
    }

    $.ajax({
        url: "/Connector/SaveOrUpdateClickToCall",
        type: 'Post',
        data: JSON.stringify({ 'callApiConfiguration': callApiConfigurationObject }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            OnCreateAndUpdate(response, callApiConfigurationObject)
        },
        error: ShowAjaxError
    });
})

OnCreateAndUpdate = function (response, callApiConfigurationObject) {
    $("#ui_dvContent").show();

    if ($("#btnAdd").attr("ClickToCallConfigurationId") != undefined || callApiConfigurationObject.Id > 0) {
        if (callApiConfigurationObject.Id > 0) {

            for (var i = 0; i < ConfigurationDetails.length; i++) {
                if (ConfigurationDetails[i].Id == callApiConfigurationObject.Id) {
                    ConfigurationDetails[i].ProviderName = callApiConfigurationObject.ProviderName;
                    ConfigurationDetails[i].IsPromotionalOrTransactionalType = callApiConfigurationObject.IsPromotionalOrTransactionalType;
                    callApiConfigurationObject.CreatedDate = ConfigurationDetails[i].CreatedDate;

                    if ($('#imgStatus_' + callApiConfigurationObject.Id).hasClass("InactiveImg"))
                        callApiConfigurationObject.ActiveStatus = 0;
                    else if ($('#imgStatus_' + callApiConfigurationObject.Id).hasClass("ActiveImg"))
                        callApiConfigurationObject.ActiveStatus = 1;
                    break;
                }
            }

            GeneralBinding(callApiConfigurationObject, "Update");
            ShowErrorMessage("Updated succussfully");
        }
        else {
            ShowErrorMessage("Unable to update");
        }
    }
    else {
        if (response.Id > 0) {
            GeneralBinding(response, "Add");
            setTimeout(function () { $("#ui_div_" + response.smsConfigurationDetails.Id + "").css("background-color", "#FFF"); }, 3000);
            ShowErrorMessage("Added succussfully");
        }
        else {
            ShowErrorMessage("ALready added please update");
        }
    }
    CloseDiv();
    $("#dvLoading").hide();
};


ValidateConfiguration = function () {

    if ($("#ui_dvProviderName").get(0).selectedIndex == 0) {
        ShowErrorMessage("Please select Provider Name");
        return false;
    }

    if ($("input:radio[name='OnDefaultConfig']:checked").val() == "1") {
        if ($.trim($("#txtApiKey").val()).length == 0) {
            ShowErrorMessage("Please enter Api key.");
            return false;
        }
        if ($.trim($("#txtAccountName").val()).length == 0) {
            ShowErrorMessage("Please enter Account Name.");
            return false;
        }
        if ($.trim($("#txtExotelCallerId").val()).length == 0) {
            ShowErrorMessage("Please enter Caller Id.");
            return false;
        }
    }

    return true;
}
function OpenDiv(action) {
    $("#dvDefault").hide();
    $("#tblCreate").show("fast");
    $("#ui_dvProviderName").val(0);
    $("#ui_txtCustomService").hide();
    $("#txtApiKey").val("");
    $("#txtAccountName").val("");
    $("#txtExotelCallerId").val("");
    $("input:radio[name='IsPromotionalOrTransactional'][value='" + action + "']").prop("checked", true);
    $("input:radio[name='OnDefaultConfig'][value='0']").prop("checked", true);
    $("#btnAdd").val("Add");
    $("#btnAdd").removeAttr("clicktocallconfigurationid");
    $("#ui_dvProviderName").prop("disabled", false);
}

function CloseDiv() {
    $("#tblCreate").hide("fast");
}

EditDetails = function (ConfigurationId) {

    var details;

    $("#tblCreate").show("fast");

    for (var i = 0; i < ConfigurationDetails.length; i++) {
        if (ConfigurationDetails[i].Id == ConfigurationId) {
            details = ConfigurationDetails[i];
            break;
        }
    }
    if (details != undefined && details.Id > 0) {

        $("#btnAdd").val("Update").attr("ClickToCallConfigurationId", ConfigurationId);

        if (details.IsDefaultProvider == true) {
            $("#ui_txtCustomService").show();
            $('#ui_radNo').prop('checked', true);
            $("#txtApiKey").val(details.ApiKey);
            $("#txtAccountName").val(details.AccountName);
            $("#txtExotelCallerId").val(details.CallerId);
        }
        else if (details.IsDefaultProvider == false) {
            $("#txtApiKey").val("");
            $("#txtAccountName").val("");
            $("#txtExotelCallerId").val(details.CallerId);
            $("#ui_txtCustomService").hide();
            $('#ui_radYes').prop('checked', true);
        }

        if (details.IsPromotionalOrTransactionalType == true)
            $('#ui_radTransactional').prop('checked', true);
        else if (details.IsPromotionalOrTransactionalType == false)
            $('#ui_radPromotional').prop('checked', true);

        $("#ui_dvProviderName").val(details.ProviderName).prop("disabled", true);
    }
    details = null;
};


function GetJavaScriptDateObj(dateString) {

    if (dateString.indexOf("/") > -1) {
        return ToJavaScriptDateFromNumber(dateString);
    }
    else if (dateString.length > 0) {
        var dbDate = dateString.split('T');
        var year = dbDate[0].split('-');
        var time = dbDate[1].split(':');
        var milSec = 0;
        if (time[2].toString().indexOf(".") > 0) {
            milSec = time[2].split('.');
        } else {
            milSec = time[2].split('+');
        }
        var createDate = new Date(year[0], year[1] - 1, year[2], time[0], time[1], milSec[0]);
        return GetLocalTime(createDate);
    }
}

function GetLocalTime(dateTime) {
    return GetLocalTimeFromGMT(ConvertToGMT(dateTime));
}
function ConvertToGMT(date) {
    return new Date(date.getTime() + (3600000 * -5.5));
}
function GetLocalTimeFromGMT(sTime) {
    sTime.setTime(sTime.getTime() - sTime.getTimezoneOffset() * 60 * 1000);
    return sTime;
}

function ToJavaScriptDateFromNumber(value) {
    var pattern = /Date\(([^)]+)\)/;
    var results = pattern.exec(value);
    var dt = new Date(parseFloat(results[1]));
    return dt;
}

function PlumbTimeFormat(newdate) {
    var date = new Date(newdate);
    var hh = date.getHours();
    var mm = date.getMinutes();
    var ss = date.getSeconds();
    var tt = "AM";
    if (date.getHours() >= 12) {
        tt = "PM";
        if (date.getHours() > 12)
            hh = date.getHours() % 12;

    }
    hh = parseInt(hh) > 9 ? hh : "0" + hh;
    mm = parseInt(mm) > 9 ? mm : "0" + mm;
    ss = parseInt(ss) > 9 ? ss : "0" + ss;
    return hh + ":" + mm + ":" + ss + " " + tt;
}


function ToogleStatus(Id) {
    $("#dvLoading").show();

    callApiConfiguration.Id = Id;

    if ($("#Promotional_" + Id).html() == "Promotional")
        callApiConfiguration.IsPromotionalOrTransactionalType = 0;
    else if ($("#Transactional_" + Id).html() == "Transactional")
        callApiConfiguration.IsPromotionalOrTransactionalType = 1;

    callApiConfiguration.ProviderName = $("#Provider_" + Id).html();

    if ($("#imgStatus_" + Id).hasClass("InactiveImg"))
        callApiConfiguration.ActiveStatus = 1;
    else
        callApiConfiguration.ActiveStatus = 0;

    $.ajax({
        url: "/Connector/ToogleStatus",
        type: 'POST',
        data: JSON.stringify({ 'callApiConfiguration': callApiConfiguration }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response) {
                $("#ui_dvData").empty();
                Get();
            }
            $("#dvLoading").hide();
        },
        error: ShowAjaxError
    });
}





