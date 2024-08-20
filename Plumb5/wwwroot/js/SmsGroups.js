
var Group = { Id: 0, Name: "", GroupDescription: "" };
var maxRowCount = 0, Offset = 0, rowIndex = 0;
var viewMoreDisable = false;
var GroupDetails = new Array();
var myGrtable = document.getElementById("tblContactList");

$(document).ready(function () {
    GetAllContactDetails();
    MaxCount();
});

GetAllContactDetails = function () {

    $.ajax({
        url: "../Sms/Groups/GetAllActiveInactiveCustomerCount",
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            $("#tdAllContactDate, #tdInactiveAllContactDate, #ui_tdCustomerDate, #ui_tdProspectsDate").html($.datepicker.formatDate("M dd yy", new Date()) + " " + PlumbTimeFormat(new Date()));

            var SecondDescriptionValue = $("#ui_ALLInActiveContact").html().substring(0, 70);
            $("#ui_ALLInActiveContact").html(SecondDescriptionValue + "..");

            $("#ui_aAllcontacts").html(response[0].TotalContacts);
            $("#ui_InactiveAllcontacts").html(response[0].TotalInactive);
            $("#ui_aCustomersCount").html(response[0].TotalCustomers);
            $("#ui_aProspectsCount").html(response[0].TotalLmsLeads);

            $("#ui_aAllcontacts, #a_activeContact").attr("href", "../Sms/Contacts?GroupId=0&tab=Mail");
            $("#a_InactiveContact, #ui_InactiveAllcontacts").attr("href", "../Sms/Contacts?GroupId=inactive&tab=Mail");
            $("#ui_aCustomersCount, #ui_aCustomers").attr("href", "../Sms/Contacts?GroupId=customer&tab=Mail");
            $("#ui_aProspects, #ui_aProspectsCount").attr("href", "../Sms/Contacts?GroupId=prospects&tab=Mail");
        },
        error: ShowAjaxError
    });
};

function MaxCount() {

    Group.Name = $("#txt_SearchBy").val();

    $.ajax({
        url: "../Sms/Groups/GetMaxCount",
        type: 'POST',
        data: JSON.stringify({ 'group': Group }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            maxRowCount = response.returnVal;
            if (maxRowCount == 0) {
                $("#dvViewMore, #dvLoading, #ui_dvContent, #dvTipsExport").hide();
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

    Group.Name = $("#txt_SearchBy").val();

    var OffSet = rowIndex;
    var FetchNext = numberRowsCount;

    $.ajax({
        url: "../Sms/Groups/BindGroupsContact",
        type: 'Post',
        data: JSON.stringify({ 'group': Group, 'OffSet': OffSet, 'FetchNext': FetchNext }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindGroupDetails,
        error: ShowAjaxError
    });
}

function BindGroupDetails(GroupDetails) {


    rowIndex = GroupDetails.length + rowIndex ;

    $("#div_Records").html(rowIndex + " out of " + maxRowCount + " records");

    if (rowIndex == maxRowCount) {
        $("#ui_lnkViewMore").hide();
    }
    if (rowIndex >= 1 || maxRowCount >= 1) {
        $("#dvTipsExport").show();
    }

    $("#ui_dvContent").show();

    $.each(GroupDetails, function () {
        GeneralBinding($(this)[0],"Bind");
    });
    $("#dvLoading").hide();
}

function GeneralBinding(data, isAddOrUpdate) {

    var tdContent = "";

    var groupName = data.Name;
    if (groupName.length > 20) {
        groupName = groupName.substring(0, 20) + "..";
    }

    var tdContent = "<td style='width: 25%;'><a  href='../Sms/Contacts?GroupId=" + data.Id + "&tab=SMS' id='ui_tdGroupName_" + data.Id + "' title='" + data.Name + "'>" + groupName + "</a></td>";
    var groupDescription = data.GroupDescription;
    if (groupDescription.length > 45) {
        groupDescription = groupDescription.substring(0, 45) + "..";
    }

    tdContent += "<td style='width: 30%;' title='" + data.GroupDescription + "' id='ui_tdGroupDesc_" + data.Id + "'>" + groupDescription + "</td>";

    var Total = data.Total > 0 ? data.Total : 0;
    tdContent += "<td style='text-align: right;width: 10%;'><a  href='../Sms/Contacts?GroupId=" + data.Id + "&tab=SMS'>" + Total + "</a></td>";

    tdContent += "<td style='text-align: right;width: 10%;'><a  href='javascript:EditDetails(" + data.Id + ");'>Edit</a></td>";

    if (isAddOrUpdate == "Add")
        tdContent += "<td style='text-align: right;width: 20%;'>" + $.datepicker.formatDate("M dd yy", new Date()) + " " + PlumbTimeFormat(new Date()) + "</td>";

    else if (isAddOrUpdate == "Bind" || isAddOrUpdate == "Update")
        tdContent += "<td style='text-align: right;width: 20%;'>" + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(data.CreatedDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(data.CreatedDate)) + "</td>";

    tdContent += "<td style='text-align: right;width: 5%;'><a  href='javascript:void(0);' onclick='DeleteConfirmation(" + data.Id + ");'><img border='0' src='/images/img_trans.gif'  class='DeleteImg' alt='Delete' title='Delete' style='cursor:pointer'/></a></td>";

    if (isAddOrUpdate == "Add") {
        $('#tblContactList > tbody > tr').eq(4).after("<tr id='cntList_" + data.Id + "' class='itemStyle'>" + tdContent + "</tr>");
        GroupDetails.push(data);
    }
    else if (isAddOrUpdate == "Update") {
        $('#cntList_' + data.Id).html(tdContent);
    }
    else if (isAddOrUpdate == "Bind") {
        $("#tblContactList > tbody:last").append("<tr id='cntList_" + data.Id + "' class='itemStyle'>" + tdContent + "</tr>");
        GroupDetails.push(data);
    }
    $("#dvLoading").hide();
    viewMoreDisable = false;
}


$("#btnAdd").click(function () {
    $("#dvLoading").show();

    if ($("#txtGrpName").val().length == 0) {
        ShowErrorMessage("Please enter the name.");
        $("#txtGrpName").focus();
        return;
    }

    if ($("#txtGrpDescription").val().length == 0) {
        ShowErrorMessage("Please enter the name.");
        $("#txtGrpDescription").focus();
        return;
    }

    var mailGroupDetailsObject = new Object();

    if ($("#btnAdd").attr("GroupId") != undefined) {
        mailGroupDetailsObject.Id = $("#btnAdd").attr("GroupId");
    }

    mailGroupDetailsObject.Name = CleanText($("#txtGrpName").val());
    mailGroupDetailsObject.GroupDescription = CleanText($("#txtGrpDescription").val());

    $.ajax({
        url: "../Sms/Groups/SaveOrUpdateDetails",
        type: 'POST',
        data: JSON.stringify({ 'group': mailGroupDetailsObject }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            OnCreateAndUpdate(response, mailGroupDetailsObject)
        }
    });

});


OnCreateAndUpdate = function (response, mailGroupDetailsObject) {

    if ($("#btnAdd").attr("GroupId") != undefined) {
        if (mailGroupDetailsObject.Id > 0) {

            for (var i = 0; i < GroupDetails.length; i++) {
                if (GroupDetails[i].Id == mailGroupDetailsObject.Id) {
                    GroupDetails[i].Name = mailGroupDetailsObject.Name;
                    GroupDetails[i].GroupDescription = mailGroupDetailsObject.GroupDescription
                    mailGroupDetailsObject.CreatedDate = GroupDetails[i].CreatedDate;
                    break;
                }
            }
            GeneralBinding(mailGroupDetailsObject,"Update");
            ShowErrorMessage("Updated succussfully");
            $("#btnAdd").removeAttr("GroupId");
        }
        else {
            ShowErrorMessage("Unable to update");
        }
    }
    else {
        if (response.Group.Id > 0) {
            GeneralBinding(response.Group,"Add");
            setTimeout(function () { $("#cntList_" + response.Group.Id + "").css("background-color", "#FFF"); }, 3000);
            rowIndex++;
            maxRowCount++;
            $("#div_Records").html(rowIndex + " out of " + maxRowCount + " records");
            ShowErrorMessage("Added succussfully");
            $("#ui_dvContent").show();
        }
        else {
            ShowErrorMessage("Please add different name as it already exists.");
            $("#txtGrpName").focus();
            $("#dvLoading").hide();
        }
    }
    CloseDiv();
    $("#dvLoading").hide();

};

function OpenDiv() {
    $("#dvDefault").hide();
    DefaultValue();
    $("#dv_Add").hide();
    $("#dvTipsExport").hide();
    $("#tblCreate").show("fast");
}

function CloseDiv() {
    $("#tblCreate").hide("fast");
    $("#dv_Add").show();
    $("#dvTipsExport").show();
    DefaultValue();
}

function DefaultValue() {
    $("#btnAdd").val("Add Group");
    $("#txtGrpName").val("");
    $("#txtGrpDescription").val("");
}

EditDetails = function (GroupId) {

    var details;

    for (var i = 0; i < GroupDetails.length; i++) {
        if (GroupDetails[i].Id == GroupId) {
            details = GroupDetails[i];
            break;
        }
    }
    if (details != undefined) {
        $("#txtGrpName").val(details.Name);
        $("#txtGrpDescription").val(details.GroupDescription);
        $("#btnAdd").val("Update").attr("GroupId", GroupId);
        $("#tblCreate").show("fast");
    }
};

ConfirmedDelete = function (Id) {

    $("#dvDeletePanel").hide();
    $.ajax({
        url: "../Sms/Groups/Delete",
        type: 'POST',
        data: JSON.stringify({ 'Id': Id }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response) {
                --rowIndex;
                --maxRowCount;
                $("#div_Records").html(rowIndex + " out of " + maxRowCount + " records");
                $("#cntList_" + Id).hide("slow");
                if (rowIndex <= 0 || maxRowCount <= 0) {
                    $("#ui_dvContent").hide();
                    $("#dvTipsExport").hide();
                    $("#dvDefault").show();
                }
            }
            $("#dvLoading").hide();
        },
        error: ShowAjaxError
    });
};


function DeleteCancel() {

    $("#dialog-Cancel").dialog({
        resizable: false,
        height: 170,
        modal: true,
        buttons: {
            Cancel: function () {
                $(this).dialog("close");
            }
        }
    });
}

NoEditOption = function () {
    ShowErrorMessage("For this group we can't edit name and descripition");
};

function SearchByName() {

    if ($.trim($("#txt_SearchBy").val()).length == 0) {
        ShowErrorMessage("Please enter search by value");
        $("#txt_SearchBy").focus();
        return false;
    }
    else {
        for (var i = myGrtable.rows.length; i > 1; --i) {
            myGrtable.deleteRow(i - 1);
        }

        rowIndex = maxRowCount = 0;
        $("#ui_lnkViewMore").hide();
        $("#dv_BindingValue").html("There is no data availaible based on your search.Please click on the link <a style='cursor:pointer;color:red;' onclick='MaxCount();' href='javascript:void(0);'>back</a> to go back");
        $("#dv_BindingValue").attr("SearchId", 0);
        MaxCount();
    }
}

$("#txt_SearchBy").keyup(function (e) {
    if (e.which && e.which == 8 || e.keyCode && e.keyCode == 46)
        if ($("#txt_SearchBy").val().length == 0) {

            for (var i = myGrtable.rows.length; i > 1; --i) {
                myGrtable.deleteRow(i - 1);
            }
            rowIndex = maxRowCount = 0;
            $("#ui_lnkViewMore").hide();
            MaxCount();
        }
});

