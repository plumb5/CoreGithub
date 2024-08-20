var Group = { Id: 0, Name: "", GroupDescription: "", DisplayInUnscubscribe: false, GroupType: 0 };
var GroupDetails = new Array();
var getgrouptypeval = '', getgroupNameval = '';
var validationprogress = 0;
var currentTotalRow = 0;
var MembersOffSet = 0;
var MemebersFetchNext = 0;
var MembersTotalRowCount = 0;
var membersgroupid = 0;

var contactDetails = {
    Name: "", LastName: "", Education: "", Gender: "", Occupation: "", MaritalStatus: "",
    Location: "", Interests: "", UtmTagSource: "", FirstUtmMedium: "", FirstUtmCampaign: "", FirstUtmTerm: "", FirstUtmContent: "", Unsubscribe: null,
    OptInOverAllNewsLetter: 0, IsSmsUnsubscribe: null, SmsOptInOverAllNewsLetter: 0, AccountType: "",
    AccountOpenedSource: "", LastActivityLoginDate: null, LastActivityLoginSource: "",
    CustomerScore: 0, AccountAmount: 0, IsCustomer: null, IsMoneyTransferCustomer: null, IsReferred: null, IsGoalSaver: null, IsReferredOpenedAccount: null,
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

var ContactEmailValidationOverView = { Id: 0, GroupId: 0, IsCompleted: 0, ErrorMessage: "", CreatedDate: "", ServerNode: "", file_id: "", file_name: "", status: " ", unique_emails: "", updated_at: "", percent: 0, verified: 0, unverified: 0, ok: 0, catch_all: 0, disposable: 0, invalid: 0, unknown: 0, reverify: 0, estimated_time_sec: 0, UpdateDate: "", Name: "" };

var datePickerOptions = {
    prevText: "click for previous months",
    nextText: "click for next months",
    showOtherMonths: true,
    selectOtherMonths: false
};

$(document).ready(function () {
    ExportFunctionName = "GroupExport";
    $("#ui_ddl_ExportDataRange option[value=1]").remove();
    $("#ui_ddl_ExportDataRange option[value=2]").remove();
    $("#ui_divExportInput").removeClass("hideDiv");
    $("#ui_smallSpecialRangeNote").removeClass("hideDiv");
    BindGroupName();

    setTimeout(function () {
        StartDataExport = StartGroupDataExport;
    }, 5000);

    CallBackFunction();
});

function CallBackFunction() {
    ShowPageLoading();
    TotalRowCount = 0;
    CurrentRowCount = 0;
    MaxCount();
}

function CallBackPaging() {
    ShowPageLoading();
    CurrentRowCount = 0;
    GetReport();
}

function MaxCount() {
    ShowPageLoading();
    Group.Name = $("#ui_txtSearchBy").val();
    $.ajax({
        url: "/ManageContact/Group/GetGroupReportCount",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'group': Group }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            TotalRowCount = response.returnVal;
            $('#TotalGroupCount').text(TotalRowCount);
            if (TotalRowCount > 0) {
                GetReport();
            }
            else {
                SetNoRecordContent('ui_tblReportData', 5, 'ui_tbodyReportData');
                HidePageLoading();
            }
        },
        error: ShowAjaxError
    });
}

function GetReport() {
    FetchNext = GetNumberOfRecordsPerPage();
    $.ajax({
        url: "/ManageContact/Group/BindGroupDetails",
        type: 'POST',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'group': Group, 'OffSet': OffSet, 'FetchNext': FetchNext }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: BindReport,
        error: ShowAjaxError
    });
}

function BindReport(response) {
    SetNoRecordContent('ui_tblReportData', 5, 'ui_tbodyReportData');
    if (response != undefined && response != null && response.length > 0) {

        CurrentRowCount = response.length;
        PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);
        GroupDetails.push(response);
        var reportTableTrs, groupName, VerifiedContactPercentage, iconclass, progressbarclass, groupFullName, dVSegementationBuilder = "";
        $.each(response, function () {
            groupName = this.Name;
            groupFullName = this.Name;
            if (groupName.length > 40) {
                groupName = groupName.substring(0, 40) + "..";
            }
            //Segment builder icon option
            if (this.GroupType == 2)
                dVSegementationBuilder = "<div class='opticnwrp'><a href ='/SegmentBuilder/CreateSegment?GroupId=" + this.Id + "'><i class='icon ion-android-options'></i></a></div>";
            else
                dVSegementationBuilder = "";

            VerifiedContactPercentage = Math.round((parseInt(this.Verified) / parseInt(this.Total)) * 100);
            VerifiedContactPercentage = isNaN(VerifiedContactPercentage) ? 0 : parseInt(VerifiedContactPercentage);

            if (VerifiedContactPercentage == 100)
                progressbarclass = 'progress-bar bg-success';
            else if (VerifiedContactPercentage == 0)
                progressbarclass = 'progress-bar bg-light';
            else
                progressbarclass = 'progress-bar bg-success';

            reportTableTrs +=
                "<tr>" +
                "<td>" +
                "<div class='custom-control custom-checkbox'>" +
                "<input type='checkbox' class='custom-control-input selChk' value=" + this.Id + " id='grp_" + this.Id + "'>" +
                "<label class='custom-control-label' for='grp_" + this.Id + "'></label>" +
                "</div>" +
                "</td>" +
                "<td class='text-left h-100'><div class='groupnamewrap'><div class='nameTxtWrap' title='" + groupFullName + "'><a href ='/ManageContact/Contact?GroupId=" + this.Id + "&GroupName=" + groupFullName + "' class='nameTxt'>" + groupName + "</a></div>" +
                "<div class='tddropmenuWrap df-ac'>" +
                "" + dVSegementationBuilder + "" +
                "<div class='dropdown' >" +
                "<button type='button' class='verticnwrp' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'><i class='icon ion-android-more-vertical mr-0'></i></button>" +
                "<div class='dropdown-menu dropdown-menu-right' aria-labelledby='filterbycontacts' data-groupId='" + this.Id + "'  data-verifieds='" + VerifiedContactPercentage + "' data-total='" + this.Total + "' data-verified='" + this.Verified + "'>" +
                "<a data-grouptype='groupedit' data-groupId=" + this.Id + " data-type=" + this.GroupType + " class='dropdown-item ContributePermission'  href ='javascript:void(0)'>Edit</a>" +
                "<a data-grouptype='groupduplicate' data-groupId=" + this.Id + " class='dropdown-item ContributePermission' href ='javascript:void(0)'>Duplicate</a > " +
                "<a data-grouptype='groupvalidate' class='dropdown-item ContributePermission' href ='javascript:void(0)'>Validate</a > " +
                "<a  data-toggle='modal' data-target='#Autoemailvalidategroups' data-grouptype='Autoemailvalidate'  class='dropdown-item FullControlPermission' href='javascript:void(0)'>Not opted for Validation</a>" +
                "<a data-grouptype='groupmembercounts' class='dropdown-item ContributePermission' href ='javascript:void(0)'>Date Wise Members Count</a > " +
                "<div class='dropdown-divider'></div > " +
                "<a data-grouptype='groupviewcontacts' class='dropdown-item' href = '/ManageContact/Contact?GroupId=" + this.Id + "&GroupName=" + groupFullName + "' > View Contacts</a > " +
                "<a data-toggle='modal' data-target='#exportcontacts' data-grouptype='groupexport' class='dropdown-item ContributePermission' href = 'javascript:void(0)'>Export Contacts</a>" +
                "<a data-toggle='modal' data-target='#ui_divExclusiveContact' data-grouptype='groupexclusive' class='dropdown-item ContributePermission' href='javascript:void(0)'>Exclusive Contact List</a>" +
                "<a data-grouptype='createcntrlgroup' class='dropdown-item' href='javascript: void(0);' data-groupname='" + groupFullName + "' data-groupId='" + this.Id + "' data-total='" + this.Total + "'>Create Control Group</a>" +
                "<a data-grouptype='groupviewcontacts' class='dropdown-item' href = 'javascript: void(0);' onclick='CopyGroupId(" + this.Id + ")' > Copy GroupId</a > " +
                "<div class='dropdown-divider'></div>" +
                "<a data-toggle='modal' data-target='#deletegroups' data-grouptype='groupDelete' class='dropdown-item FullControlPermission' href='javascript:void(0)'>Delete</a>" +
                "</div>" +
                "</div>" +
                "</div>" +
                "</td > " +
                "<td>" + this.GroupDescription + "</td>" +
                "<td>" + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(this.CreatedDate)) + "</td>" +
                "<td><div class='verifiedgroup' group-name='" + groupFullName + "' data-groupId=" + this.Id + "><i class='icon ion-ios-information' title='Click to see details'></i><div id='ui_div_verfiedgroupdetails_" + this.Id + "'  class='progress w-100 ml-3'><div class='" + progressbarclass + "' role='progressbar'' style='width:" + VerifiedContactPercentage + "%' 'aria-valuenow='0' aria-valuemin='0' aria-valuemax='100'>" + VerifiedContactPercentage + "%</div></div><i style='font-size: 20px;margin-left: 10px; cursor: pointer;' class='icon ion-ios-refresh-empty iconBrd - lft' title='Refresh'   onclick='Getemailverfiedcounts(" + this.Id + ");' id='btnRefereshValidation'></i></div></td>" +
                "</tr>";
        });
        $("#ui_tblReportData").removeClass('no-data-records');
        $("#ui_tbodyReportData").html(reportTableTrs);
        ShowExportDiv(true);
        RowCheckboxClick();
        $('.searchWrap').show();
    }
    else {
        $('.searchWrap').hide();
        ShowExportDiv(false);
        ShowPagingDiv(false);
    }
    HidePageLoading();
    CheckAccessPermission("ManageContact");
}

$("#btnAddToGroup").click(function () {
    var GroupDetailsObject = new Object();
    if (CleanText($("#ui_txtGrpName").val()).length == 0) {
        ShowErrorMessage(GlobalErrorList.Manage_Group.name_error);
        $("#ui_txtGrpName").focus();
        return;
    }
    if (CleanText($("#ui_txtGrpDescription").val()).length == 0) {
        ShowErrorMessage(GlobalErrorList.Manage_Group.description_errorr);
        $("#ui_txtGrpDescription").focus();
        return;
    }
    GroupDetailsObject.Id = $("#btnAddToGroup").attr("GroupId");
    GroupDetailsObject.Name = CleanText($("#ui_txtGrpName").val());
    GroupDetailsObject.GroupDescription = CleanText($("#ui_txtGrpDescription").val());

    var Validate = 0;//Validation for AddContact div Fields
    if ($('#addcontactcheck').is(":checked")) {
        if ($('#ui_txtStartCount').val() == '') {
            ShowErrorMessage(GlobalErrorList.Manage_Group.startcount_error);
            return;
        }
        if (parseInt($('#ui_txtStartCount').val()) < 0) {
            ShowErrorMessage(GlobalErrorList.Manage_Group.startcountgreaterthanzero_error);
            return;
        }
        if ($('#ui_txtEndCount').val() == '') {
            ShowErrorMessage(GlobalErrorList.Manage_Group.endcount_error);
            return;
        }
        if (parseInt($('#ui_txtEndCount').val()) <= 0) {
            ShowErrorMessage(GlobalErrorList.Manage_Group.endcountgreaterthanzero_error);
            return;
        }
        if (parseInt($('#ui_txtEndCount').val()) <= parseInt($('#ui_txtStartCount').val())) {
            ShowErrorMessage(GlobalErrorList.Manage_Group.endcountgreaterthanStartCount_error);
            return;
        }

        if ((parseInt($("#ui_txtEndCount").val()) - parseInt($("#ui_txtStartCount").val())) <= 0) {
            ShowErrorMessage(GlobalErrorList.Manage_Group.DifferenceZero);
            return;
        }

        for (var i = 0; i < Fields.length; i++) {

            if (Fields[i].FieldType == 'Boolean') {
                if ($('#ui_rdbtn' + Fields[i].FieldName + '').prop('checked')) {
                    Validate = 1;
                    break;
                }
            }
            else if (Fields[i].FieldType == 'enum') {
                if ($('#ui_ddl' + Fields[i].FieldName + '').val() != '-1') {
                    Validate = 1;
                    break;
                }
            }
            else if (Fields[i].FieldType == 'String' || Fields[i].FieldType == 'Int32' || Fields[i].FieldType == 'DateTime') {
                if ($('#ui_txt' + Fields[i].FieldName + '').val() != '') {
                    Validate = 1;
                    break;
                }
            }
        }

        if (Validate == 0) {
            ShowErrorMessage(GlobalErrorList.Manage_Group.addcontact_error);
            return;
        }

    }

    GroupDetailsObject.DisplayInUnscubscribe = false;
    GroupDetailsObject.GroupType = 1;

    $.ajax({
        url: "/ManageContact/Group/SaveOrUpdateDetails",
        type: 'POST',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'group': GroupDetailsObject }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response != null && response != undefined) {
                if (response.Group.Id > 0) {
                    if ($("#btnAddToGroup").attr('groupid') == 0)
                        ShowSuccessMessage(GlobalErrorList.Manage_Group.groupaddedsuccess_message);
                    else
                        ShowSuccessMessage(GlobalErrorList.Manage_Group.groupupdatedsuccess_message);

                    if (getgrouptypeval == "groupduplicate")
                        DuplicateContactsToNewGroup($("#btnAddToGroup").attr('duplicategroupid'), response.Group.Id);

                    if ($('#addcontactcheck').is(":checked"))
                        SearchAndAddtoGroup(response.Group.Id);
                    ClearAllFields();
                    $(".popupcontainer, #createnewgroup,#Ui_DatewiseMemebersCount").addClass("hideDiv");
                    MaxCount();
                }
                else {
                    ShowErrorMessage(GlobalErrorList.Manage_Group.groupalreadyadded_error);
                }
            }
        }
    });
});


function SearchAndAddtoGroup(GroupId) {
    ShowPageLoading();
    //Fetching AddContact Div Field Values
    for (var i = 0; i < Fields.length; i++) {

        var IdentifierValue = "";

        if (Fields[i].CustomFieldName != null && Fields[i].CustomFieldName != "" && Fields[i].CustomFieldName.length > 0)
            IdentifierValue = Fields[i].CustomFieldName;
        else
            IdentifierValue = Fields[i].FieldName;

        for (var a = 0; a < ContactPropertyList.length; a++) {
            if (ContactPropertyList[a].FrontEndName == IdentifierValue) {
                IdentifierValue = ContactPropertyList[a].P5ColumnName;
                break;
            }
        }

        if (Fields[i].FieldType == "String" || Fields[i].FieldType == 'Int32' || Fields[i].FieldType == 'DateTime')
            contactDetails["" + IdentifierValue + ""] = $('#ui_txt' + IdentifierValue + '').val();

        if (Fields[i].FieldType == 'enum')
            contactDetails["" + IdentifierValue + ""] = $('#ui_ddl' + IdentifierValue + ' option:selected').text();

        if (Fields[i].FieldType == 'Boolean')
            contactDetails["" + IdentifierValue + ""] = $(($("input[type='radio'][name='" + IdentifierValue + "']:checked"))[0]).val() == 1 ? true : false;
    }

    var fromdate = "";
    var todate = "";

    if ($('#ui_txtFromDate').val().length > 0 && $('#ui_txtToDate').val().length > 0) {
        var LocalFromdate = $("#ui_txtFromDate").val();
        var LocalTodate = $("#ui_txtToDate").val();

        fromdate = new Date(LocalFromdate);
        todate = new Date(LocalTodate);

        if (IsGreaterThanTodayDate(LocalFromdate)) {
            ShowErrorMessage(GlobalErrorList.PageHeadingWithDate.from_date_Exceeded_error);
            $("#ui_txtFromDate").focus();
            return false;
        }

        if (IsGreaterThanTodayDate(LocalTodate)) {
            ShowErrorMessage(GlobalErrorList.PageHeadingWithDate.to_date_Exceeded_error);
            $("#ui_txtToDate").focus();
            return false;
        }

        if (isFromBiggerThanTo(LocalFromdate, LocalTodate)) {
            ShowErrorMessage(GlobalErrorList.PageHeadingWithDate.from_date_less_then_error);
            $("#ui_txtFromDate").focus();
            return false;
        }

        var startdate = fromdate.getFullYear() + '-' + AddingPrefixZeroDayMonth((fromdate.getMonth() + 1)) + '-' + AddingPrefixZeroDayMonth(fromdate.getDate()) + " 00:00:00";
        var enddate = todate.getFullYear() + '-' + AddingPrefixZeroDayMonth((todate.getMonth() + 1)) + '-' + AddingPrefixZeroDayMonth(todate.getDate()) + " 23:59:59";

        fromdate = ConvertDateTimeToUTC(startdate);
        fromdate = fromdate.getFullYear() + '-' + AddingPrefixZeroDayMonth((fromdate.getMonth() + 1)) + '-' + AddingPrefixZeroDayMonth(fromdate.getDate()) + " " + AddingPrefixZeroDayMonth(fromdate.getHours()) + ":" + AddingPrefixZeroDayMonth(fromdate.getMinutes()) + ":" + AddingPrefixZeroDayMonth(fromdate.getSeconds());

        todate = ConvertDateTimeToUTC(enddate);
        todate = todate.getFullYear() + '-' + AddingPrefixZeroDayMonth((todate.getMonth() + 1)) + '-' + AddingPrefixZeroDayMonth(todate.getDate()) + " " + AddingPrefixZeroDayMonth(todate.getHours()) + ":" + AddingPrefixZeroDayMonth(todate.getMinutes()) + ":" + AddingPrefixZeroDayMonth(todate.getSeconds());
    }

    if (contactDetails.Unsubscribe != null) {
        if (contactDetails.Unsubscribe == "True") {
            contactDetails.Unsubscribe = 1;
        }
        else if (contactDetails.Unsubscribe == "False") {
            contactDetails.Unsubscribe = 0;
        }
        else if (contactDetails.Unsubscribe == "NA") {
            contactDetails.Unsubscribe = 2;
        }
        else if (contactDetails.Unsubscribe == "Select Option") {
            contactDetails.Unsubscribe = null;
        }
    }

    if (contactDetails.IsSmsUnsubscribe == "Select Option") {
        contactDetails.IsSmsUnsubscribe = null;
    }

    if (contactDetails.IsWhatsAppOptIn == "Select Option") {
        contactDetails.IsWhatsAppOptIn = null;
    }

    var ContactSearchOffSet = parseInt($('#ui_txtStartCount').val());
    var ContactSearchEndCount = parseInt($('#ui_txtEndCount').val());
    var ContactSearchFetchNext = ContactSearchEndCount - ContactSearchOffSet;

    $.ajax({
        url: "/ManageContact/Group/SearchAndAddtoGroup",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'contact': contactDetails, 'StartCount': ContactSearchOffSet, 'EndCount': ContactSearchFetchNext, 'GroupId': GroupId, 'FromDate': fromdate, 'ToDate': todate }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (response) {
            if (response)
                ShowSuccessMessage(GlobalErrorList.Manage_Group.searchandaddcontacttogroup_message);
            else
                ShowErrorMessage(GlobalErrorList.Manage_Group.searchandaddcontacttogroup_error);
            HidePageLoading();
        },
        error: ShowAjaxError
    });
}

function IsGreaterThanTodayDate(chkdate) {
    var todayDate = new Date(new Date().toLocaleString("en-US", { timeZone: TimeZoneData[0] })).toISOString().slice(0, 10);
    var from = new Date(chkdate).getTime();
    var to = new Date(todayDate).getTime();
    return from > to;
}

function isFromBiggerThanTo(dtmfrom, dtmto) {
    var from = new Date(dtmfrom).getTime();
    var to = new Date(dtmto).getTime();
    return from > to;
}

function AddingPrefixZeroDayMonth(n) {
    return (n < 10) ? ("0" + n) : n;
}

function RemoveContactsFromOtherGroup(GroupId, TotalContact) {
    if (TotalContact > 0) {
        $.ajax({
            url: "/ManageContact/Group/RemoveContactFromOtherGroup",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'GroupId': GroupId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response) {
                    $("#ui_btnExclusiveConfirm").attr("data-id", 0);
                    $("#ui_btnExclusiveConfirm").attr("data-grouptotal", 0);
                    ShowSuccessMessage(GlobalErrorList.Manage_Group.ConactRemovedFromOtherGroupsuccess_message);
                    MaxCount();
                }
                else
                    ShowErrorMessage(GlobalErrorList.Manage_Group.ContactNotExist_error);

                HidePageLoading();
            },
            error: ShowAjaxError
        });
    }
    else {
        ShowErrorMessage(GlobalErrorList.Manage_Group.contactnotexist_error);
        HidePageLoading();
    }
}

function DuplicateContactsToNewGroup(GroupId, NewGroupId) {
    ShowPageLoading();
    $.ajax({
        url: "/ManageContact/Group/DuplicateContactsToNewGroup",
        type: 'POST',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'GroupId': GroupId, 'NewGroupId': NewGroupId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (response) {
            if (response > 0) {
                ClearAllFields();
                $(".popupcontainer, #createnewgroup,#Ui_DatewiseMemebersCount").addClass("hideDiv");
                ShowSuccessMessage(GlobalErrorList.Manage_Group.ContactDuplicate_Message);
                $("btnAddToGroup").attr("duplicategroupid", 0)
                MaxCount();
            }
            else
                ShowErrorMessage(GlobalErrorList.Manage_Group.ContactNotExist_error);

            HidePageLoading();
        },
        error: ShowAjaxError
    });

}

$("#SearchByName").click(function () {
    if ($.trim($("#ui_txtSearchBy").val()).length == 0) {
        ShowErrorMessage(GlobalErrorList.Manage_Group.GroupNameSearch_error);
        $("#ui_txtSearchBy").focus();
        return false;
    }
    else {
        MaxCount();
    }
});

//******Show Create Group Pop UP*************
$(".creategroupbtn-pop").click(function () {
    ClearAllFields();
    $(".popuptitle h6").html("Create a Group");
    $("#emailvalidwrap").addClass("hideDiv");
    $("#dvAddcontact").addClass("hideDiv");
    $(".popupcontainer, #dvgroupPopup").removeClass("hideDiv");
    $("#dvcontrolgroup").addClass("hideDiv");
    $("#emailvalidwrap").addClass("hideDiv");
    $("#groupcollapsetwo").removeClass("show");
    $("#groupcollapseone").addClass("show");
    $('#btnAddToGroup').text('Save Group');
    $("#Ui_DatewiseMemebersCount").addClass("hideDiv");
});
//*********************************
function ClearAllFields() {
    $("#btnAddToGroup").attr("GroupId", 0);
    getgrouptypeval = '';
    $('#ui_txtGrpDescription').val('');
    $('#totalcounts,#verifiedcounts,#unverifiedcounts,#invalidcounts,#unsubscribecounts').text(0);
    $('#dvgroupPopup').find('input:text').val('');
    $('#dvContactDetails').hide();
    $('#dvAddcontactFilter').show();
    $("#addcontactcheck").prop("checked", false);
    $("#dvgroupPopup").find("select").each(function () {
        this.selectedIndex = 0; //
    });
    membersgroupid = 0;
    currentTotalRow = 0;
    MembersOffSet = 0;
    MembersTotalRowCount = 0;
}
var deleterowSel;
$("#deleteRowConfirm").click(function () {
    $(deleterowSel).remove();
    $(delettblrow).remove();
    DeleteGroup($("#deleteRowConfirm").attr("data-id"));
});

DeleteGroup = function (GroupId) {
    $.ajax({
        url: "/ManageContact/Group/Delete",
        type: 'POST',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'Id': GroupId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response) {
                ShowSuccessMessage(GlobalErrorList.Manage_Group.GroupDeleted_message);
                $("#deleteRowConfirm").attr("data-id", 0);
                MaxCount();
            }
        },
        error: ShowAjaxError
    });
};

$("#btnCancel").click(function () {
    $(this).parents(".popupcontainer").addClass("hideDiv");
    ClearAllFields();
});

$("#ui_btnExclusiveConfirm").click(function () {
    ShowPageLoading();
    RemoveContactsFromOtherGroup($("#ui_btnExclusiveConfirm").attr("data-id"), $("#ui_btnExclusiveConfirm").attr("data-grouptotal"));
});

DeleteGroup = function (GroupId) {
    $.ajax({
        url: "/ManageContact/Group/Delete",
        type: 'POST',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'Id': GroupId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response) {
                ShowSuccessMessage(GlobalErrorList.Manage_Group.GroupDeleted_message);
                $("#deleteRowConfirm").attr("data-id", 0);
                MaxCount();
            }
        },
        error: ShowAjaxError
    });
};

var delettblrow;
var grouptotalcount = 0, MainGroupId = 0;
$(document).on('click', ".tddropmenuWrap .dropdown-menu a.dropdown-item", function () {
    getgrouptypeval = $(this).attr("data-grouptype");
    getgroupNameval = $(this).parents(".tddropmenuWrap").prev(".nameTxtWrap").attr("title");
    var getgroupDesVal = $(this).parents(".groupnamewrap").parent("td").next("td").text();
    delettblrow = $(this).parents(".groupnamewrap").parent("td").parent("tr");

    //$(".popupcontainer").removeClass("hideDiv");
    //$(".groupaccordWrap, #emailvalidwrap").addClass("hideDiv");
    if (getgrouptypeval == "groupedit") {
        ClearAllFields();
        $(".popuptitle h6").html("Edit Group");
        $(".popupcontainer").addClass("hideDiv");
        $("#Ui_DatewiseMemebersCount").addClass("hideDiv");
        $(".groupaccordWrap, #dv_FilterContacts").removeClass("hideDiv");
        $("#groupcollapseone").removeClass("collapse")
        $("#ui_txtGrpName").val(getgroupNameval);
        $("#ui_txtGrpDescription").val(getgroupDesVal);
        $("#btnAddToGroup").attr("GroupId", $(this).parent("div").attr("data-groupid"));
        $('#btnAddToGroup').text('Update');
        if ($(this).attr("data-type") == "2") { $("#dvAddcontactFilter").addClass("hideDiv"); }
        else { $("#dvAddcontactFilter").removeClass("hideDiv"); }
        {
            $("#dvAddcontact").addClass("hideDiv");
            $("#Ui_DatewiseMemebersCount").addClass("hideDiv");
        }
        Getemailverfiedcounts($(this).attr("data-groupId"));
        GetGroupDetail($(this).attr("data-groupId"));
    } else if (getgrouptypeval == "groupduplicate") {
        $(".popuptitle h6").html("Duplicate a Group");
        $(".popupcontainer").addClass("hideDiv");
        $("#dv_FilterContacts").removeClass("hideDiv");
        $('#dvgroupPopup').removeClass("hideDiv");
        $("#Ui_DatewiseMemebersCount").addClass("hideDiv");
        $("#ui_txtGrpName").val(getgroupNameval + "_Duplicate");
        $("#ui_txtGrpDescription").val(getgroupDesVal);
        $("#btnAddToGroup").attr("duplicategroupid", $(this).parent("div").attr("data-groupid"));
        $('#dvAddcontactFilter').hide();
        GetGroupDetail($(this).attr("data-groupId"));
    } else if (getgrouptypeval == "groupvalidate" || getgrouptypeval == "groupviewcontacts") {
        $("#Ui_DatewiseMemebersCount").addClass("hideDiv");
        if (getgrouptypeval == "groupvalidate") {

            var VerifiedContactPercent = Math.round((parseInt($(this).parent("div").attr("data-verified")) / parseInt($(this).parent("div").attr("data-total"))) * 100);
            var VerifiedContactPercent = isNaN(VerifiedContactPercent) ? 0 : parseInt(VerifiedContactPercent);

            if (VerifiedContactPercent != 100)
                CheckCredits($(this).parent("div").attr("data-groupid"), $(this).parent("div").attr("data-total"));
            else
                ShowErrorMessage(GlobalErrorList.Manage_Group.UnVerifiedContactNotExist_error);
        }
        $(".popupcontainer").addClass("hideDiv");
    } else if (getgrouptypeval == "groupexport") {
        $(".popupcontainer").addClass("hideDiv");
        $(".exportgroupname").html(getgroupNameval);
        $(".exportgroupCount").html($(this).parent("div").attr("data-total"));
        $("#ui_btnGroupContactExport").attr("data-total", $(this).parent("div").attr("data-total"));
        $("#ui_btnGroupContactExport").attr("GroupId", $(this).parent("div").attr("data-groupid"));
        $("#ui_ddl_FileType").val('csv');
    } else if (getgrouptypeval == "groupexclusive") {
        $(".popupcontainer").addClass("hideDiv");
        $("#ui_btnExclusiveConfirm").attr("data-id", $(this).parent("div").attr("data-groupid"));
        $("#ui_btnExclusiveConfirm").attr("data-grouptotal", $(this).parent("div").attr("data-total"));
    } else if (getgrouptypeval == "groupDelete") {
        $(".popupcontainer").addClass("hideDiv");
        $("#deleteRowConfirm").attr("data-id", $(this).parent("div").attr("data-groupid"));
        $(this).parents(".groupnamewrap").parent("td").parent("tr").addClass("activeBgRow");
    } else if (getgrouptypeval == "Autoemailvalidate") {
        $(".popupcontainer").addClass("hideDiv");
        $("#AutovalidationRowConfirm").attr("data-id", $(this).parent("div").attr("data-groupid"));
        validationprogress = $(this).parent("div").attr("data-verifieds");

    }
    else if (getgrouptypeval == "groupmembercounts") {
        membersgroupid = $(this).parent("div").attr("data-groupid"), $(this).parent("div").attr("data-total");
        GroupMemberMaxCounts();
        ShowPageLoading();

    }
    else if (getgrouptypeval == "createcntrlgroup") {
        grouptotalcount = parseInt($(this).attr("data-total"));
        if (grouptotalcount > 0) {
            $('#notctrlgrp').attr('checked', false)
            $('.notcntrlgrpcont').addClass('hideDiv');
            $('#dvcontrolgroup').removeClass('hideDiv');
            let popUpSubTitle = $(this).attr("data-groupname") + " (" + $(this).attr("data-total") + ")";
            $(".popuptitle small").html(popUpSubTitle);
            MainGroupId = $(this).parent("div").attr("data-groupid")
            let cntrlgrpName = "Ctrl_" + $(this).attr("data-groupname");
            $("#ui_txt_NewCntrlGrpName").val(cntrlgrpName);
            $("#ui_txtarea_NewCntrlGrpDescription").val("Control Group for " + cntrlgrpName);
            let notCntrlgrpName = "NACtrl_" + $(this).attr("data-groupname");
            $("#ui_txt_NotCntrlGrpName").val(notCntrlgrpName);
            $("#ui_txtarea_NotCntrlGrpDescription").val("Non-Control Group for" + notCntrlgrpName);
            $("#" + getgrouptypeval).removeClass("hideDiv");
            $("#dv_FilterContacts").addClass("hideDiv");
            $('#ctrlgrpsize').val(5);
            $('#cntrlgrpsizval').text('5%');
            //By default count calculation for 5 %
            var DefaultControlGroupCount = Math.round((grouptotalcount * 5) / 100);
            let DefaultNonControlGroupCount = Math.round(grouptotalcount - DefaultControlGroupCount);

            $("#grpconts").text(DefaultControlGroupCount);
            $("#notgrpconts").text(DefaultNonControlGroupCount);
        }
        else {
            $(".popupcontainer").addClass("hideDiv");
            ShowErrorMessage(GlobalErrorList.Manage_Group.contactnotexist_error);
        }
    }

    if ($(this).attr("data-grouptype") == "groupedit" || $(this).attr("data-grouptype") == "groupduplicate") {
        $('#totalcounts').text($(this).parent("div").attr("data-total"));

        $('#ui_verifiedmailcount').text($(this).parent("div").attr("data-verified"));
        $('#ui_unverifiedmailcount').text($(this).parent("div").attr("data-unverified"));
        $('#ui_invalidmailcount').text($(this).parent("div").attr("data-inValid"));
        $('#ui_mailsubscribecount').text($(this).parent("div").attr("data-mailsubscribe"));
        $('#ui_mailunsubscribecount').text($(this).parent("div").attr("data-mailunsubscribe"));
        $('#ui_smssubscribecount').text($(this).parent("div").attr("data-smssubscribe"));
        $('#ui_smsunsubscribecount').text($(this).parent("div").attr("data-smsunsubscribe"));
        $('#ui_whatsappsubscribecount').text($(this).parent("div").attr("data-whatsappsubscribe"));
        $('#ui_whatsappunsubscribecount').text($(this).parent("div").attr("data-whatsappunsubscribe"));
        $('#ui_webpushsubscribecount').text($(this).parent("div").attr("data-webpushsubscribe"));
        $('#ui_webpushunsubscribecount').text($(this).parent("div").attr("data-webpushunsubscribe"));
        $('#dvContactDetails').show();
    }
});
//Export Contact Option in ManageGroupPage
$("#ui_btnGroupContactExport").click(function () {

    ShowPageLoading();
    if (parseInt($("#ui_btnGroupContactExport").attr("data-total")) > 0) {
        FileType = $("#ui_ddl_FileType").val();
        if (FileType != "csv" && FileType != "xls" && FileType != "xlsx") {
            ShowErrorMessage(GlobalErrorList.ExportData.file_selection_error);
            HidePageLoading();
            return true;
        }
        $.ajax({
            url: "/ManageContact/Group/GroupContactExport",
            type: 'POST',
            data: JSON.stringify({
                'accountId': Plumb5AccountId, 'FileType': FileType, 'GroupId': $("#ui_btnGroupContactExport").attr("groupid")
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response.Status) {
                    SaveToDisk(response.MainPath);
                    //ResetExportValues();
                    setTimeout(function () { DeleteFile(response.MainPath); }, 5000);
                    $("#ui_btnGroupContactExport").attr("data-total", 0);
                    $("#ui_btnGroupContactExport").attr("GroupId", 0);
                }
                else {
                    ShowErrorMessage(GlobalErrorList.ExportData.session_expired);
                    setTimeout(function () { window.location.href = "/Login"; }, 3000);
                }

            },
            error: ShowAjaxError
        });
    }
    else {
        ShowErrorMessage(GlobalErrorList.Manage_Group.contactnotexist_error);
    }
    HidePageLoading();
});

function ValidateGroup(GroupId, Total) {
    $("#ui_btnGroupEmailValidateConfirm").removeProp("groupid");
    ShowPageLoading();
    if (Total > 0) {
        $("#ui_btnGroupEmailValidateConfirm").prop("groupid", GroupId);
        $('#ui_divGroupEmailValidate').modal();
    }
    else {
        ShowErrorMessage(GlobalErrorList.Manage_Group.contactnotexist_error);
    }
    HidePageLoading();
}

function CheckCredits(GroupId, Total) {
    $.ajax({
        url: "/ManageContact/ContactEmailValidationOverView/CheckCredits",
        type: 'POST',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'GroupId': GroupId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response != undefined && response != null) {
                if (response.Status == false) {
                    ShowErrorMessage(GlobalErrorList.Manage_Group.NoCredits);
                    return false;
                }
                else {
                    ValidateGroup(GroupId, Total);
                }
            }
        },
        error: ShowAjaxError
    });
}

$("#ui_btnGroupEmailValidateConfirm").click(function () {
    ShowPageLoading();
    ValidateGroupConfirm($("#ui_btnGroupEmailValidateConfirm").prop("groupid"));
    $("#ui_divGroupEmailValidate").modal('hide');
});

$("#ui_btnTopGroupEmailValidateCancel,#ui_btnGroupEmailValidateCancel").click(function () {
    $("#ui_btnGroupEmailValidateConfirm").removeProp("groupid");
    $("#ui_divGroupEmailValidate").modal('hide');
});

function ValidateGroupConfirm(GroupId) {
    $("#ui_btnGroupEmailValidateConfirm").removeProp("groupid");
    ContactEmailValidationOverView.GroupId = GroupId;
    ContactEmailValidationOverView.Name = getgroupNameval;
    $.ajax({
        url: "/ManageContact/Group/ValidateGroup",
        type: 'POST',
        data: JSON.stringify({ 'ContactEmailValidationOverView': ContactEmailValidationOverView }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response.ContactEmailValidationOverView.Id > 0)
                ShowSuccessMessage(GlobalErrorList.Manage_Group.validatesuccess_message);
            else
                ShowErrorMessage(GlobalErrorList.Manage_Group.validate_error);
            HidePageLoading();
        },
        error: ShowAjaxError
    });
}

$("#ui_txtSearchBy").keyup(function (e) {
    MaxCount();
});
$(document).on("click", ".verifiedgroup .ion-ios-information", function () {
    $("#emailvalidwrap.popupcontainer").removeClass("hideDiv");
    $(".popuptitle h6").html("Contact Email Validaton<span id='ui_spBindGroupName'></span>");
    $("#ui_spBindGroupName").html(`(${$(this).parent("div").attr("group-name")})`);
    GetEmailValidationOverViewDetails($(this).parent("div").attr("data-groupid"));
});


$("#close-popup, .clsepopup").click(function () {
    $(this).parents(".popupcontainer").addClass("hideDiv");
    $(".errmsgemlvalidwrp .ion-ios-information").popover("hide");
    ClearAllFields();
});

function GetGroupDetail(GroupId) {
    ShowPageLoading();
    $.ajax({
        url: "/ManageContact/Group/GetGroupsDetails",
        type: 'POST',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'GroupId': GroupId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response != null) {
                $('#Totalmailcount').text(response.TotalEmail);
                $('#Totalphonenumbercount').text(response.TotlaPhonenumber);
                $('#ui_unverifiedmailcount').text(response.UnVerified);
                $('#ui_invalidmailcount').text(response.InValid);
                $('#ui_mailsubscribecount').text(response.MailSubscribe);
                $('#ui_mailunsubscribecount').text(response.Unsubscribe);
                $('#ui_smssubscribecount').text(response.SmsSubscribe);
                $('#ui_smsunsubscribecount').text(response.SmsUnsubscribe);
                $('#ui_whatsappsubscribecount').text(response.WhatsAppSubscribe);
                $('#ui_whatsappunsubscribecount').text(response.WhatsAppUnsubscribe);
                $('#ui_webpushsubscribecount').text(response.WebPushSubscribe);
                $('#ui_webpushunsubscribecount').text(response.WebPushUnsubscribe);
            }
            HidePageLoading();
        },
        error: ShowAjaxError
    });
}

function StartGroupDataExport() {
    ShowPageLoading();

    if (!ExportValidation()) {
        var ExportOffSet = parseInt($("#ui_txtFromRange").val());
        var ExportFetchNext = parseInt($("#ui_txToRange").val());

        if ((ExportFetchNext - ExportOffSet) <= 0) {
            ShowErrorMessage(GlobalErrorList.ExportData.nonnumeric);
            $("#ui_txToRange").focus();
            HidePageLoading();
            return true;
        }

        if ((ExportFetchNext - ExportOffSet) > 10) {
            ShowErrorMessage(GlobalErrorList.Manage_Group.ExportMoreThan10);
            $("#ui_txToRange").focus();
            HidePageLoading();
            return true;
        }

        ExportFetchNext = (ExportFetchNext - ExportOffSet);

        $.ajax({
            url: "/" + Areas + "/" + MainControlerUrl + "/" + ExportFunctionName,
            type: 'POST',
            data: JSON.stringify({
                'AccountId': Plumb5AccountId, 'Duration': duration, 'FromDateTime': FromDateTime, 'TodateTime': ToDateTime, 'OffSet': ExportOffSet, 'FetchNext': ExportFetchNext, 'FileType': ExportFileType
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response.Status) {
                    SaveToDisk(response.MainPath);
                    setTimeout(function () { DeleteFile(response.MainPath); }, 5000);
                    $("#downloadModal").modal('hide');
                }
                else {
                    ShowErrorMessage(GlobalErrorList.ExportData.session_expired);
                    setTimeout(function () { window.location.href = "/Login"; }, 3000);
                }
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    }
}
var checkBoxClickCount, addGroupNameList;
function RowCheckboxClick() {
    $(document.body).on('click', '.selChk', function () {
        checkBoxClickCount = $(".selChk").filter(":checked").length;
        if (checkBoxClickCount > 0) {
            $(".subdivWrap").addClass("showDiv");
            if (checkBoxClickCount > 3) {
                $(this).prop("checked", false);
                ShowErrorMessage(GlobalErrorList.Manage_Group.groups_limiterror);
            } else {
                $(".checkedCount").html(checkBoxClickCount);
            }
        } else {
            $(".subdivWrap").removeClass("showDiv");
        }
    });
}

function OpenMoveContacts() {
    ShowPageLoading();
    var GroupSelectedCount = parseInt($(".checkedCount").html());
    if (GroupSelectedCount <= 0) {
        ShowErrorMessage(GlobalErrorList.Manage_Group.MoveContact_selection_error);
        HidePageLoading();
        return false;
    }
    HidePageLoading();
    $("#drp_groups").val("0").trigger("change");
    $("#movecontactmod").modal('show');
}

function OpenCopyContacts() {
    ShowPageLoading();
    var GroupSelectedCount = parseInt($(".checkedCount").html());
    if (GroupSelectedCount <= 0) {
        ShowErrorMessage(GlobalErrorList.Manage_Group.CopyContact_selection_error);
        HidePageLoading();
        return false;
    }
    HidePageLoading();
    $("#ui_ddlCopyGroups").val("0").trigger("change");
    $("#ui_divCopyGroupPopUp").modal('show');
}

$("#btnMoveContacts").click(function () {
    if ($('#drp_groups').val() == 0) {
        ShowErrorMessage(GlobalErrorList.Manage_Group.MoveContact_dropdownError);
        return false;
    }

    var chkArrayGroupId = new Array();
    $(".selChk:checked").each(function () {
        chkArrayGroupId.push(parseInt($(this).val()));
    });

    if (jQuery.inArray(parseInt($('#drp_groups').val()), chkArrayGroupId) > -1) {
        ShowErrorMessage(GlobalErrorList.Manage_Group.SameGroupSelected);
        return false;
    }

    MoveContactsConfirm();
});

$("#ui_btnCopyContacts").click(function () {
    if ($('#ui_ddlCopyGroups').val() == 0) {
        ShowErrorMessage(GlobalErrorList.Manage_Group.CopyContact_dropdownError);
        return false;
    }

    var chkArrayGroupId = new Array();
    $(".selChk:checked").each(function () {
        chkArrayGroupId.push(parseInt($(this).val()));
    });

    if (jQuery.inArray(parseInt($('#ui_ddlCopyGroups').val()), chkArrayGroupId) > -1) {
        ShowErrorMessage(GlobalErrorList.Manage_Group.SameGroupSelected);
        return false;
    }

    CopyContactsConfirm();
});

function MoveContactsConfirm() {
    $("#ConfirmMovegroupsContact").show();
    $('#ConfirmMovegroupsContact').css('background-color', 'rgba(0, 0, 0, 0.5)');
    $("#btnMoveContactsConfirm").attr("onclick", "MoveGroupContacts();");
}

function CopyContactsConfirm() {
    $("#ui_divConfirmCopyGroupsContact").show();
    $('#ui_divConfirmCopyGroupsContact').css('background-color', 'rgba(0, 0, 0, 0.5)');
    $("#ui_btnCopyContactsConfirm").attr("onclick", "CopyGroupContacts();");
}

$('#btnMoveContactsCancel,#MoveContactClose').click(function () {
    $("#movecontactmod").modal('show');
    $("#ConfirmMovegroupsContact").hide();
});

$('#ui_btnCopyContactsCancel,#ui_btnCopyContactClose').click(function () {
    $("#ui_divCopyGroupPopUp").modal('show');
    $("#ui_divConfirmCopyGroupsContact").hide();
});

function MoveGroupContacts() {
    ShowPageLoading();
    var chkArrayGroupId = new Array();
    $(".selChk:checked").each(function () {
        chkArrayGroupId.push(parseInt($(this).val()));
    });
    var selectedgroupId;
    if (chkArrayGroupId.length > 1)
        selectedgroupId = chkArrayGroupId.join(",");
    else
        selectedgroupId = chkArrayGroupId[0].toString();
    $.ajax({
        type: "POST",
        url: "/ManageContact/Group/MoveGroupsContact",
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'UserId': Plumb5UserId, 'selectedGroups': selectedgroupId, 'newGroupId': parseInt($('#drp_groups').val()) }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response) {
                ShowSuccessMessage(GlobalErrorList.Manage_Group.MoveContactSuccess);
                ClearActions();
                MaxCount();
            }
            HidePageLoading();
        },
        error: ShowAjaxError
    });
}

function CopyGroupContacts() {
    ShowPageLoading();
    var chkArrayGroupId = new Array();
    $(".selChk:checked").each(function () {
        chkArrayGroupId.push(parseInt($(this).val()));
    });
    var selectedgroupId;
    if (chkArrayGroupId.length > 1)
        selectedgroupId = chkArrayGroupId.join(",");
    else
        selectedgroupId = chkArrayGroupId[0].toString();
    $.ajax({
        type: "POST",
        url: "/ManageContact/Group/CopyGroupsContact",
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'UserId': Plumb5UserId, 'selectedGroups': selectedgroupId, 'newGroupId': parseInt($('#ui_ddlCopyGroups').val()) }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response) {
                ShowSuccessMessage(GlobalErrorList.Manage_Group.CopyContactSuccess);
                ClearActions();
                MaxCount();
            }
            HidePageLoading();
        },
        error: ShowAjaxError
    });
}

function OpenMergeGroupsContact() {
    ShowPageLoading();
    var GroupSelectedCount = parseInt($(".checkedCount").html());
    if (GroupSelectedCount <= 0) {
        ShowErrorMessage(GlobalErrorList.Manage_Group.MergeGroup_selection_error);
        HidePageLoading();
        return false;
    }
    HidePageLoading();
    $("#createmergegropmod").modal('show');

}

$("#btnMergeGroups").click(function () {
    if ($('#txt_MergeGroupName').val() == '') {
        ShowErrorMessage(GlobalErrorList.Manage_Group.name_error);
        return false;
    }
    if ($('#txt_MergeGroupDescription').val() == '') {
        ShowErrorMessage(GlobalErrorList.Manage_Group.description_errorr);
        return false;
    }
    MergeGroupContacts();
});

function MergeGroupContacts() {
    ShowPageLoading();
    var MergeGroupDetailsObject = new Object();
    MergeGroupDetailsObject.UserInfoUserId = Plumb5UserId;
    MergeGroupDetailsObject.Name = $('#txt_MergeGroupName').val();
    MergeGroupDetailsObject.GroupDescription = $('#txt_MergeGroupDescription').val();

    var chkArrayGroupId = new Array();
    $(".selChk:checked").each(function () {
        chkArrayGroupId.push(parseInt($(this).val()));
    });
    var selectedgroupId;
    if (chkArrayGroupId.length > 1)
        selectedgroupId = chkArrayGroupId.join(",");
    else
        selectedgroupId = chkArrayGroupId[0];
    $.ajax({
        type: "POST",
        url: "/ManageContact/Group/MergeGroupContacts",
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'selectedGroups': selectedgroupId, 'groups': MergeGroupDetailsObject }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response) {
                ShowSuccessMessage(GlobalErrorList.Manage_Group.MergeGroupsSuccess);
                MaxCount();
                ClearActions();
            }
            HidePageLoading();
        },
        error: ShowAjaxError
    });
}

function ClearActions() {
    $(".checkedCount").html(0);
    //$(".selchbxall,.selChk").prop("checked", false);
    $(".selChk").prop("checked", false);
    $(".subdivWrap").removeClass("showDiv");
    $("#drp_groups").val("0").trigger("change");
    $("#ui_ddlCopyGroups").val("0").trigger("change");
    $('#txt_MergeGroupName,#txt_MergeGroupDescription').val('');
    $("#ConfirmMovegroupsContact").hide();
    $("#ui_divConfirmCopyGroupsContact").hide();
}

function BindGroupName() {
    $.ajax({
        url: "/ManageContact/Group/GetGroupsByStaticOrDynamic",
        type: "POST",
        data: JSON.stringify({ 'accountId': Plumb5AccountId, GroupType: 1 }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response != null && response.GroupDetails != null) {
                $.each(response.GroupDetails, function () {
                    $("#drp_groups").append($('<option value="' + this.Id + '" >' + this.Name + '</option>'));
                    $("#ui_ddlCopyGroups").append($('<option value="' + this.Id + '" >' + this.Name + '</option>'));
                });
            }
            HidePageLoading();
        },
        error: ShowAjaxError
    });
}

$('.movetocontdrpdwn').select2({
    minimumResultsForSearch: '',
    dropdownAutoWidth: false,
    dropdownParent: $('#movecontactmod')
});

$('.copytocontdrpdwn').select2({
    minimumResultsForSearch: '',
    dropdownAutoWidth: false,
    dropdownParent: $('#ui_divCopyGroupPopUp')
});

$("#notctrlgrp").click(function () {
    if ($("#notctrlgrp").is(":checked")) {
        $(this).parent().parent().next().removeClass("hideDiv");
    } else {
        $(this).parent().parent().next().addClass("hideDiv");
    }
});

$("#ctrlgrpsize").change(function () {
    var cntrlgrpszval = parseInt($(this).val());
    var crrtnval = grouptotalcount;
    var perct = Math.round((crrtnval * cntrlgrpszval) / 100);
    let data = Math.round(crrtnval - perct);
    $("#cntrlgrpsizval").html(cntrlgrpszval + "%");
    $("#grpconts, #notgrpconts").text(perct);
    $("#notgrpconts").text(data);
});
$("#btnControlGroup").click(function () {
    ShowPageLoading();
    if (CleanText($("#ui_txt_NewCntrlGrpName").val()).length == 0) {
        ShowErrorMessage(GlobalErrorList.Manage_Group.ControlGroupname_error);
        $("#ui_txt_NewCntrlGrpName").focus();
        HidePageLoading();
        return;
    }
    if (CleanText($("#ui_txtarea_NewCntrlGrpDescription").val()).length == 0) {
        ShowErrorMessage(GlobalErrorList.Manage_Group.ControlGroupdescription_error);
        $("#ui_txtarea_NewCntrlGrpDescription").focus();
        HidePageLoading();
        return;
    }
    if (parseInt($('#grpconts').html()) == 0) {
        ShowErrorMessage(GlobalErrorList.Manage_Group.ControlGroupContactCount_error);
        HidePageLoading();
        return;
    }
    if ($('#notctrlgrp').is(':Checked')) {
        if (CleanText($("#ui_txt_NotCntrlGrpName").val()).length == 0) {
            ShowErrorMessage(GlobalErrorList.Manage_Group.NotControlGroupname_error);
            $("#ui_txt_NotCntrlGrpName").focus();
            HidePageLoading();
            return;
        }
        if (CleanText($("#ui_txtarea_NotCntrlGrpDescription").val()).length == 0) {
            ShowErrorMessage(GlobalErrorList.Manage_Group.NotControlGroupdescription_error);
            $("#ui_txtarea_NotCntrlGrpDescription").focus();
            HidePageLoading();
            return;
        }
        if (parseInt($('#notgrpconts').html()) == 0) {
            ShowErrorMessage(GlobalErrorList.Manage_Group.NotControlGroupContactCount_error);
            HidePageLoading();
            return;
        }

    }

    var ControlGroupInfoDetailsObject = new Object();
    ControlGroupInfoDetailsObject.GroupId = MainGroupId;
    ControlGroupInfoDetailsObject.ControlGroupName = $('#ui_txt_NewCntrlGrpName').val();
    ControlGroupInfoDetailsObject.ControlGroupDescription = $('#ui_txtarea_NewCntrlGrpDescription').val();
    ControlGroupInfoDetailsObject.ControlGroupCount = parseInt($('#grpconts').html())
    ControlGroupInfoDetailsObject.ControlGroupPercentage = parseInt($("#cntrlgrpsizval").text().replace('%', ''));
    ControlGroupInfoDetailsObject.IsNotControlGroupChecked = $("#notctrlgrp").is(":checked")
    ControlGroupInfoDetailsObject.NonControlGroupName = $('#ui_txt_NotCntrlGrpName').val();
    ControlGroupInfoDetailsObject.NonControlGroupDescription = $('#ui_txtarea_NotCntrlGrpDescription').val();
    ControlGroupInfoDetailsObject.NonControlGroupCount = parseInt($("#notgrpconts").html());
    ControlGroupInfoDetailsObject.NonControlGroupPercentage = 100 - parseInt($("#cntrlgrpsizval").text().replace('%', ''));

    $.ajax({
        url: "/ManageContact/Group/CreateControlGroup",
        type: "POST",
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'Controlgroupinfo': ControlGroupInfoDetailsObject }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response > 0) {
                $('#dvcontrolgroup').addClass('hideDiv');
                ShowSuccessMessage(GlobalErrorList.Manage_Group.ControlGroupsSuccess);
                MaxCount();
            }
            else {
                ShowErrorMessage(GlobalErrorList.Manage_Group.ControlGroupsexists);
            }
            HidePageLoading();
        },
        error: ShowAjaxError
    });
});
$("#AutovalidationRowConfirm").click(function () {
    if (validationprogress == "100")
        ShowErrorMessage(GlobalErrorList.Manage_Group.AutovalidationDone);

    else
        AutoEmailValidation($("#AutovalidationRowConfirm").attr("data-id"));

});

AutoEmailValidation = function (GroupId) {
    $.ajax({
        url: "/ManageContact/Group/AutoEmailValidation",
        type: 'POST',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'GroupId': GroupId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response) {

                ShowSuccessMessage(GlobalErrorList.Manage_Group.AutoEmailValidation);
                GetReport();
            }
            else
                ShowErrorMessage(GlobalErrorList.Manage_Group.contactnotexist_error);
            HidePageLoading();
        },

        error: ShowAjaxError
    });
};
GroupMemberMaxCounts = function () {
    $("#Ui_DatewiseMemebersCount").removeClass("hideDiv");
    $.ajax({
        url: "/ManageContact/Group/GroupMemberMaxCount",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'GroupId': membersgroupid }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            MembersTotalRowCount = response.maxcount;
            currentTotalRow = response.maxcount;
            if (MembersTotalRowCount > 0) {
                GroupMemberCountsReport();
            }
            else {
                $("#ui_DatewisetbodyReportData").empty().append(`<tr><td colspan="2" class="border-bottom-none"><div class="no-data">There is no data for this view</div></td></tr>`);

                HidePageLoading();
            }
        },
        error: ShowAjaxError
    });
};
GroupMemberCountsReport = function () {
    $("#ui_DatewisetbodyReportData").empty();
    $("#Ui_DatewiseMemebersCount").removeClass("hideDiv");
    MemebersFetchNext = MembersGetNumberOfRecordsPerPage();
    $.ajax({
        url: "/ManageContact/Group/GroupMemberCountsReport",
        type: 'POST',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'GroupId': membersgroupid, 'OffSet': MembersOffSet, 'FetchNext': MemebersFetchNext }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {


            SetNoRecordContent('ui_tblReportData', 2, 'ui_DatewisetbodyReportData');

            if (response.Table1.length > 0) {
                currentTotalRow = response.Table1.length;
                MemebersPagingPrevNext(MembersOffSet, currentTotalRow, MembersTotalRowCount);
                HidePageLoading();
                var reportTableTrs = "";

                $.each(response.Table1, function (i) {
                    var UpdatedDate = $(this)[0].UpdatedDate != null ? $.datepicker.formatDate("M dd yy", ConvertUTCDateTimeToLocal(($(this)[0].UpdatedDate))) : 'NA';
                    reportTableTrs += '<tr>' +
                        '<td>' + UpdatedDate + '</td>' +
                        '<td>' + $(this)[0].MemebersCount + '</td>' +
                        '</tr>';
                });
                $("#ui_tblReportData").removeClass('no-data-records');
                $("#ui_DatewisetbodyReportData").html(reportTableTrs);
                ShowExportDiv(true);
                ShowPagingDiv(true);
            }
            else
                $("#ui_DatewisetbodyReportData").empty().append(`<tr><td colspan="2" class="border-bottom-none"><div class="no-data">There is no data for this view</div></td></tr>`);
            HidePageLoading();
        },

        error: ShowAjaxError
    });
};

function MemebersPagingPrevNext(DataOffSet, DataCount, TotalData) {
    if ((DataOffSet != undefined && DataOffSet != null && DataOffSet > -1) && (DataCount != undefined && DataCount != null && DataCount > -1) && (TotalData != undefined && TotalData != null && TotalData > -1)) {

        ShowPagingMembersDiv(true);
        $("#ui_MemeberesdivPreviousPage").removeClass('disableDiv');
        $("#ui_MemebersdivNextPage").removeClass('disableDiv');

        if (DataOffSet == 0) {
            $("#ui_MemberslblPagingDesc").html((DataOffSet + 1) + ' - ' + DataCount + ' of ' + TotalData);
            $("#ui_MemeberesdivPreviousPage").addClass('disableDiv');
        }
        else {
            $("#ui_MemberslblPagingDesc").html((DataOffSet + 1) + ' - ' + (DataOffSet + DataCount) + ' of ' + TotalData);
        }

        if ((DataOffSet + DataCount) >= TotalData) {
            $("#ui_MemebersdivNextPage").addClass('disableDiv');
        }
    }
}

MembersGetNumberOfRecordsPerPage = function () {
    if ($("#drp_MembersRecordsPerPage").length > 0) {
        if ($("#drp_MembersRecordsPerPage").val().toString().toLowerCase() == "all")
            return 5000;
        else
            return parseInt($("#drp_MembersRecordsPerPage").val());
    }
    return 20;
};



$(document.body).on('click', '#ui_MemeberesdivPreviousPage', function (event) {
    MembersOffSet = MembersOffSet - MembersGetNumberOfRecordsPerPage();
    MembersOffSet <= 0 ? 0 : MembersOffSet;
    MembersCallBackPaging();
});

$(document.body).on('click', '#ui_MemebersdivNextPage', function (event) {
    MembersOffSet = MembersOffSet + MembersGetNumberOfRecordsPerPage();
    MembersCallBackPaging();
});

$(document.body).on('change', '#drp_MembersRecordsPerPage', function (event) {
    MembersOffSet = 0;
    MembersFetchNext = MembersGetNumberOfRecordsPerPage();
    MembersCallBackFunction();
});
function MembersCallBackPaging() {
    ShowPageLoading();
    currentTotalRow = 0;
    GroupMemberCountsReport();
}

function MembersCallBackFunction() {
    ShowPageLoading();
    MembersTotalRowCount = 0;
    currentTotalRow = 0;
    GroupMemberMaxCounts();
}

function ShowPagingMembersDiv(IsVisible) {
    $("#ui_MemebersdivPaging").removeClass('hideDiv');
    $("#ui_MemebersdivPaging").removeClass('showDiv');
    if (IsVisible != undefined && IsVisible != null && (IsVisible == true || IsVisible == "True" || IsVisible == "true" || IsVisible)) {
        $("#ui_MemebersdivPaging").addClass('showDiv');
    }
    else {
        $("#ui_MemebersdivPaging").addClass('hideDiv');
    }
}
function Getemailverfiedcounts(groupid) {
    ShowPageLoading();
    Group.Id = groupid;
    $.ajax({
        url: "/ManageContact/Group/GetGroupEmailVerfiedCount",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'group': Group }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            //TotalRowCount = response.returnVal;
            $('#TotalGroupCount').text(TotalRowCount);
            if (response.Table1.length > 0) {

                var VerifiedContactPercentage = Math.round((parseInt(response.Table1[0]["TotalEmailVerfied"]) / parseInt(response.Table1[0]["Totalcontact"])) * 100);
                VerifiedContactPercentage = isNaN(VerifiedContactPercentage) ? 0 : parseInt(VerifiedContactPercentage);

                if (VerifiedContactPercentage == 100)
                    progressbarclass = 'progress-bar bg-success';
                else if (VerifiedContactPercentage == 0)
                    progressbarclass = 'progress-bar bg-light';
                else
                    progressbarclass = 'progress-bar bg-success';
                $("#ui_div_verfiedgroupdetails_" + groupid).empty();
                $("#ui_div_verfiedgroupdetails_" + groupid).html("<div id='ui_div_verfiedgroupdetails_" + this.Id + "'  class='progress w-100 ml-'><div class='" + progressbarclass + "' role='progressbar'' style='width:" + VerifiedContactPercentage + "%' 'aria-valuenow='0' aria-valuemin='0' aria-valuemax='100'>" + VerifiedContactPercentage + "%</div></div></div>");

                HidePageLoading();
            }
            else {
                SetNoRecordContent('ui_tblReportData', 5, 'ui_tbodyReportData');
                HidePageLoading();
            }
            Group.Id = 0;
        },
        error: ShowAjaxError
    });
}

function CopyGroupId(GroupId) {
    navigator.clipboard.writeText(GroupId);
    ShowSuccessMessage("GroupId copied successfully");
}