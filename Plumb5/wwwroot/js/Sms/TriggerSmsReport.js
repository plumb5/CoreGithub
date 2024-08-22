var SmsSendingSetting = {};
var SmsSendingSettingList = [];
var currentTotalRow = 1;

var triggerUtil = {
    Initialization: function () {
        triggerUtil.GetSmsCampaigns();
        triggerUtil.GetGroupName();
    },
    GetSmsCampaigns: function () {
        $.ajax({
            url: "/Sms/Template/GetSmsCampaign",
            type: 'Get',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != undefined && response != null && response.length > 0) {
                    $.each(response, function () {
                        $("#ui_ddCampaignnames").append(`<option value="${$(this)[0].Name}">${$(this)[0].Name}</option>`);
                    });
                }
            },
            error: ShowAjaxError
        });
    },
    GetGroupName: function () {
        $.ajax({
            url: "/ManageContact/Group/GetGroupsByStaticOrDynamic",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, GroupType: 1 }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != undefined && response != null && response.GroupDetails != null) {
                    $.each(response.GroupDetails, function () {
                        $("#ui_ddlGroup").append(`<option value="${$(this)[0].Id}">${$(this)[0].Name}</option>`);
                    });
                }
            },
            error: ShowAjaxError
        });
    },
    MaxCount: function () {
        let CampaignName = $("#ui_ddCampaignnames").val() != "0" ? $("#ui_ddCampaignnames").val() : "";
        $.ajax({
            url: "/Sms/TriggerReport/GetMaxCount",
            type: 'Post',
            data: JSON.stringify({ 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime, 'OrderBy': $("#ui_sortdate").val(), 'CampaignName': CampaignName }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                TotalRowCount = 0;
                if (response != undefined && response != null && response.returnVal > 0) {
                    TotalRowCount = response.returnVal;
                }

                if (TotalRowCount > 0) {
                    triggerUtil.GetReport();
                }
                else {
                    SetNoRecordContent('ui_tableReport', 12, 'ui_trbodyReportData');
                    HidePageLoading();
                }
            },
            error: ShowAjaxError
        });
    },
    GetReport: function () {
        FetchNext = GetNumberOfRecordsPerPage();
        let CampaignName = $("#ui_ddCampaignnames").val() != "0" ? $("#ui_ddCampaignnames").val() : "";
        $.ajax({
            url: "/Sms/TriggerReport/GetAllReponses",
            type: 'Post',
            data: JSON.stringify({ 'OffSet': OffSet, 'FetchNext': FetchNext, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime, 'OrderBy': $("#ui_sortdate").val(), 'CampaignName': CampaignName }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: triggerUtil.BindReport,
            error: ShowAjaxError
        });
    },
    BindReport: function (response) {
        SetNoRecordContent('ui_tableReport', 12, 'ui_trbodyReportData');
        if (response != undefined && response != null && response.length > 0) {
            SmsSendingSettingList = response;
            CurrentRowCount = response.length;
            PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);
            $("#ui_trbodyReportData").html('');
            $("#ui_tableReport").removeClass('no-data-records');
            ShowExportDiv(true);
            ShowPagingDiv(true);

            $.each(response, function (i) {
                triggerUtil.BindEachReport(this, i);
            });
            triggerUtil.PopOver();

        } else {
            ShowExportDiv(false);
            ShowPagingDiv(false);
        }
        HidePageLoading();
        CheckAccessPermission("SMS");
    },
    BindEachReport: function (SmsReport, index) {
        /** Template string literal has been implement */
        let ScheduledDate = SmsReport.TriggerCreateDate != null ? $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(SmsReport.TriggerCreateDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(SmsReport.TriggerCreateDate)) : "NA";
        let totalPending = SmsReport.SentCount - SmsReport.ViewCount - SmsReport.BounceCount;

        let reportTable = `<tr>
                            <td>
                                <div class="custom-control custom-checkbox">
                                    <input type="checkbox" class="custom-control-input selChk" id="cont_${index}" name="SMSSendingSettingId" value="${SmsReport.Id}">
                                    <label class="custom-control-label" for="cont_${index}"></label>
                                </div>
                            </td>
                            <td class="text-left">
                                <div class="td-actionFlexSB">
                                    <div class="nametitWrap">
                                        <span class="groupNameTxt">${SmsReport.TriggerHeading}</span>
                                        <span class="templatenametxt">${ScheduledDate}</span>
                                    </div>
                                    <div class="tdiconwrap">
                                        <i id="${SmsReport.Id}" class="icon ion-ios-information infocampresponse" data-toggle="popover"></i>
                                    </div>
                                </div>
                            </td>
                            <td class="text-left">
                                <div class="td-actionFlexSB">
                                    <div class="nametitWrap">
                                        <span class="groupNameTxt">${SmsReport.CampaignName != null ? SmsReport.CampaignName : "NA"}</span>
                                        <span class="createdDateTd">${SmsReport.TemplateName != null ? SmsReport.TemplateName : "NA"}</span>
                                    </div>
                                </div>
                            </td>
                            <td data-sentdetail="Sent" class="cursor-pointer sentpopup" onclick="GetEachReport(${SmsReport.Id},0)">${SmsReport.SentCount}</td>
                            <td data-sentdetail="Delivered" class="cursor-pointer sentpopup" onclick="GetEachReport(${SmsReport.Id},1)">${SmsReport.ViewCount}</td>
                            <td data-sentdetail="Pending" class="cursor-pointer sentpopup" onclick="GetEachReport(${SmsReport.Id},4)">${totalPending}</td>
                            <td data-sentdetail="Clicked" class="cursor-pointer sentpopup" onclick="GetEachReport(${SmsReport.Id},2)">${SmsReport.ResponseCount}</td>  
                            <td data-sentdetail="EffectivenessURL" class="cursor-pointer sentpopup" onclick="GetURLEffectivenessReport(${SmsReport.Id})">${SmsReport.URL}</td>  
                            <td data-sentdetail="UniqueClick" class="cursor-pointer sentpopup" onclick="GetUniqueEffectivenessReport(${SmsReport.Id},1)">${SmsReport.UniqueClick}</td>  
                            <td data-sentdetail="Optout" class="cursor-pointer sentpopup" onclick="GetEachReport(${SmsReport.Id},6)">${SmsReport.OptOutCount}</td>                            
                            <td data-sentdetail="Bounce" class="cursor-pointer sentpopup" onclick="GetEachReport(${SmsReport.Id},3)">${SmsReport.BounceCount}</td>
                            <td data-sentdetail="Error" class="cursor-pointer sentpopup" onclick="GetEachReport(${SmsReport.Id},5)">${SmsReport.NotSentCount}</td>
                        </tr>`;


        $("#ui_trbodyReportData").append(reportTable);
    },
    PopOver: function () {
        $('.infocampresponse').popover({
            html: true,
            trigger: "click",
            placement: "bottom",
            content: function () {
                let htmlContent = '';
                $.each(SmsSendingSettingList, function (i) {
                    if ($(this)[0].Id == parseInt($(".infocampresponse").attr("id"))) {
                        $("#ui_popoverDataCampaign").html("Transactional");
                    }
                });

                return $(".camptypwrap").html();
            }
        });
    },
    GetSelectedIds: function () {
        let CampaignResponsesList = [];
        $("input[name='Campaign']:checkbox:checked").map(function () {
            CampaignResponsesList.push($(this).val());
        });
        return CampaignResponsesList;
    },
    GetSelectedCampaignIds: function () {
        let SmsSendingSettingIdList = [];
        $("input[name='SMSSendingSettingId']:checkbox:checked").map(function () {
            SmsSendingSettingIdList.push($(this).val());
        });
        return SmsSendingSettingIdList;
    },
    AddToGroup: function (SMSSendingSettingIdList, GroupId, CampaignResponseValue) {
        $.ajax({
            url: "/Sms/TriggerReport/AddCampaignToGroups",
            type: 'POST',
            data: JSON.stringify({ 'TriggerMailSmsIdList': SMSSendingSettingIdList, 'GroupId': GroupId, 'CampaignResponseValue': CampaignResponseValue }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                //$("input[name='SMSSendingSettingId']:checkbox:checked").prop('checked', false);
                //$("input[name='Campaign']:checkbox:checked").prop('checked', false);
                $("#ui_ddlGroup").val('0');
                $("#ui_rad_Add").prop("checked", true);
                ShowSuccessMessage(response);
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },
    RemoveFromGroup: function (SMSSendingSettingIdList, GroupId, CampaignResponseValue) {
        $.ajax({
            url: "/Sms/TriggerReport/RemoveCampaignFromGroup",
            type: 'POST',
            data: JSON.stringify({ 'TriggerMailSmsIdList': SMSSendingSettingIdList, 'GroupId': GroupId, 'CampaignResponseValue': CampaignResponseValue }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                //$("input[name='SMSSendingSettingId']:checkbox:checked").prop('checked', false);
                //$("input[name='Campaign']:checkbox:checked").prop('checked', false);
                $("#ui_ddlGroup").val('0');
                $("#ui_rad_Add").prop("checked", true);
                ShowSuccessMessage(response);
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    }
}

$(document).ready(function () {
    ShowPageLoading();
    ExportFunctionName = "ExportSmsTriggerReport";
    GetUTCDateTimeRange(2);
    triggerUtil.Initialization();
});

function CallBackFunction() {
    ShowPageLoading();
    TotalRowCount = 0;
    CurrentRowCount = 0;
    triggerUtil.MaxCount();
}

function CallBackPaging() {
    ShowPageLoading();
    CurrentRowCount = 0;
    triggerUtil.GetReport();
}


$("#ui_ddCampaignnames").change(function () {
    CallBackFunction();
});

$("#ui_sortdate").change(function () {
    CallBackFunction();
});

$(".selchbxall").click(function () {
    if ($(this).is(":checked")) {
        $(".selChk").prop('checked', true);
    } else {
        $(".selChk").prop('checked', false);
    }
});

var checkBoxClickCount, addGroupNameList;

$(document).on('click', '.selChk', function () {
    checkBoxClickCount = $('.selChk').filter(':checked').length;
    if (checkBoxClickCount > 0) {
        $(".subdivWrap").addClass('showDiv');
    } else {
        $(".subdivWrap").removeClass('showDiv');
    }
    $(".checkedCount").html(checkBoxClickCount);
});

$(".selchbxall").click(function () {
    checkBoxClickCount = $('.selChk').filter(':checked').length;
    if (checkBoxClickCount > 0) {
        $(".subdivWrap").addClass('showDiv');
    } else {
        $(".subdivWrap").removeClass('showDiv');
    }
    $(".checkedCount").html(checkBoxClickCount);
});

$(".addremcampres").click(function () {
    $(".popupcontainer").removeClass('hideDiv');
    $(".camppopupwrppr").addClass("hideDiv");
    $("#remvgrupcont.camppopupwrppr").removeClass('hideDiv');
    $(".popupItem").removeClass("popup-tbl w-650").addClass('w-450');
    $(".popuptitle h6").html("Remove from Group");
    $("#ui_Paggingdiv").hide(); $("#ui_Groupsdiv").removeClass("hideDiv");
});

$(document).on('click', '#close-popup,.clsepopup', function () {
    $(this).parents(".popupcontainer").addClass("hideDiv");
});

$(document).on('click', '#ui_btnAddOrRemove', function () {
    ShowPageLoading();
    let GroupId;
    let SMSSendingSettingIdList = triggerUtil.GetSelectedCampaignIds();

    if ($("#ui_ddlGroup").val() == "0") {
        ShowErrorMessage(GlobalErrorList.MailCampaignResponse.GroupError);
        HidePageLoading();
        return false;
    }

    GroupId = $("#ui_ddlGroup").val();

    var CampaignResponseValue = triggerUtil.GetSelectedIds();
    if (CampaignResponseValue.length <= 0) {
        ShowErrorMessage(GlobalErrorList.MailCampaignResponse.ActionCheck);
        HidePageLoading();
        return false;
    }

    if ($("#ui_rad_Add").is(":checked")) {
        triggerUtil.AddToGroup(SMSSendingSettingIdList, GroupId, CampaignResponseValue);
    } else if ($("#ui_rad_Remove").is(":checked")) {
        triggerUtil.RemoveFromGroup(SMSSendingSettingIdList, GroupId, CampaignResponseValue);
    }
});


$('#ui_ddCampaignnames,#ui_sortdate,#ui_ddlGroup').select2({
    minimumResultsForSearch: '',
    dropdownAutoWidth: false
});

