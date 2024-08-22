$(document).ready(function () {
    /*LmsSettingUtil.GetReport();*/
    var lmsParaGroupId = $.urlParam("LmsGroupId");
    $('#Showalldate').removeClass("hideDiv");
    if (lmsParaGroupId != null && lmsParaGroupId != undefined && parseInt(lmsParaGroupId) > 0) {
        filterLead.LmsGroupIdList = lmsParaGroupId;

        $('#selectdateDropdown').text('Custom Date Range');
        $('.dateBoxWrap').addClass('showFlx');

        var SelectedFromDate = $.urlParam("Frm").toString().replace(/%20/g, " ");
        var SelectedToDate = $.urlParam("To").toString().replace(/%20/g, " ");

        $('#ui_txtStartDate').val(SelectedFromDate);
        $('#ui_txtEndDate').val(SelectedToDate);

        $("#ui_small_LmsGroupName").html(`Source: <span>${$.urlParam("LmsGroupName").toString().replace(/%20/g, " ")}</span>`);
        $("#ui_small_LmsGroupName").removeClass("hideDiv");
        $('#ui_txtStartDate').prop("disabled", true);
        $('#ui_txtEndDate').prop("disabled", true);
    }

    var dashboardType = $.urlParam("dashboardType");
    if (dashboardType != null && dashboardType != undefined && parseInt(dashboardType) > 0) {
        $('#selectdateDropdown').text('Custom Date Range');
        $('.dateBoxWrap').addClass('showFlx');

        var SelectedFromDate = $.urlParam("Frm").toString().replace(/%20/g, " ");
        var SelectedToDate = $.urlParam("To").toString().replace(/%20/g, " ");

        let dashboardResult = ``;
        if (parseInt(dashboardType) == 1)
            dashboardResult = `Leads In`;
        if (parseInt(dashboardType) == 2)
            dashboardResult = `Un-Staged`;
        if (parseInt(dashboardType) == 3)
            dashboardResult = `Engaged`;

        $('#ui_txtStartDate').val(SelectedFromDate);
        $('#ui_txtEndDate').val(SelectedToDate);

        $("#ui_small_LmsGroupName").html(`Dashboard Result: <span>${dashboardResult}</span>`);
        $("#ui_small_LmsGroupName").removeClass("hideDiv");
        $('#ui_txtStartDate').prop("disabled", true);
        $('#ui_txtEndDate').prop("disabled", true);
    }

    LeadsPageDocumentReadyUtil.LoadingSymbol();
    LeadsPageDocumentReadyUtil.DocumentReady();
    LeadsUtilGeneralFunction.BindRequiredValuesToArray();
    LeadsUtil.GetFilterBySearchColumn();
    ExportFunctionName = "LeadsExport";
});

function CallBackFunction() {
    ShowPageLoading();
    TotalRowCount = 0;
    CurrentRowCount = 0;
    if (masterfiltervalue == 0) {
        if (!$("#ui_i_filterClose").hasClass("hideDiv"))
            $("#ui_i_filterClose").click();
        LmsDefaultFunctionUtil.AddDatesQuery();
    }
   
    LeadReportBindingUtil.GetMaxCount();
}

function CallBackPaging() {
    ShowPageLoading();
    CurrentRowCount = 0;
    LeadReportBindingUtil.GetReport();
}

var LeadsUtil = {
    QuickFilterBySelect: function () {
        let getlmssourcetypeval = $("#lmsallsources option:selected").val();
        $(".subdivWrap").addClass("showDiv");
        if (getlmssourcetypeval == "select") {
            $(".lmssourcefilterwrp, .lmsstagefilterwrp, .lmshandledfilterwrp, .lmslabelfilterwrp").addClass("hideDiv");
            $(".subdivWrap").removeClass("showDiv h-auto");
        }
        else if (getlmssourcetypeval == "Sources") {
            $('#ui_ddlSourceSort').selectpicker("deselectAll", true).selectpicker("refresh");
            $(".lmssourcefilterwrp").removeClass("hideDiv");
        }
        else if (getlmssourcetypeval == "Stages")
            $(".lmsstagefilterwrp").removeClass("hideDiv");
        else if (getlmssourcetypeval == "Handled")
            $(".lmshandledfilterwrp").removeClass("hideDiv");
        else
            $(".lmslabelfilterwrp").removeClass("hideDiv");

        if (($(".lmssourcefilterwrp").hasClass("hideDiv") && $(".lmsstagefilterwrp").hasClass("hideDiv") && $(".lmshandledfilterwrp").hasClass("hideDiv") && $(".lmslabelfilterwrp").hasClass("hideDiv")) || !$("#ui_i_filterClose").hasClass("hideDiv"))
            $("#ui_i_filterClose").click();

        $("#lmsallsources").val("select");
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
    ShowAddOrRemoveGroupPopUp: function () {
        ShowPageLoading();
        var ContactSelectedCount = parseInt($(".checkedCount").html());
        if (ContactSelectedCount <= 0) {
            ShowErrorMessage(GlobalErrorList.Leads.contactselecterror);
            HidePageLoading();
            return false;
        }
        $("#addremovegroup").modal('show');
        setTimeout(function () { LmsDefaultFunctionUtil.GetContactGroup(); }, 2000);
    },
    AddOrRemoveFromGroup: function () {
        PresentContactGroupId = new Array();

        PresentContactGroupId = $("#addgroupoperation").val();
        if (PresentContactGroupId == null) {
            ShowErrorMessage(GlobalErrorList.Leads.selectgroups);
            return false;
        }

        var deleteGroup = [];
        var diffArray = LmsDefaultFunctionUtil.DifferenceOfTwoArrays(PreContactGroupId, PresentContactGroupId);
        for (var d = 0; d < diffArray.length; d++) {
            if (PreContactGroupId.indexOf(diffArray[d]) > -1 && PresentContactGroupId.indexOf(diffArray[d]) == -1) {
                deleteGroup.push(diffArray[d]);
            }
        }

        if (chkArrayContactId.length > 0 && PresentContactGroupId.length > 0) {
            $.ajax({
                type: "POST",
                url: "/ManageContact/Contact/AddToGroup",
                data: JSON.stringify({ 'accountId': Plumb5AccountId, 'contact': chkArrayContactId, 'Groups': PresentContactGroupId }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) {
                    if (response > 0)
                        ShowSuccessMessage(GlobalErrorList.Leads.addedtogroup);
                    else
                        ShowErrorMessage(GlobalErrorList.Leads.error);

                    $("#addremovegroup").modal('hide');
                },
                error: ShowAjaxError
            });
        }
        else {
            ShowErrorMessage(GlobalErrorList.Leads.selectleadsaddtogrp);
            HidePageLoading();
            return false;
        }

        if (chkArrayContactId.length > 0 && deleteGroup.length > 0) {
            $.ajax({
                type: "POST",
                url: "/ManageContact/Contact/DeleteFromGroup",
                data: JSON.stringify({ 'contact': chkArrayContactId, 'Groups': deleteGroup }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) {
                    if (response > 0)
                        ShowSuccessMessage(GlobalErrorList.Leads.RemoveContactFromGroupSuccessMsg);
                    else
                        ShowErrorMessage(GlobalErrorList.Leads.error);
                },
                error: ShowAjaxError
            });
        }
    },
    DeleteMultipleLeadsModalShow: function () {
        ShowPageLoading();
        var ContactSelectedCount = parseInt($(".checkedCount").html());
        if (ContactSelectedCount <= 0) {
            ShowErrorMessage(GlobalErrorList.Leads.contactselecterror);
            HidePageLoading();
            return false;
        }
        $("#deletebulklmsleads").modal('show');
        HidePageLoading();
    },
    DeleteMultipleLeadsModalHide: function () {
        $("#deletebulklmsleads").modal('hide');
        LmsDefaultFunctionUtil.ClearAllCheckboxDivValues();
        HidePageLoading();
    },
    DeleteMultipleLeads: function () {
        ShowPageLoading();
        //var ContactInfo = new Array();
        var LmsGroupMemberID = new Array();
        $(".selChk:checked").each(function () {
            LmsGroupMemberID.push(parseInt($(this).val()));
        });
        if (LmsGroupMemberID.length > 0) {
            $.ajax({
                url: "/Prospect/Leads/DeleteSelectedLeads",
                type: 'POST',
                data: JSON.stringify({ 'accountId': Plumb5AccountId, 'LmsGroupMemberID': LmsGroupMemberID }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) {
                    if (response)
                        LeadsUtil.HideDeletedLead(response);
                    else {
                        ShowErrorMessage(GlobalErrorList.Leads.BulkDeleteFailureStatus);
                        return false;
                    }
                    HidePageLoading();
                },
                error: ShowAjaxError
            });
        }
        HidePageLoading();
        LmsDefaultFunctionUtil.ClearAllCheckboxDivValues();
    },
    HideDeletedLead: function (response) {
        if (response.Status) {
            for (var i = 0; i < response.leads.length; i++) {
                --CurrentRowCount;
                --TotalRowCount;
                $("#ui_div_" + response.leads[i]).hide("slow");
            }
            PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);
            ShowSuccessMessage(GlobalErrorList.Leads.BulkDeleteSuccessStatus);
            if (CurrentRowCount <= 0 && TotalRowCount <= 0) {
                $('.searchCampWrap').hide();
                ShowExportDiv(false);
                ShowPagingDiv(false);
                SetNoRecordContent('ui_tblReportData', 7, 'ui_tbodyReportData');
            }
        }
    },
    ShowAssignMultipleLeadPopUp: function () {
        ShowPageLoading();
        var ContactSelectedCount = parseInt($(".checkedCount").html());
        if (ContactSelectedCount <= 0) {
            ShowErrorMessage(GlobalErrorList.Leads.contactselecterror);
            HidePageLoading();
            return false;
        }
        $(".popuptitle h6").html("ASSIGN LEAD");
        $("#dv_AssignSalesPerson").removeClass("hideDiv");
        $(".popupsubtitle").html("");
        $("#ui_ddlUserList").val(0);
        HidePageLoading();
    },
    ValidateAssignMultipleLead: function () {
        if ($(".selChk:checked").length === 0) {
            ShowErrorMessage(GlobalErrorList.Leads.selectleads);
            HidePageLoading();
            return false;
        }

        if (parseInt($("#ui_ddlUserList").val()) === 0) {
            ShowErrorMessage(GlobalErrorList.Leads.AssignLeadSelectionError);
            HidePageLoading();
            return false;
        }

        return true;
    },
    AssignMultipleLead: function () {
        ShowPageLoading();
        if (!LeadsUtil.ValidateAssignMultipleLead()) {
            HidePageLoading();
            return false;
        }
        var LeadList = [];
        LeadList = LmsDefaultFunctionUtil.GetSelectedLmsGroupMemberIds();
        var UserInfoUserId = parseInt($("#ui_ddlUserList" + " option:selected").val());
        //if (leadswithsameagentandgroup.filter(leadswithsameagentandgroup => lmscontactuseridgroupid.includes(leadswithsameagentandgroup))) {
        //    $("#lmsAssignLead").modal('hide');
        //    HidePageLoading();
        //    ShowErrorMessage(GlobalErrorList.Leads.Multi_Alreadyleadassigned);
        //    return false;
        //}
        if (LeadList.length > 0) {
            $.ajax({
                url: "/Prospect/Leads/BulkAssignSalesPerson",
                type: 'POST',
                data: JSON.stringify({ 'accountId': Plumb5AccountId, 'LmsGroupMemberId': LeadList, 'UserInfoUserId': UserInfoUserId }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) {
                    if (response.Status) {
                        LeadsUtilGeneralFunction.BindUpdatedHandledBy(LeadList, UserInfoUserId);
                        ShowSuccessMessage(response.TotalAssignmentDone + GlobalErrorList.Leads.AssignLeadSuccessStatus);
                    }
                    else {
                        ShowErrorMessage(GlobalErrorList.Leads.AssignLeadFailureStatus);
                    }
                    LmsDefaultFunctionUtil.HideCustomPopUp("dv_AssignSalesPerson");
                    HidePageLoading();
                },
                error: ShowAjaxError
            });
        }
        LmsDefaultFunctionUtil.ClearAllCheckboxDivValues();
    },
    ShowAssignMultipleStagePopUp: function () {
        ShowPageLoading();
        var ContactSelectedCount = parseInt($(".checkedCount").html());
        if (ContactSelectedCount <= 0) {
            ShowErrorMessage(GlobalErrorList.Leads.contactselecterror);
            HidePageLoading();
            return false;
        }
        $(".popuptitle h6").html("ASSIGN STAGE");
        $("#dv_AssignStage").removeClass("hideDiv");
        $(".popupsubtitle").html("");
        $("#ui_dllStageSort_Assign").val(-1);
        HidePageLoading();
    },
    ValidateAssignMultipleStage: function () {
        if (parseInt($("#ui_dllStageSort_Assign").val()) === -1) {
            ShowErrorMessage(GlobalErrorList.Leads.AssignStageSelectionError);
            HidePageLoading();
            return false;
        }

        if ($(".selChk:checked").length === 0) {
            ShowErrorMessage(GlobalErrorList.Leads.selectleads);
            HidePageLoading();
            return false;
        }

        return true;
    },
    AssignMultipleStage: function () {
        ShowPageLoading();
        if (!LeadsUtil.ValidateAssignMultipleStage()) {
            HidePageLoading();
            return false;
        }

        var LeadList = [];
        var LeadIds = LmsDefaultFunctionUtil.GetSelectedLmsGroupMemberIds();

        //if (leadswithsameagentandgroup.includes(contactId + "_" + LmsGroupId + "_" + $("#ui_drpdwn_AssignLead").val())) {
        //    $("#lmsAssignLead").modal('hide');
        //    ShowErrorMessage(GlobalErrorList.Leads.Alreadyleadassigned);
        //    return false;
        //}
        for (var i = 0; i < LeadIds.length; i++) {
            if ($.trim($("#ui_txtStage_" + LeadIds[i] + "").text()) != 'Closed Won') {
                var lead = new Object();
                lead.LmsGroupmemberId = LeadIds[i];
                lead.Score = parseInt($("#ui_dllStageSort_Assign" + " option:selected").val());
                LeadList.push(lead);
            }
        }
        if (LeadList.length > 0) {
            $.ajax({
                url: "/Prospect/Leads/BulkStageUpdate",
                type: 'POST',
                data: JSON.stringify({ 'accountId': Plumb5AccountId, 'mlContacts': LeadList }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) {
                    if (response.Status) {
                        LeadsUtilGeneralFunction.BindUpdatedStageDetails(LeadList, response.BulkUserInfoUserIds);
                        ShowSuccessMessage(GlobalErrorList.Leads.AssignStageSuccessStatus);
                    }
                    else {
                        ShowErrorMessage(GlobalErrorList.Leads.AssignStageFailureStatus);
                    }

                    LmsDefaultFunctionUtil.HideCustomPopUp("dv_AssignStage");
                },
                error: ShowAjaxError
            });
        }
        HidePageLoading();
        LmsDefaultFunctionUtil.ClearAllCheckboxDivValues();
    },
    ShowMasterFilterPopUp: function () {
        $(".popuptitle h6").html("MASTER FILTER");
        //$('[id^="trsearch"]:not(:first)').remove();
        /*LmsCustomReportPopUpUtil.ClearFields();*/
        $('#dvAddOrUpdateReports').removeClass("hideDiv");
        if (window.location.href.toLowerCase().indexOf("/prospect/followups") > 0 )
            $("#savereport").addClass("hideDiv");
        HidePageLoading();
    },
    ShowMultipleAddFollowPopUp: function () {
        ShowPageLoading();
        var ContactSelectedCount = parseInt($(".checkedCount").html());
        if (ContactSelectedCount <= 0) {
            ShowErrorMessage(GlobalErrorList.Leads.contactselecterror);
            HidePageLoading();
            return false;
        }

        $("#div_EditFollowupNote").removeClass("hideDiv");
        $('.LeadTab').addClass("hideDiv");
        $('.popupsubtitle').html("");
        $(".lmsedittabitem ").removeClass("active");
        $("#tabLead").addClass("active");
        $(".editlmstabscont").addClass("hideDiv");
        $("#editleadtabscontent").removeClass("hideDiv");
        $("#ui_divContactPopUp").css({ "margin-top": "55px", "background": "transparent" });
        $(".lmsedittabwrap").addClass("hideDiv");
        LeadReportBindingUtil.EditFollowUpNoteDetails(0, "", "", 0);
        $('#tabFollowup').click();

        $(".dropdown-menu").removeClass("show");
        $(".popuptitle h6").html("ADD FOLLOW-UP");
        $(".popuptitle ").removeClass("hideDiv");
        $(".popupsubtitle").html("");
        $("#txtFollowUpSalesPerson").val(0);
        $("#txtFollowUpDate,#txtFollowUpContent,#ui_setRemainderEmailId,#ui_setRemainderPhoneNumber,#ui_remainderdate").val("");
        $("#ui_ddl_FollowUpTime,#ui_remainderdateTime").val("10:00");
        $("#lmsagntrememl,#lmsagntremsms,#lmsagntremboth").prop("checked", false);
        if ($("#ui_setremainderDiv").is(":checked")) {
            $("#ui_setremainderDiv").click();
        }
        HidePageLoading();
    },
    QuickFilterByStage: function () {
        if ($("#ui_dllStageSort option:selected").val() > -1) {
            ShowPageLoading();
            filterLead.Score = $("#ui_dllStageSort option:selected").val();
            //$("#ui_dllStageSort").select2().val(filterLead.Score);
            OffSet = 0;
            $(".checkedCount").html(0);
            $(".visitorsCount").html(0);
            $(".selchbxall,.selChk").prop("checked", false);
            LeadReportBindingUtil.GetMaxCount();
        }
    },
    QuickFilterBySource: function () {
        ShowPageLoading();
        if ($('#ui_ddlSourceSort').val() != null) {
            var SelectedValues = $('#ui_ddlSourceSort').val();
            filterLead.LmsGroupIdList = SelectedValues.join();
        }
        else {
            filterLead.LmsGroupIdList = "";
        }

        $(".checkedCount").html(0);
        $(".visitorsCount").html(0);
        $(".selchbxall,.selChk").prop("checked", false);
        OffSet = 0;
        LeadReportBindingUtil.GetMaxCount();
    },
    QuickFilterByHandledBy: function () {
        if ($("#ui_dllHandledByUser option:selected").val() > 0) {
            ShowPageLoading();
            filterLead.UserInfoUserId = $("#ui_dllHandledByUser option:selected").val();
            //$("#ui_dllHandledByUser").select2().val(filterLead.UserInfoUserId);
            OffSet = 0;
            $(".checkedCount").html(0);
            $(".visitorsCount").html(0);
            $(".selchbxall,.selChk").prop("checked", false);
            LeadReportBindingUtil.GetMaxCount();
        }
    },
    QuickFilterByLabel: function () {
        if ($("#ui_dllLeadLabel option:selected").val().length > 0 && $("#ui_dllLeadLabel option:selected").val().toLowerCase() != "select") {
            ShowPageLoading();
            filterLead.LeadLabel = $("#ui_dllLeadLabel option:selected").val();
            OffSet = 0;
            $(".checkedCount").html(0);
            $(".visitorsCount").html(0);
            $(".selchbxall, .selChk").prop("checked", false);
            LeadReportBindingUtil.GetMaxCount();
        }
    },
    GetFilterBySearchColumn: function () {
        $.ajax({
            type: "POST",
            url: "/Prospect/Leads/GetIsSearchbyColumn",
            data: JSON.stringify({ 'AccountId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != null && response.length > 0) {
                    $.each(response, function () {
                        let searchColumn = `<a class="dropdown-item searchColumn" propertyname='${this.PropertyName}' displayname='${this.DisplayName}' >${this.DisplayName}</a>`;
                        $("#customDropdownMenu").append(searchColumn);
                    });
                }
            },
            error: ShowAjaxError
        });
    },
    ShowAssignMultipleLabelPopup: function () {
        ShowPageLoading();
        var ContactSelectedCount = parseInt($(".checkedCount").html());
        if (ContactSelectedCount <= 0) {
            ShowErrorMessage(GlobalErrorList.Leads.contactselecterror);
            HidePageLoading();
            return false;
        }
        $("#lmsAssignMulptiplelabel").modal();
        HidePageLoading();

    },
    AssignMultipleLabel: function () {
        ShowPageLoading();
        if ($("#ui_drpdwn_AssignMultipleLabel").val() == 'Select') {
            $("#lmsAssignMulptiplelabel").modal('hide');
            ShowErrorMessage(GlobalErrorList.Leads.AssignLabelSelectionError);
            return false;
        }

        var LeadList = [];
        var LeadIds = LmsDefaultFunctionUtil.GetSelectedLmsGroupMemberIds();
        for (var i = 0; i < LeadIds.length; i++) {

            LeadList.push(LeadIds[i]);

        }
        var LabelValue = $("#ui_drpdwn_AssignMultipleLabel").val();
        if (LeadList.length > 0) {
            $.ajax({
                url: "/Prospect/Leads/UpdateLeadLabel",
                type: 'POST',
                data: JSON.stringify({ 'accountId': Plumb5AccountId, 'LeadLmsGroupMemberList': LeadList, 'LabelValue': LabelValue, 'LmsGroupId': 0 }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) {
                    $("#lmsAssignMulptiplelabel").modal('hide');
                    if (response.Status) {
                        for (var i = 0; i < response.leads.length; i++) {
                            ShowSuccessMessage(GlobalErrorList.Leads.AssignLabelSuccessStatus);
                            $("#ui_div_lblStatus_" + response.leads[i]).empty();
                            var LabelStatusValue = "";
                            if (LabelValue.toLowerCase() == "hot")
                                LabelStatusValue = "<span class='lmslabelhot'>" + LabelValue + "</span><span onclick=\"LeadsReportDetailsUtil.AssignSingleLabelModalShow(" + response.leads[i] + ",'Hot');\" class='icon ion-android-more-vertical lmseditlabel'></span>";
                            else if (LabelValue.toLowerCase() == "warm")
                                LabelStatusValue = "<span class='lmslabelwarm'>" + LabelValue + "</span><span onclick=\"LeadsReportDetailsUtil.AssignSingleLabelModalShow(" + response.leads[i] + ",'Warm');\" class='icon ion-android-more-vertical lmseditlabel'></span>";
                            else if (LabelValue.toLowerCase() == "cold")
                                LabelStatusValue = "<span class='lmslabelcold'>" + LabelValue + "</span><span onclick=\"LeadsReportDetailsUtil.AssignSingleLabelModalShow(" + response.leads[i] + ",'Cold');\" class='icon ion-android-more-vertical lmseditlabel'></span>";
                            $("#ui_div_lblStatus_" + response.leads[i]).html(LabelStatusValue);
                            LmsDefaultFunctionUtil.UpdateUpdatedDate(response.leads[i]);
                        }
                    }
                    else {
                        ShowErrorMessage(GlobalErrorList.Leads.AssignLabelFailureStatus);
                        $("#ui_div_" + contactId).removeClass("activeBgRow");
                        $("#ui_btn_AssignSingleLabel").removeAttr("ContactId");
                        HidePageLoading();
                    }



                },
                error: ShowAjaxError
            });
        }
        HidePageLoading();
        LmsDefaultFunctionUtil.ClearAllCheckboxDivValues();
    }
};

var LeadsUtilGeneralFunction = {
    BindUpdatedHandledBy: function (ContactIdList, UserInfoUserId) {
        if (ContactIdList != null && ContactIdList.length > 0) {
            for (var i = 0; i < ContactIdList.length; i++) {
                $("#ui_div_LeadAgent_" + ContactIdList[i]).empty();
                var userName = LmsDefaultFunctionUtil.GetAgentNameByUserId(UserInfoUserId);
                $("#ui_div_LeadAgent_" + ContactIdList[i]).html(((userName == null) ? "" : (userName.length > 25) ? (userName.substring(0, 25) + "..") : userName));
                $("#ui_i_LeadAgent_" + ContactIdList[i]).attr("onclick", "LeadsReportDetailsUtil.AssignSingleLeadModalShow(" + ContactIdList[i] + "," + UserInfoUserId + ")");
                LmsDefaultFunctionUtil.UpdateUpdatedDate(ContactIdList[i]);
            }
        }
    },
    BindRequiredValuesToArray: function () {
        IsRequiredFieldsValues = ["Name", "LastName"];
    },
    //BindUpdatedStageDetails: function (ContactIdList, BulkUserInfoUserIds) {
    //    if (ContactIdList != null && ContactIdList.length > 0) {
    //        for (var i = 0; i < ContactIdList.length; i++) {
    //            $("#ui_div_LeadStage_" + ContactIdList[i].ContactId).empty();

    //            var sample = JSLINQ(allStageDetails).Where(function () {
    //                return (this.Score == ContactIdList[i].Score);
    //            });

    //            var stagestyle = "", StageName = "";
    //            if (sample.items[0] != null && sample.items[0] != "" && sample.items[0] != undefined) {
    //                StageName = sample.items[0].Stage;
    //                stagestyle = "style='background-color:" + sample.items[0].IdentificationColor + "; color:" + getReadableForeColor(sample.items[0].IdentificationColor) + ";'";
    //            }
    //            $("#ui_div_LeadStage_" + ContactIdList[i].ContactId).html("<span class='lmslblstage' " + stagestyle + " id = 'ui_txtStage_" + ContactIdList[i].ContactId + "' > " + StageName + "</span><span onclick=\"AssignSingleStage(" + ContactIdList[i].ContactId + "," + ContactIdList[i].Score + ");\" class='icon ion-android-more-vertical lmschangestage'></span>");

    //            if (parseInt(BulkUserInfoUserIds[i]) > 0) {
    //                $("#ui_div_LeadAgent_" + ContactIdList[i].ContactId).empty();
    //                var userName = LmsDefaultFunctionUtil.GetAgentNameByUserId(UserInfoUserId);
    //                $("#ui_div_LeadAgent_" + ContactIdList[i].ContactId).html(((userName == null) ? "" : (userName.length > 25) ? (userName.substring(0, 25) + "..") : userName));
    //                $("#ui_i_LeadAgent_" + ContactIdList[i].ContactId).attr("onclick", "LeadsReportDetailsUtil.AssignSingleLeadModalShow(" + ContactIdList[i].ContactId + "," + UserInfoUserId + ")");
    //            }

    //            LmsDefaultFunctionUtil.UpdateUpdatedDate(ContactIdList[i].ContactId);
    //        }
    //    }
    //},
    BindUpdatedStageDetails: function (LmsGroupMembersId, BulkUserInfoUserIds) {
        if (LmsGroupMembersId != null && LmsGroupMembersId.length > 0) {
            for (var i = 0; i < LmsGroupMembersId.length; i++) {
                $("#ui_div_LeadStage_" + LmsGroupMembersId[i].LmsGroupmemberId).empty();

                var sample = JSLINQ(allStageDetails).Where(function () {
                    return (this.Score == LmsGroupMembersId[i].Score);
                });

                var stagestyle = "", StageName = "";
                if (sample.items[0] != null && sample.items[0] != "" && sample.items[0] != undefined) {
                    StageName = sample.items[0].Stage;
                    stagestyle = "style='background-color:" + sample.items[0].IdentificationColor + "; color:" + getReadableForeColor(sample.items[0].IdentificationColor) + ";'";
                }
                $("#ui_div_LeadStage_" + LmsGroupMembersId[i].LmsGroupmemberId).html("<span class='lmslblstage' " + stagestyle + " id = 'ui_txtStage_" + LmsGroupMembersId[i].LmsGroupMemberId + "' > " + StageName + "</span><span onclick=\"AssignSingleStage(" + LmsGroupMembersId[i].LmsGroupMemberId + "," + LmsGroupMembersId[i].Score + ");\" class='icon ion-android-more-vertical lmschangestage'></span>");

                if (parseInt(BulkUserInfoUserIds[i]) > 0) {
                    $("#ui_div_LeadAgent_" + LmsGroupMembersId[i].LmsGroupmemberId).empty();
                    var userName = LmsDefaultFunctionUtil.GetAgentNameByUserId(BulkUserInfoUserIds[i]);
                    $("#ui_div_LeadAgent_" + LmsGroupMembersId[i].LmsGroupmemberId).html(((userName == null) ? "" : (userName.length > 25) ? (userName.substring(0, 25) + "..") : userName));
                    $("#ui_i_LeadAgent_" + LmsGroupMembersId[i].LmsGroupmemberId).attr("onclick", "LeadsReportDetailsUtil.AssignSingleLeadModalShow(" + LmsGroupMembersId[i].LmsGroupMemberId + "," + BulkUserInfoUserIds[i] + ")");
                }

                LmsDefaultFunctionUtil.UpdateUpdatedDate(LmsGroupMembersId[i].LmsGroupmemberId);
            }
        }
    },
    DecideOrderByOnChange: function (lmsorderbytext) {
        ShowPageLoading();

        LeadsUtilGeneralFunction.ShowOrderByDiv(lmsorderbytext);

        if (lmsorderbytext == "Created Date")
            filterLead.OrderBy = 0;
        else if (lmsorderbytext == "Updated Date")
            filterLead.OrderBy = 1;
        else if (lmsorderbytext == "Reminder Date")
            filterLead.OrderBy = 2;
        else if (lmsorderbytext == "Inbox")
            filterLead.OrderBy = 3;
        else if (lmsorderbytext == "Planned Follow-Up Date")
            filterLead.OrderBy = 4;
        else if (lmsorderbytext == "Missed Follow-Up Date")
            filterLead.OrderBy = 5;
        else if (lmsorderbytext == "Completed Follow-Up Date")
            filterLead.OrderBy = 6;
        else if (lmsorderbytext == "Non Follow-Up Date")
            filterLead.OrderBy = 7;
        else if (lmsorderbytext == "Non Reminder Date")
            filterLead.OrderBy = 8;
        else if (lmsorderbytext == "Stage Updated Date")
            filterLead.OrderBy = 9;
        else if (lmsorderbytext == "Closure Date")
            filterLead.OrderBy = 10;

        CallBackFunction();
    },
    ShowOrderByDiv: function (lmsorderbytext) {
        $(".filtwrpbar").removeClass("hideDiv");
        $(".subdivWrap").addClass("showDiv");
        $(".filttypetext").html("Order By: " + lmsorderbytext);
        $(".checkedCount").html(0);
        $(".visitorsCount").html(0);
        $(".selchbxall,.selChk").prop("checked", false);
    },
    RemoveOrderByDiv: function () {
        $(".filtwrpbar").addClass("hideDiv");
        $(".filttypetext").html("");
        $(".checkedCount").html(0);
        $(".visitorsCount").html(0);
        $(".selchbxall,.selChk").prop("checked", false);
        LeadsUtilGeneralFunction.HideFullFilterDiv();
        OffSet = 0;
        filterLead.OrderBy = 3;
        CallBackFunction();
        //LeadReportBindingUtil.GetMaxCount();
    },
    HideFullFilterDiv: function () {
        if ($(".lmssourcefilterwrp").hasClass("hideDiv") && $(".lmsstagefilterwrp").hasClass("hideDiv") && $(".lmshandledfilterwrp").hasClass("hideDiv") && $(".lmslabelfilterwrp").hasClass("hideDiv") && $(".filtwrpbar").hasClass("hideDiv") && $('.selChk').filter(':checked').length <= 0) {
            $(".subdivWrap").removeClass("showDiv");
        }
    },
    OnCloseOfQuickFilter: function () {
        ShowPageLoading();
        $("#lmsallsources").val("select");
        $(".checkedCount").html(0);
        $(".visitorsCount").html(0);
        $(".selchbxall,.selChk").prop("checked", false);
        LeadsUtilGeneralFunction.HideFullFilterDiv();
        LeadReportBindingUtil.GetMaxCount();
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
            SearchKeyword: "", PageUrl: "", ReferrerUrl: "", IsAdSenseOrAdWord: null, Place: "", CityCategory: ""
        };
        OffSet = 0;

        filterLead.OrderBy = 3;
        if (window.location.href.toLowerCase().indexOf("/prospect/followups/missedfollowups") > 0)
            filterLead.OrderBy = 5;
          if (window.location.href.toLowerCase().indexOf("/prospect/followups/completedfollowups") > 0)
            filterLead.OrderBy = 5;
         if (window.location.href.toLowerCase().indexOf("/prospect/followups") > 0)
            filterLead.OrderBy = 4;
           
        CallBackFunction();
    },
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
    }
};

$("#lmsallsources").change(function () {
    LeadsUtil.QuickFilterBySelect();
});

//$(".selchbxall").click(function () {
//    LeadsUtil.SelectAllCheckBoxClick();
//});

var chkArrayContactId = new Array();
var PresentContactGroupId = new Array();
$("#addtogroup").click(function () {
    LeadsUtil.AddOrRemoveFromGroup();
    LmsDefaultFunctionUtil.ClearAllCheckboxDivValues();
})

$("#addremovegroupslist").click(function () {
    $('#addgroupoperation').select2({
        minimumResultsForSearch: '',
        dropdownAutoWidth: false
    });
});

$(".lmsuserdelbulkpopus").click(function () {
    LeadsUtil.DeleteMultipleLeadsModalShow();
});

$("#cancelBulkLeads").click(function () {
    LeadsUtil.DeleteMultipleLeadsModalHide();
});

$("#deleteBulkLeads").click(function () {
    LeadsUtil.DeleteMultipleLeads();
});

$("#btn_AssignSalesPerson").click(function () {
    LeadsUtil.AssignMultipleLead();
});

$("#btn_AssignStage").click(function () {
    LeadsUtil.AssignMultipleStage();
});

$(".lmsorderbymenu").click(function () {
    var lmsorderbytext = $(this).attr("data-ordername");
    LeadsUtilGeneralFunction.DecideOrderByOnChange(lmsorderbytext);
});

$('#ui_ddlSMSTemplate, #ui_dllStageSort, #ui_dllHandledByUser, #ui_dllLeadLabel, #ui_ddlMailTemplate, .filterdrpdwonn').select2({
    minimumResultsForSearch: '',
    dropdownAutoWidth: false,
    containerCssClass: "border-0"
});

$('#ui_btnShowCreateLead').click(function () {
    createandupdatebuttondisable = true;
    $('#ui_btn_SubmitCreateContact').attr("BindType", "NEW");
    $('#mainTab').html("Create Lead");
    $('.LeadTab').addClass("hideDiv");
    $('.popupsubtitle').html("");
    //$("#ui_divContactPopUp").removeClass("hideDiv");
    $(".lmsedittabitem ").removeClass("active");
    $("#tabLead").addClass("active");
    $(".editlmstabscont").addClass("hideDiv");
    $("#editleadtabscontent").removeClass("hideDiv");
    $("#ui_divContactPopUp").css({ "margin-top": "55px", "background": "transparent" });
    LeadReportBindingUtil.EditFollowUpNoteDetails(0, "", "", 0);
    $(".lmsedittabwrap").addClass("hideDiv");
    $("#dv_verifyemail").removeClass("hideDiv");
    $("#ui_isemail_No").prop("checked", true);

    var sampleitems = JSLINQ(ContactPropertyList).Where(function () {
        return (this.PropertyName == "LmsGroupId");
    });

    if (sampleitems != undefined && sampleitems != "" && sampleitems.items.length > 0) {
        var lmsId = sampleitems.items[0].PropertyId;

        if ($("#ui_ContactElement_st_" + lmsId + "").get(0).selectedIndex != 2 && !$("#dvSource").hasClass("hideDiv")) {
            if ($("[id^=ui_ContactElement_st_]", document).length) {
                $("[id^=ui_ContactElement_st_]", document).prop("selectedIndex", 0).val();
                $("[id^=ui_ContactElement_st_]", document).trigger('change');
                $('[id^=ui_lmsContactElement]').val('');
            }
        }
    }

    $("#ui_btn_SubmitCreateContact").html("Create Lead");
    GetLmssourcetype();
    //if (ContactPropertyList != undefined && ContactPropertyList != null && ContactPropertyList.length > 0) {
    //    for (var i = 0; i < ContactPropertyList.length; i++) {
    //        if (ContactPropertyList[i].FieldType == 3) {
    //            if (ContactPropertyList[i].PropertyName.toLocaleLowerCase() == "userinfouserid") {
    //                $("#ui_ContactElement" + ContactPropertyList[i].PropertyId).prop("disabled", false);
    //            }
    //        }
    //    }
    //}
});

$(".addcalend").datepicker({
    prevText: "click for previous months",
    nextText: "click for next months",
    showOtherMonths: true,
    selectOtherMonths: false,
});

$("#txtlmsclosuredate").datepicker({
    minDate: 0,
    prevText: "click for previous months",
    nextText: "click for next months",
    showOtherMonths: true,
    selectOtherMonths: false,
});


$("#btnCloseAddRemovegrp, #btnCancelAddRemovegrp").click(function () {
    $("#addremovegroup").modal('hide');
    LmsDefaultFunctionUtil.ClearAllCheckboxDivValues();
    HidePageLoading();
});

$(".filtwrpbar .ion-android-close").click(function () {
    LeadsUtilGeneralFunction.RemoveOrderByDiv();
});

$("#btnClearValues").click(function () {
    LeadsUtilGeneralFunction.ResetQuickFilter();
    LeadsUtilGeneralFunction.ResetMasterFilter();
});

$("#btnMasterFilter").click(function () {
    LeadsUtil.ShowMasterFilterPopUp();
});

$("#btnAddToGroup").click(function () {
    var Validate = 0;
    ShowPageLoading();
    var contactDetails = {
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

    for (var i = 0; i < Fields.length; i++) {
        var IdentiferValue = "";

        if (Fields[i].CustomFieldName != null && Fields[i].CustomFieldName != "" && Fields[i].CustomFieldName.length > 0)
            IdentiferValue = Fields[i].CustomFieldName;
        else
            IdentiferValue = Fields[i].FieldName;

        for (var a = 0; a < ContactPropertyList.length; a++) {
            if (ContactPropertyList[a].FrontEndName == IdentiferValue) {
                IdentiferValue = ContactPropertyList[a].P5ColumnName;
                break;
            }
        }

        if (Fields[i].FieldType == 'Boolean') {
            if ($('#ui_rdbtn' + IdentiferValue + '').prop('checked')) {
                Validate = 1;
                break;
            }
        }
        else if (Fields[i].FieldType == 'enum') {
            var BindingType = "";

            if (IsRequiredFieldsValues != null && IsRequiredFieldsValues.length > 0) {
                for (var s = 0; s < IsRequiredFieldsValues.length; s++) {
                    if (IsRequiredFieldsValues[s] == IdentiferValue) {
                        BindingType = "EmptyTextBox";
                        break;
                    }
                }
            }

            if (BindingType != null && BindingType != "" && BindingType == "EmptyTextBox") {
                if ($('#ui_txt' + IdentiferValue + '').val() != '') {
                    Validate = 1;
                    break;
                }
            }
            else {
                if ($('#ui_ddl' + IdentiferValue + '').val() != '-1') {
                    Validate = 1;
                    break;
                }
            }
        }
        else if (Fields[i].FieldType == 'String' || Fields[i].FieldType == 'Int32' || Fields[i].FieldType == 'DateTime') {
            if ($('#ui_txt' + IdentiferValue + '').val() != '') {
                Validate = 1;
                break;
            }
        }
    }

    if ($("#ui_dllStageSort option:selected").val() > -1 || $("#ui_dllHandledByUser option:selected").val() > 0 || $("#ui_ddlSourceSort option:selected").val() > 0) {
        Validate = 1;
    }

    if (Validate == 0) {
        ShowErrorMessage(GlobalErrorList.Leads.filtercontact_error);
        HidePageLoading();
        return;
    }

    //Fetching AddContact Div Field Values
    for (var i = 0; i < Fields.length; i++) {

        var IdentiferValue = "";

        if (Fields[i].CustomFieldName != null && Fields[i].CustomFieldName != "" && Fields[i].CustomFieldName.length > 0)
            IdentiferValue = Fields[i].CustomFieldName;
        else
            IdentiferValue = Fields[i].FieldName;

        for (var a = 0; a < ContactPropertyList.length; a++) {
            if (ContactPropertyList[a].FrontEndName == IdentiferValue) {
                IdentiferValue = ContactPropertyList[a].P5ColumnName;
                break;
            }
        }

        if (Fields[i].FieldType == "String" || Fields[i].FieldType == 'Int32' || Fields[i].FieldType == 'DateTime')
            contactDetails["" + IdentiferValue + ""] = $('#ui_txt' + IdentiferValue + '').val();

        if (Fields[i].FieldType == 'enum') {

            var BindingType = "";

            if (IsRequiredFieldsValues != null && IsRequiredFieldsValues.length > 0) {
                for (var s = 0; s < IsRequiredFieldsValues.length; s++) {
                    if (IsRequiredFieldsValues[s] == IdentiferValue) {
                        BindingType = "EmptyTextBox";
                        break;
                    }
                }
            }

            if (BindingType != null && BindingType != "" && BindingType == "EmptyTextBox")
                contactDetails["" + IdentiferValue + ""] = $('#ui_txt' + IdentiferValue + '').val();
            else if ($('#ui_ddl' + IdentiferValue + ' option:selected').val() > -1)
                contactDetails["" + IdentiferValue + ""] = $('#ui_ddl' + IdentiferValue + ' option:selected').text();
        }

        if (Fields[i].FieldType == 'Boolean')
            contactDetails["" + IdentiferValue + ""] = $(($("input[type='radio'][name='" + IdentiferValue + "']:checked"))[0]).val() == 1 ? true : false;
    }

    if (contactDetails.Unsubscribe != null) {
        if (contactDetails.Unsubscribe == "True")
            contactDetails.Unsubscribe = 1;
        else if (contactDetails.Unsubscribe == "False")
            contactDetails.Unsubscribe = 0;
        else if (contactDetails.Unsubscribe == "NA")
            contactDetails.Unsubscribe = 2;
    }

    if ($("#ui_dllStageSort option:selected").val() > -1)
        filterLead.Score = $("#ui_dllStageSort option:selected").val();
    if ($("#ui_dllHandledByUser option:selected").val() > 0)
        filterLead.UserInfoUserId = $("#ui_dllHandledByUser option:selected").val();
    if ($("#ui_ddlSourceSort option:selected").val() > 0)
        filterLead.LmsGroupId = $("#ui_ddlSourceSort option:selected").val();

    setTimeout(function () { $("#dv_FilterContacts").addClass("hideDiv"); }, 1500);

    OffSet = 0;
    LeadReportBindingUtil.GetMaxCount();
});

$("#ui_dllStageSort").change(function () {
    LeadsUtil.QuickFilterByStage();
});

$("#ui_dllHandledByUser").change(function () {
    LeadsUtil.QuickFilterByHandledBy();
});

$("#ui_dllLeadLabel").change(function () {
    LeadsUtil.QuickFilterByLabel();
});

$("#ui_ddlSourceSort").change(function () {
    LeadsUtil.QuickFilterBySource();
});

$("#btnCloseFilterLabel").click(function () {
    $(this).parent().parent().addClass("hideDiv");
    filterLead.LeadLabel = "";
    $("#ui_dllLeadLabel").select2().val("select").trigger('change');
    LeadsUtilGeneralFunction.OnCloseOfQuickFilter();
});

$("#btnCloseHandledByUser").click(function () {
    $(this).parent().parent().addClass("hideDiv");
    filterLead.UserInfoUserId = 0;
    $("#drp_handledBy").val(0);
    $("#ui_dllHandledByUser").select2().val(0).trigger('change');
    LeadsUtilGeneralFunction.OnCloseOfQuickFilter();
});

$("#btnCloseStageSort").click(function () {
    $(this).parent().parent().addClass("hideDiv");
    filterLead.Score = -1;
    $("#ui_dllStageSort").select2().val(-1).trigger('change');
    LeadsUtilGeneralFunction.OnCloseOfQuickFilter();
});

$("#btnCloseSourceSort").click(function () {
    $(this).parent().parent().addClass("hideDiv");
    filterLead.LmsGroupIdList = "";
    $('#ui_ddlSourceSort').selectpicker("deselectAll", true).selectpicker("refresh");
    LeadsUtilGeneralFunction.OnCloseOfQuickFilter();
});

$("#ui_i_filterClose").click(function () {
    $(this).addClass("hideDiv");
    $(this).prev().removeClass("hideDiv");
    LeadsUtilGeneralFunction.ResetMasterFilter();
});

var phoneNumberCheck = false;
$(document).on("click", ".searchColumn", function () {
    let displayname = $(this).attr("displayname");
    let propertyname = $(this).attr("propertyname");
    if (propertyname.toLowerCase() === "phonenumber") {
        phoneNumberCheck = true;
    } else {
        phoneNumberCheck = false;
    }
    $("#txt_searchemailphone").val("");
    $("#txt_searchemailphone").attr("placeholder", `Search by ${displayname}`);
    $("#txt_searchemailphone").attr("propertyname", `${propertyname}`);
    $("#txt_searchemailphone").attr("displayname", `${displayname}`);
});
$("#ui_btn_AssignMultipleLabel").click(function (e) {
    LeadsUtil.AssignMultipleLabel();

});
function GetLmssourcetype() {
    $.ajax({
        url: "/Prospect/LeadSource/GetLmsSorceType",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            var data = response[0];
            if (data !== undefined) {
                $('.addsourceType').val(data.Type).trigger('change');;
            }
        },
        error: function (error) {
            HidePageLoading();
        }
    });
}
