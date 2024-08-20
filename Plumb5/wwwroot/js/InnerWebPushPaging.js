var WebPushTotalInnerRowCount = 0;
var WebPushCurrentInnerRowCount = 0;
var WebPushInnerFetchNext = 10;
var WebPushInnerOffSet = 0;

$(document).ready(function () {
    InitializeWebPushInnerPaging();
});

function InitializeWebPushInnerPaging() {
    $(document.body).on('click', '#ui_divWebPushInnerPreviousPage', function (event) {
        WebPushInnerOffSet = WebPushInnerOffSet - GetInnerWebPushNumberOfRecordsPerPage();
        WebPushInnerOffSet <= 0 ? 0 : WebPushInnerOffSet;
        CallBackWebPushInnerPaging();
    });

    $(document.body).on('click', '#ui_divWebPushInnerNextPage', function (event) {
        WebPushInnerOffSet = WebPushInnerOffSet + GetInnerWebPushNumberOfRecordsPerPage();
        CallBackWebPushInnerPaging();
    });

    $(document.body).on('change', '#drp_WebPushRecordsInnerPerPage', function (event) {
        WebPushInnerOffSet = 0;
        WebPushInnerFetchNext = GetInnerWebPushNumberOfRecordsPerPage();
        CallBackWebPushInnerPaging();
    });
}

function ShowWebPushInnerPagingDiv(IsVisible) {
    $("#ui_divWebPushInnerPaging").removeClass('hideDiv');
    $("#ui_divWebPushInnerPaging").removeClass('showDiv');
    if (IsVisible != undefined && IsVisible != null && (IsVisible == true || IsVisible == "True" || IsVisible == "true" || IsVisible)) {
        $("#ui_divWebPushInnerPaging").addClass('showDiv');
    }
    else {
        $("#ui_divWebPushInnerPaging").addClass('hideDiv');
    }
}

function InnerWebPushPagingPrevNext(DataOffSet, DataCount, TotalData) {
    if ((DataOffSet != undefined && DataOffSet != null && DataOffSet > -1) && (DataCount != undefined && DataCount != null && DataCount > -1) && (TotalData != undefined && TotalData != null && TotalData > -1)) {

        ShowWebPushInnerPagingDiv(true);
        $("#ui_divWebPushInnerPreviousPage").removeClass('disableDiv');
        $("#ui_divWebPushInnerNextPage").removeClass('disableDiv');

        if (DataOffSet == 0) {
            $("#ui_lblWebPushInnerPagingDesc").html((DataOffSet + 1) + ' - ' + DataCount + ' of ' + TotalData);
            $("#ui_divWebPushInnerPreviousPage").addClass('disableDiv');
        }
        else {
            $("#ui_lblWebPushInnerPagingDesc").html((DataOffSet + 1) + ' - ' + (DataOffSet + DataCount) + ' of ' + TotalData);
        }

        if ((DataOffSet + DataCount) >= TotalData) {
            $("#ui_divWebPushInnerNextPage").addClass('disableDiv');
        }
    }
}


GetInnerWebPushNumberOfRecordsPerPage = function () {
    if ($("#drp_WebPushRecordsInnerPerPage").length > 0) {
        if ($("#drp_WebPushRecordsInnerPerPage").val().toString().toLowerCase() == "all")
            return 5000;
        else
            return parseInt($("#drp_WebPushRecordsInnerPerPage").val());
    }
    return 20;
};

