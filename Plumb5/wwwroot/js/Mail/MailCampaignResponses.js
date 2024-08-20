var CampId = 0;
var TemplateId = 0;

var timeduration = 0;
var mailsendingsettingid = 0;
var rfromdate, rtodate = "";

$(document).ready(function () {
    timeduration = $.urlParam("duration");
    mailsendingsettingid = $.urlParam("ssid");
    rfromdate = $.urlParam("frmdate");
    rtodate = $.urlParam("todate");

    ExportFunctionName = "Export";
    BindCampaign();
    GetGroupName();
    BindTemplates();

    if (parseInt(timeduration) > 0 && mailsendingsettingid > 0) {
        if (parseInt(timeduration) == 5 && rfromdate != "" && rtodate != "") {
            FromDateTime = rfromdate.replace(/%20/g, " ");
            ToDateTime = rtodate.replace(/%20/g, " ");
            $(".showDateIconWrap").addClass("hideDiv");
            CallBackFunction();
        }
        else {
            $(".showDateIconWrap").addClass("hideDiv");
            GetUTCDateTimeRange(parseInt(timeduration));
        }
    }
    else {
        $(".showDateIconWrap").removeClass("hideDiv");
        GetUTCDateTimeRange(2);
    }
});

function CallBackFunction() {
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
    ShowPageLoading();
    CampId = $("#ui_dllMailCampaign").val();
    TemplateId = $("#ui_dlltemplateCampaign").val();
    $.ajax({
        url: "/Mail/Responses/MaxCount",
        type: 'Post',
        data: JSON.stringify({ 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime, 'mailCampaignId': CampId, 'mailTemplateId': TemplateId, 'mailsendingsettingid': mailsendingsettingid }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            TotalRowCount = response.returnVal;

            if (TotalRowCount > 0) {
                GetReport();
            }
            else {
                SetNoRecordContent('ui_tblReportData', 12, 'ui_tbodyReportData');
                HidePageLoading();
            }
        },
        error: ShowAjaxError
    });
}

function GetReport() {
    FetchNext = GetNumberOfRecordsPerPage();

    $.ajax({
        url: "/Mail/Responses/GetResponseData",
        type: 'Post',
        data: JSON.stringify({ 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime, 'OffSet': OffSet, 'FetchNext': FetchNext, 'mailCampaignId': CampId, 'mailTemplateId': TemplateId, 'mailsendingsettingid': mailsendingsettingid }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindReport,
        error: ShowAjaxError
    });
}

function BindReport(response) {
    SetNoRecordContent('ui_tblReportData', 12, 'ui_tbodyReportData');
    if (response != undefined && response != null) {
        CurrentRowCount = response.length;
        PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);

        var reportTableTrs = "";

        $.each(response, function () {
            var StoppedReason = 'NA';
            var ConfigurationName = 'NA';
            if (this.StoppedReason != undefined && this.StoppedReason != null && this.StoppedReason.length > 0) {
                StoppedReason = this.StoppedReason;
            }

            if (this.ConfigurationName != undefined && this.ConfigurationName != null && this.ConfigurationName.length > 0) {
                ConfigurationName = this.ConfigurationName;
            }

            var TotalNotSentTd = '<td class="cursor-pointer" onclick="getMailCampaignContacts(\'notsent\',' + this.Id + ',0);">' + this.TotalNotSent + '</td>';
            if (StoppedReason != "NA") {
                TotalNotSentTd = '<td data-sentdetail="Error" class="cursor-pointer sentpopup">' +
                    '<div class="d-flex align-items-center justify-content-end">' +
                    '<i class="icon ion-ios-information creditalertblink" data-toggle="popover" data-trigger="hover" data-content="' + StoppedReason + '"></i>' +
                    '<span onclick="getMailCampaignContacts(\'notsent\',' + this.Id + ',0);">' + this.TotalNotSent + '</span></div></td>';
            }

            reportTableTrs += '<tr><td  class="td-wid-5 pl-0"><div class="chbxWrap"><label class="ckbox"><input class="selChk" value="' + this.Id + '" type="checkbox"><span></span></label></div></td>' +

                '<td class="text-left">' +
                '<div class="td-actionFlexSB">' +
                '<div class="nametitWrap">' +
                '<span class="groupNameTxt">' + this.CampaignIdentifier + '</span>' +
                '<span class="templatenametxt">' + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(this.ScheduledDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(this.ScheduledDate)) + '</span>' +
                '</div>' +

                '<div class="tdiconwrap">' +
                '<i class="icon ion-ios-information infocampresponse" data-type="' + this.IsPromotionalOrTransactionalType + '" data-FromName="' + this.FormName + '"  data-FromEmail="' + this.FromEmailId + '" data-ReplyEmail="' + this.ReplyTo + '" data-Subject="' + this.Subject + '" data-grp="' + this.GroupName + '" data-StoppedReason="' + StoppedReason + '" data-ConfigurationName="' + ConfigurationName + '" data-toggle="popover" ></i>' +
                '</div>' +


                '</div></td>' +
                '<td class="text-left"><div class="td-actionFlexSB">' +
                '<div class="nametitWrap">' +
                '<span class="groupNameTxt">' + this.CampaignName + '</span>' +
                '<span class="createdDateTd">' + this.TemplateName + '</span>' +
                '</div></div></td>' +
                '<td class="cursor-pointer" onclick="getMailCampaignContacts(\'sent\',' + this.Id + ',0);">' + this.TotalSent + '</td>' +
                '<td class="cursor-pointer" onclick="getMailCampaignContacts(\'delivered\',' + this.Id + ',0);">' + this.TotalDelivered + '</td>' +
                '<td class="cursor-pointer" onclick="getMailCampaignContacts(\'open\',' + this.Id + ',0);">' + this.TotalOpen + '</td>' +
                '<td class="cursor-pointer" onclick="getMailCampaignContacts(\'clicked\',' + this.Id + ',0);">' + this.TotalClick + '</td>' +
                '<td class="cursor-pointer" onclick="getMailCampaignContacts(\'uniqueclicked\',' + this.Id + ',0);">' + this.UniqueClick + '</td>' +
                '<td class="cursor-pointer" onclick="getMailCampaignContacts(\'urls\',' + this.Id + ',0);">' + this.URL + '</td>' +
                '<td class="cursor-pointer" onclick="getMailCampaignContacts(\'optout\',' + this.Id + ',0);">' + this.TotalUnsubscribe + '</td>' +
                '<td class="cursor-pointer" onclick="getMailCampaignContacts(\'bounced\',' + this.Id + ',0);">' + this.TotalBounced + '</td>' +
                TotalNotSentTd + '</tr>';
        });

        $("#ui_tblReportData").removeClass('no-data-records');
        $("#ui_tbodyReportData").html(reportTableTrs);
        ShowExportDiv(true);
        RowCheckboxClick();
        InitBindMailInfo();
    } else {
        ShowExportDiv(false);
        ShowPagingDiv(false);
    }
    $('.creditalertblink').popover();
    HidePageLoading();
    CheckAccessPermission("Mail");
}


function BindCampaign() {
    $.ajax({
        url: "/Mail/MailTemplate/GetMailCampaign",
        type: 'POST',
        data: JSON.stringify({ 'AdsId': Plumb5AccountId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            $.each(response, function () {
                optlist = document.createElement('option');
                optlist.value = $(this)[0].Id;
                optlist.text = $(this)[0].Name;
                document.getElementById("ui_dllMailCampaign").options.add(optlist);
            });
        },
        error: ShowAjaxError
    });
};

function BindTemplates() {
    $.ajax({
        url: "/Mail/MailTemplate/GetAllTemplateList",
        type: 'POST',
        data: JSON.stringify({ 'accountId': Plumb5AccountId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            $.each(response, function () {
                optlist = document.createElement('option');
                optlist.value = $(this)[0].Id;
                optlist.text = $(this)[0].Name;
                document.getElementById("ui_dlltemplateCampaign").options.add(optlist);
            });
        },
        error: ShowAjaxError
    });
}

$("#ui_dllMailCampaign").change(function () {
    MaxCount();
});

$("#ui_dlltemplateCampaign").change(function () {
    MaxCount();
});

$("#btnAddToGroup").click(function () {

    var GroupId;
    var MailSendingSettingIdList = GetSelectedCampaignIds();
    if (MailSendingSettingIdList.length == 0) {
        ShowErrorMessage(GlobalErrorList.MailResponses.SelectCampaign);
        $("#dvLoading").hide();
        return false;
    }

    if ($("#ui_ddlGroup").val() == "0") {
        ShowErrorMessage(GlobalErrorList.MailResponses.SelectGroup);
        $("#dvLoading").hide();
        return false;
    }
    else {
        GroupId = $("#ui_ddlGroup").val();
    }

    var CampaignResponseValue = GetSelectedIds();
    if (CampaignResponseValue.length <= 0) {
        ShowErrorMessage(GlobalErrorList.MailResponses.SelectGroupOption);
        $("#dvLoading").hide();
        return false;
    }

    ShowPageLoading();
    if ($("#ui_rad_Add").is(":checked")) {
        $.ajax({
            url: "/Mail/Responses/AddCampaignToGroups",
            type: 'POST',
            data: JSON.stringify({ 'MailSendingSettingId': MailSendingSettingIdList, 'GroupId': GroupId, 'CampaignResponseValue': CampaignResponseValue }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                $("input[name='MailSendingSettingId']:checkbox:checked").prop('checked', false);
                $("input[name='Campaign']:checkbox:checked").prop('checked', false);
                $("#ui_ddlGroup").val('0');
                $("#ui_rad_Add").prop("checked", true);
                ShowSuccessMessage(response);
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    }
    else if ($("#ui_rad_Remove").is(":checked")) {
        $.ajax({
            url: "/Mail/Responses/RemoveCampaignFromGroup",
            type: 'POST',
            data: JSON.stringify({ 'MailSendingSettingId': MailSendingSettingIdList, 'GroupId': GroupId, 'CampaignResponseValue': CampaignResponseValue }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                $("input[name='MailSendingSettingId']:checkbox:checked").prop('checked', false);
                $("input[name='Campaign']:checkbox:checked").prop('checked', false);
                $("#ui_ddlGroup").val('0');
                $("#ui_rad_Add").prop("checked", true);
                ShowSuccessMessage(response);
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    } else {
        ShowErrorMessage(GlobalErrorList.MailResponses.SelectResponseOption);
        HidePageLoading();
    }

});

GetGroupName = function () {

    $.ajax({
        url: "/ManageContact/Group/GetGroupsByStaticOrDynamic",
        data: JSON.stringify({ 'accountId': Plumb5AccountId, GroupType: 1 }),
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response != null && response.GroupDetails != null) {
                $.each(response.GroupDetails, function () {
                    optlist = document.createElement('option');
                    optlist.value = $(this)[0].Id;
                    optlist.text = $(this)[0].Name;
                    document.getElementById("ui_ddlGroup").options.add(optlist);
                });
            }
        },
        error: ShowAjaxError
    });
};

GetSelectedCampaignIds = function () {

    var MailSendingSettingIdList = [];
    $(".selChk:checked").each(function () {
        MailSendingSettingIdList.push($(this).val());
    });

    return MailSendingSettingIdList;
};

GetSelectedIds = function () {

    var CampaignResponsesList = [];

    $("input[name='Campaign']:checkbox:checked").map(function () {
        CampaignResponsesList.push($(this).val());
    });

    return CampaignResponsesList;
};

$(".selchbxall").click(function () {
    if ($(this).is(":checked")) {
        $(".selChk").prop('checked', true);
    } else {
        $(".selChk").prop('checked', false);
    }
    checkBoxClickCount = $('.selChk').filter(':checked').length;
    if (checkBoxClickCount > 0) {
        $(".subdivWrap").addClass('showDiv');
    } else {
        $(".subdivWrap").removeClass('showDiv');
    }
    $(".checkedCount").html(checkBoxClickCount);
});


var checkBoxClickCount, addGroupNameList;
function RowCheckboxClick() {
    $('.selChk').click(function () {
        checkBoxClickCount = $('.selChk').filter(':checked').length;
        if (checkBoxClickCount > 0) {
            $(".subdivWrap").addClass('showDiv');
        } else {
            $(".subdivWrap").removeClass('showDiv');
        }
        $(".checkedCount").html(checkBoxClickCount);
    });
}

function InitBindMailInfo() {
    $('.infocampresponse').popover({
        html: true,
        trigger: "hover",
        placement: "bottom",
        content: function () {

            $("#lblFromName").html($(this).attr("data-FromName"));
            $("#lblFromEmailId").html($(this).attr("data-FromEmail"));
            $("#lblReplyEmailId").html($(this).attr("data-ReplyEmail"));
            $("#lblSubject").html($(this).attr("data-Subject"));
            $("#lblCampaignType").html($(this).attr("data-type") == false ? 'Promotional' : 'Transactional');
            $("#lblGrp").html($(this).attr("data-grp"));
            $("#lblStoppedReason").html($(this).attr("data-StoppedReason"));
            $("#lblConfigurationName").html($(this).attr("data-ConfigurationName"));

            return $(".camptypwrap").html();


        }
    });
}

function ShowMailDetails(Id, GroupName) {

    $("#lblFromName,#lblFromEmailId,#lblReplyEmailId,#lblSubject,#lblCampaignType").html("");
    var MailSendingSettingId = Id;
    $.ajax({
        url: "/Mail/Responses/GetMailSentDetails",
        type: 'POST',
        data: JSON.stringify({ 'MailSendingSettingId': MailSendingSettingId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            $("#lblFromName").html(response.FromName);
            $("#lblFromEmailId").html(response.FromEmailId);
            $("#lblReplyEmailId").html(response.ReplyTo);
            $("#lblSubject").html(response.Subject);
            $("#lblCampaignType").html(response.IsPromotionalOrTransactionalType != 1 ? 'Promotional' : 'Transactional');
            $("#lblGrp").html(GroupName);
            $("#lblFromName").html(GroupName);

            return response.FromName;
        },
        error: ShowAjaxError
    });
}


$(".addremcampres").click(function () {
    let checkcheckedlnth = $(".selChk:checked").length;
    if (checkcheckedlnth == 1) {
        $("#dvManageContact").removeClass('hideDiv');
    } else {
        ShowErrorMessage(GlobalErrorList.MailResponses.SelectError);
        return false;
    }
});


$("#close-popup, .clsepopup").click(function () {
    $(this).parents(".popupcontainer").addClass("hideDiv");
});

$("input[name='addremovetype']").click(function () {
    if ($("input[name='addremovetype']:checked").val().toLowerCase() == "create") {
        $(".creatcampfildwrp").removeClass("hideDiv");
    } else {
        ClearGroupFields();
        $(".creatcampfildwrp").addClass("hideDiv");
    }
});

$(".clscreategrp").click(function () {
    ClearGroupFields();
    $(".creatcampfildwrp").addClass("hideDiv");
});

$("#campcreategroup").click(function () {
    ShowPageLoading();
    if (!ValidateGroup()) {
        HidePageLoading();
        return false;
    }

    var GroupDetailsObject = new Object();
    GroupDetailsObject.Name = CleanText($("#ui_GroupName").val());
    GroupDetailsObject.GroupDescription = CleanText($("#ui_GroupNameDescription").val());
    GroupDetailsObject.DisplayInUnscubscribe = false;
    GroupDetailsObject.GroupType = 1;

    $.ajax({
        url: "/ManageContact/Group/SaveOrUpdateDetails",
        type: 'POST',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'group': GroupDetailsObject }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response != null && response != undefined) {
                if (response.Group.Id > 0) {
                    $("#ui_ddlGroup").append(`<option value='${response.Group.Id}'>${response.Group.Name}</option>`);
                    $("#ui_ddlGroup").select2().val(response.Group.Id).trigger('change');
                    ShowSuccessMessage(GlobalErrorList.Manage_Group.group_add_checkdrpdwn);
                    ClearGroupFields();
                }
                else {
                    ShowErrorMessage(GlobalErrorList.Manage_Group.groupalreadyadded_error);
                }
            }
            HidePageLoading();
        }
    });
});

function ValidateGroup() {
    if (CleanText($("#ui_GroupName").val()).length == 0) {
        ShowErrorMessage(GlobalErrorList.Manage_Group.name_error);
        $("#ui_GroupName").focus();
        return false;
    }
    if (CleanText($("#ui_GroupNameDescription").val()).length == 0) {
        ShowErrorMessage(GlobalErrorList.Manage_Group.description_errorr);
        $("#ui_GroupNameDescription").focus();
        return false;
    }
    return true;
}

function ClearGroupFields() {
    $("#ui_GroupName").val("");
    $("#ui_GroupNameDescription").val("");
}

$(".downldreprt").click(function () {
    let checkcheckedlnth = $(".selChk:checked").length;
    if (checkcheckedlnth == 1) {
        $("#ui_ddl_ExportDataRange").val('2').change().attr("disabled", true);
        ExportFunctionName = "GetCampaignResponseData";
    } else {
        ShowErrorMessage(GlobalErrorList.MailResponses.SelectError);
        return false;
    }
});

$("#ui_exportOrDownload").click(function () {
    ExportFunctionName = "Export";
    $("#ui_ddl_ExportDataRange").attr("disabled", false);
});
