var RowId = 0, EventId = 0, dropdownfilterSearchValue = '', SearchTextValue = '';
$(document).ready(function () {
    GetUTCDateTimeRange(2);
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
function CallBackInnerPaging() {
    CurrentInnerRowCount = 0;
    GetInnerReport();
}
function MaxCount() {
    SearchTextValue = $('#searchFilterBox').val();
    if (SearchTextValue == 'Select')
        SearchTextValue = '';
    if (dropdownfilterSearchValue == 'All' || dropdownfilterSearchValue == 'CreatedDate') {
        dropdownfilterSearchValue = dropdownfilterSearchValue == 'All' ? '' : dropdownfilterSearchValue;
        SearchTextValue = '';
    }
    $.ajax({
        url: "/Analytics/Content/GetEventTrackingReportCount",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'fromdate': FromDateTime, 'todate': ToDateTime, 'drpSearchBy': dropdownfilterSearchValue, 'txtSearchBy': SearchTextValue }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            TotalRowCount = 0;
            if (response != undefined && response != null && response.Table1 != undefined && response.Table1 != null && response.Table1.length > 0)
                TotalRowCount = response.Table1[0].TotalRows;

            if (TotalRowCount > 0) {
                $('#filterTags').show();
                GetReport();
            }
            else {
                $('#filterTags').hide();
                SetNoRecordContent('ui_tblReportData', 6, 'ui_tbodyReportData');
                HidePageLoading();
            }
        },
        error: ShowAjaxError
    });
}
function GetReport() {
    FetchNext = GetNumberOfRecordsPerPage();

    $.ajax({
        url: "/Analytics/Content/BindEventTrackingReport",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'duration': duration, 'fromdate': FromDateTime, 'todate': ToDateTime, 'start': OffSet, 'end': FetchNext, 'drpSearchBy': dropdownfilterSearchValue, 'txtSearchBy': SearchTextValue }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindReport,
        error: ShowAjaxError
    });
}
function BindReport(response) {
    SetNoRecordContent('ui_tblReportData', 6, 'ui_tbodyReportData');
    if (response != undefined && response != null && response.ds.Table1 != undefined && response.ds.Table1 != null && response.ds.Table1.length > 0) {

        CurrentRowCount = response.ds.Table1.length;
        PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);

        var reportTableTrs;
        $.each(response.ds.Table1, function () {
            if (this.ActiveStatus == 1) 
                statuscontent = "<td class='text-center'><i id=Icon_" + this.EventId + " title='Active' class='icon ion-ios-checkmark-outline ContributePermission' onclick='UpdateStatus(" + this.EventId + ");'></i></td>";
            else
                statuscontent = "<td class='text-center'><i id=Icon_" + this.EventId + " title='InActive' class='fa fa-ban ContributePermission' onclick='UpdateStatus(" + this.EventId + ");'></i></td>";
            //**** For Output Cache ToDateTime *******
              //  ToDateTime = response.CurrentUTCDateTimeForOutputCache;
             //**** For Output Cache ToDateTime *******

            reportTableTrs += "<tr>" +
                "<td class='m-p-w-140 text-left'><p>" + this.Name + "</p><div class='editDeleteWrap'><button data-colheadTitle='Edit Event Tracking' class='td-edit editEventTrack popViewHref ContributePermission' onclick='ShowEventEditPopup(" + this.EventId + ");'>Edit</button> <button data-toggle='modal' data-target='#deleterow' class='td-delete delEventTrack FullControlPermission' onclick='ShowDeletePopup(" + this.EventId + ");'>Delete</button></div></td>" +
                "<td class='m-p-w-170'>" + this.EventName + "</td>" +
                "<td class='cursor-pointer' onclick='ShowEventValueReport(\"" + this.Name + "\",\"" + this.EventName + "\",\"" + this.EventType + "\")'; >" + this.EventValue + "</td > " +
                "<td>" + this.EventType + "</td>" +
                "" + statuscontent + "" +
                "<td>" + this.TotalClicks + "</td>" +
                "<td>" + (this.UniqueClicks != "0" ? "<a class='ViewPermission' href='/Analytics/Uniques/UniqueVisits?dur="+duration+"&Frm=" + FromDateTime + "&To=" + ToDateTime + "&Events=" + this.EventName + "'>" + this.UniqueClicks + "</a>" : this.UniqueClicks) + "</td>" +
                "</tr>";
        });

        $("#ui_tblReportData").removeClass('no-data-records');
        $("#ui_tbodyReportData").html(reportTableTrs);
        ShowEventEditPopup(EventId);
    }
    else {
        ShowPagingDiv(false);
    }
    HidePageLoading();
    CheckAccessPermission("Analytics");
}
$("#btnAddEvent").click(function () {
    if ($("#txtIdentifierName").val().length === 0) {
        ShowErrorMessage(GlobalErrorList.EventTracking_Page.Identifier_Error);
        $("#txtIdentifierName").focus();
        return;
    }
    if ($("#txtEventName").val().length === 0) {
        ShowErrorMessage(GlobalErrorList.EventTracking_Page.EventName_Error);
        $("#txtEventName").focus();
        return;
    }
    var idOrClass = $('input[name=eventname]:checked').val() == "true" ? "id" : "class";
    $.ajax({
        url: "/Analytics/Content/SaveEventTrackSetting",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'Names': $("#txtIdentifierName").val(), 'Events': $("#txtEventName").val(), 'EventType': idOrClass, 'Action': 'Insert' }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response.Table1[0].inserteventsetting_insert > 0 && response.Table1 != null) {
                ShowSuccessMessage(GlobalErrorList.EventTracking_Page.Success_Message);
                $("#addLandingpage").click();
                CallBackFunction();
                $("#txtIdentifierName").val("");
                $("#txtEventName").val("");  
                $('#customRadio1').prop('checked', true);
            }
            else
                ShowErrorMessage(GlobalErrorList.EventTracking_Page.Duplicate_Error);
        },
        error: ShowAjaxError
    });

});
$("#btnUpdate").click(function () {
    if ($("#indentifierName").val().length === 0) {
        ShowErrorMessage(GlobalErrorList.EventTracking_Page.Identifier_Error);
        $("#indentifierName").focus();
        return;
    }
    if ($("#eventTrackName").val().length === 0) {
        ShowErrorMessage(GlobalErrorList.EventTracking_Page.EventName_Error);
        $("#eventTrackName").focus();
        return;
    }
    var idOrClass = $('input[name=eventtype]:checked').val() == "true" ? "id" : "class";
    $.ajax({
        url: "/Analytics/Content/UpdateEventTrackSetting",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'Names': $("#indentifierName").val(), 'Events': $("#eventTrackName").val(), 'EventType': idOrClass, 'Action': 'Update', 'Id': EventId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response.Table1[0].inserteventsetting_update > 0 && response.Table1 != null) {
                ShowSuccessMessage(GlobalErrorList.EventTracking_Page.Update_Message);
                $(".rightPopupwrap").removeClass('showFlx');
                CallBackFunction();
                $("#indentifierName").val("");
                $("#eventTrackName").val("");
                $('#addLandingpage1').hide();
            }
        },
        error: ShowAjaxError
    });
});
$("#btnCancel").click(function () {
    $(".rightPopupwrap").removeClass('showFlx');
});

var eventIdentName, eventnameVal, eventClassIdVal, rowactiveBg;
function ShowEventEditPopup(eventId) {
    EventId = eventId;
    $(".popViewHref").click(function () {
        var colHeadVal = $(this).attr("data-colheadTitle");
        var checkTableName = $(this).closest('table').attr('id');
        var rowCount = $("#" + checkTableName + " tbody tr").length;
        eventIdentName = $(this).parent().prev().text();
        eventnameVal = $(this).parents('td').next().text();
        eventClassIdVal = $(this).parents('td').next().next().text();
        rowactiveBg = $(this).parents('tr');
        if (colHeadVal == "Edit Event Tracking") {

            if (rowCount <= 5) {
                $(".topbandWrap h6").html(colHeadVal);
                $("#" + checkTableName).parents(".Table1Wrapper").addClass("h-400");
                $(".rightPopupwrap").addClass('showFlx');
                $(".popupslideItem").addClass('show');
                $(".tbl-pageVisits, .tbl-sources, .tbl-searchkey, .tbl-cities").addClass('hideDiv');
                $(".tbl-eventTrack").removeClass('hideDiv');
            } else {
                $(".topbandWrap h6").html(colHeadVal);
                $(".rightPopupwrap").addClass('showFlx');
                $(".popupslideItem").addClass('show');
                $(".tbl-pageVisits, .tbl-sources, .tbl-searchkey, .tbl-cities").addClass('hideDiv');
                $(".tbl-eventTrack").removeClass('hideDiv');
            }
            $("#indentifierName").val(eventIdentName);
            $("#eventTrackName").val(eventnameVal);
            if (eventClassIdVal.toLowerCase() == "class") {
                $("#eventClass").prop('checked', true);
            } else {
                $("#eventId").prop('checked', true);
            }
        }
    });
}
function ShowDeletePopup(eventid) {
    EventId = eventid;
}
$("#deleteRowConfirm").click(function () {
    $.ajax({
        url: "/Analytics/Content/DeleteEventTrackSetting",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'Action': 'Delete', 'Id': EventId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response.Table1[0].inserteventsetting_delete > 0 && response.Table1 != null) {
                ShowSuccessMessage(GlobalErrorList.EventTracking_Page.Delete_Message);
                CallBackFunction();
            }
        },
        error: function (objxmlRequest) {
            window.console.log(objxmlRequest.responseText);
        }
    });
});
$(".topbandWrap i.ion-android-close").click(function () {
    $(this).parents('.rightPopupwrap').removeClass('showFlx');
    $(rowactiveBg).removeClass("activeBgRow");
    if ($(".Table1Wrapper").hasClass("h-400")) {
        $(".Table1Wrapper").removeClass("h-400");
    }
});
$(".dropdown-menu .visitfiltWrap a").click(function () {
    var filterListVal = $(this).text();
    dropdownfilterSearchValue = $(this).attr('value');
    if (filterListVal == "All" || filterListVal == "Sort by Event CreatedDate") {
        $(".btn-dropdown").focus();
        $("#filterTags span").html(filterListVal);
        $(".subdivFiltWrap").removeClass("showDiv");
        $('#searchFilterBox').val('');
        ShowPageLoading();
        MaxCount();
    } else {
        $(".btn-dropdown").focus();
        $("#filterTags span").html(filterListVal);
        $(".subdivFiltWrap").addClass("showDiv");
        $("#searchFilterBox").attr("placeholder", "Search " + filterListVal);
        ShowPageLoading();
        BindFilterValues();
    }

});
function BindFilterValues() {
    $.ajax({
        url: "/Analytics/Content/BindEventTrackingFilterValues",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'fromdate': FromDateTime, 'todate': ToDateTime, 'drpSearchBy': dropdownfilterSearchValue }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            window.searchFilterBox.innerHTML = '';
            window.searchFilterBox.innerHTML += "<option label='Select'>Select</option>";
            $.each(response.Table1, function () {
                window.searchFilterBox.innerHTML += "<option label='" + this.FilterValue + "'>" + this.FilterValue + "</option>";
            });
            HidePageLoading();
        },
        error: ShowAjaxError
    });
}
$("#ui_btnSearch").click(function () {
    ShowPageLoading();
    if ($('#searchFilterBox').val() == "Select") {
        ShowErrorMessage(GlobalErrorList.EventTracking_Page.SelectEventName);
        HidePageLoading();
        return;
    }
    MaxCount();
});
function UpdateStatus(Id) {
    var Status = 0;
    ShowPageLoading();
    if ($("#Icon_" + Id).hasClass("fa fa-ban"))
        Status = 1;
    $.ajax({
        url: "/Analytics/Content/UpdateStatus",
        type: 'POST',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'Id': Id, 'Status': Status }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response) {
                ShowSuccessMessage(GlobalErrorList.EventTracking_Page.StatusUpdate_Message);
                MaxCount();
            }
            HidePageLoading();
        },
        error: ShowAjaxError
    });
}
$("#close-popup, .clsepopup").click(function () {
    $(this).parents(".popupcontainer").addClass("hideDiv");
});
function getEvents(name, tagid, type) {
    $("#dvEventValue").removeClass('hideDiv');
}

var TotalInnerRowCount = 0, CurrentInnerRowCount = 0, Eventname = '', Event = '', EventType = '';
function ShowEventValueReport(eventname, event, eventtype) {
    InnerOffSet = 0;
    ShowPageLoading();
    TotalInnerRowCount = 0;
    CurrentInnerRowCount = 0;
    Eventname = eventname;
    Event = event;
    EventType = eventtype;
    MaxInnerCount();

}
function MaxInnerCount() {
    $.ajax({
        url: "/Analytics/Content/GetEventValueMaxCount",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'fromdate': FromDateTime, 'todate': ToDateTime, 'Events': Event }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            TotalInnerRowCount = response.returnVal;
            if (TotalInnerRowCount > 0)
                GetInnerReport();
            else {
                $("#ui_tbodyValidationOverviewReportData").empty().append('<tr><td colspan="3" class="border-bottom-none"><div class="no-data">There is no data for this view</div></td></tr>');
                HidePageLoading();
            }
        },
        error: ShowAjaxError
    });
}
function GetInnerReport() {
    InnerFetchNext = GetInnerNumberOfRecordsPerPage();
    $.ajax({
        url: "/Analytics/Content/BindEventValueReport",
        type: 'POST',
        data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'eventName': Eventname, 'events': Event, 'eventType': EventType, 'fromdate': FromDateTime, 'todate': ToDateTime, 'OffSet': InnerOffSet, 'FetchNext': InnerFetchNext }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: BindInnerReport,
        error: ShowAjaxError
    });
}
function BindInnerReport(response) {
    $("#dvEventValue").removeClass('hideDiv');
    var EventValueTableTrs;
    if (response != undefined && response != null && response.EventValueData.Table1 != undefined && response.EventValueData.Table1 != null &&
        response.EventValueData.Table1.length > 0) {
        CurrentInnerRowCount = response.EventValueData.Table1.length;
        InnerPagingPrevNext(InnerOffSet, CurrentInnerRowCount, TotalInnerRowCount);

        $.each(response.EventValueData.Table1, function () {

            EventValueTableTrs += "<tr>" +
                "<td class='text-left td-icon'>" + this.EventValue + "</td>" +
                "<td class='text-left td-icon'>" + this.Toalclicks + "</td >" +
                "<td class='text-left td-icon'>" + this.TotalUniqueclicks + "</td>" + "</tr>";
        });
        ShowInnerPagingDiv(true);
    }
    else {
        ShowInnerPagingDiv(false);
        $("#tbleventvaluedata").html('<tr><td colspan="3" class="border-bottom-none"><div class="no-data">There is no data for this view</div></td></tr>');
    }
    $("#ui_tblMailInnerReportData").removeClass('no-data-records');
    $("#tbleventvaluedata").html(EventValueTableTrs);
    HidePageLoading();
}
