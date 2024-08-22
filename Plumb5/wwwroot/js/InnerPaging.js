var TotalInnerRowCount = 0;
var CurrentInnerRowCount = 0;
var InnerFetchNext = 10;
var InnerOffSet = 0;

$(document).ready(function () {
    InitializeInnerPaging();
});

function InitializeInnerPaging() {
    $(document.body).on('click', '#ui_divInnerPreviousPage', function (event) {
        InnerOffSet = InnerOffSet - GetInnerNumberOfRecordsPerPage();
        InnerOffSet <= 0 ? 0 : InnerOffSet;
        CallBackInnerPaging();
    });

    $(document.body).on('click', '#ui_divInnerNextPage', function (event) {
        InnerOffSet = InnerOffSet + GetInnerNumberOfRecordsPerPage();
        CallBackInnerPaging();
    });

    $(document.body).on('change', '#drp_RecordsInnerPerPage', function (event) {
        InnerOffSet = 0;
        InnerFetchNext = GetInnerNumberOfRecordsPerPage();
        CallBackInnerFunction();
    });
}

function ShowInnerPagingDiv(IsVisible) {
    $("#ui_divInnerPaging").removeClass('hideDiv');
    $("#ui_divInnerPaging").removeClass('showDiv');
    if (IsVisible != undefined && IsVisible != null && (IsVisible == true || IsVisible == "True" || IsVisible == "true" || IsVisible)) {
        $("#ui_divInnerPaging").addClass('showDiv');
    }
    else {
        $("#ui_divInnerPaging").addClass('hideDiv');
    }
}

function InnerPagingPrevNext(DataOffSet, DataCount, TotalData) {
    if ((DataOffSet != undefined && DataOffSet != null && DataOffSet > -1) && (DataCount != undefined && DataCount != null && DataCount > -1) && (TotalData != undefined && TotalData != null && TotalData > -1)) {

        ShowInnerPagingDiv(true);
        $("#ui_divInnerPreviousPage").removeClass('disableDiv');
        $("#ui_divInnerNextPage").removeClass('disableDiv');

        if (DataOffSet == 0) {
            $("#ui_lblInnerPagingDesc").html((DataOffSet + 1) + ' - ' + DataCount + ' of ' + TotalData);
            $("#ui_divInnerPreviousPage").addClass('disableDiv');
        }
        else {
            $("#ui_lblInnerPagingDesc").html((DataOffSet + 1) + ' - ' + (DataOffSet + DataCount) + ' of ' + TotalData);
        }

        if ((DataOffSet + DataCount) >= TotalData) {
            $("#ui_divInnerNextPage").addClass('disableDiv');
        }
    }
}


GetInnerNumberOfRecordsPerPage = function () {
    if ($("#drp_RecordsInnerPerPage").length > 0) {
        if ($("#drp_RecordsInnerPerPage").val().toString().toLowerCase() == "all")
            return 5000;
        else
            return parseInt($("#drp_RecordsInnerPerPage").val());
    }
    return 20;
};

function SetInnerNoRecordContent(ReportTableId, NumberOfColumn, ReportTableTbodyId) {
    if (ReportTableId != undefined && ReportTableId != null && ReportTableId != '' && NumberOfColumn != undefined && NumberOfColumn != null && NumberOfColumn != '' && $.isNumeric(NumberOfColumn) && ReportTableTbodyId != undefined && ReportTableTbodyId != null && ReportTableTbodyId != '') {
        $("#" + ReportTableId).removeClass('no-data-records').addClass('no-data-records');
        $("#" + ReportTableTbodyId).html("<tr><td colspan=" + NumberOfColumn + " class='border-bottom-none'><div class='no-data'>There is no data for this view</div></td></tr>");
        
        if ($("#ui_divInnerPaging").length)
            ShowInnerPagingDiv(false);
    }
}