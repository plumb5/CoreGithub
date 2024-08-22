var WhatsAppSendingSettingList = [];
var checkBoxClickCount, addGroupNameList;

var timeduration = 0;
var whatsappsendingsettingid = 0;
var rfromdate, rtodate = "";

var WhatsAppReportUtil = {

    GetWhatsAppCampaigns: function () {
        $.ajax({
            url: "/WhatsApp/WhatsAppTemplates/GetCampaignList",
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
            url: "/WhatsApp/ScheduleCampaign/GetTemplateList",
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
            url: "/WhatsApp/Report/GetMaxCount",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime, 'CampaignName': CampaignName, 'TemplateName': TemplateName, 'WhatsAppSendingSettingId': whatsappsendingsettingid }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                TotalRowCount = 0;
                if (response != undefined && response != null && response.returnVal > 0) {
                    TotalRowCount = response.returnVal;
                }

                if (TotalRowCount > 0) {
                    WhatsAppReportUtil.GetReport();
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
            url: "/WhatsApp/Report/GetReportData",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime, 'OffSet': OffSet, 'FetchNext': FetchNext, 'CampaignName': CampaignName, 'TemplateName': TemplateName, 'WhatsAppSendingSettingId': whatsappsendingsettingid }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: WhatsAppReportUtil.BindReport,
            error: ShowAjaxError
        });
    },

    BindReport: function (response) {
        SetNoRecordContent('ui_tableReport', 12, 'ui_trbodyReportData');
        if (response != undefined && response != null && response.length > 0) {
            WhatsAppSendingSettingList = response;
            CurrentRowCount = response.length;
            PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);
            $("#ui_trbodyReportData").html('');
            $("#ui_tableReport").removeClass('no-data-records');
            ShowExportDiv(true);
            ShowPagingDiv(true);

            $.each(response, function (i) {
                WhatsAppReportUtil.BindEachReport(this, i);
            });
            WhatsAppReportUtil.PopOver();
            $('.creditalertblink').popover();
        } else {
            ShowExportDiv(false);
            ShowPagingDiv(false);
        }
        HidePageLoading();
        CheckAccessPermission("WhatsApp");
    },

    BindEachReport: function (WhatsAppReport, index) {

        /** Template string literal has been implement */
        let ScheduledDate = WhatsAppReport.ScheduledDate != null ? $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(WhatsAppReport.ScheduledDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(WhatsAppReport.ScheduledDate)) : "NA";

        if (WhatsAppReport.StoppedReason != undefined && WhatsAppReport.StoppedReason != null && WhatsAppReport.StoppedReason.length > 0) {
            StoppedReason = WhatsAppReport.StoppedReason;
        }


        let reportTable = `<tr>
                            <td>
                                <div class="custom-control custom-checkbox">
                                    <input type="checkbox" class="custom-control-input selChk" id="cont_${index}" name="WhatsAppSendingSettingId" value="${WhatsAppReport.Id}">
                                    <label class="custom-control-label" for="cont_${index}"></label>
                                </div>
                            </td>
                            <td class="text-left">
                                <div class="td-actionFlexSB">
                                    <div class="nametitWrap">
                                        <span class="groupNameTxt">${WhatsAppReport.Name}</span>
                                        <span class="templatenametxt">${ScheduledDate}</span>
                                    </div>
                                    <div class="tdiconwrap">
                                        <i id="${WhatsAppReport.Id}" class="icon ion-ios-information infocampresponse" data-toggle="popover"></i>
                                    </div>
                                </div>
                            </td>
                            <td class="text-left">
                                <div class="td-actionFlexSB">
                                    <div class="nametitWrap">
                                        <span class="groupNameTxt">${WhatsAppReport.CampaignName}</span>
                                        <span class="createdDateTd">${WhatsAppReport.TemplateName}</span>
                                    </div>
                                </div>
                            </td>
                            <td data-sentdetail="Sent" class="cursor-pointer sentpopup" onclick="GetEachReport(${WhatsAppReport.Id},0)">${WhatsAppReport.TotalSent}</td>
                            <td data-sentdetail="Delivered" class="cursor-pointer sentpopup" onclick="GetEachReport(${WhatsAppReport.Id},1)">${WhatsAppReport.TotalDelivered}</td>
                            <td data-sentdetail="Read" class="cursor-pointer sentpopup" onclick="GetEachReport(${WhatsAppReport.Id},2)">${WhatsAppReport.TotalRead}</td>
                            <td data-sentdetail="Clicked" class="cursor-pointer sentpopup" onclick="GetEachReport(${WhatsAppReport.Id},9)">${WhatsAppReport.TotalClick}</td>
                            <td data-sentdetail="EffectivenessURL" class="cursor-pointer sentpopup" onclick="GetURLEffectivenessReport(${WhatsAppReport.Id})">${WhatsAppReport.URL}</td>
                            <td data-sentdetail="UniqueClick" class="cursor-pointer sentpopup" onclick="GetUniqueEffectivenessReport(${WhatsAppReport.Id},1)">${WhatsAppReport.UniqueClick}</td>
                            <td data-sentdetail="Failed" class="cursor-pointer sentpopup" onclick="GetEachReport(${WhatsAppReport.Id},3)">${WhatsAppReport.TotalFailed}</td>
                                                        
                             
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
                $.each(WhatsAppSendingSettingList, function (i) {
                    if ($(this)[0].Id == settingid) {

                        let CampaignType = WhatsAppSendingSettingList[i].TemplateType == "text" ? "Text" : (WhatsAppSendingSettingList[i].TemplateType == "image" ? "Image" : (WhatsAppSendingSettingList[i].TemplateType == "video" ? "Video" : (WhatsAppSendingSettingList[i].TemplateType == "document" ? "Document" : "Location")));
                        let TemplateContent = WhatsAppSendingSettingList[i].TemplateContent != undefined && WhatsAppSendingSettingList[i].TemplateContent != null ? WhatsAppSendingSettingList[i].TemplateContent : "NA";
                        let SentTo = WhatsAppSendingSettingList[i].SentTo != undefined && WhatsAppSendingSettingList[i].SentTo != null ? WhatsAppSendingSettingList[i].SentTo : "NA"
                        let ConfigurationName = WhatsAppSendingSettingList[i].ConfigurationName != undefined && WhatsAppSendingSettingList[i].ConfigurationName != null ? WhatsAppSendingSettingList[i].ConfigurationName : "NA";
                        $("#ui_popoverDataCampaign").html(CampaignType);
                        $("#ui_popoverTemplateContent").html(TemplateContent);
                        $("#ui_popoverDataSentTo").html(SentTo);
                        $("#lblConfigurationName").html(ConfigurationName);

                    }
                });

                return $(".camptypwrap").html();
            }
        });
    },

    GetSelectedIds: function () {
        let CampaignResponsesList = [];
        $("input[name='Whatsappcampaign']:checkbox:checked").map(function () {
            CampaignResponsesList.push($(this).val());
        });

        return CampaignResponsesList;
    },

    GetSelectedCampaignIds: function () {
        let WhatsAppSendingSettingIdList = [];
        $("input[name='WhatsAppSendingSettingId']:checkbox:checked").map(function () {
            WhatsAppSendingSettingIdList.push($(this).val());
        });
        return WhatsAppSendingSettingIdList;
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
        WhatsAppReportUtil.ClearGroupFields();
        $('input[name="addremovetype"]').attr('checked', false);
        $(".creatcampfildwrp").addClass("hideDiv");
        $("#ui_ddlGroup").val("0").trigger('change');
        $('input[name="Campaign"]').attr('checked', false);
    }
}

$(document).ready(function () {

    timeduration = $.urlParam("duration");
    whatsappsendingsettingid = $.urlParam("ssid");
    rfromdate = $.urlParam("frmdate");
    rtodate = $.urlParam("todate");

    ShowPageLoading();
    ExportFunctionName = "ExportWhatsAppCampaignReport";

    if (parseInt(timeduration) > 0 && whatsappsendingsettingid > 0) {
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

    WhatsAppReportUtil.GetWhatsAppCampaigns();
    WhatsAppReportUtil.GetGroupName();
    WhatsAppReportUtil.GetTemplates();
    Initialize();
});

function CallBackFunction() {
    ShowPageLoading();
    TotalRowCount = 0;
    CurrentRowCount = 0;
    WhatsAppReportUtil.MaxCount();
}

function CallBackPaging() {
    ShowPageLoading();
    CurrentRowCount = 0;
    WhatsAppReportUtil.GetReport();
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
        WhatsAppReportUtil.ClearAddRemoveGroupPopUpFields();
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
    WhatsAppReportUtil.ClearAddRemoveGroupPopUpFields();
});

$(document).on('click', '#ui_btnAddOrRemove', function () {
    ShowPageLoading();
    let GroupId;
    let WhatsAppSendingSettingIdList = WhatsAppReportUtil.GetSelectedCampaignIds();

    if ($("#ui_ddlGroup").val() == "0") {
        ShowErrorMessage(GlobalErrorList.MailCampaignResponse.GroupError);
        HidePageLoading();
        return false;
    }
    else {
        GroupId = $("#ui_ddlGroup").val();
    }

    var CampaignResponseValue = WhatsAppReportUtil.GetSelectedIds();
    if (CampaignResponseValue.length <= 0) {
        ShowErrorMessage(GlobalErrorList.MailCampaignResponse.ActionCheck);
        HidePageLoading();
        return false;
    }

    if ($("#ui_rad_Add").is(":checked")) {
        $.ajax({
            url: "/WhatsApp/Report/AddCampaignToGroups",
            type: 'POST',
            data: JSON.stringify({ 'WhatsAppSendingSettingIdList': WhatsAppSendingSettingIdList, 'GroupId': GroupId, 'CampaignResponseValue': CampaignResponseValue }),
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
            url: "/WhatsApp/Report/RemoveCampaignFromGroup",
            type: 'POST',
            data: JSON.stringify({ 'WhatsAppSendingSettingIdList': WhatsAppSendingSettingIdList, 'GroupId': GroupId, 'CampaignResponseValue': CampaignResponseValue }),
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
        WhatsAppReportUtil.ClearGroupFields();
        $(".creatcampfildwrp").addClass("hideDiv");
    }
});

$(".clscreategrp").click(function () {
    WhatsAppReportUtil.ClearGroupFields();
    $(".creatcampfildwrp").addClass("hideDiv");
});

$("#campcreategroup").click(function () {
    ShowPageLoading();
    if (!WhatsAppReportUtil.ValidateGroup()) {
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
                    WhatsAppReportUtil.ClearGroupFields();
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
        ExportFunctionName = "GetWhatsAppCampaignResponseData";
    } else {
        ShowErrorMessage(GlobalErrorList.MailResponses.SelectError);
        return false;
    }
});

$("#ui_exportOrDownload").click(function () {
    ExportFunctionName = "ExportWhatsAppCampaignReport";
    $("#ui_ddl_ExportDataRange").attr("disabled", false);
});