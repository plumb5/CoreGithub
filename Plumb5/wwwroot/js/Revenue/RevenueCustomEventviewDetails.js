var customeventoverviewid = 0;
var fromdate;
var todate;
var EventExtraFiledsName;
var channel = "";
var campaignid = 0;
var EventName = "";
var campignType = 0;
$(document).ready(function () {
    ExportFunctionName = "RevenueExportCstEvtDetailsReport";
    customeventoverviewid = $.urlParam("RevenuecustomEventOverViewId");
    campignType = $.urlParam("campigntype");
    $(".pagetitle").text("Event Name:" + $.urlParam("Ename").replace(/%20/g, " "));
    EventName = $.trim($.urlParam("Ename").replace(/%20/g, " "));
    var duration = parseInt($.urlParam("dur"));
    var From = $.urlParam("Frm").toString().replace(/%20/g, " ");
    var To = $.urlParam("To").toString().replace(/%20/g, " ");
    $("#totalcountspan").text($.urlParam("Tonum").toString().replace(/%20/g, " "));
    TotalRowCount = $.urlParam("Tonum").toString().replace(/%20/g, " ");
    channel = $.urlParam("channel").toString().replace(/%20/g, " ");
    if (channel == "0")
        channel = "";

    campaignid = parseInt($.urlParam("campaignid"));
    OffSet = 0;
    FromDateTime = $.urlParam("Frm").toString().replace(/%20/g, " ");
    ToDateTime = $.urlParam("To").toString().replace(/%20/g, " ");
    if (duration == 0) {
        $('#selectdateDropdown').text('Custom Date Range');
        $('.dateBoxWrap').addClass('showFlx');


        var dtFromDate = new Date(ConvertUTCDateTimeToLocal(From));
        var SelectedFromDate = ((dtFromDate.getMonth() + 1) < 10 ? '0' + (dtFromDate.getMonth() + 1) : (dtFromDate.getMonth() + 1)) + '/' + (dtFromDate.getDate() < 10 ? '0' + dtFromDate.getDate() : dtFromDate.getDate()) + '/' +
            dtFromDate.getFullYear();

        var dtToDate = new Date(ConvertUTCDateTimeToLocal(To));
        var SelectedToDate = ((dtToDate.getMonth() + 1) < 10 ? '0' + (dtToDate.getMonth() + 1) : (dtToDate.getMonth() + 1)) + '/' + (dtToDate.getDate() < 10 ? '0' + dtToDate.getDate() : dtToDate.getDate()) + '/' +
            dtToDate.getFullYear();

        $('#ui_txtStartDate').val(SelectedFromDate);
        $('#ui_txtEndDate').val(SelectedToDate);

    }
    GetReport();
    RevenueEventMappingDetails();
});
function CallBackFunction() {

    ShowPageLoading();
    TotalRowCount = 0;
    CurrentRowCount = 0;
    RevenueEventMappingDetails();
    fromdate = FromDateTime;
    todate = ToDateTime;
    GetCstmaxcount();

}
function CallBackPaging() {

    ShowPageLoading();
    CurrentRowCount = 0;
    GetReport();
}
function RevenueEventMappingDetails() {
    EventExtraFiledsName = [];

    $.ajax({
        url: "/Revenue/RevenueCustomEventViewDetails/GetEventExtraFieldData",
        type: 'POST',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'customEventOverViewId': customeventoverviewid }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (response) {
            EventExtraFiledsName = response;

        },

        error: ShowAjaxError
    });
}
function GetCstmaxcount() {

    $.ajax({
        url: "/Revenue/RevenueCustomEventViewDetails/MaxCount",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'customeventoverviewid': customeventoverviewid, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime, 'Channel': channel, 'CampaignId': campaignid, 'EventName': EventName, 'CampignType': campignType }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            TotalRowCount = 0;
            if (response != undefined && response != null && response.returnVal > 0) {
                TotalRowCount = response.returnVal;
            }

            if (TotalRowCount > 0) {
                $("#totalcountspan").text(TotalRowCount);
                GetReport();
                ShowExportDiv(true);
                ShowPagingDiv(true);
            }
            else {
                SetNoRecordContent('ui_tableReport', 6, 'ui_trbodyReportData');
                $("#totalcountspan").text(0);
                ShowExportDiv(false);
                ShowPagingDiv(false);
                HidePageLoading();

            }

        }
    })

}
function GetReport() {

    FetchNext = GetNumberOfRecordsPerPage();
    $.ajax({
        url: "/Revenue/RevenueCustomEventViewDetails/GetRevenueCstDetails",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'customeventoverviewid': customeventoverviewid, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime, 'OffSet': OffSet, 'FetchNext': FetchNext, 'Channel': channel, 'CampaignId': campaignid, 'EventName': EventName, 'CampignType': campignType }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindReport,
        error: ShowAjaxError
    });
}


function BindReport(response) {

    if (response != undefined && response != null && response.length > 0) {
        /* $("#totalcountspan").text(response.length);*/
        //TotalRowCount = response.length;
        ShowExportDiv(true);
        ShowPagingDiv(true);
        CustomEventsReport = response;
        CurrentRowCount = response.length;
        PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);
        $("#ui_trbodyReportData").html('');
        $("#ui_tableReport").removeClass('no-data-records');
        $("#ui_trheadReportData").empty();
        let reportTableheaderstatic = `
                                            </th>
                                            <th class="td-wid-5 m-p-w-40" scope="col">UCP</th>
                                            <th class="helpIcon td-wid-20 m-p-w-20" scope="col">
                                            <div class="sortWrap">
                                            <i class="icon ion-arrow-down-c addColor"></i>
                                            </div>
                                            <div class="spacBet">
                                            <div>Event Date</div>
                                            <div class="th-iconWrp">
                                            <i class="icon ion-ios-help-outline"></i>
                                            <div class="toottipWrap">Date when the data was captured.
                                            </div>
                                            </div>
                                            </div>
                                            </th> `

        let reportTableheader = "";
        for (let i = 0; i < EventExtraFiledsName.length; i++) {
            reportTableheader += "<th class='helpIcon td-wid-15 m-p-w-40' scope='col'><div class='sortWrap'><i class='icon ion-arrow-down-c addColor'></i></div><div class='spacBet'><div>" + EventExtraFiledsName[i].FieldName + "</div><div class='th-iconWrp'></div></div></th >";
            if (i == 3)
                break;
        }
        var finaltable = reportTableheaderstatic + reportTableheader;

        $("#ui_trheadReportData").append("<tr>" + finaltable + "</tr>");
        $("#ui_trbodyReportData").empty();

        $.each(response, function (i) {
            BindRevenueEachReport(this, i);
        });

    }
    else {
        SetNoRecordContent('ui_tableReport', 6, 'ui_trbodyReportData');
        $("#totalcountspan").text(0);
        ShowExportDiv(false);
        ShowPagingDiv(false);
        HidePageLoading();
    }
    /* HidePageLoading();*/
    CheckAccessPermission("CustomEvents");
}
function BindRevenueEachReport(CustomEventsReport, index) {
    if (EventExtraFiledsName.length > 0) {
        var lengthofheader = 4;
        if (EventExtraFiledsName.length < 4)
            lengthofheader = EventExtraFiledsName.length;

        let tablerow = '';
        for (let i = 0; i < lengthofheader; i++) {
            tablerow += `<td>${CustomEventsReport["EventData" + (i + 1)] == null ? "NA" : CustomEventsReport["EventData" + (i + 1)]}</td>;`
        }
        var UCP = String.raw`cstShowContactUCP("${CustomEventsReport.MachineId}","",${CustomEventsReport.ContactId});`;
        let reportTable = `<tr id="tr_${CustomEventsReport.Id}">
                                <td class="frmresucp"><i class="fa fa-address-card-o" onclick=' ${UCP}'></i></td>
                                <td>
                                <div class="machidcopywrp">
                                <p class="pushmachidtxt">
                                ${$.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(CustomEventsReport.EventTime)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(CustomEventsReport.EventTime))}
                                </p>
                                <i class="icon ion-ios-information  viewcustdata"  onclick='BindIndividualEventDetails(${CustomEventsReport.ContactId},${CustomEventsReport.Id});'></i>
                                </div>
                                </td>
                                ${tablerow}
                                </tr>`;
        $("#ui_trbodyReportData").append(reportTable);
    }
    HidePageLoading();
}
function BindIndividualEventDetails(ContactId, cstId) {
    ShowPageLoading();
    $("#tr_" + cstId).closest("tr").addClass("activeBgRow");
    $("#txtsearch").val('')
    $("#ui_tblReportDataPopUp").empty();
    $(".popuptitlwrp h6").text("Event Details");
    FetchNext = GetNumberOfRecordsPerPage();
    $.ajax({
        url: "/Revenue/RevenueCustomEventViewDetails/GetEventsDetails",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'customeventoverviewid': customeventoverviewid, 'Id': cstId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {

            var fieldsContent = "";
            $(".popupsubtitle").html(response[0].EventName);
            $.each(response, function () {
                for (var a = 0; a < EventExtraFiledsName.length; a++) {
                    fieldsContent += "<tr><td>" + EventExtraFiledsName[a].FieldName + "</td> <td>" + ($(this)[0]["EventData" + (a + 1)] == null ? "NA" : $(this)[0]["EventData" + (a + 1)]) + "</td></tr>";
                }
            });

            $("#ui_tblReportDataPopUp").append(fieldsContent);
            $("#viewcustdatapop").removeClass("hideDiv");
            HidePageLoading();

        },
        error: ShowAjaxError
    });

}
$("#ui_GoBack").click(function () {
    ShowPageLoading();
    history.back()
    HidePageLoading();
});
$("#ui_exportOrDownload").click(function () {
    ExportFunctionName = "RevenueExportCstEvtDetailsReport";
    $("#ui_ddl_ExportDataRange").attr("disabled", false);
});