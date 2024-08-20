$(document).ready(function () {
    BindAccounts();
});
var c = '0';
var VendorRegisteredTemplateId = '0';
var TestSmsMessageContent = '';
var SmsNotificationTempId = 0;

function CallBackFunction() {
    CurrentRowCount = 0;
    SmsNotificationTemplate.GetReport();
}
function CallBackPaging() {
    CurrentRowCount = 0;
    SmsNotificationTemplate.GetReport();
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
            SmsNotificationTemplate.MaxCount();

        },
        error: ShowAjaxError
    });
};


var SmsNotificationTemplate = {    
    MaxCount: function () {
        ShowPageLoading();
        $.ajax({
            url: "/Preference/SmsNotification/GetMaxCount",
            type: 'POST',
            data: JSON.stringify({ 'AdsId': parseInt($("#ddlAccount").val()) }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                TotalRowCount = response.returnVal;
                if (TotalRowCount > 0) {
                    $("#ui_tbodyReportData").html('');
                    SmsNotificationTemplate.GetReport();
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
            url: "/Preference/SmsNotification/GetTemplateList",
            type: 'Post',
            data: JSON.stringify({ 'AdsId': parseInt($("#ddlAccount").val()), 'OffSet': OffSet, 'FetchNext': FetchNext }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: SmsNotificationTemplate.BindTemplateDetails,
            error: ShowAjaxError
        });
    },
    BindTemplateDetails: function (responseData) {
        var response = responseData.Data;
        if (response !== undefined && response !== null && response.length > 0) {
            CurrentRowCount = response.length;
            PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);

            ShowPagingDiv(true);
            $("#ui_tblReportData").removeClass('no-data-records');


            let isEnable = true;
            $("#ui_tbodyReportData").empty();
            $.each(response, function () {
                isEnable = this.IsSmsNotificationEnabled;
                SmsNotificationTemplate.BindEachReport(this);
            });
            if (isEnable)
                $('#enablesms').prop('checked', true);
            else
                $('#enablesms').prop('checked', false);
            //SetPreview();
        }
        else
            ShowPagingDiv(false);
        HidePageLoading();
        //CheckAccessPermission("Mail");
    },
    BindEachReport: function (eachData) {
        let VendorTemplateId = eachData.VendorTemplateId != null && eachData.VendorTemplateId.length > 0 ? eachData.VendorTemplateId : "NA";

        let reportTablerows = `<tr>
                              <td class="text-center">
                                <div class="smsprevwrap"><i class="icon ion-ios-eye-outline"></i>
                                  <div class="smsprevItemwrap">
                                    <div class="chat">
                                      <div class="yours messages">
                                        <div class="message last">${eachData.MessageContent}</div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div class="groupnamewrap">
                                  <div class="nameTxtWrap" id="ui_Data_Name_${eachData.Id}">${eachData.Name}</div>
                                  <div class="tdcreatedraft">
                                    <div class="dropdown">
                                      <button type="button" class="verticnwrp" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="icon ion-android-more-vertical mr-0"></i></button>
                                      <div class="dropdown-menu dropdown-menu-right" aria-labelledby="filterbycontacts">
                                        <a id="ui_href_EditTemplate_${eachData.Id}" class="dropdown-item editdlttemp" href="javascript:void(0);" onclick="SmsNotificationTemplate.EditDLTSmsTemplate(${eachData.Id});">Edit</a>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td id="ui_Data_VendorTemplateId_${eachData.Id}">${VendorTemplateId}</td>
                              <td class="wordbreak">${eachData.MessageContent}</td>
                              <td>${$.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(eachData.UpdatedDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(eachData.UpdatedDate))}</td>
                            </tr>`;
        $("#ui_tbodyReportData").append(reportTablerows);
        //<a class="dropdown-item" href="javascript:void(0)" data-toggle="modal" data-target="#testdltsmstemp" onclick="SmsNotificationTemplate.TestSmsNotification(${eachData.Id},'${eachData.MessageContent}','${eachData.VendorTemplateId}');">Test</a>
    },
    EditDLTSmsTemplate: function (Id) {
        SmsNotificationTemplate.RefreshEditTemplateFields();
        ShowPageLoading();

        $.ajax({
            url: "/Preference/SmsNotification/GetById",
            type: 'POST',
            data: JSON.stringify({ 'AdsId': parseInt($("#ddlAccount").val()), 'Id': Id }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (responseData) {
                var response = responseData.Data;
                if (response != null) {
                    $("#ui_txt_TemplateName").val(response.Name);
                    $("#ui_txtArea_MessageContent").val(response.MessageContent);
                    $("#ui_btn_UpdateSmsNotificationTemplate").attr("TemplateId", response.Id);
                    if (response.VendorTemplateId != "null")
                        $("#ui_txt_VendorTemplateId").val(response.VendorTemplateId);
                    $("#ui_Edit_SmsNotificationDetails").removeClass("hideDiv");
                }
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },
    UpdateStatus: function () {
        ShowPageLoading();

        let IsSmsNotificationEnabled = $("#enablesms").is(":checked") ? true : false;

        $.ajax({
            url: "/Preference/SmsNotification/UpdateStatus",
            type: 'POST',
            data: JSON.stringify({ 'AdsId': parseInt($("#ddlAccount").val()), 'IsSmsNotificationEnabled': IsSmsNotificationEnabled }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response) {
                    ShowSuccessMessage(GlobalErrorList.SMSNotificationTemplate.UpdateSuccess);
                }
                else {
                    ShowErrorMessage(GlobalErrorList.SMSNotificationTemplate.UpdateFailed);
                }
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },
    RefreshEditTemplateFields: function () {
        //$(".popupsubtitle").html("");
        $("#ui_txt_TemplateName").val("");
        $("#ui_txtArea_MessageContent").val("");
        $("#ui_txt_VendorTemplateId").val("");
        $("#ui_btn_UpdateSmsNotificationTemplate").attr("TemplateId", 0);
    },
    ValidateEditTemplate: function () {
        if (CleanText($("#ui_txt_TemplateName").val()) == "" && CleanText($("#ui_txt_TemplateName").val()).length == 0) {
            ShowErrorMessage(GlobalErrorList.SMSNotificationTemplate.ValidateTemplateName);
            return false;
        }

        if (CleanText($("#ui_txt_VendorTemplateId").val()) == "" && CleanText($("#ui_txt_VendorTemplateId").val()).length == 0) {
            ShowErrorMessage(GlobalErrorList.SMSNotificationTemplate.ValidateVendorId);
            return false;
        }

        return true;
    },
    TestSmsNotification: function (SmsNotificationTempId, SmsMessageContent, RegisteredTemplateId) {
        VendorRegisteredTemplateId = RegisteredTemplateId;
        TestSmsMessageContent = SmsMessageContent;
    },
    SendIndividualTestSMS: function () {
        var PhoneNumber = $.trim($("#ui_txt_SmsIndividualPhoneNumber").val());
        if (CleanText($.trim($("#ui_txt_SmsIndividualPhoneNumber").val())).length == 0) {
            ShowErrorMessage(GlobalErrorList.SmsNotificationTemplate.PhoneNumberError);
            return false;
        }
        var IsPromotionalOrTransactionalType;
        if ($("#ui_rad_SmsPromotional").is(":checked"))
            IsPromotionalOrTransactionalType = 0;
        else
            IsPromotionalOrTransactionalType = 1;

        $.ajax({
            url: "/Preference/SmsNotification/SendIndividualTestSMS",
            type: 'POST',
            data: JSON.stringify({ 'accountId': parseInt($("#ddlAccount").val()), 'SmsNotificationTempId': SmsNotificationTempId, 'PhoneNumber': PhoneNumber, 'IsPromotionalOrTransactionalType': IsPromotionalOrTransactionalType, 'VendorRegisteredTemplateId': VendorRegisteredTemplateId, 'MessageContent': TestSmsMessageContent }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response.SentStatus) {
                    $("#testdltsmstemp").modal("hide");
                    ShowSuccessMessage(GlobalErrorList.SMSNotificationTemplate.TestDltMessageSuccess);
                }
                else {
                    ShowErrorMessage(response.Message);
                }
                HidePageLoading();
                VendorRegisteredTemplateId = '0';
                TestSmsMessageContent = '';
            },
            error: ShowAjaxError
        });
    }

};

$("#ui_btn_UpdateSmsNotificationTemplate").click(function () {
    if (!SmsNotificationTemplate.ValidateEditTemplate())
        return false;

    ShowPageLoading();
    var notificationTemplate = {
        Id: 0, Identifier: "", Name: "", VendorTemplateId: "", MessageContent: "", CreatedDate: null, UpdatedDate: null
    };

    notificationTemplate.Id = parseInt($("#ui_btn_UpdateSmsNotificationTemplate").attr("TemplateId"));
    notificationTemplate.Name = CleanText($("#ui_txt_TemplateName").val());
    notificationTemplate.VendorTemplateId = CleanText($("#ui_txt_VendorTemplateId").val());
    $.ajax({
        url: "/Preference/SmsNotification/Update",
        type: 'Post',
        data: JSON.stringify({ 'AdsId': parseInt($("#ddlAccount").val()), 'notificationTemplate': notificationTemplate }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response) {
                ShowSuccessMessage(GlobalErrorList.SMSNotificationTemplate.SucessUpdate);
                $("#ui_Data_Name_" + notificationTemplate.Id).html(notificationTemplate.Name);
                $("#ui_Data_VendorTemplateId_" + notificationTemplate.Id).html(notificationTemplate.VendorTemplateId);
            }
            else
                ShowErrorMessage(GlobalErrorList.SMSNotificationTemplate.ErrorUpdate);

            $("#ui_Edit_SmsNotificationDetails").addClass("hideDiv");
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

$("#enablesms").click(function () {
    SmsNotificationTemplate.UpdateStatus();
});

$("#ddlAccount").change(function () {
    //calling common partial js function
    SmsNotificationTemplate.MaxCount();
});

