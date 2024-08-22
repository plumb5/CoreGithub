var ClickToCallContact;
var CallPhoneNumber = { ContactId: 0 };
var _PhoneNumberForCall = '';
var visitorCountryCodeDom = intlTelInput(document.querySelector("#intrnatphone"));
var agentCountryCodeDom = intlTelInput(document.querySelector("#intrnatphoneagent"));

var SendCallToContactUtil = {
    SendCall: function (ContactId, phoneNumber, UserInfoUserId, LmsGroupmemberId, LmsGroupId, Score, LeadLabel, Publisher) {
        //if (Plumb5UserId == UserInfoUserId || LmsPermissionlevelSeniorUserID == 0) {
        CallPhoneNumber.ContactId = ContactId;
        CallPhoneNumber.LmsGroupId = LmsGroupId;
        CallPhoneNumber.Score = Score;
        CallPhoneNumber.LeadLabel = LeadLabel;
        CallPhoneNumber.LmsGroupmemberId = LmsGroupmemberId;
        CallPhoneNumber.Publisher = Publisher;

        _PhoneNumberForCall = phoneNumber;
        $("#ui_div_" + LmsGroupmemberId).addClass("activeBgRow");
        ShowPageLoading();
        $(".dropdown-menu").removeClass("show");
        $(".popuptitle h6").html("Make Call");
        SendCallToContactUtil.ResetCallDetails();
        SendCallToContactUtil.IntializeUserLoginDetails(ContactId, LmsGroupmemberId);

    },
    ResetCallDetails: function () {
        $("#ui_smallCallContactName").html('');
        $("#ui_ddlContactCallPhoneNumbers").empty();
        $("#ui_ddlAgentCallPhoneNumbers").empty();
    },
    IntializeUserLoginDetails: function (ContactId, LmsGroupmemberId) {
        $.ajax({
            url: "/General/GetUserLoginFullDetails",
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response.MobilePhone != undefined && response.MobilePhone != null && response.MobilePhone.length > 0) {
                    $("#ui_ddlAgentCallPhoneNumbers").append(`<option value="${response.MobilePhone}">${response.MobilePhone}</option>`);
                }

                if (response.BusinessPhone != undefined && response.BusinessPhone != null && response.BusinessPhone.length > 0) {
                    $("#ui_ddlAgentCallPhoneNumbers").append(`<option value="${response.BusinessPhone}">${response.BusinessPhone}</option>`);
                }


                if ($("#ui_ddlAgentCallPhoneNumbers option").length == 0) {
                    ShowErrorMessage(GlobalErrorList.SendCallToContact.NoUserAgent);
                    $("#ui_div_" + LmsGroupmemberId).removeClass("activeBgRow");
                    HidePageLoading();
                } else {
                    if (ContactId > 0) {
                        SendCallToContactUtil.GetDetailsForCall(ContactId, LmsGroupmemberId);
                    } else {
                        if (_PhoneNumberForCall.length > 0)
                            $("#ui_ddlContactCallPhoneNumbers").append(`<option value="${_PhoneNumberForCall}">${_PhoneNumberForCall}</option>`);
                    }
                }
            },
            error: ShowAjaxError
        });
    },
    GetDetailsForCall: function (ContactId, LmsGroupmemberId) {
        $.ajax({
            url: "/SendCallToContact/GetDetailsForCall",
            type: 'POST',
            data: JSON.stringify({
                'accountId': Plumb5AccountId, 'ContactId': ContactId
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response.isConfigured) {
                    SendCallToContactUtil.BindContactDetails(response);
                } else {
                    ShowErrorMessage(GlobalErrorList.SendCallToContact.NoConfiguration);
                    $("#ui_div_" + LmsGroupmemberId).removeClass("activeBgRow");
                    HidePageLoading();
                }
            },
            error: ShowAjaxError
        });
    },
    BindContactDetails: function (response) {
        if (response.contacts != undefined && response.contacts != null && response.contacts.length > 0) {
            $("#ui_smallCallContactName").html(response.contacts[0].Name);
            if (response.contacts[0].PhoneNumber != undefined && response.contacts[0].PhoneNumber != null && response.contacts[0].PhoneNumber.length > 0) {
                $("#ui_ddlContactCallPhoneNumbers").append(`<option value="${response.contacts[0].PhoneNumber}">${response.contacts[0].PhoneNumber}</option>`);
            }

            if (response.contacts[0].AlternatePhoneNumbers != undefined && response.contacts[0].AlternatePhoneNumbers != null && response.contacts[0].AlternatePhoneNumbers.length > 0) {
                var AlternatePhoneNumbersList = response.contacts[0].AlternatePhoneNumbers.split(',');

                for (var i = 0; i < AlternatePhoneNumbersList.length; i++) {
                    if ($("#permissionsList_MaskData").val() == "True")
                        $("#ui_ddlContactCallPhoneNumbers").append(`<option value="${AlternatePhoneNumbersList[i]}">${AlternatePhoneNumbersList[i].substring(0, AlternatePhoneNumbersList[i].length - 4) + "****"}</option>`);
                    else
                        $("#ui_ddlContactCallPhoneNumbers").append(`<option value="${AlternatePhoneNumbersList[i]}">${AlternatePhoneNumbersList[i]}</option>`);
                }
            }

            if ($("#ui_ddlContactCallPhoneNumbers option").length == 0) {
                ShowErrorMessage(GlobalErrorList.SendCallToContact.NoContactFound);
                HidePageLoading();
            } else {
                ClickToCallContact = response.contacts[0];
                SendCallToContactUtil.BindCountryCode(response.CountryCode);
            }
        }
        else {
            ShowErrorMessage(GlobalErrorList.SendCallToContact.NoContactFound);
            HidePageLoading();
        }
    },
    BindCountryCode: function (response) {
        response = CleanText(response);
        if (response != null && response != undefined && response != "") {

            response = response.toString().toLowerCase().replace("+", "").replace("-", "");
            if ((!$.isNumeric(response)) && visitorCountryCodeDom.countries.find(x => x.iso2 === response) != undefined)
                visitorCountryCodeDom.setCountry(response.toLowerCase());
            else if (visitorCountryCodeDom.countries.find(x => x.dialCode === response) != undefined)
                visitorCountryCodeDom.setCountry(visitorCountryCodeDom.countries.find(x => x.dialCode === response).iso2.toString());
            else if (visitorCountryCodeDom.countries.find(x => x.dialCode === response) != undefined)
                visitorCountryCodeDom.setCountry(visitorCountryCodeDom.countries.find(x => x.dialCode === response).iso2.toString());
            else
                visitorCountryCodeDom.setCountry("in");
        }
        else {
            visitorCountryCodeDom.setCountry("in");
        }
        agentCountryCodeDom.setCountry("in");
        $("#ui_divSendCallPopUp").removeClass("hideDiv");
        HidePageLoading();
    },
    ScheduleOrSendCall: function (VisitorCountryCode, AgentCountryCode) {
        var VisitorPhoneNumber = $("#ui_ddlContactCallPhoneNumbers").val();
        var AgentPhoneNumber = $("#ui_ddlAgentCallPhoneNumbers").val();
        $.ajax({
            url: "/SendCallToContact/ScheduleOrSendCall",
            type: 'POST',
            data: JSON.stringify({
                'accountId': Plumb5AccountId, 'ContactId': CallPhoneNumber.ContactId, 'VisitorCountryCode': VisitorPhoneNumber.indexOf("+") == 0 ? "" : VisitorCountryCode, 'AgentCountryCode': AgentCountryCode, 'VisitorPhoneNumber': VisitorPhoneNumber, 'AgentPhoneNumber': AgentPhoneNumber,
                'LmsGroupId': CallPhoneNumber.LmsGroupId, 'Score': CallPhoneNumber.Score, 'LeadLabel': CallPhoneNumber.LeadLabel,
                'Publisher': CallPhoneNumber.Publisher, 'LmsGroupMemberId': CallPhoneNumber.LmsGroupmemberId
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != undefined && response != null) {
                    if (response.Result) {
                        ShowSuccessMessage(GlobalErrorList.SendCallToContact.CallSuccess);
                        SendCallToContactUtil.ResetCallDetails();
                        $("#ui_divSendCallPopUp").addClass("hideDiv");
                    }
                    else {
                        if (response.ErrorMessage != null && response.ErrorMessage.length > 0) {
                            ShowErrorMessage(response.ErrorMessage);
                        } else {
                            ShowErrorMessage(GlobalErrorList.SendCallToContact.CallError);
                        }
                    }
                }
                $("#ui_div_" + ClickToCallContact.ContactId).removeClass("activeBgRow");
                $("tr").removeClass("activeBgRow");
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    }
}

$("#ui_btnSendCall").click(function () {
    ShowPageLoading();
    SendCallToContactUtil.ScheduleOrSendCall(visitorCountryCodeDom.getSelectedCountryData().dialCode, agentCountryCodeDom.getSelectedCountryData().dialCode);
});

$("#ui_iconCloseCallPopUp, #ui_btnCancelCall").click(function () {
    SendCallToContactUtil.ResetCallDetails();
    $("#ui_divSendCallPopUp").addClass("hideDiv");
    $("tr").removeClass("activeBgRow");
});