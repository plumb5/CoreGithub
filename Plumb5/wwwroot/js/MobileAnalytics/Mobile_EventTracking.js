var RowId = 0, EventId = 0,dropdownfilterSearchValue = '', SearchTextValue = '';
$(document).ready(function () {
   ExportFunctionName = "EventTrackingExport";
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
function MaxCount() {
    SearchTextValue = $('#searchFilterBox').val();
    if (dropdownfilterSearchValue == 'All' || dropdownfilterSearchValue == 'CreatedDate') {
        dropdownfilterSearchValue = dropdownfilterSearchValue == 'All' ? '' : dropdownfilterSearchValue;
        SearchTextValue = '';
    }

    $.ajax({
        url: "/MobileAnalytics/MobileApp/EventTrackingCount",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'fromdate': FromDateTime, 'todate': ToDateTime, 'drpSearchBy': dropdownfilterSearchValue, 'txtSearchBy': SearchTextValue }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            TotalRowCount = 0;
            if (response != undefined && response != null && response.Table != undefined && response.Table != null && response.Table.length > 0) {
                $.each(response.Table, function () {
                    TotalRowCount = this.TotalRows;
                });
            }

            if (TotalRowCount > 0) {
                $('#filterTags').show();
                GetReport();
            }
            else {
                $('#filterTags').hide();
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
        url: "/MobileAnalytics/MobileApp/BindEventTrackingAllReport",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'duration': duration, 'fromdate': FromDateTime, 'todate': ToDateTime, 'start': OffSet, 'end': FetchNext, 'drpSearchBy': dropdownfilterSearchValue, 'txtSearchBy': SearchTextValue }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindReport,
        error: ShowAjaxError
    });
}
function BindReport(response) {
    SetNoRecordContent('ui_tblReportData', 5, 'ui_tbodyReportData');
    if ( response.Table != undefined && response.Table != null && response.Table.length > 0) {
        
        CurrentRowCount = response.Table.length;
        PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);

        var reportTableTrs;

        $.each(response.Table, function () {
            reportTableTrs += "<tr>" +
                //"<td class='m-p-w-140 text-left'><p>" + this.Name + "</p><div class='editDeleteWrap'><button data-colheadTitle='Edit Event Tracking' class='td-edit editEventTrack popViewHref' onclick='ShowEventEditPopup(" + this.EventId + ");'>Edit</button > <button data-toggle='modal' data-target='#deleterow' class='td-delete delEventTrack' onclick='ShowDeletePopup(" + this.EventId + ");'>Delete</button></div ></td>" +
                "<td class='m-p-w-170'>" + this.Name + "</td>" +
                "<td class='m-p-w-170'>" + this.Type + "</td>" +
                //"<td>" + this.PageName + "</td>" +
                "<td>" + this.Value + "</td>" +
                "<td>" + this.TotalClicks + "</td>" +
                "<td>" + (this.UniqueVisit != "0" ? "<a class='ViewPermission' href='/MobileAnalytics/MobileApp/UniqueVisits?dur=0&Frm=" + FromDateTime + "&To=" + ToDateTime + "&Events=" + this.Name + "'>" + this.UniqueVisit + "</a>" : this.UniqueVisit) + "</td>" +
                "</tr>";

        });


        $("#ui_tblReportData").removeClass('no-data-records');
        $("#ui_tbodyReportData").html(reportTableTrs);
        ShowEventEditPopup(EventId);
        
    } else {
       
        ShowPagingDiv(false);
    }
    HidePageLoading();
}
$("#btnAddEvent").click(function () {
    if ($("#txtIdentifierName").val().length === 0) {
        ShowErrorMessage(GlobalErrorList.Mobile_EventTracking.Identifier_Error);
        $("#txtIdentifierName").focus();
        return;
    }
    if ($("#txtEventName").val().length === 0) {
        ShowErrorMessage(GlobalErrorList.Mobile_EventTracking.EventName_Error);
        $("#txtEventName").focus();
        return;
    }
    var idOrClass = $('input[name=eventname]:checked').val() == "true" ? "id" : "class";
    $.ajax({
        url: "/MobileAnalytics/MobileApp//SaveEventTrackSetting",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'Names': $("#txtEventName").val(), 'Events': $("#txtIdentifierName").val(), 'EventType': idOrClass, 'Action': 'Save' }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response > 0 && response != null) {
                ShowSuccessMessage(GlobalErrorList.Mobile_EventTracking.Success_Message);
                $("#addLandingpage").click();
                CallBackFunction();
                $("#txtIdentifierName").val("");
                $("#txtEventName").val("");
            }
            else
                ShowErrorMessage(GlobalErrorList.Mobile_EventTracking.Duplicate_Error);
        },
        error: ShowAjaxError
    });

});

$("#btnUpdate").click(function () {
    if ($("#indentifierName").val().length === 0) {
        ShowErrorMessage(GlobalErrorList.Mobile_EventTracking.Identifier_Error);
        $("#indentifierName").focus();
        return;
    }
    if ($("#eventTrackName").val().length === 0) {
        ShowErrorMessage(GlobalErrorList.Mobile_EventTracking.EventName_Error);
        $("#eventTrackName").focus();
        return;
    }
    var idOrClass = $('input[name=eventtype]:checked').val() == "true" ? "id" : "class";
    $.ajax({
        url: "/MobileAnalytics/MobileApp/UpdateEventTrackSetting",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'Names': $("#indentifierName").val(), 'Events': $("#eventTrackName").val(), 'EventType': idOrClass, 'Action': 'Update', 'Id': EventId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response > 0 && response != null) {
                ShowSuccessMessage(GlobalErrorList.Mobile_EventTracking.Update_Message);
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
                $("#" + checkTableName).parents(".tableWrapper").addClass("h-400");
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
            if (eventClassIdVal == "class") {
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
        url: "/MobileAnalytics/MobileApp/DeleteEventTrackSetting",
        type: 'Post',
        data: "{'accountId':" + Plumb5AccountId + ",'Action':'Delete','Id':" + EventId + "}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response > 0 && response != null) {
                ShowSuccessMessage(GlobalErrorList.EventTracking_Page.Delete_Message);
                CallBackFunction();
            }
        },
        error: function (objxmlRequest) {
            window.console.log(objxmlRequest.responseText);
        }
    });
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
        url: "/MobileAnalytics/MobileApp/BindEventTrackingFilterValues",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'fromdate': FromDateTime, 'todate': ToDateTime, 'drpSearchBy': dropdownfilterSearchValue }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            window.searchFilterBox.innerHTML = '';
            window.searchFilterBox.innerHTML += "<option label='Select'>Select</option>";
            $.each(response.Table, function () {
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
        ShowErrorMessage(GlobalErrorList.Mobile_EventTracking.SelectEventName);
        HidePageLoading();
        return;
    }
    MaxCount();
});
