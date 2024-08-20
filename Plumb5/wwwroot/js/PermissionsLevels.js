var maxRowCount = 0, rowIndex = 0;

$(document).ready(function () {
    GetMaxCount();
});

function GetMaxCount() {

    $.ajax({
        url: "/User/GetMaxCount",
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            maxRowCount = response.returnVal;
            if (maxRowCount == 0) {
                $("#dvLoading, #ui_dvContent").hide();
                $("#dvDefault").show();
            }
            else if (maxRowCount > 0) {
                $("#dvDefault").hide();
                CreateTable(maxRowCount);
            }
        },
        error: ShowAjaxError
    });
}

function CreateTable(numberRowsCount) {

    var OffSet = rowIndex;
    var FetchNext = numberRowsCount;

    $.ajax({
        url: "/User/GetPermissionsList",
        type: 'Post',
        data: JSON.stringify({ 'OffSet': OffSet, 'FetchNext': FetchNext }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindPermissionsDetails,
        error: ShowAjaxError
    });
}

function BindPermissionsDetails(PermissionsDetails) {
    rowIndex = PermissionsDetails.length + rowIndex;

    if (PermissionsDetails.length > 0) {
        $("#ui_dvContent").show();
        $.each(PermissionsDetails, function () {
            var tdrites = "";
            var tdfullrites = "";

            if ($(this)[0].UserRole == true)
                tdrites += "User Role,";

            if ($(this)[0].Analytics == true)
                tdrites += "Web Analytics,";

            if ($(this)[0].Forms == true)
                tdrites += "Forms,";

            if ($(this)[0].EmailMarketing == true)
                tdrites += "Email Marketing,";

            if ($(this)[0].LeadManagement == true)
                tdrites += "Lead Management,";

           

            if ($(this)[0].Social == true)
                tdrites += "Social,";

            if ($(this)[0].DataManagement == true)
                tdrites += "Data Management,";

            if ($(this)[0].Mobile == 1)
                tdrites += "Mobile Analytics,";

            

            if ($(this)[0].SMS == true)
                tdrites += "SMS,";

            if ($(this)[0].SiteChat == true)
                tdrites += "SiteChat,";


            if ($(this)[0].WorkFlow == true)
                tdrites += "WorkFlow,";

            if ($(this)[0].WebPushNotification == true)
                tdrites += "WebPushNotification,";

            if ($(this)[0].MobileEngagement == true)
                tdrites += "MobileEngagement,";

            if (tdrites != undefined && tdrites != null && tdrites != "" && tdrites.length > 0)
                tdfullrites = tdrites.substring(0, tdrites.length - 1);

            tdrites = tdrites.slice(0, -1);

            tdContent = "<div style='float: left; width: 100%; text-align: left;font-weight: bold;'>" + $(this)[0].Name + "</div>";
            tdContent += "<div style='float: left; width: 100%; text-align: left;' title='" + tdfullrites + "'>Roles: " + tdrites + "</div>";
            tdContent += "<div style='float: left; width: 100%; text-align: left;padding-top:5px;'><a class='ContributePermission' href='/User/AddPermissionLevels?Id=" + $(this)[0].Id + "' style='color:#0B88B5'>Edit</a> | <a class='FullControlPermission' style='cursor:pointer;color:#0B88B5;' onclick='DeleteFieldWithConform(" + $(this)[0].Id + ");'>Delete</a></div>";
            tdContent = "<div class='itemStyle' style='padding: 10px 5px;height: 67px;' id='ui_div_" + $(this)[0].Id + "'>" + tdContent + "</div>";
            $('#ui_dvData').append(tdContent);
        });
    }
    CheckAccessPermission("User");
    $("#dvLoading").hide();
}

DeleteFieldWithConform = function (Id) {
    $("#dialog-confirm").dialog({
        resizable: false,
        height: 170,
        modal: true,
        buttons: {
            "Delete": function () {
                ConfirmedDelete(Id);
                $(this).dialog("close");
            },
            "Cancel": function () {
                $(this).dialog("close");
            }
        }
    });
};

ConfirmedDelete = function (Id) {

    $("#dvDeletePanel").hide();
    $.ajax({
        url: "/User/Delete",
        type: 'POST',
        data: JSON.stringify({ 'Id': Id }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response) {
                --rowIndex;
                --maxRowCount;
                $("#ui_div_" + Id).hide("slow");
                if (rowIndex <= 0 || maxRowCount <= 0) {
                    $("#dvLoading, #ui_dvContent").hide();
                }
            }
            $("#dvLoading").hide();
        },
        error: ShowAjaxError
    });
};
