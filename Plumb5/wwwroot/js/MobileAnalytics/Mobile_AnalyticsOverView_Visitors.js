var dropdownfilterSearchValue = '', SearchTextValue = '', GroupId = 0;

$(document).ready(function () {
    ExportFunctionName = "MobileVisitorsExport";
    GetUTCDateTimeRange(2);
   // BindGroupName();
});

//function BindGroupName() {
//    $.ajax({
//        type: "POST",
//        url: "/Analytics/Audience/GetGroupNames",
//        data: JSON.stringify({ 'accountId': Plumb5AccountId }),
//        contentType: "application/json; charset=utf-8",
//        dataType: "json",
//        success: function (response) {
//            $.each(response.Table, function () {
//                window.drp_AddToGroup.innerHTML += "<option value='" + this.GroupId + "'>" + this.GroupName + "</option>";
//            });
//        },
//        error: ShowAjaxError
//    });
//}

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
    $.ajax({
        url: "/MobileAnalytics/MobileApp/SearchByOnclickCount",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'drpSearchBy': dropdownfilterSearchValue, 'txtSearchBy': SearchTextValue, 'fromdate': FromDateTime, 'todate': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            TotalRowCount = 0;
            if (response !== undefined && response !== null && response.Table !== undefined && response.Table !== null && response.Table.length > 0) {
                $.each(response.Table, function () {
                    TotalRowCount = this.TotalRows;
                });
            }

            if (TotalRowCount > 0) {
                if ($('#ui_div_FilterSelection').hasClass('hideDiv'))
                    $('#ui_div_FilterSelection').removeClass('hideDiv');
                GetReport();
            }
            else {
                SetNoRecordContent('ui_tblReportData', 6, 'ui_tbodyReportData');
                if (!$('#ui_div_FilterSelection').hasClass('hideDiv'))
                    $('#ui_div_FilterSelection').addClass('hideDiv');
                ShowExportDiv(false);
                ShowPagingDiv(false);
                HidePageLoading();
            }
        },
        error: ShowAjaxError
    });
}

function GetReport() {
    FetchNext = GetNumberOfRecordsPerPage();
    $.ajax({
        url: "/MobileAnalytics/MobileApp/SearchByOnclick",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'drpSearchBy': dropdownfilterSearchValue, 'txtSearchBy': SearchTextValue, 'fromdate': FromDateTime, 'todate': ToDateTime, 'start': OffSet, 'end': FetchNext }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindReport,
        error: ShowAjaxError
    });
}

function BindReport(response) {
    SetNoRecordContent('ui_tblReportData', 6, 'ui_tbodyReportData');
    if (response !== undefined && response !== null && response.Table !== undefined && response.Table !== null && response.Table.length > 0) {
        CurrentRowCount = response.Table.length;
        PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);

        var reportTableTrs;
        $.each(response.Table, function () {
           // contactId = (this.Email === 'null' || this.Email === null ? '' : (this.Email.toString().indexOf("~") > -1 ? this.Email.toString().split("~")[0] : ''));
            var name = this.Name !== null && this.Name !== undefined ? this.Name : "NA";
            reportTableTrs += "<tr>" +
                /*"<td class='td-wid-5 pl-0'><div class='chbxWrap'><label class='ckbox'><input class='selChk' value='" + contactId + "%" + this.DeviceId + "' type='checkbox'><span></span></label></div></td>" +*/
                "<td><div class='nameWrap'><div class='nameAlpWrap'><span class='nameAlpha' onclick='ShowContactUCP(null,\"" + this.DeviceId + "\",null)'>V</span></div><div class='nameTxtWrap'><span class='nameTxt'>" + this.Visitor + "</span></div></div></td>" +               
                //"<td>" + this.Visitor + "</td>" +
                "<td>" + this.Session + "</td>" +
                "<td>" + fn_AverageTime(this.AvgTime) + "</td>" +
                "<td>" + $.datepicker.formatDate("M dd yy", ConvertUTCDateTimeToLocal(this.Recency)) + " " + PlumbTimeFormat(ConvertUTCDateTimeToLocal(this.Recency)) + "</td>" +
                "<td>" + name + "</td>" +
                "</tr>";
        });

        $("#ui_tblReportData").removeClass('no-data-records');
        $("#ui_tbodyReportData").html(reportTableTrs);
        ShowExportDiv(true);
        ShowPagingDiv(true);
        RowCheckboxClick();
        ShowFilterByOption();
    }
    else {
        ShowExportDiv(false);
        ShowPagingDiv(false);
    }
    HidePageLoading();
}

///Search By Go Button
$('#ui_btn_FilterGo').click(function () {
    SearchTextValue = $('#searchFilterBox').val();
    CallBackFunction();
});

$(".selchbxall").click(function () {
    if ($(this).is(":checked")) {
        $(".selChk").prop('checked', true);
    }
    else {
        $(".selChk").prop('checked', false);
    }

    checkBoxClickCount = $('.selChk').filter(':checked').length;
    if (checkBoxClickCount > 0) {
        $(".subdivWrap").addClass('showDiv');
    }
    else {
        $(".subdivWrap").removeClass('showDiv');
    }
    $(".checkedCount").html(checkBoxClickCount);
});

//*********************************************
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
    });
}

$(".addgroupselect").change(function () {
    addGroupNameList = $(".addgroupselect option:selected").text();
    if (addGroupNameList === "Add to Group") {
        preventDefault();
    }
    else {
        $(".visitorsCount").html(checkBoxClickCount);
        $(".addgroupname").html(addGroupNameList);
        $("#confirmDialog").modal('show');
    }
});

$("#addtoGroupdis").click(function () {
    $(".subdivWrap").removeClass("showDiv");
    Addtogroup();
});

function Addtogroup() {
    ShowPageLoading();
    var chkArrayMachine = new Array();
    var chkArrayContactId = new Array();

    $("input:checkbox:checked").each(function () {
        chkArrayContactId.push($(this).val().split('%')[0]);
        chkArrayMachine.push($(this).val().split('%')[1]);
    });

    if (chkArrayMachine !== undefined && chkArrayMachine.length > 0) {
        $.ajax({
            type: "POST",
            url: "/Analytics/Audience/AddToGroup",
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'contact': chkArrayContactId, 'machine': chkArrayMachine, 'groupId': GroupId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response > 0)
                    ShowSuccessMessage(GlobalErrorList.Mobile_Visitor.success_message);
                else if (response === 0)
                    ShowErrorMessage(GlobalErrorList.Mobile_Visitor.duplicate_error);
                else
                    ShowErrorMessage(GlobalErrorList.Mobile_Visitor.error_message);

                HidePageLoading();
            },
            error: ShowAjaxError
        });
    }
    else {
        ShowErrorMessage(GlobalErrorList.Mobile_Visitor.selectvisitor_message);
    }
}
//*****************************************************

function ShowFilterByOption() {
    $(".dropdown-menu .visitfiltWrap a").click(function () {
        $("#ui_text_searchFilterBox").val('');
        var filterListVal = $(this).text();
        dropdownfilterSearchValue = $(this).attr('value');
        if (filterListVal === "All") {
            $(".btn-dropdown").focus();
            $("#filterTags span").html(filterListVal);
            $(".subdivFiltWrap").removeClass("showDiv");
            dropdownfilterSearchValue = SearchTextValue = '';
            CallBackFunction();
        }
        else {
            $(".btn-dropdown").focus();
            $("#filterTags span").html(filterListVal);
            $(".subdivFiltWrap").addClass("showDiv");
            $("#ui_text_searchFilterBox").attr("placeholder", "Search " + filterListVal);
           // BindFilterValues();
        }
    });
}

function BindFilterValues() {
    $.ajax({
        url: "/MobileAnalytics/MobileApp/SearchByFilterValues",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'drpSearchBy': dropdownfilterSearchValue, 'txtSearchBy': SearchTextValue,'fromdate': FromDateTime, 'todate': ToDateTime}),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            //window.searchFilterBox.innerHTML = '';
            //window.searchFilterBox.innerHTML += "<option label='Select'>Select</option>";
            //$.each(response.Table, function () {
            //    window.searchFilterBox.innerHTML += "<option label='" + this.FilterValue + "'>" + this.FilterValue + "</option>";
            //});
            $.each(response.Table, function () {
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

$(document).on('input', '.select2-search__field', function () {

    SearchTextValue = $('.select2-search__field').val();
    BindFilterValues();
});