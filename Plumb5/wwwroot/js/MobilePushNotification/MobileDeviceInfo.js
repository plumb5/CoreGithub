var mobileSubscribers = { DeviceId: "", Name: "" };
var PreContactGroupId = [];
var chkArrayContactId = [];
var PresentContactGroupId = [];

$(document).ready(function () {
    GetUTCDateTimeRange(2);
    ExportFunctionName = "ExportMobileDeviceInfo";
});

function CallBackFunction() {
    ShowPageLoading();
    TotalRowCount = 0;
    CurrentRowCount = 0;
    mobSubscribersUtil.Initialize();
    mobSubscribersUtil.MaxCount();
}

function CallBackPaging() {
    CurrentRowCount = 0;
    mobSubscribersUtil.GetReport();
}

var mobSubscribersUtil = {
    Initialize: function () {
        mobSubscribersUtil.GetGroups();
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
                        $("#addgroupoperation").append(groupContent);
                    });
                }
            },
            error: ShowAjaxError
        });
    },
    MaxCount: function () {

        $.ajax({
            url: "/MobilePushNotification/MobileDeviceInfo/GetMaxCount",
            type: 'Post',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'mobileDeviceInfo': mobileSubscribers, 'FromDateTime': FromDateTime, 'ToDateTime': ToDateTime }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                TotalRowCount = 0;
                if (response != undefined && response != null && response.returnVal > 0) {
                    TotalRowCount = response.returnVal;
                }

                if (TotalRowCount > 0) {
                    mobSubscribersUtil.GetReport();
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
        FetchNext = GetNumberOfRecordsPerPage();
        $.ajax({
            url: "/MobilePushNotification/MobileDeviceInfo/GetReportData",
            type: 'Post',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'mobileDeviceInfo': mobileSubscribers, 'OffSet': OffSet, 'FetchNext': FetchNext, 'FromDateTime': FromDateTime, 'ToDateTime': ToDateTime }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                mobSubscribersUtil.BindReport(response);
            },
            error: ShowAjaxError
        });
    },

    BindReport: function (response) {

        SetNoRecordContent('ui_tblReportData', 6, 'ui_tbodyReportData');
        if (response != undefined && response != null) {
            CurrentRowCount = response.length;
            PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);

            var reportTableTrs;

            $.each(response, function () {
                let DeviceId = this.DeviceId != null ? this.DeviceId.length > 25 ? this.DeviceId.substring(0, 25) + "..." : this.DeviceId : "NA";
                let Status = this.InstalledStatus != null && this.InstalledStatus == 1 ? "<td class='text-color-success'>Subscribe</td>" : "<td class='text-color-error'>Un-Subscribe</td>"
                let DeviceName = this.Name != null ? this.Name : "NA";
                let OSName = this.OS != null ? this.OS : "NA";
                let Id = this.Id;
                reportTableTrs += "<tr>" +
                    "<td><div class='custom-control custom-checkbox'><input type='checkbox' class='custom-control-input selChk' id=" + this.DeviceId + " value=" + this.DeviceId + " name='example1'>" +
                    "<label class='custom-control-label' for=" + this.DeviceId + "></label></div></td>" +
                    "<td class='frmresucp'><i class='fa fa-address-card-o'  onclick='ShowContactUCP(null,\"" + this.DeviceId + "\",null)'></i></td>" +
                    "<td data-type='DeviceId'><div class='machidcopywrp'><p class='pushmachidtxt' title=" + this.DeviceId + ">" + DeviceId + "</p><i class='icon ion-ios-copy' title='Copy To Clipboard' onclick='copyToClipboard(\"" + this.DeviceId + "\")'></i></div></td>" +
                    Status +
                    "<td class='text-color-blue'>" + DeviceName + "(" + OSName + ")" + "</td>" +
                    "<td>" + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(this.DeviceDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(this.DeviceDate)) + "</td>" +
                    "</tr>"
            });
            $("#ui_tblReportData").removeClass('no-data-records');
            $("#ui_tbodyReportData").html(reportTableTrs);
            ShowExportDiv(true);
        }
        else {
            ShowExportDiv(false);
            ShowPagingDiv(false);
        }
        HidePageLoading();
    },
    AddToGroup: function () {
        let GroupId = $(".addgroupselect option:selected").val();
        let DeviceIdList = mobSubscribersUtil.GetSelectedDeviceIdIds();

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
                    mobSubscribersUtil.ClearCheckedBox();
                },
                error: ShowAjaxError
            });
        } else {
            ShowErrorMessage(GlobalErrorList.MobileDeviceInfo.SelectedDeviceIdError);
        }
    },
    GetSelectedDeviceIdIds: function () {

        let DeviceIdList = [];

        $("input:checkbox:checked:not(#chkAll):not([name='ddcl-ui_drpTarRetainGrp'])").map(function () {
            DeviceIdList.push($(this).val());
        });

        return DeviceIdList;
    },
    ClearSearchFields: function () {
        $("#searchFilterBox").val("");
        mobileSubscribers.DeviceId = "";
        mobileSubscribers.Name = "";
    },
    GetSubscribersByFilter: function () {
        if ($("#ui_spanFilter").text().toLowerCase() == "filter by") {
            ShowErrorMessage(GlobalErrorList.MobileDeviceInfo.FilterByError);
        } else if ($("#ui_spanFilter").text().toLowerCase() == "device name") {
            mobileSubscribers.DeviceId = "";
            if (CleanText($.trim($("#searchFilterBox").val())).length > 0) {
                mobileSubscribers.Name = CleanText($.trim($("#searchFilterBox").val()));
                mobSubscribersUtil.MaxCount();
            }
            else {
                ShowErrorMessage(GlobalErrorList.MobileDeviceInfo.DeviceNameError);
            }

        } else if ($("#ui_spanFilter").text().toLowerCase() == "device id") {
            mobileSubscribers.Name = "";
            if (CleanText($.trim($("#searchFilterBox").val())).length > 0) {
                mobileSubscribers.DeviceId = CleanText($.trim($("#searchFilterBox").val()));
                mobSubscribersUtil.MaxCount();
            } else {
                ShowErrorMessage(GlobalErrorList.MobileDeviceInfo.DeviceIdError);
            }
        }
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
        setTimeout(function () { mobSubscribersUtil.GetContactGroup(); }, 2000);
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
                data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'deviceIds': chkArrayContactId }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) {
                    $.each(response, function (i) {
                        if (PreContactGroupId.indexOf($(this)[0].Id) == -1) { PreContactGroupId.push($(this)[0].Id) };
                    });

                    mobSubscribersUtil.BindGroupName();
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
}




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


$(".dropdown-menu .visitfiltWrap a").click(function () {
    var filterListVal = $(this).text();
    if (filterListVal == "All") {
        $(".btn-dropdown").focus();
        $("#filterTags span").html(filterListVal);
        $(".subdivFiltWrap").removeClass("showDiv");
        mobSubscribersUtil.ClearSearchFields();
        mobSubscribersUtil.MaxCount();
    } else {
        $(".btn-dropdown").focus();
        $("#filterTags span").html(filterListVal);
        $(".subdivFiltWrap").addClass("showDiv");
        $("#searchFilterBox").attr("placeholder", "Search " + filterListVal);
    }
});


//Add to Group
$("#ui_addSubToGroups").click(function () {
    mobSubscribersUtil.AddToGroup();
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
    mobSubscribersUtil.OpenGroup();
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