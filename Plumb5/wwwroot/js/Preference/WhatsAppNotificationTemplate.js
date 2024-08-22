$(document).ready(function () {
    BindAccounts();
});
var c = '0';
var VendorRegisteredTemplateId = '0';
var TestWhatsAppMessageContent = '';
var WhatsAppNotificationTempId = 0;

function CallBackFunction() {
    CurrentRowCount = 0;
    WhatsAppNotificationTemplate.GetReport();
}
function CallBackPaging() {
    CurrentRowCount = 0;
    WhatsAppNotificationTemplate.GetReport();
}

function BindAccounts() {
    $.ajax({
        url: "/Preference/IpRestrictions/GetAccounts",
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            $.each(response, function () {
                $('#ddlAccount').append('<option value=' + $(this)[0].AccountId + '>' + $(this)[0].AccountName + '</option>');
            });

            //calling common partial js function
            WhatsAppNotificationTemplate.MaxCount();

        },
        error: ShowAjaxError
    });
};


var WhatsAppNotificationTemplate = {
    MaxCount: function () {
        ShowPageLoading();
        $.ajax({
            url: "/Preference/WhatsAppNotification/GetMaxCount",
            type: 'POST',
            data: JSON.stringify({ 'AdsId': parseInt($("#ddlAccount").val()) }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                TotalRowCount = response.returnVal;
                if (TotalRowCount > 0) {
                    $("#ui_tbodyReportData").html('');
                    WhatsAppNotificationTemplate.GetReport();
                }
                else {
                    SetNoRecordContent('ui_tblReportData', 6, 'ui_tbodyReportData');
                    ShowPagingDiv(false);
                    HidePageLoading();
                }
            },
            error: ShowAjaxError
        });
    },
    GetReport: function () {
        FetchNext = GetNumberOfRecordsPerPage();
        $.ajax({
            url: "/Preference/WhatsAppNotification/GetTemplateList",
            type: 'Post',
            data: JSON.stringify({ 'AdsId': parseInt($("#ddlAccount").val()), 'OffSet': OffSet, 'FetchNext': FetchNext }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: WhatsAppNotificationTemplate.BindTemplateDetails,
            error: ShowAjaxError
        });
    },
    BindTemplateDetails: function (responsedata) {
       var response = responsedata.Data;
        if (response !== undefined && response !== null && response.length > 0) {
            CurrentRowCount = response.length;
            PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);

            ShowPagingDiv(true);
            $("#ui_tblReportData").removeClass('no-data-records');


            let isEnable = true;
            $("#ui_tbodyReportData").empty();
            $.each(response, function () {
                isEnable = this.IsWhatsAppNotificationEnabled;
                WhatsAppNotificationTemplate.BindEachReport(this);
            });
            if (isEnable)
                $('#enableWhatsApp').prop('checked', true);
            else
                $('#enableWhatsApp').prop('checked', false);
            //SetPreview();
        }
        else
            ShowPagingDiv(false);
        HidePageLoading();
        CheckAccessPermission("WhatsApp");
    },
    BindEachReport: function (eachData) {

        let reportTablerows = `<tr>
                              <td class="text-center">
                                <div class="prevwhatsapppref" onclick="WhatsAppNotificationTemplate.PreviewTemplate('${eachData.TemplateName.replace(/%20/g, ' ')}', '${eachData.TemplateContent.replace(/\n/g, '~n~')}', '${eachData.ButtonOneText}', '${eachData.ButtonTwoText}', '${eachData.MediaFileURL}', '${eachData.TemplateType}');"><i class="icon ion-ios-eye-outline"></i></div>
                              </td>
                              <td>
                                <div class="groupnamewrap">
                                  <div class="nameTxtWrap" id="ui_Data_Name_${eachData.Id}">${eachData.TemplateName}</div>
                                  <div class="tdcreatedraft">
                                    <div class="dropdown">
                                      <button type="button" class="verticnwrp" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="icon ion-android-more-vertical mr-0"></i></button>
                                      <div class="dropdown-menu dropdown-menu-right" aria-labelledby="filterbycontacts" x-placement="bottom-end" style="position: absolute; transform: translate3d(30px, 30px, 0px); top: 0px; left: 0px; will-change: transform;">
                                         <a id="ui_href_EditTemplate_${eachData.Id}" class="dropdown-item editdlttemp" href="javascript:void(0);" onclick="WhatsAppNotificationTemplate.EditDLTWhatsAppTemplate(${eachData.Id});">Edit</a>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td>${eachData.WhiteListedTemplateName}</td>
                              <td class="wordbreak">  ${eachData.TemplateContent}</td>
                              <td>${$.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(eachData.UpdatedDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(eachData.UpdatedDate))}</td>
                            </tr>`;
        $("#ui_tbodyReportData").append(reportTablerows);
    },
    PreviewTemplate: function (TempName, TemplateContent, ButtonOneText, ButtonTwoText, MediaFileURL, templtypeItem) {
        WhatsAppNotificationTemplate.RefreshPreviewPopUp();
        $(".popupsubtitle").text(TempName);
        $("#addwhatsapptext, #addwhatsapptextios").text(TemplateContent.replace(/~n~/g, "\n"));
        if (ButtonOneText != null && ButtonOneText != '' && ButtonOneText != "null") {
            $("#whatsvisitwebsite, #whatsvisitwebsiteios").text(ButtonOneText);
            $("#ui_div_AndrButtn, #ui_div_IosButtn, #whatsvisitwebsite, #whatsvisitwebsiteios").removeClass("hideDiv");
        }

        if (ButtonTwoText != null && ButtonTwoText != '' && ButtonTwoText != "null") {
            $("#whatscallphone, #whatscallphoneios").text(ButtonOneText);
            $("#whatscallphone, #whatscallphoneios").removeClass("hideDiv");
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
    },
    EditDLTWhatsAppTemplate: function (Id) {
        WhatsAppNotificationTemplate.RefreshEditTemplateFields();
        ShowPageLoading();

        $.ajax({
            url: "/Preference/WhatsAppNotification/GetById",
            type: 'POST',
            data: JSON.stringify({ 'AdsId': parseInt($("#ddlAccount").val()), 'Id': Id }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (responseData) {
                var response = responseData.Data;
                if (response != null) {
                    $("#ui_txt_TemplateName").val(response.TemplateName);
                    $("#ui_txtArea_TemplateContent").val(response.TemplateContent);
                    $("#ui_btn_UpdateWhatsAppNotificationTemplate").attr("TemplateId", response.Id);
                    if (response.WhiteListedTemplateName != "null")
                        $("#ui_txt_VendorTemplateId").val(response.WhiteListedTemplateName);
                    $("#ui_Edit_WhatsAppNotificationDetails").removeClass("hideDiv");
                }
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },
    UpdateStatus: function () {
        ShowPageLoading();

        let IsWhatsAppNotificationEnabled = $("#enableWhatsApp").is(":checked") ? true : false;

        $.ajax({
            url: "/Preference/WhatsAppNotification/UpdateStatus",
            type: 'POST',
            data: JSON.stringify({ 'AdsId': parseInt($("#ddlAccount").val()), 'IsWhatsAppNotificationEnabled': IsWhatsAppNotificationEnabled }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response) {
                    ShowSuccessMessage(GlobalErrorList.WhatsAppNotificationTemplate.UpdateSuccess);
                }
                else {
                    ShowErrorMessage(GlobalErrorList.WhatsAppNotificationTemplate.UpdateFailed);
                }
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },
    RefreshEditTemplateFields: function () {
        //$(".popupsubtitle").html("");
        $("#ui_txt_TemplateName").val("");
        $("#ui_txtArea_TemplateContent").val("");
        $("#ui_txt_VendorTemplateId").val("");
        $("#ui_btn_UpdateWhatsAppNotificationTemplate").attr("TemplateId", 0);
    },
    ValidateEditTemplate: function () {
        if (CleanText($("#ui_txt_TemplateName").val()) == "" && CleanText($("#ui_txt_TemplateName").val()).length == 0) {
            ShowErrorMessage(GlobalErrorList.WhatsAppNotificationTemplate.ValidateTemplateName);
            return false;
        }

        if (CleanText($("#ui_txt_VendorTemplateId").val()) == "" && CleanText($("#ui_txt_VendorTemplateId").val()).length == 0) {
            ShowErrorMessage(GlobalErrorList.WhatsAppNotificationTemplate.ValidateVendorId);
            return false;
        }

        return true;
    },
    TestWhatsAppNotification: function (WhatsAppNotificationTempId, WhatsAppMessageContent, RegisteredTemplateId) {
        VendorRegisteredTemplateId = RegisteredTemplateId;
        TestWhatsAppMessageContent = WhatsAppMessageContent;
    },
    SendIndividualTestWhatsApp: function () {
        var PhoneNumber = $.trim($("#ui_txt_WhatsAppIndividualPhoneNumber").val());
        if (CleanText($.trim($("#ui_txt_WhatsAppIndividualPhoneNumber").val())).length == 0) {
            ShowErrorMessage(GlobalErrorList.WhatsAppNotificationTemplate.PhoneNumberError);
            return false;
        }
        var IsPromotionalOrTransactionalType;
        if ($("#ui_rad_WhatsAppPromotional").is(":checked"))
            IsPromotionalOrTransactionalType = 0;
        else
            IsPromotionalOrTransactionalType = 1;

        $.ajax({
            url: "/Preference/WhatsAppNotification/SendIndividualTestWhatsApp",
            type: 'POST',
            data: JSON.stringify({ 'accountId': parseInt($("#ddlAccount").val()), 'WhatsAppNotificationTempId': WhatsAppNotificationTempId, 'PhoneNumber': PhoneNumber, 'IsPromotionalOrTransactionalType': IsPromotionalOrTransactionalType, 'VendorRegisteredTemplateId': VendorRegisteredTemplateId, 'MessageContent': TestWhatsAppMessageContent }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response.SentStatus) {
                    $("#testdltWhatsApptemp").modal("hide");
                    ShowSuccessMessage(GlobalErrorList.WhatsAppNotificationTemplate.TestDltMessageSuccess);
                }
                else {
                    ShowErrorMessage(response.Message);
                }
                HidePageLoading();
                VendorRegisteredTemplateId = '0';
                TestWhatsAppMessageContent = '';
            },
            error: ShowAjaxError
        });
    }

};

$("#ui_btn_UpdateWhatsAppNotificationTemplate").click(function () {
    if (!WhatsAppNotificationTemplate.ValidateEditTemplate())
        return false;

    ShowPageLoading();
    var notificationTemplate = {
        Id: 0, Identifier: "", TemplateName: "", WhiteListedTemplateName: "", TemplateContent: "", CreatedDate: null, UpdatedDate: null
    };

    notificationTemplate.Id = parseInt($("#ui_btn_UpdateWhatsAppNotificationTemplate").attr("TemplateId"));
    notificationTemplate.TemplateName = CleanText($("#ui_txt_TemplateName").val());
    notificationTemplate.WhiteListedTemplateName = CleanText($("#ui_txt_VendorTemplateId").val());
    $.ajax({
        url: "/Preference/WhatsAppNotification/Update",
        type: 'Post',
        data: JSON.stringify({ 'AdsId': parseInt($("#ddlAccount").val()), 'notificationTemplate': notificationTemplate }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response) {
                ShowSuccessMessage(GlobalErrorList.WhatsAppNotificationTemplate.SucessUpdate);
                WhatsAppNotificationTemplate.GetReport();
                $("#ui_Data_Name_" + notificationTemplate.Id).html(notificationTemplate.TemplateName);
                $("#ui_Data_VendorTemplateId_" + notificationTemplate.Id).html(notificationTemplate.WhiteListedTemplateName);
            }
            else
                ShowErrorMessage(GlobalErrorList.WhatsAppNotificationTemplate.ErrorUpdate);

            $("#ui_Edit_WhatsAppNotificationDetails").addClass("hideDiv");
            HidePageLoading();
        },
        error: ShowAjaxError
    });
});

$("#close-popup, .clsepopup").click(function () {
    $(this).parents(".popupcontainer").addClass("hideDiv");
    $("tr").removeClass("activeBgRow");
    $(".errmsgemlvalidwrp .ion-ios-information").popover("hide");
});

$("#enableWhatsApp").click(function () {
    WhatsAppNotificationTemplate.UpdateStatus();
});

$("#ddlAccount").change(function () {
    //calling common partial js function
    WhatsAppNotificationTemplate.MaxCount();
});

$(".devwrphvr").click(function () {
    var checkdevictabconid = $(this).attr("data-devtabcont");
    $(".devwrphvr").removeClass("active");
    $(".devsmsprev").addClass("hideDiv");
    $(".notifprevmain, .brwsnotifdevice").addClass("hideDiv");
    $(this).addClass("active");
    $("#" + checkdevictabconid).removeClass("hideDiv");
});