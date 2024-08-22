var subscribers = { MachineId: "", IPAddress: "", SubscribedURL: "" };
var FilterByEmailorPhone = null;

var subscribersUtil = {
    Initialize: function () {
        subscribersUtil.GetGroups();
    },
    GetGroups: function () {
        $.ajax({
            url: "/ManageContact/Group/GetGroupsByStaticOrDynamic",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, GroupType: 1 }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != undefined && response != null && response.GroupDetails != null) {
                    $.each(response.GroupDetails, function () {
                        let groupContent = `<option value="${$(this)[0].Id}">${$(this)[0].Name}</option>`;
                        $("#ui_selectGroupsList").append(groupContent);
                    });
                }
            },
            error: ShowAjaxError
        });
    },
    MaxCount: function () {
        ShowPageLoading();
        $.ajax({
            url: "/WebPush/Subscribers/GetMaxCount",
            type: 'Post',
            data: JSON.stringify({
                'AccountId': Plumb5AccountId, 'webPushUser': subscribers, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime, 'FilterByEmailorPhone': FilterByEmailorPhone
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                TotalRowCount = 0;
                if (response != undefined && response != null && response > 0) {
                    TotalRowCount = response;
                }

                if (TotalRowCount > 0) {
                    subscribersUtil.GetSubscribers();
                }
                else {
                    SetNoRecordContent('ui_tableSubscribers', 6, 'ui_trbodySubscribersData');
                    HidePageLoading();
                }
            },
            error: ShowAjaxError
        });
    },
    GetSubscribers: function () {
        FetchNext = GetNumberOfRecordsPerPage();
        $.ajax({
            url: "/WebPush/Subscribers/GetDetails",
            type: 'Post',
            data: JSON.stringify({
                'AccountId': Plumb5AccountId, 'webPushUser': subscribers, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime, 'Offset': OffSet, 'FetchNext': FetchNext, 'FilterByEmailorPhone': FilterByEmailorPhone
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: subscribersUtil.BindSubscribers,
            error: ShowAjaxError
        });
    },
    BindSubscribers: function (response) {
        SetNoRecordContent('ui_tableSubscribers', 6, 'ui_trbodySubscribersData');
        if (response != undefined && response != null && response.length > 0) {
            SmsSendingSettingList = response;
            CurrentRowCount = response.length;
            PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);
            $("#ui_trbodySubscribersData").html('');
            $("#ui_tableSubscribers").removeClass('no-data-records');
            ShowExportDiv(true);
            ShowPagingDiv(true);

            $.each(response, function (i) {
                subscribersUtil.BindEachSubscribers(this, i);
            });

        } else {
            ShowExportDiv(false);
            ShowPagingDiv(false);
        }
        HidePageLoading();
        CheckAccessPermission("WebPush");
    },
    BindEachSubscribers: function (Subscriber, index) {
        let IPAddress = Subscriber.IPAddress != undefined && Subscriber.IPAddress != null && Subscriber.IPAddress != "" ? Subscriber.IPAddress : "NA";
        let MachineId = Subscriber.MachineId != undefined && Subscriber.MachineId != null && Subscriber.MachineId != "" ? Subscriber.MachineId.substring(Subscriber.MachineId.length - 4, Subscriber.MachineId.length) : "NA";
        let Active = Subscriber.IsSubscribe == true ? "<td class='text-color-success'>Subscribe</td>" : "<td class='text-color-error'>Un-Subscribe</td>"
        let SubscribedDate = Subscriber.SubscribeDate != null ? $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(Subscriber.SubscribeDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(Subscriber.SubscribeDate)) : "NA";
        let SubscribedURL = Subscriber.SubscribedURL != undefined && Subscriber.SubscribedURL != null && Subscriber.SubscribedURL != "" ? SubstringPageURL(Subscriber.SubscribedURL) : "NA";

        let content = `
                         <tr>
                            <td class="pl-0">
                                <div class="chbxWrap">
                                    <label class="ckbox">
                                        <input class="selChk" value="${Subscriber.MachineId}" type="checkbox"><span></span>
                                    </label>
                                </div>
                            </td>
                            <td class ='frmresucp'><i class ='fa fa-address-card-o'  onclick='ShowContactUCP(\"${Subscriber.MachineId}\",null,null)'></i></td>

                           <td data-type='DeviceId'><div class ='machidcopywrp'>
                           <p class ='pushmachidtxt num-blu'><span  class ="num-blu">${IPAddress}</span><span class="mnumb">(M-${MachineId})</span></p>
                           <i class ='icon ion-ios-copy' title='Copy To Clipboard' onclick='copyToClipboard(\"${Subscriber.MachineId}\")'></i>
                           </div></td>
                          
                            ${Active}
                            <td>${SubscribedDate}</td>
                            <td title="${Subscriber.SubscribedURL}">${SubscribedURL}</td>
                         </tr>
                      `;

        $("#ui_trbodySubscribersData").append(content);
    },
    GetSubscribersByFilter: function () {
        FilterByEmailorPhone = null;
        if ($("#ui_spanFilter").text().toLowerCase() == "filter by") {
            ShowErrorMessage(GlobalErrorList.WebPushSubscribers.FilterByError);
        } else if ($("#ui_spanFilter").text().toLowerCase() == "visitor ip") {
            subscribers.MachineId = ""; subscribers.SubscribedURL = "";
            if (CleanText($.trim($("#searchFilterBox").val())).length > 0) {
                subscribers.IPAddress = CleanText($.trim($("#searchFilterBox").val()));
                subscribersUtil.MaxCount();
            }
            else {
                ShowErrorMessage(GlobalErrorList.WebPushSubscribers.IPAddressError);
            }
        } else if ($("#ui_spanFilter").text().toLowerCase() == "machine id") {
            subscribers.IPAddress = ""; subscribers.SubscribedURL = "";
            if (CleanText($.trim($("#searchFilterBox").val())).length > 0) {
                subscribers.MachineId = CleanText($.trim($("#searchFilterBox").val()));
                subscribersUtil.MaxCount();
            } else {
                ShowErrorMessage(GlobalErrorList.WebPushSubscribers.MachineIdError);
            }
        } else if ($("#ui_spanFilter").text().toLowerCase() == "subscribed url") {
            subscribers.MachineId = ""; subscribers.IPAddress = "";
            if (CleanText($.trim($("#searchFilterBox").val())).length > 0) {
                subscribers.SubscribedURL = CleanText($.trim($("#searchFilterBox").val()));
                subscribersUtil.MaxCount();
            } else {
                ShowErrorMessage(GlobalErrorList.WebPushSubscribers.SubscribedURLError);
            }
        } else if ($("#ui_spanFilter").text().toLowerCase() == "email-id") {
            subscribers.MachineId = ""; subscribers.IPAddress = ""; subscribers.SubscribedURL = "";
            FilterByEmailorPhone = "email";
            subscribersUtil.MaxCount();
        } else if ($("#ui_spanFilter").text().toLowerCase() == "phone") {
            subscribers.MachineId = ""; subscribers.IPAddress = ""; subscribers.SubscribedURL = "";
            FilterByEmailorPhone = "phone";
            subscribersUtil.MaxCount();
        }
    },
    AddToGroup: function () {
        let GroupId = $(".addgroupselect option:selected").val();
        let MachineIdList = subscribersUtil.GetSelectedMachineIdIds();

        if (MachineIdList != null && MachineIdList.length > 0) {
            $.ajax({
                url: "/WebPush/Subscribers/AddToGroup",
                type: 'Post',
                data: JSON.stringify({ 'accountId': Plumb5AccountId, 'GroupId': GroupId, 'MachineIdList': MachineIdList }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) {
                    if (response != undefined && response != null) {
                        ShowSuccessMessage(GlobalErrorList.WebPushSubscribers.AddedToGroupsSuccess.replace("{*1*}", response.MachineIdsAdded.length).replace("{*2*}", response.MachineIdsAlreadyExists.length));
                    }
                    subscribersUtil.ClearCheckedBox();
                },
                error: ShowAjaxError
            });
        } else {
            ShowErrorMessage(GlobalErrorList.WebPushSubscribers.SelectedMachineIdError);
        }
    },
    GetSelectedMachineIdIds: function () {

        let MachineIdList = [];

        $("input:checkbox:checked:not(#chkAll):not([name='ddcl-ui_drpTarRetainGrp'])").map(function () {
            MachineIdList.push($(this).val());
        });

        return MachineIdList;
    },
    ClearSearchFields: function () {
        $("#searchFilterBox").val("");
        subscribers.MachineId = "";
        subscribers.IPAddress = "";
        subscribers.SubscribedURL = "";
        FilterByEmailorPhone = null;
    },
    ClearCheckedBox: function () {
        $(".selChk,.selchbxall").prop("checked", false);
        $(".subdivWrap").removeClass('showDiv');
        $("#ui_selectGroupsList").val("0").trigger("change");
    },
    OpenGroup: function () {
        ShowPageLoading();

        var ContactSelectedCount = parseInt($(".checkedCount").html());

        if (ContactSelectedCount <= 0) {
            ShowErrorMessage(GlobalErrorList.Contact.contactselecterror);
            HidePageLoading();
            return false;
        }

        $("#addremovegroup").modal('show');
        setTimeout(function () { subscribersUtil.GetContactGroup(); }, 2000);
    },
    GetContactGroup: function () {
        PreContactGroupId = [];
        chkArrayContactId = [];
        $(".selChk:checked").each(function () {
            chkArrayContactId.push($(this).val());
        });

        if (chkArrayContactId.length > 0) {
            $.ajax({
                type: "POST",
                url: "/WebPush/Subscribers/GetGroupNameByMachineId",
                data: JSON.stringify({ 'deviceIds': chkArrayContactId }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) {
                    $.each(response, function (i) {
                        if (PreContactGroupId.indexOf($(this)[0].Id) == -1) { PreContactGroupId.push($(this)[0].Id) };
                    });

                    subscribersUtil.BindGroupName();
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
            url: "/ManageContact/Group/GetGroupsByStaticOrDynamic",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ 'accountId': Plumb5AccountId, GroupType: 1 }),
            dataType: "json",
            success: function (response) {
                if (response != undefined && response != null && response.GroupDetails != null) {
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
};

$(document).ready(() => {
    ShowPageLoading();
    ExportFunctionName = "ExportWebPushSubscribers";
    GetUTCDateTimeRange(2);
});

function CallBackFunction() {
    ShowPageLoading();
    TotalRowCount = 0;
    CurrentRowCount = 0;
    subscribersUtil.GetGroups();
    subscribersUtil.MaxCount();
}

function CallBackPaging() {
    CurrentRowCount = 0;
    subscribersUtil.GetSubscribers();
}

$('.addgroupselect').select2({
    minimumResultsForSearch: '',
    dropdownAutoWidth: false
});

$(".dropdown-menu .visitfiltWrap a").click(function () {
    var filterListVal = $(this).text();
    if (filterListVal == "All") {
        $(".btn-dropdown").focus();
        $("#filterTags span").html(filterListVal);
        $(".subdivFiltWrap").removeClass("showDiv");
        subscribersUtil.ClearSearchFields();
        subscribersUtil.MaxCount();
    }
    else if (filterListVal == "Email-Id" || filterListVal == "Phone") {
        $(".btn-dropdown").focus();
        $("#filterTags span").html(filterListVal);
        $(".subdivFiltWrap").removeClass("showDiv");
        subscribersUtil.ClearSearchFields();
        subscribersUtil.GetSubscribersByFilter();
    }
    else {
        $(".btn-dropdown").focus();
        $("#filterTags span").html(filterListVal);
        $(".subdivFiltWrap").addClass("showDiv");
        $("#searchFilterBox").attr("placeholder", "Search " + filterListVal);
    }
});

$(document).on("click", ".selchbxall", function () {
    checkBoxClickCount = $('.selChk').filter(':checked').length;
    if (checkBoxClickCount > 0) {
        $(".subdivWrap").addClass('showDiv');
    } else {
        $(".subdivWrap").removeClass('showDiv');
    }
    $(".checkedCount").html(checkBoxClickCount);
});

$(document).on('change', ".addgroupselect", function () {
    addGroupNameList = $(".addgroupselect option:selected").text();
    if (addGroupNameList != "Add to Group") {
        $(".visitorsCount").html(checkBoxClickCount);
        $(".addgroupname").html(addGroupNameList);
        $("#confirmDialog").modal('show');
    }
});

var checkBoxClickCount, addGroupNameList;
$(document).on("click", ".selChk", function () {
    checkBoxClickCount = $('.selChk').filter(':checked').length;
    if (checkBoxClickCount > 0) {
        $(".subdivWrap").addClass('showDiv');
    } else {
        $(".subdivWrap").removeClass('showDiv');
    }
    $(".checkedCount").html(checkBoxClickCount);
});

//Copy Device Id
function copyToClipboard(value) {
    var tempInput = document.createElement("input");
    tempInput.style = "position: absolute; left: -1000px; top: -1000px";
    tempInput.value = value;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
}

$("#addremovegroupslist").click(function () {
    subscribersUtil.OpenGroup();
});


$('#addgroupoperation').select2({
    minimumResultsForSearch: '',
    dropdownAutoWidth: false
});

$("#btnCloseAddRemovegrp,#btnCancelAddRemovegrp").click(function () {
    $("#addremovegroup").modal('hide');
    HidePageLoading();
});

$("#addtogroup").click(function () {
    PresentContactGroupId = [];

    PresentContactGroupId = $("#addgroupoperation").val();
    if (PresentContactGroupId == null) {
        ShowErrorMessage(GlobalErrorList.Contact.selectgroups);
        return;
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
            url: "/WebPush/Subscribers/AddToGroup",
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'MachineIds': chkArrayContactId, 'Groups': PresentContactGroupId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) { //OnSuccessMachine,
                if (response != null && response.length > 0)
                    ShowSuccessMessage(GlobalErrorList.Contact.addedtogroup);
                else
                    ShowSuccessMessage(GlobalErrorList.Contact.RemovedFromGroups);

                $("#addremovegroup").modal('hide');
            },
            error: ShowAjaxError
        });
    } else {
        ShowErrorMessage(GlobalErrorList.Contact.selectvisitors);
    }

    if (chkArrayContactId.length > 0 && deleteGroup.length > 0) {
        $.ajax({
            type: "POST",
            url: "/WebPush/Subscribers/DeleteFromGroup",
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'MachineIds': chkArrayContactId, 'Groups': deleteGroup }),
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

    clearAll();
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

function clearAll() {
    $(".checkedCount").html(0);
    $(".visitorsCount").html(0);
    $(".selchbxall,.selChk").prop("checked", false);
    $(".subdivWrap").removeClass("showDiv");
}

//
$("#searchFilterBox").keypress(function (e) {
    if ((e.which && e.which === 13) || (e.keyCode && e.keyCode === 13)) {
        if (CleanText($.trim($("#searchFilterBox").val())).length == 0) {
            ShowErrorMessage(GlobalErrorList.ManageEmbeddedForm.SearchErrorValue);
            HidePageLoading();
            return false;
        }
        ShowPageLoading();
        OffSet = 0;
        subscribersUtil.GetSubscribersByFilter();
    }
});

$("#searchFilterBox").keyup(function (e) {
    if (e.which && e.which === 8 || e.keyCode && e.keyCode === 46)
        if ($("#searchFilterBox").val().length === 0) {
            ShowPageLoading();
            subscribersUtil.ClearSearchFields();
            CallBackFunction();
        }
});
