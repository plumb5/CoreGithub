var AccountId = 0;

var CampaignIdentifier = { Id: 0, UserGroupId: 0, UserInfoUserId: 0, Name: "", CampaignDescription: "", CampaignStatus: null, IsDeleted: null, CreatedDate: null, UpdatedDate: null, DeletedDate: null }
var CampaignIdentifierList = new Array();

$(document).ready(function () {
    AccountId = Plumb5AccountId;
    ExportFunctionName = "ExportCampaignIdentifier";
    CallBackFunction();
});

function CallBackFunction() {
    CampaignIdentifier = {};
    ShowPageLoading();
    TotalRowCount = 0;
    CurrentRowCount = 0;
    MaxCount();
}

function CallBackPaging() {
    CurrentRowCount = 0;
    GetReport();
}

function MaxCount() {

    CampaignIdentifier.IsDeleted = null;
    CampaignIdentifier.Name = $("#txt_SearchBy").val();

    $.ajax({
        url: "/CampaignConfiguration/GetCampaignIdentifierMaxCount",
        type: 'Post',
        data: JSON.stringify({ 'accountId': AccountId, 'identifier': CampaignIdentifier }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            TotalRowCount = 0;
            if (response != undefined && response != null) {
                TotalRowCount = response;
            }

            if (TotalRowCount > 0) {
                GetReport();
            }
            else {
                SetNoRecordContent('ui_tblReportData', 6, 'ui_tbodyReportData');
                HidePageLoading();
            }
        },
        error: ShowAjaxError
    });
}
function GetReport() {
    FetchNext = GetNumberOfRecordsPerPage();
    $.ajax({
        url: "/CampaignConfiguration/GetCampaignIdentifierDetails",
        type: 'Post',
        data: JSON.stringify({ 'accountId': AccountId, 'identifier': CampaignIdentifier, 'OffSet': OffSet, 'FetchNext': FetchNext }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindReport,
        error: ShowAjaxError
    });
}
function BindReport(response) {
    CampaignIdentifierList = new Array();
    SetNoRecordContent('ui_tblReportData', 3, 'ui_tbodyReportData');
    if (response != undefined && response != null) {
        CurrentRowCount = response.length;
        PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);


        var reportTableTrs;

        $.each(response, function () {
            CampaignIdentifierList.push(this);
            reportTableTrs += '<tr>' +
                '<td>' +
                '<div class="groupnamewrap">' +
                '<div class="nameTxtWrap">' + this.Name + '' +
                '</div>' +
                '<div class="tdcreatedraft">' +
                '<div class="dropdown">' +
                '<button type="button" class="verticnwrp" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="icon ion-android-more-vertical mr-0"></i></button>' +
                '<div class="dropdown-menu dropdown-menu-right" aria-labelledby="filterbycontacts">' +
                '<a data-grouptype="groupedit" class="dropdown-item ContributePermission" href="javascript:EditDetails(' + this.Id + ');">Edit</a>' +
                '<a data-grouptype="groupduplicate" class="dropdown-item ContributePermission" href="javascript:CreateDuplicate(' + this.Id + ');">Duplicate</a>' +
                '<div class="dropdown-divider"></div>' +
                '<a id="deletecamp" data-toggle="modal" data-target="#deletegroups" data-groupid="' + this.Id + '" data-grouptype="groupDelete" class="dropdown-item FullControlPermission" href="javascript:void(0)">Delete</a>' +
                '</div></div></div></div></td>' +
                '<td class="td-wid-10 wordbreak">' + this.CampaignDescription + '</td>' +
                '<td>' + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(this.UpdatedDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(this.UpdatedDate)) + '</td></tr>';
        });


        $("#ui_tblReportData").removeClass('no-data-records');
        $("#ui_tbodyReportData").html(reportTableTrs);
        ShowExportDiv(true);
    } else {
        ShowExportDiv(false);
        ShowPagingDiv(false);
    }
    HidePageLoading();
    CheckAccessPermission(Areas);
}

$("#close-popup, .clsepopup").click(function () {
    $(this).parents(".popupcontainer").addClass("hideDiv");
});

$("#ui_CreateDrafts").click(function () {
    $(".popupcontainer").removeClass("hideDiv");
    $("#ui_btnAdd").html("Create Campaign").removeAttr("CampaignId");
    $("#spnCampaign").html("Create Draft Campaign");
    $("#ui_txtName").val("").focus();
    $("#ui_txtDescription").val("");
});

$("#ui_btnAdd").click(function () {
    if ($("#ui_txtName").val().length == 0) {
        ShowErrorMessage(GlobalErrorList.CampaignDraft.CampaignName);
        return false;
    }

    if ($("#ui_txtDescription").val().length == 0) {
        ShowErrorMessage(GlobalErrorList.CampaignDraft.CampaignDescription);
        return false;
    }

    ShowPageLoading();
    CampaignIdentifier = new Object();

    if ($("#ui_btnAdd").attr("CampaignId") != undefined) {
        CampaignIdentifier.Id = $("#ui_btnAdd").attr("CampaignId");
    }
    else {
        CampaignIdentifier.CampaignStatus = false;
    }

    CampaignIdentifier.Name = $("#ui_txtName").val();
    CampaignIdentifier.CampaignDescription = $("#ui_txtDescription").val();

    $.ajax({
        url: "/CampaignConfiguration/CampaignIdentifierSaveOrUpdateDetails",
        type: 'POST',
        data: JSON.stringify({ 'accountId': AccountId, 'identifier': CampaignIdentifier }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            OnCreateAndUpdate(response, CampaignIdentifier);
            HidePageLoading();
        }
    });
});

OnCreateAndUpdate = function (response, campaignObject) {
    if ($("#ui_btnAdd").attr("CampaignId") != undefined) {
        if (response.Id > 0) {
            CallBackFunction();
            $('#close-popup').click();
            ShowSuccessMessage(GlobalErrorList.CampaignDraft.UpdateCampaign);
            $("#ui_btnAdd").removeAttr("CampaignId");
            $("#ui_divCreate").hide();
        }
        else {
            ShowErrorMessage(GlobalErrorList.CampaignDraft.ExistsCampaign);
        }
    }
    else {
        if (response.Id > 0) {
            CallBackFunction();
            $('#close-popup').click();
            ShowSuccessMessage(GlobalErrorList.CampaignDraft.CreatedCampaign);
        }
        else {
            ShowErrorMessage(GlobalErrorList.CampaignDraft.ExistsCampaign);
        }
    }
};

EditDetails = function (CampaignId) {
    $(".popupcontainer").removeClass("hideDiv");
    var details;
    for (var i = 0; i < CampaignIdentifierList.length; i++) {
        var campid = CampaignIdentifierList[i].Id;
        if (campid == CampaignId) {
            details = CampaignIdentifierList[i];
            break;
        }
    }
    if (details != undefined) {
        $("#ui_txtName").val(details.Name).focus();
        $("#ui_txtDescription").val(details.CampaignDescription);
        $("#ui_btnAdd").html("Update Campaign").attr("CampaignId", CampaignId);
        $("#spnCampaign").html("Update Draft Campaign");
        //$("#ui_divCreate").show("fast");
    }
};


CreateDuplicate = function (CampaignId) {
    CampaignIdentifier = new Object();
    var details;
    for (var i = 0; i < CampaignIdentifierList.length; i++) {
        var campid = CampaignIdentifierList[i].Id;
        if (campid == CampaignId) {
            details = CampaignIdentifierList[i];
            break;
        }
    }
    if (details != undefined) {
        CampaignIdentifier.Name = details.Name + "-Copy_" + GenerateUniqueId();
        CampaignIdentifier.CampaignDescription = details.CampaignDescription;
    }


    CampaignIdentifier.CampaignStatus = false;

    $.ajax({
        url: "/CampaignConfiguration/CampaignIdentifierSaveOrUpdateDetails",
        type: 'POST',
        data: JSON.stringify({ 'accountId': AccountId, 'identifier': CampaignIdentifier }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            OnCreateAndUpdate(response, CampaignIdentifier)
        }
    });
};

$(document).ready(function () {
    $("#txt_SearchBy").keydown(function (event) {
        if (event.keyCode == 13) {
            if (CleanText($.trim($("#txt_SearchBy").val())).length == 0) {
                ShowErrorMessage(GlobalErrorList.CampaignDraft.CampaingNameSearchError);
                return false;
            }
            CallBackFunction();
            event.preventDefault();
            return false;
        }
    });
});

var CampId = 0;
$(document).on('click', "#deletecamp", function () {
    CampId = parseInt($(this).attr("data-groupid"));
});

$("#deleteRowConfirm").click(function () {

    $.ajax({
        url: "/CampaignConfiguration/CampaignIdentifierArchive",
        type: 'POST',
        data: JSON.stringify({ 'accountId': AccountId, 'Id': CampId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response) {
                ShowSuccessMessage(GlobalErrorList.CampaignDraft.DeleteCampaign);
                CallBackFunction();
            }
        },
        error: ShowAjaxError
    });
});

$("#ui_SerachByCampaign").click(function () {
    if (CleanText($.trim($("#txt_SearchBy").val())).length == 0) {
        ShowErrorMessage(GlobalErrorList.CampaignDraft.CampaingNameSearchError);
        return false;
    }
    CallBackFunction();
});

$("#txt_SearchBy").keyup(function () {
    const key = event.key;
    if (key === "Backspace") {
        if (CleanText($.trim($("#txt_SearchBy").val())).length == 0) {
            CallBackFunction();
        }
        return false;
    }
});

//Search text
$(".contsearchfocus")
    .on("focus", function () {
        $(this).parent().addClass("w-300");
    })
    .on("blur", function () {
        if ($(".contsearchfocus").val().length < 15)
            $(this).parent().removeClass("w-300");
    });
