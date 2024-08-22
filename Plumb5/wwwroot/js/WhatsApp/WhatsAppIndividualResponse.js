var WATemplateId = 0;
var WhatsAppCampaignId = 0;
var timeduration = 0;
var rfromdate, rtodate = "";

$(document).ready(function () {
    ExportFunctionName = "ExportWhatsAppAlertNotification";

    timeduration = parseInt($.urlParam("duration"));
    WhatsAppCampaignId = parseInt($.urlParam("campid"));
    WATemplateId = parseInt($.urlParam("tempid"));
    rfromdate = $.urlParam("frmdate");
    rtodate = $.urlParam("todate");

    if (parseInt(timeduration) > 0 && parseInt(WhatsAppCampaignId) > 0 && parseInt(WATemplateId) > 0) {
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
    CurrentRowCount = 0;
    GetReport();
}

function MaxCount() {
    let PhoneNumber = CleanText($.trim($('#txt_SearchBy').val()));

    $.ajax({
        url: "/WhatsApp/WhatsAppIndividualResponse/IndividualMaxCount",
        type: 'Post',
        data: JSON.stringify({ 'AdsId': Plumb5AccountId, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime, 'WATemplateId': WATemplateId, 'PhoneNumber': PhoneNumber }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            TotalRowCount = 0;
            if (response !== undefined && response !== null) {
                TotalRowCount = response.returnVal;
            }

            if (TotalRowCount > 0)
                GetReport();
            else {
                SetNoRecordContent('ui_tableReport', 5, 'ui_tbodyReportData');
                ShowExportDiv(false);
                ShowPagingDiv(false);
                HidePageLoading();
            }
        },
        error: ShowAjaxError
    });
}

function GetReport() {
    let PhoneNumber = CleanText($.trim($('#txt_SearchBy').val()));
    FetchNext = GetNumberOfRecordsPerPage();
    $.ajax({
        url: "/WhatsApp/WhatsAppIndividualResponse/GetIndividualResponseData",
        type: 'Post',
        data: JSON.stringify({ 'AdsId': Plumb5AccountId, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime, 'OffSet': OffSet, 'FetchNext': FetchNext, 'WATemplateId': WATemplateId, 'PhoneNumber': PhoneNumber }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindReport,
        error: ShowAjaxError
    });
}

function BindReport(response) {
    SetNoRecordContent('ui_tableReport', 5, 'ui_tbodyReportData');
    if (response !== undefined && response !== null) {
        CurrentRowCount = response.length;
        PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);
        var reportTableTrs;
        $.each(response, function () {



            let IsDelivered_Bounced_Error = `<i class='icon ion-android-done text-color-queued'  title='Sent'></i>`;
            if (this.Sent == 0)
                IsDelivered_Bounced_Error = `<i class='icon ion-android-done-all text-color-error'   title='Not Sent'></i>`;
            if (this.Delivered == 1)
                IsDelivered_Bounced_Error = `<i class='icon ion-android-done-all text-color-queued'   title='Delivered'></i>`;
            if (this.Read == 1)
                IsDelivered_Bounced_Error = `<i class='icon ion-android-done-all text-color-success'   title='Read'></i>`;
            if (this.IsFailed == 1)
                IsDelivered_Bounced_Error = `<i class="icon ion-alert-circled text-color-error" title="Failed : ${this.ReasonForNotDelivery} "></i>`;
            if (this.Sent == 4)
                IsDelivered_Bounced_Error = `<i class="icon ion-ios-close text-color-error" title="Error : ${this.ReasonForNotDelivery} "></i>`;
            reportTableTrs += '<tr>' +

                '<td class="text-center"><div class="smsprevwrap prevwhatsapp" onclick="WhatsAppTemplateUtil.PreviewTemplate(\'' + this.TemplateName.replace(/%20/g, ' ') + '\',\'' + this.TemplateContent.replace(/\n/g, '~n~') + '\', \'' + this.ButtonOneText + '\' ,\'' + this.ButtonTwoText + '\' ,\'' + this.MediaFileURL + '\' , \'' + this.Templatetype + '\');"><i class="icon ion-ios-eye-outline" ></i ></div ></td>' +
                '<td class="text-left wordbreak"><div class="nametitWrap"><span class="groupNameTxt">' + this.TemplateName + '</span><span class="createdDateTd">' + this.CampaignJobName + " " + IsDelivered_Bounced_Error + '</span></div></td>' +
                '<td>' + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(this.SentDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(this.SentDate)) + '</td>' +
                '<td>' + this.PhoneNumber + '</td>' +
                '<td class="text-left">' + this.Templatetype[0].toUpperCase() + this.Templatetype.slice(1) + '</td>' +
                '</tr>';
        });
        ShowExportDiv(true);
        ShowPagingDiv(true);
        $("#ui_tableReport").removeClass('no-data-records');
        $("#ui_tbodyReportData").html(reportTableTrs);
    }
    else {
        ShowExportDiv(false);
        ShowPagingDiv(false);
    }
    HidePageLoading();
}
var WhatsAppTemplateUtil = {
    PreviewTemplate: function (TempName, TemplateContent, ButtonOneText, ButtonTwoText, MediaFileURL, templtypeItem) {
        WhatsAppTemplateUtil.RefreshPreviewPopUp();
        $(".popupsubtitle").text(TempName);

        $("#addwhatsapptext, #addwhatsapptextios").text(TemplateContent.replace(/~n~/g, "\n"));
        if (ButtonOneText != null && ButtonOneText != '' && ButtonOneText != "null") {

            $("#spn_whatsvisitwebsite, #spn_whatsvisitwebsiteios").text(ButtonOneText.slice(0, ButtonOneText.lastIndexOf('_')));
            $("#ui_div_AndrButtn, #ui_div_IosButtn, #whatsvisitwebsite, #whatsvisitwebsiteios").removeClass("hideDiv");
            if (ButtonOneText.slice(ButtonOneText.lastIndexOf('_') + 1) != "null" || ButtonOneText.slice(ButtonTwoText.lastIndexOf('_') + 1) != null || ButtonOneText.slice(ButtonOneText.lastIndexOf('_') + 1) != '') {
                if (ButtonOneText.slice(ButtonOneText.lastIndexOf('_') + 1) == "Website") {
                    $("#imgBtn1, #imgBtn1ios").addClass("fa fa-external-link");
                    if ($("#imgBtn1, #imgBtn1ios").hasClass("fa-phone"))
                        $("#imgBtn1, #imgBtn1ios").removeClass("fa-phone");
                } else if (ButtonOneText.slice(ButtonOneText.lastIndexOf('_')) == "Call") {
                    $("#imgBtn1, #imgBtn1ios").addClass("fa fa-phone");
                    if ($("#imgBtn1, #imgBtn1ios").hasClass("fa-external-link"))
                        $("#imgBtn1, #imgBtn1ios").removeClass("fa-external-link");
                }
            }
        }

        if (ButtonTwoText != null && ButtonTwoText != '' && ButtonTwoText != "null") {
            $("#spn_whatscallphone, #spn_whatscallphoneios").text(ButtonTwoText.slice(0, ButtonTwoText.lastIndexOf('_')));
            $("#whatscallphone, #whatscallphoneios").removeClass("hideDiv");

            if (ButtonTwoText.slice(ButtonTwoText.lastIndexOf('_') + 1) != "null" || ButtonTwoText.slice(ButtonTwoText.lastIndexOf('_') + 1) != null || ButtonTwoText.slice(ButtonOneText.lastIndexOf('_') + 1) != '') {
                if (ButtonTwoText.slice(ButtonTwoText.lastIndexOf('_') + 1) == "Website") {
                    $("#imgBtn1, #imgBtn1ios").addClass("fa fa-external-link");
                    if ($("#imgBtn1, #imgBtn1ios").hasClass("fa-phone"))
                        $("#imgBtn1, #imgBtn1ios").removeClass("fa-phone");
                } else if (ButtonTwoText.slice(ButtonTwoText.lastIndexOf('_') + 1) == "Call") {
                    $("#imgBtn1, #imgBtn1ios").addClass("fa fa-phone");
                    if ($("#imgBtn1, #imgBtn1ios").hasClass("fa-external-link"))
                        $("#imgBtn1, #imgBtn1ios").removeClass("fa-external-link");
                }
            }
        }

        if (MediaFileURL != null && MediaFileURL != '' && MediaFileURL != "null") {
            //$("#addwhatsappimage, #addwhatsappimageIos").attr("src", MediaFileURL);

            if (templtypeItem == "text") {
                $(
                    "#whatsappuploadtype, #mediaurlmain, #mediauploadfiles, .whatsappimgwrp"
                ).addClass("hideDiv");

            } else if (templtypeItem == "image") {
                $("#whatsappuploadtype, #mediaurlmain, .whatsappimgwrp").removeClass(
                    "hideDiv"
                );
                $("#addwhatsappimage, #addwhatsappimageIos").attr(
                    "src",
                    "/Content/images/white_image.png"
                );
            } else if (templtypeItem == "video") {
                $("#whatsappuploadtype, #mediaurlmain, .whatsappimgwrp").removeClass(
                    "hideDiv"
                );
                $("#addwhatsappimage, #addwhatsappimageIos").attr(
                    "src",
                    "/Content/images/white_video.png"
                );
            } else if (templtypeItem == "document") {
                $("#whatsappuploadtype, #mediaurlmain, .whatsappimgwrp").removeClass(
                    "hideDiv"
                );
                $("#addwhatsappimage, #addwhatsappimageIos").attr(
                    "src",
                    "/Content/images/white_document.png"
                );
            } else {
                $("#whatsappuploadtype, #mediaurlmain, .whatsappimgwrp").removeClass(
                    "hideDiv"
                );
                $("#addwhatsappimage, #addwhatsappimageIos").attr(
                    "src",
                    "/Content/images/white_location.png"
                );
            }

            $(".whatsappimgwrp").removeClass("hideDiv");
        }

        $(".popuptitlwrp h6").text("Preview Template");

        $("#whatsappprevpopup").removeClass("hideDiv");
    },
    RefreshPreviewPopUp: function () {
        $("#ui_div_AndrButtn, #ui_div_IosButtn, #whatsvisitwebsite, #whatsvisitwebsiteios, #whatscallphone, #whatscallphoneios, .whatsappimgwrp").addClass("hideDiv");
    }
}


$("#close-popup, .clsepopup").click(function () {
    $(this).parents(".popupcontainer").addClass("hideDiv");
    $("tr").removeClass("activeBgRow");
    $(".errmsgemlvalidwrp .ion-ios-information").popover("hide");
});
$(".devwrphvr").click(function () {
    var checkdevictabconid = $(this).attr("data-devtabcont");
    $(".devwrphvr").removeClass("active");
    $(".devsmsprev").addClass("hideDiv");
    $(".notifprevmain, .brwsnotifdevice").addClass("hideDiv");
    $(this).addClass("active");
    $("#" + checkdevictabconid).removeClass("hideDiv");
});

$(".searchIcon").click(function () {
    if (CleanText($.trim($('#txt_SearchBy').val())).length == 0) {
        ShowErrorMessage("Enter phonenumber to search");
        return false;
    }
    OffSet = 0;
    CallBackFunction();
});

$(document).ready(function () {

    $("#txt_SearchBy").keydown(function (event) {
        if (event.keyCode == 13) {
            if (CleanText($.trim($('#txt_SearchBy').val())).length == 0) {
                ShowErrorMessage("Enter phonenumber to search");
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
