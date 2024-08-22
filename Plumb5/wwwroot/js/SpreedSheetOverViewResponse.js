var responseMaxCount = 0, responseOffSet = 0, responseFetchNext = 0, responseCurrentRowCount = 0;
var FormIdentifier = "";
var spreedsheetoverviewresponse = {
    GetMaxCount: function (Id, Spreedsheetname) {
        ShowPageLoading();
        responseMaxCount = 0, responseOffSet = 0, responseFetchNext = 0, responseCurrentRowCount = 0;
        $("#ui_subtitle_small").html(Spreedsheetname);
        $.ajax({
            url: "/ManageContact/SpreadsheetsImportData/OverviewMaxCount",
            type: 'Post',
            data: JSON.stringify({ 'AdsId': Plumb5AccountId, 'SpreadsheetsImportId': Id }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                responseMaxCount = response.returnVal;
                $("#ui_div_ResponseJson").html('');
                if (responseMaxCount > 0) {
                    InitializeResponsePaging(Id, FormIdentifier);
                    $("#ui_Paggingdiv, #ui_div_ResponseJson").removeClass('hideDiv');
                    $("#ui_tbl_ResponseReportData").addClass("hideDiv");
                    spreedsheetoverviewresponse.GetResponseDetails(Id);
                }
                else {
                    $("#ui_tbl_ResponseReportData").removeClass("hideDiv");
                    $("#ui_Paggingdiv, #ui_div_ResponseJson").addClass('hideDiv');
                    $("#ui_div_SpreedSheetOverviewResponse").removeClass("hideDiv");
                    HidePageLoading();
                }
            },
            error: ShowAjaxError
        });
    },
    GetResponseDetails: function (Id) {
        responseFetchNext = $("#ui_drpdwn_NumberOfRecords").val();
        $.ajax({
            url: "/ManageContact/SpreadsheetsImportData/GetSpreadsheetsOverviewData",
            type: 'Post',
            data: JSON.stringify({ 'AdsId': Plumb5AccountId, 'SpreadsheetsImportId': Id, 'OffSet': responseOffSet, 'FetchNext': responseFetchNext }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                var responseArrayList = [];
                if (response != null && response.length > 0) {
                    responseCurrentRowCount = response.length;
                    ResponsePagingPrevNext(responseOffSet, responseCurrentRowCount, responseMaxCount);
                    $.each(response, function () {
                        var responseBody = { PostedUrl: "NA", Response: "NA", ResponseCode: 0, SentDate: $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(this.ReceivedDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(this.ReceivedDate)), RequestBody: spreedsheetoverviewresponse.GetJsonData("NA"), ResponseFromServer: spreedsheetoverviewresponse.GetJsonData(this.ServerResponses) };

                        responseArrayList.push(responseBody);
                    });
                    new JsonEditor('#ui_div_ResponseJson', spreedsheetoverviewresponse.GetJsonData(responseArrayList));
                    $("ul>li>a.json-toggle").click();
                    $("#ui_div_SpreedSheetOverviewResponse").removeClass("hideDiv");
                }
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },
    GetJsonData: function (LogContent) {
        var parsedData;
        try {
            parsedData = JSON.parse(LogContent);
        } catch (e) {
            // is not a valid JSON string
            parsedData = LogContent;
        }

        return parsedData;
    }
};

function ResponsePagingPrevNext(DataOffSet, DataCount, TotalData) {
    if ((DataOffSet != undefined && DataOffSet != null && DataOffSet > -1) && (DataCount != undefined && DataCount != null && DataCount > -1) && (TotalData != undefined && TotalData != null && TotalData > -1)) {

        ShowPagingDiv(true);
        $("#ui_div_BackPopPaging").removeClass('disableDiv');
        $("#ui_div_NextPopPaging").removeClass('disableDiv');

        if (DataOffSet == 0) {
            $("#ui_lbl_Paging").html((DataOffSet + 1) + ' - ' + DataCount + ' of ' + TotalData);
            $("#ui_div_BackPopPaging").addClass('disableDiv');
        }
        else {
            $("#ui_lbl_Paging").html((DataOffSet + 1) + ' - ' + (DataOffSet + DataCount) + ' of ' + TotalData);
        }

        if ((DataOffSet + DataCount) >= TotalData) {
            $("#ui_div_NextPopPaging").addClass('disableDiv');
        }
    }
}

function InitializeResponsePaging(Id, FormIdentifier) {
    $(document.body).on('click', '#ui_div_BackPopPaging', function (event) {
        responseOffSet = responseOffSet - parseInt($("#ui_drpdwn_NumberOfRecords").val());
        responseOffSet <= 0 ? 0 : responseOffSet;
        ResponseCallBackPaging(Id);
    });

    $(document.body).on('click', '#ui_div_NextPopPaging', function (event) {
        responseOffSet = responseOffSet + parseInt($("#ui_drpdwn_NumberOfRecords").val());
        ResponseCallBackPaging(Id);
    });

    $(document.body).on('change', '#ui_drpdwn_NumberOfRecords', function (event) {
        responseOffSet = 0;
        responseFetchNext = parseInt($("#ui_drpdwn_NumberOfRecords").val());
        ResponseCallBackFunction(Id, FormIdentifier);
    });
}

function ResponseCallBackFunction(Id, FormIdentifier) {
    ShowPageLoading();
    responseMaxCount = 0;
    responseCurrentRowCount = 0;
    spreedsheetoverviewresponse.GetMaxCount(Id, FormIdentifier);
}

function ResponseCallBackPaging(Id) {
    responseCurrentRowCount = 0;
    spreedsheetoverviewresponse.GetResponseDetails(Id);
}

$("#close-responsepopup").click(function () {
    $(this).parents(".popupcontainer").addClass("hideDiv");
    $("tr").removeClass("activeBgRow");
    $(".errmsgemlvalidwrp .ion-ios-information").popover("hide");
});