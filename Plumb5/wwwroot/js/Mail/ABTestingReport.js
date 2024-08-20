var CampId = 0;
var timeduration = 0;
var mailsendingsettingid = 0;
var rfromdate, rtodate = "";
var splitidentifier = "";

$(document).ready(function () {
    timeduration = $.urlParam("duration");
    mailsendingsettingid = parseInt($.urlParam("ssid"));
    rfromdate = $.urlParam("frmdate");
    rtodate = $.urlParam("todate");
    splitidentifier = $.urlParam("splitidentifier");

    if (splitidentifier == "0")
        splitidentifier = "";

    ExportFunctionName = "Export";
    BindCampaign();
    GetGroupName();

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
    CampId = $("#ui_dllMailCampaign").val();
    $.ajax({
        url: "/Mail/ABTestingReport/MaxCount",
        type: 'Post',
        data: JSON.stringify({ 'mailCampaignId': CampId, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime, 'mailsendingsettingid': mailsendingsettingid, 'splitidentifier': splitidentifier }),
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
        url: "/Mail/ABTestingReport/GetResponseData",
        type: 'Post',
        data: JSON.stringify({ 'mailCampaignId': CampId, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime, 'OffSet': OffSet, 'FetchNext': FetchNext, 'mailsendingsettingid': mailsendingsettingid, 'splitidentifier': splitidentifier }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindReport,
        error: ShowAjaxError
    });
}

var preData = [];
function BindReport(response) {
    SetNoRecordContent('ui_tblReportData', 12, 'ui_tbodyReportData');
    if (response != undefined && response != null) {
        CurrentRowCount = response.length;
        PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);

        var reportTableTrs = "";

        let data = [];
        for (let i = 0; i < response.length; i++) {
            if (!(data.indexOf(response[i].SplitId) > -1)) {
                data.push(response[i].SplitId);
            }
        }

        for (let i = 0; i < data.length; i++) {
            let splitedDataA = JSLINQ(response).Where(function () { return (this.SplitId == data[i] && this.SplitVariation === "A"); }).items[0];
            let splitedDataB = JSLINQ(response).Where(function () { return (this.SplitId == data[i] && this.SplitVariation === "B"); }).items[0];


            if (splitedDataA != undefined && splitedDataA != null && splitedDataB != undefined && splitedDataB != null) {
                CurrentRowCount++;
                let winnerbadgeA = "", winnerbadgeB = "";

                let ConfigurationName = 'NA';
                if (splitedDataB.ConfigurationName != undefined && splitedDataB.ConfigurationName != null && splitedDataB.ConfigurationName.length > 0) {
                    ConfigurationName = splitedDataB.ConfigurationName;
                }


                if (splitedDataB.IsABWinner == true) {
                    winnerbadgeB = ` <div class="winnerwrp badge-small" data-winner="B" data-SentA="${splitedDataA.ABTestResultForSent}" data-SentB="${splitedDataB.ABTestResultForSent}" data-OpenA="${splitedDataA.ABTestResultForOpened}" data-OpenB="${splitedDataB.ABTestResultForOpened}" data-ClickA="${splitedDataA.ABTestResultForClicked}" data-ClickB="${splitedDataB.ABTestResultForClicked}" data-toggle="popover">
                                      <i class="fa fa-trophy" aria-hidden="true"></i>
                                      <p class="m-0">Winner</p>
                                    </div>`;
                } else if (splitedDataA.IsABWinner == true) {
                    winnerbadgeA = ` <div class="winnerwrp badge-small" data-winner="A" data-SentA="${splitedDataA.ABTestResultForSent}" data-SentB="${splitedDataB.ABTestResultForSent}" data-OpenA="${splitedDataA.ABTestResultForOpened}" data-OpenB="${splitedDataB.ABTestResultForOpened}" data-ClickA="${splitedDataA.ABTestResultForClicked}" data-ClickB="${splitedDataB.ABTestResultForClicked}" data-toggle="popover">
                                      <i class="fa fa-trophy" aria-hidden="true"></i>
                                      <p class="m-0">Winner</p>
                                    </div>`;
                } else if (splitedDataA.ScheduledStatus == 9 && splitedDataA.IsABWinner == false && splitedDataB.IsABWinner == false) {
                    winnerbadgeA = `<div class="abdrawwrp badge-small" data-SentA="${splitedDataA.ABTestResultForSent}" data-SentB="${splitedDataB.ABTestResultForSent}" data-OpenA="${splitedDataA.ABTestResultForOpened}" data-OpenB="${splitedDataB.ABTestResultForOpened}" data-ClickA="${splitedDataA.ABTestResultForClicked}" data-ClickB="${splitedDataB.ABTestResultForClicked}" data-toggle="popover">
                                      <i class="fa fa-pause" aria-hidden="true"></i>
                                      <p class="m-0">Draw</p>
                                    </div>`;
                }


                reportTableTrs += '<tr>' +
                    ' <td  class="td-wid-5 pl-0"><div class="chbxWrap"><label class="ckbox"><input class="selChk" value="' + splitedDataB.Id + '" type="checkbox"><span></span></label></div></td>' +
                    '<td class="text-left">' +
                    '<div class="td-actionFlexSB">' +
                    '<div class="nametitWrap">' +
                    '<span class="groupNameTxt">' + splitedDataB.CampaignIdentifier + '</span>' +
                    '<span class="templatenametxt">' + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(splitedDataB.ScheduledDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(splitedDataB.ScheduledDate)) + '</span>' +
                    '</div>' +
                    '<div class="tdiconwrap">' +
                    '<i class="icon ion-ios-information infocampresponse" data-type="' + splitedDataB.IsPromotionalOrTransactionalType + '" data-FromName="' + splitedDataB.FormName + '"  data-FromEmail="' + splitedDataB.FromEmailId + '" data-ReplyEmail="' + splitedDataB.ReplyTo + '" data-Subject="' + splitedDataB.Subject + '" data-grp="' + splitedDataB.GroupName + '" data-ABWinningMetricRate="' + splitedDataB.ABWinningMetricRate + '" data-ABTestDuration="' + splitedDataB.ABTestDuration + '" data-FallbackTemplate="' + splitedDataB.FallbackTemplate + '" data-ConfigurationName="' + ConfigurationName + '"   data-toggle="popover" ></i>' +
                    '</div>' +
                    '</div>' +
                    '</td>' +
                    '<td class="text-left p-0">' +
                    '<div class="td-actionFlexSB">' +
                    '<div class="nametitWrap">' +
                    '<span class="campnametxt h-60px">' + splitedDataA.CampaignName + '</span>' +
                    '</div>' +
                    '</div>' +
                    '<div class="templateAwrp border-top position-relative">' +
                    '<p class="tempnameAtxt h-60px">' + splitedDataA.TemplateName + '</p>' + winnerbadgeA +
                    '<div class="tempalbl">A</div>' +
                    '</div>' +
                    '<div class="templateBwrp border-top position-relative">' +
                    '<p class="tempnameBtxt h-60px">' + splitedDataB.TemplateName + '</p>' + winnerbadgeB +
                    ' <div class="tempblbl">B</div>' +
                    '</div>' +
                    '</td>' +
                    '<td class="text-center p-0">' +
                    '<div class="camprescountwrp">' +
                    '<div data-sentdetail="Sent" class="totalcount h-60px df-ac-jcenter sentpopup">' + parseInt(splitedDataA.TotalSent + splitedDataB.TotalSent) + '</div>' +
                    ' <div data-sentdetail="Sent" class="tempAcount h-60px df-ac-jcenter cursor-pointer sentpopup" onclick="getMailCampaignContacts(\'sent\',' + splitedDataA.Id + ');">' + splitedDataA.TotalSent + '</div>' +
                    ' <div data-sentdetail="Sent" class="tempBcount h-60px df-ac-jcenter cursor-pointer sentpopup" onclick="getMailCampaignContacts(\'sent\',' + splitedDataB.Id + ');">' + splitedDataB.TotalSent + '</div>' +
                    '</div>' +
                    '</td>' +
                    '<td class="text-center p-0">' +
                    '<div class="camprescountwrp">' +
                    '<div data-sentdetail="Sent" class="totalcount h-60px df-ac-jcenter sentpopup">' + parseInt(splitedDataA.TotalDelivered + splitedDataB.TotalDelivered) + '</div>' +
                    ' <div data-sentdetail="Sent" class="tempAcount h-60px df-ac-jcenter cursor-pointer sentpopup" onclick="getMailCampaignContacts(\'delivered\',' + splitedDataA.Id + ');">' + splitedDataA.TotalDelivered + '</div>' +
                    ' <div data-sentdetail="Sent" class="tempBcount h-60px df-ac-jcenter cursor-pointer sentpopup" onclick="getMailCampaignContacts(\'delivered\',' + splitedDataB.Id + ');">' + splitedDataB.TotalDelivered + '</div>' +
                    '</div>' +
                    '</td>' +
                    '<td class="text-center p-0">' +
                    '<div class="camprescountwrp">' +
                    ' <div data-sentdetail="Opened" class="totalcount h-60px df-ac-jcenter sentpopup">' + parseInt(splitedDataA.TotalOpen + splitedDataB.TotalOpen) + '</div>' +
                    '<div data-sentdetail="Opened" class="tempAcount h-60px df-ac-jcenter cursor-pointer sentpopup" onclick="getMailCampaignContacts(\'open\',' + splitedDataA.Id + ');">' + splitedDataA.TotalOpen + '</div>' +
                    '<div data-sentdetail="Opened" class="tempBcount h-60px df-ac-jcenter cursor-pointer sentpopup" onclick="getMailCampaignContacts(\'open\',' + splitedDataB.Id + ');">' + splitedDataB.TotalOpen + '</div>' +
                    '</div>' +
                    '</td>' +
                    '<td class="text-center p-0">' +
                    '<div class="camprescountwrp">' +
                    '<div data-sentdetail="Clicked" class="totalcount h-60px df-ac-jcenter sentpopup">' + parseInt(splitedDataA.TotalClick + splitedDataB.TotalClick) + '</div>' +
                    '<div data-sentdetail="Clicked" class="tempAcount h-60px df-ac-jcenter cursor-pointer sentpopup" onclick="getMailCampaignContacts(\'clicked\',' + splitedDataA.Id + ');">' + splitedDataA.TotalClick + '</div>' +
                    '<div data-sentdetail="Clicked" class="tempBcount h-60px df-ac-jcenter cursor-pointer sentpopup" onclick="getMailCampaignContacts(\'clicked\',' + splitedDataB.Id + ');">' + splitedDataB.TotalClick + '</div>' +
                    '</div>' +
                    '</td>' +
                    '<td class="text-center p-0">' +
                    '<div class="camprescountwrp">' +
                    '<div data-sentdetail="Unique" class="totalcount h-60px df-ac-jcenter sentpopup">' + parseInt(splitedDataA.UniqueClick + splitedDataB.UniqueClick) + '</div>' +
                    '<div data-sentdetail="Unique" class="tempAcount h-60px df-ac-jcenter cursor-pointer sentpopup" onclick="getMailCampaignContacts(\'uniqueclicked\',' + splitedDataA.Id + ');">' + splitedDataA.UniqueClick + '</div>' +
                    '<div data-sentdetail="Unique" class="tempBcount h-60px df-ac-jcenter cursor-pointer sentpopup" onclick="getMailCampaignContacts(\'uniqueclicked\',' + splitedDataB.Id + ');">' + splitedDataB.UniqueClick + '</div>' +
                    '</div>' +
                    '</td>' +
                    ' <td class="text-center p-0">' +
                    '<div class="camprescountwrp">' +
                    '<div data-sentdetail="url" class="totalcount h-60px df-ac-jcenter sentpopup">' + parseInt(splitedDataA.URL + splitedDataB.URL) + '</div>' +
                    '<div data-sentdetail="url" class="tempAcount h-60px df-ac-jcenter cursor-pointer sentpopup" onclick="getMailCampaignContacts(\'urls\',' + splitedDataA.Id + ');">' + splitedDataA.URL + '</div>' +
                    '<div data-sentdetail="url" class="tempBcount h-60px df-ac-jcenter cursor-pointer sentpopup" onclick="getMailCampaignContacts(\'urls\',' + splitedDataB.Id + ');">' + splitedDataB.URL + '</div>' +
                    ' </div>' +
                    '</td>' +
                    '<td class="text-center p-0">' +
                    '<div class="camprescountwrp">' +
                    ' <div data-sentdetail="Optout" class="totalcount h-60px df-ac-jcenter sentpopup">' + parseInt(splitedDataA.TotalUnsubscribe + splitedDataB.TotalUnsubscribe) + '</div>' +
                    '<div data-sentdetail="Optout" class="tempAcount h-60px df-ac-jcenter cursor-pointer sentpopup" onclick="getMailCampaignContacts(\'optout\',' + splitedDataA.Id + ');">' + splitedDataA.TotalUnsubscribe + '</div>' +
                    ' <div data-sentdetail="Optout" class="tempBcount h-60px df-ac-jcenter cursor-pointer sentpopup" onclick="getMailCampaignContacts(\'optout\',' + splitedDataB.Id + ');">' + splitedDataB.TotalUnsubscribe + '</div>' +
                    '</div>' +
                    '</td>' +
                    ' <td class="text-center p-0">' +
                    ' <div class="camprescountwrp">' +
                    '<div data-sentdetail="Bounce" class="totalcount h-60px df-ac-jcenter sentpopup">' + parseInt(splitedDataA.TotalBounced + splitedDataB.TotalBounced) + '</div>' +
                    ' <div data-sentdetail="Bounce" class="tempAcount h-60px df-ac-jcenter cursor-pointer sentpopup" onclick="getMailCampaignContacts(\'bounced\',' + splitedDataA.Id + ');">' + splitedDataA.TotalBounced + '</div>' +
                    '<div data-sentdetail="Bounce" class="tempBcount h-60px df-ac-jcenter cursor-pointer sentpopup" onclick="getMailCampaignContacts(\'bounced\',' + splitedDataB.Id + ');">' + splitedDataB.TotalBounced + '</div>' +
                    '</div>' +
                    '</td>' +
                    '<td class="text-center p-0">' +
                    '<div class="camprescountwrp">' +
                    '<div data-sentdetail="Error" class="totalcount h-60px df-ac-jcenter sentpopup">' + parseInt(splitedDataA.TotalNotSent + splitedDataB.TotalNotSent) + '</div>' +
                    '<div data-sentdetail="Error" class="tempAcount h-60px df-ac-jcenter cursor-pointer sentpopup" onclick="getMailCampaignContacts(\'notsent\',' + splitedDataA.Id + ');">' + splitedDataA.TotalNotSent + '</div>' +
                    '<div data-sentdetail="Error" class="tempBcount h-60px df-ac-jcenter cursor-pointer sentpopup" onclick="getMailCampaignContacts(\'notsent\',' + splitedDataB.Id + ');">' + splitedDataB.TotalNotSent + '</div>' +
                    '</div>' +
                    ' </td>' +
                    '</tr>';
            }
        }

        $("#ui_tblReportData").removeClass('no-data-records');
        $("#ui_tbodyReportData").html(reportTableTrs);
        ShowExportDiv(true);
        RowCheckboxClick();
        InitBindMailInfo();
        InitBindABResultInfo();
        InitBindABDrawInfo();
    } else {
        ShowExportDiv(false);
        ShowPagingDiv(false);
    }
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

$("#ui_dllMailCampaign").change(function () {
    MaxCount();
});

$("#btnAddToGroup").click(function () {
    ShowPageLoading();
    var GroupId;
    var MailSendingSettingIdList = GetSelectedCampaignIds();
    if (MailSendingSettingIdList.length == 0) {
        ShowErrorMessage(GlobalErrorList.MailResponses.SelectCampaign);
        $("#dvLoading").hide();
        return false;
    }

    if ($("#ui_ddlGroup").val() == "0") {
        ShowErrorMessage(GlobalErrorList.MailResponses.SelectGroup);
        HidePageLoading();
        return false;
    }
    else {
        GroupId = $("#ui_ddlGroup").val();
    }

    var CampaignResponseValue = GetSelectedIds();
    if (CampaignResponseValue.length <= 0) {
        ShowErrorMessage(GlobalErrorList.MailResponses.SelectGroupOption);
        HidePageLoading();
        return false;
    }
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
        HidePageLoading();
        ShowErrorMessage(GlobalErrorList.MailCampaignResponse.ActionCheck);
    }
});

GetGroupName = function () {

    $.ajax({
        url: "/ManageContact/Group/GetGroupsByStaticOrDynamic",
        type: 'POST',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, GroupType: 1 }),
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
        trigger: "click",
        placement: "bottom",
        content: function () {

            $("#lblFromName").html($(this).attr("data-FromName"));
            $("#lblFromEmailId").html($(this).attr("data-FromEmail"));
            $("#lblReplyEmailId").html($(this).attr("data-ReplyEmail"));
            $("#lblSubject").html($(this).attr("data-Subject"));
            $("#lblCampaignType").html($(this).attr("data-type") == false ? 'Promotional' : 'Transactional');
            $("#lblGrp").html($(this).attr("data-grp"));
            $("#lblWinningMetric").html($(this).attr("data-ABWinningMetricRate"));
            $("#lblTestDuration").html($(this).attr("data-ABTestDuration"));
            $("#lblConfigurationName").html($(this).attr("data-ConfigurationName"));
            let IsAB = $(this).attr("data-FallbackTemplate");

            if (IsAB === "A") {
                IsAB = "Template A"
            } else if (IsAB === "B") {
                IsAB = "Template B"
            } else {
                IsAB = "NA"
            }
            $("#lblFallbackTemplate").html(IsAB);

            return $(".camptypwrap").html();


        }
    });
}

function InitBindABResultInfo() {
    $(".winnerwrp").popover({
        html: true,
        trigger: "hover",
        placement: "bottom",
        content: function () {

            $("#ui_abresultASentSpan").html($(this).attr("data-SentA"));
            $("#ui_abresultBSentSpan").html($(this).attr("data-SentB"));

            $("#ui_abresultAOpenSpan").html($(this).attr("data-OpenA"));
            $("#ui_abresultBOpenSpan").html($(this).attr("data-OpenB"));

            $("#ui_abresultAClickSpan").html($(this).attr("data-ClickA"));
            $("#ui_abresultBClickSpan").html($(this).attr("data-ClickB"));


            if ($(this).attr("data-winner") == "A") {
                $("#ui_iswinnerorlostA").html("Winner").removeClass("bg-lost").addClass("bg-winner");
                $("#ui_iswinnerorlostB").html("Lost").removeClass("bg-winner").addClass("bg-lost");
            } else if ($(this).attr("data-winner") == "B") {
                $("#ui_iswinnerorlostB").html("Winner").removeClass("bg-lost").addClass("bg-winner");
                $("#ui_iswinnerorlostA").html("Lost").removeClass("bg-winner").addClass("bg-lost");
            }


            return $(".abresult").html();
        },
    });
}

function InitBindABDrawInfo() {
    $(".abdrawwrp").popover({
        html: true,
        trigger: "hover",
        placement: "bottom",
        content: function () {

            $("#ui_abresultASentSpanDraw").html($(this).attr("data-SentA"));
            $("#ui_abresultBSentSpanDraw").html($(this).attr("data-SentB"));

            $("#ui_abresultAOpenSpanDraw").html($(this).attr("data-OpenA"));
            $("#ui_abresultBOpenSpanDraw").html($(this).attr("data-OpenB"));

            $("#ui_abresultAClickSpanDraw").html($(this).attr("data-ClickA"));
            $("#ui_abresultBClickSpanDraw").html($(this).attr("data-ClickB"));

            return $(".abresultdraw").html();
        },
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
    $(".popupcontainer").addClass('hideDiv');
    $("#ui_AddOrRemoveDiv").removeClass('hideDiv');
});

$("#close-popup, .clsepopup").click(function () {
    $(this).parents(".popupcontainer").addClass("hideDiv");
});