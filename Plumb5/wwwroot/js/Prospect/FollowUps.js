$(document).ready(function () {
     
        FollowUpsPageDocumentReadyUtil.LoadingSymbol();

        if (window.location.href.toLowerCase().indexOf("prospect/followups/completedfollowups") > 0)
            FollowUpsPageDocumentReadyUtil.DocumentReadyCompleted();
        else if (window.location.href.toLowerCase().indexOf("prospect/followups/missedfollowups") > 0)
            FollowUpsPageDocumentReadyUtil.DocumentReadyMissed();
        else
            FollowUpsPageDocumentReadyUtil.DocumentReadyPlanned();
        ExportFunctionName = "LeadsExport"; 
  
});

function CallBackFunction() {
    ShowPageLoading();
    TotalRowCount = 0;
    CurrentRowCount = 0;
    if (masterfiltervalue==0)
        LmsDefaultFunctionUtil.AddDatesQuery(); 
    LeadReportBindingUtil.GetMaxCount();
    LmsDefaultInitialiseUtil.BindLmsStageForMasterFilter();
    LmsDefaultInitialiseUtil.BindHandledByForMasterFilter();
    $('#drpFields_0').append("<option value='-1'>Select Stage</option>");
    LmsDefaultInitialiseUtil.GetLeadProperties();
    LmsDefaultInitialiseUtil.GetContactGroupName(); 
    LmsDefaultInitialiseUtil.GetAllFormsForMasterFilter();
  
}

function CallBackPaging() {
    ShowPageLoading();
    CurrentRowCount = 0;
    LeadReportBindingUtil.GetReport();
}
 function ShowMasterFilterPopUp () {
    $(".popuptitle h6").html("MASTER FILTER");
    //$('[id^="trsearch"]:not(:first)').remove();
    /*LmsCustomReportPopUpUtil.ClearFields();*/
    $('#dvAddOrUpdateReports').removeClass("hideDiv");
    if (window.location.href.toLowerCase().indexOf("/prospect/followups") > 0)
        $("#savereport").addClass("hideDiv");
    HidePageLoading();
}
$("#ui_drpdwn_filterbystages, #ui_drpdwn_filterbyUser").select2({
    minimumResultsForSearch: '',
    dropdownAutoWidth: false
});
$("#btnFollowUpCompleted").click(function () {
    $("#confirmfollowupcomplete").modal("show");
});
$("#btnMasterFilterFollowUp").click(function () {
    
    ShowMasterFilterPopUp();
    $("#ui_drpdwn_OrderBy").prop('disabled', true);
});
var FollowUpsGeneralFunction = {
     
    ResetQuickFilter: function () {
        $("#ui_dllLeadLabel").select2().val("select").change();
        $("#ui_dllHandledByUser").select2().val(0).change();
        $("#ui_dllStageSort").select2().val(-1).change();
        $('#ui_ddlSourceSort').selectpicker("deselectAll", true).selectpicker("refresh");
        $("#lmsallsources").val("select");
        $(".checkedCount").html(0);
        $(".visitorsCount").html(0);
        $(".selchbxall,.selChk").prop("checked", false);
        $(".lmsfilthite").removeClass("showDiv");
        //$('[id^="trsearch"]:not(:first)').remove();
        //$('[id^="trlmssearch"]:not(:first)').remove();
        if (!$(".lmssourcefilterwrp").hasClass("hideDiv"))
            $(".lmssourcefilterwrp").addClass("hideDiv");
        if (!$(".lmsstagefilterwrp").hasClass("hideDiv"))
            $(".lmsstagefilterwrp").addClass("hideDiv");
        if (!$(".lmshandledfilterwrp").hasClass("hideDiv"))
            $(".lmshandledfilterwrp").addClass("hideDiv");
        if (!$(".lmslabelfilterwrp").hasClass("hideDiv"))
            $(".lmslabelfilterwrp").addClass("hideDiv");
    },
    ResetMasterFilter: function () {
        ShowPageLoading();
        $('#txt_searchemailphone').val('');
        LmsCustomReportPopUpUtil.ClearFields();
        filterLead = {
            UserInfoUserId: 0, OrderBy: -1, StartDate: "", EndDate: "", Score: -1, LmsGroupIdList: "", UserIdList: "", FollowUpUserIdList: "", GroupId: 0, FormId: 0, EmailId: "", PhoneNumber: "", Name: "", LastName: "", Address1: "", Address2: "", StateName: "", Country: "", ZipCode: "",
            Age: "", Gender: "", MaritalStatus: "", Education: "", Occupation: "", Interests: "", Location: "", Religion: "", CompanyName: "", CompanyWebUrl: "", DomainName: "", CompanyAddress: "", Projects: "", LeadLabel: "", Remarks: "",
            CustomField1: "", CustomField2: "", CustomField3: "", CustomField4: "", CustomField5: "", CustomField6: "", CustomField7: "", CustomField8: "", CustomField9: "", CustomField10: "",
            CustomField11: "", CustomField12: "", CustomField13: "", CustomField14: "", CustomField15: "", CustomField16: "", CustomField17: "", CustomField18: "", CustomField19: "", CustomField20: "",
            CustomField21: "", CustomField22: "", CustomField23: "", CustomField24: "", CustomField25: "", CustomField26: "", CustomField27: "", CustomField28: "", CustomField29: "", CustomField30: "",
            CustomField31: "", CustomField32: "", CustomField33: "", CustomField34: "", CustomField35: "", CustomField36: "", CustomField37: "", CustomField38: "", CustomField39: "", CustomField40: "",
            CustomField41: "", CustomField42: "", CustomField43: "", CustomField44: "", CustomField45: "", CustomField46: "", CustomField47: "", CustomField48: "", CustomField49: "", CustomField50: "",
            CustomField51: "", CustomField52: "", CustomField53: "", CustomField54: "", CustomField55: "", CustomField56: "", CustomField57: "", CustomField58: "", CustomField59: "", CustomField60: "",
            SearchKeyword: "", PageUrl: "", ReferrerUrl: "", IsAdSenseOrAdWord: "", Place: "", CityCategory: ""
        };
        OffSet = 0;
        if (window.location.href.toLowerCase().indexOf("/prospect/followups") > 0 && window.location.href.toLowerCase().indexOf("/prospect/followups/missedfollowups") < 0 && window.location.href.toLowerCase().indexOf("/prospect/followups/completedfollowups")<0)
            filterLead.OrderBy = 4;
        if (window.location.href.toLowerCase().indexOf("/prospect/followups/missedfollowups") > 0)
            filterLead.OrderBy = 5;
        if (window.location.href.toLowerCase().indexOf("/prospect/followups/completedfollowups") > 0)
            filterLead.OrderBy = 6;
        

        CallBackFunction();
    },
    SelectAllCheckBoxClick: function () {
        if ($('.selchbxall').is(":checked"))
            $(".selChk").prop('checked', true);
        else
            $(".selChk").prop('checked', false);

        checkBoxClickCount = $('.selChk').filter(':checked').length;

        if (checkBoxClickCount > 0)
            $(".subdivWrap").addClass('showDiv');
        else if (checkBoxClickCount <= 0 && CleanText($.trim($("#txt_searchemailphone").val())).length == 0 && $(".lmssourcefilterwrp").hasClass("hideDiv") && $(".lmsstagefilterwrp").hasClass("hideDiv") && $(".lmshandledfilterwrp").hasClass("hideDiv") && $(".lmslabelfilterwrp").hasClass("hideDiv") && $(".filtwrpbar").hasClass("hideDiv"))
            $(".subdivWrap").removeClass('showDiv');

        $(".checkedCount").html(checkBoxClickCount);
    },
};
$("#ui_i_filterClose").click(function () {
     $("#drp_Stages").empty();
    $("#drpFields_0").empty();
    $("#drp_handledBy").empty();
    $("#ui_drp_ContactGroups").empty();
    $("#ui_drpdwn_Forms").empty();
    $('#drpFields_0').append("<option value='-1'>Select</option>");
    $('#drp_Stages').append("<option value='-1'>Select Stage</option>");
    $('#drp_handledBy').append("<option value='-1'>Select</option>"); 
    $('#ui_drpdwn_Forms').append("<option value='-1'>Select</option>");
    $('#ui_drp_ContactGroups').append("<option value='-1'>Select</option>");
    $(this).addClass("hideDiv");
    $(this).prev().removeClass("hideDiv");
    masterfiltervalue = 0;
    FollowUpsGeneralFunction.ResetMasterFilter();
});
