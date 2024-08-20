
var KeyforCount = null, KeyforReport = null, ActionName = null, Parameter = null, Type = null;
var ExportFunction = null, SqlActionforCount = null, SqlActionforReport = null;

var deviceName = $.urlParam("Name").toString().replace(/%20/g, " ");
var device = $.urlParam("Device").toString().replace(/%20/g, " ");
var events = $.urlParam("Events").toString().replace(/%20/g, " ");
var frequency = $.urlParam("Frequency").toString().replace(/%20/g, " ");
var os = $.urlParam("OS").toString().replace(/%20/g, " ");
var recency = $.urlParam("Recency").toString().replace(/%20/g, " ");
var time = $.urlParam("Time").toString().replace(/%20/g, " ");
var country = decodeURIComponent($.urlParam("Country").toString().replace(/%20/g, " "));
var city = decodeURIComponent($.urlParam("City").toString().replace(/%20/g, " "));
var type = $.urlParam("Type").toString().replace(/%20/g, " ");
var carrier = $.urlParam("Carrier").toString().replace(/%20/g, " ");
var resolution = $.urlParam("Resolution").toString().replace(/%20/g, " ");
var geofence = $.urlParam("Geofence").toString().replace(/%20/g, " ");
var beacon = $.urlParam("Beacon").toString().replace(/%20/g, " ");
var channel = $.urlParam("Channel").toString();
var page = $.urlParam("PageName").toString().replace(/%20/g, " ").replace('$', '?').replace(/~/g, '&').replace('^', '#');



$(document).ready(function () {
    GetPageType();
    ExportFunctionName = ExportFunction;
});

function CallBackFunction() {
    ShowPageLoading();
    TotalRowCount = 0;
    CurrentRowCount = 0;
    MaxCount();
}

function CallBackPaging() {
    CurrentRowCount = 0;
    GetReport();
}

function MaxCount() {
    $.ajax({
        url: "/MobileAnalytics/MobileApp/UniqueVisitsReportMaxCount",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'duration': duration, 'fromdate': FromDateTime, 'todate': ToDateTime, 'start': OffSet, 'end': FetchNext, 'type': Type, 'parameter': Parameter, 'action': SqlActionforCount }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            TotalRowCount = 0;
            if (response != undefined && response != null && response.Table != undefined && response.Table != null && response.Table.length > 0) {
                $.each(response.Table, function () {
                    TotalRowCount = this.TotalRows;
                });
            }

            if (TotalRowCount > 0) {
                GetReport();
            }
            else {
                SetNoRecordContent('ui_tblReportData', 5, 'ui_tbodyReportData');
                HidePageLoading();
            }
        },
        error: ShowAjaxError
    });
}

function GetReport() {
    FetchNext = GetNumberOfRecordsPerPage();

    $.ajax({
        url: "/MobileAnalytics/MobileApp/UniqueVisitsReport",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'duration': duration, 'fromdate': FromDateTime, 'todate': ToDateTime, 'start': OffSet, 'end': FetchNext, 'type': Type, 'parameter': Parameter, 'action': SqlActionforReport }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindReport,
        error: ShowAjaxError
    });

}


function BindReport(response) {
    SetNoRecordContent('ui_tblReportData', 6, 'ui_tbodyReportData');
    if (response != undefined && response != null && response.Table != undefined && response.Table != null && response.Table.length > 0) {

        CurrentRowCount = response.Table.length;
        PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);


        var reportTableTrs;
        $.each(response.Table, function () {

            reportTableTrs += "<tr>" +
                "<td><div class='nameWrap'><div class='nameAlpWrap'><span class='nameAlpha' onclick='ShowContactUCP(null,\"" + this.DeviceId + "\",null)'>V</span></div><div class='nameTxtWrap'><span class='nameTxt'>" + this.Visitor + "</td>" +
                "<td>" + this.City + "</td>" +
                "<td>" + this.Session + "</td>" +
                "<td>" + $.datepicker.formatDate("M dd yy", ConvertUTCDateTimeToLocal(this.Recency)) + " " + PlumbTimeFormat(ConvertUTCDateTimeToLocal(this.Recency)) + "</td>" +
                "<td>" + fn_AverageTime(this.AvgTime) + "</td>" +
                "</tr>";
        });

        $("#ui_tblReportData").removeClass('no-data-records');
        $("#ui_tbodyReportData").html(reportTableTrs);
        ShowPagingDiv(true);
        ShowExportDiv(true);
    }
    else {
        ShowExportDiv(false);
        ShowPagingDiv(false);
    }
    HidePageLoading();
}


function GetPageType() {
    ExportFunction = 'UniqueVisitsReportExport';
    if (country != 0) {
        $(".title").html("Unique Visitors - " + (country.length > 40 ? "<span title='" + country + "'>" + country.replace("^", "'").substring(0, 30) + "..</span>" : country.replace("^", "'")));

        Parameter = country.replace("unknown", "");       
        SqlActionforCount = 'CountryCount';
        SqlActionforReport = 'Country';
    }
    else if (city != 0) {

        $(".title").html("Unique Visitors - " + (city.length > 40 ? "<span title='" + city + "'>" + city.replace("^", "'").substring(0, 30) + "..</span>" : city.replace("^", "'")));

        Parameter = city.replace("unknown", " ");
        SqlActionforCount = 'CityCount';
        SqlActionforReport = 'City';

    }
    else if (carrier != 0) {
        $(".title").html("Unique Visitors - Carrier(" + (carrier.length > 22 ? "<span title='" + carrier + "'>" + carrier.substring(0, 22) + "..</span>" : carrier) + ")");

        Type = carrier.replace("unknown", " ");
        Parameter = Type;
        SqlActionforCount = 'CarrierCount';
        SqlActionforReport = 'Carrier';

    }
    else if (resolution != 0) {
        $(".title").html("Unique Visitors - Screen Resolution(" + (resolution.length > 22 ? "<span title='" + resolution + "'>" + resolution.substring(0, 22) + "..</span>" : resolution) + ")");
        Type = resolution;
        Parameter = Type;
        SqlActionforCount = 'ResolutionCount';
        SqlActionforReport = 'Resolution';
    }
    else if (events != 0) {
        $(".title").html("Unique Visitors - Events(" + (events.length > 22 ? "<span title='" + events + "'>" + events.substring(0, 22) + "..</span>" : events) + ")");
        Type = events.trim();
        Parameter = Type;
        SqlActionforCount = 'EventsCount';
        SqlActionforReport = 'Events';
    }
    else if (frequency != 0) {
        $(".title").html("Unique Visitors - Frequency(" + frequency + ")");
        Type = frequency;
        Parameter = Type;
        SqlActionforCount = 'FrequencyCount';
        SqlActionforReport = 'Frequency';
    }
    else if (os != 0) {
        $(".title").html("Unique Visitors - OS(" + (os.length > 22 ? "<span title='" + os + "'>" + os.substring(0, 22) + "..</span>" : os) + ")");
        Type = os.trim();
        Parameter = Type;
        SqlActionforCount = 'OSCount';
        SqlActionforReport = 'OS';
    }
    else if (recency != 0) {
        $(".title").html("Unique Visitors - Recency(" + (recency == -1 ? "Today" : (recency == 1 ? "1 day" : recency + " days")) + ")");
        Type = recency;
        Parameter = Type;
        SqlActionforCount = 'RecencyCount';
        SqlActionforReport = 'Recency';
    }
    else if (time != 0) {
        $(".title").html("Unique Visitors - Time Spend(" + time + ")");
        Type = time.replace("Secs", "").replace("secs", "").trim();
        Parameter = Type;
        SqlActionforCount = 'TimeCount';
        SqlActionforReport = 'Time';
    }
    else if (device != 0) {
        $(".title").html("Unique Visitors - Device(" + (deviceName.length > 22 ? "<span title='" + deviceName + "'>" + deviceName.substring(0, 22) + "..</span>" : deviceName) + ")");

        Type = device.trim();
        Parameter = deviceName;
        SqlActionforCount = 'DeviceNameCount';
        SqlActionforReport = 'DeviceName';
    }
    else if (page != 0) {
        $(".title").html("Unique Visitors - Page(" + (page.length > 22 ? "<span title='" + page + "'>" + page.substring(0, 22) + "..</span>" : page) + ")");
        Type = page.trim();
        Parameter = Type;
        SqlActionforCount = 'PageNameCount';
        SqlActionforReport = 'PageName';
    }
    else {
        Type = null;
        Parameter = null;
        ExportFunction = 'UniqueVisitsReportExport';
        SqlActionforCount = 'OthersCount';
        SqlActionforReport = 'Others';
    }


    $(".title").css("text-transform", "capitalize");
    FromDateTime = $.urlParam("Frm").toString().replace(/%20/g, " ");
    ToDateTime = $.urlParam("To").toString().replace(/%20/g, " ");
    MaxCount();
}

$("#ui_GoBack").click(function () {
    window.location = document.referrer;
});