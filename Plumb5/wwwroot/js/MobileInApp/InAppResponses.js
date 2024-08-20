var inAppCampaignName = "";

$(document).ready(function () {
    MobileInAppResponsesUtil.GetMobileInAppCampaign();
    ExportFunctionName = "InAppResponsesExport";
});

$("#ui_drpdwn_MobileForms").select2({
    minimumResultsForSearch: '',
    dropdownAutoWidth: false
});

$("#ui_drpdwn_MobileForms").on('change', function () {
    ShowPageLoading();
    inAppCampaignName = $("#ui_drpdwn_MobileForms").val();
    if (inAppCampaignName == "NULL")
        inAppCampaignName = "";
    MobileInAppResponsesUtil.GetMaxCount();
});

function CallBackFunction() {
    TotalRowCount = 0;
    CurrentRowCount = 0;
    MobileInAppResponsesUtil.GetMaxCount();
}

function CallBackPaging() {
    CurrentRowCount = 0;
    MobileInAppResponsesUtil.GetReport();
}

var MobileInAppResponsesUtil = {
    GetMobileInAppCampaign: function () {
        $.ajax({
            url: "/MobileInApp/Reports/GetMobileInAppCampaign",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != null && response != undefined && response.length > 0) {
                    $.each(response, function (i) {
                        $('#ui_drpdwn_MobileForms').append($("<option></option>").attr("value", this.Name).text(this.Name).attr("title", this.Name));
                    });
                }
                GetUTCDateTimeRange(2);
            },
            error: ShowAjaxError
        });
    },
    GetMaxCount: function () {
        $.ajax({
            url: "/MobileInApp/Reports/GetInAppResponsesMaxCount",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime, 'InAppCampaignName': inAppCampaignName }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                TotalRowCount = response;

                if (TotalRowCount > 0)
                    MobileInAppResponsesUtil.GetReport();
                else {
                    SetNoRecordContent('ui_tblReportData', 6, 'ui_tbodyReportData');
                    HidePageLoading();
                }
            },
            error: ShowAjaxError
        });
    },
    GetReport: function () {
        FetchNext = GetNumberOfRecordsPerPage();
        $.ajax({
            url: "/MobileInApp/Reports/GetInAppResponsesReport",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime, 'OffSet': OffSet, 'FetchNext': FetchNext, 'InAppCampaignName': inAppCampaignName }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: MobileInAppResponsesUtil.BindReport,
            error: ShowAjaxError
        });
    },
    BindReport: function (response) {
        SetNoRecordContent('ui_tblReportData', 6, 'ui_tbodyReportData');
        if (response != undefined && response != null) {
            CurrentRowCount = response.length;
            PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);

            var reportTableTrs = "";
            $.each(response, function () {
                var ConnversionRate = this.ImpressionCount > 0 ? Math.round((this.ResponseCount / this.ImpressionCount) * 100) : 0;
                reportTableTrs += `<tr>
                                    <td class="text-left">
                                        <div class="td-actionFlexSB">
                                            <div class="nametitWrap">
                                                <span class="groupNameTxt">${this.Name}</span>
                                                <span class="templatenametxt">${$.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(this.CreatedDate))}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>${this.InAppCampaignType}</td>
                                    <td>${this.ImpressionCount}</td>
                                    <td>${this.ResponseCount}</td>
                                    <td>${this.ClosedCount}</td>
                                    <td>${ConnversionRate}</td>
                                </tr>`;
            });

            $("#ui_tblReportData").removeClass('no-data-records');
            $("#ui_tbodyReportData").html(reportTableTrs);
            ShowExportDiv(true);
            ShowPagingDiv(true);
        }
        else {
            ShowExportDiv(false);
            ShowPagingDiv(false);
        }
        HidePageLoading();
    }
};