var markerLocation = [];

$(document).ready(function () {
    ExportFunctionName = "WebCityExport";
    GetUTCDateTimeRange(2);
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
    $.ajax({
        url: "/Analytics/Audience/GetCityMaxCount",
        type: 'Post',
        data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'fromdate': FromDateTime, 'todate': ToDateTime, 'duration': duration }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            TotalRowCount = 0;
            if (response !== undefined && response !== null && response.Table1 !== undefined && response.Table1 !== null && response.Table1.length > 0) {
                $.each(response.Table1, function () {
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
                SetNoRecordContent('ui_tableReport', 4, 'ui_tbodyReportData');
                ShowExportDiv(false);
                ShowPagingDiv(false);
                HidePageLoading();
            }
        },
        error: ShowAjaxError
    });
}

function GetReport() {
    FetchNext = GetNumberOfRecordsPerPage();
    $.ajax({
        url: "/Analytics/Audience/GetCities",
        type: 'Post',
        data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'fromdate': FromDateTime, 'todate': ToDateTime, 'start': OffSet, 'end': FetchNext, 'duration': duration }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindReport,
        error: ShowAjaxError
    });
}

function BindReport(response) {
    SetNoRecordContent('ui_tableReport', 4, 'ui_tbodyReportData');
    if (response !== undefined && response !== null && response.CityData.Table1 !== undefined && response.CityData.Table1 !== null && response.CityData.Table1.length > 0) {
        CurrentRowCount = response.CityData.Table1.length;
        PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);
        var reportTableTrs, UniqueVisitorLink = ""; CityName = "";
        $.each(response.CityData.Table1, function () {
            if (this.City.toLowerCase() == 'unknown')
                CityName = "<td class='text-left'><i class='unknown-flag'></i>" + this.City + "</td>";
            else
                CityName = "<td class='text-left'><i class='flag flag-" + this.Flag.toLowerCase() + "'></i>" + this.City + "</td>";

            if (duration == 1) {
                //**** For Output Cache DateTime *******
                ToDateTime = response.CurrentUTCDateTimeForOutputCache;
                //**** For Output Cache DateTime *******
                UniqueVisitorLink = "<td>" + (this.UniqueVisits != "0" ? "<a href='/Analytics/Uniques/UniqueVisits?dur=" + duration + "&Frm=" + FromDateTime + "&To=" + ToDateTime + "&City=" + (this.City !== "" ? encodeURIComponent(this.City.replace("'", "^")) : "UNKNOWN") + "'>" + this.UniqueVisits + "</a>" : this.UniqueVisits) + "</td> ";

            }
            else {
                //if (duration == 5)
                //  FromDateTime =;
                UniqueVisitorLink = "<td class='tdiconwrap'><i class='icon ion-ios-information uniqueicon' onclick='LoadCachedUniqueVisits(\"City\",\"" + this.City + "\",\"" + FromDateTime + "\",\"" + ToDateTime + "\");'></i>" + (this.UniqueVisits != "0" ? "<a href='/Analytics/Uniques/UniqueVisits?dur=" + duration + "&Frm=" + FromDateTime + "&To=" + ToDateTime + "&City=" + (this.City !== "" ? encodeURIComponent(this.City.replace("'", "^")) : "UNKNOWN") + "'>" + this.UniqueVisits + "</a>" : this.UniqueVisits) + "</td> ";

            }
            reportTableTrs += "<tr>" +
                "" + CityName + "" +
                "<td>" + this.Session + "</td>" +
                //"<td>" + (this.UniqueVisits != "0" ? "<a href='/Analytics/Uniques/UniqueVisits?dur=0&Frm=" + FromDateTime + "&To=" + ToDateTime + "&City=" + (this.City !== "" ? encodeURIComponent(this.City.replace("'", "^")) : "UNKNOWN") + "'>" + this.UniqueVisits + "</a> <i class='icon ion-ios-information infocampresponse' onclick='LoadCachedUniqueVisits(\"City\",\"" + this.City + "\",\"" + FromDateTime + "\",\"" + ToDateTime + "\");'></i>" : this.UniqueVisits) + "</td> " +
                "" + UniqueVisitorLink + " " +
                "<td>" + this.TotalVisits + "</td> " +
                "</tr>";
        });
        ShowExportDiv(true);
        ShowPagingDiv(true);
        $("#ui_tableReport").removeClass('no-data-records');
        $("#ui_tbodyReportData").html(reportTableTrs);
    }
    else {
        ShowExportDiv(false);
        ShowPagingDiv(false);
    }
    HidePageLoading();
}

function GetMapData() {
    $.ajax({
        url: "/Analytics/Audience/GetCityMapData",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'fromdate': FromDateTime, 'todate': ToDateTime, 'duration': duration }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            markerLocation.length = 0;
            if (response !== undefined && response !== null && response.Table1 !== undefined && response.Table1 !== null && response.Table1.length > 0) {
                $.each(response.Table1, function () {
                    markerLocation.push({ Lat: this.Latitude, Lng: this.Longitude, City: this.City, PageViews: this.TotalVisits });
                });
                BindMap();
            }
        },
        error: ShowAjaxError
    });
}

function BindMap() {
    $('#mapid').empty();

    var container = L.DomUtil.get('mapid'); if (container !== null) { container._leaflet_id = null; }
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
}