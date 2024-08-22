var PushSendingSettingList = [];
var WebPushSendingSettingIdListexport = [];
var checkBoxClickCount, addGroupNameList;

var webpushReportUtil = {

    GetPushCampaigns: function () {
        $.ajax({
            url: "/WebPush/Report/GetCampaignIdentifier",
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

    MaxCount: function () {
        let CampaignName = $("#ui_ddCampaignnames").val() != "0" ? $("#ui_ddCampaignnames").val() : "";
        $.ajax({
            url: "/WebPush/Report/GetMaxCount",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime, 'CampaignName': CampaignName }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                TotalRowCount = 0;
                if (response != undefined && response != null && response.returnVal > 0) {
                    TotalRowCount = response.returnVal;
                }

                if (TotalRowCount > 0) {
                    webpushReportUtil.GetReport();
                }
                else {
                    SetNoRecordContent('ui_tableReport', 11, 'ui_trbodyReportData');
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
            url: "/WebPush/Report/GetReportData",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime, 'OffSet': OffSet, 'FetchNext': FetchNext, 'CampaignName': CampaignName }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: webpushReportUtil.BindReport,
            error: ShowAjaxError
        });
    },

    BindReport: function (response) {
        SetNoRecordContent('ui_tableReport', 11, 'ui_trbodyReportData');
        if (response != undefined && response != null && response.length > 0) {
            PushSendingSettingList = response;
            CurrentRowCount = response.length;
            PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);
            $("#ui_trbodyReportData").html('');
            $("#ui_tableReport").removeClass('no-data-records');
            ShowExportDiv(true);
            ShowPagingDiv(true);

            $.each(response, function (i) {
                webpushReportUtil.BindEachReport(this, i);
            });
            webpushReportUtil.PopOver();
            $('.creditalertblink').popover();
        } else {
            ShowExportDiv(false);
            ShowPagingDiv(false);
        }
        HidePageLoading();
    },

    BindEachReport: function (PushReport, index) {
        var StoppedReason = 'NA';
        if (PushReport.StoppedReason != undefined && PushReport.StoppedReason != null && PushReport.StoppedReason.length > 0) {
            StoppedReason = PushReport.StoppedReason;
        }
        var getGroup = PushReport.SentTo != null ? PushReport.SentTo : 'NA';
        var TotalNotSentTd = `<td data-sentdetail="Error" class ="cursor-pointer sentpopup" onclick="getCampaignUsers(\'notsent\',${PushReport.Id},0);">${PushReport.TotalNotSent}</td>`;
        if (StoppedReason != "NA") {
            TotalNotSentTd = `<td data-sentdetail="Error" class="cursor-pointer sentpopup">
                <div class="d-flex align-items-center justify-content-end">
                <i class="icon ion-ios-information creditalertblink" data-toggle="popover" data-trigger="hover" data-content="${StoppedReason}"></i>
                <span onclick="getCampaignUsers(\'notsent\',${PushReport.Id},0);">${PushReport.TotalNotSent}</span></div></td>`;
        }
        var getdate = $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(PushReport.ScheduledDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(PushReport.ScheduledDate));
        let reportTable = `<tr>  <td>
                                <div class="custom-control custom-checkbox">
                                    <input type="checkbox" class="custom-control-input selChk" id="cont_${index}" name="PushSendingSettingId" value="${PushReport.Id}">
                                    <label class="custom-control-label" for="cont_${index}"></label>
                                </div>
                            </td>
                              <td class ="text-left">
                                                                    <div class ="td-actionFlexSB">
                                                                        <div class ="nametitWrap">
                                                                            <span class ="groupNameTxt">${PushReport.Name}</span>
                                                                            <span class ="templatenametxt">${getdate}</span>
                                                                        </div>
                                                                        <div class ="tdiconwrap">
                                                                        <i id="${index}" class ="icon ion-ios-information infocampresponse" data-toggle="popover"></i>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td class ="text-left">
                                                                    <div class ="td-actionFlexSB">
                                                                        <div class ="nametitWrap">
                                                                            <span class ="groupNameTxt">${PushReport.CampaignName}</span>
                                                                            <span class ="createdDateTd">${PushReport.TemplateName}</span>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td class ="text-left wordbreak">${getGroup}</td>
                                                                <td data-sentdetail="Sent" class ="cursor-pointer sentpopup" onclick="getCampaignUsers(\'sent\',${PushReport.Id},0);">${PushReport.TotalSent}</td>
                                                                <td data-sentdetail="Viewed" class ="cursor-pointer sentpopup" onclick="getCampaignUsers(\'view\',${PushReport.Id},0);">${PushReport.TotalView}</td>
                                                                <td data-sentdetail="Clicked" class ="cursor-pointer sentpopup" onclick="getCampaignUsers(\'click\',${PushReport.Id},0);">${PushReport.TotalClick}</td>
                                                                <td data-sentdetail="Close" class ="cursor-pointer sentpopup" onclick="getCampaignUsers(\'close\',${PushReport.Id},0);">${PushReport.TotalClose}</td>
                                                                <td data-sentdetail="Unsubscribed" class ="cursor-pointer sentpopup" onclick="getCampaignUsers(\'unsubscrib\',${PushReport.Id},0);">${PushReport.TotalUnsubscribed}</td>
                                                                ${TotalNotSentTd}
                                                             
                                                            </tr>`;


        $("#ui_trbodyReportData").append(reportTable);
    },
    GetSelectedIds: function () {
        let CampaignResponsesList = [];
        $("input[name='Campaign']:checkbox:checked").map(function () {
            CampaignResponsesList.push($(this).val());
        });
        return CampaignResponsesList;
    },

    GetSelectedCampaignIds: function () {
        let PushSendingSettingIdList = [];
        $("input[name='PushSendingSettingId']:checkbox:checked").map(function () {
            PushSendingSettingIdList.push($(this).val());
        });
        return PushSendingSettingIdList;
    },
    PopOver: function () {
        $('.infocampresponse').popover({
            html: true,
            trigger: "hover",
            placement: "bottom",
            content: function (i) {
                let htmlContent = '';
                var i = parseInt($(this).attr("id"));
                let CampaignType = PushSendingSettingList[i].NotificationType == 1 ? "Text" : "Text with Banner";
                let GroupName = PushSendingSettingList[i].SentTo != undefined && PushSendingSettingList[i].SentTo != null ? PushSendingSettingList[i].SentTo : "NA";
                let Message = PushSendingSettingList[i].MessageContent;
                var StoppedReason = PushSendingSettingList[i].StoppedReason != undefined && PushSendingSettingList[i].StoppedReason != null ? PushSendingSettingList[i].StoppedReason : "NA";
                $("#ui_popoverDataCampaign").html(CampaignType);
                $("#ui_popoverDataSentTo").html(GroupName);
                $("#ui_popoverDataMsg").html(Message);
                $("#ui_popoverDataStoppedReason").html(StoppedReason);



                return $(".camptypwrap").html();
            }
        });
    }
}

$(document).ready(function () {
    ShowPageLoading();
    ExportFunctionName = "ExportWebPushCampaignReport";
    GetUTCDateTimeRange(2);
    webpushReportUtil.GetPushCampaigns();
    webpushReportUtil.GetGroupName();
});

function CallBackFunction() {
    ShowPageLoading();
    TotalRowCount = 0;
    CurrentRowCount = 0;
    webpushReportUtil.MaxCount();
}

function CallBackPaging() {
    ShowPageLoading();
    CurrentRowCount = 0;
    webpushReportUtil.GetReport();
}

$(".selchbxall").click(function () {
    if ($(this).is(":checked")) {
        $(".selChk").prop('checked', true);
    } else {
        $(".selChk").prop('checked', false);
    }
});

$("#ui_ddCampaignnames").change(function () {
    CallBackFunction();
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
        $("#dvaddgrpmember").removeClass('hideDiv');
    } else {
        ShowErrorMessage(GlobalErrorList.MailResponses.SelectError);
        return false;
    }

    //$(".camppopupwrppr").addClass("hideDiv");
    //$("#remvgrupcont.camppopupwrppr").removeClass('hideDiv');
    //$(".popupItem").removeClass("popup-tbl w-650").addClass('w-450');
    //$(".popuptitle h6").html("Remove from Group");
    //$("#ui_Paggingdiv").hide(); $("#ui_Groupsdiv").removeClass("hideDiv");
});

$(document).on('click', '#ui_btnAddOrRemove', function () {
    ShowPageLoading();
    let GroupId;
    let WebPushSendingSettingIdList = webpushReportUtil.GetSelectedCampaignIds();

    if ($("#ui_ddlGroup").val() == "0") {
        ShowErrorMessage(GlobalErrorList.MailCampaignResponse.GroupError);
        HidePageLoading();
        return false;
    }
    else {
        GroupId = $("#ui_ddlGroup").val();
    }

    var CampaignResponseValue = webpushReportUtil.GetSelectedIds();
    if (CampaignResponseValue.length <= 0) {
        ShowErrorMessage(GlobalErrorList.MailCampaignResponse.ActionCheck);
        HidePageLoading();
        return false;
    }

    if ($("#ui_rad_Add").is(":checked")) {
        $.ajax({
            url: "/WebPush/Report/AddCampaignToGroups",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'WebPushSendingSettingIdList': WebPushSendingSettingIdList, 'GroupId': GroupId, 'CampaignResponseValue': CampaignResponseValue }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                //$("input[name='PushSendingSettingId']:checkbox:checked").prop('checked', false);
                //$("input[name='Campaign']:checkbox:checked").prop('checked', false);
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
            url: "/WebPush/Report/RemoveCampaignFromGroup",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'WebPushSendingSettingIdList': WebPushSendingSettingIdList, 'GroupId': GroupId, 'CampaignResponseValue': CampaignResponseValue }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                //$("input[name='PushSendingSettingId']:checkbox:checked").prop('checked', false);
                //$("input[name='Campaign']:checkbox:checked").prop('checked', false);
                $("#ui_ddlGroup").val('0');
                $("#ui_rad_Add").prop("checked", true);
                ShowSuccessMessage(response);
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    }
});

$("#ui_ddCampaignnames,#ui_ddlGroup").select2({
    minimumResultsForSearch: '',
    dropdownAutoWidth: false
});
$(".downldreprt").click(function () {
    let checkcheckedlnth = $(".selChk:checked").length;
    if (checkcheckedlnth == 1) {
        $("#ui_ddl_ExportDataRange").val('2').change().attr("disabled", true);
        ExportFunctionName = "GetWebpushCampaignResponseData";
    } else {
        ShowErrorMessage(GlobalErrorList.MailResponses.SelectError);
        return false;
    }
});