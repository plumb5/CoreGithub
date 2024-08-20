var dropdownfilterSearchValue = '', SearchTextValue = '', GroupId = 0;
$(document).ready(function () {
    ExportFunctionName = "VisitorsExport";
    GetUTCDateTimeRange(2);
    BindGroupName();

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
function BindGroupName() {
    $.ajax({
        type: "POST",
        url: "/Analytics/Audience/GetGroupNames",
        data: JSON.stringify({ 'accountId': Plumb5AccountId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response != null) {
                $.each(response.Table1, function () {
                    window.drp_AddToGroup.innerHTML += "<option value='" + this.GroupId + "'>" + this.GroupName + "</option>";
                });
            }
        },
        error: ShowAjaxError
    });
}

function MaxCount() {
    SearchTextValue = $('#searchFilterBox').val();
    if (dropdownfilterSearchValue == 'All') {
        dropdownfilterSearchValue = '';
        SearchTextValue = '';
    }

    $.ajax({
        url: "/Analytics/Audience/GetVisitorsReportCount",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'duration': duration, 'fromdate': FromDateTime, 'todate': ToDateTime, 'drpSearchBy': dropdownfilterSearchValue, 'txtSearchBy': SearchTextValue }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            TotalRowCount = 0;
            if (response != undefined && response != null && response.Table1 != undefined && response.Table1 != null && response.Table1.length > 0) {
                $.each(response.Table1, function () {
                    TotalRowCount = this.TotalRows;
                });
            }

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
    ShowPageLoading();
    FetchNext = GetNumberOfRecordsPerPage();
    $.ajax({
        url: "/Analytics/Audience/BindVisitors",
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
    if (response != undefined && response != null && response.VisitorsData.Table1 != undefined && response.VisitorsData  != null && response.VisitorsData.Table1.length > 0) {

        CurrentRowCount = response.VisitorsData.Table1.length;
        PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);

        var reportTableTrs, contactId;
        $.each(response.VisitorsData.Table1, function () {
            let PageName = "NA";
            let City = "NA";

            if (this.PageName != undefined && this.PageName != null && this.PageName != "")
                PageName = this.PageName;

            if (this.City != undefined && this.City != null && this.City != "")
                City = this.City;

            let MachId = this.MachineId != null ? this.MachineId.substring(this.MachineId.length - 4) : "";

            //**** For Output Cache ToDateTime *******
            if (duration == 1)
                ToDateTime = response.CurrentUTCDateTimeForOutputCache;

            //**** For Output Cache ToDateTime *******

            reportTableTrs += "<tr>" +
                "<td class='text-left h-100'><div class='nameWrap'><div class='nameAlpWrap'><span class='nameAlpha' onclick='ShowContactUCP(\"" + this.MachineId + "\",null,null)'>V</span></div><div class='nameTxtWrap'><span class='nameTxt'>" + this.VisitorIp + "</span><span class='mnumb nameTxt'>(M-" + MachId + ")</span></div></div></td>" +
                "<td>" + this.Session + "</td>" +
                "<td>" + fn_AverageTime(this.AvgTime) + "</td>" +
                "<td>" + $.datepicker.formatDate("M dd yy", ConvertUTCDateTimeToLocal(this.Recency)) + " " + PlumbTimeFormat(ConvertUTCDateTimeToLocal(this.Recency)) + "</td>" +
                "<td>" + PageName + "</td>" +
                "<td>" + City + "</td>" +
                "</tr>";
        });
        $("#ui_tblReportData").removeClass('no-data-records');
        $("#ui_tbodyReportData").html(reportTableTrs);
        ShowExportDiv(true);
        RowCheckboxClick();
    } else {
        ShowExportDiv(false);
        ShowPagingDiv(false);
    }
    HidePageLoading();
    CheckAccessPermission("Analytics");
}



$(".selchbxall").click(function () {
    if ($(this).is(":checked")) {
        $(".selChk").prop('checked', true);
    } else {
        $(".selChk").prop('checked', false);
    }

});
var checkBoxClickCount, addGroupNameList;
function RowCheckboxClick() {
    $('.selChk').click(function () {
        checkBoxClickCount = $('.selChk').filter(':checked').length;
        if (checkBoxClickCount > 0) {
            $(".subdivWrap").addClass('showDiv');
        } else {
            $(".subdivWrap").removeClass('showDiv');
        }
        $(".checkedCount").html(checkBoxClickCount);
        $(".addgroupname").html('Add to Group');
    });
}

$(".addgroupselect").change(function () {
    addGroupNameList = $(".addgroupselect option:selected").text();
    if (addGroupNameList == "Add to Group") {
        preventDefault();
    } else {
        $(".visitorsCount").html(checkBoxClickCount);
        $(".addgroupname").html(addGroupNameList);
        $("#confirmDialog").modal('show');
    }
});


///Add to Group
function Addtogroup() {
    var chkArrayMachine = new Array();
    var chkArrayContactId = new Array();

    $("input:checkbox:checked").each(function () {
        chkArrayContactId.push($(this).val().split('%')[0]);
        chkArrayMachine.push($(this).val().split('%')[1]);
    });
    $(".selchbxall,.selChk").prop("checked", false);
    if (chkArrayMachine != undefined && chkArrayMachine.length > 0) {
        $.ajax({
            type: "POST",
            url: "/Analytics/Audience/AddToGroup",
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'contact': chkArrayContactId, 'machine': chkArrayMachine, 'groupId': GroupId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) { //OnSuccessMachine,
                if (response > 0) {
                    ShowSuccessMessage(GlobalErrorList.Web_Visitor.success_message);

                }
                else if (response == 0) {
                    ShowErrorMessage(GlobalErrorList.Web_Visitor.duplicate_error);
                }
                else {
                    ShowErrorMessage(GlobalErrorList.Web_Visitor.error_message);
                }

            },
            error: ShowAjaxError
        });
    } else {
        ShowErrorMessage(GlobalErrorList.Web_Visitor.selectvisitor_message);
    }
}

$(".selchbxall").click(function () {
    checkBoxClickCount = $('.selChk').filter(':checked').length;
    if (checkBoxClickCount > 0) {
        $(".subdivWrap").addClass('showDiv');
    } else {
        $(".subdivWrap").removeClass('showDiv');
    }
    $(".checkedCount").html(checkBoxClickCount);
});
//*****************************************************
function SearchData() {
    OffSet = 0;
    FetchNext = 0;
    MaxCount();
}
function BindFilterValues() {

    $.ajax({
        url: "/Analytics/Audience/BindFilterValues",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'duration': duration, 'fromdate': FromDateTime, 'todate': ToDateTime, 'drpSearchBy': dropdownfilterSearchValue, 'txtSearchBy': SearchTextValue }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            /* window.searchFilterBox.innerHTML = '';
               window.searchFilterBox.innerHTML += "<option label='Select'>Select</option>";
               $.each(response.Table, function () {
                   window.searchFilterBox.innerHTML += "<option label='" + this.FilterValue + "'>" + this.FilterValue + "</option>";
               }); 
           */
            $.each(response, function () {
                if ($('#searchFilterBox').find("option[value='" + this.FilterValue + "']").length) {
                    $('#searchFilterBox').val(this.FilterValue).trigger('change');
                } else {
                    // Create a DOM Option and pre-select by default
                    var newOption = new Option(this.FilterValue, this.FilterValue, false, false);
                    // Append it to the select
                    $('#searchFilterBox').append(newOption).trigger('change');
                }
            });


        },
        error: ShowAjaxError
    });
}
$(".dropdown-menu .visitfiltWrap a").click(function () {
    window.searchFilterBox.innerHTML = '';
    window.searchFilterBox.innerHTML += "<option label='Select'>Select</option>";
    var filterListVal = $(this).text();
    dropdownfilterSearchValue = $(this).attr('value');
    if (filterListVal == "All") {
        $(".btn-dropdown").focus();
        $("#filterTags span").html(filterListVal);
        $(".subdivFiltWrap").removeClass("showDiv");
        MaxCount();
    } else {
        $(".btn-dropdown").focus();
        $("#filterTags span").html(filterListVal);
        $(".subdivFiltWrap").addClass("showDiv");
        $("#searchFilterBox").attr("placeholder", "Search " + filterListVal);
        //BindFilterValues();
    }

});
$('.addgroupselect').select2({
    minimumResultsForSearch: '',
    dropdownAutoWidth: false,

});

//$('.select2-search__field').on('input', function (e) {
//    alert('Changed!')
//});
$(document).on('input', '.select2-search__field', function () {

    SearchTextValue = $('.select2-search__field').val();
    BindFilterValues();
});






$("#addtoGroupdis").click(function () {
    //$(".selchbxall,.selChk").prop("checked", false);
    $(".subdivWrap").removeClass("showDiv");
    Addtogroup();
});