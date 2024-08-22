var CustomEventsReport = [];
var checkBoxClickCount, addGroupNameList;
var CustomEventName = null;
var deleteId;


$(document).ready(function () {
    ExportFunctionName = "ExportCustomOverViewReport";
    $("#txt_SearchBy").keydown(function (event) {
        if (event.keyCode == 13) {
            if (CleanText($.trim($('#txt_SearchBy').val())).length == 0) {
                ShowErrorMessage(GlobalErrorList.MailScheduleError.CampaignsName);
                return false;
            }

            //CustomEventsReportUtil.MaxCount();
            event.preventDefault();
            return false;
        }
    });
    GetUTCDateTimeRange(2);


});
function CallBackFunction() {
    ShowPageLoading();
    TotalRowCount = 0;
    CurrentRowCount = 0;
    CustomEventsReportUtil.MaxCount();
}
function CallBackPaging() {

    ShowPageLoading();
    CurrentRowCount = 0;
    CustomEventsReportUtil.GetReport();

}
var CustomEventsReportUtil = {
    MaxCount: function () {
        CustomEventName = CleanText($.trim($('#txt_SearchBy').val()));
        $.ajax({
            url: "/CustomEvents/CustomEventsOverview/GetMaxCount",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime, 'CustomEventName': CustomEventName }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                TotalRowCount = 0;
                if (response != undefined && response != null && response.returnVal > 0) {
                    TotalRowCount = response.returnVal;
                }

                if (TotalRowCount > 0) {
                    CustomEventsReportUtil.GetReport();
                }
                else {
                    SetNoRecordContent('ui_tableReport', 4, 'ui_trbodyReportData');
                    HidePageLoading();
                }
            },
            error: ShowAjaxError
        });
    },
    GetReport: function () {
        CustomEventName = CleanText($.trim($('#txt_SearchBy').val()));
        FetchNext = GetNumberOfRecordsPerPage();
        $.ajax({
            url: "/CustomEvents/CustomEventsOverview/GetReportData",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'OffSet': OffSet, 'FetchNext': FetchNext, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime, 'CustomEventName': CustomEventName }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: CustomEventsReportUtil.BindReport,
            error: ShowAjaxError
        });
    },

    BindReport: function (response) {
        SetNoRecordContent('ui_tableReport', 12, 'ui_trbodyReportData');
        PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);
        ShowExportDiv(true);
        if (response != undefined && response != null && response.length > 0) {
            CustomEventsReport = response;
            CurrentRowCount = response.length;
            PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);
            $("#ui_trbodyReportData").html('');
            $("#ui_tableReport").removeClass('no-data-records');


            $.each(response, function () {
                CustomEventsReportUtil.BindEachReport(this);
            });

        }

        HidePageLoading();
        CheckAccessPermission("CustomEvents");
    },

    BindEachReport: function (CustomEventsReport) {

        /** Template string literal has been implement */
        var trackerstatus = `<td class="text-color-success">Running</td>`;
        if (CustomEventsReport.TrackScript == 0)
            trackerstatus = `<td class="text-color-error">Stopped</td>`;
        let reportTable = `<tr id="tr_${CustomEventsReport.Id}">
                            <td>
                                <div class="groupnamewrap"><div class="nameTxtWrap custeventname"><span>${CustomEventsReport.EventName}</span> <span><i class="icon ion-ios-information ml-3 viewcustdata"  onclick='CustomEventsReportUtil.EventMappingDetails("${CustomEventsReport.Id}","${CustomEventsReport.EventName}")' ></i></span></div><div class="tdcreatedraft"><div class="dropdown"><button type="button" class="verticnwrp"data-toggle="dropdown" aria-haspopup="true"aria-expanded="false">
                                                        <i class="icon ion-android-more-vertical mr-0"></i> </button><div class="dropdown-menu dropdown-menu-right"
                                                         aria-labelledby="filterbycontacts">
                                                        <a class="dropdown-item"
                                                           href="javascript:void(0)" id="ui_stoptrack" att_stoptrack=${CustomEventsReport.Id}>Change Tracking Status</a>
                                                        <a class="dropdown-item" id="ui_viewdata"
                                                           href="javascript:void(0)" att_attreventimpname="${CustomEventsReport.EventName}" attreventimpID=${CustomEventsReport.Id}>
                                                            View Data
                                                        </a>
                                                        <a class="dropdown-item" id="ui_aggregatedata" href= "javascript:void(0)" att_aggregatedataid=${CustomEventsReport.Id} att_aggergatedataname="${CustomEventsReport.EventName}">Aggregate Data</a>
                                                       <a class="dropdown-item" id="ui_customfieldsettings" href= "javascript:void(0)" att_customfieldsettingsid=${CustomEventsReport.Id} att_customfieldsettingsname="${CustomEventsReport.EventName}">Custom Fields Settings</a>
                                                        <div class="dropdown-divider"></div>
                                                        <a data-toggle="modal"
                                                           data-target="#deletegroups"   id="ui_deletedata"
                                                           data-grouptype="groupDelete" 
                                                           class="dropdown-item"
                                                           href="javascript:void(0)" onclick="CustomEventsReportUtil.ShowDeletePopUp(${CustomEventsReport.Id});">Delete</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                              </td>
                              ${trackerstatus}
                                <td>${CustomEventsReport.TotalEventCount}</td>
                            <td>${$.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(CustomEventsReport.UpdatedDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(CustomEventsReport.UpdatedDate))}</td>
                        </tr>`;


        $("#ui_trbodyReportData").append(reportTable);
    },
    EventMappingDetails: function (customEventOverViewId, eventname) {
        ShowPageLoading();
        $("#tr_" + customEventOverViewId).closest("tr").addClass("activeBgRow"); 
        $(".popupcontainer").removeClass("hideDiv");
        $("#divcustomeventsettings").addClass("hideDiv");
        $(".popuptitlwrp h6").text("Event Extra Fields Properties");

        $("#divevent").empty();
        $.ajax({
            url: "/CustomEvents/CustomEventsOverview/GetEventExtraFieldData",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'customEventOverViewId': customEventOverViewId, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime, 'contactid': 0 }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                var reportTable = "";
                $.each(response, function () {

                    reportTable += `
                             <div class="itemwrap" >
                            <div class="borderhoriz"></div>
                            <div class="itemname">${this.FieldName}</div>
                            <div class="itemtype">${this.FieldMappingType}</div>
                            </div>
                          `;

                });
                $("#divevent").append(reportTable)
                HidePageLoading();
            },

            error: ShowAjaxError
        });

    },
    ShowDeletePopUp: function (deleteeventid) {

        deleteId = deleteeventid;
    },
    DeleteCustomEventDetails: function () {

        $.ajax({
            url: "/CustomEvents/CustomEventsOverview/DeleteCustomEventOverViewDetails",
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'Id': deleteId }),
            dataType: "json",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataFilter: function (data) { return data; },
            success: function (response) {
                if (response) {
                    CustomEventsReportUtil.MaxCount();
                    ShowSuccessMessage(GlobalErrorList.CustomEvent.SuccessDeleted);
                }

                else
                    ShowErrorMessage(GlobalErrorList.CustomEvent.FailedDelete);


            },
        });
    },
    CustmEventFieldNamesettingd: function (customEventOverViewId) {
        $.ajax({
            url: "/CustomEvents/CustomEventsOverview/GetEventExtraFieldDatasettings",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'customEventOverViewId': customEventOverViewId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                var EventFieldNamesSettings = JSLINQ(response).OrderBy("DisplayOrder")
               
                    for (var i = 0; i < EventFieldNamesSettings.items.length; i++) {
                        let SettingTR = `<tr id="ui_trSetting_${i}" displayorder="${i}" value="${EventFieldNamesSettings.items[i].Id}" customEventOverViewId="${EventFieldNamesSettings.items[i].CustomEventOverViewId}">
                                <td>
                                    <div class="groupnamewrap">
                                    <div class="nametxticnwrp">
                                      <i class="griddragicn"></i>
                                      <span class="wordbreak">${EventFieldNamesSettings.items[i].FieldName}</span>
                                    </div>
                                    </div>
                                </td> 
                           </tr>`;
                        $("#ui_tbodyReportDatasettings").append(SettingTR);
                    }
                    
               

                HidePageLoading();
            },

            error: ShowAjaxError
        });
    }
}
$('input[name="lmsaddrulautonotifeml"]').click(function () {
    $(".lmsaddrulautoemlbdy").toggleClass("hideDiv");
});

$(document).on('click', '#ui_stoptrack', function () {
    var id = $(this).attr('att_stoptrack');

    $.ajax({
        url: "/CustomEvents/CustomEventsOverview/StopEventTrack",
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'Id': id }),
        dataType: "json",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataFilter: function (data) { return data; },
        success: function (response) {
            if (response != undefined && response != null) {
                if (response.returnVal) {
                    CustomEventsReportUtil.GetReport();
                    ShowSuccessMessage(GlobalErrorList.CustomEvent.SucessStartTrack);

                }
                else {

                    CustomEventsReportUtil.GetReport();
                    ShowSuccessMessage(GlobalErrorList.CustomEvent.SucessStopTrack);
                }
            }
            else
                ShowErrorMessage(GlobalErrorList.CustomEvent.FailedStopTrack);


        },
    });
});
$("#deleteRowConfirm").click(function () {
    CustomEventsReportUtil.DeleteCustomEventDetails();
});

$(document).on('click', '#close-popup,.clsepopup', function () {
    $(this).parents(".popupcontainer").addClass("hideDiv");
    $("tr").removeClass("activeBgRow");
});

$(document).on('click', '#ui_viewdata', function () {
    var Id = $(this).attr('attreventimpID');
    var event_name = $(this).attr('att_attreventimpname');

    window.location.href = "/CustomEvents/ViewCustomEventData?EventId=" + Id + "&&EventName=" + event_name + "&&duration=" + duration + "&&cstfromdate=" + $("#ui_txtStartDate").val() + "&&csttodate=" + $("#ui_txtEndDate").val() + "";

});
$(document).on('click', '#ui_aggregatedata', function () {
    var aggergateId = $(this).attr('att_aggregatedataid');
    var aggergateeventname = $(this).attr('att_aggergatedataname');

    window.location.href = "/CustomEvents/ViewAggregateEventData?EventId=" + aggergateId + "&&EventName=" + aggergateeventname + "&&duration=" + duration + "&&cstfromdate=" + $("#ui_txtStartDate").val() + "&&csttodate=" + $("#ui_txtEndDate").val() + "";

});
document.getElementById("txt_SearchBy").addEventListener("keyup", function (event) {
    const key = event.key;
    if (key === "Backspace") {
        if (CleanText($.trim($('#txt_SearchBy').val())).length == 0) {
            CustomEventName = "";
            CallBackFunction();
        }
    }
    else if (key == "Enter") {
        CallBackFunction();
    }
    event.preventDefault(); return false;


});
$(".serchicon").click(function () {
    if (CleanText($.trim($('#txt_SearchBy').val())).length == 0) {
        ShowErrorMessage(GlobalErrorList.CustomEvent.Eventname);
        return false;
    }
    CallBackFunction();
});
$(document).on('click', '#ui_customfieldsettings', function () {
    var _customEventOverViewId = $(this).attr('att_customfieldsettingsid'); 
    ShowPageLoading();
    $("#viewcustdatapop").addClass("hideDiv");
    $("#divcustomeventsettings").removeClass("hideDiv");
    $("#tr_" + _customEventOverViewId).closest("tr").addClass("activeBgRow");  
    SetNoRecordContent('ui_tableReports', 3, 'ui_tbodyReportDatasettings');
    $("#ui_tableReports").removeClass('no-data-records');
    $("#ui_tbodyReportDatasettings").html('');
    CustomEventsReportUtil.CustmEventFieldNamesettingd(_customEventOverViewId);
  
    HidePageLoading();
    
});
$('.sorted_table').sortable({
    handle: '.griddragicn',
    containerSelector: 'table',
    itemPath: '> tbody',
    itemSelector: 'tr',
    placeholder: '<tr class="placeholder"/>',
    onDrop: function ($item, container, _super) {
        ShowPageLoading();
        _super($item, container);

        var CustomeventId = [];
        var FieldnameDisplayOrder = [];
        var customEventOverViewId = [];
        var SettingList = [];

        $("#ui_tbodyReportDatasettings tr").each(function () {
            CustomeventId.push($(this).attr('value'));
            FieldnameDisplayOrder.push($(this).attr('displayorder'));
            customEventOverViewId.push($(this).attr('customEventOverViewId'));
        });

        FieldnameDisplayOrder = FieldnameDisplayOrder.sort(function (a, b) {
            return parseInt(a) - parseInt(b);
        });

        for (var i = 0; i < CustomeventId.length; i++) {
            var Customeventfieldsettings = { Id: CustomeventId[i], DisplayOrder: FieldnameDisplayOrder[i], CustomEventOverViewId: customEventOverViewId[i]};
            SettingList.push(Customeventfieldsettings);
        }

        $.ajax({
            url: "/CustomEvents/CustomEventsOverview/UpdateDisplayOrder",
            data: JSON.stringify({
                'AccountId': Plumb5AccountId, 'SettingList': SettingList
            }),
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response) {
                    ShowSuccessMessage(GlobalErrorList.LeadProperties.OrderUpdatedSuccessfully);
                    HidePageLoading();
                }
            },
            error: ShowAjaxError
        });

    }
});