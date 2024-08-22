$(document).ready(function () {
    FollowUpStatus = 3;
    lmsorderbyval = 4;
    IsCheckBoxRequired = false;
    LeadsUtil.LoadingSymbol();
    //LeadsUtil.BindActiveEmailId();
    //LeadsUtil.IntializeLmsGroupList();
    LeadsUtil.IfNewIntializeDefault();
    ExportFunctionName = "LeadsExport";
});

$("#ui_drpdwn_filterbystages, #ui_drpdwn_filterbyUser").select2({
    minimumResultsForSearch: '',
    dropdownAutoWidth: false
});

$("#SearchByEmailOrPhone").click(function () {
    ShowPageLoading();
    if ($.trim($("#txt_searchemailphone").val()).length == 0) {
        ShowErrorMessage(GlobalErrorList.Leads.SearchErrorValue);
        $("#txt_searchemailphone").focus();
        setTimeout(function () { HidePageLoading(); }, 500);
        return false;
    }
    else {
        var query = CleanText($.trim($("#txt_searchemailphone").val()));
        var isNumeric = query.match(/^\d+$/);

        if (isNumeric) {
            contactDetails.PhoneNumber = CleanText($.trim($("#txt_searchemailphone").val()));
            contactDetails.EmailId = null;
        }
        else {
            contactDetails.EmailId = CleanText($.trim($("#txt_searchemailphone").val()));
            contactDetails.PhoneNumber = null;
        }
        OffSet = 0;
        LeadsUtil.MaxCount();
    }
});

$("#txt_searchemailphone").keypress(function (e) {
    if ((e.which && e.which === 13) || (e.keyCode && e.keyCode === 13)) {
        if (CleanText($.trim($("#txt_searchemailphone").val())).length == 0) {
            ShowErrorMessage(GlobalErrorList.ManageEmbeddedForm.SearchErrorValue);
            HidePageLoading();
            return false;
        }
        ShowPageLoading();

        var query = CleanText($.trim($("#txt_searchemailphone").val()));
        var isNumeric = query.match(/^\d+$/);

        if (isNumeric) {
            contactDetails.PhoneNumber = CleanText($.trim($("#txt_searchemailphone").val()));
            contactDetails.EmailId = null;
        }
        else {
            contactDetails.EmailId = CleanText($.trim($("#txt_searchemailphone").val()));
            contactDetails.PhoneNumber = null;
        }
        OffSet = 0;
        LeadsUtil.MaxCount();
    }
});

$("#txt_searchemailphone").keyup(function (e) {
    if (e.which && e.which === 8 || e.keyCode && e.keyCode === 46)
        if ($("#txt_searchemailphone").val().length === 0) {
            ShowPageLoading();

            contactDetails.EmailId = null;
            contactDetails.PhoneNumber = null;

            contactDetails = {
                ContactId: 0, Name: "", LastName: "", AgeRange1: 0, AgeRange2: 0, Education: "", Gender: "", Occupation: "", MaritalStatus: "",
                Location: "", Interests: "", UtmTagSource: "", FirstUtmMedium: "", FirstUtmCampaign: "", FirstUtmTerm: "", FirstUtmContent: "", Unsubscribe: null,
                OptInOverAllNewsLetter: null, IsSmsUnsubscribe: null, SmsOptInOverAllNewsLetter: null, AccountType: "", DateRange1: "", DateRange2: "",
                IsAccountHolder: null, AccountOpenedSource: "", LastActivityLoginDate: null, LastActivityLoginSource: "",
                CustomerScore: "", AccountAmount: "", IsCustomer: null, IsMoneyTransferCustomer: null, IsReferred: null, IsGoalSaver: null, IsReferredOpenedAccount: null,
                IsComplaintRaised: null, ComplaintType: "", CustomField1: "", CustomField2: "", CustomField3: "",
                CustomField4: "", CustomField5: "", CustomField6: "", CustomField7: "", CustomField8: "", CustomField9: "", CustomField10: "", CustomField11: "",
                CustomField12: "", CustomField13: "", CustomField14: "", CustomField15: "", CustomField16: "", CustomField17: "", CustomField18: "", CustomField19: "",
                CustomField20: "", CustomField21: "", CustomField22: "", CustomField23: "", CustomField24: "", CustomField25: "", CustomField26: "",
                CustomField27: "", CustomField28: "", CustomField29: "", CustomField30: "", CustomField31: "", CustomField32: "", CustomField33: "", CustomField34: "",
                CustomField35: "", CustomField36: "", CustomField37: "", CustomField38: "", CustomField39: "", CustomField40: "", CustomField41: "", CustomField42: "",
                CustomField43: "", CustomField44: "", CustomField45: "", CustomField46: "", CustomField47: "", CustomField48: "", CustomField49: "", CustomField50: "",
                CustomField51: "", CustomField52: "", CustomField53: "", CustomField54: "", CustomField55: "", CustomField56: "", CustomField57: "", CustomField58: "",
                CustomField59: "", CustomField60: ""
            };
            LeadsUtil.MaxCount();
        }
});

$("#ui_drpdwn_filterbystages").on('change', function () {
    if (parseInt($("#ui_drpdwn_filterbystages").val()) != -1)
        FilterByScore = $("#ui_drpdwn_filterbystages").val();
    else
        FilterByScore = "";
    ShowPageLoading();
    OffSet = 0;
    LeadsUtil.MaxCount();
});

$("#ui_drpdwn_filterbyUser").on('change', function () {
    if (parseInt($("#ui_drpdwn_filterbyUser").val()) > 0)
        FilterHandledBy = $("#ui_drpdwn_filterbyUser").val();
    else
        FilterHandledBy = "";
    ShowPageLoading();
    OffSet = 0;
    LeadsUtil.MaxCount();
});

//Search text
$(".contsearchfocus")
    .on("focus", function () {
        $(this).parent().addClass("w-300");
    })
    .on("blur", function () {
        if ($(".contsearchfocus").val().length < 15)
            $(this).parent().removeClass("w-300");
    });
