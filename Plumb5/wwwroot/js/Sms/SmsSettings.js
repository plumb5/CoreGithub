var urlRegExp = /^(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/;
var smsConfiguration = { Id: 0, ProviderName: "", IsDefaultProvider: 0, ApiKey: "", Sender: "", IsPromotionalOrTransactionalType: 0, ConfigurationUrl: "", IsBulkSupported: 0, EntityId: "", TelemarketerId: "", DLTOperatorName: "" };

var IsPromtionalApiKeyShown = false;
var IsTransactionalApiKeyShown = false;
var smsDetails;
var channelType = ["Prom", "Trans"];
var smsConfigurationDetails = [];
var ConfiguredDeliveryURL = null;
var PromotionalPwd = '', TransactionalPwd = '';
var ConfigurationName = [];
var checkConfigurationName = "";
var SmsConfigurationNameID = 0;
var defaultvendorstatus = false;
var addvendor = 1;
var defaultvendor_status = false;
var NoData = `<tr id="ui_NotConfigured">
                 <td colspan="5" class="text-center font-weight-bold">You don't have any SSP configured. <a href="javascript:void(0);" id="addprovidermod">Click here</a> to Select provider to Add SSP</td>
              </tr>`;

var SmsDLTConfiguration = [];

$(document).ready(() => {
    ShowPageLoading();
    smsSettingUtil.GetSmsDetails();
    smsSettingUtil.GetConfiguredDeliveryURL();
    smsSettingUtil.GetDltOperatorList();
    smsSettingUtil.ValidateConfigurationNames();
});

smsSettingUtil = {
    GetSmsDetails: function () {
        $.ajax({
            url: "/Sms/SmsSettings/GetSmsConfigurationDetails",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                /*ConfigurationName = [];*/
                if (response != undefined && response != null && response.length > 0) {
                    $("#ui_tbodySmsConfigurationDetails").empty();
                    $.each(response, function (i) {
                        addvendor = 0;
                        smsSettingUtil.BindConfigurationDetails(response, i);
                        /*ConfigurationName.push(response[i].ConfigurationName)*/
                    });

                } else {
                    defaultvendor_status = false;
                    $("#ui_tbodySmsConfigurationDetails").html(NoData);
                }

                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },
    BindConfigurationDetails: function (ConfigDetails, i) {
        if (ConfigDetails != null) {
            smsDetails = ConfigDetails;

            let PromotionalApiKey = ConfigDetails[i].PromotionalAPIKey != null && ConfigDetails[i].PromotionalAPIKey.length > 0 ? `<div class="df-ac-sbet"><span class="promokeywrap" id="ui_ShowProApiKey">${ConfigDetails[i].PromotionalAPIKey}</span></div>` : `<span class="promokeywrap">NA</span>`; //<span><i class="icon eyepromo ion-ios-eye-outline" id="iconeyepromo" onclick="smsSettingUtil.ShowApiKey(false);"></i></span>

            let TransactionalAPIKey = ConfigDetails[i].TransactionalAPIKey != null && ConfigDetails[i].TransactionalAPIKey.length > 0 ? `<div class="df-ac-sbet"><span class="transkeywrap" id="ui_ShowTransApiKey">${ConfigDetails[i].TransactionalAPIKey}</span></div>` : `<span class="transkeywrap" > NA</span>`; //<span><i class="icon ion-ios-eye-outline eyetransact" id="iconeyetransct" onclick="smsSettingUtil.ShowApiKey(true);"></i></span>

            let imgUrl = this.GetVendorWiseImage(ConfigDetails[i].ProviderName);
            let defaultvendor = '';
            if (ConfigDetails[i].IsDefaultProvider == 1) {
                defaultvendor_status = true;
                defaultvendor = `<i title="Default SSP" class="icon ion-ios-checkmark-outline" style=" padding-left: 14px;"></i>`;
            }


            let tdContent = `<tr>
                                     <td class="position-relative apkeywrp">${ConfigDetails[i].ConfigurationName == null ? "NA" : ConfigDetails[i].ConfigurationName}</td>
                                    <td><img src="${imgUrl}" class="mr-2" alt="" /><span>${ConfigDetails[i].ProviderName} </span><span>${defaultvendor} </span></td>
                                    <td class="position-relative apkeywrp">${PromotionalApiKey}</td>
                                    <td class="position-relative apkeywrp">${TransactionalAPIKey}</td>
                                    <td class="position-relative apkeywrp">${$.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(ConfigDetails[i].UpdatedDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(ConfigDetails[i].UpdatedDate))}</td>
                                    <td class="text-center">
                                        <div class="addradiusdrop">
                                            <div class="dropdown">
                                                <button type="button" class="verticnwrp" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="icon ion-android-more-vertical mr-0"></i></button>
                                                <div class="dropdown-menu dropdown-menu-right" aria-labelledby="filterbycontacts" x-placement="top-end" style="position: absolute; transform: translate3d(-177px, -65px, 0px); top: 0px; left: 0px; will-change: transform;">
                                                    <a class="dropdown-item editmailsett" href="javascript:void(0)" onclick="smsSettingUtil.GetSmsConfigurations('${ConfigDetails[i].SmsConfigurationNameId == 0 ? -1 : ConfigDetails[i].SmsConfigurationNameId}','${ConfigDetails[i].ConfigurationName == null ? "NA" : ConfigDetails[i].ConfigurationName}',${ConfigDetails[i].IsDefaultProvider});">Edit</a>
                                                    <a class="dropdown-item" href="javascript:void(0)" onclick="smsSettingUtil.ValiateSettings('${ConfigDetails[i].SmsConfigurationNameId == 0 ? -1 : ConfigDetails[i].SmsConfigurationNameId}');">Validate</a>
                                                    <div class="dropdown-divider"></div>
                                                    <a data-toggle="modal"  data-defaultstatus="${ConfigDetails[i].IsDefaultProvider}" data-confignameid="${ConfigDetails[i].SmsConfigurationNameId == 0 ? -1 : ConfigDetails[i].SmsConfigurationNameId}" id="delete" data-target="#deletegroups" class="dropdown-item"  href="javascript:void(0)">Delete </a>
                                                </div>
                                            </div>
                                        </div>
                                    </td>sq
                                </tr>`;

            $("#ui_tbodySmsConfigurationDetails").append(tdContent);

        }
        else {
            $("#ui_tbodySmsConfigurationDetails").html(NoData);
        }
    },
    AddServiceProvider: function () {

        if (!smsSettingUtil.ValidateGeneralVendor()) {
            return false;
        }
        if ($.trim($("#ui_ConfigurationName").val()) == '' || $.trim($("#ui_ConfigurationName").val()).toUpperCase() === 'NA') {
            ShowErrorMessage(GlobalErrorList.SmsSettings.ConfigurationName);
            $("#ui_ConfigurationName").focus();
            return false;
        }

        if (checkConfigurationName.toLowerCase() != $.trim($("#ui_ConfigurationName").val()).toLowerCase()) {
            if (ConfigurationName.join(',').includes($.trim($("#ui_ConfigurationName").val()).toLowerCase())) {
                ShowErrorMessage(GlobalErrorList.SmsSettings.DuplicateConfigurationName);
                $("#ui_ConfigurationName").focus();
                return false;
            }
        }
        if (this.CheckValidateAndAssignVendorData()) {

            if (smsConfigurationDetails.length > 0) {
                $.ajax({
                    url: "/SMS/SmsSettings/SaveOrUpdate",
                    type: 'Post',
                    data: JSON.stringify({ 'accountId': Plumb5AccountId, 'smsConfigurationData': smsConfigurationDetails, 'ConfigurationName': $.trim($("#ui_ConfigurationName").val()), 'SmsConfigurationNameID': SmsConfigurationNameID }),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (response) {
                        if (parseInt($("#ui_btnSaveDetails").attr("data-Id")) > 0)
                            ShowSuccessMessage(GlobalErrorList.SmsSettings.SuccessUpdateMessage);
                        else
                            ShowSuccessMessage(GlobalErrorList.SmsSettings.SuccessSaveMessage);
                        smsConfigurationDetails.length = 0;
                        $("#ui_btnSaveDetails").attr("data-Id", 0);
                        $("#ui_tbodySmsConfigurationDetails").empty();
                        $("#close-popup").click();
                        PromotionalPwd = '', TransactionalPwd = '';
                        //smsSettingUtil.BindConfigurationDetails(response.smsConfiguration);
                        smsSettingUtil.GetSmsDetails();
                        smsSettingUtil.ValidateConfigurationNames();
                    },
                    error: ShowAjaxError
                });
            } else {
                ShowErrorMessage(GlobalErrorList.SmsSettings.EnterAnyOne);
            }
        }
    },
    ValidateGeneralVendor: function () {
        if (CleanText($.trim($("#ui_ServiceProvider").val())) == "Select") {
            ShowErrorMessage(GlobalErrorList.SmsSettings.ServiceProvider);
            return false;
        }

        if ($('#ui_chkDltRequired').is(":checked")) {
            if (CleanText($.trim($("#ui_ddlDltOperator").val())) == "select") {
                ShowErrorMessage(GlobalErrorList.SmsSettings.DltOperator);
                return false;
            }
        }

        return true;
    },
    ValidateNetCoreDetails: function (channelType) {
        let Type = channelType == "Prom" ? "Promotional" : "Transactional";

        if (CleanText($.trim($("#ui_NetcoreConfigurationUrl" + channelType).val())).length == 0) {
            ShowErrorMessage(GlobalErrorList.SmsSettings.ConfigurationUrl.replace("{*Common*}", Type));
            $("#ui_NetcoreConfigurationUrl" + channelType).focus();
            return false;
        }

        if (!urlRegExp.test($.trim($("#ui_NetcoreConfigurationUrl" + channelType).val()))) {
            ShowErrorMessage(GlobalErrorList.SmsSettings.ConfigurationUrlHttps.replace("{*Common*}", Type));
            $("#ui_NetcoreConfigurationUrl" + channelType).focus();
            return false;
        }

        if (CleanText($.trim($("#ui_NetcoreFeedId" + channelType).val())).length == 0) {
            ShowErrorMessage(GlobalErrorList.SmsSettings.FeedId.replace("{*Common*}", Type));
            $("#ui_NetcoreFeedId" + channelType).focus();
            return false;
        }

        if (CleanText($.trim($("#ui_NetcoreSenderName" + channelType).val())).length == 0) {
            ShowErrorMessage(GlobalErrorList.SmsSettings.SenderName.replace("{*Common*}", Type));
            $("#ui_NetcoreSenderName" + channelType).focus();
            return false;
        }

        if (CleanText($.trim($("#ui_NetcoreUserName" + channelType).val())).length == 0) {
            ShowErrorMessage(GlobalErrorList.SmsSettings.UserName.replace("{*Common*}", Type));
            $("#ui_NetcoreUserName" + channelType).focus();
            return false;
        }

        if (CleanText($.trim($("#ui_NetcorePassword" + channelType).val())).length == 0) {
            ShowErrorMessage(GlobalErrorList.SmsSettings.Password.replace("{*Common*}", Type));
            $("#ui_NetcorePassword" + channelType).focus();
            return false;
        }

        return true;
    },
    ValidateCommonVendorDetails: function (channelType) {
        let Type = channelType == "Prom" ? "Promotional" : "Transactional";

        if (CleanText($.trim($("#ui_GeneralConfigurationUrl" + channelType).val())).length == 0) {
            ShowErrorMessage(GlobalErrorList.SmsSettings.ConfigurationUrl.replace("{*Common*}", Type));
            $("#ui_GeneralConfigurationUrl" + channelType).focus();
            return false;
        }

        if (!urlRegExp.test($.trim($("#ui_GeneralConfigurationUrl" + channelType).val()))) {
            ShowErrorMessage(GlobalErrorList.SmsSettings.ConfigurationUrlHttps.replace("{*Common*}", Type));
            $("#ui_GeneralConfigurationUrl" + channelType).focus();
            return false;
        }

        if (CleanText($.trim($("#ui_GeneralSenderName" + channelType).val())).length == 0) {
            ShowErrorMessage(GlobalErrorList.SmsSettings.SenderName.replace("{*Common*}", Type));
            $("#ui_NetcoreSenderName" + channelType).focus();
            return false;
        }

        if (CleanText($.trim($("#ui_GeneralUserName" + channelType).val())).length == 0) {
            ShowErrorMessage(GlobalErrorList.SmsSettings.UserName.replace("{*Common*}", Type));
            $("#ui_GeneralUserName" + channelType).focus();
            return false;
        }

        if (CleanText($.trim($("#ui_GeneralPassword" + channelType).val())).length == 0) {
            ShowErrorMessage(GlobalErrorList.SmsSettings.Password.replace("{*Common*}", Type));
            $("#ui_GeneralPassword" + channelType).focus();
            return false;
        }

        return true;
    },
    ValidateTmarcDetails: function (channelType) {
        let Type = channelType == "Prom" ? "Promotional" : "Transactional";

        if (CleanText($.trim($("#ui_TmarcConfigurationUrl" + channelType).val())).length == 0) {
            ShowErrorMessage(GlobalErrorList.SmsSettings.ConfigurationUrl.replace("{*Common*}", Type));
            $("#ui_TmarcConfigurationUrl" + channelType).focus();
            return false;
        }


        if (!urlRegExp.test($.trim($("#ui_TmarcConfigurationUrl" + channelType).val()))) {
            ShowErrorMessage(GlobalErrorList.SmsSettings.ConfigurationUrlHttps.replace("{*Common*}", Type));
            $("#ui_TmarcConfigurationUrl" + channelType).focus();
            return false;
        }

        if (CleanText($.trim($("#ui_TmarcApiKey" + channelType).val())).length == 0) {
            ShowErrorMessage(GlobalErrorList.SmsSettings.ApiKey.replace("{*Common*}", Type));
            $("#ui_TmarcApiKey" + channelType).focus();
            return false;
        }

        if (CleanText($.trim($("#ui_TmarcSenderName" + channelType).val())).length == 0) {
            ShowErrorMessage(GlobalErrorList.SmsSettings.SenderName.replace("{*Common*}", Type));
            $("#ui_TmarcSenderName" + channelType).focus();
            return false;
        }

        return true;
    },
    ValidatePromotexterDetails: function (channelType) {
        let Type = channelType == "Prom" ? "Promotional" : "Transactional";

        if (CleanText($.trim($("#ui_PromotexterConfigurationUrl" + channelType).val())).length == 0) {
            ShowErrorMessage(GlobalErrorList.SmsSettings.ConfigurationUrl.replace("{*Common*}", Type));
            $("#ui_PromotexterConfigurationUrl" + channelType).focus();
            return false;
        }

        if (!urlRegExp.test($.trim($("#ui_PromotexterConfigurationUrl" + channelType).val()))) {
            ShowErrorMessage(GlobalErrorList.SmsSettings.ConfigurationUrlHttps.replace("{*Common*}", Type));
            $("#ui_PromotexterConfigurationUrl" + channelType).focus();
            return false;
        }

        if (CleanText($.trim($("#ui_PromotexterSenderId" + channelType).val())).length == 0) {
            ShowErrorMessage(GlobalErrorList.SmsSettings.SenderId.replace("{*Common*}", Type));
            $("#ui_PromotexterSenderId" + channelType).focus();
            return false;
        }

        if (CleanText($.trim($("#ui_PromotexterApiKey" + channelType).val())).length == 0) {
            ShowErrorMessage(GlobalErrorList.SmsSettings.ApiKey.replace("{*Common*}", Type));
            $("#ui_PromotexterApiKey" + channelType).focus();
            return false;
        }

        if (CleanText($.trim($("#ui_PromotexterApiSecret" + channelType).val())).length == 0) {
            ShowErrorMessage(GlobalErrorList.SmsSettings.ApiSecret.replace("{*Common*}", Type));
            $("#ui_PromotexterApiSecret" + channelType).focus();
            return false;
        }

        return true;
    },
    ShowApiKey: function (IsPromtionalTransactionsl) {
        if (IsPromtionalTransactionsl) {
            if (IsTransactionalApiKeyShown) {
                IsTransactionalApiKeyShown = false;
                $("#ui_ShowTransApiKey").html(smsDetails.TransactionalAPIKey);
                $('#iconeyetransct').removeClass("ion-eye-disabled").addClass("ion-ios-eye-outline");

            } else {
                IsTransactionalApiKeyShown = true;
                this.ShowApiKeyCommon(IsPromtionalTransactionsl);
                $('#iconeyetransct').removeClass("ion-ios-eye-outline").addClass("ion-eye-disabled");
            }
        } else {
            if (IsPromtionalApiKeyShown) {
                IsPromtionalApiKeyShown = false;
                $("#ui_ShowProApiKey").html(smsDetails.PromotionalAPIKey);
                $('#iconeyepromo').removeClass("ion-eye-disabled").addClass("ion-ios-eye-outline");
            } else {
                IsPromtionalApiKeyShown = true;
                this.ShowApiKeyCommon(IsPromtionalTransactionsl);
                $('#iconeyepromo').removeClass("ion-ios-eye-outline").addClass("ion-eye-disabled");
            }
        }
    },
    ShowApiKeyCommon: function (IsPromtionalTransactionsl) {
        $.ajax({
            url: "/Sms/SmsSettings/ShowApiKeys",
            type: 'Post',
            data: JSON.stringify({ 'IsPromtionalTransactionsl': IsPromtionalTransactionsl }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (responseVal) {
                if (IsPromtionalTransactionsl)
                    $("#ui_ShowTransApiKey").html(responseVal);
                else
                    $("#ui_ShowProApiKey").html(responseVal);
            },
            error: ShowAjaxError
        });
    },
    GetVendorWiseImage: function (vendor) {
        vendor = vendor.toLowerCase();
        let imgUrl = "/Content/images/";
        switch (vendor) {
            case "netcore":
                imgUrl += "netcore.png";
                break;
            case "dovesoft":
                imgUrl += "dovesoft.png";
                break;
            case "aclmobile":
                imgUrl += "aclmobile.png";
                break;
            case "smsportal":
                imgUrl += "smsportal.png";
                break;
            case "tmarc":
                imgUrl += "tmarc.png";
                break;
            case "promotexter":
                imgUrl += "promotexter.png";
                break;
            case "digispice":
                imgUrl += "digispice.jpg";
                break;
            case "winnovature":
                imgUrl += "winnovature.jpg";
                break;
            case "valuefirst":
                imgUrl += "valuefirst.png";
                break;
        }
        return imgUrl;
    },
    CheckValidateAndAssignVendorData: function () {
        smsConfigurationDetails.length = 0;

        let IsPromoTrans = smsSettingUtil.CheckForValidation(smsConfiguration.ProviderName);

        for (let i = 0; i < channelType.length; i++) {
            if (channelType[i] == "Prom") {
                if (IsPromoTrans.Promotion) {
                    if (!smsSettingUtil.ValidateAndAssignVendorData(channelType[i]))
                        return false;
                }
            }

            if (channelType[i] == "Trans") {
                if (IsPromoTrans.Transactional)
                    if (!smsSettingUtil.ValidateAndAssignVendorData(channelType[i]))
                        return false;
            }
        }
        return true;
    },
    ValidateAndAssignVendorData: function (channelType) {
        //if ($('#ui_chkDltRequired').is(":checked")) {
        //    let Type = channelType == "Prom" ? "Promotional" : "Transactional";

        //    if (CleanText($.trim($("#ui_TelemarketerId" + channelType).val())).length == 0) {
        //        ShowErrorMessage(GlobalErrorList.SmsSettings.TelemarketerId.replace("{*Common*}", Type));
        //        $("#ui_TelemarketerId" + channelType).focus();
        //        return false;
        //    }

        //    if (CleanText($.trim($("#ui_EntityId" + channelType).val())).length == 0) {
        //        ShowErrorMessage(GlobalErrorList.SmsSettings.EntityId.replace("{*Common*}", Type));
        //        $("#ui_EntityId" + channelType).focus();
        //        return false;
        //    }
        //}

        let smsConfigurationObject = new Object();
        smsConfigurationObject.ProviderName = smsConfiguration.ProviderName;
        smsConfigurationObject.IsDefaultProvider = 0;
        smsConfigurationObject.IsPromotionalOrTransactionalType = channelType == "Prom" ? false : true;
        smsConfigurationObject.IsBulkSupported = true;

        smsConfigurationObject.TelemarketerId = CleanText($.trim($("#ui_TelemarketerId" + channelType).val()));
        smsConfigurationObject.EntityId = CleanText($.trim($("#ui_EntityId" + channelType).val()));

        smsConfigurationObject.DLTRequired = $('#ui_chkDltRequired').is(":checked");
        smsConfigurationObject.DLTOperatorName = null;
        smsConfigurationObject.ConfigurationName = $('#ui_ConfigurationName').val();
        smsConfigurationObject.SmsConfigurationNameId = parseInt(SmsConfigurationNameID);
        smsConfigurationObject.IsDefaultProvider = $('#ui_chkDefaultvendor').is(":checked");
        if ($('#ui_chkDltRequired').is(":checked")) {
            smsConfigurationObject.DLTOperatorName = $("#ui_ddlDltOperator").val();
        }

        if (smsConfiguration.ProviderName == "NetCore") {
            if (!smsSettingUtil.ValidateNetCoreDetails(channelType)) {
                return false;
            }

            smsConfigurationObject.ConfigurationUrl = CleanText($.trim($("#ui_NetcoreConfigurationUrl" + channelType).val()));
            smsConfigurationObject.ApiKey = CleanText($.trim($("#ui_NetcoreFeedId" + channelType).val()));
            smsConfigurationObject.Sender = CleanText($.trim($("#ui_NetcoreSenderName" + channelType).val()));
            smsConfigurationObject.Password = CleanText($.trim($("#ui_NetcorePassword" + channelType).val()));
            smsConfigurationObject.UserName = CleanText($.trim($("#ui_NetcoreUserName" + channelType).val()));
            smsConfigurationDetails.push(smsConfigurationObject);
        } else if (smsConfiguration.ProviderName == "DoveSoft" || smsConfiguration.ProviderName == "AclMobile" || smsConfiguration.ProviderName == "smsportal" || smsConfiguration.ProviderName.toLowerCase() == "winnovature") {
            if (!smsSettingUtil.ValidateCommonVendorDetails(channelType)) {
                return false;
            }

            smsConfigurationObject.ConfigurationUrl = CleanText($.trim($("#ui_GeneralConfigurationUrl" + channelType).val()));
            smsConfigurationObject.Sender = CleanText($.trim($("#ui_GeneralSenderName" + channelType).val()));
            smsConfigurationObject.UserName = CleanText($.trim($("#ui_GeneralUserName" + channelType).val()));
            smsConfigurationObject.Password = CleanText($.trim($("#ui_GeneralPassword" + channelType).val()));
            smsConfigurationDetails.push(smsConfigurationObject);

        } else if (smsConfiguration.ProviderName == "TMarc" || smsConfiguration.ProviderName == "DigiSpice" || smsConfiguration.ProviderName === "ValueFirst") {
            if (!smsSettingUtil.ValidateTmarcDetails(channelType)) {
                return false;
            }

            smsConfigurationObject.ConfigurationUrl = CleanText($.trim($("#ui_TmarcConfigurationUrl" + channelType).val()));
            smsConfigurationObject.ApiKey = CleanText($.trim($("#ui_TmarcApiKey" + channelType).val()));
            smsConfigurationObject.Sender = CleanText($.trim($("#ui_TmarcSenderName" + channelType).val()));
            smsConfigurationDetails.push(smsConfigurationObject);

        } else if (smsConfiguration.ProviderName == "Promotexter") {
            if (!smsSettingUtil.ValidatePromotexterDetails(channelType)) {
                return false;
            }

            smsConfigurationObject.ConfigurationUrl = CleanText($.trim($("#ui_PromotexterConfigurationUrl" + channelType).val()));
            smsConfigurationObject.Sender = CleanText($.trim($("#ui_PromotexterSenderId" + channelType).val()));
            smsConfigurationObject.UserName = CleanText($.trim($("#ui_PromotexterApiKey" + channelType).val()));
            smsConfigurationObject.Password = CleanText($.trim($("#ui_PromotexterApiSecret" + channelType).val()));
            smsConfigurationDetails.push(smsConfigurationObject);
        }

        return true;
    },
    ClearFields: function () {

        SmsConfigurationNameID = 0;
        checkConfigurationName = "";
        $("#ui_ServiceProvider").val('Select').removeClass("logonetcore logodovesoft logotaclmobile logosmsportal logotmarc logopromotexter logoDigispice logowinnovature").removeAttr("disabled");

        $("#ui_NetcoreConfigurationUrlProm,#ui_NetcoreFeedIdProm,#ui_NetcoreSenderNameProm,#ui_NetcoreUserNameProm,#ui_NetcorePasswordProm").val('');
        $("#ui_GeneralConfigurationUrlProm,#ui_GeneralSenderNameProm,#ui_GeneralUserNameProm,#ui_GeneralPasswordProm").val('');
        $("#ui_TmarcConfigurationUrlProm,#ui_TmarcApiKeyProm,#ui_TmarcSenderNameProm").val('');
        $("#ui_PromotexterConfigurationUrlProm,#ui_PromotexterSenderIdProm,#ui_PromotexterApiKeyProm,#ui_PromotexterApiSecretProm").val('');

        $("#ui_NetcoreConfigurationUrlTrans,#ui_NetcoreFeedIdTrans,#ui_NetcoreSenderNameTrans,#ui_NetcoreUserNameTrans,#ui_NetcorePasswordTrans").val('');
        $("#ui_GeneralConfigurationUrlTrans,#ui_GeneralSenderNameTrans,#ui_GeneralUserNameTrans,#ui_EntityIdProm,#ui_GeneralPasswordTrans,#ui_EntityIdTrans,#ui_TelemarketerIdTrans").val('');
        $("#ui_TmarcConfigurationUrlTrans,#ui_TmarcApiKeyTrans,#ui_TmarcSenderNameTrans").val('');
        $("#ui_PromotexterConfigurationUrlTrans,#ui_PromotexterSenderIdTrans,#ui_PromotexterApiKeyTrans,#ui_PromotexterApiSecretTrans").val('');
        $("#ui_btnSaveDetails").attr("data-Id", 0);
        $("#ui_divDltDetails").addClass("hideDiv");
        $("#ui_chkDltRequired").prop("checked", false);
        $("#ui_ddlDltOperator").val('select');
        $("#ui_ddlDltOperator").addClass("hideDiv");
        $("#ui_ConfigurationName").val('')
        $("#ui_chkDefaultvendor").prop("checked", false);
    },
    DeleteVendorDetails: function (id) {
        ShowPageLoading();
        $.ajax({
            url: "/Sms/SmsSettings/DeleteVendorDetails",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response)
                    ShowSuccessMessage(GlobalErrorList.SmsSettings.SuccessDeleted);
                else
                    ShowSuccessMessage(GlobalErrorList.SmsSettings.ErrorDeleted);

                $("#ui_tbodySmsConfigurationDetails").empty();
                $("#ui_tbodySmsConfigurationDetails").html(NoData);

                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },
    GetSmsConfigurations: function (_SmsConfigurationNameID, _SmsConfigurationName, _defaultvendorstatus) {
        checkConfigurationName = _SmsConfigurationName;
        SmsConfigurationNameID = _SmsConfigurationNameID;
        defaultvendorstatus = _defaultvendorstatus
        ShowPageLoading();
        $.ajax({
            url: "/Sms/SmsSettings/GetSmsConfigurations",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'SmsConfigurationNameID': _SmsConfigurationNameID }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != null) {
                    $("#ui_btnSaveDetails").attr("data-Id", response[0].Id);
                    $(".popupcontainer").removeClass("hideDiv");
                    smsSettingUtil.BindDeliveryUrl(response[0].ProviderName.toLowerCase());
                    $.each(response, function () { smsSettingUtil.AssignValueToEdit($(this)[0]); });
                }

                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },
    AssignValueToEdit: function (smsDetails) {
        let IschannelType = smsDetails.IsPromotionalOrTransactionalType == false ? channelType[0] : channelType[1];

        let objectLogo = smsSettingUtil.GetLogo(smsDetails.ProviderName);

        $("#ui_ServiceProvider").val(objectLogo.value).addClass(objectLogo.logo).prop('disabled', true);
        smsSettingUtil.ShowVendorFields(smsDetails.ProviderName);

        $("#ui_ddlDltOperator").addClass("hideDiv");
        $("#ui_ddlDltOperator").val("select");
        if (smsDetails.DLTRequired) {
            $("#ui_chkDltRequired").prop("checked", true);
            $("#ui_ddlDltOperator").val(smsDetails.DLTOperatorName);
            $("#ui_ddlDltOperator").removeClass("hideDiv");
        } else {
            $("#ui_chkDltRequired").prop("checked", false);
        }
        if (smsDetails.IsDefaultProvider) {
            $("#ui_chkDefaultvendor").prop("checked", true);

        }
        else {
            $("#ui_chkDefaultvendor").prop("checked", false);
        }
        if (document.getElementById('ui_tbodySmsConfigurationDetails').rows.length == 1)
            $("#ui_chkDefaultvendor").prop("checked", true);

        $("#ui_TelemarketerId" + IschannelType).val(smsDetails.TelemarketerId);
        $("#ui_EntityId" + IschannelType).val(smsDetails.EntityId);
        $("#ui_ConfigurationName").val(checkConfigurationName);
        if (smsDetails.ProviderName == "NetCore") {
            $("#ui_NetcoreConfigurationUrl" + IschannelType).val(smsDetails.ConfigurationUrl);
            $("#ui_NetcoreFeedId" + IschannelType).val(smsDetails.ApiKey);
            $("#ui_NetcoreSenderName" + IschannelType).val(smsDetails.Sender);
            $("#ui_NetcoreUserName" + IschannelType).val(smsDetails.UserName);
            $("#ui_NetcorePassword" + IschannelType).val(smsDetails.Password);

        } else if (smsDetails.ProviderName == "DoveSoft" || smsDetails.ProviderName == "AclMobile" || smsDetails.ProviderName == "smsportal" || smsDetails.ProviderName.toLowerCase() == "winnovature") {
            $("#ui_GeneralConfigurationUrl" + IschannelType).val(smsDetails.ConfigurationUrl);
            $("#ui_GeneralSenderName" + IschannelType).val(smsDetails.Sender);
            $("#ui_GeneralUserName" + IschannelType).val(smsDetails.UserName);
            $("#ui_GeneralPassword" + IschannelType).val(smsDetails.Password);

        } else if (smsDetails.ProviderName == "TMarc" || smsDetails.ProviderName == "DigiSpice" || smsDetails.ProviderName == "ValueFirst") {
            $("#ui_TmarcConfigurationUrl" + IschannelType).val(smsDetails.ConfigurationUrl);
            $("#ui_TmarcApiKey" + IschannelType).val(smsDetails.ApiKey);
            $("#ui_TmarcSenderName" + IschannelType).val(smsDetails.Sender);

        } else if (smsDetails.ProviderName == "Promotexter") {
            $("#ui_PromotexterConfigurationUrl" + IschannelType).val(smsDetails.ConfigurationUrl);
            $("#ui_PromotexterSenderId" + IschannelType).val(smsDetails.Sender);
            $("#ui_PromotexterApiKey" + IschannelType).val(smsDetails.UserName);
            $("#ui_PromotexterApiSecret" + IschannelType).val(smsDetails.Password);

        }
    },
    GetLogo: function (vendor) {
        let imgUrlValue = { logo: "", value: "" };
        vendor = vendor.toLowerCase();
        switch (vendor) {
            case "netcore":
                imgUrlValue.logo = "logonetcore"; imgUrlValue.value = "Netcore (India)";
                break;
            case "dovesoft":
                imgUrlValue.logo = "logodovesoft"; imgUrlValue.value = "Dove Soft (India)";
                break;
            case "aclmobile":
                imgUrlValue.logo = "logotaclmobile"; imgUrlValue.value = "Aclmobile (India)";
                break;
            case "smsportal":
                imgUrlValue.logo = "logosmsportal"; imgUrlValue.value = "SMSPortal (South Africa)";
                break;
            case "tmarc":
                imgUrlValue.logo = "logotmarc"; imgUrlValue.value = "Tmarc (South Africa)";
                break;
            case "promotexter":
                imgUrlValue.logo = "logopromotexter"; imgUrlValue.value = "Promotexter (Philippines)";
                break;
            case "digispice":
                imgUrlValue.logo = "logoDigispice"; imgUrlValue.value = "DigiSpice (India)";
                break;
            case "winnovature":
                imgUrlValue.logo = "logowinnovature"; imgUrlValue.value = "Winnovature (India)";
            case "valuefirst":
                imgUrlValue.logo = "logovaluefirst"; imgUrlValue.value = "ValueFirst (India)";
                break;
                break;
        }

        return imgUrlValue;
    },
    ShowVendorFields: function (checkProvdCompName) {
        checkProvdCompName = checkProvdCompName.toLowerCase();
        $("#ui_divDltDetails").removeClass("hideDiv");
        $(".NetCoreProvider,.GeneralProvider,.Tmarc,.Promotexter").addClass("hideDiv");
        if (checkProvdCompName.indexOf("netcore") > -1) {
            smsConfiguration.ProviderName = "NetCore";
            $(".NetCoreProvider").removeClass("hideDiv");
        } else if (checkProvdCompName.indexOf("dove") > -1) {
            smsConfiguration.ProviderName = "DoveSoft";
            $(".GeneralProvider").removeClass("hideDiv");
        } else if (checkProvdCompName.indexOf("aclmobile") > -1) {
            smsConfiguration.ProviderName = "AclMobile";
            $(".GeneralProvider").removeClass("hideDiv");
        } else if (checkProvdCompName.indexOf("smsportal") > -1) {
            smsConfiguration.ProviderName = "smsportal";
            $(".GeneralProvider").removeClass("hideDiv");
        } else if (checkProvdCompName.indexOf("tmarc") > -1) {
            smsConfiguration.ProviderName = "TMarc";
            $(".Tmarc").removeClass("hideDiv");
        } else if (checkProvdCompName.indexOf("promotexter") > -1) {
            smsConfiguration.ProviderName = "Promotexter";
            $(".Promotexter").removeClass("hideDiv");
        } else if (checkProvdCompName.indexOf("digi") > -1) {
            smsConfiguration.ProviderName = "DigiSpice";
            $(".Tmarc").removeClass("hideDiv");
        } else if (checkProvdCompName.indexOf("winnovature") > -1) {
            smsConfiguration.ProviderName = "Winnovature";
            $(".GeneralProvider").removeClass("hideDiv");
        } else if (checkProvdCompName.indexOf("valuefirst") > -1) {
            smsConfiguration.ProviderName = "ValueFirst";
            $(".Tmarc").removeClass("hideDiv");
        }
    },
    CheckForValidation: function (vendor) {
        let status = { Promotion: false, Transactional: false };

        for (let i = 0; i < channelType.length; i++) {
            if (vendor == "NetCore") {
                if (CleanText($.trim($("#ui_NetcoreConfigurationUrl" + channelType[i]).val())).length > 0 || CleanText($.trim($("#ui_NetcoreFeedId" + channelType[i]).val())).length > 0 || CleanText($.trim($("#ui_NetcoreSenderName" + channelType[i]).val())).length > 0 || CleanText($.trim($("#ui_NetcoreUserName" + channelType[i]).val())).length > 0 || CleanText($.trim($("#ui_NetcorePassword" + channelType[i]).val())).length > 0) {
                    if (channelType[i] == "Prom")
                        status.Promotion = true;
                    else
                        status.Transactional = true;
                }

            } else if (vendor == "DoveSoft" || vendor == "AclMobile" || vendor == "smsportal" || vendor.toLowerCase() == "winnovature") {
                if (CleanText($.trim($("#ui_GeneralConfigurationUrl" + channelType[i]).val())).length > 0 || CleanText($.trim($("#ui_GeneralSenderName" + channelType[i]).val())).length > 0 || CleanText($.trim($("#ui_GeneralUserName" + channelType[i]).val())).length > 0 || CleanText($.trim($("#ui_GeneralPassword" + channelType[i]).val())).length > 0) {
                    if (channelType[i] == "Prom")
                        status.Promotion = true;
                    else
                        status.Transactional = true;
                }
            } else if (vendor == "TMarc" || vendor == "DigiSpice" || vendor === "ValueFirst") {
                if (CleanText($.trim($("#ui_TmarcConfigurationUrl" + channelType[i]).val())).length > 0 || CleanText($.trim($("#ui_TmarcApiKey" + channelType[i]).val())).length > 0 || CleanText($.trim($("#ui_TmarcSenderName" + channelType[i]).val())).length > 0) {
                    if (channelType[i] == "Prom")
                        status.Promotion = true;
                    else
                        status.Transactional = true;
                }
            } else if (vendor == "Promotexter") {
                if (CleanText($.trim($("#ui_PromotexterConfigurationUrl" + channelType[i]).val())).length > 0 || CleanText($.trim($("#ui_PromotexterSenderId" + channelType[i]).val())).length > 0 || CleanText($.trim($("#ui_PromotexterApiKey" + channelType[i]).val())).length > 0 || CleanText($.trim($("#ui_PromotexterApiSecret" + channelType[i]).val())).length > 0) {
                    if (channelType[i] == "Prom")
                        status.Promotion = true;
                    else
                        status.Transactional = true;
                }
            }
        }

        return status;
    },
    ValiateSettings: function (_smsConfigurationNameId) {
        ShowPageLoading();
        $.ajax({
            url: "/Sms/SmsSettings/ValidateSettings",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'smsConfigurationNameId': _smsConfigurationNameId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != null && response.length > 0) {
                    if (response[0].SentStatus || response[1].SentStatus) {
                        ShowSuccessMessage(GlobalErrorList.SmsSettings.ValidateSuccess);
                    } else {
                        ShowErrorMessage(GlobalErrorList.SmsSettings.ValidateError);
                    }
                }
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },
    GetConfiguredDeliveryURL: function () {
        $.ajax({
            url: "/Sms/SmsSettings/GetConfiguredDeliveryURL",
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
    },
    BindDeliveryUrl: function (ProviderName) {
        if (ConfiguredDeliveryURL != null) {
            if (ProviderName.indexOf("netcore") > -1) {
                let NetCore = "<div><b>Track Link</b> : " + ConfiguredDeliveryURL.NetcoreDeliveryURL + "/NetCoreDelivery/Index?AdsId=" + Plumb5AccountId + "</div>";
                $("#ui_DeliveryAPI").html(NetCore);
            } else if (ProviderName.indexOf("routemobile") > -1 || ProviderName.indexOf("tmarc") > -1) {
                let RouteMobile = "<b>Note</b>:- The Delivery Call Back URL has been implemented in the code itself, so no need to configure from vendor side.";
                $("#ui_DeliveryAPI").html(RouteMobile);
            } else if (ProviderName.indexOf("smsportal") > -1) {
                let SmsPortal = "<div><b>Track Link</b> : " + ConfiguredDeliveryURL.SmsPortal + "/SmsDeliver/SmsPortaldelivery?AdsId=" + Plumb5AccountId + "</div>";
                $("#ui_DeliveryAPI").html(SmsPortal);
            } else if (ProviderName.indexOf("digispice") > -1) {
                let SmsPortal = "<div><b>Track Link</b> : " + ConfiguredDeliveryURL.SmsPortal + "/SmsDeliver/DigiSpiceDelivery</div>";
                $("#ui_DeliveryAPI").html(SmsPortal);
            } else if (ProviderName.toLowerCase().indexOf("winnovature") > -1) {
                let SmsPortal = "<div><b>Track Link</b> : " + ConfiguredDeliveryURL.SmsPortal + "/SmsDeliver/WinnoVatureDelivery</div>";
                $("#ui_DeliveryAPI").html(SmsPortal);
            } else if (ProviderName.toLowerCase().indexOf("valuefirst") > -1) {
                let SmsPortal = "<div><b>Track Link</b> : " + ConfiguredDeliveryURL.SmsPortal + "/ValueFirstCallback/Responses</div>";
                $("#ui_DeliveryAPI").html(SmsPortal);
            } else {
                $("#ui_DeliveryAPI").html("No Url to bind");
            }
        }
        else {
            $("#ui_DeliveryAPI").html("No Url to bind");
        }
    },
    GetDltOperatorList: function () {
        ShowPageLoading();
        $.ajax({
            url: "/Sms/SmsSettings/GetDltOperatorList",
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != undefined && response != null && response.length > 0) {
                    SmsDLTConfiguration = response;
                    smsSettingUtil.BindDltOperatorList(SmsDLTConfiguration);
                    $.each(response, function () {
                        $("#ui_ddlDltOperator").append($('<option></option>').val($(this)[0].OperatorName).html($(this)[0].DisplayName));
                    });
                }
            },
            error: ShowAjaxError
        });
    },
    BindDltOperatorList: function (dltList) {
        let bindDetails = "";
        $.each(dltList, function () {
            bindDetails += `<b>${this.DisplayName}</b><br>
                                Vendor Template Id : ${this.VendorTemplateId}<br>
                                Communication Type : ${this.CommunicationType}<br>
                                Message Content: ${this.MessageContent}
                                <br><br>`;
        });
        $(".dashtooltipbody").html(bindDetails);
    },
    ArchiveVendorDetails: function (_configurationNameid) {
        ShowPageLoading();
        $.ajax({
            url: "/Sms/SmsSettings/ArchiveVendorDetails",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'smsConfigurationNameId': _configurationNameid }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response) {
                    ShowSuccessMessage(GlobalErrorList.SmsSettings.SuccessDeleted);
                    smsSettingUtil.GetSmsDetails();
                    smsSettingUtil.ValidateConfigurationNames();
                }

                else {
                    ShowErrorMessage(GlobalErrorList.SmsSettings.ErrorDeleted);
                    smsSettingUtil.GetSmsDetails();
                    smsSettingUtil.ValidateConfigurationNames();
                }


                $("#ui_tbodySmsConfigurationDetails").empty();
                $("#ui_tbodySmsConfigurationDetails").html(NoData);

                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },
    ValidateConfigurationNames: function () {
        ShowPageLoading();
        $.ajax({
            url: "/Sms/SmsSettings/GetConfigurationNames",
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
}

$("#ui_btnSaveDetails").click(function () {
    if (defaultvendorstatus == true && $('#ui_chkDefaultvendor').is(":checked") == false) {
        ShowErrorMessage(GlobalErrorList.SmsSettings.DefaultVendor);
        return;
    }
    if (document.getElementById('ui_tbodySmsConfigurationDetails').rows.length == 1 && defaultvendor_status == false && $('#ui_chkDefaultvendor').is(":checked") == false) {
        ShowErrorMessage(GlobalErrorList.SmsSettings.DefaultVendor);
        return;
    }
    smsSettingUtil.AddServiceProvider();
})

$(document).on('click', '.selprovid,#addprovidermod', function () {
    smsSettingUtil.ClearFields();
    $(".popupcontainer").removeClass('hideDiv');
    checkConfigurationName = "";
    if (defaultvendor_status == false)
        $("#ui_chkDefaultvendor").prop("checked", true);
});

$("#close-popup, .clsepopup").click(function () {
    smsSettingUtil.ClearFields();
    $(this).parents(".popupcontainer").addClass("hideDiv");
});

$(".drpdownselected").click(function (e) {
    e.stopPropagation();
    $(".selproviderwrap").toggleClass('showDiv');
});

$(".selctproviderItem").click(function () {
    /*smsSettingUtil.ClearFields();*/
    let checkProvdCompName = $(this).attr("data-providercampname");
    let checkProvdCompLogo = $(this).attr("data-providercamplogo");
    smsSettingUtil.ShowVendorFields(checkProvdCompName);
    $(".drpdownselected").removeClass("logonetcore logodovesoft logosmsportal logotmarc logotaclmobile logopromotexter logoDigispice logowinnovature");
    $(".drpdownselected").val(checkProvdCompName);
    $(".drpdownselected").addClass(checkProvdCompLogo);
    $(".selproviderwrap").removeClass('showDiv');

    $(".NetCoreProvider,.GeneralProvider,.Tmarc,.Promotexter").addClass("hideDiv");
    smsSettingUtil.ShowVendorFields(checkProvdCompName);
    smsSettingUtil.BindDeliveryUrl(checkProvdCompName.toLowerCase());
    //$.ajax({
    //    url: "/Sms/SmsSettings/GetSmsConfigurations",
    //    type: 'Post',
    //    data: JSON.stringify({ 'accountId': Plumb5AccountId,'configurationName':'' }),
    //    contentType: "application/json; charset=utf-8",
    //    dataType: "json",
    //    success: function (response) {
    //        if (response != null && response.length > 0 && smsConfiguration.ProviderName.toLowerCase().includes(response[0].ProviderName.toLowerCase())) {
    //            ShowErrorMessage(GlobalErrorList.SmsSettings.ProviderExistsError);
    //            $(".selproviderwrap").removeClass("showDiv");
    //        }
    //        else {
    //            $(".drpdownselected").removeClass("logonetcore logodovesoft logosmsportal logotmarc logotaclmobile logopromotexter logoDigispice logowinnovature");
    //            $(".drpdownselected").val(checkProvdCompName);
    //            $(".drpdownselected").addClass(checkProvdCompLogo);
    //            $(".selproviderwrap").removeClass('showDiv');

    //            $(".NetCoreProvider,.GeneralProvider,.Tmarc,.Promotexter").addClass("hideDiv");
    //            smsSettingUtil.ShowVendorFields(checkProvdCompName);

    //            smsSettingUtil.BindDeliveryUrl(checkProvdCompName.toLowerCase());
    //        }
    //    },
    //    error: ShowAjaxError
    //});
});

$('#ui_chkDltRequired').change(function () {
    if (this.checked) {
        $("#ui_ddlDltOperator").val('select');
        $("#ui_ddlDltOperator").removeClass("hideDiv");
    } else {
        $("#ui_ddlDltOperator").addClass("hideDiv");
    }
});

$(function () {
    $('#ui_GeneralPasswordProm').focusout(function () {
        if ($("#ui_btnSaveDetails").attr("data-id") > 0) {
            if ($('#ui_GeneralPasswordProm').val() == '') {
                $('#ui_GeneralPasswordProm').val(PromotionalPwd);
            }
        }
    });
});
$(function () {
    $('#ui_GeneralPasswordProm').focus(function () {
        if ($("#ui_btnSaveDetails").attr("data-id") > 0) {
            if (PromotionalPwd == '')
                PromotionalPwd = $('#ui_GeneralPasswordProm').val();
            $('#ui_GeneralPasswordProm').val('');
        }
    });
});

$(function () {
    $('#ui_GeneralPasswordTrans').focusout(function () {
        if ($("#ui_btnSaveDetails").attr("data-id") > 0) {
            if ($('#ui_GeneralPasswordTrans').val() == '') {
                $('#ui_GeneralPasswordTrans').val(TransactionalPwd);
            }
        }
    });
});
$(function () {
    $('#ui_GeneralPasswordTrans').focus(function () {
        if ($("#ui_btnSaveDetails").attr("data-id") > 0) {
            if (TransactionalPwd == '')
                TransactionalPwd = $('#ui_GeneralPasswordTrans').val();
            $('#ui_GeneralPasswordTrans').val('');
        }
    });
});

//Vendor Netcore
$(function () {
    $('#ui_NetcorePasswordProm').focusout(function () {
        if ($("#ui_btnSaveDetails").attr("data-id") > 0) {
            if ($('#ui_NetcorePasswordProm').val() == '') {
                $('#ui_NetcorePasswordProm').val(PromotionalPwd);
            }
        }
    });
});
$(function () {
    $('#ui_NetcorePasswordProm').focus(function () {
        if ($("#ui_btnSaveDetails").attr("data-id") > 0) {
            if (PromotionalPwd == '')
                PromotionalPwd = $('#ui_NetcorePasswordProm').val();
            $('#ui_NetcorePasswordProm').val('');
        }
    });
});

$(function () {
    $('#ui_NetcorePasswordTrans').focusout(function () {
        if ($("#ui_btnSaveDetails").attr("data-id") > 0) {
            if ($('#ui_NetcorePasswordTrans').val() == '') {
                $('#ui_NetcorePasswordTrans').val(TransactionalPwd);
            }
        }
    });
});
$(function () {
    $('#ui_NetcorePasswordTrans').focus(function () {
        if ($("#ui_btnSaveDetails").attr("data-id") > 0) {
            if (TransactionalPwd == '')
                TransactionalPwd = $('#ui_NetcorePasswordTrans').val();
            $('#ui_NetcorePasswordTrans').val('');
        }
    });
});

//Vendor Tmarc
$(function () {
    $('#ui_TmarcApiKeyProm').focusout(function () {
        if ($("#ui_btnSaveDetails").attr("data-id") > 0) {
            if ($('#ui_TmarcApiKeyProm').val() == '') {
                $('#ui_TmarcApiKeyProm').val(PromotionalPwd);
            }
        }
    });
});
$(function () {
    $('#ui_TmarcApiKeyProm').focus(function () {
        if ($("#ui_btnSaveDetails").attr("data-id") > 0) {
            if (PromotionalPwd == '')
                PromotionalPwd = $('#ui_TmarcApiKeyProm').val();
            $('#ui_TmarcApiKeyProm').val('');
        }
    });
});

$(function () {
    $('#ui_TmarcApiKeyTrans').focusout(function () {
        if ($("#ui_btnSaveDetails").attr("data-id") > 0) {
            if ($('#ui_TmarcApiKeyTrans').val() == '') {
                $('#ui_TmarcApiKeyTrans').val(TransactionalPwd);
            }
        }
    });
});
$(function () {
    $('#ui_TmarcApiKeyTrans').focus(function () {
        if ($("#ui_btnSaveDetails").attr("data-id") > 0) {
            if (TransactionalPwd == '')
                TransactionalPwd = $('#ui_TmarcApiKeyTrans').val();
            $('#ui_TmarcApiKeyTrans').val('');
        }
    });
});

//Vendor Promotexter
$(function () {
    $('#ui_PromotexterApiSecretProm').focusout(function () {
        if ($("#ui_btnSaveDetails").attr("data-id") > 0) {
            if ($('#ui_PromotexterApiSecretProm').val() == '') {
                $('#ui_PromotexterApiSecretProm').val(PromotionalPwd);
            }
        }
    });
});
$(function () {
    $('#ui_PromotexterApiSecretProm').focus(function () {
        if ($("#ui_btnSaveDetails").attr("data-id") > 0) {
            if (PromotionalPwd == '')
                PromotionalPwd = $('#ui_PromotexterApiSecretProm').val();
            $('#ui_PromotexterApiSecretProm').val('');
        }
    });
});

$(function () {
    $('#ui_PromotexterApiSecretTrans').focusout(function () {
        if ($("#ui_btnSaveDetails").attr("data-id") > 0) {
            if ($('#ui_PromotexterApiSecretTrans').val() == '') {
                $('#ui_PromotexterApiSecretTrans').val(TransactionalPwd);
            }
        }
    });
});
$(function () {
    $('#ui_PromotexterApiSecretTrans').focus(function () {
        if ($("#ui_btnSaveDetails").attr("data-id") > 0) {
            if (TransactionalPwd == '')
                TransactionalPwd = $('#ui_PromotexterApiSecretTrans').val();
            $('#ui_PromotexterApiSecretTrans').val('');
        }
    });
});
$(document).on('click', '#Ui_addvendors', function () {

    smsSettingUtil.ClearFields();
    $(".popupcontainer").removeClass('hideDiv');
    checkConfigurationName = "";
    if (defaultvendor_status == false)
        $("#ui_chkDefaultvendor").prop("checked", true);
});
var _confignameid;
var _defaultstatus;
$(document).on('click', "#delete", function () {

    _confignameid = $(this).attr("data-confignameid");
    _defaultstatus = $(this).attr("data-defaultstatus");
});

$("#deleteRowConfirm").click(function () {
    if (document.getElementById('ui_tbodySmsConfigurationDetails').rows.length != 1) {
        if (_defaultstatus == 'true') {
            ShowErrorMessage(GlobalErrorList.SmsSettings.DuplicateVendor);
            return
        }
    }

    smsSettingUtil.ArchiveVendorDetails(_confignameid);
});