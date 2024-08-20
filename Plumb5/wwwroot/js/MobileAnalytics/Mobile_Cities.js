
var markerLocation = [], container;

$(document).ready(function () {
    GetUTCDateTimeRange(2);
    ExportFunctionName = "AppCitiesExport";
});

function CallBackFunction() {
    ShowPageLoading();
    TotalRowCount = 0;
    CurrentRowCount = 0;
    MaxCount();
}

function CallBackPaging() {
    ShowPageLoading();
    CurrentRowCount = 0;
    GetReport();
}


function MaxCount() {
    document.getElementById('mapid').innerHTML = "";
    $.ajax({
        url: "/MobileAnalytics/MobileApp/GetCitiesCount",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'duration': duration, 'fromdate': FromDateTime, 'todate': ToDateTime }),
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
                GetMapData();
            }
            else {
                markerLocation.length = 0;
                BindMap();
                SetNoRecordContent('ui_tblReportData', 4, 'ui_tbodyReportData');
                HidePageLoading();
            }
        },
        error: ShowAjaxError
    });
}

function GetReport() {
    FetchNext = GetNumberOfRecordsPerPage();
    $.ajax({
        url: "/MobileAnalytics/MobileApp/GetCities",
        type: 'Post',
        data: "{'accountId':'" + Plumb5AccountId + "','duration':'" + duration + "','fromdate':'" + FromDateTime + "','todate':'" + ToDateTime + "','start':'" + OffSet + "','end':'" + FetchNext + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindReport,
        error: ShowAjaxError
    });
}



function BindReport(response) {
    SetNoRecordContent('ui_tblReportData', 4, 'ui_tbodyReportData');

    if (response != undefined && response != null && response.Table != undefined && response.Table != null && response.Table.length > 0) {
        CurrentRowCount = response.Table.length;
        PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);

        var reportTableTrs = "";

        $.each(response.Table, function () {
            markerLocation.push({ Lat: this.Latitude, Lng: this.Longitude, City: this.City, PageViews: this.PageViews });
            reportTableTrs += "<tr>" +
                "<td class='text-left'><i class='flag flag-" + (this.Flag != "" && this.Flag != null ? this.Flag.trim() : "Unknown").toLowerCase() + "'></i>" + this.City + "</td>" +
                "<td>" + this.Session + "</td>" +
                "<td>" + (this.UniqueVisits != "0" ? "<a class='ViewPermission' href='/MobileAnalytics/MobileApp/UniqueVisits?dur=0&Frm=" + FromDateTime + "&To=" + ToDateTime + "&City=" + (this.City != "" && this.City != undefined && this.City != null ? encodeURIComponent(this.City.replace("'", "^")) : "unknown") + "'>" + this.UniqueVisits + "</a>" : this.UniqueVisits) + "</td>" +
                "<td>" + this.PageViews + "</td>" +
                "</tr>";
        });

        $("#ui_tblReportData").removeClass('no-data-records');
        $("#ui_tbodyReportData").html(reportTableTrs);
        ShowExportDiv(true);
    } else {
        ShowExportDiv(false);
        ShowPagingDiv(false);
    }
    HidePageLoading();
}

function GetMapData() {
    $.ajax({
        url: "/MobileAnalytics/MobileApp/GetCityMapData",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'duration': duration, 'fromdate': FromDateTime, 'todate': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            markerLocation.length = 0;
            if (response !== undefined && response !== null && response.Table !== undefined && response.Table !== null && response.Table.length > 0) {
                $.each(response.Table, function () {
                    markerLocation.push({ Lat: this.Latitude, Lng: this.Longitude, City: this.City, PageViews: this.PageViews });
                });
                BindMap();
            } else {
                BindMap();
            }
        },
        error: ShowAjaxError
    });
}

function BindMap() {

    container = L.DomUtil.get('mapid'); if (container != null) { container._leaflet_id = null; }

    //create map object and set default positions and zoom level
    var map = new L.map('mapid', {
        center: [0, 0],
        zoom: 2

    });

    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', { attribution: '<a target="_blank" href="https://www.plumb5.com">Plumb5</a>' }).addTo(map);
    var Icon = L.icon({
        iconUrl: '/images/marker.png',
        iconSize: [20, 20], // size of the icon
        iconAnchor: [10, 20], // point of the icon which will correspond to marker's location
        popupAnchor: [0, -10] // point from which the popup should open relative to the iconAnchor
    });

    for (var i = 0; i < markerLocation.length; i++) {
        L.marker([markerLocation[i].Lat, markerLocation[i].Lng], { icon: Icon }).bindPopup("<b><center>" + markerLocation[i].City + "</b></center><br><center>Page Views:" + markerLocation[i].PageViews + "</center>").addTo(map);

    }
};