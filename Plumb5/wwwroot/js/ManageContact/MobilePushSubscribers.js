var subscribers = { DeviceId: "", IPAddress: "", SubscribedURL: "" };
var GroupId = 0;
var GroupName = "";

var PreContactGroupId = [];
var chkArrayContactId = [];
var PresentContactGroupId = [];

var subscribersUtil = {
    Initialize: function () {
        subscribersUtil.GetGroups();
    },
    GetGroups: function () {
        $.ajax({
            url: "/ManageContact/MobilePushSubscribers/GetGroupList",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != undefined && response != null && response.length > 0) {
                    $.each(response, function () {
                        let groupContent = `<option value="${$(this)[0].Id}">${$(this)[0].Name}</option>`;
                        $("#addgroupoperation").append(groupContent);
                    });
                }
            },
            error: ShowAjaxError
        });
    },
    MaxCount: function () {
        ShowPageLoading();
        $.ajax({
            url: "/ManageContact/MobilePushSubscribers/GetMaxCount",
            type: 'Post',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'mobPushUser': subscribers, 'GroupId': GroupId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                TotalRowCount = 0;
                if (response != undefined && response != null && response > 0) {
                    TotalRowCount = response;
                    $("#spnCount").html(TotalRowCount);
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
            url: "/ManageContact/MobilePushSubscribers/GetDetails",
            type: 'Post',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'mobPushUser': subscribers, 'Offset': OffSet, 'FetchNext': FetchNext, 'GroupId': GroupId }),
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
    },
    BindEachSubscribers: function (Subscriber, index) {
        let DeviceId = Subscriber.DeviceId != null ? Subscriber.DeviceId.substring(0, 25) + "..." : "NA";
        let Active = Subscriber.InstalledStatus != null && Subscriber.InstalledStatus == 1 ? "<td class='text-color-success'>Subscribe</td>" : "<td class='text-color-error'>Un-Subscribe</td>"
        let SubscribedDate = Subscriber.DeviceDate != null ? $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(Subscriber.DeviceDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(Subscriber.DeviceDate)) : "NA";
        let DeviceName = Subscriber.Name != null ? Subscriber.Name : "NA";
        let OSName = Subscriber.OS != null ? Subscriber.OS : "NA";
        let content = `
                         <tr>
                            <td class="pl-0">
                                <div class="chbxWrap">
                                    <label class="ckbox">
                                        <input class="selChk" value="${Subscriber.DeviceId}" type="checkbox"><span></span>
                                    </label>
                                </div>
                            </td>
                           <td class ='frmresucp'><i class ='fa fa-address-card-o'  onclick='ShowContactUCP(null,\"${Subscriber.DeviceId}\",null)'></i></td>
                           <td data-type='DeviceId'><div class ='machidcopywrp'><p class ='pushmachidtxt' title="${Subscriber.DeviceId}">${DeviceId}</p><i class='icon ion-ios-copy' title='Copy To Clipboard' onclick='copyToClipboard(\"${Subscriber.DeviceId}\")'></i></div></td>
                            ${Active}
                            <td class ='text-color-blue'>${DeviceName}(${OSName}) </td>
                            <td>${SubscribedDate}</td>
                         </tr>
                      `;

        $("#ui_trbodySubscribersData").append(content);
    },
    GetSubscribersByFilter: function () {
        if ($("#ui_spanFilter").text().toLowerCase() == "filter by") {
            ShowErrorMessage(GlobalErrorList.MobileDeviceInfo.FilterByError);
        } else if ($("#ui_spanFilter").text().toLowerCase() == "device name") {
            subscribers.DeviceId = "";
            if (CleanText($.trim($("#searchFilterBox").val())).length > 0) {
                subscribers.Name = CleanText($.trim($("#searchFilterBox").val()));
                subscribersUtil.MaxCount();
            }
            else {
                ShowErrorMessage(GlobalErrorList.MobileDeviceInfo.DeviceNameError);
            }

        } else if ($("#ui_spanFilter").text().toLowerCase() == "device id") {
            subscribers.Name = "";
            if (CleanText($.trim($("#searchFilterBox").val())).length > 0) {
                subscribers.DeviceId = CleanText($.trim($("#searchFilterBox").val()));
                subscribersUtil.MaxCount();
            } else {
                ShowErrorMessage(GlobalErrorList.MobileDeviceInfo.DeviceIdError);
            }
        }

    },
    AddToGroup: function () {
        let GroupId = $(".addgroupselect option:selected").val();
        let DeviceIdList = subscribersUtil.GetSelectedDeviceIds();

        if (DeviceIdList != null && DeviceIdList.length > 0) {
            $.ajax({
                url: "/MobilePushNotification/MobileDeviceInfo/AddToGroup",
                type: 'Post',
                data: JSON.stringify({ 'accountId': Plumb5AccountId, 'GroupId': GroupId, 'DeviceIdList': DeviceIdList }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) {
                    if (response != undefined && response != null) {
                        ShowSuccessMessage(GlobalErrorList.MobileDeviceInfo.AddedToGroupsSuccess.replace("{*1*}", response.DeviceIdsAdded.length).replace("{*2*}", response.DeviceIdsAlreadyExists.length));
                    }
                    subscribersUtil.ClearCheckedBox();
                },
                error: ShowAjaxError
            });
        } else {
            ShowErrorMessage(GlobalErrorList.MobileDeviceInfo.SelectedDeviceIdError);
        }
    },
    GetSelectedDeviceIds: function () {

        let DeviceIdList = [];

        $("input:checkbox:checked:not(#chkAll):not([name='ddcl-ui_drpTarRetainGrp'])").map(function () {
            DeviceIdList.push($(this).val());
        });

        return DeviceIdList;
    },
    ClearSearchFields: function () {
        $("#searchFilterBox").val("");
        subscribers.DeviceId = "";
        subscribers.Name = "";
        subscribers.IPAddress = "";
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
                url: "/MobilePushNotification/MobileDeviceInfo/GetGroupNameByDeviceId",
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
            url: "/Contact/GetGroupName",
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
    }
};

$(document).ready(() => {
    GroupId = urlParam("GroupId");
    GroupName = decodeURIComponent(urlParam("GroupName"));
    $('#tabContact').attr('href', "Contact?GroupId=" + GroupId + "&GroupName=" + GroupName);
    $('#tabWebPush').attr('href', "PushSubscribers?GroupId=" + GroupId + "&GroupName=" + GroupName);
    $(".pagetitle").html("Group Contacts/Subscribers (Group: " + GroupName + ")");
    ShowPageLoading();
    CallBackFunction();
    ExportFunctionName = "ExportMobPushSubscribers";

});

function CallBackFunction() {
    ShowPageLoading();
    TotalRowCount = 0;
    CurrentRowCount = 0;
    subscribersUtil.GetGroups();
    subscribersUtil.MaxCount();
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
    } else {
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
            url: "/MobilePushNotification/MobileDeviceInfo/AddToGroup",
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'DeviceIds': chkArrayContactId, 'Groups': PresentContactGroupId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) { //OnSuccessMachine,
                if (response != null && response.length > 0)
                    ShowSuccessMessage(GlobalErrorList.Contact.addedtogroup);
                else
                    ShowErrorMessage(GlobalErrorList.Contact.RemovedFromGroups);

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
            url: "/MobilePushNotification/MobileDeviceInfo/DeleteFromGroup",
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'DeviceIds': chkArrayContactId, 'Groups': deleteGroup }),
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
