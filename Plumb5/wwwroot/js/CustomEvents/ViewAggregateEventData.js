var MachineId = '';
var EventExtraFiledsName = [];
var CustomEventAggergateDetails = [];
var GroupbyCustomExtraFields = '';
var DisplayCustomExtraFields = [];
var GroupbyCustomExtraFieldsForContacts = [];
var DisplaymaxCustomExtraFieldsforexport = "";
var DisplaymaxCustomExtraFields = '';
var checkeddetailsgroups = [];
var checkeddetailsdisplay = [];
var uniquevisitorsCurrentRowCount = 0;
var totaluniquevisitorsrowcounts = 0;
var tabledynamicheadername = [];
var EventExtraFiledsNamesettings = new Array();
$(document).ready(function () {
    ExportFunctionName = "ExportAggregateCustomViewReport";
    customeventoverviewid = $.urlParam("EventId");
    customeventoverviewid = parseInt(customeventoverviewid);
    $(".pagetitle").text("Aggregate Data:" + $.urlParam("Eventname").replace(/%20/g, " "));
    GroupbyCustomExtraFields = 'EventData1';
    DisplayCustomExtraFields = ['EventData1'];
    GroupbyCustomExtraFieldsForContacts = ['EventData1'];
    DisplaymaxCustomExtraFields = 'max(EventData1) as EventData1';
    checkeddetailsgroups = ['acc'];
    checkeddetailsdisplay = ['pro'];
    GetUTCDateTimeRange(2);
    ///////////////////Uncomment this in case of passing date time of previous page///////////////////

    if ($.urlParam("duration") == 5) {

        $("#ui_txtStartDate").val($.urlParam("cstfromdate"))
        $("#ui_txtEndDate").val($.urlParam("csttodate"))
        $(".dateBoxWrap").addClass('showFlx');

    }
    GetUTCDateTimeRange($.urlParam("duration"));
    if ($.urlParam("duration") == '3')
        $("#selectdateDropdown").html('This Month');
    else if ($.urlParam("duration") == '2')
        $("#selectdateDropdown").html('This Week');
    else if ($.urlParam("duration") == '1')
        $("#selectdateDropdown").html('Today');
    else
        $("#selectdateDropdown").html('Custom Date Range');
    ShowPageLoading();
    $(".subdivFiltWrap").removeClass("showDiv");
});
$("#ui_exportOrDownload").click(function () {
    ExportFunctionName = "ExportAggregateCustomViewReport";
    $("#ui_ddl_ExportDataRange").attr("disabled", false);
});
function CallBackPaging() {

    ShowPageLoading();
    CurrentRowCount = 0;
    CustomAggregateEventsUtil.GetReport();

}

function CallBackFunction() {
    ShowPageLoading();
    TotalRowCount = 0;
    CurrentRowCount = 0;
    ContactTotalRowCount = 0;
    ContactCurrentRowCount = 0; 
  
    CustomAggregateEventsUtil.MaxCount();
    CustomAggregateEventsUtil.EventMappingDetails();
    //$("#addedprodpop").click();
    //$("#btnSearch").click();
    $(".subdivFiltWrap").removeClass("showDiv");

}

var CustomAggregateEventsUtil = {
    MaxCount: function () {
        $.ajax({
            url: "/CustomEvents/ViewAggregateEventData/GetMaxCount",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime, 'customeventoverviewid': customeventoverviewid, 'groupbyeventfields': GroupbyCustomExtraFields, 'displayextrafields': DisplaymaxCustomExtraFields, 'DisplayFieldsforexport': DisplaymaxCustomExtraFieldsforexport }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                TotalRowCount = 0;
                if (response != undefined && response != null && response.returnVal > 0) {
                    TotalRowCount = response.returnVal;
                }

                if (TotalRowCount > 0) {
                    $("#totalcountspan").text(TotalRowCount);
                    $("#addedprodpop").removeClass("hideDiv");
                    ShowPageLoading();
                    CustomAggregateEventsUtil.GetReport();
                    ShowExportDiv(true);
                }
                else {
                    $("#totalcountspan").text(0);
                    $("#addedprodpop").addClass("hideDiv");
                    SetNoRecordContent('ui_tableReport', 5, 'ui_trbodyReportData');
                    ShowExportDiv(false);
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
            url: "/CustomEvents/ViewAggregateEventData/GetAggregateData",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'OffSet': OffSet, 'FetchNext': FetchNext, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime, 'customeventoverviewid': customeventoverviewid, 'groupbyeventfields': GroupbyCustomExtraFields, 'displayextrafields': DisplaymaxCustomExtraFields }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: CustomAggregateEventsUtil.BindReport,

            error: ShowAjaxError
        });
    },

    BindReport: function (response) {

        var reportTablerows = "";
        SetNoRecordContent('ui_tableReport', 5, 'ui_trbodyReportData');
        if (response != undefined && response != null && response.Table != undefined && response.Table != null && response.Table.length > 0) {
            CurrentRowCount = response.Table.length;
            $("#ui_trbodyReportData").html('');
            PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);
            $("#producttitle").html(tabledynamicheadername[0]);
            CustomEventAggergateDetails = response,

                $.each(response.Table, function (i) {
                    reportTablerows += `<tr id="tr_${i}">
                                    <td>  <div class="machidcopywrp">
                                    <p class="pushmachidtxt">
                                    
                                    ${($(this)[0]["eventdata" + (DisplayCustomExtraFields[0].charAt(9))]) == null ? "NA" : ($(this)[0]["eventdata" + (DisplayCustomExtraFields[0].charAt(9))])}

                                    </p>
                                     <i class="icon ion-ios-information  viewcustdata"  onclick='CustomAggregateEventsUtil.GroupByWherecondition(${i},0,0);'></i>
                                    </div></td>

                                    <td>${$.datepicker.formatDate("M dd yy", ConvertUTCDateTimeToLocal(($(this)[0].lasttrandate))) + " " + PlumbTimeFormat(ConvertUTCDateTimeToLocal(($(this)[0].lasttrandate)))}</td>

                                    <td> ${($(this)[0].totalviews)}</td>
                                    <td data-viewdetail="Uniquecontact" class="cursor-pointer Uniquecontactpopup" onclick="CustomAggregateEventsUtil.GroupByWherecondition('${i}',1,'${($(this)[0].uniquevisitors)}')">${($(this)[0].uniquevisitors)}</td>

                                    <td data-viewdetail="Uniquecontact" class="cursor-pointer Uniquecontactpopup" contactcount="${($(this)[0].uniquecustomers)}" onclick="CustomAggregateEventsUtil.GroupByWherecondition('${i}',2,'${($(this)[0].uniquecustomers)}')">${($(this)[0].uniquecustomers)}</td>

                                </tr>`;


                });
            $("#ui_trbodyReportData").append(reportTablerows);
            HidePageLoading();
            /*CustomAggregateEventsUtil.EventMappingDetails();*/
            ShowExportDiv(true);
        }
        else {
            ShowExportDiv(false)
        }
    },

    GroupByWherecondition: function (index, uniqueFlag, uniquecounts) {

        ShowPageLoading();
        CustomAggregateEventsUtil.Refreshfields();
        for (var i = 0; i < GroupbyCustomExtraFieldsForContacts.length; i++) {
            groupEventData["EventData" + (GroupbyCustomExtraFieldsForContacts[i].slice(9))] = CustomEventAggergateDetails.Table[index]["eventdata" + (GroupbyCustomExtraFieldsForContacts[i].slice(9))] == null ? " " : CustomEventAggergateDetails.Table[index]["eventdata" + (GroupbyCustomExtraFieldsForContacts[i].slice(9))];
        }
        if (uniqueFlag == 0) {
            $("#tr_" + index).closest("tr").addClass("activeBgRow");
            CustomAggregateEventsUtil.Maxaggregatedetails();
        }
        if (uniqueFlag == 1) {
            totaluniquevisitorsrowcounts = uniquecounts;
            CustomAggregateEventsUtil.uniquevisitorsdetails();
        }
        if (uniqueFlag == 2) {
            totaluniquerowcounts = uniquecounts;
            CustomAggregateEventsUtil.uniquecontactdetails();
        }

    },
    Maxaggregatedetails: function () {
        $(".popuptitlwrp h6").text("Aggergate Details");
        $("#txtsearch").val('')
        $("#ui_tblReportDataPopUp").empty();
        FetchNext = GetNumberOfRecordsPerPage();
        ShowPageLoading();
        $("#ui_tblReportData").empty();
        $.ajax({
            url: "/CustomEvents/ViewAggregateEventData/GetMaxAggregateDetails",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime, 'customEventOverViewId': customeventoverviewid, 'OffSet': OffSet, 'FetchNext': FetchNext, 'eventFileds': groupEventData, 'DisplayCustomExtraFields': DisplayCustomExtraFields, 'eventextrafiledsName': EventExtraFiledsName }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                var reportTable = "";
                $.each(response, function (i) {
                    if (EventExtraFiledsName[(DisplayCustomExtraFields[i].slice(9)) - 1].FieldMappingType == 'number')
                        reportTable += "<tr><td>" + EventExtraFiledsName[(DisplayCustomExtraFields[i].slice(9)) - 1].FieldName + " (Total)</td> <td>" + ($(this)[0]["EventData1"] == null ? "NA" : $(this)[0]["EventData1"]) + "</td></tr>"
                    else
                        reportTable += "<tr><td>" + EventExtraFiledsName[(DisplayCustomExtraFields[i].slice(9)) - 1].FieldName + " (Popular)</td> <td>" + ($(this)[0]["EventData1"] == null ? "NA" : $(this)[0]["EventData1"]) + "</td></tr>"

                });
                $("#viewcustdatapop").removeClass("hideDiv");
                $("#ui_tblReportDataPopUp").append(reportTable);
                HidePageLoading();
            },
            error: ShowAjaxError

        });
    },

    uniquecontactdetails: function () {
        $("#viewcontactdatapop").removeClass("hideDiv");
        $(".popuptitlwrp h6").text("Unique Contact Details");
        $("#ui_tblReportData").empty();
        FetchNext = CustomGetNumberOfRecordsPerPage();

        $.ajax({
            url: "/CustomEvents/ViewAggregateEventData/GetUniqueContactDetails",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime, 'customEventOverViewId': customeventoverviewid, 'OffSet': OffSet, 'FetchNext': FetchNext, 'eventFileds': groupEventData }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != undefined && response != null && response.length > 0) {

                    customCurrentRowCount = response.length;

                    ShowPagingDiv(true);
                    var reportTable = "";
                    $.each(response, function () {

                        reportTable += `
                            <tr>
                                    <td class="text-left">${this.Name == null ? "NA" : this.Name}
                                    <td>${this.PhoneNumber == null ? "NA" : this.PhoneNumber}</td>
                                    <td>${this.EmailId == null ? "NA" : this.EmailId}</td>

                                </tr>
                          `;

                    });
                    $("#viewcontactdatapop").removeClass("hideDiv");
                    $("#ui_tblReportData").append(reportTable)
                    customPagingPrevNext(OffSet, customCurrentRowCount, totaluniquerowcounts);
                }
                else {
                    SetNoRecordContent('ui_tableReport', 5, 'ui_tblReportData');
                }
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },
    uniquevisitorsdetails: function () {
        ShowPageLoading();
        $("#viewvisitordatapop").removeClass("hideDiv");
        $(".popuptitlwrp h6").text("Unique Visitor Details");
        FetchNext = uniquevisitorsGetNumberOfRecordsPerPage();

        $("#ui_tblVisitorReportData").empty();
        $.ajax({
            url: "/CustomEvents/ViewAggregateEventData/GetUniquevisitorDetails",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime, 'customEventOverViewId': customeventoverviewid, 'OffSet': OffSet, 'FetchNext': FetchNext, 'eventFileds': groupEventData }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response.length > 0) {
                    uniquevisitorsCurrentRowCount = response.length;
                    var reportTable = "";
                    $.each(response, function () {

                        reportTable += `
                            <tr>
                                    <td class="text-left">${this.MachineId == null ? "NA" : this.MachineId}</td>
                                   
                                </tr>
                          `;

                    });
                    $("#viewvisitordatapop").removeClass("hideDiv");
                    $("#ui_tblVisitorReportData").append(reportTable)
                    uniquevisitorsPagingPrevNext(OffSet, uniquevisitorsCurrentRowCount, totaluniquevisitorsrowcounts);
                }
                else {
                    SetNoRecordContent('ui_tableReport', 1, 'ui_tblVisitorReportData');
                }
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },
    EventMappingDetails: function () {
        EventExtraFiledsName = [];

        $.ajax({
            url: "/CustomEvents/CustomEventsOverview/GetEventExtraFieldData",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'customEventOverViewId': customeventoverviewid, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime, 'contactid': 0 }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            success: function (response) {
                EventExtraFiledsNamesettings = new Array();
                EventExtraFiledsName = response;
                $.each(response, function (i) {
                    let _EventExtraFiledsName = {
                        Index: 0,
                        FieldName: "",
                        DisplayOrder: 0
                    }

                    _EventExtraFiledsName.Index = i + 1;
                    _EventExtraFiledsName.FieldName = this.FieldName;
                    _EventExtraFiledsName.DisplayOrder = this.DisplayOrder;
                    EventExtraFiledsNamesettings.push(_EventExtraFiledsName);

                });

                $("#producttitle").html(EventExtraFiledsName[0].FieldName);
            },

            error: ShowAjaxError
        });

    },
    Refreshfields: function () {
        groupEventData = {
            StartDate: "", EndDate: "", EventData1: "", EventData2: "", EventData3: "", EventData4: "", EventData5: "", EventData6: "", EventData7: "", EventData8: "", EventData9: "", EventData10: "",
            EventData11: "", EventData12: "", EventData13: "", EventData14: "", EventData15: "", EventData16: "", EventData17: "", EventData18: "", EventData19: "", EventData20: "",
            EventData21: "", EventData22: "", EventData23: "", EventData24: "", EventData25: "", EventData26: "", EventData27: "", EventData28: "", EventData29: "", EventData30: "",
            EventData31: "", EventData32: "", EventData33: "", EventData34: "", EventData35: "", EventData36: "", EventData37: "", EventData38: "", EventData39: "", EventData40: "",
            EventData41: "", EventData42: "", EventData43: "", EventData44: "", EventData45: "", EventData46: "", EventData47: "", EventData48: "", EventData49: "", EventData50: "",

        };
    },
    ///Not using///
    BindAggergateEventDetails: function (index) {
        $(".popuptitlwrp h6").text("Aggergate Details");
        $("#txtsearch").val('')
        $("#ui_tblReportDataPopUp").empty();
        FetchNext = GetNumberOfRecordsPerPage();
        var fieldsContent = "";

        if (DisplayCustomExtraFields.length > 0) {
            for (var a = 0; a < DisplayCustomExtraFields.length; a++) {
                var Number_String_Values = '';
                if (EventExtraFiledsName[DisplayCustomExtraFields[a].charAt(9) - 1].FieldMappingType == 'number') {
                    Number_String_Values = CustomEventAggergateDetails.Table[index][DisplayCustomExtraFields[a]] == null ? " " : CustomEventAggergateDetails.Table[index][DisplayCustomExtraFields[a]] * (CustomEventAggergateDetails.Table[index]["TotalViews"]) + "  Sum Of(" + CustomEventAggergateDetails.Table[index][DisplayCustomExtraFields[a]] + ")"
                }
                else {
                    Number_String_Values = CustomEventAggergateDetails.Table[index][DisplayCustomExtraFields[a]] == null ? " " : CustomEventAggergateDetails.Table[index][DisplayCustomExtraFields[a]]
                }

                fieldsContent += "<tr><td>" + EventExtraFiledsName[DisplayCustomExtraFields[a].charAt(9) - 1].FieldName + "</td> <td>" + Number_String_Values + "</td></tr>";
            }
        }
        else {
            fieldsContent += "<tr><td>" + EventExtraFiledsName[GroupbyCustomExtraFields.charAt(9) - 1].FieldName + "</td> <td>" + (CustomEventAggergateDetails.Table[index]["EventData" + (GroupbyCustomExtraFields.charAt(9))] == null ? " " : CustomEventAggergateDetails.Table[index]["EventData" + (GroupbyCustomExtraFields.charAt(9))]) + "</td></tr>";

        }

        $("#viewcustdatapop").removeClass("hideDiv");
        $("#ui_tblReportDataPopUp").append(fieldsContent);

    },
    ////////
}
$(document).on('click', '#close-popup,.clsepopup', function () {
    $(this).parents("#viewcustdatapop").addClass("hideDiv");
    $("tr").removeClass("activeBgRow");
});

$(document).on('click', '#close-popup,.clsepopup', function () {
    $(this).parents("#viewcontactdatapop").addClass("hideDiv");

});
$(document).on('click', '#close-popup,.clsepopup', function () {
    $(this).parents("#viewvisitordatapop").addClass("hideDiv");

});
$(document).on('click', '#close-popup,.clsepopup', function () {
    $(this).parents("#groubydiv").addClass("hideDiv");

});
$(document).on("click", "[id^=acc_]", function () {



    var clickid = (this.id).replace('acc_', '#prod_')

    $(clickid).attr("checked", true);


});
$("#addedprodpop").click(function () {
    $("#groubydiv, #aggrecatedtable").removeClass("hideDiv");
    $("#addtocartlead, .popupsubtitle").addClass("hideDiv");
    $(".popuptitlwrp h6").text("Manage Properties");
    $("#ui_tblCustomgroupbydiv").empty();
    var fieldsContent = '';
    var fieldcolums = '';
    let Eventreportsetingfields = JSLINQ(EventExtraFiledsNamesettings).OrderBy("DisplayOrder")
    for (var a = 0; a < Eventreportsetingfields.items.length; a++) {

        var groupbychecktrue = ''
        var displaychecktrue = '';
        if (checkeddetailsgroups.length > a) {
            if (checkeddetailsgroups[a].indexOf('acc') != -1) {
                groupbychecktrue = 'checked';
            }
        }
        if (checkeddetailsdisplay.length > a) {
            if (checkeddetailsdisplay[a].indexOf('pro') != -1) {
                displaychecktrue = 'checked';
            }

        }



        fieldsContent += `<tr>
                                        <td>${Eventreportsetingfields.items[a].FieldName}</td>
                                        <td>
                                        <div class="checkcenter">
                                        <div class="custom-control custom-checkbox">
                                        <input type="checkbox" ${groupbychecktrue} class="custom-control-input"  id="acc_${(a + 1)}"  name="acc_${(a + 1)}">
                                        <label class="custom-control-label" for="acc_${(a + 1)}"></label>
                                        </div>
                                        </div>
                                        </td>
                                        <td>
                                        <div class="checkcenter">
                                        <div class="custom-control custom-checkbox">
                                        <input type="checkbox" ${displaychecktrue} class="custom-control-input" id="prod_${(a + 1)}"   name="prod_${(a + 1)}">
                                        <label class="custom-control-label" for="prod_${(a + 1)}"></label>
                                        </div>
                                        </div>
                                        </td>
                         </tr>`
    }

    $("#ui_tblCustomgroupbydiv").append(fieldsContent);
});

groupEventData = {
    StartDate: "", EndDate: "", EventData1: "", EventData2: "", EventData3: "", EventData4: "", EventData5: "", EventData6: "", EventData7: "", EventData8: "", EventData9: "", EventData10: "",
    EventData11: "", EventData12: "", EventData13: "", EventData14: "", EventData15: "", EventData16: "", EventData17: "", EventData18: "", EventData19: "", EventData20: "",
    EventData21: "", EventData22: "", EventData23: "", EventData24: "", EventData25: "", EventData26: "", EventData27: "", EventData28: "", EventData29: "", EventData30: "",
    EventData31: "", EventData32: "", EventData33: "", EventData34: "", EventData35: "", EventData36: "", EventData37: "", EventData38: "", EventData39: "", EventData40: "",
    EventData41: "", EventData42: "", EventData43: "", EventData44: "", EventData45: "", EventData46: "", EventData47: "", EventData48: "", EventData49: "", EventData50: "",

};

$("#btnSearch").click(function () {
    var _DisplayCustomExtraFields = [];
    var _DisplaymaxCustomExtraFieldsforexport = [];
    var _GroupbyCustomExtraFieldsForContacts = [];
    var _GroupbyCustomExtraFields = '';
    var _DisplaymaxCustomExtraFields = '';
    var _DisplaymaxCustomExtraFieldsforexport = '';

    var _checkeddetailsdisplay = [];
    var _checkeddetailsgroups = [];
    tabledynamicheadername = [];
    var groupcount = 0;
    var displaycount = 0;
    let Eventreportsetingfields = JSLINQ(EventExtraFiledsNamesettings).OrderBy("DisplayOrder")
    for (var a = 0; a < Eventreportsetingfields.items.length; a++) {
        if ($("#prod_" + (a + 1)).is(':checked')) {
            tabledynamicheadername.push(Eventreportsetingfields.items[a].FieldName);
            _checkeddetailsdisplay.push("#prod_" + (Eventreportsetingfields.items[a].Index));
            _DisplayCustomExtraFields.push("EventData" + (Eventreportsetingfields.items[a].Index))
            if (_DisplaymaxCustomExtraFields.indexOf("EventData" + (Eventreportsetingfields.items[a].Index)) == -1) {
                _DisplaymaxCustomExtraFields += ("max(EventData" + (Eventreportsetingfields.items[a].Index)) + ') As EventData' + (Eventreportsetingfields.items[a].Index) + ',';

            }

            displaycount += 1
        }
        else
            _checkeddetailsdisplay.push("#000_" + (Eventreportsetingfields.items[a].Index));
    }
    for (var a = 0; a < EventExtraFiledsName.length; a++) {
        if ($("#acc_" + (a + 1)).is(':checked')) {

            _checkeddetailsgroups.push("#acc_" + (Eventreportsetingfields.items[a].Index));
            _GroupbyCustomExtraFieldsForContacts.push("EventData" + (Eventreportsetingfields.items[a].Index))
            _GroupbyCustomExtraFields += ("EventData" + (Eventreportsetingfields.items[a].Index)) + ',';
            if (_DisplaymaxCustomExtraFields.indexOf("EventData" + (Eventreportsetingfields.items[a].Index)) == - 1) {

                _DisplaymaxCustomExtraFields += ("EventData" + (Eventreportsetingfields.items[a].Index)) + ' As EventData' + (Eventreportsetingfields.items[a].Index) + ','
                _DisplaymaxCustomExtraFieldsforexport += 'EventData' + (Eventreportsetingfields.items[a].Index) + ','
            }
            groupcount += 1
        }
        else
            _checkeddetailsgroups.push("#000_" + (Eventreportsetingfields.items[a].Index));
    }


    if (_GroupbyCustomExtraFields.slice(-1) == ',') {
        GroupbyCustomExtraFieldsForContacts = [];
        GroupbyCustomExtraFieldsForContacts = _GroupbyCustomExtraFieldsForContacts;
        GroupbyCustomExtraFields = '';
        _GroupbyCustomExtraFields = _GroupbyCustomExtraFields.slice(0, -1);
        GroupbyCustomExtraFields = _GroupbyCustomExtraFields;
    }

    if (_DisplaymaxCustomExtraFields != '') {
        DisplayCustomExtraFields = [];
        DisplaymaxCustomExtraFieldsforexport = [];
        DisplayCustomExtraFields = _DisplayCustomExtraFields
        DisplaymaxCustomExtraFields = '';
        DisplaymaxCustomExtraFieldsforexport = '';
        _DisplaymaxCustomExtraFields = _DisplaymaxCustomExtraFields.slice(0, -1);
        _DisplaymaxCustomExtraFieldsforexport = _DisplaymaxCustomExtraFieldsforexport.slice(0, -1);
        DisplaymaxCustomExtraFields = _DisplaymaxCustomExtraFields;
        DisplaymaxCustomExtraFieldsforexport = _DisplaymaxCustomExtraFieldsforexport;

    }



    if (groupcount > 0 && displaycount > 0) {
        checkeddetailsgroups = [];
        checkeddetailsdisplay = [];

        checkeddetailsgroups = _checkeddetailsgroups;
        checkeddetailsdisplay = _checkeddetailsdisplay;

        $(this).parents("#groubydiv").addClass("hideDiv");
        if (GroupbyCustomExtraFields != '')
            CustomAggregateEventsUtil.MaxCount();

    }
    else {
        if (groupcount == 0)
            ShowErrorMessage(GlobalErrorList.CustomEvent.EventgroupbyName);
        else
            ShowErrorMessage(GlobalErrorList.CustomEvent.EventDisplayName);
        return false;
    }

});
$(document.body).on('change', '#drp_RecordsPerPageuniqemachineid', function (event) {
    OffSet = 0;
    FetchNext = uniquevisitorsGetNumberOfRecordsPerPage();
    ShowPageLoading();
    TotalRowCount = 0;
    customCurrentRowCount = 0;
    CustomAggregateEventsUtil.uniquevisitorsdetails();
});
uniquevisitorsGetNumberOfRecordsPerPage = function () {
    if ($("#drp_RecordsPerPageuniqemachineid").length > 0) {
        if ($("#drp_RecordsPerPageuniqemachineid").val().toString().toLowerCase() == "all")
            return 5000;
        else
            return parseInt($("#drp_RecordsPerPageuniqemachineid").val());
    }
    return 20;
};
function uniquevisitorsPagingPrevNext(DataOffSet, DataCount, TotalData) {
    if ((DataOffSet != undefined && DataOffSet != null && DataOffSet > -1) && (DataCount != undefined && DataCount != null && DataCount > -1) && (TotalData != undefined && TotalData != null && TotalData > -1)) {

        ShowPagingDiv(true);
        $("#ui_divPreviousPageuniqemachineid").removeClass('disableDiv');
        $("#ui_divNextPageuniqemachineid").removeClass('disableDiv');

        if (DataOffSet == 0) {
            $("#ui_lblPagingDescuniqemachineid").html((DataOffSet + 1) + ' - ' + DataCount + ' of ' + TotalData);
            $("#ui_divPreviousPageuniqemachineid").addClass('disableDiv');
        }
        else {
            $("#ui_lblPagingDescuniqemachineid").html((DataOffSet + 1) + ' - ' + (DataOffSet + DataCount) + ' of ' + TotalData);
        }

        if ((DataOffSet + DataCount) >= TotalData) {
            $("#ui_divNextPageuniqemachineid").addClass('disableDiv');
        }
    }
}
$(document.body).on('click', '#ui_divNextPageuniqemachineid', function (event) {
    OffSet = OffSet + uniquevisitorsPagingPrevNext();
    uniquevisitorsCallBackPaging();
});
$(document.body).on('click', '#ui_divPreviousPageuniqemachineid', function (event) {
    OffSet = OffSet - uniquevisitorsPagingPrevNext();
    OffSet <= 0 ? 0 : OffSet;
    uniquevisitorsCallBackPaging();
});
function uniquevisitorsCallBackPaging() {

    ShowPageLoading();
    uniquevisitorsCurrentRowCount = 0;
    CustomAggregateEventsUtil.uniquevisitorsdetails();

}

var totaluniquerowcounts = 0;
var customCurrentRowCount = 0;
$(document.body).on('change', '#drp_CustomRecordsPerPage', function (event) {
    OffSet = 0;
    FetchNext = CustomGetNumberOfRecordsPerPage();
    ShowPageLoading();
    TotalRowCount = 0;
    customCurrentRowCount = 0;

    CustomAggregateEventsUtil.uniquecontactdetails();
});
CustomGetNumberOfRecordsPerPage = function () {
    if ($("#drp_CustomRecordsPerPage").length > 0) {
        if ($("#drp_CustomRecordsPerPage").val().toString().toLowerCase() == "all")
            return 5000;
        else
            return parseInt($("#drp_CustomRecordsPerPage").val());
    }
    return 20;
};
function customPagingPrevNext(DataOffSet, DataCount, TotalData) {
    if ((DataOffSet != undefined && DataOffSet != null && DataOffSet > -1) && (DataCount != undefined && DataCount != null && DataCount > -1) && (TotalData != undefined && TotalData != null && TotalData > -1)) {

        $("#ui_divPreviousPagecustom").removeClass('disableDiv');
        $("#ui_divNextPagecustom").removeClass('disableDiv');

        if (DataOffSet == 0) {
            $("#ui_lblPagingDesccustom").html((DataOffSet + 1) + ' - ' + DataCount + ' of ' + TotalData);
            $("#ui_divPreviousPagecustom").addClass('disableDiv');
        }
        else {
            $("#ui_lblPagingDesccustom").html((DataOffSet + 1) + ' - ' + (DataOffSet + DataCount) + ' of ' + TotalData);
        }

        if ((DataOffSet + DataCount) >= TotalData) {
            $("#ui_divNextPagecustom").addClass('disableDiv');
        }
    }
}
$(document.body).on('click', '#ui_divNextPagecustom', function (event) {
    OffSet = OffSet + CustomGetNumberOfRecordsPerPage();
    customCallBackPaging();
});
$(document.body).on('click', '#ui_divPreviousPagecustom', function (event) {
    OffSet = OffSet - CustomGetNumberOfRecordsPerPage();
    OffSet <= 0 ? 0 : OffSet;
    customCallBackPaging();
});

function customCallBackPaging() {

    ShowPageLoading();
    customCurrentRowCount = 0;
    CustomAggregateEventsUtil.uniquecontactdetails();

}

