var filterLead = {
    referrer: "", refertype: "", visitorip: "", machineid: "", pagename: "", accountid: 0, city: "", country: "", countrycode: "", date: "", timeend: null, previousvisit: null,
    searchby: "", flag: "", entrypage: "", lastpage: "", browser: "", network: "", repeatornew: "", latitude: "", longitude: "", pageviews: 0, sessionid: "", visitorid: "", score: 0.0,
    paidcampaignflag: 0, deviceid: 0, utmsource: "", utmmedium: "", utmcampaign: "", utmterm: "", devicebrandname: "", devicemodelname: "", cs_entrypage: 0, cs_lastpage: 0, iscookieblocked: null,
    iseventtriggered: 0, p5mailuniqueid: "", p5smsuniqueid: "", p5whatsappuniqueid: "", p5webpushuniqueid: "", iscustomeventsource: null, isformsource: null
};
_savedID = 0;
$(document).ready(() => {
    SetNoRecordContent('ui_tableReport', 5, 'ui_tbodyReportData');
    AnalyticsSaveReportUtil.BindSavedReports();
    setTimeout(GetUTCDateTimeRange(2), 5000);
    HidePageLoading();
    ExportFunctionName = "AnalyticsReportExport";
   
});

$("#btnSavedReport").click(function () {
    $(".popuptitlwrp h6").html('SAVED REPORTS');
    $('#dvSavedReports').removeClass("hideDiv");
    if (Groupby != "")
        AnalyticsSaveReportUtil.BindSavedReports();
    HidePageLoading();
});

// Click event handler for the close icon
$("#close-popup").click(function () {
    $("#dvSavedReports").addClass("hideDiv");
});
var Groupby = "";
function CallBackFunction() {

    ShowPageLoading();
    TotalRowCount = 0;
    CurrentRowCount = 0;
    //if (_savedID>0)
    if (Groupby!="")
    AnalyticsSaveReportUtil.GetMaxCount();
    HidePageLoading();
}
function CallBackPaging() {
    CurrentRowCount = 0;
    AnalyticsSaveReportUtil.GetRecentSavedReportDetails();
}

var AnalyticsSaveReportUtil = {
    BindSavedReports: function () {
        $.ajax({
            url: "/Analytics/AnalyticReports/GetSavedReports",
            type: 'POST',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'UserId': Plumb5UserId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != undefined && response != null && response.length > 0) {
                    myAnalyticsReportList = response;
                    var SavedreportTableTrs = "", checkedData = "checked=checked";
                    $.each(response, function (i) {
                        if (i == 0) {
                            AnalyticsSaveReportUtil.GetFilterConditionDetails('Bind', this.Id);
                        }
                        SavedreportTableTrs += "<tr>" +
                            "<td class='text-left td-wid-5 m-p-w-40'>" +
                            "<div class='custom-control custom-checkbox'>" +
                            "<input type='checkbox' class='custom-control-input' id='rdSavedreports_" + this.Id + "' name='lmssavedrept' " + checkedData + " onclick=\"AnalyticsSaveReportUtil.GetFilterConditionDetails('Bind'," + this.Id + ");\">" +
                            "<label class='custom-control-label' for='rdSavedreports_" + this.Id + "'></label>" +
                            "</div>" +
                            "</td>" +
                            "<td class='text-left'>" +
                            "<div class='lmssavedrepname mb-3'><i class='fa fa-bar-chart'></i>" +
                            "<span>" + this.Name + "</span></div>" +
                            "<div class='editDeleteWrap'>" +
                            "<button data-colheadtitle='Edit Event Tracking' class='td-edit editEventTrack popViewHref ContributePermission' onclick=\"AnalyticsSaveReportUtil.EditSavedReports(" + this.Id + ");\">Edit</button>" +
                            "<button data-toggle='modal' data-target='#deletelmsuser' class='td-delete delEventTrack FullControlPermission' onclick=\"AnalyticsSaveReportUtil.DeleteSavedSearchConfirm(" + this.Id + ");\">Delete</button></div>" +
                            "</td>" +
                            "</tr>";
                        checkedData = '';
                    });
                    $("#ui_tblSavedReportData").removeClass('no-data-records');
                    $("#ui_tbodySavedReportData").html(SavedreportTableTrs);

                }
                else {
                    SetNoRecordContent('ui_tblSavedReportData', 2, 'ui_tbodySavedReportData');
                }
            },
            error: ShowAjaxError
        });
    },
    DeleteSavedSearchConfirm: function (Id) {
        $("#deleteRowConfirmreport").attr("onclick", "AnalyticsSaveReportUtil.DeleteSavedSearch(" + Id + ");");
    },
    EditSavedReports: function (id) {
        try {
            EditCondition(id);
        } catch (e) {
            ShowAjaxError(e);
        }

    },
    DeleteSavedSearch: function (Id) {

        $.ajax({
            url: "/Analytics/AnalyticReports/DeleteSavedSearch",
            type: 'POST',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'Id': Id }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response) {
                    ShowSuccessMessage(GlobalErrorList.MyReports.Delete_SuccessMessage);
                    AnalyticsSaveReportUtil.BindSavedReports();
                }
                else
                    ShowErrorMessage(GlobalErrorList.MyReports.Delete_ErrorMessage);
                $('#dvAddOrUpdateReports').addClass("hideDiv");

            },
            error: ShowAjaxError
        });
    },

    GetRecentSavedReportDetails: function () {
        FetchNext = GetNumberOfRecordsPerPage();
        SetNoRecordContent('ui_tblReportData', 6, 'ui_tbodyReportData');
        $.ajax({
            url: "/Analytics/AnalyticReports/GetAnalyticSaveReports",
            type: 'Post',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'filterDataJson': filterLead, 'Groupby': Groupby, 'OffSet': OffSet, 'FetchNext': FetchNext, 'FromDateTime': FromDateTime, 'ToDateTime': ToDateTime, }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != null) {
                    //filterLead = new Object();
                    //filterLead = JSON.parse(response.AnalyticJson);
                    AnalyticsSaveReportUtil.BindReportData(response);
                    $("#ui_span_SavedReports").html(response.Name);
                }
                else {
                    SetNoRecordContent('ui_tblReportData', 6, 'ui_tbodyReportData');
                    HidePageLoading();
                }
            },
            error: ShowAjaxError
        });
    },
    BindReportData: function (response) {
        var tbody = $('#ui_tbodyReportData');
        tbody.empty(); // Clear existing rows
        var reportTableTrs = "";
        // Iterate over the response data and append rows to the table
        if (response != undefined && response != null && response.Table1.length > 0) {
            CurrentRowCount = response.Table1.length;
            PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);
            for (var i = 0; i < response.Table1.length; i++) {

                reportTableTrs += '<tr>' +
                    '<td class="text-left">' + response.Table1[i].Groupby + '</td>' +
                    '<td class="text-left">' + response.Table1[i].TotalVisit + '</td>' +
                    //"<td>" + (response.VisitorSessionData.Table[i].UniqueVisit != "0" ? "<a href='/Analytics/Uniques/UniqueVisits?dur=0&Frm=" + FromDateTime + "&To=" + ToDateTime + "&From=MyReport'>" + response.VisitorSessionData.Table[i].UniqueVisit + "</a>" : response.VisitorSessionData.Table[i].UniqueVisit) + "</td> " +

                    "<td>" + response.Table1[i].UniqueVisit + "</td> " +
                    '<td>' + response.Table1[i].Session + '</td>' +
                    '<td>' + fn_AverageTime(response.Table1[i].TotalTime) + '</td>' +
                    '</tr>';

            }
        }
        //ShowExportDiv(true);
        //ShowPagingDiv(true);
        $("#ui_tableReport").removeClass('no-data-records');
        $("#ui_tbodyReportData").html(reportTableTrs);
        HidePageLoading();
        HidePageLoading();
    },

    GetFilterConditionDetails: function (Action, Id) {
        ShowPageLoading();
        $("input:checkbox[name='lmssavedrept']").prop("checked", false);
        $("#rdSavedreports_" + Id).prop("checked", true);
        TotalRowCount = 0;
        CurrentRowCount = 0;
        OffSet = 0;
        _savedID = Id;
        $.ajax({
            url: "/Analytics/AnalyticReports/GetFilterConditionDetails",
            type: 'Post',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'FilterConditionId': Id }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (Action == 'Edit')
                    MyReportsUtil.BindFilterCondtionDetails(response);
                else if (Action == 'Bind') {
                    if (response != null) {
                        $("#ui_span_SavedReports").html(response.Name);
                         filterLead = {
                            referrer: "", refertype: "", visitorip: "", machineid: "", pagename: "", accountid: 0, city: "", country: "", countrycode: "", date: "", timeend: null, previousvisit: null,
                            searchby: "", flag: "", entrypage: "", lastpage: "", browser: "", network: "", repeatornew: "", latitude: "", longitude: "", pageviews: 0, sessionid: "", visitorid: "", score: 0.0,
                            paidcampaignflag: 0, deviceid: 0, utmsource: "", utmmedium: "", utmcampaign: "", utmterm: "", devicebrandname: "", devicemodelname: "", cs_entrypage: 0, cs_lastpage: 0, iscookieblocked: null,
                            iseventtriggered: 0, p5mailuniqueid: "", p5smsuniqueid: "", p5whatsappuniqueid: "", p5webpushuniqueid: "", iscustomeventsource: null, isformsource: null
                        };
                        filterLead = JSON.parse(response.AnalyticJson);
                        Groupby = response.GroupBy;
                        AnalyticsSaveReportUtil.GetMaxCount();
                    }
                }

                //$('#dvSavedReports').addClass("hideDiv");
            },
            error: ShowAjaxError
        });
    },
    GetMaxCount: function () {
        ShowPageLoading();
        SetNoRecordContent('ui_tblReportData', 0, 'ui_tbodyReportData');
        $("#ui_trbodyReportData").empty();
        $.ajax({
            url: "/Analytics/AnalyticReports/GetMaxCount",
            type: 'POST',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'filterLead': filterLead, 'Groupby': Groupby, 'FromDateTime': FromDateTime, 'ToDateTime': ToDateTime, }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                TotalRowCount = result;
                if (TotalRowCount > 0) {
                    ShowPagingDiv(true);
                    AnalyticsSaveReportUtil.GetRecentSavedReportDetails();
                    $("#ui_exportOrDownload").removeClass("hideDiv");
                    $("#ui_printscreen").removeClass("hideDiv");

                }

                else {
                    $("#ui_exportOrDownload").addClass("hideDiv");
                    $("#ui_printscreen").addClass("hideDiv");
                    ShowExportDiv(false);
                    ShowPagingDiv(false);
                    HidePageLoading();
                    SetNoRecordContent('ui_tableReport', 5, 'ui_tbodyReportData');
                }
                    
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },
};
