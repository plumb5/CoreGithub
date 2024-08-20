
$(document).ready(function () {
    InitializePaging();
});

function InitializePaging() {
    $(document.body).on('click', '#ui_divPreviousPage', function (event) {
        OffSet = OffSet - GetNumberOfRecordsPerPage();
        OffSet <= 0 ? 0 : OffSet;
        CallBackPaging();
    });

    $(document.body).on('click', '#ui_divNextPage', function (event) {
        OffSet = OffSet + GetNumberOfRecordsPerPage();
        CallBackPaging();
    });

    $(document.body).on('change', '#drp_RecordsPerPage', function (event) {
        OffSet = 0;
        FetchNext = GetNumberOfRecordsPerPage();
        CallBackFunction();
    });
}

function ShowPagingDiv(IsVisible) {
    $("#ui_divPaging").removeClass('hideDiv');
    $("#ui_divPaging").removeClass('showDiv');
    if (IsVisible != undefined && IsVisible != null && (IsVisible == true || IsVisible == "True" || IsVisible == "true" || IsVisible)) {
        $("#ui_divPaging").addClass('showDiv');
    }
    else {
        $("#ui_divPaging").addClass('hideDiv');
    }
}

function PagingPrevNext(DataOffSet, DataCount, TotalData) {
    if ((DataOffSet != undefined && DataOffSet != null && DataOffSet > -1) && (DataCount != undefined && DataCount != null && DataCount > -1) && (TotalData != undefined && TotalData != null && TotalData > -1)) {

        ShowPagingDiv(true);
        $("#ui_divPreviousPage").removeClass('disableDiv');
        $("#ui_divNextPage").removeClass('disableDiv');

        if (DataOffSet == 0) {
            $("#ui_lblPagingDesc").html((DataOffSet + 1) + ' - ' + DataCount + ' of ' + TotalData);
            $("#ui_divPreviousPage").addClass('disableDiv');
        }
        else {
            $("#ui_lblPagingDesc").html((DataOffSet + 1) + ' - ' + (DataOffSet + DataCount) + ' of ' + TotalData);
        }

        if ((DataOffSet + DataCount) >= TotalData) {
            $("#ui_divNextPage").addClass('disableDiv');
        }
    }
}