var TemplateDetails = { Id: 0, CampaignId: 0, TemplateName: "" };
var CampList = [];
var templateList = [];
var templateUrlsList = Array();

$(document).ready(function () {
    GetGroupList();
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

    if ($("#ui_txtSearchTemplate").val().length > 0) {
        var selCamp = CampList.filter(function (obj) { return (obj.Name === $("#ui_txtSearchTemplate").val()); })[0];

        TemplateDetails.TemplateName = $("#ui_txtSearchTemplate").val();
        TemplateDetails.CampaignId = selCamp != undefined ? selCamp.Id : 0;
    }
    else {
        TemplateDetails = { Id: 0, CampaignId: 0, TemplateName: "" };
    }

    $.ajax({
        url: "/MobilePushNotification/MobilePushTemplate/GetMaxCount",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'MobilePushTemplate': TemplateDetails }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            TotalRowCount = 0;
            if (response != undefined && response != null) {
                TotalRowCount = response.returnVal;
            }

            if (TotalRowCount > 0) {
                GetReport();
            }
            else {
                SetNoRecordContent('ui_tblReportData', 4, 'ui_tbodyReportData');
                HidePageLoading();
            }
        },
        error: ShowAjaxError
    });
}
function GetReport() {
    FetchNext = GetNumberOfRecordsPerPage();
    $.ajax({
        url: "/MobilePushNotification/MobilePushTemplate/GetTemplateList",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'MobilePushTemplate': TemplateDetails, 'OffSet': OffSet, 'FetchNext': FetchNext }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindReport,
        error: ShowAjaxError
    });
}
function BindReport(response) {

    SetNoRecordContent('ui_tblReportData', 4, 'ui_tbodyReportData');
    if (response != undefined && response != null) {
        CurrentRowCount = response.length;
        PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);

        var reportTableTrs;

        $.each(response, function () {
            reportTableTrs += '<tr><td class="text-center">' +
                '<div class="bnotifprevwrap"><i data-title="' + this.Title + '" data-desc="' + this.MessageContent + '" data-subdesc="' + this.SubTitle + '" data-icon="' + this.IconImage + '" data-banner="' + this.BannerImage + '" data-btn1="' + this.Button1_Label + '" data-btn2="' + this.Button2_Label + '" class="icon ion-ios-eye-outline bnotiftemplate" data-toggle="popover" data-original-title="" title="" aria-describedby="popover76680"></i></div>' +
                '</td>' +
                '<td class="text-left">' +
                '<div class="groupnamewrap"><div class="nametitWrap">' +
                '<span class="groupNameTxt">' + this.TemplateName + '</span>' +
                '</div><div class="tdcreatedraft"><div class="dropdown">' +
                '<button type="button" class="verticnwrp" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="icon ion-android-more-vertical mr-0"></i></button>' +
                '<div class="dropdown-menu dropdown-menu-right" aria-labelledby="filterbycontacts">' +
                '<a class="dropdown-item smstemplate DesignPermission" onclick="CreateEditTemplate(' + this.Id + ',' + this.CampaignId + ',\'' + ReplaceSingleQuote(this.TemplateName) + '\',\'' + ReplaceSingleQuote(this.TemplateDescription) + '\')" href="javascript:void(0);">Edit</a>' +
                '<a class="dropdown-item ContributePermission" onclick="DuplicateTemplate(' + this.Id + ',' + this.CampaignId + ',\'' + ReplaceSingleQuote(this.TemplateName) + '\',\'' + ReplaceSingleQuote(this.TemplateDescription) + '\')" href="javascript:void(0);">Duplicate</a>' +
                '<a id="ui_a_MobilePush_' + this.Id + '" data-title="' + this.Title + '" data-desc="' + this.MessageContent + '" data-subdesc="' + this.SubTitle + '" data-icon="' + this.IconImage + '" data-banner="' + this.BannerImage + '" data-btn1="' + this.Button1_Label + '" data-btn2="' + this.Button2_Label + '" class="dropdown-item createpushtemp ContributePermission" onclick="CreatePushNotificationTestCampaign.OpenTestCampaignPopUp(' + this.Id + ',\'' + ReplaceSingleQuote(this.TemplateName) + '\');" href="javascript:void(0);">Test</a>' +
                '<div class="dropdown-divider"></div>' +
                '<a class="dropdown-item FullControlPermission" data-toggle="modal" data-groupid="' + this.Id + '" id="deletetemp" data-target="#deleterow" href="javascript:void(0)">Archive</a>' +
                '</div></div></div></div></td>' +
                '<td>' + this.NotificationType + '</td>' +
                '<td class="text-left">' +
                '<div class="groupnamewrap"><div class="nameTxtWrap">' +
                '<span>' + this.Title + '</span>' +
                '</div></div></td><td>' + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(this.CreatedDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(this.CreatedDate)) + '</td></tr>';
        });

        $("#ui_tblReportData").removeClass('no-data-records');
        $("#ui_tbodyReportData").html(reportTableTrs);
        PreviewClick();
        ShowExportDiv(true);
    }
    else {
        ShowExportDiv(false);
        ShowPagingDiv(false);
    }
    HidePageLoading();
    CheckAccessPermission("MobilePushNotification");
}

function GetGroupList() {
    $.ajax({
        url: "/MobilePushNotification/CampaignSchedule/GetGroupList",
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ 'accountId': Plumb5AccountId }),
        dataType: "json",
        success: function (response) {
            if (response != undefined && response != null) {
                $.each(response, function () {
                    $("#testcampgroupname").append(`<option value="${$(this)[0].Id}">${$(this)[0].Name}</option>`);
                });
            }
            CallBackFunction();
        },
        error: ShowAjaxError
    });
}

document.getElementById("ui_txtSearchTemplate").addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        CallBackFunction();
        event.preventDefault();
    }
    else {
        var templateName = CleanText($('#ui_txtSearchTemplate').val());
        if (templateName === '') {
            CallBackFunction();
        }
    }
});

var tempId = 0;
$(document).on('click', "#deletetemp", function () {
    tempId = parseInt($(this).attr("data-groupid"));
});

$("#deleteRowConfirm").click(function () {
    DeleteFormWithConform(tempId);
});

DeleteFormWithConform = function (Id) {
    $.ajax({
        url: "/MobilePushNotification/MobilePushTemplate/Delete",
        type: 'POST',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'Id': Id }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            ShowSuccessMessage(GlobalErrorList.MobilePushTemplate.DeleteTemplate);
            CallBackFunction();
        },
        error: ShowAjaxError
    });
};

function PreviewClick() {
    $('.bnotiftemplate').click(function () {
        $(".bnotiftemplate").not(this).popover("hide");
    });

    $('.bnotiftemplate').popover({
        html: true,
        trigger: "hover",
        placement: "left",
        content: function () {

            if ($(this).attr("data-icon") != null && $(this).attr("data-icon") != "null" && $(this).attr("data-icon").length != 0) {
                $(".notificonwrp").css("background-image", "url(" + $(this).attr("data-icon") + ")");
            }

            if ($(this).attr("data-banner") != null && $(this).attr("data-banner") != "null" && $(this).attr("data-banner").length != 0) {
                $(".notifbanwrp").show(); $(".notifbanwrp").css("background-image", "url(" + $(this).attr("data-banner") + ")");
            } else { $(".notifbanwrp").hide(); }

            $("#notifsubbtn").hide(); $("#notifcanbtn").hide();
            $(".notiftitle").html($(this).attr("data-title"));
            $(".notifdescript").html($(this).attr("data-desc"));
            $(".notifsubtitle").html($(this).attr("data-subdesc") != "null" ? $(this).attr("data-subdesc") : "");
            // if ($(this).attr("data-btn1") != null && $(this).attr("data-btn1") != "null" && $(this).attr("data-btn1").length != 0) { $("#notifsubbtn").show(); $(".bnotbtn1").html($(this).attr("data-btn1")); }
            // if ($(this).attr("data-btn2") != null && $(this).attr("data-btn1") != "null" && $(this).attr("data-btn2").length != 0) { $("#notifcanbtn").show(); $(".bnotbtn2").html($(this).attr("data-btn2")); }
            setInterval(function () { $(".popover-header").hide(); }, 100);
            return $(".bnotiftempwrp").html();
        }
    });
}

//Search text
$(".contsearchfocus")
    .on("focus", function () {
        $(this).parent().addClass("w-300");
    })
    .on("blur", function () {
        if ($(".contsearchfocus").val().length < 15)
            $(this).parent().removeClass("w-300");
    });
