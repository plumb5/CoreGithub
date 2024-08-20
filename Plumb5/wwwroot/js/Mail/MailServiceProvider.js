var PromotionalConfigId = 0, TransactionalConfigId = 0, ProviderName = '';
var re = /^(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/;
var PromotionalValidate = 0, TransactionalValidate = 0;
var ConfiguredDeliveryURL = null;
var MailServiceProviderDetails;
var PreviousPromoAPIKey = '', PreviousTransAPIKey = '';
var checkConfigurationName = "";
var ConfigurationName = [];
GetServiceProviderlDetails();
GetConfiguredDeliveryURL();
var defaultvendorstatus = false;

var MailConfigurationNameID = 0;
$(document).ready(function () {
    ValidateConfigurationNames();
    var defaultvendor_status = false;
});
var tablelength = -1;
function GetServiceProviderlDetails() {
    $.ajax({
        url: "/Mail/MailSettings/GetServiceProviderlDetails",
        type: 'POST',
        data: JSON.stringify({ 'accountId': Plumb5AccountId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (response) {
            $("#ui_tbodyServiceProviderReportData").empty();
            /*ConfigurationName = [];*/
            if (response != null && response.length > 0) {

                $.each(response, function (i) {
                    BindServiceProvider(response, i);
                    /*ConfigurationName.push(response[i].ConfigurationName)*/
                });

            }
            else {
                defaultvendor_status = false;
                $("#ui_tbodyServiceProviderReportData").empty();
                $("#ui_tbodyServiceProviderReportData").html("<tr>" +
                    "<td colspan='4' class='text-center font-weight-bold'>You don't have any ESP configured. <a href='javascript:void(0)' class='clkhere' onclick='OpenMailSetting()'>Click here</a> to Select provider to Add ESP</td>" +
                    "</tr>");
            }
        },
        error: ShowAjaxError
    });
}
function BindServiceProvider(response, i) {
    tablelength = i;

    MailServiceProviderDetails = response[i];
    defaultvendor_status = false;
    if (response.length > 0) {
        var PromotionalKey = 'NA', TransactionalKey = 'NA', ProviderImage;
        ProviderName = response[i].ProviderName;
        if (ProviderName.toLowerCase() == 'netcore falconide')
            ProviderImage = 'netcore.png';
        else if (ProviderName.toLowerCase() == 'elastic mail')
            ProviderImage = 'elasticmail-logo.jpg';
        else if (ProviderName.toLowerCase() == "promotexter")
            ProviderImage = 'promotexter.png';
        else if (ProviderName.toLowerCase() == 'juvlon')
            ProviderImage = 'juvlon.png';
        else if (ProviderName.toLowerCase() == 'sendgrid')
            ProviderImage = 'sendgrid.png';
        else
            ProviderImage = 'everlytic.jpg';
        let defaultvendor = '';
        if (response[i].IsDefaultProvider == 1) {
            defaultvendor_status = true;
            defaultvendor = `<i title="Default SSP" class="icon ion-ios-checkmark-outline" style=" padding-left: 14px;"></i>`;
        }


        let serviceproviderTableTrs =
            "<tr>" +
            "<td class='position-relative apkeywrp'>" +
            "<div class='df-ac-sbet'>" +
            "<span class='promokeywrap wid-90' id ='dvPromoKey'> " + response[i].ConfigurationName + "</span> " +// iconlogopromo + " <span></span>" +
            "</div></td> " +
            "<td><img src='/Content/images/" + ProviderImage + "' class='mr-2' alt=''><span>" + ProviderName + "</span><span>" + defaultvendor + "</span></td>" +
            "<td class='position-relative apkeywrp'>" +
            "<div class='df-ac-sbet'>" +
            "<span class='promokeywrap wid-90' id ='dvPromoKey'> " + response[i].PromotionalAPIKey + "</span> " +// iconlogopromo + " <span></span>" +
            "</div></td> " +
            "<td class='position-relative apkeywrp'>" +
            "<div class='df-ac-sbet'>" +
            "<span class='transkeywrap wid-90' id='dvTransKey' >" + response[i].PromotionalAPIKey + "</span>" + //iconlogotrans + " <span></span> "+
            "</div></td>" +
            "<td class='position-relative apkeywrp'>" +
            "<div class='df-ac-sbet'>" +
            "<span class='transkeywrap wid-90' id='dvTransKey' >" + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(response[i].UpdatedDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(response[i].UpdatedDate)) + "</span>" + //iconlogotrans + " <span></span> "+
            "</div></td>" +
            "<td class='text-center'>" +
            "<div class='tddropmenuWrap'>" +
            "<div class='dropdown show'>" +
            "<button type='button' class='verticnwrp' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'><i class='icon ion-android-more-vertical mr-0'></i></button>" +
            "<div class='dropdown-menu dropdown-menu-right' aria-labelledby='filterbycontacts' x-placement='top-end' style='position: absolute; transform: translate3d(-177px, -65px, 0px); top: 0px; left: 0px; will-change: transform;'>" +
            "<a class='dropdown-item editmailsett' href='javascript:void(0)' onclick='AssignValuesToEditDetails(\"" + response[i].MailConfigurationNameId + "\",\"" + response[i].ConfigurationName + "\",  " + response[i].IsDefaultProvider + " );'>Edit</a>" +

            "<a data-toggle='modal' data-defaultstatus=" + response[i].IsDefaultProvider + " data-confignameid=" + response[i].MailConfigurationNameId + " data-target='#deleteserviceprovider' class='dropdown-item deletesett' id='delete' href='javascript:void(0)'>Delete</a>" +
            "<a class='dropdown-item' href='javascript:void(0)' onclick='ValidateConfigUrl(\"" + ProviderName + "\")'>Validate</a>" +
            " </div>" +
            "</div>" +
            "</div>" +
            "</td>" +
            "</tr>";


        $("#ui_tbodyServiceProviderReportData").append(serviceproviderTableTrs);
    } else {
        serviceproviderTableTrs = "<tr>" +
            "<td colspan='4' class='text-center font-weight-bold'>You don't have any ESP configured. <a href='javascript:void(0)' class='clkhere' onclick='OpenMailSetting()'>Click here</a> to Select provider to Add ESP</td>" +
            "</tr>";
        $("#ui_tbodyServiceProviderReportData").html(serviceproviderTableTrs);
    }
    // HidePageLoading();
}

$("#ui_btnSubmit").click(function () {
    var MailConfig = [];
    if (defaultvendorstatus == true && $('#ui_chkDefaultvendor').is(":checked") == false) {
        ShowErrorMessage(GlobalErrorList.MailSettings.DefaultVendor);
        return;
    }
    if (document.getElementById('ui_tbodyServiceProviderReportData').rows.length == 0 && $('#ui_chkDefaultvendor').is(":checked") == false) {
        ShowErrorMessage(GlobalErrorList.MailSettings.DefaultVendor);
        return;
    }
    if (document.getElementById('ui_tbodyServiceProviderReportData').rows.length == 1 && defaultvendor_status == false && defaultvendorstatus == false && $('#ui_chkDefaultvendor').is(":checked") == false) {
        ShowErrorMessage(GlobalErrorList.MailSettings.DefaultVendor);
        return;
    }
    //ShowPageLoading();
    if ($.trim($("#ui_ConfigurationName").val()) == '' || $.trim($("#ui_ConfigurationName").val()).toUpperCase() === 'NA') {
        ShowErrorMessage(GlobalErrorList.MailSettings.ConfigurationName);
        $("#ui_ConfigurationName").focus();
        return false;
    }

    if (checkConfigurationName.toLowerCase() != $.trim($("#ui_ConfigurationName").val()).toLowerCase()) {
        if (ConfigurationName.join(',').includes($.trim($("#ui_ConfigurationName").val()).toLowerCase())) {
            ShowErrorMessage(GlobalErrorList.MailSettings.DuplicateConfigurationName);
            $("#ui_ConfigurationName").focus();
            return false;
        }
    }
    if (!ValidateConfiguration()) {
        return;
    }
    //if (ProviderName != '' && ProviderName != $("#ui_txtProviderName").val())
    //    DeleteServiceProvider(ProviderName);

    if (PromotionalValidate == 1) {
        var PromomailConfigurationObject = new Object();

        PromomailConfigurationObject.Id = PromotionalConfigId;

        PromomailConfigurationObject.ProviderName = $("#ui_txtProviderName").val();
        PromomailConfigurationObject.IsPromotionalOrTransactionalType = false;
        PromomailConfigurationObject.ApiKey = $("#ui_txtPromoApikey").val();
        PromomailConfigurationObject.AccountName = $("#ui_txtPromoAccountName").val();
        PromomailConfigurationObject.ConfigurationUrl = $("#ui_txtPromoConfigureUrl").val();
        PromomailConfigurationObject.ActiveStatus = true;
        PromomailConfigurationObject.IsBulkSupported = true;
        PromomailConfigurationObject.ApiSecretKey = $("#ui_txtPromoApiSecretKey").val();
        PromomailConfigurationObject.IsDefaultProvider = $('#ui_chkDefaultvendor').is(":checked");
        PromomailConfigurationObject.MailConfigurationNameId = MailConfigurationNameID;
        MailConfig.push(PromomailConfigurationObject);
    }
    if (TransactionalValidate == 1) {
        var TransmailConfigurationObject = new Object();

        TransmailConfigurationObject.Id = TransactionalConfigId;
        TransmailConfigurationObject.ProviderName = $("#ui_txtProviderName").val();
        TransmailConfigurationObject.IsPromotionalOrTransactionalType = true;
        TransmailConfigurationObject.ApiKey = $("#ui_txtTransApikey").val();
        TransmailConfigurationObject.AccountName = $("#ui_txtTransAccountName").val();
        TransmailConfigurationObject.ConfigurationUrl = $("#ui_txtTransConfigureUrl").val();
        TransmailConfigurationObject.ActiveStatus = true;
        TransmailConfigurationObject.IsBulkSupported = true;
        TransmailConfigurationObject.ApiSecretKey = $("#ui_txtTransApiSecretKey").val();
        TransmailConfigurationObject.IsDefaultProvider = $('#ui_chkDefaultvendor').is(":checked");
        TransmailConfigurationObject.MailConfigurationNameId = MailConfigurationNameID;
        MailConfig.push(TransmailConfigurationObject);
    }
    $.each(MailConfig, function () {
        if ($("#ui_btnSubmit").attr("data-Action") == 'Save')
            SaveOrUpdate($(this)[0], 'Save');
        else
            SaveOrUpdate($(this)[0], 'Update');
    });
});
function SaveOrUpdate(ServiceProvicerData, isAddOrUpdate) {
    $.ajax({
        url: "/Mail/MailSettings/SaveOrUpdate",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'ServiceProvicerData': ServiceProvicerData, 'ConfigurationName': $.trim($("#ui_ConfigurationName").val()) }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response.result) {
                if (isAddOrUpdate == 'Save')
                    ShowSuccessMessage(GlobalErrorList.MailSettings.ServiceProviderAddedSuccess_Message);
                else
                    ShowSuccessMessage(GlobalErrorList.MailSettings.ServiceProviderUpdatedSuccess_Message);
                ClearFields();
                GetServiceProviderlDetails();
                ValidateConfigurationNames();
                if (ServiceProvicerData.ProviderName.toLowerCase() == "elastic mail") {
                    GetProviderNameForDomainValidation();
                }
                else if (ServiceProvicerData.ProviderName.toLowerCase() == "juvlon") {
                    GetProviderNameForDomainValidation();
                }
                PreviousPromoAPIKey = '', PreviousTransAPIKey = '';
            }
            else
                ShowErrorMessage(GlobalErrorList.MailSettings.ServiceProviderAlreadyexist_Error);
        },
        error: ShowAjaxError
    });
}
ValidateConfiguration = function () {
    if ($.trim($("#ui_txtProviderName").val()) == 'Select') {
        ShowErrorMessage(GlobalErrorList.MailSettings.Serviceprovider_error);
        return;
    }

    var SelectedProviderValue = $.trim($("#ui_txtProviderName").val());
    $('#promotionalaccrd input').each(function (index) {
        var Proinput = $(this);
        if (Proinput.attr('type') != 'radio')////To check radio button clicked or not   
        {
            if (Proinput.val() != '') {
                PromotionalValidate = 1;
                return false;
            }
        }
    }
    );
    $('#transactionalaccrd input').each(function (index) {
        var Transinput = $(this);
        if (Transinput.attr('type') != 'radio')////To check radio button clicked or not   
        {
            if (Transinput.val() != '') {
                TransactionalValidate = 1;
                return false;
            }
        }
    }
    );
    if (PromotionalValidate == 0 && TransactionalValidate == 0) {
        ShowErrorMessage(GlobalErrorList.MailSettings.PromotionalTransactional_error);
        return;
    }

    if (PromotionalValidate == 1) {

        if ($.trim($("#ui_txtPromoAccountName").val()).length == 0) {
            ShowErrorMessage(GlobalErrorList.MailSettings.PromotionalAccountName_error);
            return false;
        }
        if ($.trim($("#ui_txtPromoApikey").val()).length == 0) {
            ShowErrorMessage(GlobalErrorList.MailSettings.Promotionalapikey_error);
            return false;
        }
        if (SelectedProviderValue == "promotexter" && $.trim($("#ui_txtPromoApiSecretKey").val()).length == 0) {
            ShowErrorMessage(GlobalErrorList.MailSettings.Promotionalapisecretkey_error);
            return false;
        }
        if ($.trim($("#ui_txtPromoConfigureUrl").val()).length == 0) {
            ShowErrorMessage(GlobalErrorList.MailSettings.PromotionalConfigureUrl_error);
            return false;
        }
        if (!re.test($.trim($("#ui_txtPromoConfigureUrl").val()))) {
            $("#ui_txtPromoConfigureUrl").focus();
            ShowErrorMessage(GlobalErrorList.MailSettings.PromotionalcorrectconfigUrl_error);
            return false;
        }
    }
    if (TransactionalValidate == 1) {

        if ($.trim($("#ui_txtTransAccountName").val()).length == 0) {
            ShowErrorMessage(GlobalErrorList.MailSettings.TransactionalAccountName_error);
            return false;
        }
        if ($.trim($("#ui_txtTransApikey").val()).length == 0) {
            ShowErrorMessage(GlobalErrorList.MailSettings.Transactionalapikey_error);
            return false;
        }
        if (SelectedProviderValue == "promotexter" && $.trim($("#ui_txtTransApiSecretKey").val()).length == 0) {
            ShowErrorMessage(GlobalErrorList.MailSettings.Transactionalapisecretkey_error);
            return false;
        }
        if ($.trim($("#ui_txtTransConfigureUrl").val()).length == 0) {
            ShowErrorMessage(GlobalErrorList.MailSettings.TransactionalConfigureUrl_error);
            return false;
        }
        if (!re.test($.trim($("#ui_txtTransConfigureUrl").val()))) {
            $("#ui_txtTransConfigureUrl").focus();
            ShowErrorMessage(GlobalErrorList.MailSettings.TransactionalcorrectconfigUrl_error);
            return false;
        }
    }
    return true;
};
$('.selprovid').click(function () {
    $(".popupcontainer").removeClass('hideDiv');
});

function OpenMailSetting() {

    ClearFields();
    $('#ui_btnSubmit').attr('data-action', 'Save');
    $('#ui_txtPromoAccountName,#ui_txtPromoApikey,#ui_txtPromoConfigureUrl,#ui_txtTransAccountName,#ui_txtTransApikey,#ui_txtTransConfigureUrl').val('');
    $(".popupcontainer").removeClass('hideDiv');
    if (defaultvendor_status == false)
        $("#ui_chkDefaultvendor").prop("checked", true);
}

function Delete(Provider) {
    $("#deleteServiceProviderConfirm").attr("data-provider", Provider);
}

$("#close-popup, .clsepopup").click(function () {
    ClearFields();
    $(this).parents(".popupcontainer").addClass("hideDiv");
});

$(".drpdownselected").focus(function () {
    $(".selproviderwrap").addClass('showDiv');
});

$(".selctproviderItem").click(function () {
    var checkProvdCompName = $(this).attr("data-providercampname");
    var checkProvdCompLogo = $(this).attr("data-providercamplogo");
    $(".drpdownselected").removeClass("logoelastic logonetcore logoevelytic logopromotexter logojuvlon");
    $(".drpdownselected").val(checkProvdCompName);
    $(".drpdownselected").addClass(checkProvdCompLogo);
    $(".selproviderwrap").removeClass('showDiv');

    $("#ui_divPromoConfigurationSecret").addClass("hideDiv");
    $("#ui_divTransConfigurationSecret").addClass("hideDiv");
    if (checkProvdCompName == "promotexter") {
        $("#ui_divPromoConfigurationSecret").removeClass("hideDiv");
        $("#ui_divTransConfigurationSecret").removeClass("hideDiv");
    }

    BindDeliveryUrl(checkProvdCompName.toLowerCase());
});

//$("#deleteServiceProviderConfirm").click(function () {
//    DeleteServiceProvider($(this).attr("data-provider"));
//});

DeleteServiceProvider = function (ProviderName) {
    //ShowPageLoading();
    $.ajax({
        url: "/Mail/MailSettings/DeleteServiceProvider",
        type: 'POST',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'ProviderName': ProviderName }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response) {
                GetServiceProviderlDetails();
                ShowSuccessMessage(GlobalErrorList.MailSettings.ServiceprovideDelete_message);
            }
            // HidePageLoading();
        },
        error: ShowAjaxError
    });
};
function ClearFields() {
    tablelength = -1;
    PromotionalConfigId = 0;
    TransactionalConfigId = 0;
    MailConfigurationNameID = 0;
    checkConfigurationName = "";
    defaultvendorstatus = false;
    $("#ui_ConfigurationName").val('')
    $(".popupcontainer").addClass("hideDiv");
    $('#ui_txtProviderName').removeAttr('disabled');
    $('.popupbody').find('input:text').val('');
    $("#ui_IsPromoBulkSupportedNo,#ui_IsTransBulkSupportedNo").prop("checked", true);
    $('#ui_txtProviderName').val('Select');
    $('#ui_txtProviderName').removeClass().addClass('form-control drpdownselected text-int-30');
    PromotionalValidate = 0, TransactionalValidate = 0, ProviderName = '';
    $("#ui_chkDefaultvendor").prop("checked", false);

}
function AssignValuesToEditDetails(_MailConfigurationNameID, _MailConfigurationName, _defaultvendorstatus) {
    checkConfigurationName = _MailConfigurationName;
    MailConfigurationNameID = _MailConfigurationNameID;
    defaultvendorstatus = _defaultvendorstatus
    ShowPageLoading();
    $(".popupcontainer").removeClass('hideDiv');
    $.ajax({
        url: "/Mail/MailSettings/ServiceProviderlDetails",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'mailConfigurationNameID': MailConfigurationNameID }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response != null) {

                $(".popupcontainer").removeClass("hideDiv");
                $("#ui_ConfigurationName").val(checkConfigurationName);
                if (defaultvendorstatus) {
                    $("#ui_chkDefaultvendor").prop("checked", true);

                } else {
                    $("#ui_chkDefaultvendor").prop("checked", false);
                }
                if (document.getElementById('ui_tbodyServiceProviderReportData').rows.length == 1)
                    $("#ui_chkDefaultvendor").prop("checked", true);

                MailServiceProviderDetails = response.mailConfigurationDetails;
                if (MailServiceProviderDetails.length > 0) {
                    BindDeliveryUrl(MailServiceProviderDetails[0].ProviderName.toLowerCase());
                    $('#ui_btnSubmit').attr('data-Action', 'Update');

                    if (MailServiceProviderDetails[0].ProviderName.toLowerCase() == 'netcore falconide')
                        $('#ui_txtProviderName').addClass('logonetcore');
                    else if (MailServiceProviderDetails[0].ProviderName.toLowerCase() == 'elastic mail')
                        $('#ui_txtProviderName').addClass('logoelastic');
                    else if (MailServiceProviderDetails[0].ProviderName.toLowerCase() == 'promotexter')
                        $('#ui_txtProviderName').addClass('logopromotexter');
                    else if (MailServiceProviderDetails[0].ProviderName.toLowerCase() == 'juvlon')
                        $('#ui_txtProviderName').addClass('logojuvlon');
                    else if (MailServiceProviderDetails[0].ProviderName.toLowerCase() == 'sendgrid')
                        $('#ui_txtProviderName').addClass('logoSendGrid');
                    else
                        $('#ui_txtProviderName').addClass('logoevelytic');


                    $('#ui_txtProviderName').val(MailServiceProviderDetails[0].ProviderName);
                    $("#ui_txtProviderName").attr("disabled", "disabled");
                    if (MailServiceProviderDetails.length > 1) {
                        $('#ui_txtPromoAccountName').val(MailServiceProviderDetails[0].AccountName);
                        $('#ui_txtPromoApikey').val(MailServiceProviderDetails[0].ApiKey);
                        $('#ui_txtPromoApiSecretKey').val(MailServiceProviderDetails[0].ApiSecretKey);
                        $('#ui_txtPromoConfigureUrl').val(MailServiceProviderDetails[0].ConfigurationUrl);
                        if (MailServiceProviderDetails[0].IsBulkSupported == true)
                            $("#ui_IsPromoBulkSupportedYes").prop("checked", true);
                        else
                            $("#ui_IsPromoBulkSupportedNo").prop("checked", true);
                        PromotionalConfigId = MailServiceProviderDetails[0].Id;

                        $('#ui_txtTransAccountName').val(MailServiceProviderDetails[1].AccountName);
                        $('#ui_txtTransApikey').val(MailServiceProviderDetails[1].ApiKey);
                        $('#ui_txtTransApiSecretKey').val(MailServiceProviderDetails[1].ApiSecretKey);
                        $('#ui_txtTransConfigureUrl').val(MailServiceProviderDetails[1].ConfigurationUrl);
                        if (MailServiceProviderDetails[1].IsBulkSupported == true)
                            $("#ui_IsTransBulkSupportedYes").prop("checked", true);
                        else
                            $("#ui_IsTransBulkSupportedNo").prop("checked", true);
                        TransactionalConfigId = MailServiceProviderDetails[1].Id;
                    }
                    else {
                        if (MailServiceProviderDetails[0].IsPromotionalOrTransactionalType == false) {
                            $('#ui_txtPromoAccountName').val(MailServiceProviderDetails[0].AccountName);
                            $('#ui_txtPromoApikey').val(MailServiceProviderDetails[0].ApiKey);
                            $('#ui_txtPromoApiSecretKey').val(MailServiceProviderDetails[0].ApiSecretKey);
                            $('#ui_txtPromoConfigureUrl').val(MailServiceProviderDetails[0].ConfigurationUrl);
                            if (MailServiceProviderDetails[0].IsBulkSupported == true)
                                $("#ui_IsPromoBulkSupportedYes").prop("checked", true);
                            else
                                $("#ui_IsPromoBulkSupportedNo").prop("checked", true);
                            PromotionalConfigId = MailServiceProviderDetails[0].Id;
                        }
                        else {
                            $('#ui_txtTransAccountName').val(MailServiceProviderDetails[0].AccountName);
                            $('#ui_txtTransApikey').val(MailServiceProviderDetails[0].ApiKey);
                            $('#ui_txtTransApiSecretKey').val(MailServiceProviderDetails[0].ApiSecretKey);
                            $('#ui_txtTransConfigureUrl').val(MailServiceProviderDetails[0].ConfigurationUrl);
                            if (MailServiceProviderDetails[0].IsBulkSupported == true)
                                $("#ui_IsTransBulkSupportedYes").prop("checked", true);
                            else
                                $("#ui_IsTransBulkSupportedNo").prop("checked", true);
                            TransactionalConfigId = MailServiceProviderDetails[0].Id;
                        }
                    }
                }
            }

            HidePageLoading();
        },
        error: ShowAjaxError
    });
}


function BindServiceProviderDetails(response) {
    if (response.mailConfigurationDetails.length > 0) {
        BindDeliveryUrl(response.mailConfigurationDetails[0].ProviderName.toLowerCase());
        $('#ui_btnSubmit').attr('data-Action', 'Update');

        if (response.mailConfigurationDetails[0].ProviderName.toLowerCase() == 'netcore falconide')
            $('#ui_txtProviderName').addClass('logonetcore');
        else if (response.mailConfigurationDetails[0].ProviderName.toLowerCase() == 'elastic mail')
            $('#ui_txtProviderName').addClass('logoelastic');
        else if (response.mailConfigurationDetails[0].ProviderName.toLowerCase() == 'promotexter')
            $('#ui_txtProviderName').addClass('logopromotexter');
        else if (response.mailConfigurationDetails[0].ProviderName.toLowerCase() == 'juvlon')
            $('#ui_txtProviderName').addClass('logojuvlon');
        else if (response.mailConfigurationDetails[0].ProviderName.toLowerCase() == 'sendgrid')
            $('#ui_txtProviderName').addClass('logoSendGrid');
        else
            $('#ui_txtProviderName').addClass('logoevelytic');


        $('#ui_txtProviderName').val(response.mailConfigurationDetails[0].ProviderName);
        $("#ui_txtProviderName").attr("disabled", "disabled");
        if (response.mailConfigurationDetails.length > 1) {
            $('#ui_txtPromoAccountName').val(response.mailConfigurationDetails[0].AccountName);
            $('#ui_txtPromoApikey').val(response.mailConfigurationDetails[0].ApiKey);
            $('#ui_txtPromoApiSecretKey').val(response.mailConfigurationDetails[0].ApiSecretKey);
            $('#ui_txtPromoConfigureUrl').val(response.mailConfigurationDetails[0].ConfigurationUrl);
            if (response.mailConfigurationDetails[0].IsBulkSupported == true)
                $("#ui_IsPromoBulkSupportedYes").prop("checked", true);
            else
                $("#ui_IsPromoBulkSupportedNo").prop("checked", true);
            PromotionalConfigId = response.mailConfigurationDetails[0].Id;

            $('#ui_txtTransAccountName').val(response.mailConfigurationDetails[1].AccountName);
            $('#ui_txtTransApikey').val(response.mailConfigurationDetails[1].ApiKey);
            $('#ui_txtTransApiSecretKey').val(response.mailConfigurationDetails[1].ApiSecretKey);
            $('#ui_txtTransConfigureUrl').val(response.mailConfigurationDetails[1].ConfigurationUrl);
            if (response.mailConfigurationDetails[1].IsBulkSupported == true)
                $("#ui_IsTransBulkSupportedYes").prop("checked", true);
            else
                $("#ui_IsTransBulkSupportedNo").prop("checked", true);
            TransactionalConfigId = response.mailConfigurationDetails[1].Id;
        }
        else {
            if (response.mailConfigurationDetails[0].IsPromotionalOrTransactionalType == false) {
                $('#ui_txtPromoAccountName').val(response.mailConfigurationDetails[0].AccountName);
                $('#ui_txtPromoApikey').val(response.mailConfigurationDetails[0].ApiKey);
                $('#ui_txtPromoApiSecretKey').val(response.mailConfigurationDetails[0].ApiSecretKey);
                $('#ui_txtPromoConfigureUrl').val(response.mailConfigurationDetails[0].ConfigurationUrl);
                if (response.mailConfigurationDetails[0].IsBulkSupported == true)
                    $("#ui_IsPromoBulkSupportedYes").prop("checked", true);
                else
                    $("#ui_IsPromoBulkSupportedNo").prop("checked", true);
                PromotionalConfigId = response.mailConfigurationDetails[0].Id;
            }
            else {
                $('#ui_txtTransAccountName').val(response.mailConfigurationDetails[0].AccountName);
                $('#ui_txtTransApikey').val(response.mailConfigurationDetails[0].ApiKey);
                $('#ui_txtTransApiSecretKey').val(response.mailConfigurationDetails[0].ApiSecretKey);
                $('#ui_txtTransConfigureUrl').val(response.mailConfigurationDetails[0].ConfigurationUrl);
                if (response.mailConfigurationDetails[0].IsBulkSupported == true)
                    $("#ui_IsTransBulkSupportedYes").prop("checked", true);
                else
                    $("#ui_IsTransBulkSupportedNo").prop("checked", true);
                TransactionalConfigId = response.mailConfigurationDetails[0].Id;
            }
        }
    }
    //HidePageLoading();

}
function EndableDisableApiMask(ProviderType) {
    var ismasked = 0;
    if (ProviderType == 'Promotional')
        ismasked = $('#dvPromoKey').html();
    else
        ismasked = $('#dvTransKey').html();
    ismasked = ismasked.indexOf('*') == -1 ? 0 : 1;
    $.ajax({
        url: "/Mail/MailSettings/BindApiKey",
        type: 'POST',
        data: JSON.stringify({ 'ProviderType': ProviderType, IsMasked: ismasked }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (ismasked == 0) {

                if (ProviderType == 'Promotional') {
                    $('#iconeyepromo').removeClass("ion-eye-disabled").addClass("ion-ios-eye-outline");
                    //if (response.ApiKey.length > 30) {
                    //    $('#dvPromoKey').html(response.ApiKey.substring(0, 30));
                    //} else {
                    $('#dvPromoKey').html(response.ApiKey);
                    // }
                }
                else {
                    //if (response.ApiKey.length > 30) {
                    //    $('#dvTransKey').html(response.ApiKey.substring(0, 30));
                    //} else {
                    $('#iconeyetrans').removeClass("ion-eye-disabled").addClass("ion-ios-eye-outline");
                    $('#dvTransKey').html(response.ApiKey);
                    // }
                }
            } else {

                if (ProviderType == 'Promotional') {
                    $('#dvPromoKey').html(response.ApiKey);
                    $('#iconeyepromo').removeClass("ion-ios-eye-outline").addClass("ion-eye-disabled");
                }
                else {
                    $('#dvTransKey').html(response.ApiKey);
                    $('#iconeyetrans').removeClass("ion-ios-eye-outline").addClass("ion-eye-disabled");
                }

            }
        },
        error: ShowAjaxError
    });
}
function ValidateConfigUrl(provider) {
    if (FromEmailId.length == 0) {
        ShowErrorMessage(GlobalErrorList.MailSettings.emial_error);
        return false;
    }
    $.ajax({
        url: "/Mail/MailSettings/ProviderValidate",
        type: 'POST',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'ProviderName': provider, 'FromEmailId': FromEmailId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response.Promotional && response.Transactional)
                ShowSuccessMessage(GlobalErrorList.MailSettings.BothServiceProviderValidate);
            else if (response.Promotional)
                ShowSuccessMessage(GlobalErrorList.MailSettings.PromotionalServiceProviderValidate);
            else
                ShowErrorMessage(GlobalErrorList.MailSettings.TransactionalServiceProviderValidate);
        },
        error: ShowAjaxError
    });
}

function GetConfiguredDeliveryURL() {
    $.ajax({
        url: "/Mail/MailSettings/GetConfiguredDeliveryURL",
        type: 'POST',
        data: JSON.stringify({}),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response != null)
                ConfiguredDeliveryURL = response;
        },
        error: ShowAjaxError
    });
}

function BindDeliveryUrl(ProviderName) {
    if (ConfiguredDeliveryURL != null) {
        if (ProviderName == "elastic mail") {
            let ElastieEmail = "<div><b>Track Link</b> : " + ConfiguredDeliveryURL.ElasticMailDeliveryURL + "/ElasticCallback/ElasticMailResponse</div>";
            $("#ui_DeliveryAPI").html(ElastieEmail);
        } else if (ProviderName == "netcore falconide") {
            let NetCoreFalconide = "<div><b>Emails are opened</b> : " + ConfiguredDeliveryURL.NetCoreFalconideDeliveryURL + "/NetcoreCallback/MailOpened</div>";
            NetCoreFalconide += "<div><b>Emails are clicked</b> : " + ConfiguredDeliveryURL.NetCoreFalconideDeliveryURL + "/NetcoreCallback/MailClicked</div>";
            NetCoreFalconide += "<div><b>Emails are unsubscribed</b> : " + ConfiguredDeliveryURL.NetCoreFalconideDeliveryURL + "/NetcoreCallback/MailUnsubscribed</div>";
            NetCoreFalconide += "<div><b>Emails are bounced</b> : " + ConfiguredDeliveryURL.NetCoreFalconideDeliveryURL + "/NetcoreCallback/MailBounced</div>";
            NetCoreFalconide += "<div><b>Emails are dropped</b> : " + ConfiguredDeliveryURL.NetCoreFalconideDeliveryURL + "/NetcoreCallback/MailDropped</div>";
            $("#ui_DeliveryAPI").html(NetCoreFalconide);
        } else if (ProviderName == "everlytic") {
            let EverlyticDelivery = "<div><b>Track Link</b> : " + ConfiguredDeliveryURL.EverlyticDeliveryURL + "/EverlyticTrack/EverlyticTransCallback?AdsId=" + Plumb5AccountId + "</div>";
            $("#ui_DeliveryAPI").html(EverlyticDelivery);
        } else if (ProviderName == "juvlon") {
            let JuvlonDelivery = "<div><b>Track Link</b> : " + ConfiguredDeliveryURL.JuvlonDeliveryURL + "/JuvlonCallback/Responses</div>";
            $("#ui_DeliveryAPI").html(JuvlonDelivery);
        } else if (ProviderName == "sendgrid") {
            let JuvlonDelivery = "<div><b>Track Link</b> : " + ConfiguredDeliveryURL.SendGridDeliveryURL + "/SendGridCallback/SendGridResponse?postback=" + Plumb5AccountId + "</div>";
            $("#ui_DeliveryAPI").html(JuvlonDelivery);
        }
        else {
            $("#ui_DeliveryAPI").html("No Url to bind");
        }
    }
    else {
        $("#ui_DeliveryAPI").html("No Url to bind");
    }
}
$(function () {
    $('#ui_txtPromoApikey').focusout(function () {
        if ($("#ui_btnSubmit").attr("data-Action") != 'Save') {
            if ($('#ui_txtPromoApikey').val() == '') {
                $('#ui_txtPromoApikey').val(PreviousPromoAPIKey);
            }
        }
    });
});
$(function () {
    $('#ui_txtPromoApikey').focus(function () {
        if ($("#ui_btnSubmit").attr("data-Action") != 'Save') {
            if (PreviousPromoAPIKey == '')
                PreviousPromoAPIKey = $('#ui_txtPromoApikey').val();
            $('#ui_txtPromoApikey').val('');
        }
    });
});

$(function () {
    $('#ui_txtTransApikey').focusout(function () {
        if ($("#ui_btnSubmit").attr("data-Action") != 'Save') {
            if ($('#ui_txtTransApikey').val() == '') {
                $('#ui_txtTransApikey').val(PreviousTransAPIKey);
            }
        }
    });
});
$(function () {
    $('#ui_txtTransApikey').focus(function () {
        if ($("#ui_btnSubmit").attr("data-Action") != 'Save') {
            if (PreviousTransAPIKey == '')
                PreviousTransAPIKey = $('#ui_txtTransApikey').val();
            $('#ui_txtTransApikey').val('');
        }
    });
});
$(document).on('click', '#Ui_addvendors', function () {

    ClearFields();
    $('#ui_btnSubmit').attr('data-action', 'Save');
    $('#ui_txtPromoAccountName,#ui_txtPromoApikey,#ui_txtPromoConfigureUrl,#ui_txtTransAccountName,#ui_txtTransApikey,#ui_txtTransConfigureUrl').val('');
    $(".popupcontainer").removeClass('hideDiv');
    if (defaultvendor_status == false)
        $("#ui_chkDefaultvendor").prop("checked", true);

});
var _confignameid;
var _defaultstatus;
$(document).on('click', "#delete", function () {

    _confignameid = $(this).attr("data-confignameid");
    _defaultstatus = $(this).attr("data-defaultstatus");
});
$("#deleteServiceProviderConfirm").click(function () {
    if (document.getElementById('ui_tbodyServiceProviderReportData').rows.length > 1) {
        if (_defaultstatus == 'true') {
            ShowErrorMessage(GlobalErrorList.MailSettings.DuplicateVendor);
            return
        }
    }

    ArchiveVendorDetails(_confignameid);
});
function ArchiveVendorDetails(_configurationNameid) {
    ShowPageLoading();
    $.ajax({
        url: "/Mail/MailSettings/ArchiveVendorDetails",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'mailConfigurationNameId': _configurationNameid }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response) {

                GetServiceProviderlDetails();
                ValidateConfigurationNames();
                ShowSuccessMessage(GlobalErrorList.MailSettings.ServiceprovideDelete_message);
            }

            else {
                ShowErrorMessage(GlobalErrorList.MailSettings.ErrorDeleted);
                GetServiceProviderlDetails();
                ValidateConfigurationNames();
            }


            HidePageLoading();
        },
        error: ShowAjaxError
    });
}
function ValidateConfigurationNames() {
    ShowPageLoading();
    $.ajax({
        url: "/Mail/MailSettings/GetConfigurationNamesList",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            ConfigurationName = [];
            $.each(response, function (i) {

                ConfigurationName.push(response[i].ConfigurationName);
            });

            HidePageLoading();
        },
        error: ShowAjaxError
    });
}