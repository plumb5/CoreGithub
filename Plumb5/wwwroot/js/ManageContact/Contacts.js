var masterfilterid = 0;
$(document).ready(function () {

    if (parseInt($.urlParam("GroupId")) <= 0)
        $("#contactdetails").removeClass("hideDiv");
    else
        $("#contactdetails").addClass("hideDiv");

    if (GroupId == 0) {

        LmsDefaultInitialiseUtil.GetContactGroupName();
        LmsDefaultInitialiseUtil.GetAllFormsForMasterFilter();
        LmsDefaultInitialiseUtil.GetLeadProperties();
        $("#dvGroupTab").addClass("hideDiv");
    } else {
        $('#tabWebPush').attr('href', "PushSubscribers?GroupId=" + GroupId + "&GroupName=" + GroupName);
        $('#tabMobilePush').attr('href', "MobilePushSubscribers?GroupId=" + GroupId + "&GroupName=" + GroupName);
        $(".pagetitle").html("Group Contacts/Subscribers (Group: " + GroupName + ")");
        $("#dvGroupTab").removeClass("hideDiv");
        $("#ui_drp_ContactGroups").attr("disabled", "disabled");
        $("#ui_drp_ContactGroups").append("<option  value='" + GroupId + "'>" + GroupName + "</option>")
        $("#ui_drp_ContactGroups").select2().val(GroupId).trigger('change');

        LmsDefaultInitialiseUtil.GetAllFormsForMasterFilter();
        LmsDefaultInitialiseUtil.GetLeadProperties();
    }
    ExportFunctionName = "ContactsExport";
    CallBackFunction();

    $("#addremovegroupslist").click(function () {
        $('#addgroupoperation').select2({
            minimumResultsForSearch: '',
            dropdownAutoWidth: false
        });
    });
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
    if (masterfilterid == 0) {
        GetReport();
    }
    else {
        ContactsReportBindingUtil.ContactGetReport();
    }
}

var contactDetails = {
    ContactId: 0, EmailId: "", PhoneNumber: "", Name: ""
};

var getgid = urlParam("GroupId");
var GroupId = getgid != 0 && parseInt(getgid) > 0 ? getgid : 0, OffSet = 0;
var GroupName = decodeURIComponent(urlParam("GroupName"));

function MaxCount() {
    BindFilterContents();

    $.ajax({
        url: "/ManageContact/Contact/MaxCount",
        type: 'POST',
        data: JSON.stringify({ 'contact': contactDetails, 'GroupId': GroupId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {

            TotalRowCount = 0;
            if (response != undefined && response != null) {
                TotalRowCount = response.returnVal;
                $("#spnCount").html(TotalRowCount);
            }

            if (TotalRowCount > 0) {
                GetReport();
            }
            else {
                SetNoRecordContent('ui_tblReportData', 6, 'ui_tbodyReportData');
                HidePageLoading();
            }
        },
        error: ShowAjaxError
    });
}


function GetReport() {
    masterfilterid = 0;
    BindFilterContents();
    FetchNext = GetNumberOfRecordsPerPage();
    $.ajax({
        url: "/ManageContact/Contact/GetDetails",
        type: 'Post',
        data: JSON.stringify({ 'contact': contactDetails, 'FetchNext': FetchNext, 'OffSet': OffSet, 'GroupId': GroupId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindReport,
        error: ShowAjaxError
    });
}
var GrpContactId = new Array();
function BindReport(response) {
    SetNoRecordContent('ui_tblReportData', 6, 'ui_tbodyReportData');
    if (response != undefined && response != null && response.length > 0) {

        CurrentRowCount = response.length;
        PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);


        var reportTableTrs;

        GrpContactId = new Array();
        $.each(response, function (i) {
            var UCP = String.raw`ShowContactUCP("","",${$(this)[0].ContactId});`;
            var exportVefified = "";
            var IsVerify = "";

            var getFlatter = $(this)[0].Name != null ? $(this)[0].Name.substring(0, 1) : "?";
            var verificationStatusImg = "";
            if ($(this)[0].IsVerifiedMailId == null || $(this)[0].IsVerifiedMailId == "-1") {
                verificationStatusImg = "icon ion-help-circled";
                exportVefified = "Not Verified";
                IsVerify = `onclick=VerifyEmailContact(${$(this)[0].ContactId},${i})`;
            } else if ($(this)[0].IsVerifiedMailId == "0") {
                verificationStatusImg = "icon ion-android-alert verifalert";
                exportVefified = "Invalid";
            }
            else if ($(this)[0].IsVerifiedMailId == "1") {
                verificationStatusImg = "icon ion-android-checkmark-circle verifsuccess";
                exportVefified = "Valid";
            }

            GrpContactId.push($(this)[0].ContactId);
            var IsWhatsAppOptINOut = '';
            if ($(this)[0].IsWhatsAppOptIn == 1)
                IsWhatsAppOptINOut = ' <i title="WhatsAppOptIN" class="icon ion-android-done-all phoneverified"></i>';
            if ($(this)[0].IsWhatsAppOptIn == 0)
                IsWhatsAppOptINOut = ' <i title="WhatsAppOptOut" class="icon ion-android-done-all phonenotverified"></i>';

            reportTableTrs += '<tr>' +

                '<td  class="td-wid-5 pl-0"><div class="chbxWrap"><label class="ckbox"><input class="selChk" value="' + $(this)[0].ContactId + '" type="checkbox"><span></span></label></div></td>' +
                '<td class="text-left h-100">' +
                '<div class="nameWrap">' +
                '<div class="nameAlpWrap">' +
                '<span class="nameAlpha" onclick=' + UCP + '>' + getFlatter + '</span>' +
                '</div>' +
                '<div class="nameTxtWrap editicon">' +
                '<span class="nameTxt" id="name_' + $(this)[0].ContactId + '">' + ($(this)[0].Name != null ? $(this)[0].Name : "") + '</span><i onclick="LeadsReportDetailsUtil.EditLeadDetails(' + $(this)[0].ContactId + ');" class="fa fa-pencil-square-o"></i>' +
                '</div>' +
                '</div>' +
                '</td>' +
                '<td id="email_' + $(this)[0].ContactId + '">' + ($(this)[0].EmailId != null ? $(this)[0].EmailId : "") + '</td>' +
                '<td id="phn_' + $(this)[0].ContactId + '">' + ($(this)[0].PhoneNumber != null ? $(this)[0].PhoneNumber : "") + IsWhatsAppOptINOut + '</td >' +
                '<td class="text-center verified" id="ui_EmailContactVified_' + i + '"><i title="' + exportVefified + '" class="' + verificationStatusImg + '" ' + IsVerify + '></i></td>' +
                '<td>' + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj($(this)[0].CreatedDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj($(this)[0].CreatedDate)) + '</td>' +
                '</tr>';

        });


        $("#ui_tblReportData").removeClass('no-data-records');
        $("#ui_tbodyReportData").html(reportTableTrs);
        ShowExportDiv(true);
        RowCheckboxClick();
        GetContactGroup();
    } else {
        ShowExportDiv(false);
        ShowPagingDiv(false);
    }
    HidePageLoading();
    CheckAccessPermission("ManageContact");
}

function BindFilterContents() {
    var bindselection = "";

    if (CleanText($.trim($("#e_input").val())).length > 0) {
        if (filter != null && filter != undefined && filter != "" && filter.length > 0) {
            bindselection += '<div id="1" class="vrAutocomplete" style="vertical-align: middle;"><span id="1" class="vnAutocomplete"><div class="vmAutocomplete" onclick="RemoveData(1);"></div><div class="vtAutocomplete">Search By ' + filter + ' = ' + CleanText($.trim($("#e_input").val())) + "</div></span></div>";
            $("#bindsel").html(bindselection);
        }
    }
    else {
        $("#bindsel").html("");
    }
}

function RemoveData(obj) {
    $("#e_input").val("");
    contactDetails.EmailId = contactDetails.PhoneNumber = contactDetails.Name = null;
    $("#" + obj).remove();
    $("#bindsel").html("");
    clearAll();
    CallBackFunction();
}

var filter = "Email";

$("#e_input").keypress(function (e) {
    if ((e.which && e.which === 13) || (e.keyCode && e.keyCode === 13)) {

        //if (TotalRowCount <= 0) {
        //    ShowErrorMessage(GlobalErrorList.Contact.NoRecordCount);
        //    return false;
        //}

        $(".filtwrpbar").addClass('hideDiv');
        ContactsReportBindingUtil.ResetMasterFilter();

        if (CleanText($.trim($("#e_input").val())).length == 0) {
            ShowErrorMessage(GlobalErrorList.Contact.SearchErrorValue);
            return false;
        }

        $(".subdivWrap").addClass('showDiv');
        $(".checkedCount,.visitorsCount").html(0);
        $(".selchbxall,.selChk").prop("checked", false);

        if (filter.indexOf("Email") > -1) {
            contactDetails.EmailId = CleanText($.trim($("#e_input").val()));
            contactDetails.PhoneNumber = null;
            contactDetails.Name = null;
            OffSet = 0;
            CallBackFunction();
        }
        else if (filter.indexOf("Phone") > -1) {
            contactDetails.PhoneNumber = CleanText($.trim($("#e_input").val()));
            contactDetails.EmailId = null;
            contactDetails.Name = null;
            OffSet = 0;
            CallBackFunction();
        }
        else if (filter.indexOf("Name") > -1) {
            contactDetails.PhoneNumber = null;
            contactDetails.EmailId = null;
            contactDetails.Name = CleanText($.trim($("#e_input").val()));
            OffSet = 0;
            CallBackFunction();
        }
    }
});

function filterBy(getfilter) {
    filter = getfilter;
    $('.filtwrpbar').addClass("hideDiv");

    if (filter.indexOf("Email") > -1) {

        $("#e_input").attr("placeholder", "Search EmailId");

        if (CleanText($.trim($("#e_input").val())).length > 0) {
            contactDetails.EmailId = CleanText($.trim($("#e_input").val()));
            contactDetails.PhoneNumber = null;
            contactDetails.Name = null;
            OffSet = 0;
        }
        else {
            contactDetails.EmailId = null;
            contactDetails.PhoneNumber = null;
            contactDetails.Name = null;
        }
        CallBackFunction();
    }
    else if (filter.indexOf("Phone") > -1) {

        $("#e_input").attr("placeholder", "Search Phone Number");

        if (CleanText($.trim($("#e_input").val())).length > 0) {
            contactDetails.PhoneNumber = CleanText($.trim($("#e_input").val()));
            contactDetails.EmailId = null;
            contactDetails.Name = null;
            OffSet = 0;
        }
        else {
            contactDetails.EmailId = null;
            contactDetails.PhoneNumber = null;
            contactDetails.Name = null;
        }
        CallBackFunction();
    } else if (filter.indexOf("Name") > -1) {
        $("#e_input").attr("placeholder", "Search Name");

        if (CleanText($.trim($("#e_input").val())).length > 0) {
            contactDetails.PhoneNumber = null;
            contactDetails.EmailId = null;
            contactDetails.Name = CleanText($.trim($("#e_input").val()));
            OffSet = 0;
        }
        else {
            contactDetails.EmailId = null;
            contactDetails.PhoneNumber = null;
            contactDetails.Name = null;
        }
        CallBackFunction();
    }
}

$(".searchIcon").click(function () {
    ShowPageLoading();
    if (CleanText($.trim($("#e_input").val())).length > 0) {
        $(".subdivWrap").addClass('showDiv');
        $(".checkedCount").html(0);
        $(".visitorsCount").html(0);
        $(".selchbxall,.selChk").prop("checked", false);

        if (filter.indexOf("Email") > -1) {
            contactDetails.EmailId = CleanText($.trim($("#e_input").val()));
            contactDetails.PhoneNumber = null;
            contactDetails.Name = null;
            OffSet = 0;
            CallBackFunction();
        }
        else if (filter.indexOf("Phone") > -1) {
            contactDetails.PhoneNumber = CleanText($.trim($("#e_input").val()));
            contactDetails.EmailId = null;
            contactDetails.Name = null;
            OffSet = 0;
            CallBackFunction();
        }
        else if (filter.indexOf("Name") > -1) {
            contactDetails.PhoneNumber = null;
            contactDetails.EmailId = null;
            contactDetails.Name = CleanText($.trim($("#e_input").val()));
            OffSet = 0;
            CallBackFunction();
        }
    }
    else {
        ShowErrorMessage(GlobalErrorList.Contact.SearchErrorValue);
        HidePageLoading();
        return false;
    }
});

$("#e_input").keyup(function (e) {
    if (e.which && e.which === 8 || e.keyCode && e.keyCode === 46)
        if (CleanText($.trim($("#e_input").val())).length == 0) {
            $("#e_input").val("");
            $("#1").remove();
            $("#bindsel").html("");
            clearAll();
            contactDetails.EmailId = contactDetails.PhoneNumber = contactDetails.Name = null;
            CallBackFunction();
        }
});

$(".selchbxall").click(function () {
    if ($(this).is(":checked")) {
        $(".selChk").prop('checked', true);
    } else {
        $(".selChk").prop('checked', false);
    }
    checkBoxClickCount = $('.selChk').filter(':checked').length;

    if (checkBoxClickCount > 0) {
        $(".subdivWrap").addClass('showDiv');
    }
    else if (checkBoxClickCount <= 0 && CleanText($.trim($("#e_input").val())).length == 0) {
        $(".subdivWrap").removeClass('showDiv');
    }
    $(".checkedCount").html(checkBoxClickCount);
    $(".visitorsCount").html(checkBoxClickCount);
});


var checkBoxClickCount, addGroupNameList;
function RowCheckboxClick() {
    $(document.body).on('click', '.selChk', function () {
        checkBoxClickCount = $('.selChk').filter(':checked').length;

        if (checkBoxClickCount > 0) {
            $(".subdivWrap").addClass('showDiv');
        }
        else if (checkBoxClickCount <= 0 && CleanText($.trim($("#e_input").val())).length == 0) {
            $(".subdivWrap").removeClass('showDiv');
        }
        $(".checkedCount").html(checkBoxClickCount);
        $(".visitorsCount").html(checkBoxClickCount);
    });
}

var chkArrayContactId = new Array();
var PresentContactGroupId = new Array();

$("#addtogroup").click(function () {
    ShowPageLoading();
    PresentContactGroupId = new Array();

    //$('.select2-selection__rendered li').each(function (i) {
    //    if ($(this).attr('value') != undefined)
    //        if (PresentContactGroupId.indexOf($(this).attr('value')) == -1) { PresentContactGroupId.push($(this).attr('value')); }
    //});

    PresentContactGroupId = $("#addgroupoperation").val();
    if (PresentContactGroupId == undefined || PresentContactGroupId == null || PresentContactGroupId.length == 0) {
        ShowErrorMessage(GlobalErrorList.Contact.selectgroups);
        HidePageLoading();
        return;
    }

    var deleteGroup = [];
    var diffArray = differenceOf2Arrays(PreContactGroupId, PresentContactGroupId);
    for (var d = 0; d < diffArray.length; d++) {
        if (PreContactGroupId.indexOf(diffArray[d]) > -1 && PresentContactGroupId.indexOf(diffArray[d]) == -1) {
            deleteGroup.push(diffArray[d]);
        }
    }

    if (chkArrayContactId.length > 0) {
        $.ajax({
            type: "POST",
            url: "/ManageContact/Contact/AddToGroup",
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'contact': chkArrayContactId, 'Groups': PresentContactGroupId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response > 0) {
                    ShowSuccessMessage(GlobalErrorList.Contact.addedtogroup);
                }
                else {
                    ShowErrorMessage(GlobalErrorList.Contact.error);
                }

                if (deleteGroup != undefined && deleteGroup != null && deleteGroup.length > 0) {
                    $.ajax({
                        type: "POST",
                        url: "/ManageContact/Contact/DeleteFromGroup",
                        data: JSON.stringify({ 'contact': chkArrayContactId, 'Groups': deleteGroup }),
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function (response) {
                            if (response > 0) {
                                console.log("deleted group successfully");
                            }
                            else {
                                console.log("Something goes wrong, for delete group");
                            }
                            clearAll();
                            HidePageLoading();
                        },
                        error: ShowAjaxError
                    });
                } else {
                    clearAll();
                    HidePageLoading();
                }

                $("#addremovegroup").modal('hide');
            },
            error: ShowAjaxError
        });

    } else {
        ShowErrorMessage(GlobalErrorList.Contact.selectvisitors);
        clearAll();
        HidePageLoading();
    }

    //if (chkArrayContactId.length > 0 && PresentContactGroupId.length > 0) {
    //    $.ajax({
    //        type: "POST",
    //        url: "/Contact/AddToGroup",
    //        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'contact': chkArrayContactId, 'Groups': PresentContactGroupId }),
    //        contentType: "application/json; charset=utf-8",
    //        dataType: "json",
    //        success: function (response) { //OnSuccessMachine,
    //            if (response > 0)
    //                ShowSuccessMessage(GlobalErrorList.Contact.addedtogroup);
    //            else
    //                ShowErrorMessage(GlobalErrorList.Contact.error);

    //            $("#addremovegroup").modal('hide');
    //        },
    //        error: ShowAjaxError
    //    });
    //} else {
    //    ShowErrorMessage(GlobalErrorList.Contact.selectvisitors);
    //}

    //if (chkArrayContactId.length > 0 && deleteGroup.length > 0) {
    //    $.ajax({
    //        type: "POST",
    //        url: "/Contact/DeleteFromGroup",
    //        data: JSON.stringify({ 'contact': chkArrayContactId, 'Groups': deleteGroup }),
    //        contentType: "application/json; charset=utf-8",
    //        dataType: "json",
    //        success: function (response) { //OnSuccessMachine,
    //            if (response > 0)
    //                console.log("deleted group successfully");
    //            else
    //                console.log("Something goes wrong, for delete group");
    //        },
    //        error: ShowAjaxError
    //    });
    //}

    //clearAll();
})

$("#unsubconts").click(function () {
    ShowPageLoading();
    chkArrayContactId = new Array();
    $(".selChk:checked").each(function () {
        chkArrayContactId.push(parseInt($(this).val()));
    });

    var emilchk = $("#email_list").is(':checked') ? true : false;
    var smschk = $("#sms_list").is(':checked') ? true : false;

    if (emilchk == true || smschk == true) {
        if (chkArrayContactId.length > 0) {
            $.ajax({
                type: "POST",
                url: "/ManageContact/Contact/AddToUnsubscribe",
                data: JSON.stringify({ 'contact': chkArrayContactId, 'emilchk': emilchk, 'smschk': smschk }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) { //OnSuccessMachine,
                    if (response > 0) {
                        ShowSuccessMessage(GlobalErrorList.Contact.unsubscribed);
                    }
                    else {
                        ShowErrorMessage(GlobalErrorList.Contact.error);
                    }
                    $("#confirmunsub").modal('hide');
                    HidePageLoading();
                    clearAll();
                },
                error: ShowAjaxError
            });
        }
        else {
            ShowErrorMessage(GlobalErrorList.Contact.selectvisitors);
            HidePageLoading();
        }
    }
    else {
        ShowErrorMessage(GlobalErrorList.Contact.unsubscribeselecterror);
        HidePageLoading();
    }
})


$("#invalidateCont").click(function () {
    chkArrayContactId = new Array();
    $(".selChk:checked").each(function () {
        chkArrayContactId.push(parseInt($(this).val()));
    });


    if (chkArrayContactId.length > 0) {
        $.ajax({
            type: "POST",
            url: "/ManageContact/Contact/AddToInvalidate",
            data: JSON.stringify({ 'contact': chkArrayContactId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response > 0) {
                    ShowSuccessMessage(GlobalErrorList.Contact.Invalidated);
                    CallBackFunction();
                }
                else
                    ShowErrorMessage(GlobalErrorList.Contact.error);
            },
            error: ShowAjaxError
        });
    } else {
        ShowErrorMessage(GlobalErrorList.Contact.selectvisitors);
    }
    clearAll();
})


function clearAll() {
    $(".checkedCount").html(0);
    $(".visitorsCount").html(0);
    $(".selchbxall,.selChk").prop("checked", false);
    $(".subdivWrap").removeClass("showDiv");
    $("#addgroupoperation").html('');
}

var PreContactGroupId = [];
function GetContactGroup() {
    PreContactGroupId = [];
    chkArrayContactId = new Array();
    $(".selChk:checked").each(function () {
        chkArrayContactId.push(parseInt($(this).val()));
    });

    if (chkArrayContactId.length > 0) {
        $.ajax({
            type: "POST",
            url: "/ManageContact/Contact/GetGroupNameByContacts",
            data: JSON.stringify({ 'contact': chkArrayContactId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                $.each(response, function (i) {
                    if (PreContactGroupId.indexOf($(this)[0].Id) == -1) { PreContactGroupId.push($(this)[0].Id) };
                });

                BindGroupName();
            },
            error: ShowAjaxError
        });
    }
}
var ContactsReportBindingUtil = {

    ContactGetMaxCount: function () {
        let creategroupchk = 0;
        if ($("#ChkSave").is(':checked')) {
            creategroupchk = 1;

            if (filterLead.Name == '') {
                filterLead.Name = 'Select Option';
            }
            if (filterLead.LastName == '') {
                filterLead.LastName = 'Select Option';
            }
            if (filterLead.Gender == '') {
                filterLead.Gender = 'Select Option';
            }
            if (filterLead.MaritalStatus == '') {
                filterLead.MaritalStatus = 'Select Option';
            }
        }
        SetNoRecordContent('ui_tblReportData', 6, 'ui_tbodyReportData')

        $.ajax({
            url: "/ManageContact/Contact/MaxCountMasterFilter",
            type: 'POST',

            data: JSON.stringify({ 'contact': filterLead, 'OffSet': OffSet, 'FetchNext': FetchNext, 'creategroupchk': creategroupchk, 'Newgroupname': $("#ui_txtName").val(), 'Newgroupdescription': $("#ui_txtdescription").val(), 'filteredgroupid': filterLead.GroupId, 'FromDate': filterLead.StartDate, 'ToDate': filterLead.EndDate }),

            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {

                TotalRowCount = 0;
                if (response.returnVal != undefined && response.returnVal != null) {
                    TotalRowCount = response.returnVal;
                    $("#spnCount").html(TotalRowCount);
                }
                if (creategroupchk == 1) {
                    if (response.newgroupid == undefined || response.newgroupid == null || response.newgroupid == -1) {
                        ShowErrorMessage(GlobalErrorList.Manage_Group.groupalreadyadded_error);
                    }
                    else {
                        ShowSuccessMessage(GlobalErrorList.Manage_Group.searchandaddcontacttogroup_message);
                    }
                }
                if (TotalRowCount > 0) {
                    ContactsReportBindingUtil.ContactGetReport();
                }
                else {
                    SetNoRecordContent('ui_tblReportData', 6, 'ui_tbodyReportData');
                    HidePageLoading();
                }
            },
            error: ShowAjaxError
        });
    },
    ContactGetReport: function () {
        masterfilterid = 1;
        let creategroupchk = 0;
        if ($("#ChkSave").is(':checked')) {
            creategroupchk = 1;
            if ($("#ui_txtName").val().length == 0) {
                ShowErrorMessage(GlobalErrorList.MyReports.ReportName_ErrorMessage);
                return false;
            }
        }

        FetchNext = GetNumberOfRecordsPerPage();
        $.ajax({
            url: "/ManageContact/Contact/GetCustomContactDetails",
            type: 'Post',
            data: JSON.stringify({ 'contact': filterLead, 'OffSet': OffSet, 'FetchNext': FetchNext, 'groupid': filterLead.GroupId, 'FromDate': filterLead.StartDate, 'ToDate': filterLead.EndDate }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: BindReport,
            error: ShowAjaxError
        });
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
        filterLead.OrderBy = 3;

    },



};
$(".ion-android-close").click(function () {
    $(".filtwrpbar").addClass("hideDiv");
    $("#e_input").val("");
    contactDetails.EmailId = contactDetails.PhoneNumber = contactDetails.Name = null;
    $("#bindsel").html("");
    clearAll();

    ContactsReportBindingUtil.ResetMasterFilter();
    CallBackFunction();
});



function BindGroupName() {
    //var ulSGrp = $(".select2-selection__rendered");
    //ulSGrp.empty()
    //var ulGrp = $("#addgroupoperation");
    //ulGrp.empty()

    $("#addgroupoperation").html('');

    $.ajax({
        type: "POST",
        url: "/ManageContact/Group/GetGroupsByStaticOrDynamic",
        data: JSON.stringify({ 'accountId': Plumb5AccountId, GroupType: 1 }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response != null && response.GroupDetails != null) {
                $.each(response.GroupDetails, function (i) {
                    var select = PreContactGroupId.indexOf(+$(this)[0].Id) > -1 ? "Selected" : "";
                    $("#addgroupoperation").append($('<option value="' + $(this)[0].Id + '" ' + select + '>' + $(this)[0].Name + '</option>'));
                });
            }
            HidePageLoading();
        },
        error: ShowAjaxError
    });
}


function openGroup() {
    ShowPageLoading();

    var ContactSelectedCount = parseInt($(".checkedCount").html());

    if (ContactSelectedCount <= 0) {
        ShowErrorMessage(GlobalErrorList.Contact.contactselecterror);
        HidePageLoading();
        return false;
    }

    $("#addremovegroup").modal('show');
    setTimeout(function () { GetContactGroup(); }, 2000);
}

function differenceOf2Arrays(array1, array2) {
    var temp = [];
    array1 = array1.toString().split(',').map(Number);
    array2 = array2.toString().split(',').map(Number);

    for (var i in array1) {
        if (array2.indexOf(array1[i]) === -1) temp.push(array1[i]);
    }
    for (i in array2) {
        if (array1.indexOf(array2[i]) === -1) temp.push(array2[i]);
    }
    return temp.sort((a, b) => a - b);
}

$('#ui_btnShowCreateContact').click(function () {
    $('#ui_btn_SubmitCreateContact').attr("BindType", "NEW");
    $("#ui_divContactPopUp").removeClass("hideDiv");
    $(".popuptitle h6").text("Create Lead");
    $(".showcontactdetials").addClass("hideDiv");
    $("#dv_btncreatefooter").removeClass("hideDiv");
    $("#ui_formContactProperty").removeClass("hideDiv");
    $("#dv_verifyemail").removeClass("hideDiv");
    $("#ui_isemail_No").prop("checked", true);
});

$('#contactdetails').click(function () {
    $('#Totalmailcount,#Totalphonenumbercount,#verifiedmailcount,#unverifiedmailcount,#invalidmailcount,#mailsubscribecount,#mailunsubscribecount,#smssubscribecount,#smsunsubscribecount,#whatsappsubscribecount,#whatsappunsubscribecount').text(0);
    $("#ui_divContactPopUp").removeClass("hideDiv");
    $(".popuptitle h6").text("Contact Details");
    $("#ui_formContactProperty").addClass("hideDiv");
    $(".showcontactdetials").removeClass("hideDiv");
    $("#dv_btncreatefooter").addClass("hideDiv");
    $("#dv_verifyemail").addClass("hideDiv");
    $("#ui_isemail_No").prop("checked", true);
    GetContactInfoDetail();
});

function GetContactInfoDetail() {
    ShowPageLoading();
    $.ajax({
        url: "/ManageContact/Group/GetContactInfoDetails",
        type: 'POST',
        data: JSON.stringify({ 'accountId': Plumb5AccountId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response != null) {
                $('#Totalmailcount').text(response.TotalEmail);
                $('#Totalphonenumbercount').text(response.TotalPhonenumber);
                $('#verifiedmailcount').text(response.Verified);
                $('#unverifiedmailcount').text(response.UnVerified);
                $('#invalidmailcount').text(response.InValid);
                $('#mailsubscribecount').text(response.MailSubscribe);
                $('#mailunsubscribecount').text(response.Unsubscribe);
                $('#smssubscribecount').text(response.SmsSubscribe);
                $('#smsunsubscribecount').text(response.SmsUnsubscribe);
                $('#whatsappsubscribecount').text(response.WhatsAppSubscribe);
                $('#whatsappunsubscribecount').text(response.WhatsAppUnsubscribe);
            }
            HidePageLoading();
        },
        error: ShowAjaxError
    });
}

//$(".createbtn-pop").click(() => {
//    ClearCreateContactFields();
//    $('#ui_txt_EmailId').attr('data-emailedit', 'false');
//    $('#ui_txt_PhoneNumber').attr('data-phonenumedit', 'false');
//    $("#ui_btn_SubmitCreateContact").html("Create Contact");
//    $("#ui_btn_SubmitCreateContact").removeAttr("ContactId");
//    $(".popuptitle h6").html("Create Contact");
//    $(".addleadmoredetwrp,.lmsspinner,.ion-ios-checkmark-outline").addClass("hideDiv");
//    $(".lmsbtn-create").attr("disabled", "disabled");
//    $("#dv_CreateContact").removeClass("hideDiv");
//    $("#lmscreatelead").show();
//});

function openUnsubcribePopUp() {
    var ContactSelectedCount = parseInt($(".checkedCount").html());

    $("#email_list").prop('checked', false);
    $("#sms_list").prop('checked', false);

    if (ContactSelectedCount <= 0) {
        ShowErrorMessage(GlobalErrorList.Contact.contactselecterror);
        HidePageLoading();
        return false;
    }

    $("#confirmunsub").modal('show');
}

function openInvalidatePopUp() {
    var ContactSelectedCount = parseInt($(".checkedCount").html());

    if (ContactSelectedCount <= 0) {
        ShowErrorMessage(GlobalErrorList.Contact.contactselecterror);
        HidePageLoading();
        return false;
    }

    $("#confirmInvalidate").modal('show');
}

$("#btnCancelUnsubscribe,#btnCloseUnsubscribe").click(function () {
    $("#confirmunsub").modal('hide');
    HidePageLoading();
});

$("#btnCancelUnsubscribe,#btnCloseInvalidate").click(function () {
    $("#confirmInvalidate").modal('hide');
    HidePageLoading();
});

$("#btnCloseAddRemovegrp,#btnCancelAddRemovegrp").click(function () {
    $("#addremovegroup").modal('hide');
    $("#addgroupoperation").html('');
    clearAll();
    HidePageLoading();
});

function VerifyEmailContact(contactId, index) {
    ShowPageLoading();
    $.ajax({
        url: "/ManageContact/Contact/VerifyEmailContact",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'ContactId': contactId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response != null && response.Result) {
                $(`#ui_EmailContactVified_${index}`).empty();
                if (response.IsVerifiedMailId == 1) {
                    $(`#ui_EmailContactVified_${index}`).html(`<i title="Valid" class="icon ion-android-checkmark-circle verifsuccess"></i >`);
                } else if (response.IsVerifiedMailId == 0) {
                    $(`#ui_EmailContactVified_${index}`).html(`<i title="Invalid" class="icon ion-android-alert verifalert"></i >`);
                }
                ShowSuccessMessage(response.ErrorMessage);
            } else {
                ShowErrorMessage(response.ErrorMessage);
            }
            HidePageLoading();
        },
        error: ShowAjaxError
    });
}

//Search text
$(".contsearchfocus")
    .on("focus", function () {
        $(this).parent().addClass("w-300");
    })
    .on("blur", function () {
        if ($(".contsearchfocus").val().length < 15)
            $(this).parent().removeClass("w-300");
    });


//Validate Contacts

function openValidatePopUp() {
    var ValidateContactCount = parseInt($(".checkedCount").html());

    if (ValidateContactCount <= 0) {
        ShowErrorMessage(GlobalErrorList.Contact.contactselecterror);
        HidePageLoading();
        return false;
    }

    $("#confirmValidate").modal('show');
}



function ShowMasterFilterPopUp() {
    $(".popuptitle h6").html("MASTER FILTER");
    $('[id^="trsearch"]:not(:first)').remove();

    $('#dvAddOrUpdateReports').removeClass("hideDiv");
    $(".lmscustomrepfildanswrp").addClass("hideDiv");
    $('#div_stagesource').addClass("hideDiv");
    $('#div_handleorder').addClass("hideDiv");
    $('#checkbox').html("Create New Group")
    $('#ui_name').html("Group Name")
    $('#ChkSave').attr('chkid', '1');
    $('#divui_description').removeClass("hideDiv");
    HidePageLoading();
};

$("#validateCont").click(function () {
    chkArrayContactId = new Array();
    $(".selChk:checked").each(function () {
        chkArrayContactId.push(parseInt($(this).val()));
    });

    if (chkArrayContactId.length > 0) {
        ShowPageLoading();
        $.ajax({
            type: "POST",
            url: "/ManageContact/Contact/VerifyEmailContactList",
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'ContactId': chkArrayContactId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response.Result) {
                    ShowSuccessMessage(response.Message);
                    CallBackFunction();
                }
                else
                    ShowErrorMessage(response.ErrorMessage);
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    } else {
        ShowErrorMessage(GlobalErrorList.Contact.selectvisitors);
    }
    clearAll();
})

