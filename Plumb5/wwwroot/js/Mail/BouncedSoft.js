
var MailBounced = { BounceType: "soft", ReasonForBounce: "", Category: "" };

$(document).ready(function () {
    BounceUtil.LoadPage();
});

function CallBackFunction() {
    BounceUtil.MaxCount();
}

function CallBackPaging() {
    $("#ui_tbodyReportData").html('');
    CurrentRowCount = 0;
    BounceUtil.MaxCount();
}

var BounceUtil = {
    LoadPage: function () {
        ShowPageLoading();
        TotalRowCount = 0;
        CurrentRowCount = 0;
        BounceUtil.BindGroupList();
        BounceUtil.MaxCount();

        $('.addCampName').select2({
            placeholder: 'This is my placeholder',
            minimumResultsForSearch: '',
            dropdownAutoWidth: false,
            containerCssClass: 'dropdownactiv'
        });
    },
    MaxCount: function () {
        ShowPageLoading();
        MailBounced = { BounceType: "soft", ReasonForBounce: "", Category: "" };
        if ($("#ui_ddlBouncedReason").val() != "0") {
            MailBounced.ReasonForBounce = $("#ui_ddlBouncedReason").val();
        }

        var GroupId = 0;

        if ($("#ui_ddlGroupFilter").val() != "0") {
            GroupId = $("#ui_ddlGroupFilter").val();
        }

        $.ajax({
            url: "/Mail/BouncedSoft/GetMaxCount",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'MailBounced': MailBounced, 'GroupId': GroupId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                TotalRowCount = response;
                if (TotalRowCount > 0) {
                    $("#ui_tbodyReportData").html('');
                    BounceUtil.GetReport();
                }
                else {
                    SetNoRecordContent('ui_tableReport', 5, 'ui_tbodyReportData');
                    ShowPagingDiv(false);
                    HidePageLoading();
                }
            },
            error: ShowAjaxError
        });
    },
    GetReport: function () {
        ShowPageLoading();
        MailBounced = { BounceType: "soft", ReasonForBounce: "", Category: "" };
        if ($("#ui_ddlBouncedReason").val() != "0") {
            MailBounced.ReasonForBounce = $("#ui_ddlBouncedReason").val();
        }

        var GroupId = 0;

        if ($("#ui_ddlGroupFilter").val() != "0") {
            GroupId = $("#ui_ddlGroupFilter").val();
        }

        FetchNext = GetNumberOfRecordsPerPage();
        $.ajax({
            url: "/Mail/BouncedSoft/GetBouncedContactList",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'MailBounced': MailBounced, 'OffSet': OffSet, 'FetchNext': FetchNext, 'GroupId': GroupId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: BounceUtil.BindBounceDetails,
            error: ShowAjaxError
        });
    },
    BindBounceDetails: function (response) {
        if (response !== undefined && response !== null && response.length > 0) {
            CurrentRowCount = response.length;
            PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);
            ShowPagingDiv(true);
            $("#ui_tableReport").removeClass('no-data-records');

            $.each(response, function () {
                BounceUtil.BindEachReport(this);
            });
        }
        HidePageLoading();
        CheckAccessPermission("Mail");
    },
    BindEachReport: function (eachData) {
        let reportTablerows = `<tr>
                                <td>
                                    <div class="custom-control custom-checkbox">
                                        <input type="checkbox" class="custom-control-input selChk" id="ui_chkbox_${eachData.Id}" name="example1" ContactId="${eachData.ContactId}" value="${eachData.Id}" >
                                        <label class="custom-control-label" for="ui_chkbox_${eachData.Id}"></label>
                                    </div>
                                </td>
                                <td>${eachData.Emailid}</td>
                                <td>${eachData.Category}</td>
                                <td>${eachData.ReasonForBounce}</td>
                                <td>${eachData.Errorcode}</td>
                            </tr>`;
        $("#ui_tbodyReportData").append(reportTablerows);
    },
    GetSelectedCheckBoxData: function () {
        var CheckBoxDataList = [];
        $(".selChk:checked").each(function () {
            var chkData = { Id: $(this).val(), ContactId: $(this).attr("ContactId") };
            CheckBoxDataList.push(chkData);
        });

        return CheckBoxDataList;
    },
    ShowGroupPopUp: function () {

        ShowPageLoading();

        var ContactSelectedCount = parseInt($(".checkedCount").html());

        if (ContactSelectedCount <= 0) {
            ShowErrorMessage(GlobalErrorList.Contact.contactselecterror);
            HidePageLoading();
            return false;
        }

        $("#ui_divGroupPopUp").removeClass("hideDiv");
        setTimeout(function () { BounceUtil.GetContactGroup(); }, 2000);
    },
    GetContactGroup: function () {
        PreContactGroupId = [];
        chkArrayContactId = [];
        $(".selChk:checked").each(function () {
            chkArrayContactId.push($(this).attr("ContactId"));
        });

        if (chkArrayContactId.length > 0) {
            $.ajax({
                type: "POST",
                url: "/Mail/BouncedSoft/GetGroupNameByContacts",
                data: JSON.stringify({ 'contact': chkArrayContactId }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) {
                    $.each(response, function (i) {
                        if (PreContactGroupId.indexOf($(this)[0].Id) == -1) { PreContactGroupId.push($(this)[0].Id) };
                    });
                    BounceUtil.GetGroupList();
                },
                error: ShowAjaxError
            });
        }
    },
    GetGroupList: function () {
        $("#ui_ddlGroup").html('');
        $.ajax({
            url: "/ManageContact/Group/GetGroupsByStaticOrDynamic",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, GroupType: 1 }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != undefined && response != null && response.GroupDetails != null) {
                    GroupList = response.GroupDetails;
                    $.each(response.GroupDetails, function () {
                        var select = PreContactGroupId.indexOf(+$(this)[0].Id) > -1 ? "Selected" : "";
                        $("#ui_ddlGroup").append($('<option value="' + $(this)[0].Id + '" ' + select + '>' + $(this)[0].Name + '</option>'));
                    });
                }
                BounceUtil.MaxCount();
                $('.addgroupname').select2({
                    placeholder: 'This is my placeholder',
                    minimumResultsForSearch: '',
                    dropdownAutoWidth: false,
                    containerCssClass: 'dropdownactiv'
                });
            },
            error: ShowAjaxError
        });
    },
    BindGroupList: function () {
        $.ajax({
            url: "/Mail/BouncedSoft/GetGroupList",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != undefined && response != null) {
                    $.each(response, function () {
                        $("#ui_ddlGroupFilter").append(`<option value="${$(this)[0].Id}">${$(this)[0].Name}</option>`);
                    });
                }
            },
            error: ShowAjaxError
        });
    },
    DeleteBounceRecord: function () {
        var CheckBoxDataList = BounceUtil.GetSelectedCheckBoxData();

        $.ajax({
            url: "/Mail/BouncedSoft/DeleteBounceRecord",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'bounceList': CheckBoxDataList }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != undefined && response != null && response.Status) {
                    ShowSuccessMessage(GlobalErrorList.MailBounce.DeleteBounceSuccess);
                    $("#ui_divDeleteBouncePopUp").modal("hide");
                    BounceUtil.MaxCount();
                } else {
                    ShowErrorMessage(GlobalErrorList.MailBounce.DeleteBounceError);
                    HidePageLoading();
                }
            },
            error: ShowAjaxError
        });
    },
    AddRemoveBounceRecord: function () {
        ShowPageLoading();
        PresentContactGroupId = [];

        PresentContactGroupId = $("#ui_ddlGroup").val();
        if (PresentContactGroupId == undefined || PresentContactGroupId == null || PresentContactGroupId.length == 0) {
            ShowErrorMessage(GlobalErrorList.MailBounce.NoGroupSelected);
            HidePageLoading();
            return true;
        }

        var deleteGroup = [];
        var diffArray = differenceOf2Arrays(PreContactGroupId, PresentContactGroupId);
        for (var d = 0; d < diffArray.length; d++) {
            if (PreContactGroupId.indexOf(diffArray[d]) > -1 && PresentContactGroupId.indexOf(diffArray[d]) == -1) {
                deleteGroup.push(diffArray[d]);
            }
        }

        if (chkArrayContactId.length > 0 && PresentContactGroupId.length > 0) {
            $.ajax({
                type: "POST",
                url: "/Mail/BouncedSoft/AddToGroup",
                data: JSON.stringify({ 'accountId': Plumb5AccountId, 'contact': chkArrayContactId, 'Groups': PresentContactGroupId }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) { //OnSuccessMachine,
                    if (response != null && response.length > 0)
                        ShowSuccessMessage(GlobalErrorList.Contact.addedtogroup);
                    else
                        ShowSuccessMessage(GlobalErrorList.Contact.RemovedFromGroups);

                    $("#ui_divGroupPopUp").addClass("hideDiv");
                },
                error: ShowAjaxError
            });
        } else {
            ShowErrorMessage(GlobalErrorList.Contact.selectvisitors);
        }

        if (chkArrayContactId.length > 0 && deleteGroup.length > 0) {
            $.ajax({
                type: "POST",
                url: "/Mail/BouncedSoft/DeleteFromGroup",
                data: JSON.stringify({ 'accountId': Plumb5AccountId, 'contact': chkArrayContactId, 'Groups': deleteGroup }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) { //OnSuccessMachine,
                    if (response)
                        console.log("deleted group successfully");
                    else
                        console.log("Something goes wrong, for delete group");
                },
                error: ShowAjaxError
            });
        }
        HidePageLoading();
        BounceUtil.ClearSelectedData();
    },
    ClearSelectedData: function () {
        $("#ui_divGroupPopUp").addClass("hideDiv");
        $("#ui_ddlGroup").val("");
        $("#ui_ddlGroup").trigger("change");
        $(".selchbxall").prop('checked', false);
        $(".selChk").prop('checked', false);
        $(".subdivWrap").removeClass('showDiv');
        HidePageLoading();
    },
    ExportBounceContact: function () {

        var ExportFileType = $("#ui_ddl_BounceExportFileType").val();
        MailBounced = { BounceType: "soft", ReasonForBounce: "", Category: "" };
        if ($("#ui_ddlBouncedReason").val() != "0") {
            MailBounced.ReasonForBounce = $("#ui_ddlBouncedReason").val();
        }

        var GroupId = 0;

        if ($("#ui_ddlGroupFilter").val() != "0") {
            GroupId = $("#ui_ddlGroupFilter").val();
        }

        $.ajax({
            url: "/Mail/BouncedSoft/Export",
            type: 'POST',
            data: JSON.stringify({
                'AccountId': Plumb5AccountId, 'MailBounced': MailBounced, 'FileType': ExportFileType, 'GroupId': GroupId
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response.Status) {
                    window.location.assign(response.MainPath);
                }
                else {
                    ShowErrorMessage(GlobalErrorList.ExportData.NoDataFound);
                }
                $("#ui_divExportBouncePopUp").modal("hide");
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },
    ExportUnsubscribedContacts: function () {
        var ExportFileType = $("#ui_ddl_UnsubscribeExportFileType").val();

        $.ajax({
            url: "/Mail/BouncedSoft/ExportUnsubscribedContacts",
            type: 'POST',
            data: JSON.stringify({
                'AccountId': Plumb5AccountId, 'FileType': ExportFileType
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response.Status) {
                    window.location.assign(response.MainPath);
                }
                else {
                    ShowErrorMessage(GlobalErrorList.ExportData.NoDataFound);
                }
                $("#ui_divExportUnsubscribePopUp").modal("hide");
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    }
}

$("#ui_ddlBouncedReason").change(function () {
    BounceUtil.MaxCount();
});

$("#ui_ddlGroupFilter").change(function () {
    BounceUtil.MaxCount();
});

$(document).on("click", ".selchbxall", function () {
    if ($(this).is(":checked")) {
        $(".selChk").prop('checked', true);
    } else {
        $(".selChk").prop('checked', false);
    }

    var checkBoxClickCount = $('.selChk').filter(':checked').length;
    if (checkBoxClickCount > 0) {
        $(".subdivWrap").addClass('showDiv');
    } else {
        $(".subdivWrap").removeClass('showDiv');
    }
    $(".checkedCount").html(checkBoxClickCount);
});

$(document).on("click", ".selChk", function () {
    var checkBoxClickCount = $('.selChk').filter(':checked').length;
    if (checkBoxClickCount > 0) {
        $(".subdivWrap").addClass('showDiv');
    } else {
        $(".subdivWrap").removeClass('showDiv');
    }
    $(".checkedCount").html(checkBoxClickCount);
});

$("#ui_aShowGroupPopUp").click(function () {
    BounceUtil.ShowGroupPopUp();
});

$("#ui_iconCloseGroupPopUp,#ui_btnCloseGroupPopUp").click(function () {
    BounceUtil.ClearSelectedData();
});

$("#ui_btnApplyRemove").click(function () {
    ShowPageLoading();
    BounceUtil.AddRemoveBounceRecord();
});

$("#ui_divDeleteBouncePopUp").on("hide.bs.modal", function () {
    BounceUtil.ClearSelectedData();
});

$("#ui_btnDeleteRowConfirm").click(function () {
    ShowPageLoading();
    BounceUtil.DeleteBounceRecord();
});

$("#ui_btnBounceDataExport").click(function () {
    ShowPageLoading();
    BounceUtil.ExportBounceContact();
});

$("#ui_btnUnsubscribeDataExport").click(function () {
    ShowPageLoading();
    BounceUtil.ExportUnsubscribedContacts();
});


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
