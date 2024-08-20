var WhatsAppConfigurationDetails = { id: 0, ProviderName: "", IsDefaultProvider: 0, ApiKey: "", WhatsappBussinessNumber: "", ConfigurationUrl: "", CountryCode: 0, IsDefaultProvider: 0 }
var WSPConfigurationDetails = new Array();
var wspid = 0;
var WspApikey = '';
var checkCompname = '';
var checkConfigurationName = "";
var ConfigurationName = [];
var CountryCodeDom = intlTelInput(document.querySelector("#intrnatphone"));
var defaultvendorstatus = false;
var Tablelength = 1;
var AddVendor = 1;
var defaultvendor_status = false;
/* Css variables setPropertyValue */
var style = getComputedStyle(document.body);
var NoData = `<tr id="ui_NotConfigured">
                 <td colspan="4" class="text-center font-weight-bold ">You don't have any WSP configured. <a href="javascript:void(0)"  id="addprovider">
                                                                    Click here </a> to Select provider to Add WSP </td>
                                                                     </tr>`;

// Line Chart css Variables 

$(document).on('click', '.selprovid,#addprovider', function () {
    clearfields();
    $(".popupcontainer").removeClass('hideDiv');
    Tablelength = 0;
    if (defaultvendor_status == false)
        $("#ui_chkDefaultvendor").prop("checked", true);

});
$(".drpdownselected").click(function (e) {
    e.stopPropagation();
    $(".selproviderwrap").toggleClass("showDiv");
});
$(".selctproviderItem").click(function () {

    var checkProvdCompName = $(this).attr("data-providercampname");
    var checkProvdCompLogo = $(this).attr("data-providercamplogo");
    var checkProvdCompLogo = $(this).attr("data-providercamplogo");
    checkCompname = $(this).attr("data-campname");
    WhatsAppConfigurationDetails.ProviderName = checkCompname;
    $(".drpdownselected").removeClass(
        "logoelastic logonetcore logoevelytic logoroutemobile logodovesoft logovaluefirst logosmsportal logotmarc logotjustpalm logotchannelmobile logotplivo logotaclmobile logopromotexter logoDigispice logowinnovature logointerakt logogupshup logoInfobip logokayleyra logoyellowai"
    );
    $(".drpdownselected").val(checkProvdCompName);
    $(".drpdownselected").addClass(checkProvdCompLogo);
    $(".selproviderwrap").removeClass("showDiv");
    $(".NetCoreProvider,.GeneralProvider,.Tmarc,.Promotexter").addClass("hideDiv");
    WhatsAppSettingUtil.BindDeliveryUrl(checkProvdCompName.toLowerCase());
});

$("#close-popup, .clsepopup").click(function () {
    $("#ui_ddlprovider").val('Select').removeClass("logointerakt").prop('disabled', false);
    $(this).parents(".popupcontainer").addClass("hideDiv");
    $("tr").removeClass("activeBgRow");
    $(".errmsgemlvalidwrp .ion-ios-information").popover("hide");
});


/* javascript code for drag and drop file upload ends here*/

/* Jeevan written ends scripts */

$(document).ready(function () {
    WhatsAppSettingUtil.GetConfiguredDeliveryURL();
    WhatsAppSettingUtil.ValidateConfigurationNames();
    GetReport();
});
WhatsAppSettingUtil = {
    GetConfiguredDeliveryURL: function () {
        $.ajax({
            url: "/WhatsApp/WhatsAppSettings/GetConfiguredDeliveryURL",
            type: 'POST',
            data: JSON.stringify({}),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != null && response.length != 0)
                    ConfiguredDeliveryURL = response;
            },
            error: ShowAjaxError
        });
    },
    BindDeliveryUrl: function (ProviderName) {
        if (ConfiguredDeliveryURL != null) {
            if (ProviderName.indexOf("interakt") > -1) {
                let WHATSAPP_RESPONSES = "<div><b>Track Link</b> : " + ConfiguredDeliveryURL.WHATSAPP_RESPONSES + "/InteraktCallBack/Responses?AccountId=" + Plumb5AccountId + "</div>";
                $("#ui_DeliveryAPI").html(WHATSAPP_RESPONSES);
            }
            else {
                $("#ui_DeliveryAPI").html("No Url to bind");
            }
        }
        else {
            $("#ui_DeliveryAPI").html("No Url to bind");
        }
    },
    ValidateConfigurationNames: function () {
        ShowPageLoading();
        $.ajax({
            url: "/WhatsApp/WhatsAppSettings/GetConfigurationNamesList",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                ConfigurationName = [];
                $.each(response, function (i) {

                    ConfigurationName.push(response[i].ConfigurationName);
                });


            },
            error: ShowAjaxError
        });
    },
    ArchiveVendorDetails: function (id) {
        ShowPageLoading();
        $.ajax({
            url: "/WhatsApp/WhatsAppSettings/ArchiveVendorDetails",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'whatsappConfigurationNameId': id }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response) {
                    ShowSuccessMessage(GlobalErrorList.WhatsAppSettings.SuccessDeleted);
                    WhatsAppSettingUtil.ValidateConfigurationNames();
                    GetReport();
                }

                else {
                    ShowErrorMessage(GlobalErrorList.WhatsAppSettings.ErrorDeleted);
                    WhatsAppSettingUtil.ValidateConfigurationNames();
                    GetReport();
                }


                $("#ui_tbodySmsConfigurationDetails").empty();
                $("#ui_tbodySmsConfigurationDetails").html(NoData);

                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },
}
function loadfunction(e) {
    $(".progress-bar").addClass("progress-bar-success").html("");
    setTimeout(function () {
        $(".progress-bar").hide();
    }, 5000);
    $(".progress-bar").show();
}
$("#btnaddwsp").click(function () {
    ShowPageLoading();
    if (defaultvendorstatus == true && $('#ui_chkDefaultvendor').is(":checked") == false) {
        ShowErrorMessage(GlobalErrorList.WhatsAppSettings.DefaultVendor);
        HidePageLoading();
        return;
    }
    if (Tablelength == 1 && $('#ui_chkDefaultvendor').is(":checked") == false) {
        ShowErrorMessage(GlobalErrorList.WhatsAppSettings.DefaultVendor);
        HidePageLoading();
        return;
    }
    if (defaultvendor_status == false && $('#ui_chkDefaultvendor').is(":checked") == false) {
        ShowErrorMessage(GlobalErrorList.WhatsAppSettings.DefaultVendor);
        HidePageLoading();
        return;
    }

    if (!Validateconfiguredetails()) {
        HidePageLoading();
        return false;
    }


    $.ajax({
        url: "/WhatsApp/WhatsAppSettings/SaveOrUpdate",
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'WhatsAppConfigurationDetails': WhatsAppConfigurationDetails, 'WSPID': wspid, 'ConfigurationName': $.trim($("#ui_ConfigurationName").val()) }),
        dataType: "json",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataFilter: function (data) { return data; },
        success: function (response) {

            if (response != 2) {
                ShowSuccessMessage(GlobalErrorList.WhatsAppSettings.SuccessSaveMessage);
                FormId = response.FormId;
                clearfields();
                WhatsAppConfigurationDetails = { id: 0, ProviderName: "", IsDefaultProvider: 0, ApiKey: "", WhatsappBussinessNumber: "", ConfigurationUrl: "", CountryCode: 0, IsDefaultProvider: 0 }

                setTimeout(function () { window.location.href = "/WhatsApp/WhatsAppSettings"; }, 3000);
                HidePageLoading();
                WspApikey = '';
            }
            if (response == 2) {
                ShowSuccessMessage(GlobalErrorList.WhatsAppSettings.SuccessUpdateMessage);
                FormId = response.FormId;
                clearfields();
                WhatsAppConfigurationDetails = { id: 0, ProviderName: "", IsDefaultProvider: 0, ApiKey: "", WhatsappBussinessNumber: "", ConfigurationUrl: "", CountryCode: 0, IsDefaultProvider: 0 }

                setTimeout(function () { window.location.href = "/WhatsApp/WhatsAppSettings"; }, 3000);
                HidePageLoading();
                WspApikey = '';
            }
            else if (!response) {

                WhatsAppConfigurationDetails = { id: 0, ProviderName: "", IsDefaultProvider: 0, ApiKey: "", WhatsappBussinessNumber: "", ConfigurationUrl: "", CountryCode: 0, IsDefaultProvider: 0 }
                HidePageLoading();
            }

        },
        error: ShowAjaxError
    });


}),
    Validateconfiguredetails = function () {
        if ($('#ui_ddlprovider').val() == "Select") {
            $('#ui_ddlprovider').focus();
            ShowErrorMessage(GlobalErrorList.WhatsApp.Serviceprovider);
            return false;
        }
        if ($.trim($("#ui_ConfigurationName").val()).toLowerCase() == '' || $.trim($("#ui_ConfigurationName").val()).toUpperCase() === 'NA') {
            ShowErrorMessage(GlobalErrorList.WhatsAppSettings.ConfigurationName);
            $("#ui_ConfigurationName").focus();
            return false;
        }

        if (checkConfigurationName.toLowerCase() != $.trim($("#ui_ConfigurationName").val()).toLowerCase()) {
            if (ConfigurationName.join(',').includes($.trim($("#ui_ConfigurationName").val()).toLowerCase())) {
                ShowErrorMessage(GlobalErrorList.WhatsAppSettings.DuplicateConfigurationName);
                $("#ui_ConfigurationName").focus();
                return false;
            }
        }
        if ($('#ui_txtWspbussinessnumber').val().length <= 9) {
            $('#ui_ddlprovider').focus();
            ShowErrorMessage(GlobalErrorList.WhatsApp.LengthofWspbussnumber);
            return false;
        }
        if ($("#btnaddwsp").attr("data-id") == 0) {
            if (CleanText($("#ui_txtApikey").val()).length == 0) {
                $('#ui_txtApikey').focus();
                ShowErrorMessage(GlobalErrorList.WhatsApp.WspAPi);
                return false;
            }
        }

        if (CleanText($("#ui_txtWspbussinessnumber").val()).length == 0) {
            $('#ui_txtWspbussinessnumber').focus();
            ShowErrorMessage(GlobalErrorList.WhatsApp.Wspbussnumber);
            return false;
        }
        checkCompname = $(".selctproviderItem").attr('data-campnamel'),

            WhatsAppConfigurationDetails.id = wspid;
        WhatsAppConfigurationDetails.ApiKey = $.trim($("#ui_txtApikey").val());
        WhatsAppConfigurationDetails.WhatsappBussinessNumber = $.trim($("#ui_txtWspbussinessnumber").val());
        WhatsAppConfigurationDetails.ConfigurationUrl = $.trim($("#ui_txtbaseurl").val());
        WhatsAppConfigurationDetails.CountryCode = $.trim(CountryCodeDom.getSelectedCountryData().dialCode);
        WhatsAppConfigurationDetails.IsDefaultProvider = $('#ui_chkDefaultvendor').is(":checked");
        return true;
    }

function clearfields() {

    $("#ui_txtWspbussinessnumber").val('');
    $("#ui_ConfigurationName").val('');
    checkConfigurationName = "";
    $("#ui_txtApikey").val('');
    $("#ui_txtbaseurl").val('');
    $("#ui_ddlprovider").val('Select').removeClass("logointerakt").prop('disabled', false);
    //$(".popupItem ").addClass("hideDiv");
    $("#btnaddwsp").attr("data-Id", 0);
    $("#ui_chkDefaultvendor").prop("checked", false);
    defaultvendorstatus = false;
    wspid = 0;
}
function GetReport() {

    $.ajax({
        url: "/WhatsApp/WhatsAppSettings/GetAllDetails",
        type: 'POST',
        data: JSON.stringify({ 'accountId': Plumb5AccountId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",

        success: function (response) {

            $("#ui_tbodyReportData").empty();
            if (response != null && response.length != 0) {

                $.each(response, function (i) {

                    BindReport(response, i);
                    /*ConfigurationName.push(response[i].ConfigurationName)*/
                });


            }
            else {
                Tablelength = 1;
                defaultvendor_status = false;
                $("#ui_chkDefaultvendor").prop("checked", true);
                $("#ui_tbodyReportData").html(NoData);
            }

            HidePageLoading();
        },


        error: ShowAjaxError
    });
}
function BindReport(response, i) {
    var rowid = 0;
    AddVendor = 0;
    if (i == 1)
        Tablelength = 0
    if (response != null) {
        $(".selprovid").hide();
        let reportTablerows = ``;
        let imgUrl = GetVendorWiseImage(response[i].ProviderName);
        let imgUrlvalue = GetLogo(response[i].ProviderName);
        let defaultvendor = '';
        if (response[i].IsDefaultProvider == 1) {
            defaultvendor_status = true;
            defaultvendor = `<i title="Default WSP" class="icon ion-ios-checkmark-outline" style=" padding-left: 14px;"></i>`;
        }



        reportTablerows = `<tr id="treyeproms">
                                                            <td>
                                                              <div class="df-ac-sbet">
                                                                   <span class="promokeywrap wid-90">${response[i].ConfigurationName == null ? "NA" : response[i].ConfigurationName}</span>
                                                                </div>
                                                            </td>
                                                            <td>
                                                               <img src="${imgUrl}" class="mr-2"
                                                                     alt="">   <span>${imgUrlvalue.value}</span><span>${defaultvendor} </span></td>
                                                            </td>
                                                            <td class="position-relative apkeywrp">
                                                                <div class="df-ac-sbet">
                                                                    <span class="promokeywrap wid-90">${response[i].ApiKey}</span>
                                                                </div>

                                                            </td>
                                                            <td class="position-relative apkeywrp">
                                                                <div class="df-ac-sbet">
                                                                    <span class="promokeywrap wid-90">${$.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(response[i].UpdatedDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(response[i].UpdatedDate))}</span>
                                                                </div>

                                                            </td>
                                                            <td class="text-center">
                                                                <div class="addradiusdrop">
                                                                    <div class="dropdown">
                                                                        <button type="button" class="verticnwrp"
                                                                                data-toggle="dropdown" aria-haspopup="true"
                                                                                aria-expanded="false">
                                                                            <i class="icon ion-android-more-vertical mr-0"></i>
                                                                        </button>
                                                                        <div class="dropdown-menu dropdown-menu-right"
                                                                             aria-labelledby="filterbycontacts"
                                                                             x-placement="top-end"
                                                                             style="position: absolute; transform: translate3d(-177px, -65px, 0px); top: 0px; left: 0px; will-change: transform;">
                                                                         <a class="dropdown-item editmailsett"  onclick='EditVendorDetails(${response[i].Id},"${response[i].ConfigurationName == null ? "NA" : response[i].ConfigurationName}",${response[i].IsDefaultProvider} );'
                                                                               href="javascript:void(0)">Edit</a>
                                                                             
                                                                            <div class="dropdown-divider"></div> 
                                                                             <a data-toggle="modal"  data-defaultstatus="${response[i].IsDefaultProvider}" data-id="${response[i].Id == 0 ? -1 : response[i].Id}" id="delete" data-target="#deletegroups" class="dropdown-item"  href="javascript:void(0)">Delete </a>

                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            
                                                        </tr> 
                                                <tr>`;

        $("#ui_tbodyReportData").append(reportTablerows);
        /*WSPConfigurationDetails = response;*/
        HidePageLoading();


    }
    else {
        SetNoRecordContent('ui_tblReportData', 6, 'ui_tbodyReportData');
        HidePageLoading();
    }

}

function EditVendorDetails(id, _whatsappConfigurationName, _defaultvendorstatus) {
    defaultvendorstatus = _defaultvendorstatus;
    checkConfigurationName = _whatsappConfigurationName;
    ShowPageLoading();
    $.ajax({
        url: "/WhatsApp/WhatsAppSettings/GetWhatsAppConfigurationDetails",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'Id': id }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response != null) {
                let objectLogo = GetLogo(response.ProviderName);
                WhatsAppConfigurationDetails.ProviderName = response.ProviderName;
                $("#btnsavewebhook").html("Update");
                $("#btnsavewebhook").val("update");
                $("#btnaddwsp").attr("data-Id", id);

                wspid = response.Id
                if (response.ProviderName != null && response.ProviderName != "")
                    $("#ui_ddlprovider").val(objectLogo.value).addClass(objectLogo.logo).prop('disabled', true).attr("data-providercamplogo");;
                if (response.IsDefaultProvider) {
                    $("#ui_chkDefaultvendor").prop("checked", true);

                } else {
                    $("#ui_chkDefaultvendor").prop("checked", false);
                }
                if (Tablelength == 1) {
                    $("#ui_chkDefaultvendor").prop("checked", true);

                }
                BindCountryCode(response.CountryCode);
                WhatsAppSettingUtil.BindDeliveryUrl(response.ProviderName.toLowerCase());
                $("#ui_txtWspbussinessnumber").val(response.WhatsappBussinessNumber);
                $("#ui_ConfigurationName").val(checkConfigurationName);
                $("#ui_txtApikey").val(response.ApiKey);
                $("#ui_txtbaseurl").val(response.ConfigurationUrl);
                $("#wsppopcontainer").removeClass("hideDiv");

                WspApikey = $("#ui_txtApikey").val();
                HidePageLoading();
            }
        }

    })
}
//function DeleteVendorDetails(id) {
//    $("#deleteRowConfirm").attr("Delete", id) ;
//};

function BindCountryCode(response) {
    response = CleanText(response);
    if (response != null && response != undefined && response != "") {
        if (!$.isNumeric(response))
            CountryCodeDom.setCountry(response.toLowerCase());
        else if (CountryCodeDom.countries.find(x => x.dialCode === response) != undefined)
            CountryCodeDom.setCountry(CountryCodeDom.countries.find(x => x.dialCode === response).iso2.toString());
        else
            CountryCodeDom.setCountry("in");
    }
    else {
        CountryCodeDom.setCountry("in");
    }
}

$(function () {
    $('#ui_txtApikey').focusout(function () {
        if ($("#btnaddwsp").attr("data-id") > 0) {
            if ($('#ui_txtApikey').val() == '') {
                $('#ui_txtApikey').val(WspApikey);
            }
        }
    });
});
$(function () {
    $('#ui_txtApikey').focus(function () {
        if ($("#btnaddwsp").attr("data-id") > 0) {
            if (WspApikey == '')
                WspApikey = $('#ui_txtApikey').val();
            $('#ui_txtApikey').val('');
        }
    });
});
function GetLogo(vendor) {
    let imgUrlValue = { logo: "", value: "" };
    //vendor = vendor.toLowerCase();
    switch (vendor) {
        case "interakt":
            imgUrlValue.logo = "logointerakt"; imgUrlValue.value = "Interakt (India)";
            break;
        case "gupshup":
            imgUrlValue.logo = "logogupshup"; imgUrlValue.value = "Gupshup (India)";
            break;
        case "aclmobile":
            imgUrlValue.logo = "logotaclmobile"; imgUrlValue.value = "Aclmobile (India)";
            break;
        case "kaleyra":
            imgUrlValue.logo = "logokayleyra"; imgUrlValue.value = "Kaleyra (India)";
            break;
        case "yellow ai":
            imgUrlValue.logo = "logoyellowai"; imgUrlValue.value = "Yellow AI (India)";
            break;
        case "infobip":
            imgUrlValue.logo = "logoInfobip"; imgUrlValue.value = "Infobip (India)";
            break;

    }

    return imgUrlValue;
};
function GetVendorWiseImage(vendor) {
    //vendor = vendor.toLowerCase();
    let imgUrl = "/Content/images/";
    switch (vendor) {
        case "infobip":
            imgUrl += "infobip.png";
            break;
        case "gupshup":
            imgUrl += "gupshup.png";
            break;
        case "aclmobile":
            imgUrl += "aclmobile.png";
            break;
        case "kaleyra":
            imgUrl += "kayleyra.png";
            break;
        case "yellow ai":
            imgUrl += "yellowai.png";
            break;
        case "interakt":
            imgUrl += "interakt.png";
            break;

    }
    return imgUrl;
}
$(document).on('click', '#Ui_addvendors', function () {
    clearfields();
    $(".popupcontainer").removeClass('hideDiv');
    Tablelength = 0;
    if (defaultvendor_status == false)
        $("#ui_chkDefaultvendor").prop("checked", true);

});
var _confignameid;
var _defaultstatus;
$(document).on('click', "#delete", function () {

    _confignameid = $(this).attr("data-id");
    _defaultstatus = $(this).attr("data-defaultstatus");
});

$("#deleteRowConfirm").click(function () {
    if (document.getElementById('ui_tbodyReportData').rows.length != 3) {
        if (_defaultstatus == 'true') {
            ShowErrorMessage(GlobalErrorList.WhatsAppSettings.DuplicateVendor);
            return
        }
    }

    WhatsAppSettingUtil.ArchiveVendorDetails(_confignameid);
});