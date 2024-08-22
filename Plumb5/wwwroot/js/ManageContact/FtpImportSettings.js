var getgrouptypeval = '', getgroupNameval = '';
$(document).ready(function () {
    CallBackFunction();
});

function CallBackFunction() {
    ShowPageLoading();
    TotalRowCount = 0;
    CurrentRowCount = 0;
    MaxCount();
}
function CallBackPaging() {
    ShowPageLoading();
    CurrentRowCount = 0;
    GetReport();
}

function MaxCount() {
    ShowPageLoading();
    $.ajax({
        url: "/ManageContact/FtpImportSettings/MaxCount",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId}),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            TotalRowCount = response.returnVal;
            
            if (TotalRowCount > 0) 
                GetReport();
            else {
                SetNoRecordContent('ui_tableReport', 6, 'ui_tbodyReportData');
                HidePageLoading();
            }
        },
        error: ShowAjaxError
    });
}
function GetReport() {
    FetchNext = GetNumberOfRecordsPerPage();
    $.ajax({
        url: "/ManageContact/FtpImportSettings/GetDetails",
        type: 'POST',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'OffSet': OffSet, 'FetchNext': FetchNext }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: BindReport,
        error: ShowAjaxError
    });
}

function BindReport(response) {
    SetNoRecordContent('ui_tblReportData', 6, 'ui_tbodyReportData');
    if (response != undefined && response != null && response.length > 0) {
        CurrentRowCount = response.length;
        PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);
       
        var reportTableTrs;
        $.each(response, function () {
            reportTableTrs +=
                "<tr>" +
                   "<td class='text-left h-100'>" +
                     "<div class='groupnamewrap'>" +
                     "<div class='nameTxtWrap'>"+this.ConnectionName+"</div>" +
                         "<div class='tddropmenuWrap'>"+
                             "<div class='dropdown'>"+
                                "<button type='button' class='verticnwrp' data-toggle='dropdown' aria-haspopup='true' "+
                                 "aria-expanded='false'><i class='icon ion-android-more-vertical mr-0'></i></button>"+
                                 "<div class='dropdown-menu dropdown-menu-right' data-groupId=" + this.Id + " aria-labelledby='filterbycontacts'>"+
                                 "<a class='dropdown-item editftpdrpdwn' href='javascript:void(0)' onclick='EditFtpImportSettings(" + this.Id + ");'>Edit</a>"+
                                "<div class='dropdown-divider'></div>" +
                                   "<a data-toggle='modal' data-target='#deleteftpconnection' data-grouptype='groupDelete' class='dropdown-item FullControlPermission' href='javascript:void(0)'>Delete</a>" +
                                 "</div>"+
                             "</div>"+
                         "</div>"+
                   "</td>" +
                   "<td>" + this.ServerIP+"</td>"+
                   "<td>" + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(this.CreatedDate)) + "</td>"+
                   "<td>" + this.UserName + "</td>" +
                   "<td>"+
                         "<div class='ftppsswrdwrp position-relative'>"+
                            "<input type='password' class='ftppsswrdinpt' disabled value="+this.Password+" name='' id='ftppsswrdshow'>"+
                              "<i class='fa fa-eye eyeftppsswrd'></i>"+
                          "</div>"+
                   "</td>" +
                   "<td>"+this.Protocol+"</td>"+
                "</tr>";
        });
        $("#ui_tblReportData").removeClass('no-data-records');
        $("#ui_tbodyReportData").html(reportTableTrs);
        
    }
    else {
        ShowPagingDiv(false);
    }
    HidePageLoading();
    
}
//Add Connection button click
$("#addftpconnbtn").click(function () {
    $(".popupcontainer, .addftpconnect").removeClass("hideDiv");
    
    $(".popuptitle h6").html("Add FTP Connection");
    $("#ftpprotocol").val("FTP");
    $("#ui_txtConnectionName,#ui_txtServerIP,#ui_txtport,#ui_txtUserId,#ui_txtPassword,#ui_txtFolderPath").val('');
    $("#ui_txtUserId").removeAttr('autocomplete');
    $("#ui_txtPassword").removeAttr('autocomplete');
    $(".ftpsuccesswrp").addClass("hideDiv");
    $(".ftperrorwrp").addClass("hideDiv");
    $('#addconnectbtn').text('Add Connection');
    //$("#addconnectbtn").attr("disabled", "disabled");
});

$("#addconnectbtn").click(function () {
    ShowPageLoading();
    if (!Validate()) {
        HidePageLoading();
        return;
    }
    var FtpImportSettingDetailsObject = new Object();
    FtpImportSettingDetailsObject.Id = $("#addconnectbtn").attr("SettingId");
    FtpImportSettingDetailsObject.Protocol = $('#drpftpprotocol').val();
    FtpImportSettingDetailsObject.ConnectionName = $('#ui_txtConnectionName').val();
    FtpImportSettingDetailsObject.ServerIP = $('#ui_txtServerIP').val();
    FtpImportSettingDetailsObject.Port = $('#ui_txtport').val();
    FtpImportSettingDetailsObject.UserName = $('#ui_txtUserId').val();
    FtpImportSettingDetailsObject.Password = $('#ui_txtPassword').val();
    FtpImportSettingDetailsObject.FolderPath = $('#ui_txtFolderPath').val();


        $.ajax({
            url: "/ManageContact/FtpImportSettings/SaveOrUpdateDetails",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'FtpImportSettings': FtpImportSettingDetailsObject }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != null && response != undefined) {
                    if (response.Id > 0) {
                        if ($("#addconnectbtn").attr('SettingId') == 0)
                            ShowSuccessMessage(GlobalErrorList.FtpImport_Setting.ftpconnectionaddedsuccess_message);
                        else
                            ShowSuccessMessage(GlobalErrorList.FtpImport_Setting.ftpconnectionupdatedsuccess_message);

                        $('#drpftpprotocol').val('FTP');
                        $("#addconnectbtn").attr("SettingId", 0);
                        $('#ui_txtConnectionName,#ui_txtServerIP,#ui_txtport,#ui_txtUserId,#ui_txtPassword,#ui_txtFolderPath').val('');
                        $(".popupcontainer").addClass("hideDiv");
                        MaxCount();
                    }
                    else {
                        ShowErrorMessage(GlobalErrorList.FtpImport_Setting.ftpconnectionalreadyadded_error);
                        HidePageLoading();
                    }
                }
            }
        });
});
$(document).on("mouseover", ".eyeftppsswrd", function () {
    $(this).prev().attr("type", "text");
    // hover starts code here
});
$(document).on("mouseout", ".eyeftppsswrd", function () {
    $(this).prev().attr("type", "password");
    // hover starts code here
});
var delettblrow;
$(document).on('click', ".tddropmenuWrap .dropdown-menu a.dropdown-item", function () {
    getgrouptypeval = $(this).attr("data-grouptype");
    if (getgrouptypeval == "groupDelete") {
        $("#deleteRowConfirm").attr("data-id", $(this).parent("div").attr("data-groupid"));
        //$(this).parents(".groupnamewrap").parent("td").parent("tr").addClass("activeBgRow");
    }

});
var deleterowSel;
$("#deleteRowConfirm").click(function () {
    $(deleterowSel).remove();
    $(delettblrow).remove();
    DeleteGroup($("#deleteRowConfirm").attr("data-id"));
});

DeleteGroup = function (Id) {
    $.ajax({
        url: "/ManageContact/FtpImportSettings/Delete",
        type: 'POST',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'Id': Id }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response) {
                ShowSuccessMessage(GlobalErrorList.FtpImport_Setting.ftpconnectionDeleted_message);
                $("#deleteRowConfirm").attr("data-id", 0);
                MaxCount();
            }
        },
        error: ShowAjaxError
    });
};

function EditFtpImportSettings(Id) {
    $(".popupcontainer, .addftpconnect").removeClass("hideDiv");
    $(".popuptitle h6").html("Edit FTP Connection");
    $('#addconnectbtn').text('Update');
    $('.ftpsuccesswrp,.ftperrorwrp').addClass("hideDiv");
    $.ajax({
        url: "/ManageContact/FtpImportSettings/GetFtpImportSettingsDetailsForUpdate",
        type: 'POST',
        data: JSON.stringify({
            'AccountId': Plumb5AccountId, 'Id': Id
        }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response != undefined && response != null) {
                $("#addconnectbtn").attr("SettingId", Id);
                $('#drpftpprotocol').val(response.Protocol);
                $('#ui_txtConnectionName').val(response.ConnectionName);
                $('#ui_txtServerIP').val(response.ServerIP);
                $('#ui_txtport').val(response.Port);
                $('#ui_txtUserId').val(response.UserName);
                $('#ui_txtPassword').val(response.Password);
                $('#ui_txtFolderPath').val(response.FolderPath);
               
            }
            HidePageLoading();
        },
        error: ShowAjaxError
    });

}
$("#close-popup, .clsepopup").click(function () {
    $(this).parents(".popupcontainer").addClass("hideDiv");
    $("tr").removeClass("activeBgRow");
    $(".errmsgemlvalidwrp .ion-ios-information").popover("hide");
});
$("#btntestFtpConnect").click(function () {
    ShowPageLoading();
    $(".ftperrorwrp,.ftpsuccesswrp").addClass("hideDiv");
    if (!Validate()) {
        HidePageLoading();
        return;
    }
    //$(".spinnerftpwrp").removeClass("hideDiv");
    //function TestConnection() {
    $.ajax({
        url: "/ManageContact/FtpImportSettings/TestConnection",
        type: 'POST',
        data: JSON.stringify({ 'ServerIp': $('#ui_txtServerIP').val(), 'UserId': $('#ui_txtUserId').val(), 'Password': $('#ui_txtPassword').val(), 'Protocol': $('#drpftpprotocol').val()}),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response) {
                $("#addconnectbtn").removeAttr("disabled");
                $(".ftpsuccesswrp").removeClass("hideDiv");
            }
            else {

                $("#addconnectbtn").attr("disabled",true);
                $(".ftperrorwrp").removeClass("hideDiv");
            }
            HidePageLoading();
        },
        error: ShowAjaxError
    });
    
});
function Validate() {
    
    if ($.trim($("#ui_txtConnectionName").val()).length == 0) {
        ShowErrorMessage(GlobalErrorList.FtpImport_Setting.ConnectionName_ErrorMessage);
        return false;
    }

    if ($.trim($("#ui_txtServerIP").val()).length == 0) {
        ShowErrorMessage(GlobalErrorList.FtpImport_Setting.ServerIp_ErrorMessage);
        return false;
    }

    if ($.trim($("#ui_txtport").val()).length == 0) {
        ShowErrorMessage(GlobalErrorList.FtpImport_Setting.Port_ErrorMessage);
        return false;
    }
    if ($.trim($("#ui_txtUserId").val()).length == 0) {
        ShowErrorMessage(GlobalErrorList.FtpImport_Setting.UserId_ErrorMessage);
        return false;
    }
    if ($.trim($("#ui_txtPassword").val()).length == 0) {
        ShowErrorMessage(GlobalErrorList.FtpImport_Setting.Password_ErrorMessage);
        return false;
    } if ($.trim($("#ui_txtFolderPath").val()).length == 0) {
        ShowErrorMessage(GlobalErrorList.FtpImport_Setting.Folder_ErrorMessage);
        return false;
    }

     return true;
}
//$(".eyeftppsswrd")
//    .mouseover(function () {
//        $(this).prev().attr("type", "text");
//    })
//    .mouseout(function () {
//        $(this).prev().attr("type", "password");
//    });