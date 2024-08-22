var SmsSendingSettingList = [];
var checkBoxClickCount, addGroupNameList;
var timeduration = 0;
var smssendingsettingid = 0;
var rfromdate, rtodate = "";

var smsReportUtil = {

    GetSmsCampaigns: function () {
        $.ajax({
            url: "/Sms/Template/GetSmsCampaign",
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ 'accountId': Plumb5AccountId }),
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
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ 'accountId': Plumb5AccountId, GroupType: 1 }),
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

    GetTemplates: function () {
        $.ajax({
            url: "/Sms/ScheduleCampaign/GetTemplateList",
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ 'accountId': Plumb5AccountId }),
            dataType: "json",
            success: function (response) {
                if (response != undefined && response != null) {
                    $.each(response, function () {
                        $("#ui_dlltemplateCampaign").append(`<option value="${$(this)[0].Name}">${$(this)[0].Name}</option>`);
                    });
                }
            },
            error: ShowAjaxError
        });
    },

    MaxCount: function () {
        let CampaignName = $("#ui_ddCampaignnames").val() != "0" ? $("#ui_ddCampaignnames").val() : "";
        let TemplateName = $("#ui_dlltemplateCampaign").val() != "0" ? $("#ui_dlltemplateCampaign").val() : "";
        $.ajax({
            url: "/Sms/Report/GetMaxCount",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime, 'CampaignName': CampaignName, 'TemplateName': TemplateName, 'SmsSendingSettingId': smssendingsettingid }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                TotalRowCount = 0;
                if (response != undefined && response != null && response.returnVal > 0) {
                    TotalRowCount = response.returnVal;
                }

                if (TotalRowCount > 0) {
                    smsReportUtil.GetReport();
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
        let TemplateName = $("#ui_dlltemplateCampaign").val() != "0" ? $("#ui_dlltemplateCampaign").val() : "";
        $.ajax({
            url: "/Sms/Report/GetReportData",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime, 'OffSet': OffSet, 'FetchNext': FetchNext, 'CampaignName': CampaignName, 'TemplateName': TemplateName, 'SmsSendingSettingId': smssendingsettingid }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: smsReportUtil.BindReport,
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
                smsReportUtil.BindEachReport(this, i);
            });
            smsReportUtil.PopOver();
            $('.creditalertblink').popover();
        } else {
            ShowExportDiv(false);
            ShowPagingDiv(false);
        }
        HidePageLoading();
        CheckAccessPermission("Sms");
    },

    BindEachReport: function (SmsReport, index) {

        /** Template string literal has been implement */
        let ScheduledDate = SmsReport.ScheduledDate != null ? $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(SmsReport.ScheduledDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(SmsReport.ScheduledDate)) : "NA";
        let totalPending = SmsReport.TotalSent - SmsReport.TotalDelivered - SmsReport.TotalNotDeliverStatus;
        var StoppedReason = 'NA';
        if (SmsReport.StoppedReason != undefined && SmsReport.StoppedReason != null && SmsReport.StoppedReason.length > 0) {
            StoppedReason = SmsReport.StoppedReason;
        }

        var TotalNotSentTd = `<td data-sentdetail="Error" class="cursor-pointer sentpopup" onclick="GetEachReport(${SmsReport.Id},5)">${SmsReport.TotalNotSent}</td>`;
        if (StoppedReason != "NA") {
            TotalNotSentTd = `<td data-sentdetail="Error" class="cursor-pointer sentpopup">
                <div class="d-flex align-items-center justify-content-end">
                <i class="icon ion-ios-information creditalertblink" data-toggle="popover" data-trigger="hover" data-content="${StoppedReason}"></i>
                <span onclick="GetEachReport(${SmsReport.Id},5)">${SmsReport.TotalNotSent}</span></div></td>`;
        }

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
                                        <span class="groupNameTxt">${SmsReport.Name}</span>
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
                                        <span class="groupNameTxt">${SmsReport.CampaignName}</span>
                                        <span class="createdDateTd">${SmsReport.TemplateName}</span>
                                    </div>
                                </div>
                            </td>
                            <td data-sentdetail="Sent" class="cursor-pointer sentpopup" onclick="GetEachReport(${SmsReport.Id},0)">${SmsReport.TotalSent}</td>
                            <td data-sentdetail="Delivered" class="cursor-pointer sentpopup" onclick="GetEachReport(${SmsReport.Id},1)">${SmsReport.TotalDelivered}</td>
                            <td data-sentdetail="Pending" class="cursor-pointer sentpopup" onclick="GetEachReport(${SmsReport.Id},4)">${totalPending}</td>
                            <td data-sentdetail="Clicked" class="cursor-pointer sentpopup" onclick="GetEachReport(${SmsReport.Id},2)">${SmsReport.TotalClick}</td>    
                            <td data-sentdetail="EffectivenessURL" class="cursor-pointer sentpopup" onclick="GetURLEffectivenessReport(${SmsReport.Id})">${SmsReport.URL}</td>                   
                            <td data-sentdetail="UniqueClick" class="cursor-pointer sentpopup" onclick="GetUniqueEffectivenessReport(${SmsReport.Id},1)">${SmsReport.UniqueClick}</td>                            
                            <td data-sentdetail="Optout" class="cursor-pointer sentpopup" onclick="GetEachReport(${SmsReport.Id},6)">${SmsReport.TotalUnsubscribed}</td>                            
                            <td data-sentdetail="Bounce" class="cursor-pointer sentpopup" onclick="GetEachReport(${SmsReport.Id},3)">${SmsReport.TotalNotDeliverStatus}</td>
                            ${TotalNotSentTd}
                        </tr>`;


        $("#ui_trbodyReportData").append(reportTable);
    },

    PopOver: function () {
        $('.infocampresponse').popover({
            html: true,
            trigger: "hover",
            placement: "bottom",
            content: function () {
                let htmlContent = '';
                var settingid = parseInt($(this).attr("id"));
                $.each(SmsSendingSettingList, function (i) {
                    if ($(this)[0].Id == settingid) {
                        let CampaignType = SmsSendingSettingList[i].IsPromotionalOrTransactionalType == true ? "Transactional" : "Promotional";
                        let GroupName = SmsSendingSettingList[i].SentTo != undefined && SmsSendingSettingList[i].SentTo != null ? SmsSendingSettingList[i].SentTo : "NA";
                        let IsUnicodeMessage = SmsSendingSettingList[i].IsUnicodeMessage ? "true" : "false";
                        var StoppedReason = SmsSendingSettingList[i].StoppedReason != undefined && SmsSendingSettingList[i].StoppedReason != null ? SmsSendingSettingList[i].StoppedReason : "NA";
                        let ConfigurationName = SmsSendingSettingList[i].ConfigurationName != undefined && SmsSendingSettingList[i].ConfigurationName != null ? SmsSendingSettingList[i].ConfigurationName : "NA";
                        $("#ui_popoverDataCampaign").html(CampaignType);
                        $("#ui_popoverDataSentTo").html(GroupName);
                        $("#ui_popoverDataIsUnicodeMessage").html(IsUnicodeMessage);
                        $("#ui_popoverDataStoppedReason").html(StoppedReason);
                        $("#lblConfigurationName").html(ConfigurationName);
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
    ClearGroupFields: function () {
        $("#ui_GroupName").val("");
        $("#ui_GroupNameDescription").val("");
    },
    ValidateGroup: function () {
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
    },
    ClearAddRemoveGroupPopUpFields: function () {
        smsReportUtil.ClearGroupFields();
        $('input[name="addremovetype"]').attr('checked', false);
        $(".creatcampfildwrp").addClass("hideDiv");
        $("#ui_ddlGroup").val("0").trigger('change');
        $('input[name="Campaign"]').attr('checked', false);
    }
}

$(document).ready(function () {
    timeduration = $.urlParam("duration");
    smssendingsettingid = parseInt($.urlParam("ssid"));
    rfromdate = $.urlParam("frmdate");
    rtodate = $.urlParam("todate");

    ShowPageLoading();
    ExportFunctionName = "ExportSmsCampaignReport";

    if (parseInt(timeduration) > 0 && smssendingsettingid > 0) {
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

    //GetUTCDateTimeRange(2);
    smsReportUtil.GetSmsCampaigns();
    smsReportUtil.GetGroupName();
    smsReportUtil.GetTemplates();
    Initialize();
});

function CallBackFunction() {
    ShowPageLoading();
    TotalRowCount = 0;
    CurrentRowCount = 0;
    smsReportUtil.MaxCount();
}

function CallBackPaging() {
    ShowPageLoading();
    CurrentRowCount = 0;
    smsReportUtil.GetReport();
}

$("#ui_ddCampaignnames").change(function () {
    CallBackFunction();
});

$("#ui_dlltemplateCampaign").change(function () {
    CallBackFunction();
});


$(".selchbxall").click(function () {
    if ($(this).is(":checked")) {
        $(".selChk").prop('checked', true);
    } else {
        $(".selChk").prop('checked', false);
    }
});

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

    let checkcheckedlnth = $(".selChk:checked").length;
    if (checkcheckedlnth == 1) {
        smsReportUtil.ClearAddRemoveGroupPopUpFields();
        $(".popupcontainer").removeClass('hideDiv');
        $(".camppopupwrppr").addClass("hideDiv");
        $("#remvgrupcont.camppopupwrppr").removeClass('hideDiv');
        $(".popupItem").removeClass("popup-tbl w-650").addClass('w-450');
        $(".popuptitle h6").html("Add/Remove from Group");
        $("#ui_Paggingdiv").hide();
        $("#ui_Groupsdiv").removeClass("hideDiv");
    } else {
        ShowErrorMessage(GlobalErrorList.MailResponses.SelectError);
        return false;
    }

});

$(document).on('click', '#close-popup,.clsepopup', function () {
    $(this).parents(".popupcontainer").addClass("hideDiv");
    smsReportUtil.ClearAddRemoveGroupPopUpFields();
});

$(document).on('click', '#ui_btnAddOrRemove', function () {
    ShowPageLoading();
    let GroupId;
    let SMSSendingSettingIdList = smsReportUtil.GetSelectedCampaignIds();

    if ($("#ui_ddlGroup").val() == "0") {
        ShowErrorMessage(GlobalErrorList.MailCampaignResponse.GroupError);
        HidePageLoading();
        return false;
    }
    else {
        GroupId = $("#ui_ddlGroup").val();
    }

    var CampaignResponseValue = smsReportUtil.GetSelectedIds();
    if (CampaignResponseValue.length <= 0) {
        ShowErrorMessage(GlobalErrorList.MailCampaignResponse.ActionCheck);
        HidePageLoading();
        return false;
    }

    if ($("#ui_rad_Add").is(":checked")) {
        $.ajax({
            url: "/Sms/Report/AddCampaignToGroups",
            type: 'POST',
            data: JSON.stringify({ 'SmsSendingSettingIdList': SMSSendingSettingIdList, 'GroupId': GroupId, 'CampaignResponseValue': CampaignResponseValue }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                $("#ui_ddlGroup").val('0').trigger('change');
                $("#ui_rad_Add").prop("checked", true);
                ShowSuccessMessage(response);
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    }
    else if ($("#ui_rad_Remove").is(":checked")) {
        $.ajax({
            url: "/Sms/Report/RemoveCampaignFromGroup",
            type: 'POST',
            data: JSON.stringify({ 'SmsSendingSettingIdList': SMSSendingSettingIdList, 'GroupId': GroupId, 'CampaignResponseValue': CampaignResponseValue }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                $("#ui_ddlGroup").val('0').trigger('change');
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

function Initialize() {
    $('.addCampName').select2({
        minimumResultsForSearch: '',
        dropdownAutoWidth: false
    });
}

$("input[name='addremovetype']").click(function () {
    if ($("input[name='addremovetype']:checked").val().toLowerCase() == "create") {
        $(".creatcampfildwrp").removeClass("hideDiv");
    } else {
        smsReportUtil.ClearGroupFields();
        $(".creatcampfildwrp").addClass("hideDiv");
    }
});

$(".clscreategrp").click(function () {
    smsReportUtil.ClearGroupFields();
    $(".creatcampfildwrp").addClass("hideDiv");
});

$("#campcreategroup").click(function () {
    ShowPageLoading();
    if (!smsReportUtil.ValidateGroup()) {
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
                    smsReportUtil.ClearGroupFields();
                }
                else {
                    ShowErrorMessage(GlobalErrorList.Manage_Group.groupalreadyadded_error);
                }
            }
            HidePageLoading();
        }
    });
});

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
    ExportFunctionName = "ExportSmsCampaignReport";
    $("#ui_ddl_ExportDataRange").attr("disabled", false);
});

function GetSelectedCampaignIds() {
    return smsReportUtil.GetSelectedCampaignIds();
}
