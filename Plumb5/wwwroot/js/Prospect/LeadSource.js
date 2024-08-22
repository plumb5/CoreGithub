
var LmsGroup = { Id: 0, Name: "" };

$(document).ready(function () {
    ExportFunctionName = "LmsGroupExport";
    CallBackFunction();
    //GetLmssourcetype();
});

function CallBackFunction() {
    ShowPageLoading();
    CurrentRowCount = TotalRowCount = 0;
    MaxCount();
}

function CallBackPaging() {
    CurrentRowCount = 0;
    GetReport();

}

function MaxCount() {
    LmsGroup.Name = $("#ui_txtSearchBy").val();

    $.ajax({
        url: "/Prospect/LeadSource/GetMaxCount",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'lmsgroup': LmsGroup }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            TotalRowCount = response;

            if (TotalRowCount > 0) {
                GetReport();
            }
            else {
                SetNoRecordContent('ui_tblReportData', 3, 'ui_tbodyReportData');
                HidePageLoading();
            }
        },
        error: ShowAjaxError
    });
}

function GetReport() {
    FetchNext = GetNumberOfRecordsPerPage();
    $.ajax({
        url: "/Prospect/LeadSource/GetAllDetails",
        type: 'POST',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'lmsgroup': LmsGroup, 'OffSet': OffSet, 'FetchNext': FetchNext }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: BindReport,
        error: ShowAjaxError
    });
}

function BindReport(response) {
    SetNoRecordContent('ui_tblReportData', 3, 'ui_tbodyReportData');
    if (response != undefined && response != null && response.length > 0) {

        CurrentRowCount = response.length;
        PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);

        var reportTableTrs, LmsGroupName, _LmsGroupName;

        $.each(response, function () {
            LmsGroupName = this.Name;
            _LmsGroupName = this.Name;
            if (LmsGroupName.length > 25) {
                _LmsGroupName = LmsGroupName.substring(0, 80) + "..";
            }

            var DefaultEditValues = "";

            var createdDateData = ConvertDateObjectToDateTime(this.CreatedDate);
            var currentDateData = new Date();

            var fromdate = PrefixZero((createdDateData.getMonth() + 1)) + '/' + PrefixZero(createdDateData.getDate()) + '/' + createdDateData.getFullYear();
            var todate = PrefixZero((currentDateData.getMonth() + 1)) + '/' + PrefixZero(currentDateData.getDate()) + '/' + currentDateData.getFullYear();

            if (this.GroupType == "0" || this.GroupType == "1") {
                DefaultEditValues = "<div class='tdcreatedraft'>" +
                    "<div class='dropdown'>" +
                    "<button type='button' class='verticnwrp' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'><i class='icon ion-android-more-vertical mr-0'></i></button>" +
                    "<div class='dropdown-menu dropdown-menu-right' aria-labelledby='filterbycontacts'>" +
                    "<a data-chatpop='chattransdet' class='dropdown-item chatrepvist' href='javascript:void(0)'>Edit(NA)</a>" +
                    "<a data-chatpop='chatsendmailvis' class='dropdown-item chatrepvist'>Import(NA)</a>" +
                    "<a data-chatpop='chatsendmailvis' class='dropdown-item chatrepvist' href='/Prospect/Leads?LmsGroupId=" + this.LmsGroupId + "&LmsGroupName=" + this.Name + "&Frm=" + fromdate + "&To=" + todate + "'>View Leads</a>" +
                    "<a data-chatpop='chatsendmailvis' class='dropdown-item chatrepvist' href='javascript:void(0)' onclick=CopyLmsGroupId(" + this.LmsGroupId + ")>Copy LmsGroupId</a>" +
                    "<div class='dropdown-divider'></div>" +
                    "<a id='dv_deleteLmsGroup' class='dropdown-item' href='javascript:void(0)'>Delete(NA)</a>" +
                    "</div>" +
                    "</div>" +
                    "</div>"
            }
            else if (this.GroupType == "2") {
                DefaultEditValues = "<div class='tdcreatedraft'>" +
                    "<div class='dropdown'>" +
                    "<button type='button' class='verticnwrp' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'><i class='icon ion-android-more-vertical mr-0'></i></button>" +
                    "<div class='dropdown-menu dropdown-menu-right' aria-labelledby='filterbycontacts'>" +
                    "<a data-chatpop='chattransdet' class='dropdown-item chatrepvist' href='javascript:void(0)'>Edit(NA)</a>" +
                    "<a data-chatpop='chatsendmailvis' class='dropdown-item chatrepvist ContributePermission ImportLead' href='/Prospect/ContactImport?LmsGroupId=" + this.LmsGroupId + "&LmsGroupName=" + this.Name + "'>Import Leads</a>" +
                    "<a data-chatpop='chatsendmailvis' class='dropdown-item chatrepvist' href='/Prospect/Leads?LmsGroupId=" + this.LmsGroupId + "&LmsGroupName=" + this.Name + "&Frm=" + fromdate + "&To=" + todate + "'>View Leads</a>" +
                    "<a data-chatpop='chatsendmailvis' class='dropdown-item chatrepvist' href='javascript:void(0)' onclick=CopyLmsGroupId(" + this.LmsGroupId + ")>Copy LmsGroupId</a>" +
                    "<div class='dropdown-divider'></div>" +
                    "<a id='dv_deleteLmsGroup' class='dropdown-item' href='javascript:void(0)'>Delete(NA)</a>" +
                    "</div>" +
                    "</div>" +
                    "</div>"
            }
            else {
                DefaultEditValues = "<div class='tdcreatedraft'>" +
                    "<div class='dropdown'>" +
                    "<button type='button' class='verticnwrp' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'><i class='icon ion-android-more-vertical mr-0'></i></button>" +
                    "<div class='dropdown-menu dropdown-menu-right' aria-labelledby='filterbycontacts'>" +
                    "<a data-chatpop='chattransdet' class='dropdown-item chatrepvist ContributePermission AddSource' onclick='EditDetails(" + this.LmsGroupId + ");' href='javascript:void(0)'>Edit</a>" +
                    "<a data-chatpop='chatsendmailvis' class='dropdown-item chatrepvist ContributePermission ImportLead' href='/Prospect/ContactImport?LmsGroupId=" + this.LmsGroupId + "&LmsGroupName=" + this.Name + "'>Import Leads</a>" +
                    "<a data-chatpop='chatsendmailvis' class='dropdown-item chatrepvist' href='/Prospect/Leads?LmsGroupId=" + this.LmsGroupId + "&LmsGroupName=" + this.Name + "&Frm=" + fromdate + "&To=" + todate + "'>View Leads</a>" +
                    "<a data-chatpop='chatsendmailvis' class='dropdown-item chatrepvist' href='javascript:void(0)' onclick=CopyLmsGroupId(" + this.LmsGroupId + ")>Copy LmsGroupId</a>" +
                    "<div class='dropdown-divider'></div>" +
                    "<a id='dv_deleteLmsGroup' data-toggle='modal' data-target='#deletegroups' data-PopUpLeadCount=" + this.LeadCount + " data-PopUpLmsGrpId=" + this.LmsGroupId + " data-grouptype='groupDelete' class='dropdown-item FullControlPermission' href='javascript:void(0)'>Delete</a>" +
                    "</div>" +
                    "</div>" +
                    "</div>"
            }

            reportTableTrs +=
                "<tr id='ui_div_" + this.LmsGroupId + "' value=" + this.LmsGroupId + ">" +
                "<td>" +
                "<div class='groupnamewrap'>" +
                "<div class='nameTxtWrap' title='" + LmsGroupName + "' id='dvLmsName_" + this.LmsGroupId + "'><a href='/Prospect/Leads?LmsGroupId=" + this.LmsGroupId + "&LmsGroupName=" + this.Name + "&Frm=" + fromdate + "&To=" + todate + "'>" + _LmsGroupName + "</a></div>" +
                "" + DefaultEditValues + "" +
                "</div>" +
                "</td>" +
                "<td class='td-wid-10'>" + this.LeadCount + "</td>" +
                "<td class='td-wid-15'>" + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(this.CreatedDate)) + "</td>" +
                "</tr>";
        });
        $("#ui_tblReportData").removeClass('no-data-records');
        $("#ui_tbodyReportData").html(reportTableTrs);
        ShowExportDiv(true);
        $('.searchCampWrap').show();
    }
    else {
        $('.searchCampWrap').hide();
        ShowExportDiv(false);
        ShowPagingDiv(false);
    }
    HidePageLoading();
    CheckAccessPermission("Prospect");
}

$("#SearchByIdentifierName").click(function () {
    ShowPageLoading();
    if ($.trim($("#ui_txtSearchBy").val()).length == 0) {
        ShowErrorMessage(GlobalErrorList.LmsGroup.LmsGroupSearchError);
        $("#ui_txtSearchBy").focus();
        setTimeout(function () { HidePageLoading(); }, 500);
        return false;
    }
    else {
        OffSet = 0;
        CallBackFunction();
    }
});

$("#ui_txtSearchBy").keypress(function (e) {
    if ((e.which && e.which === 13) || (e.keyCode && e.keyCode === 13)) {
        if (CleanText($.trim($("#ui_txtSearchBy").val())).length == 0) {
            ShowErrorMessage(GlobalErrorList.LmsGroup.SearchErrorValue);
            HidePageLoading();
            return false;
        }
        ShowPageLoading();
        OffSet = 0;
        CallBackFunction();
    }
});

$("#ui_txtSearchBy").keyup(function (e) {
    if (e.which && e.which === 8 || e.keyCode && e.keyCode === 46)
        if ($("#ui_txtSearchBy").val().length === 0) {
            ShowPageLoading();
            MaxCount();
        }
});

var LmsGroupId = 0, LeadCount = 0;
$(document).on('click', "#dv_deleteLmsGroup", function () {
    LeadCount = parseInt($(this).attr("data-PopUpLeadCount"));
    LmsGroupId = parseInt($(this).attr("data-PopUpLmsGrpId"));
});

$("#deleteRowConfirm").click(function () {
    if (LeadCount == 0 && LmsGroupId > 0) {
        $.ajax({
            url: "/Prospect/LeadSource/Delete",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'lmsGroupId': LmsGroupId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response) {
                    --CurrentRowCount;
                    --TotalRowCount;
                    $("#ui_div_" + LmsGroupId).hide("slow");
                    PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);
                    ShowSuccessMessage(GlobalErrorList.LmsGroup.DeleteSuccessStatus);
                    if (CurrentRowCount <= 0 && TotalRowCount <= 0) {
                        $('.searchCampWrap').hide();
                        ShowExportDiv(false);
                        ShowPagingDiv(false);
                        SetNoRecordContent('ui_tblReportData', 3, 'ui_tbodyReportData');
                        LmsGroupId = 0, LeadCount = 0;
                    }
                    else if (CurrentRowCount <= 0 && TotalRowCount > 0) {
                        //CallBackFunction();
                    }
                }
                else {
                    ShowErrorMessage(GlobalErrorList.LmsGroup.DeleteFailureStatus);
                    LmsGroupId = 0, LeadCount = 0;
                }
            },
            error: ShowAjaxError
        });
    }
    else {
        ShowErrorMessage(GlobalErrorList.LmsGroup.DeleteCountFailureStatus);
        LmsGroupId = 0, LeadCount = 0;
    }
});

function EditDetails(LmsGroupId) {
    ShowPageLoading();
    $(".popupcontainer").removeClass("hideDiv");
    $(".popuptitle h6").html("Update Source");
    $("#btnCreateSourcePopUp").removeClass("hideDiv");
    $(".popupsubtitle").html("");
    $("#txtlmsgroupname").val("");
    $("#btnCreateUpdateLmsGrp").removeAttr("LmsGroupId");
    $("#txtlmsgroupname").val($.trim($("#dvLmsName_" + LmsGroupId).attr("title")));
    $("#btnCreateUpdateLmsGrp").attr("LmsGroupId", LmsGroupId);
    HidePageLoading();
}

$("#btnCreateSource").click(function () {
    ShowPageLoading();
    $(".popupcontainer").removeClass("hideDiv");
    $(".popuptitle h6").html("Create Source");
    $("#btnCreateSourcePopUp").removeClass("hideDiv");
    $(".popupsubtitle").html("");
    $("#txtlmsgroupname").val("");
    $("#btnCreateUpdateLmsGrp").removeAttr("LmsGroupId");
    HidePageLoading();
});

$("#close-popup, .clsepopup").click(function () {
    $(this).parents(".popupcontainer").addClass("hideDiv");
    $("tr").removeClass("activeBgRow");
});

$("#btnCreateUpdateLmsGrp").click(function () {
    ShowPageLoading();

    if ($("#txtlmsgroupname").val().length == 0) {
        ShowErrorMessage(GlobalErrorList.LmsGroup.LmsGroupNameEmptyError);
        $("#txtlmsgroupname").focus();
        HidePageLoading();
        return false;
    }

    var Name = $.trim($("#txtlmsgroupname").val());
    var LmsGroupId = 0;

    if ($("#btnCreateUpdateLmsGrp").attr("LmsGroupId") != undefined) {
        LmsGroupId = parseInt($("#btnCreateUpdateLmsGrp").attr("LmsGroupId"));
    }

    $.ajax({
        url: "/Prospect/LeadSource/SaveUpdateLmsGroup",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'UserId': Plumb5UserId, 'LmsGroupId': LmsGroupId, 'Name': Name }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response.Status) {

                if ($("#btnCreateUpdateLmsGrp").attr("LmsGroupId") != undefined)
                    ShowSuccessMessage(GlobalErrorList.LmsGroup.LmsGrpUpdateSuccessStatus);
                else
                    ShowSuccessMessage(GlobalErrorList.LmsGroup.LmsGrpCreationSuccessStatus);

                setTimeout(function () { HideCustomPopUp("btnCreateSourcePopUp"); }, 500);

                setTimeout(function () {
                    HidePageLoading();
                    MaxCount();
                }, 1000);
            }
            else if (!response.Status) {
                if ($("#btnCreateUpdateLmsGrp").attr("LmsGroupId") != undefined)
                    ShowErrorMessage(GlobalErrorList.LmsGroup.LmsGrpUpdateFailureStatus);
                else
                    ShowErrorMessage(GlobalErrorList.LmsGroup.LmsGrpCreationFailureStatus);

                setTimeout(function () { HidePageLoading(); }, 500);
            }
            $("#dvLoading").hide();
        },
        error: ShowAjaxError
    });
});

HideCustomPopUp = function (Id) {
    $(".popupcontainer").addClass("hideDiv");
    $("#" + Id).addClass("hideDiv");
};

//Search text
$(".contsearchfocus")
    .on("focus", function () {
        $(this).parent().addClass("w-300");
    })
    .on("blur", function () {
        if ($(".contsearchfocus").val().length < 15)
            $(this).parent().removeClass("w-300");
    });


var Id;
var lmssourcetype = { Id: Id, type: 0 }

$("#btnSourceType").click(function () {
    var selectedValue = $("#ddlSourceType").val();
    lmssourcetype.type = selectedValue;
    lmssourcetype.Id = Id;
    console.log("Selected Value: " + selectedValue);
    $.ajax({
        url: "/Prospect/LeadSource/SaveOrUpdate",
        type: 'Post',
        data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'lmssourcetype': lmssourcetype }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            console.log(response);
            ShowSuccessMessage("Data Updated Successfully");
        },
        error: function (error) {
            // Your error handling logic here
            console.error(error);
        }
    });
});

function GetLmssourcetype() {

    $.ajax({
        url: "/Prospect/LeadSource/GetLmsSorceType",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            var data = response[0];


            if (data !== undefined) {
                Id = data.Id;
                $('#ddlSourceType').val(data.Type);
            }



        },
        error: function (error) {
            HidePageLoading();
            // Your error handling logic here
        }
    });
}


function CopyLmsGroupId(LmsGroupId) {
    navigator.clipboard.writeText(LmsGroupId);
    ShowSuccessMessage("LmsGroupId copied successfully");
}