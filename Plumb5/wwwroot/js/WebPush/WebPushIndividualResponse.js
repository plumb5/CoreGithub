var WebPushTemplateId = 0;
var WebPushCampaignId = 0;
var timeduration = 0;
var rfromdate, rtodate = "";

$(document).ready(function () {
    ExportFunctionName = "ExportWebPushIndividualResponseReport";
    //GetUTCDateTimeRange(2);

    timeduration = parseInt($.urlParam("duration"));
    WebPushCampaignId = parseInt($.urlParam("campid"));
    WebPushTemplateId = parseInt($.urlParam("tempid"));
    rfromdate = $.urlParam("frmdate");
    rtodate = $.urlParam("todate");

    if (parseInt(timeduration) > 0 && parseInt(WebPushCampaignId) > 0 && parseInt(WebPushTemplateId) > 0) {
        if (parseInt(timeduration) == 5 && rfromdate != "" && rtodate != "") {
            FromDateTime = rfromdate.replace(/%20/g, " ");
            ToDateTime = rtodate.replace(/%20/g, " ");
            $(".showDateWrap").html("");
            CallBackFunction();
        }
        else {
            $(".showDateWrap").html("");
            GetUTCDateTimeRange(parseInt(timeduration));
        }
    }
    else {
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
    ShowPageLoading();
    CurrentRowCount = 0;
    GetReport();
}

function MaxCount() {
    let MachineId = CleanText($.trim($('#txt_SearchBy').val()));


    $.ajax({
        url: "/WebPush/WebPushIndividualResponse/GetMaxCount",
        type: 'Post',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime, 'WebPushTemplateId': WebPushTemplateId, 'MachineId': MachineId}),
        success: function (response) {
            TotalRowCount = response.returnVal;

            if (TotalRowCount > 0) {
                GetReport();
                ShowExportDiv(true);
                ShowPagingDiv(true);
            }
            else {
                ShowExportDiv(false);
                ShowPagingDiv(false);
                $("#ui_tbodyReportData").empty();
                SetNoRecordContent('ui_tbodyReportData', 4, 'ui_tbodyReportData');
                HidePageLoading();
            }
        },
        error: ShowAjaxError
    });
}

function GetReport() {
    let MachineId = CleanText($.trim($('#txt_SearchBy').val()));

     FetchNext = GetNumberOfRecordsPerPage();

    $.ajax({
        url: "/WebPush/WebPushIndividualResponse/GetIndividualResponses",
        type: 'Post',
        data: JSON.stringify({ 'OffSet': OffSet, 'FetchNext': FetchNext, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime, 'WebPushTemplateId': WebPushTemplateId, 'MachineId': MachineId}),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindReport,
        error: ShowAjaxError
    });


}

function BindReport(response) {
    $("#ui_tbodyReportData").empty();
    SetNoRecordContent('ui_tbodyReportData', 4, 'ui_tbodyReportData');
    if (response !== undefined && response !== null && response.Table1 !== undefined && response.Table1 !== null && response.Table1.length > 0) {
        CurrentRowCount = response.Table1.length;
        PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);

        var reportTableTrs = "";

        $.each(response.Table1, function (m) {

            let IsSent_Viewed_Error = `<i class='icon ion-android-done text-color-queued'  title='Sent'></i>`;
            if (this.IsSent == 0)
                IsSent_Viewed_Error = `<i class='icon ion-android-done-all text-color-error'   title=Failed : ${this.ErrorMessage} ></i>`;
            if (this.IsViewed == 1)
                IsSent_Viewed_Error = `<i class='icon ion-android-done-all text-color-queued'   title='Viewed'></i>`;
            if (this.IsClicked == 1)
                IsSent_Viewed_Error = `<i class='icon ion-android-done-all text-color-success'   title='Clicked'></i>`;


            let MachId = this.MachineId != null ? this.MachineId.substring(this.MachineId.length - 4) : "";
            reportTableTrs += ` <tr>
                                    <td class="text-center">
                                    <div class="bnotifprevwrap"><i data-title="${this.Title}" data-desc="${this.MessageContent}"  data-icon="${this.IconImage}" data-banner="${this.BannerImage}" data-btn1="${this.Button1_Label}"  data-btn2="${this.Button2_Label}" class="icon ion-ios-eye-outline bnotiftemplate" data-toggle="popover" data-original-title="" title="" aria-describedby="popover76680"></i></div>

                                    </td>
                                    <td class="text-left wordbreak">
                                        <div class="nametitWrap">
                                            <span class="groupNameTxt">
                                                ${this.TemplateName}
                                            </span>
                                            <span class="createdDateTd">
                                               ${IsSent_Viewed_Error}
                                            </span>
                                        </div>
                                    </td>
                                        <td class="text-left">${$.datepicker.formatDate("M dd yy", ConvertUTCDateTimeToLocal(this.SentDate)) + PlumbTimeFormat(ConvertUTCDateTimeToLocal(this.SentDate))}</td>
                                    <td class="text-left">(M-${MachId})</td>
                                    </tr>`;



        });

        $("#ui_tbodyReportData").html(reportTableTrs);
        PreviewClick();
        ShowExportDiv(true);
        ShowPagingDiv(true);
    }
    else {
        ShowExportDiv(false);
        ShowPagingDiv(false);
    }
    HidePageLoading();
}
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
            if ($(this).attr("data-btn1") != null && $(this).attr("data-btn1") != "null" && $(this).attr("data-btn1").length != 0) { $("#notifsubbtn").show(); $(".bnotbtn1").html($(this).attr("data-btn1")); }
            if ($(this).attr("data-btn2") != null && $(this).attr("data-btn2") != "null" && $(this).attr("data-btn2").length != 0) { $("#notifcanbtn").show(); $(".bnotbtn2").html($(this).attr("data-btn2")); }
            setInterval(function () { $(".popover-header").hide(); }, 100);
            return $(".bnotiftempwrp").html();
        }
    });
}
$("#ui_exportOrDownload").click(function () {
    ExportFunctionName = "ExportWebPushIndividualResponseReport";
    $("#ui_ddl_ExportDataRange").attr("disabled", false);
});



$(".searchIcon").click(function () {
    if (CleanText($.trim($('#txt_SearchBy').val())).length == 0) {
        ShowErrorMessage("Enter MachineId to search");
        return false;
    }
    CallBackFunction();
});

$(document).ready(function () {

    $("#txt_SearchBy").keydown(function (event) {
        if (event.keyCode == 13) {
            if (CleanText($.trim($('#txt_SearchBy').val())).length == 0) {
                ShowErrorMessage("Enter MachineId to search");
                return false;
            }

            CallBackFunction();
            event.preventDefault();
            return false;
        }
    });
});

$("#txt_SearchBy").keyup(function (e) {
    if (e.which && e.which === 8 || e.keyCode && e.keyCode === 46)
        if ($("#txt_SearchBy").val().length === 0) {
            CallBackFunction();
        }
});