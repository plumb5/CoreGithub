var GroupTotalInnerRowCount = 0;
var GroupCurrentInnerRowCount = 0;
var GroupInnerFetchNext = 10;
var GroupInnerOffSet = 0;

$(document).ready(function () {
    InitializeGroupInnerPaging();
});

function InitializeGroupInnerPaging() {
    $(document.body).on('click', '#ui_divGroupInnerPreviousPage', function (event) {
        GroupInnerOffSet = GroupInnerOffSet - GetGroupInnerNumberOfRecordsPerPage();
        GroupInnerOffSet <= 0 ? 0 : GroupInnerOffSet;
        CallBackGroupInnerPaging();
    });

    $(document.body).on('click', '#ui_divGroupInnerNextPage', function (event) {
        GroupInnerOffSet = GroupInnerOffSet + GetGroupInnerNumberOfRecordsPerPage();
        CallBackGroupInnerPaging();
    });

    $(document.body).on('change', '#drp_GroupRecordsInnerPerPage', function (event) {
        GroupInnerOffSet = 0;
        GroupInnerFetchNext = GetGroupInnerNumberOfRecordsPerPage();
        CallBackGroupInnerPaging();
    });
}

function ShowGroupInnerPagingDiv(IsVisible) {
    $("#ui_divGroupInnerPaging").removeClass('hideDiv');
    $("#ui_divGroupInnerPaging").removeClass('showDiv');
    if (IsVisible != undefined && IsVisible != null && (IsVisible == true || IsVisible == "True" || IsVisible == "true" || IsVisible)) {
        $("#ui_divGroupInnerPaging").addClass('showDiv');
    }
    else {
        $("#ui_divGroupInnerPaging").addClass('hideDiv');
    }
}

function InnerGroupPagingPrevNext(DataOffSet, DataCount, TotalData) {
    if ((DataOffSet != undefined && DataOffSet != null && DataOffSet > -1) && (DataCount != undefined && DataCount != null && DataCount > -1) && (TotalData != undefined && TotalData != null && TotalData > -1)) {

        ShowGroupInnerPagingDiv(true);
        $("#ui_divGroupInnerPreviousPage").removeClass('disableDiv');
        $("#ui_divGroupInnerNextPage").removeClass('disableDiv');

        if (DataOffSet == 0) {
            $("#ui_lblGroupInnerPagingDesc").html((DataOffSet + 1) + ' - ' + DataCount + ' of ' + TotalData);
            $("#ui_divGroupInnerPreviousPage").addClass('disableDiv');
        }
        else {
            $("#ui_lblGroupInnerPagingDesc").html((DataOffSet + 1) + ' - ' + (DataOffSet + DataCount) + ' of ' + TotalData);
        }

        if ((DataOffSet + DataCount) >= TotalData) {
            $("#ui_divGroupInnerNextPage").addClass('disableDiv');
        }
    }
}


GetGroupInnerNumberOfRecordsPerPage = function () {
    if ($("#drp_GroupRecordsInnerPerPage").length > 0) {
        if ($("#drp_GroupRecordsInnerPerPage").val().toString().toLowerCase() == "all")
            return 5000;
        else
            return parseInt($("#drp_GroupRecordsInnerPerPage").val());
    }
    return 20;
};