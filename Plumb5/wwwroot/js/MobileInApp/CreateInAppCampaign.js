
var mobileInAppCampaign = {
    Id: 0, Name: "", Design: "", DraftTemplateId: 0, Priority:0, IsRuleCampaign: false, CampaignId: 0, InAppCampaignType: "",
    StartDate: null, ExpiryDate: null,GroupId:0
};
var CampaignList = new Array();
var GroupList = new Array();
var InAppCampaignUtil = {
    CreateUniqueIdentifier: function () {
        var today = new Date();
        var strYear = today.getFullYear().toString() + today.getMonth().toString() + 1 + today.getDate().toString() + today.getMilliseconds().toString();
        $("#ui_txtCampaignIdentifier").val("InApp Campaign Identifier -" + strYear);
    },
    BindCampaign: function () {
        $.ajax({
            url: "/MobileInApp/CreateCampaign/GetCampaignList",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != undefined && response != null) {
                    var CampaignDetails;
                    $.each(response, function () {
                        CampaignDetails = { CampaignId: $(this)[0].Id, CampaignName: $(this)[0].Name };
                        CampaignList.push(CampaignDetails);
                        $("#ddlCampaignName").append(`<option value="${$(this)[0].Id}">${$(this)[0].Name}</option>`);
                    });

                }
                InAppCampaignUtil.BindGroups();


            },
            error: ShowAjaxError
        });
    },
    BindGroups: function () {
        $.ajax({
            url: "/MobileInApp/CreateCampaign/GetGroupList",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != undefined && response != null) {
                    var GroupDetails;

                    $.each(response, function () {
                        GroupDetails = { Id: $(this)[0].Id, Name: $(this)[0].Name };
                        GroupList.push(GroupDetails);
                        $("#ddlInappgroup").append(`<option value="${$(this)[0].Id}">${$(this)[0].Name}</option>`);
                    });
                }
                if (mobileInAppCampaign.Id > 0) {
                    InAppCampaignUtil.InitializeInAppCampaignForEdit(mobileInAppCampaign.Id);
                }

            },
            error: ShowAjaxError
        });
    },
    NavigateToNext: function () {
        //General Information
        if ($("#ui_headerGeneralInfo").hasClass("active")) {
            if (!InAppCampaignUtil.ValidateGeneralInformation())
                return;
            mobileInAppCampaign.Name = CleanText($.trim($("#ui_txtCampaignIdentifier").val()));
            mobileInAppCampaign.CampaignId = $("#ddlCampaignName option:selected").val();

            $("#ui_headerGeneralInfo").removeClass("active");
            $("#dvGeneralInformation").addClass("hideDiv");
            $("#ui_headerTheme").addClass("active");
            $("#dvTheme,#ui_btnBackContent").removeClass("hideDiv");
        }
        //Theme
        else if ($("#ui_headerTheme").hasClass("active")) {

            if (!fieldValidation())
            {
                return false;
            }

            mobileInAppCampaign.DraftTemplateId = DraftTemplateId;
            mobileInAppCampaign.InAppCampaignType = InAppCampaignType;
            mobileInAppCampaign.Design = getInAppDesign();

            $("#ui_headerTheme").removeClass("active");
            $("#dvTheme").addClass("hideDiv");
            $("#ui_headerRules").addClass("active");
            $("#dvRules,#ui_btnBackContent,#cont_setrules").removeClass("hideDiv");
            $('#dvFormDisplayDuration,#dvMobileInAppCampaign').removeClass("hideDiv");

            $("#ui_btnNext").html(`Save <i class="icon ion-chevron-right pl-2"></i>`);

        }
        //Rules
        else if ($("#ui_headerRules").hasClass("active")) {

            if (!ValidateRulesDetails()) {
                HidePageLoading();
                return true;
            }

            if ($("#ui_chkFormDisplayDuration").is(":checked")) {
                if (!InAppCampaignUtil.ValidateFormDisplayDuration())
                    return;
            }

            AssignRulesDetails();
            if (checkbyaudicount > 0 || checkbybehcount > 0 || checkbyintercount > 0 || checkbyeventcount > 0 || checkbyprofcount > 0 || ($("#txtStartDate").val().length > 0 && $("#txtEndDate").val().length>0))
                mobileInAppCampaign.IsRuleCampaign = true;


            if ($("#ui_chkFormDisplayDuration").is(":checked") && CleanText($.trim($("#txtStartDate").val())).length > 0 && CleanText($.trim($("#txtEndDate").val())).length > 0) {
                //Start Date
                var InAppStartDateval = $("#txtStartDate").val().toString().split('/');
                var InAppStartDate = InAppStartDateval[2] + '-' + InAppStartDateval[0] + '-' + InAppStartDateval[1] + ' ' + $("#ddlStartTime").val().toString() + ":00";
                InAppStartDate = ConvertDateTimeToUTC(InAppStartDate);
                mobileInAppCampaign.StartDate = InAppStartDate.getFullYear() + '-' + InAppCampaignUtil.AddingPrefixZero((InAppStartDate.getMonth() + 1)) +
                    '-' + InAppCampaignUtil.AddingPrefixZero(InAppStartDate.getDate()) + " " + InAppCampaignUtil.AddingPrefixZero(InAppStartDate.getHours()) + ":" +
                    InAppCampaignUtil.AddingPrefixZero(InAppStartDate.getMinutes()) + ":" + InAppCampaignUtil.AddingPrefixZero(InAppStartDate.getSeconds());
                // mobileInAppCampaign.StartDate = InAppStartDate;
                //ExpireDate
                var InAppExpireDateval = $("#txtEndDate").val().toString().split('/');
                var InAppExpireDate = InAppExpireDateval[2] + '-' + InAppExpireDateval[0] + '-' + InAppExpireDateval[1] + ' ' + $("#ddlEndTime").val().toString() + ":00";
                InAppExpireDate = ConvertDateTimeToUTC(InAppExpireDate);
                mobileInAppCampaign.ExpiryDate = InAppExpireDate.getFullYear() + '-' + InAppCampaignUtil.AddingPrefixZero((InAppExpireDate.getMonth() + 1)) +
                    '-' + InAppCampaignUtil.AddingPrefixZero(InAppExpireDate.getDate()) + " " + InAppCampaignUtil.AddingPrefixZero(InAppExpireDate.getHours()) + ":" +
                    InAppCampaignUtil.AddingPrefixZero(InAppExpireDate.getMinutes()) + ":" + InAppCampaignUtil.AddingPrefixZero(InAppExpireDate.getSeconds());
            }

            mobileInAppCampaign.GroupId = $('#ddlInappgroup').val();
            //Saving
            InAppCampaignUtil.SaveInAppCampaign(mobileInAppCampaign);
        }
    },
    NavigateToBack: function () {
        $("#ui_btnNext").prop('disabled', false);
        if ($("#ui_headerRules").hasClass("active")) {
            $("#ui_headerRules").removeClass("active");
            $("#dvRules").addClass("hideDiv");
            $("#ui_headerTheme").addClass("active");
            $("#dvTheme,#ui_btnBackContent").removeClass("hideDiv");
            $("#ui_btnNext").html(`Next <i class="icon ion-chevron-right pl-2"></i>`);
        }
        else if ($("#ui_headerTheme").hasClass("active")) {
            $("#ui_headerTheme").removeClass("active");
            $("#dvTheme").addClass("hideDiv");
            $("#ui_headerGeneralInfo").addClass("active");
            $("#dvGeneralInformation").removeClass("hideDiv");
            $("#ui_btnBackContent").addClass("hideDiv");
        }

    },
    ValidateGeneralInformation: function () {
        if ($("#ui_txtCampaignIdentifier").val() == undefined || $("#ui_txtCampaignIdentifier").val() == null || $("#ui_txtCampaignIdentifier").val() == "" || CleanText($.trim($("#ui_txtCampaignIdentifier").val())).length == 0) {
            ShowErrorMessage(GlobalErrorList.ManageInappCampaign.CampaignIdentifier_Error);
            $("#ui_txtCampaignIdentifier").focus();
            return false;
        }

        if ($("#ddlCampaignName option:selected").val() == undefined || $("#ddlCampaignName option:selected").val() == null || $("#ddlCampaignName option:selected").val() == "" || $("#ddlCampaignName option:selected").val() == "0") {
            ShowErrorMessage(GlobalErrorList.ManageInappCampaign.CampaignName_Error);
            return false;
        }
        return true;
    },
    ValidateFormDisplayDuration: function () {

        if (CleanText($.trim($("#txtStartDate").val())).length <= 0) {
            ShowErrorMessage(GlobalErrorList.ManageInappCampaign.InAppCampaignRuleStartDate_Error);
            $("#txtStartDate").focus();
            HidePageLoading();
            return false;
        }

        if (CleanText($.trim($("#txtEndDate").val())).length <= 0) {
            ShowErrorMessage(GlobalErrorList.ManageInappCampaign.InAppCampaignRuleStartDate_Error);
            $("#txtEndDate").focus();
            HidePageLoading();
            return false;
        }

        if ($("#txtStartDate").val().length == 0 && $("#txtEndDate").val().length > 0) {
            HidePageLoading();
            ShowErrorMessage(GlobalErrorList.ManageInappCampaign.InAppCampaignRuleStartDate_Error);
            return false;
        }

        if ($("#txtStartDate").val().length > 0 && $("#txtEndDate").val().length == 0) {
            HidePageLoading();
            ShowErrorMessage(GlobalErrorList.ManageInappCampaign.InAppCampaignRuleExpiryDate_Error);
            return false;
        }

        if ($("#txtStartDate").val().length > 0 && $("#txtEndDate").val().length > 0) {

            LocalFromdate = $("#txtStartDate").val() + " " + $("#ddlStartTime").val().toString() + ":00";
            LocalTodate = $("#txtEndDate").val() + " " + $("#ddlEndTime").val().toString() + ":00";

            if (isFromBiggerThanTo(LocalFromdate, LocalTodate)) {
                setTimeout(function () { HidePageLoading(); }, 1000);
                ShowErrorMessage(GlobalErrorList.CreateEmbeddedForm.from_date_less_then_error);
                $("#txtStartDate").focus();
                return false;
            }

            let todaydate = new Date();

            let enteredendDate = $("#txtEndDate").val() + " " + $("#ddlEndTime").val().toString() + ":00";

            let currentDate = (todaydate.getMonth() + 1) + '/' + todaydate.getDate() + '/' + todaydate.getFullYear() + " " + todaydate.getHours() + ":" + todaydate.getMinutes() + ":" + todaydate.getSeconds();

            if (Date.parse(enteredendDate) <= Date.parse(currentDate)) {
                setTimeout(function () { HidePageLoading(); }, 1000);
                ShowErrorMessage(GlobalErrorList.CreateEmbeddedForm.EndDateTime);
                HidePageLoading();
                $("#txtEndDate").focus();
                return false;
            }

            //let todaydate = new Date();
            //let enteredStartDate = $("#txtStartDate").val() + " " + $("#ddlStartTime").val().toString() + ":00";
            //let enteredendDate = $("#txtEndDate").val() + " " + $("#ddlEndTime").val().toString() + ":00";

            //let currentDate = (todaydate.getMonth() + 1) + '/' + todaydate.getDate() + '/' + todaydate.getFullYear() + " " + todaydate.getHours() + ":" + todaydate.getMinutes() + ":" + todaydate.getSeconds();
            //if (Date.parse(enteredStartDate) <= Date.parse(currentDate)) {
            //    ShowErrorMessage(GlobalErrorList.ManageInappCampaign.InAppCampaignRuleStartTime_Error);
            //    HidePageLoading();
            //    return false;
            //}
            //if (Date.parse(enteredendDate) <= Date.parse(currentDate)) {
            //    ShowErrorMessage(GlobalErrorList.ManageInappCampaign.InAppCampaignRuleExpiryTime_Error);
            //    HidePageLoading();
            //    return false;
            //}
            //if (Date.parse(enteredendDate) <= Date.parse(enteredStartDate)) {
            //    ShowErrorMessage(GlobalErrorList.ManageInappCampaign.InAppCampaignRuleExpiryDateRange_Error);
            //    HidePageLoading();
            //    return false;
            //}
        }
        return true;
    },
    SaveInAppCampaign: function (mobileInAppCampaign) {
        if (mobileInAppCampaign != undefined && mobileInAppCampaign != null) {
            ShowPageLoading();
            var getCaptureFormFields = getFormFields();
            $.ajax({
                url: "/MobileInApp/CreateCampaign/SaveOrUpdate",
                type: 'POST',
                data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'mobileInAppCampaign': mobileInAppCampaign, 'rulesData': ruleConditions, 'CaptureFormFields': getCaptureFormFields }),//
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) {
                    if (mobileInAppCampaign.Id == 0 && response.InAppCampaignId > 0)
                        ShowSuccessMessage(GlobalErrorList.ManageInappCampaign.CampaignSaved_success);
                    else if (mobileInAppCampaign.Id > 0)
                        ShowSuccessMessage(GlobalErrorList.ManageInappCampaign.CampaignUpdated_success);
                    else
                        ShowErrorMessage(GlobalErrorList.ManageInappCampaign.CampaignIdentifierExist_Error);

                    if (response.InAppCampaignId !=-1)
                        window.location.href = "/MobileInApp/ManageCampaign";

                    HidePageLoading();
                },
                error: ShowAjaxError
            });
        }
    },
    InitializeInAppCampaignForEdit: function (InAppCampaignId) {
        $.ajax({
            url: "/MobileInApp/CreateCampaign/GetInAppCampaignDetails",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'InAppCampaignId': InAppCampaignId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: InAppCampaignUtil.BindInAppCampaignDetails,
            error: ShowAjaxError
        });

    },
    BindInAppCampaignDetails: function (response) {
        if (response != undefined && response != null) {
            mobileInAppCampaign = response.InappCampaignDetails;
            ruleConditions = response.InAppCampaignRules;
            //General Information
            $("#ui_txtCampaignIdentifier").val(mobileInAppCampaign.Name).prop("disabled", true);
            $("#ddlCampaignName").val(mobileInAppCampaign.CampaignId);
            var CampaignName = JSLINQ(CampaignList).Where(function () { return (this.CampaignId == mobileInAppCampaign.CampaignId); });
            if (CampaignName.items.length > 0)
                $('#select2-ddlCampaignName-container').text(CampaignName.items[0].CampaignName);


            //Theme
            SelectTemplate(mobileInAppCampaign.InAppCampaignType, mobileInAppCampaign.Design);

            //Rules

            BindRulesDetails();

            if (mobileInAppCampaign.StartDate != undefined && mobileInAppCampaign.StartDate != "" && mobileInAppCampaign.StartDate != null && mobileInAppCampaign.StartDate.length > 0) {
                var startDateUTCFormatToLocaltime = GetJavaScriptDateObj(mobileInAppCampaign.StartDate);
                var StartDateValue = InAppCampaignUtil.AddingPrefixZero((startDateUTCFormatToLocaltime.getMonth() + 1)) + '/' + InAppCampaignUtil.AddingPrefixZero(startDateUTCFormatToLocaltime.getDate()) + "/" + startDateUTCFormatToLocaltime.getFullYear();
                $("#txtStartDate").val(StartDateValue);
                var starttime = InAppCampaignUtil.AddingPrefixZero(startDateUTCFormatToLocaltime.getHours()) + ":" + InAppCampaignUtil.AddingPrefixZero(startDateUTCFormatToLocaltime.getMinutes());
                $("#ddlStartTime").val(starttime);
            }

            if (mobileInAppCampaign.ExpiryDate != undefined && mobileInAppCampaign.ExpiryDate != "" && mobileInAppCampaign.ExpiryDate != null && mobileInAppCampaign.ExpiryDate.length > 0) {
                var endDateUTCFormatToLocaltime = GetJavaScriptDateObj(mobileInAppCampaign.ExpiryDate);
                var EndDateValue = InAppCampaignUtil.AddingPrefixZero((endDateUTCFormatToLocaltime.getMonth() + 1)) + '/' + InAppCampaignUtil.AddingPrefixZero(endDateUTCFormatToLocaltime.getDate()) + "/" + endDateUTCFormatToLocaltime.getFullYear();
                $("#txtEndDate").val(EndDateValue);
                var endtime = InAppCampaignUtil.AddingPrefixZero(endDateUTCFormatToLocaltime.getHours()) + ":" + InAppCampaignUtil.AddingPrefixZero(endDateUTCFormatToLocaltime.getMinutes());
                $("#ddlEndTime").val(endtime);
            }

            if (mobileInAppCampaign.StartDate != undefined && mobileInAppCampaign.StartDate != "" && mobileInAppCampaign.StartDate != null && mobileInAppCampaign.StartDate.length > 0 && mobileInAppCampaign.ExpiryDate != undefined && mobileInAppCampaign.ExpiryDate != "" && mobileInAppCampaign.ExpiryDate != null && mobileInAppCampaign.ExpiryDate.length > 0)
                $("#ui_chkFormDisplayDuration").prop("checked", true);
            else
                $("#ui_chkFormDisplayDuration").prop("checked", false);

            //var dtStart = GetJavaScriptDateObj(mobileInAppCampaign.StartDate);
            //dtStart = parseInt(dtStart.getMonth() + 1) + "/" + dtStart.getDate() + "/" + dtStart.getFullYear();
            //$("#txtInAppstartDate").val(dtStart);

            //var dtExpire = GetJavaScriptDateObj(mobileInAppCampaign.ExpiryDate);
            //dtExpire = parseInt(dtExpire.getMonth() + 1) + "/" + dtExpire.getDate() + "/" + dtExpire.getFullYear();
            //$("#txtInAppExpiryDate").val(dtExpire);
            //$("#ddlInappgroup").val(mobileInAppCampaign.GroupIdId);
            //var GroupName = JSLINQ(GroupList).Where(function () { return (this.Id == mobileInAppCampaign.GroupId); });
            //if (GroupName.items.length > 0)
            //    $('#select2-ddlInappgroup-container').text(GroupName.items[0].Name);
        }

    },
    AddingPrefixZero: function (n) {
        return (n < 10) ? ("0" + n) : n;
    }
};

$(document).ready(function () {
    ShowPageLoading();
    mobileInAppCampaign.Id = urlParam("Id");
    if (mobileInAppCampaign.Id > 0) {
        InAppCampaignUtil.BindCampaign();

    } else {
        InAppCampaignUtil.CreateUniqueIdentifier();
        InAppCampaignUtil.BindCampaign();
    }
});

$('#ddlCampaignName').select2({
    minimumResultsForSearch: '',
    dropdownAutoWidth: false
});

function ReturnDateInFormat(dateValue) {
    var res = dateValue.split("/");
    var newDate = res[2] + '-' + res[0] + '-' + res[1];
    return newDate;
}

function isFromBiggerThanTo(dtmfrom, dtmto) {
    var from = new Date(dtmfrom).getTime();
    var to = new Date(dtmto).getTime();
    return from > to;
}




