var MobilePushTotalInnerRowCount = 0;
var MobilePushCurrentInnerRowCount = 0;
var MobilePushInnerFetchNext = 10;
var MobilePushInnerOffSet = 0;

$(document).ready(function () {
    InitializeMobilePushInnerPaging();
});

function InitializeMobilePushInnerPaging() {
    $(document.body).on('click', '#ui_divMobilePushInnerPreviousPage', function (event) {
        MobilePushInnerOffSet = MobilePushInnerOffSet - GetInnerMobilePushNumberOfRecordsPerPage();
        MobilePushInnerOffSet <= 0 ? 0 : MobilePushInnerOffSet;
        CallBackMobilePushInnerPaging();
    });

    $(document.body).on('click', '#ui_divMobilePushInnerNextPage', function (event) {
        MobilePushInnerOffSet = MobilePushInnerOffSet + GetInnerMobilePushNumberOfRecordsPerPage();
        CallBackMobilePushInnerPaging();
    });

    $(document.body).on('change', '#drp_MobilePushRecordsInnerPerPage', function (event) {
        MobilePushInnerOffSet = 0;
        MobilePushInnerFetchNext = GetInnerMobilePushNumberOfRecordsPerPage();
        CallBackMobilePushInnerPaging();
    });
}

function ShowMobilePushInnerPagingDiv(IsVisible) {
    $("#ui_divMobilePushInnerPaging").removeClass('hideDiv');
    $("#ui_divMobilePushInnerPaging").removeClass('showDiv');
    if (IsVisible != undefined && IsVisible != null && (IsVisible == true || IsVisible == "True" || IsVisible == "true" || IsVisible)) {
        $("#ui_divMobilePushInnerPaging").addClass('showDiv');
    }
    else {
        $("#ui_divMobilePushInnerPaging").addClass('hideDiv');
    }
}

function InnerMobilePushPagingPrevNext(DataOffSet, DataCount, TotalData) {
    if ((DataOffSet != undefined && DataOffSet != null && DataOffSet > -1) && (DataCount != undefined && DataCount != null && DataCount > -1) && (TotalData != undefined && TotalData != null && TotalData > -1)) {

        ShowMobilePushInnerPagingDiv(true);
        $("#ui_divMobilePushInnerPreviousPage").removeClass('disableDiv');
        $("#ui_divMobilePushInnerNextPage").removeClass('disableDiv');

        if (DataOffSet == 0) {
            $("#ui_lblMobilePushInnerPagingDesc").html((DataOffSet + 1) + ' - ' + DataCount + ' of ' + TotalData);
            $("#ui_divMobilePushInnerPreviousPage").addClass('disableDiv');
        }
        else {
            $("#ui_lblMobilePushInnerPagingDesc").html((DataOffSet + 1) + ' - ' + (DataOffSet + DataCount) + ' of ' + TotalData);
        }

        if ((DataOffSet + DataCount) >= TotalData) {
            $("#ui_divMobilePushInnerNextPage").addClass('disableDiv');
        }
    }
}


GetInnerMobilePushNumberOfRecordsPerPage = function () {
    if ($("#drp_MobilePushRecordsInnerPerPage").length > 0) {
        if ($("#drp_MobilePushRecordsInnerPerPage").val().toString().toLowerCase() == "all")
            return 5000;
        else
            return parseInt($("#drp_MobilePushRecordsInnerPerPage").val());
    }
    return 20;
};

