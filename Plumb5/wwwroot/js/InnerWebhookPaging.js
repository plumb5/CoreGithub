var WebhookTotalInnerRowCount = 0;
var WebhookCurrentInnerRowCount = 0;
var WebhookInnerFetchNext = 10;
var WebhookInnerOffSet = 0;

$(document).ready(function () {
    InitializeWebhookInnerPaging();
});

function InitializeWebhookInnerPaging() {
    $(document.body).on('click', '#ui_divWebhookInnerPreviousPage', function (event) {
        WebhookInnerOffSet = WebhookInnerOffSet - GetInnerWebhookNumberOfRecordsPerPage();
        WebhookInnerOffSet <= 0 ? 0 : WebhookInnerOffSet;
        CallBackWebhookInnerPaging();
    });

    $(document.body).on('click', '#ui_divWebhookInnerNextPage', function (event) {
        WebhookInnerOffSet = WebhookInnerOffSet + GetInnerWebhookNumberOfRecordsPerPage();
        CallBackWebhookInnerPaging();
    });

    $(document.body).on('change', '#drp_WebhookRecordsInnerPerPage', function (event) {
        WebhookInnerOffSet = 0;
        WebhookInnerFetchNext = GetInnerWebhookNumberOfRecordsPerPage();
        CallBackWebhookInnerPaging();
    });
}

function ShowWebhookInnerPagingDiv(IsVisible) {
    $("#ui_divWebhookInnerPaging").removeClass('hideDiv');
    $("#ui_divWebhookInnerPaging").removeClass('showDiv');
    if (IsVisible != undefined && IsVisible != null && (IsVisible == true || IsVisible == "True" || IsVisible == "true" || IsVisible)) {
        $("#ui_divWebhookInnerPaging").addClass('showDiv');
    }
    else {
        $("#ui_divWebhookInnerPaging").addClass('hideDiv');
    }
}

function InnerWebhookPagingPrevNext(DataOffSet, DataCount, TotalData) {
    if ((DataOffSet != undefined && DataOffSet != null && DataOffSet > -1) && (DataCount != undefined && DataCount != null && DataCount > -1) && (TotalData != undefined && TotalData != null && TotalData > -1)) {

        ShowWebhookInnerPagingDiv(true);
        $("#ui_divWebhookInnerPreviousPage").removeClass('disableDiv');
        $("#ui_divWebhookInnerNextPage").removeClass('disableDiv');

        if (DataOffSet == 0) {
            $("#ui_lblWebhookInnerPagingDesc").html((DataOffSet + 1) + ' - ' + DataCount + ' of ' + TotalData);
            $("#ui_divWebhookInnerPreviousPage").addClass('disableDiv');
        }
        else {
            $("#ui_lblWebhookInnerPagingDesc").html((DataOffSet + 1) + ' - ' + (DataOffSet + DataCount) + ' of ' + TotalData);
        }

        if ((DataOffSet + DataCount) >= TotalData) {
            $("#ui_divWebhookInnerNextPage").addClass('disableDiv');
        }
    }
}


GetInnerWebhookNumberOfRecordsPerPage = function () {
    if ($("#drp_WebhookRecordsInnerPerPage").length > 0) {
        if ($("#drp_WebhookRecordsInnerPerPage").val().toString().toLowerCase() == "all")
            return 5000;
        else
            return parseInt($("#drp_WebhookRecordsInnerPerPage").val());
    }
    return 20;
};

