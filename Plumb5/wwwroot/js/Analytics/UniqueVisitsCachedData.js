var Type, Parameter, FromDate, Todate;
function CallBackInnerPaging() {
    CurrentInnerRowCount = 0;
    GetInnerReport();
}
function GetCachedUniqueVisitsDetails(type, parameter, fromdate, todate) {
    ShowPageLoading();
    TotalInnerRowCount = 0;
    CurrentInnerRowCount = 0;
    Type = type;
    Parameter = parameter;
    FromDate = fromdate;
    Todate = todate;
    MaxInnerCount();
}
function MaxInnerCount() {
    ShowPageLoading()
    $.ajax({
        url: "/Analytics/Uniques/CachedUniqueVisitsGetMaxCount",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'type': Type + 'MaxCount', 'parameter': Parameter, 'fromdate': FromDate, 'todate': Todate }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response !== undefined && response !== null && response.Table1 !== undefined && response.Table1 !== null && response.Table1.length > 0) {
                TotalInnerRowCount = response.Table1[0].TotalRows;
                ShowPageLoading()
                GetInnerReport();
            }
            else {
                SetNoRecordContent('ui_tblUniqueVisitsReportData', 2, 'ui_tbodyUniqueVisitsReportData');
                HidePageLoading();
            }
        },
        error: ShowAjaxError
    });
    HidePageLoading();
}
function GetInnerReport() {
    ShowPageLoading()
    InnerFetchNext = GetInnerNumberOfRecordsPerPage();
    $('#dvTitle').text(Parameter);
    $.ajax({
        url: "/Analytics/Uniques/UniqueVisitsCachedReport",
        type: 'POST',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'type': Type, 'parameter': Parameter, 'fromdate': FromDate, 'todate': Todate, 'OffSet': InnerOffSet, 'FetchNext': InnerFetchNext }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            var reportUniqueVisitsTableTrs = "";
            if (response !== undefined && response !== null && response.Table1 !== undefined && response.Table1 !== null && response.Table1.length > 0) {
                CurrentInnerRowCount = response.Table1.length;
                InnerPagingPrevNext(InnerOffSet, CurrentInnerRowCount, TotalInnerRowCount);
                $.each(response.Table1, function () {
                    var currentDateData = ConvertDateObjectToDateTime(this.Date);
                    reportUniqueVisitsTableTrs += "<tr>" +
                        "<td class='text-left td-icon'>" + monthDetials[currentDateData.getMonth()] + " " + currentDateData.getDate() + "</td>" +
                        "<td>" + this.UniqueVisits + "</td>" +
                        "</tr>";
                });
                $("#ui_tbodyUniqueVisitsReportData").html(reportUniqueVisitsTableTrs);
                ShowInnerPagingDiv(true);
                HidePageLoading();
            }
            else {
                SetNoRecordContent('ui_tblUniqueVisitsReportData', 2, 'ui_tbodyUniqueVisitsReportData');
                HidePageLoading();
            }
        },
        error: ShowAjaxError
    });

}
$("#uniqueclose-popup").click(function () {
    $(this).parents(".popupcontainer").addClass("hideDiv");

});

