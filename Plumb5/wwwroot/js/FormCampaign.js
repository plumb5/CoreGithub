
var FormCampaign = { Id: 0, Name: "", CampaignDescription: "" };
var UserInfoUserId = 0, maxRowCount = 0, Offset = 0, rowIndex = 0, FormCampaignStatus = 3;
var viewMoreDisable = false;
var CampaignDescrip = new Array();

$(document).ready(function () {
    MaxCount();
    UserInfoUserId = $("#hdn_UserId").val();
});

function MaxCount() {

    var Name = $("#txt_SearchBy").val();

    if ($("#ui_dllSortStatus").val() == 1)
        FormCampaignStatus = true;
    else if ($("#ui_dllSortStatus").val() == 0)
        FormCampaignStatus = false;
    else if ($("#ui_dllSortStatus").val() == 2)
        FormCampaignStatus = null;

    $.ajax({
        url: "../Form/Campaign/MaxCount",
        type: 'POST',
        data: JSON.stringify({ 'Name': Name, 'FormCampaignStatus': FormCampaignStatus }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            maxRowCount = response.returnVal;
            if (maxRowCount == 0) {
                $("#dvLoading, #ui_dvContent,.SmallLabel,.SmallHeight,.dropdownSmallSize,.Export").hide();
                if ($("#dv_BindingValue").attr("SearchId") == 0) {
                    ClearValues();
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
        error: function (objxmlRequest) {
            window.console.log(objxmlRequest.responseText);
        }
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

    var Name = $("#txt_SearchBy").val();

    if ($("#ui_dllSortStatus").val() == 1)
        FormCampaignStatus = true;
    else if ($("#ui_dllSortStatus").val() == 0)
        FormCampaignStatus = false;
    else if ($("#ui_dllSortStatus").val() == 2)
        FormCampaignStatus = null;

    var OffSet = rowIndex;
    var FetchNext = numberRowsCount;

    $.ajax({
        url: "../Form/Campaign/GET",
        type: 'Post',
        data: JSON.stringify({ 'OffSet': OffSet, 'FetchNext': FetchNext, 'Name': Name, 'FormCampaignStatus': FormCampaignStatus }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindCampaign,
        error: function (objxmlRequest) {
            window.console.log(objxmlRequest.responseText);
        }
    });
}

function BindCampaign(response) {

    rowIndex = response.length + rowIndex;
    $("#div_Records").html(rowIndex + " out of " + maxRowCount + " records");

    if (rowIndex == maxRowCount) {
        $("#ui_lnkViewMore").hide();
    }
    if (rowIndex >= 1 || maxRowCount >= 1) {
        $("#dvTipsExport").show();
    }

    $("#ui_dvContent").show();

    $.each(response, function () {

        var CampaignDescription = CleanText($(this)[0].CampaignDescription);
        if (CampaignDescription.length > 40) {
            CampaignDescription = CampaignDescription.substring(0, 40) + "..";
        }

        tdContent = "<div id='ui_dvName_" + $(this)[0].Id + "' style='float: left; width: 23%;'>" + $(this)[0].Name + "</div>";
        tdContent += "<div id='ui_dvCampaignDesc_" + $(this)[0].Id + "' style='float: left; width: 26%;'>" + CampaignDescription + "</div>";

        if ($(this)[0].FormCampaignStatus == true) {
            tdContent += "<div style='float: left;width: 4%;text-align: center;'><img id='imgStatus_" + $(this)[0].Id + "' src='/images/img_trans.gif' class='ActiveImg' onclick='ToogleStatus(" + $(this)[0].Id + ",0);' border='0' alt='Active' title='Active' style='border:0px;cursor:pointer'/></div>";
        }
        else if ($(this)[0].FormCampaignStatus == false) {
            tdContent += "<div style='float: left;width: 4%;text-align: center;'><img id='imgStatus_" + $(this)[0].Id + "' src='/images/img_trans.gif' class='InactiveImg'  src='/images/img_trans.gif' onclick='ToogleStatus(" + $(this)[0].Id + ",1);' border='0' alt='Stoped' title='InActive' style='border:0px;cursor:pointer'/></div>";
        }

        if ($(this)[0].FirstName == "NA") {
            tdContent += "<div title='Not Availaible' style='float: left; width: 14%;text-align: right;'>" + $(this)[0].FirstName + " " + $(this)[0].LastName + "</div>";
        }
        else {
            tdContent += "<div style='float: left; width: 14%;text-align: right;'>" + $(this)[0].FirstName + " " + $(this)[0].LastName + " </div>";
        }
        tdContent += "<div style='float: left; width: 16%;text-align: right;'>" + $.datepicker.formatDate("M dd yy", new Date($(this)[0].CreatedDate.replace("T", " "))) + " " + PlumbTimeFormat(new Date($(this)[0].CreatedDate.replace("T", " "))) + "</div>";
        tdContent += "<div style='float: left;width: 9%;text-align: right;'><a  href='javascript:EditDetails(" + $(this)[0].Id + ");'>Edit</a></div>";
        tdContent += "<div style='float: right;width: 8%;text-align: right;'><a onclick='DeleteConfirmation(" + $(this)[0].Id + ");'><img src='/images/img_trans.gif' border='0' class='DeleteImg' alt='Delete' title='Delete' style='cursor:pointer'/></a></div>";

        tdContent = "<div id='ui_div_" + $(this)[0].Id + "' class='itemStyle'>" + tdContent + "</div>";

        $('#ui_dvData').append(tdContent);

        var data = new Array();
        data.CampaignDescription = CampaignDescription;
        data.Name = $(this)[0].Name;
        CampaignDescrip[$(this)[0].Id] = data;
    });

    $("#dvLoading").hide();
    viewMoreDisable = false;
}

function ClearValues() {

    $("#dvDefault").show();
    $("#dv_BindingValue").removeAttr("SearchId");
    $("#txt_SearchBy").val("");
    $('#ui_dllSortStatus').val('2');
}

$("#btnAdd").click(function () {
    $("#dvLoading").show();

    if (!ValidateCampaign()) {
        $("#dvLoading").hide();
        return;
    }
    if ($("#btnAdd").attr("CampaignId") != undefined) {

        var Id = $("#btnAdd").attr("CampaignId");
        var Name = CleanText($("#txtName").val());
        var CampaignDesc = CleanText($("#txtCampaignDescription").val());

        Update(Id, Name, CampaignDesc);
    }
    else {
        FormCampaign.Id = 0;
        FormCampaign.Name = CleanText($("#txtName").val());
        FormCampaign.CampaignDescription = CleanText($("#txtCampaignDescription").val());

        $.ajax({
            url: "../Form/Campaign/Save",
            type: 'POST',
            data: JSON.stringify({ FormCampaign: FormCampaign }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response.returnVal > 0) {

                    var CampaignId = response.returnVal;

                    var CampaignDescription = CleanText($("#txtCampaignDescription").val());
                    if (CampaignDescription.length > 40) {
                        CampaignDescription = CampaignDescription.substring(0, 40) + "..";
                    }

                    tdContent = "<div id='ui_dvName_" + CampaignId + "' style='float: left; width: 23%;'>" + CleanText($("#txtName").val()) + "</div>";
                    tdContent += "<div id='ui_dvCampaignDesc_" + CampaignId + "' style='float: left; width: 26%;'>" + CampaignDescription + "</div>";

                    if ($(this)[0].FormCampaignStatus == true) {
                        tdContent += "<div style='float: left;width: 4%;text-align: center;'><img id='imgStatus_" + CampaignId + "' src='/images/img_trans.gif' class='ActiveImg' onclick='ToogleStatus(" + CampaignId + ",0);' border='0' alt='Active' title='Active' style='border:0px;cursor:pointer'/></div>";
                    }
                    else {
                        tdContent += "<div style='float: left;width: 4%;text-align: center;'><img id='imgStatus_" + CampaignId + "' src='/images/img_trans.gif' class='InactiveImg'  onclick='ToogleStatus(" + CampaignId + ",1);' border='0' alt='Stoped' title='InActive' style='border:0px;cursor:pointer'/></div>";
                    }

                    if (response.UserName == "NA") {
                        tdContent += "<div title='Not Availaible' style='float: left; width: 14%;text-align: right;'>" + response.UserName + "</div>";
                    }
                    else {

                        tdContent += "<div style='float: left; width: 14%;text-align: right;'>" + response.UserName + "</div>";
                    }
                    tdContent += "<div style='float: left; width: 16%;text-align: right;'>" + $.datepicker.formatDate("M dd yy", new Date()) + " " + PlumbTimeFormat(new Date()) + "</div>";
                    tdContent += "<div style='float: left;width: 9%;text-align: right;'><a href='javascript:EditDetails(" + CampaignId + ");'>Edit</a></div>";
                    tdContent += "<div style='float: right;width: 8%;text-align: right;'><a onclick='DeleteConfirmation(" + CampaignId + ");'><img src='/images/img_trans.gif' class='DeleteImg' border='0' alt='Delete' title='Delete' style='cursor:pointer'/></a></div>";

                    tdContent = "<div id='ui_div_" + CampaignId + "' style='background-color: #FFFEAD;' class='itemStyle'>" + tdContent + "</div>";

                    $('#ui_dvData').prepend(tdContent);

                    setTimeout(function () { $("#ui_div_" + CampaignId + "").css("background-color", "#FFF"); }, 3000);
                    rowIndex++;
                    maxRowCount++;
                    $("#div_Records").html(rowIndex + " out of " + maxRowCount + " records");
                    ShowErrorMessage("Added succussfully");
                    $("#ui_dvContent").show();

                    var data = new Array();
                    data.CampaignDescription = CampaignDescription;
                    data.Name = $("#txtName").val();
                    CampaignDescrip[CampaignId] = data;

                    CloseDiv();
                    if (rowIndex >= 1) {
                        $(".SmallLabel,.SmallHeight,.dropdownSmallSize,.Export").show();
                    }
                    $("#dvLoading").hide();
                }
                else {
                    ShowErrorMessage("Please add different name as it already exists");
                    $("#txtName").focus();
                    $("#dvLoading").hide();
                }
            }
        });
    }
});

function Update(Id, Name, CampaignDesc) {

    FormCampaign.Id = Id;
    FormCampaign.Name = Name;
    FormCampaign.CampaignDescription = CampaignDesc;

    $.ajax({
        url: "../Form/Campaign/Update",
        type: 'POST',
        data: JSON.stringify({ FormCampaign: FormCampaign }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response) {
                if (FormCampaign.Id > 0) {

                    var CampaignDescription = FormCampaign.CampaignDescription;
                    if (CampaignDescription.length > 40) {
                        CampaignDescription = CampaignDescription.substring(0, 40) + "..";
                    }
                    $("#ui_dvName_" + FormCampaign.Id).html(FormCampaign.Name);
                    $("#ui_dvCampaignDesc_" + FormCampaign.Id).html(CampaignDescription).attr("title", FormCampaign.CampaignDescription);

                    var data = new Array();
                    data.CampaignDescription = CampaignDescription;
                    data.Name = FormCampaign.Name;
                    CampaignDescrip[FormCampaign.Id] = data;
                    $("#btnAdd").removeAttr("CampaignId");
                    ShowErrorMessage("Updated succussfully");
                }
                else {
                    ShowErrorMessage("Unable to update");
                }
            }
            CloseDiv();
            $("#dvLoading").hide();
        }
    });
}

ValidateCampaign = function () {

    if ($.trim($("#txtName").val()).length == 0) {
        ShowErrorMessage("Please enter name");
        $("#txtName").focus();
        return false;
    }

    if ($.trim($("#txtCampaignDescription").val()).length == 0) {
        ShowErrorMessage("Please enter campaign description");
        $("#txtCampaignDescription").focus();
        return false;
    }
    return true;
};

function OpenDiv() {

    $("#dvDefault").hide();
    $("#btnAdd").val("Add Campaign");
    $("#ui_addEditCampaignName").html("Add Campaign Name");
    $("#txtName").val("");
    $("#txtCampaignDescription").val("");
    $("#tblCreate").show("fast");
}

function CloseDiv() {
    $("#tblCreate").hide("fast");
    $("#btnAdd").val("Add Group");
    $("#txtName").val("");
    $("#txtCampaignDescription").val("");
}

function CleanText(content) {
    content = content.replace(/'/g, "‘");
    content = content.replace(/>/g, "&gt;");
    content = content.replace(/</g, "&lt;");
    content = $.trim(content);
    return content;
}

EditDetails = function (CampaignId) {

    var details = CampaignDescrip[CampaignId];
    $("#txtName").val(details.Name);
    $("#txtCampaignDescription").val(details.CampaignDescription);
    $("#btnAdd").val("Update").attr("CampaignId", CampaignId);
    $("#tblCreate").show("fast");
};

ConfirmedDelete = function (Id) {

    $("#dvLoading").show();
    FormCampaign.Id = Id;
    $("#dvDeletePanel").hide();
    $.ajax({
        url: "../Form/Campaign/Delete",
        type: 'POST',
        data: JSON.stringify({ 'FormCampaign': FormCampaign }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response) {
                --rowIndex;
                --maxRowCount;
                $("#div_Records").html(rowIndex + " out of " + maxRowCount + " records");
                $("#ui_div_" + Id).hide("slow");
                if (rowIndex <= 0 || maxRowCount <= 0) {
                    $("#dvLoading, #ui_dvContent,.SmallLabel,.SmallHeight,.dropdownSmallSize,.Export").hide();
                    $("#dvDefault").show();
                }
            }
            $("#dvLoading").hide();
        },
        error: function (objxmlRequest) {
            window.console.log(objxmlRequest.responseText);
        }
    });
};


function ToogleStatus(Id, status) {
    $("#dvLoading").show();

    FormCampaign.Id = Id;
    FormCampaign.FormCampaignStatus = status;

    $.ajax({
        url: "../Form/Campaign/ToogleStatus",
        type: 'POST',
        data: JSON.stringify({ 'FormCampaign': FormCampaign }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response) {
                if (status == 1) {
                    $("#imgStatus_" + Id).removeClass("InactiveImg").addClass("ActiveImg").attr("src", "/images/img_trans.gif").attr("title", "Toogle to inactive").attr("onclick", "ToogleStatus(" + Id + ",0);");
                }
                else if (status == 0) {
                    $("#imgStatus_" + Id).removeClass("ActiveImg").addClass("InactiveImg").attr("src", "/images/img_trans.gif").attr("title", "Toogle to active").attr("onclick", "ToogleStatus(" + Id + ",1);");
                }
            }
            $("#dvLoading").hide();
        },
        error: function (objxmlRequest) {
            window.console.log(objxmlRequest.responseText);
        }
    });
}


$("#radByRange").click(function () {
    $("#trShowRange").show();
})

$("#radAll").click(function () {
    $("#trShowRange").hide();
})

$("#btnExportRecords").click(function () {

    var checkedRadVal = $('input[name="ExportRecord"]:checked').val();

    if (checkedRadVal == "All") {
        var OffSet = 0;
        var FetchNext = maxRowCount;
    }
    else {

        if (!ValidateValues()) {
            $("#dvLoading").hide();
            return;
        }
        var OffSet = $("#txtMinVal").val();
        var FetchNext = $("#txtMaxVal").val();

        if (!ValidateRangeValues(OffSet, FetchNext)) {
            $("#dvLoading").hide();
            return;
        }
    }

    $.ajax({
        url: "../Form/Campaign/Export",
        type: 'Post',
        data: JSON.stringify({ 'OffSet': OffSet, 'FetchNext': FetchNext }),
        contentType: "application/json; charset=utf-8",
        dataType: "html",
        success: function (result) {

        },
        error: function (objxmlRequest) {
            window.console.log(objxmlRequest.responseText);
        }
    });
});

ValidateValues = function () {

    if ($.trim($("#txtMinVal").val()).length == 0) {
        ShowErrorMessage("Please enter min value");
        $("#txtMinVal").focus();
        return false;
    }

    if ($.trim($("#txtMaxVal").val()).length == 0) {
        ShowErrorMessage("Please enter max value");
        $("#txtMaxVal").focus();
        return false;
    }
    return true;
}

ValidateRangeValues = function (OffSet, FetchNext) {
    if (OffSet > FetchNext || FetchNext < OffSet) {
        ShowErrorMessage("Please enter min value correctly");
        $("#txtMinVal").val("");
        $("#txtMinVal").focus();
        return false;
    }

    return true;
}

GetNumberOfRecordsPerPage = function () {
    if ($("#drp_RecordsPerPage").length > 0) {
        if ($("#drp_RecordsPerPage").val().toString().toLowerCase() == "all")
            return 5000;
        else
            return parseInt($("#drp_RecordsPerPage").val());
    }
    return 20;
};

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

function GetJavaScriptDateObj(dateString) {
    if (dateString.length > 0) {
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

CustomReport = function () {
    $(".bgShadedDiv").show();
    $("#dvBtnExportValue").show("fast");
};

HideCustomPopUp = function () {

    $(".CustomPopUp").hide("fast");
    $(".bgShadedDiv").hide();
    $("#dvLoading").hide();
};

ShowSortStatus = function () {

    if ($("#dvSortStatus").is(":visible")) {
        $("#dvSortStatus").hide();
        $("#ui_dllSortStatus").show();
    }
    else {
        $("#dvSortStatus").show();
        $("#ui_dllSortStatus").hide();
    }
};

SortByStatus = function () {

    ShowSortStatus();

    $("#ui_dvData > .itemStyle").remove();
    rowIndex = maxRowCount = 0;
    $("#dv_BindingValue").html("There is no data availaible based on the searched status.Please click on the link <a style='cursor:pointer;color:red;' onclick='MaxCount();' href='javascript:void(0);'>back</a> to go back");
    $("#dv_BindingValue").attr("SearchId", 0);
    MaxCount();
};


