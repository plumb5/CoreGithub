
var SmsCampaign = { Id: 0, Name: "", UserGroupId: 0 };
var UserInfoUserId = 0, maxRowCount = 0, Offset = 0, rowIndex = 0;
var viewMoreDisable = false;
var MailNames = new Array();

$(document).ready(function () {
    MaxCount();
});

function MaxCount() {

    SmsCampaign.Name = $("#txt_SearchBy").val();

    $.ajax({
        url: "../Sms/Campaign/MaxCount",
        type: 'POST',
        data: JSON.stringify({ 'smsCampaign': SmsCampaign }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            maxRowCount = response.returnVal;
            if (maxRowCount == 0) {
                $("#dvLoading, #ui_dvContent,.SmallLabel,.SmallHeight,.dropdownSmallSize,.Export,.textBoxSmallSize").hide();
                if ($("#dv_BindingValue").attr("SearchId") == 0) {
                    $("#dvDefault").show();
                    $("#dv_BindingValue").removeAttr("SearchId");
                    $("#txt_SearchBy").val("");
                }
                else {
                    $("#dvDefault").show();
                }
            }
            else if (maxRowCount > 0) {
                $("#dvDefault").hide();
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

    SmsCampaign.Name = $("#txt_SearchBy").val();

    var OffSet = rowIndex;
    var FetchNext = numberRowsCount;

    $.ajax({
        url: "../Sms/Campaign/GetDetails",
        type: 'Post',
        data: JSON.stringify({ 'smsCampaign': SmsCampaign, 'OffSet': OffSet, 'FetchNext': FetchNext }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindCampaign,
        error: ShowAjaxError
    });
}

function BindCampaign(CampaignDetails) {


    rowIndex = CampaignDetails.length + rowIndex;
    $("#div_Records").html(rowIndex + " out of " + maxRowCount + " records");

    if (rowIndex == maxRowCount) {
        $("#ui_lnkViewMore").hide();
    }
    if (rowIndex >= 1 || maxRowCount >= 1) {
        $("#dvTipsExport").show();
    }

    $("#ui_dvContent").show();

    $.each(CampaignDetails, function () {
        GeneralBinding($(this)[0], null, "Bind");
    });
    $("#dvLoading").hide();
}

function GeneralBinding(data, UserValue, isAddOrUpdate) {
    var tdContent = "";

    tdContent = "<div style='float: left; width: 25%; text-align: left;'>" + data.Name + "</div>";

    if (UserValue != null)
        tdContent += "<div style='float: left; width: 25%; text-align: left;'>" + UserValue + "</div>";
    else
        tdContent += "<div title=" + (data.FirstName == "NA" ? "NA" : data.FirstName) + " style='float: left; width: 25%; text-align: left;'>" + (data.FirstName == "NA" ? "NA" : data.FirstName) + "</div>";

    var DateValue = GetDateValue(data.CreatedDate);
    tdContent += "<div style='float: left; width: 18%;text-align: right;'>" + $.datepicker.formatDate("M dd yy", DateValue) + " " + PlumbTimeFormat(DateValue) + "</div>";
    tdContent += "<div style='float: left;width: 18%;text-align: right;'><a href='javascript:EditDetails(" + data.Id + ");'>Edit</a></div>";
    tdContent += "<div style='float: right;width: 14%;text-align: right;'><a onclick='DeleteConfirmation(" + data.Id + ");'><img src='/images/img_trans.gif' border='0' class='DeleteImg' alt='Delete' title='Delete' style='cursor:pointer'/></a></div>";

    if (isAddOrUpdate == "Add") {
        $('#ui_dvData').prepend("<div id='ui_div_" + data.Id + "' class='itemStyle'>" + tdContent + "</div>");
        MailNames.push(data);
    }
    else if (isAddOrUpdate == "Update") {
        $('#ui_div_' + data.Id).html(tdContent);
    }
    else if (isAddOrUpdate == "Bind") {
        $('#ui_dvData').append("<div id='ui_div_" + data.Id + "' class='itemStyle'>" + tdContent + "</div>");
        MailNames.push(data);
    }

    $("#dvLoading").hide();
    viewMoreDisable = false;
}


$("#btnAdd").click(function () {
    $("#dvLoading").show();

    if ($("#txtName").val().length == 0) {
        ShowErrorMessage("Please enter the name.");
        $("#txtName").focus();
        return;
    }

    var smsCampaignObject = new Object();

    if ($("#btnAdd").attr("SmsCampaignId") != undefined) {
        smsCampaignObject.Id = $("#btnAdd").attr("SmsCampaignId");
    }

    smsCampaignObject.Name = CleanText($("#txtName").val());

    $.ajax({
        url: "../Sms/Campaign/SaveOrUpdateDetails",
        type: 'POST',
        data: JSON.stringify({ 'smsCampaign': smsCampaignObject }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            OnCreateAndUpdate(response, smsCampaignObject)
        }
    });
});


OnCreateAndUpdate = function (response, smsCampaignObject) {

    if ($("#btnAdd").attr("SmsCampaignId") != undefined) {
        if (response.MailCampaign.Id > 0) {

            for (var i = 0; i < MailNames.length; i++) {
                if (MailNames[i].Id == smsCampaignObject.Id) {
                    MailNames[i].Name = smsCampaignObject.Name;
                    smsCampaignObject.CreatedDate = MailNames[i].CreatedDate;
                    break;
                }
            }
            GeneralBinding(smsCampaignObject, response.UserName, "Update");
            ShowErrorMessage("Updated succussfully");
            $("#btnAdd").removeAttr("SmsCampaignId");
        }
        else {
            ShowErrorMessage("Unable to update as another campaign with the same name exists");
        }
    }
    else {
        if (response.MailCampaign.Id > 0) {

            GeneralBinding(response.MailCampaign, response.UserName, "Add");
            setTimeout(function () { $("#ui_div_" + response.mailCampaign.Id + "").css("background-color", "#FFF"); }, 3000);
            rowIndex++;
            maxRowCount++;
            $("#div_Records").html(rowIndex + " out of " + maxRowCount + " records");
            ShowErrorMessage("Added succussfully");
            $("#ui_dvContent").show();
        }
        else {
            ShowErrorMessage("Please add different name as it already exists.");
            $("#txtName").focus();
            $("#dvLoading").hide();
        }
    }
    CloseDiv();
    $("#dvLoading").hide();

};

function OpenDiv() {
    $("#dvDefault").hide();
    DefaultValue();
    $("#tblCreate").show("fast");
    $("#dv_Add").hide();
    $("#dvTipsExport").hide();
}

function CloseDiv() {
    $("#tblCreate").hide("fast");
    DefaultValue();
}

function DefaultValue() {
    $("#btnAdd").val("Add Campaign");
    $("#txtName").val("");
    $("#dv_Add").show();
    $("#dvTipsExport").show();
}

EditDetails = function (SmsCampaignId) {

    var details;

    for (var i = 0; i < MailNames.length; i++) {
        if (MailNames[i].Id == SmsCampaignId) {
            details = MailNames[i];
            break;
        }
    }
    if (details != undefined) {
        $("#txtName").val(details.Name);
        $("#btnAdd").val("Update").attr("SmsCampaignId", SmsCampaignId);
        $("#tblCreate").show("fast");
    }
};

ConfirmedDelete = function (Id) {

    $("#dvDeletePanel").hide();
    $.ajax({
        url: "../Sms/Campaign/Delete",
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


function SearchByName() {

    if ($.trim($("#txt_SearchBy").val()).length == 0) {
        ShowErrorMessage("Please enter search by value");
        $("#txt_SearchBy").focus();
        return false;
    }
    else {
        rowIndex = maxRowCount = 0;
        $("#ui_dvData > .itemStyle").remove();
        $("#dv_BindingValue").html("There is no data availaible based on your search.Please click on the link <a style='cursor:pointer;color:red;' onclick='MaxCount();' href='javascript:void(0);'>back</a> to go back");
        $("#dv_BindingValue").attr("SearchId", 0);
        MaxCount();
    }
}

function GetDateValue(dateValue) {

    if (dateValue.indexOf("T") > 0) {
        return GetJavaScriptDateObj(dateValue);
    }
    else if (dateValue.indexOf("/") > -1) {
        return new Date();
    }
}


function ToJavaScriptDateFromNumber(value) {
    var pattern = /Date\(([^)]+)\)/;
    var results = pattern.exec(value);
    var dt = new Date(parseFloat(results[1]));
    return dt;
}

$("#txt_SearchBy").keyup(function (e) {
    if (e.which && e.which == 8 || e.keyCode && e.keyCode == 46)
        if ($("#txt_SearchBy").val().length == 0) {
            $("#ui_dvData > .itemStyle").remove();
            rowIndex = maxRowCount = 0;
            $("#ui_lnkViewMore").hide();
            MaxCount();
        }
});




