
var CustomEventsReport = [];
var customeventoverviewid;
var EventExtraFiledsName = [];
var checkBoxClickCount, addGroupNameList;
var eventvalues = [];
var EventDataExtraList = [];
var customreports = "";
var MachineId = '';
var filter = '';
var filterEventData;
var EventExtraFiledsNameheader = new Array();
$(document).ready(function () {
    ExportFunctionName = "ExportCustomViewReport";
    HidePageLoading();
    customeventoverviewid = $.urlParam("EventId");
    $(".pagetitle").text("Event Name:" + $.urlParam("EventName").replace(/%20/g, " ")); 
    CustomEventsCartReportUtil.EventMappingDetails();
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
    BindGroupName();

});
var contactDetails = {
    ContactId: 0, EmailId: "", PhoneNumber: "", Name: ""
};
function CallBackFunction() {
    if ($("#filterTags span").html() == "Filter By Master Filter")
        $("#filterTags span").html("Filter By");
    CustomEventsCartReportUtil.ResetMasterFilter();
    clearmasterfilter();
    ShowPageLoading();
    TotalRowCount = 0;
    CurrentRowCount = 0;
    CustomEventsCartReportUtil.MaxCount();
    //$(".subdivFiltWrap").removeClass("showDiv");
}
function CallBackPaging() {

    ShowPageLoading();
    CurrentRowCount = 0;
    CustomEventsCartReportUtil.GetReport();

}
function BindFilterContents() {
    var bindselection = "";
    if (CleanText($.trim($("#txtsearch").val())).length > 0) {
        if (filter != null && filter != undefined && filter != "" && filter.length > 0) {
            bindselection += '<div id="1" class="vrAutocomplete" style="vertical-align: middle;"><span id="1" class="vnAutocomplete"><div class="vmAutocomplete" onclick="RemoveData(1);"></div><div class="vtAutocomplete">Search By ' + filter + ' = ' + CleanText($.trim($("#txtsearch").val())) + "</div></span></div>";
            $("#bindsel").html(bindselection);
        }
    }
    else {
        $("#bindsel").html("");
    }
}
function RemoveData(obj) {
    $("#txtsearch").val("");
    contactDetails.EmailId = contactDetails.PhoneNumber = contactDetails.Name = null;
    $("#" + obj).remove();
    $("#bindsel").html("");
    clearAll();
    CallBackFunction();
}
$(document).ready(function () {
    $("#txtsearch").keydown(function (event) {
        if (event.keyCode == 13) {
            if ($("#txtsearch").val().length == 0) {
                ShowErrorMessage(GlobalErrorList.Contact.SearchErrorValue);
                return false;
            }
            document.getElementById("btnsearch").click();
            event.preventDefault();
            return false;
        }
    });
});
document.getElementById("txtsearch").addEventListener("keyup", function (event) {
    const key = event.key;
    if (key === "Backspace") {

        if (CleanText($.trim($('#txtsearch').val())).length == 0) {
            ShowPageLoading();
            $('[id^="trsearch"]:not(:first)').remove();
            $('#txtStartDate,#txtEndDate,#txtFieldAnswer_0,#ui_txtName').val('');
            $('#ChkSave').prop('checked', false);
            $('#drpFields_0').select2().val(0).trigger('change');
            $("#ui_txtdescription").val('');
            $(".btn-dropdown").focus();
            $("#filterTags span").html("Filter By ALL");
            $("#txtsearch").val('')
            $(".subdivFiltWrap").removeClass("showDiv");
            MachineId = '';
            contactDetails.EmailId = contactDetails.PhoneNumber = contactDetails.Name = null;
            CustomEventsCartReportUtil.ResetMasterFilter();
            CustomEventsCartReportUtil.MaxCount();
            $(".subdivWrap").removeClass("showDiv");
            $(".selchbxall,.selChk").prop("checked", false);
        }
    }

    event.preventDefault(); return false;


});
$("#txtsearch").keypress(function (e) {
    if ((e.which && e.which === 13) || (e.keyCode && e.keyCode === 13)) {
        $(".filtwrpbar").addClass('hideDiv');
        CustomEventsCartReportUtil.ResetMasterFilter();

        if (CleanText($.trim($("#txtsearch").val())).length == 0) {
            ShowErrorMessage(GlobalErrorList.Contact.SearchErrorValue);
            return false;
        }

        $(".subdivWrap").addClass('showDiv');
        $(".checkedCount,.visitorsCount").html(0);
        $(".selchbxall,.selChk").prop("checked", false);

        if (filter.indexOf("Email") > -1) {
            contactDetails.EmailId = CleanText($.trim($("#txtsearch").val()));
            contactDetails.PhoneNumber = null;
            contactDetails.Name = null;
            MachineId = '';
            OffSet = 0;
            CallBackFunction();
        }
        else if (filter.indexOf("Phone") > -1) {
            contactDetails.PhoneNumber = CleanText($.trim($("#txtsearch").val()));
            contactDetails.EmailId = null;
            contactDetails.Name = null;
            MachineId = '';
            OffSet = 0;
            CallBackFunction();
        }
        else if (filter.indexOf("Name") > -1) {
            contactDetails.PhoneNumber = null;
            contactDetails.EmailId = null;
            MachineId = '';
            contactDetails.Name = CleanText($.trim($("#txtsearch").val()));
            OffSet = 0;
            CallBackFunction();
        }
        else if (filter.indexOf("Machine") > -1) {
            contactDetails.PhoneNumber = null;
            contactDetails.EmailId = null;
            contactDetails.Name = null;
            MachineId = CleanText($.trim($("#txtsearch").val()));
            OffSet = 0;
            CallBackFunction();
        }
    }
});
var CustomEventsCartReportUtil = {
    MaxCount: function () {

        $('#dvmasterfieltercustomeventsReports').addClass("hideDiv");
        $.ajax({
            url: "/CustomEvents/ViewCustomEventData/GetEventscount",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime, 'customeventoverviewid': customeventoverviewid, 'contact': contactDetails, 'machineid': MachineId, 'customevents': filterEventData }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                TotalRowCount = 0;
                if (response != undefined && response != null && response.returnVal > 0) {
                    TotalRowCount = response.returnVal;

                }

                if (TotalRowCount > 0) {
                    $("#totalcountspan").text(TotalRowCount);
                    CustomEventsCartReportUtil.GetReport();
                    //$(".dropdown").removeClass("hideDiv");
                }
                else {
                    $("#totalcountspan").text(0);
                    SetNoRecordContent('ui_tableReport', 9, 'ui_trbodyReportData');
                    //$(".dropdown").addClass("hideDiv");
                    HidePageLoading();
                }
            },
            error: ShowAjaxError
        });
    },
    EventMappingDetails: function () {
        EventExtraFiledsName = [];

        $.ajax({
            url: "/CustomEvents/ViewCustomEventData/GetEventExtraFieldData",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'customEventOverViewId': customeventoverviewid, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime, 'contactid': 0 }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            success: function (response) {
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
                    EventExtraFiledsNameheader.push(_EventExtraFiledsName);

                });
                ShowMasterFilterPopUp();
            },

            error: ShowAjaxError
        });
    },
    GetReport: function () {
        BindFilterContents();
        FetchNext = GetNumberOfRecordsPerPage();
        $.ajax({
            url: "/CustomEvents/ViewCustomEventData/GetEventsReportData",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'OffSet': OffSet, 'FetchNext': FetchNext, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime, 'customeventoverviewid': customeventoverviewid, 'ContactId': 0, 'contact': contactDetails, 'machineid': MachineId, 'customevents': filterEventData }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: CustomEventsCartReportUtil.BindReport,
            error: ShowAjaxError
        });
    },

    BindReport: function (response) {
        var eventreportheader = JSLINQ(EventExtraFiledsName).OrderBy("DisplayOrder")
        SetNoRecordContent('ui_tableReport', 12, 'ui_trbodyReportData');
        PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);
        if (response != undefined && response != null && response.length > 0) {

            CustomEventsReport = response;
            CurrentRowCount = response.length;
            PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);
            $("#ui_trbodyReportData").html('');
            $("#ui_tableReport").removeClass('no-data-records');
            $("#ui_trheadReportData").empty();
            let reportTableheaderstatic = `
                                            <th class="td-wid-5 h-20p m-p-w-40" scope="col">
                                            <div class="custom-control custom-checkbox">
                                            <input type="checkbox" class="custom-control-input selchbxall" id="cont_1" name="example1">
                                            <label class="custom-control-label" for="cont_1"></label>
                                            </div>
                                            </th>
                                            <th class="td-wid-5 m-p-w-40" scope="col">UCP</th>
                                            <th class="helpIcon td-wid-20 m-p-w-20" scope="col">
                                            <div class="sortWrap">
                                            <i class="icon ion-arrow-down-c addColor"></i>
                                            </div>
                                            <div class="spacBet">
                                            <div>Event Date</div>
                                            <div class="th-iconWrp">
                                            <i class="icon ion-ios-help-outline"></i>
                                            <div class="toottipWrap">Date when the data was captured.
                                            </div>
                                            </div>
                                            </div>
                                            </th> `

            let reportTableheader = "";
            for (let i = 0; i < eventreportheader.items.length; i++) {
                reportTableheader += "<th class='helpIcon td-wid-15 m-p-w-40' scope='col'><div class='sortWrap'><i class='icon ion-arrow-down-c addColor'></i></div><div class='spacBet'><div>" + eventreportheader.items[i].FieldName + "</div><div class='th-iconWrp'></div></div></th >";
                if (i == 3)
                    break;
            }
            var finaltable = reportTableheaderstatic + reportTableheader;

            $("#ui_trheadReportData").append("<tr>" + finaltable + "</tr>");
            $("#ui_trbodyReportData").empty();

            $.each(response, function (i) {
               
                CustomEventsCartReportUtil.BindEachReport(this, i);
            });

        }

        /* HidePageLoading();*/
        CheckAccessPermission("CustomEvents");
    },

    BindEachReport: function (CustomEventsReport, index) {
        var Eventreportheadervalue = JSLINQ(EventExtraFiledsNameheader).OrderBy("DisplayOrder")
        if (EventExtraFiledsNameheader.length > 0) {
            var lengthofheader = 4;
            if (EventExtraFiledsNameheader.length < 4)
                lengthofheader = EventExtraFiledsNameheader.length;

            let tablerow = '';
            for (let i = 0; i < lengthofheader; i++) {
                tablerow += `<td>${CustomEventsReport["EventData" + (Eventreportheadervalue.items[i].Index)] == null ? "NA" : CustomEventsReport["EventData" + (Eventreportheadervalue.items[i].Index)]}</td>;`
            }
            ShowExportDiv(true);
            ShowPagingDiv(true);
            var UCP = String.raw`cstShowContactUCP("${CustomEventsReport.MachineId}","",${CustomEventsReport.ContactId});`;
            let reportTable = `<tr id="tr_${CustomEventsReport.Id}">
                                <td>
                                <div class="custom-control custom-checkbox">
                                <input type="checkbox" class="custom-control-input selChk"
                                value="${CustomEventsReport.ContactId}" id="cont_${(index + 2)}" name="example1">
                                <label class="custom-control-label" for="cont_${(index + 2)}"></label>
                                </div>
                                </td>
                                <td class="frmresucp"><i class="fa fa-address-card-o" onclick=' ${UCP}'></i></td>
                                <td>
                                <div class="machidcopywrp">
                                <p class="pushmachidtxt">
                                ${$.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(CustomEventsReport.EventTime)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(CustomEventsReport.EventTime))}
                                </p>
                                <i class="icon ion-ios-information  viewcustdata"  onclick='CustomEventsCartReportUtil.BindIndividualEventDetails(${CustomEventsReport.ContactId},${CustomEventsReport.Id});'></i>
                                </div>
                                </td>
                                ${tablerow}
                                </tr>`;
            $("#ui_trbodyReportData").append(reportTable);
        }
        HidePageLoading();
    },
    BindIndividualEventDetails: function (ContactId, cstId) {
        ShowPageLoading();
        $("#tr_" + cstId).closest("tr").addClass("activeBgRow");
        $("#txtsearch").val('')
        $("#ui_tblReportDataPopUp").empty();
        $(".popuptitlwrp h6").text("Event Details");
        FetchNext = GetNumberOfRecordsPerPage();
        $.ajax({
            url: "../CustomEvents/ViewCustomEventData/GetEventsDetails",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'OffSet': OffSet, 'FetchNext': FetchNext, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime, 'customeventoverviewid': parseInt(customeventoverviewid), 'ContactId': ContactId, 'id': cstId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {

                var fieldsContent = "";
                $(".popupsubtitle").html(response[0].EventName);
                $.each(response, function () {
                    for (var a = 0; a < EventExtraFiledsName.length; a++) {
                        fieldsContent += "<tr><td>" + EventExtraFiledsName[a].FieldName + "</td> <td>" + ($(this)[0]["EventData" + (a + 1)] == null ? "NA" : $(this)[0]["EventData" + (a + 1)]) + "</td></tr>";
                    }
                });

                $("#ui_tblReportDataPopUp").append(fieldsContent);
                $("#viewcustdatapop").removeClass("hideDiv");
                HidePageLoading();

            },
            error: ShowAjaxError
        });

    },
    ResetMasterFilter: function () {
        filterEventData = {
            StartDate: "", EndDate: "", EventData1: "", EventData2: "", EventData3: "", EventData4: "", EventData5: "", EventData6: "", EventData7: "", EventData8: "", EventData9: "", EventData10: "",
            EventData11: "", EventData12: "", EventData13: "", EventData14: "", EventData15: "", EventData16: "", EventData17: "", EventData18: "", EventData19: "", EventData20: "",
            EventData21: "", EventData22: "", EventData23: "", EventData24: "", EventData25: "", EventData26: "", EventData27: "", EventData28: "", EventData29: "", EventData30: "",
            EventData31: "", EventData32: "", EventData33: "", EventData34: "", EventData35: "", EventData36: "", EventData37: "", EventData38: "", EventData39: "", EventData40: "",
            EventData41: "", EventData42: "", EventData43: "", EventData44: "", EventData45: "", EventData46: "", EventData47: "", EventData48: "", EventData49: "", EventData50: "",

        };
    },
    InitialiseCustomReportDropDown: function (Count) {
        $('#drpFields_' + Count).select2({
            minimumResultsForSearch: '',
            dropdownAutoWidth: false,
            containerCssClass: "border"
        });
    },
    InitialiseCustomReportDropDown: function (Count) {
        $('#drpFields_' + Count).select2({
            minimumResultsForSearch: '',
            dropdownAutoWidth: false,
            containerCssClass: "border"
        });
    }, 
}
function ShowContactUCP(MachineId, DeviceId, ContactId) {
    UCPUtil.ShowAllUCPDetails(MachineId, DeviceId, ContactId);
}

$(".dropdown-menu .visitfiltWrap a").click(function () {
    0
    filter = $(this).text();
    if (filter == "All") {
        $('[id^="trsearch"]:not(:first)').remove();
        $('#txtStartDate,#txtEndDate,#txtFieldAnswer_0,#ui_txtName').val('');
        $('#ChkSave').prop('checked', false);
        $('#drpFields_0').select2().val(0).trigger('change');
        $("#ui_txtdescription").val('');
        $(".btn-dropdown").focus();
        $("#filterTags span").html("Filter By " + filter);
        $("#txtsearch").val('')
        $(".subdivFiltWrap").removeClass("showDiv");
        MachineId = '';
        contactDetails.EmailId = contactDetails.PhoneNumber = contactDetails.Name = null;
        CustomEventsCartReportUtil.ResetMasterFilter();
        CustomEventsCartReportUtil.MaxCount();
        $(".subdivWrap").removeClass("showDiv");
        $(".selchbxall,.selChk").prop("checked", false);
    }
    else if (filter == "Master Filter") {
        $('#dvmasterfieltercustomeventsReports').removeClass("hideDiv");

        $("#e_input").val("");
        contactDetails.EmailId = contactDetails.PhoneNumber = contactDetails.Name = null;
        MachineId = '';
        $("#bindsel").html("");
        /*$("#filterTags span").html("Filter By " + filter);*/
        $("#txtsearch").val('')
        $(".popuptitle h6").html("MASTER FILTER");
        //$('[id^="trsearch"]:not(:first)').remove(); 
        /*$('#dvmasterfieltercustomeventsReports').removeClass("hideDiv");*/
        $('#checkbox').html("Create New Group")
        $('#ui_name').html("Group Name")
        $('#ChkSave').attr('chkid', '1');
        $('#divui_description').removeClass("hideDiv");
        $(".selchbxall,.selChk").prop("checked", false);

        HidePageLoading();
    }
    else {
        clearmasterfilter();
        contactDetails.EmailId = contactDetails.PhoneNumber = contactDetails.Name = null;
        MachineId = '';
        $(".selchbxall,.selChk").prop("checked", false);
        $(".subdivWrap").removeClass("showDiv");
        $(".btn-dropdown").focus();
        $("#filterTags span").html("Filter By " + filter);
        $(".subdivFiltWrap").addClass("showDiv");
        $("#txtsearch").val('')
        $("#txtsearch").attr("placeholder", "Search " + filter);

    }
});
$("#ui_exportOrDownload").click(function () {
    if ($("#txtStartDate").val() != "" && $("#txtEndDate").val() != "")
        ExportFunctionName = "ExportCustomViewFilterReport";
    else
        ExportFunctionName = "ExportCustomViewReport";

    //ExportFunctionName = "ExportCustomViewReport";
    $("#ui_ddl_ExportDataRange").attr("disabled", false);
});
$(document).on('click', '#close-popup,.clsepopup', function () {
    $(this).parents("#viewcustdatapop").addClass("hideDiv");
    $("tr").removeClass("activeBgRow");

});
$("#btnsearch").click(function () {
    ShowPageLoading();
    if (CleanText($.trim($("#txtsearch").val())).length > 0) {
        $(".checkedCount").html(0);
        $(".visitorsCount").html(0);
        $(".selchbxall,.selChk").prop("checked", false);

        if (filter.indexOf("Email") > -1) {
            contactDetails.EmailId = CleanText($.trim($("#txtsearch").val()));
            $("#filterTags span").html("Filter By " + filter + "");
            contactDetails.PhoneNumber = null;
            contactDetails.Name = null;
            OffSet = 0;
            TotalRowCount = 0;
            CurrentRowCount = 0;
            CustomEventsCartReportUtil.MaxCount();
        }
        else if (filter.indexOf("Phone") > -1) {
            contactDetails.PhoneNumber = CleanText($.trim($("#txtsearch").val()));
            $("#filterTags span").html("Filter By " + filter + "");
            contactDetails.EmailId = null;
            contactDetails.Name = null;
            OffSet = 0;
            TotalRowCount = 0;
            CurrentRowCount = 0;
            CustomEventsCartReportUtil.MaxCount();
        }
        else if (filter.indexOf("Name") > -1) {
            contactDetails.PhoneNumber = null;
            contactDetails.EmailId = null;
            contactDetails.Name = CleanText($.trim($("#txtsearch").val()));
            $("#filterTags span").html("Filter By " + filter + "");
            OffSet = 0;
            MachineId = '';
            TotalRowCount = 0;
            CurrentRowCount = 0;
            CustomEventsCartReportUtil.MaxCount();
        }
        else if (filter.indexOf("Machine") > -1) {
            contactDetails.PhoneNumber = null;
            contactDetails.EmailId = null;
            contactDetails.Name = null;
            MachineId = CleanText($.trim($("#txtsearch").val()));
            $("#filterTags span").html("Filter By " + filter + "");
            OffSet = 0;
            TotalRowCount = 0;
            CurrentRowCount = 0;
            CustomEventsCartReportUtil.MaxCount();
        }
    }
    else {
        ShowErrorMessage(GlobalErrorList.Contact.SearchErrorValue);
        HidePageLoading();
        return false;
    }
});
function ShowMasterFilterPopUp() {

    $("#drpFields_0").empty();
    let DropDownValue = '';
    DropDownValue = `<option value="0">Select</option>`;
    if (EventExtraFiledsName != undefined && EventExtraFiledsName != null && EventExtraFiledsName.length > 0) {
        for (var a = 0; a < EventExtraFiledsName.length; a++) {
            DropDownValue += `<option value="${"EventData" + (a + 1)}">${EventExtraFiledsName[a].FieldName}</option>`;
        }
        $("#drpFields_0").append(DropDownValue);
    };
    HidePageLoading();
};


$(document).on("click", ".selchbxall", function () {
    if ($(this).is(":checked")) {
        $(".selChk").prop("checked", true);
        $("tr").addClass("activeBgRow");
    }
    else {
        $(".selChk").prop("checked", false);
        $("tr").removeClass("activeBgRow");
    }
});

$(document).on("click", ".selchbxall", function () {
    checkBoxClickCount = $(".selChk").filter(":checked").length;
    if (checkBoxClickCount > 0) {
        $(".subdivWrap").addClass("showDiv");
    }
    else {
        $(".subdivWrap").removeClass("showDiv");
    }
    $(".checkedCount").html(checkBoxClickCount);
});

$(document).on("click", ".selChk", function () {
    if ($(this).is(":checked")) {
        $(this).closest("tr").addClass("activeBgRow");
    }
    else {
        $(this).closest("tr").removeClass("activeBgRow");
    }
});
$("#addtoGroupdis, #unsubconts, #invalidateCont").click(function () {
    ShowPageLoading();
    
    chkArrayContactId = new Array();
    $(".selChk:checked").each(function () {
        chkArrayContactId.push( $(this).val());
    });
    $(".selchbxall,.selChk").prop("checked", false);
    $(".subdivWrap").removeClass("showDiv");
    addGroupNameLists = new Array();
    addGroupNameLists.push(addGroupNameList);
    if (chkArrayContactId.length > 0) {
        $.ajax({
            type: "POST",
            url: "/ManageContact/Contact/AddToGroup",
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'contact': chkArrayContactId, 'Groups': addGroupNameLists }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response > 0) {
                    ShowSuccessMessage(GlobalErrorList.Contact.addedtogroup);
                    $('[id^="tr_"]').removeClass("activeBgRow");
                }
                else {
                    ShowErrorMessage(GlobalErrorList.Contact.error);
                }
                $("#addremovegroup").modal('hide');
            },
            error: ShowAjaxError
        });
        HidePageLoading();

    }
    else {
        ShowErrorMessage(GlobalErrorList.Contact.selectvisitors);
        clearAll();
        HidePageLoading();
    }

});
var checkBoxClickCount, addGroupNameList;

$(document).on("click", ".selChk", function () {
    checkBoxClickCount = $(".selChk").filter(":checked").length;
    if (checkBoxClickCount > 0) {
        $(".subdivWrap").addClass("showDiv");
    }
    else {
        $(".subdivWrap").removeClass("showDiv");
    }
    $(".checkedCount").html(checkBoxClickCount);
});

$(".addgroupselect").change(function () {
    addGroupNameList = $(".addgroupselect option:selected").val();
    var addGroupName = addgroupdropdown.options[addgroupdropdown.selectedIndex].getAttribute('attr_val');

    if (addGroupNameList == "Add to Group") {
        preventDefault();
    }
    else {
        $(".visitorsCount").html(checkBoxClickCount);
        $(".addgroupname").html(addGroupName);
        $("#confirmDialog").modal("show");
    }
});


function BindGroupName() {
    $("#addgroupoperation").html('');

    $.ajax({
        type: "POST",
        url: "/ManageContact/Group/GetGroupsByStaticOrDynamic",
        data: JSON.stringify({ 'accountId': Plumb5AccountId, GroupType: -1 }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response != null && response.GroupDetails != null) {
                $.each(response.GroupDetails, function (i) {
                    $(".addgroupselect").append($('<option attr_val="' + $(this)[0].Name + '"+ value="' + $(this)[0].Id + '" >' + $(this)[0].Name + '</option>'));
                });
            }
            HidePageLoading();
        },
        error: ShowAjaxError
    });
}

$("#addgroupdropdown").select2({
    minimumResultsForSearch: "",
    dropdownAutoWidth: false,
    containerCssClass: "border",
});