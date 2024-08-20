var GroupId = 0;
var PreContactGroupId = [];

var contactDetails = {
    ContactId: 0, EmailId: "", PhoneNumber: "", Name: "", FacebookUrl:""
};

$(document).ready(function () {
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
    facebookContactUtil.MaxCount();
}

function CallBackPaging() {
    ShowPageLoading();
    CurrentRowCount = 0;
    facebookContactUtil.GetReport();
}

var facebookContactUtil = {
    MaxCount: function () {
        facebookContactUtil.BindFilterContents();
        $.ajax({
            url: "/FacebookContacts/MaxCount",
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
                    facebookContactUtil.GetReport();
                }
                else {
                    SetNoRecordContent('ui_tblReportData', 6, 'ui_tbodyReportData');
                    HidePageLoading();
                }
            },
            error: ShowAjaxError
        });
    },
    GetReport: function () {
        facebookContactUtil.BindFilterContents();
        FetchNext = GetNumberOfRecordsPerPage();
        $.ajax({
            url: "/FacebookContacts/GetDetails",
            type: 'Post',
            data: JSON.stringify({ 'contact': contactDetails, 'FetchNext': FetchNext, 'OffSet': OffSet, 'GroupId': GroupId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(response) {
                facebookContactUtil.BindReport(response);
            },
            error: ShowAjaxError
        });
    },
    BindReport: function (response) {
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
                    IsVerify = `onclick=facebookContactUtil.VerifyEmailContact(${$(this)[0].ContactId},${i})`;
                } else if ($(this)[0].IsVerifiedMailId == "0") {
                    verificationStatusImg = "icon ion-android-alert verifalert";
                    exportVefified = "Invalid";
                }
                else if ($(this)[0].IsVerifiedMailId == "1") {
                    verificationStatusImg = "icon ion-android-checkmark-circle verifsuccess";
                    exportVefified = "Valid";
                }

                GrpContactId.push($(this)[0].ContactId);
                reportTableTrs += '<tr>' +

                    '<td  class="td-wid-5 pl-0"><div class="chbxWrap"><label class="ckbox"><input class="selChk" value="' + $(this)[0].ContactId + '" type="checkbox"><span></span></label></div></td>' +
                    '<td class="text-left h-100">' +
                    '<div class="nameWrap">' +
                    '<div class="nameAlpWrap">' +
                    '<span class="nameAlpha" onclick=' + UCP + '>' + getFlatter + '</span>' +
                    '</div>' +
                    '<div class="nameTxtWrap">' +
                    '<span class="nameTxt">' + ($(this)[0].Name != null ? $(this)[0].Name : "") + '</span>' +
                    '</div>' +
                    '</div>' +
                    '</td>' +
                    '<td>' + ($(this)[0].FacebookUrl != null ? $(this)[0].FacebookUrl : "") + '</td>' +
                    '<td>' + ($(this)[0].EmailId != null ? $(this)[0].EmailId : "") + '</td>' +
                    '<td>' + ($(this)[0].PhoneNumber != null ? $(this)[0].PhoneNumber : "") + '</td>' +
                    '<td class="text-center verified" id="ui_EmailContactVified_' + i + '"><i title="' + exportVefified + '" class="' + verificationStatusImg + '" ' + IsVerify + '></i></td>' +
                    '<td>' + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj($(this)[0].CreatedDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj($(this)[0].CreatedDate)) + '</td>' +
                    '</tr>';

            });


            $("#ui_tblReportData").removeClass('no-data-records');
            $("#ui_tbodyReportData").html(reportTableTrs);
             RowCheckboxClick();
           facebookContactUtil.GetContactGroup();
        } else {
            ShowPagingDiv(false);
        }
        HidePageLoading();
    //CheckAccessPermission("ManageContact");
    },
    openGroup: function () {
        ShowPageLoading();

        var ContactSelectedCount = parseInt($(".checkedCount").html());

        if (ContactSelectedCount <= 0) {
            ShowErrorMessage(GlobalErrorList.FacebookContacts.contactselecterror);
            HidePageLoading();
            return false;
        }

        $("#addremovegroup").modal('show');
        setTimeout(function () { facebookContactUtil.GetContactGroup(); }, 2000);
    },
    GetContactGroup: function () {
        PreContactGroupId = [];
        chkArrayContactId = new Array();
        $(".selChk:checked").each(function () {
            chkArrayContactId.push(parseInt($(this).val()));
        });

        if (chkArrayContactId.length > 0) {
            $.ajax({
                type: "POST",
                url: "/FacebookContacts/GetGroupNameByContacts",
                data: JSON.stringify({ 'contact': chkArrayContactId }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) {
                    $.each(response, function (i) {
                        if (PreContactGroupId.indexOf($(this)[0].Id) == -1) { PreContactGroupId.push($(this)[0].Id) };
                    });

                    facebookContactUtil.BindGroupName();
                },
                error: ShowAjaxError
            });
        }
    },
    BindGroupName: function () {
        var ulSGrp = $(".select2-selection__rendered");
        ulSGrp.empty()
        var ulGrp = $("#addgroupoperation");
        ulGrp.empty()

        $.ajax({
            type: "POST",
            url: "/FacebookContacts/GetGroupName",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                $.each(response, function (i) {
                    var select = PreContactGroupId.indexOf(+$(this)[0].Id) > -1 ? "Selected" : "";
                    $("#addgroupoperation").append($('<option value="' + $(this)[0].Id + '" ' + select + '>' + $(this)[0].Name + '</option>'));
                });
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },

    AddtoGroup: function () {
        PresentContactGroupId = new Array();

        //$('.select2-selection__rendered li').each(function (i) {
        //    if ($(this).attr('value') != undefined)
        //        if (PresentContactGroupId.indexOf($(this).attr('value')) == -1) { PresentContactGroupId.push($(this).attr('value')); }
        //});

        PresentContactGroupId = $("#addgroupoperation").val();
        if (PresentContactGroupId == null) {
            ShowErrorMessage(GlobalErrorList.FacebookContacts.selectgroups);
            return;
        }
        ShowPageLoading();
        //PreContactGroupId.push("13");
        //PresentContactGroupId = new Array();
        // PresentContactGroupId.push("13");
        // alert("Pre: " + PreContactGroupId);
        //alert("Present: " + PresentContactGroupId);

        var deleteGroup = [];
        var diffArray = facebookContactUtil.DifferenceOf2Arrays(PreContactGroupId, PresentContactGroupId);
        for (var d = 0; d < diffArray.length; d++) {
            if (PreContactGroupId.indexOf(diffArray[d]) > -1 && PresentContactGroupId.indexOf(diffArray[d]) == -1) {
                deleteGroup.push(diffArray[d]);
            }
        }

        if (chkArrayContactId.length > 0 && PresentContactGroupId.length > 0) {
            $.ajax({
                type: "POST",
                url: "/FacebookContacts/AddToGroup",
                data: JSON.stringify({ 'accountId': Plumb5AccountId, 'contact': chkArrayContactId, 'Groups': PresentContactGroupId }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) { //OnSuccessMachine,
                    if (response > 0)
                        ShowSuccessMessage(GlobalErrorList.FacebookContacts.addedtogroupsuccess);
                    else
                        ShowErrorMessage(GlobalErrorList.FacebookContacts.error);

                    $("#addremovegroup").modal('hide');
                    HidePageLoading();
                },
                error: ShowAjaxError
            });
        } else {
            ShowErrorMessage(GlobalErrorList.FacebookContacts.selectvisitors);
            HidePageLoading();
        }

        if (chkArrayContactId.length > 0 && deleteGroup.length > 0) {
            $.ajax({
                type: "POST",
                url: "/Contact/DeleteFromGroup",
                data: JSON.stringify({ 'contact': chkArrayContactId, 'Groups': deleteGroup }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) { //OnSuccessMachine,
                    if (response > 0)
                        console.log("deleted group successfully");
                    else
                        console.log("Something goes wrong, for delete group");
                    HidePageLoading();
                },
                error: ShowAjaxError
            });
        }
       
        facebookContactUtil.clearAll();
    },
    VerifyEmailContact: function (contactId, index) {
        ShowPageLoading();
        $.ajax({
            url: "/FacebookContacts/VerifyEmailContact",
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
    },
    openUnsubcribePopUp: function () {
        var ContactSelectedCount = parseInt($(".checkedCount").html());

        $("#email_list").prop('checked', false);
        $("#sms_list").prop('checked', false);

        if (ContactSelectedCount <= 0) {
            ShowErrorMessage(GlobalErrorList.FacebookContacts.contactselecterror);
            HidePageLoading();
            return false;
        }

        $("#confirmunsub").modal('show');
    },
    AddtoUnsubscribe: function () {
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
                    url: "/FacebookContacts/AddToUnsubscribe",
                    data: JSON.stringify({ 'contact': chkArrayContactId, 'emilchk': emilchk, 'smschk': smschk }),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (response) { //OnSuccessMachine,
                        if (response > 0) {
                            ShowSuccessMessage(GlobalErrorList.FacebookContacts.unsubscribed);
                        }
                        else {
                            ShowErrorMessage(GlobalErrorList.FacebookContacts.error);
                        }
                        $("#confirmunsub").modal('hide');
                        HidePageLoading();
                        facebookContactUtil.clearAll();
                    },
                    error: ShowAjaxError
                });
            }
            else {
                ShowErrorMessage(GlobalErrorList.FacebookContacts.selectvisitors);
                HidePageLoading();
            }
        }
        else {
            ShowErrorMessage(GlobalErrorList.FacebookContacts.unsubscribeselecterror);
            HidePageLoading();
        }
    },
    openInvalidatePopUp: function () {
            var ContactSelectedCount = parseInt($(".checkedCount").html());

            if (ContactSelectedCount <= 0) {
                ShowErrorMessage(GlobalErrorList.FacebookContacts.contactselecterror);
                HidePageLoading();
                return false;
            }

            $("#confirmInvalidate").modal('show');

    },
    AddToInvalidate: function () {
        chkArrayContactId = new Array();
        $(".selChk:checked").each(function () {
            chkArrayContactId.push(parseInt($(this).val()));
        });


        if (chkArrayContactId.length > 0) {
            $.ajax({
                type: "POST",
                url: "/FacebookContacts/AddToInvalidate",
                data: JSON.stringify({ 'contact': chkArrayContactId }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) {
                    if (response > 0) {
                        ShowSuccessMessage(GlobalErrorList.FacebookContacts.Invalidated);
                        CallBackFunction();
                    }
                    else
                        ShowErrorMessage(GlobalErrorList.FacebookContacts.error);
                },
                error: ShowAjaxError
            });
        } else {
            ShowErrorMessage(GlobalErrorList.FacebookContacts.selectvisitors);
        }
        facebookContactUtil.clearAll();
    },
    filterBy: function (getfilter) {
        filter = getfilter;

        if (filter.indexOf("Email") > -1) {

            $("#e_input").attr("placeholder", "Search EmailId");

            if (CleanText($.trim($("#e_input").val())).length > 0) {
                contactDetails.EmailId = CleanText($.trim($("#e_input").val()));
                contactDetails.PhoneNumber = null;
                contactDetails.Name = null;
                contactDetails.FacebookUrl = null;
                OffSet = 0;
            }
            else {
                contactDetails.EmailId = null;
                contactDetails.PhoneNumber = null;
                contactDetails.Name = null;
                contactDetails.FacebookUrl = null;
            }
            CallBackFunction();
        }
        else if (filter.indexOf("Phone") > -1) {

            $("#e_input").attr("placeholder", "Search Phone Number");

            if (CleanText($.trim($("#e_input").val())).length > 0) {
                contactDetails.PhoneNumber = CleanText($.trim($("#e_input").val()));
                contactDetails.EmailId = null;
                contactDetails.Name = null;
                contactDetails.FacebookUrl = null;
                OffSet = 0;
            }
            else {
                contactDetails.EmailId = null;
                contactDetails.PhoneNumber = null;
                contactDetails.Name = null;
                contactDetails.FacebookUrl = null;
            }
            CallBackFunction();
        }
        else if (filter.indexOf("PageName") > -1) {
            $("#e_input").attr("placeholder", "Search Page Name");

            if (CleanText($.trim($("#e_input").val())).length > 0) {
                contactDetails.PhoneNumber = null;
                contactDetails.EmailId = null;
                contactDetails.Name = null;
                contactDetails.FacebookUrl = CleanText($.trim($("#e_input").val()));
                OffSet = 0;
            }
            else {
                contactDetails.EmailId = null;
                contactDetails.PhoneNumber = null;
                contactDetails.Name = null;
                contactDetails.FacebookUrl = null;
            }
            CallBackFunction();
        }
        else if (filter.indexOf("Name") > -1) {
            $("#e_input").attr("placeholder", "Search Name");

            if (CleanText($.trim($("#e_input").val())).length > 0) {
                contactDetails.PhoneNumber = null;
                contactDetails.EmailId = null;
                contactDetails.FacebookUrl = null;
                contactDetails.Name = CleanText($.trim($("#e_input").val()));
                OffSet = 0;
            }
            else {
                contactDetails.EmailId = null;
                contactDetails.PhoneNumber = null;
                contactDetails.Name = null;
                contactDetails.FacebookUrl = null;
            }
            CallBackFunction();
        }
      
    },
    BindFilterContents: function () {
        var bindselection = "";

        if (CleanText($.trim($("#e_input").val())).length > 0) {
            if (filter != null && filter != undefined && filter != "" && filter.length > 0) {
                bindselection += '<div id="1" class="vrAutocomplete" style="vertical-align: middle;"><span id="1" class="vnAutocomplete"><div class="vmAutocomplete" onclick="facebookContactUtil.RemoveData(1);"></div><div class="vtAutocomplete">Search By ' + filter + ' = ' + CleanText($.trim($("#e_input").val())) + "</div></span></div>";
                $("#bindsel").html(bindselection);
            }
        }
        else {
            $("#bindsel").html("");
        }
    },
    SearchByEmailPhoneName: function () {
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
                contactDetails.FacebookUrl = null;
                OffSet = 0;
                CallBackFunction();
            }
            else if (filter.indexOf("Phone") > -1) {
                contactDetails.PhoneNumber = CleanText($.trim($("#e_input").val()));
                contactDetails.EmailId = null;
                contactDetails.Name = null;
                contactDetails.FacebookUrl = null;
                OffSet = 0;
                CallBackFunction();
            }
            else if (filter.indexOf("PageName") > -1) {
                contactDetails.PhoneNumber = null;
                contactDetails.EmailId = null;
                contactDetails.Name = null;
                contactDetails.FacebookUrl = CleanText($.trim($("#e_input").val()));
                OffSet = 0;
                CallBackFunction();
            }
            else if (filter.indexOf("Name") > -1) {
                contactDetails.PhoneNumber = null;
                contactDetails.EmailId = null;
                contactDetails.FacebookUrl = null;
                contactDetails.Name = CleanText($.trim($("#e_input").val()));
                OffSet = 0;
                CallBackFunction();
            }
            
        }
        else {
            ShowErrorMessage(GlobalErrorList.FacebookContacts.SearchErrorValue);
            HidePageLoading();
            return false;
        }
    },
    DifferenceOf2Arrays: function (array1, array2) {
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
    },
    RemoveData: function (obj) {
        $("#e_input").val("");
        contactDetails.EmailId = contactDetails.PhoneNumber = contactDetails.Name = contactDetails.FacebookUrl = null;
        $("#" + obj).remove();
        $("#bindsel").html("");
        facebookContactUtil.clearAll();
        CallBackFunction();
    },
    clearAll: function () {
        $(".checkedCount").html(0);
        $(".visitorsCount").html(0);
        $(".selchbxall,.selChk").prop("checked", false);
        $(".subdivWrap").removeClass("showDiv");
    }
}

//Select All Contacts

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
    $('.selChk').click(function () {
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



//Add and Remove from Group

$("#addtogroup").click(function () {
    facebookContactUtil.AddtoGroup();
});

//Contacts Unsubscribe
$("#unsubconts").click(function () {
    facebookContactUtil.AddtoUnsubscribe();
});

//Contacts Invalidate

$("#invalidateCont").click(function () {
    facebookContactUtil.AddToInvalidate();
});

//Close pop up
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
    HidePageLoading();
});

//Search by email,phone or name
$(".searchIcon").click(function () {
    facebookContactUtil.SearchByEmailPhoneName();
});

$("#e_input").keyup(function (e) {
    if (e.which && e.which === 8 || e.keyCode && e.keyCode === 46)
        if (CleanText($.trim($("#e_input").val())).length == 0) {
            $("#e_input").val("");
            $("#1").remove();
            $("#bindsel").html("");
            clearAll();
            contactDetails.EmailId = contactDetails.PhoneNumber = contactDetails.Name = contactDetails.FacebookUrl = null;
            CallBackFunction();
        }
});

var filter = "Email";

$("#e_input").keypress(function (e) {
    if ((e.which && e.which === 13) || (e.keyCode && e.keyCode === 13)) {

        //if (TotalRowCount <= 0) {
        //    ShowErrorMessage(GlobalErrorList.FacebookContacts.NoRecordCount);
        //    return false;
        //}

        if (CleanText($.trim($("#e_input").val())).length == 0) {
            ShowErrorMessage(GlobalErrorList.FacebookContacts.SearchErrorValue);
            return false;
        }

        $(".subdivWrap").addClass('showDiv');
        $(".checkedCount,.visitorsCount").html(0);
        $(".selchbxall,.selChk").prop("checked", false);

        if (filter.indexOf("Email") > -1) {
            contactDetails.EmailId = CleanText($.trim($("#e_input").val()));
            contactDetails.PhoneNumber = null;
            contactDetails.Name = null;
            contactDetails.FacebookUrl = null;
            OffSet = 0;
            CallBackFunction();
        }
        else if (filter.indexOf("Phone") > -1) {
            contactDetails.PhoneNumber = CleanText($.trim($("#e_input").val()));
            contactDetails.EmailId = null;
            contactDetails.Name = null;
            contactDetails.FacebookUrl = null;
            OffSet = 0;
            CallBackFunction();
        }
        else if (filter.indexOf("PageName") > -1) {
            contactDetails.PhoneNumber = null;
            contactDetails.EmailId = null;
            contactDetails.Name = null;
            contactDetails.FacebookUrl = CleanText($.trim($("#e_input").val()));
            OffSet = 0;
            CallBackFunction();
        }
        else if (filter.indexOf("Name") > -1) {
            contactDetails.PhoneNumber = null;
            contactDetails.EmailId = null;
            contactDetails.FacebookUrl = null;
            contactDetails.Name = CleanText($.trim($("#e_input").val()));
            OffSet = 0;
            CallBackFunction();
        }
       
    }
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
