var markerLocation = [];
var geoJSON;

$(document).ready(function () {
    ExportFunctionName = "WebCountryExport";
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
        url: "/Analytics/Dashboard/CountryReportMaxCount",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'duration': duration, 'fromdate': FromDateTime, 'todate': ToDateTime }),
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
                SetNoRecordContent('ui_tblReportData', 4, 'ui_tbodyReportData');
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
        url: "/Analytics/Dashboard/CountryReport",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'duration': duration, 'fromdate': FromDateTime, 'todate': ToDateTime, 'start': OffSet, 'end': FetchNext }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindReport,
        error: ShowAjaxError
    });
}

function BindReport(response) {
    SetNoRecordContent('ui_tblReportData', 4, 'ui_tbodyReportData');
    if (response !== undefined && response !== null && response.CountryData.Table1 !== undefined && response.CountryData.Table1 !== null && response.CountryData.Table1.length > 0) {
        CurrentRowCount = response.CountryData.Table1.length;
        PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);
        var reportTableTrs, UniqueVisitorLink = ""; CountryName = "";
        $.each(response.CountryData.Table1, function () {
            if (this.Country.toLowerCase() == 'unknown' || this.Country=='')
                CountryName = "<td class='text-left'><i class='unknown-flag'></i>unknown</td>";
            else
                CountryName = "<td class='text-left'><i class='flag flag-" + this.Flag.toLowerCase() + "'></i>" + this.Country + "</td>";

            if (duration == 1) {
                //**** For Output Cache DateTime *******
                ToDateTime = response.CurrentUTCDateTimeForOutputCache;
                //**** For Output Cache DateTime *******
                UniqueVisitorLink = "<td>" + (this.UniqueVisits != "0" ? "<a href='/Analytics/Uniques/UniqueVisits?dur=" + duration + "&Frm=" + FromDateTime + "&To=" + ToDateTime + "&Country=" + (this.Country !== "" ? encodeURIComponent(this.Country.replace("'", "^")) : "UNKNOWN") + "'>" + this.UniqueVisits + "</a>" : this.UniqueVisits) + "</td>";

            }
            else
                UniqueVisitorLink = "<td class='tdiconwrap'><i class='icon ion-ios-information uniqueicon' onclick='LoadCachedUniqueVisits(\"Country\",\"" + this.Country + "\",\"" + FromDateTime + "\",\"" + ToDateTime + "\");'></i>" + (this.UniqueVisits != "0" ? "<a href='/Analytics/Uniques/UniqueVisits?dur=" + duration + "&Frm=" + FromDateTime + "&To=" + ToDateTime + "&Country=" + (this.Country !== "" ? encodeURIComponent(this.Country.replace("'", "^")) : "UNKNOWN") + "'>" + this.UniqueVisits + "</a>" : this.UniqueVisits) + "</td>";
            reportTableTrs += "<tr>" +
                "" + CountryName + "" +
                "<td>" + this.Session + "</td>" +
                //"<td class='tdiconwrap' data-value=" + this.Country + ">" + (this.UniqueVisits != "0" ? "<a href='/Analytics/Uniques/UniqueVisits?dur=0&Frm=" + FromDateTime + "&To=" + ToDateTime + "&Country=" + (this.Country !== "" ? encodeURIComponent(this.Country.replace("'", "^")) : "UNKNOWN") + "'>" + this.UniqueVisits + "</a><i class='icon ion-ios-information infocampresponse' onclick='LoadCachedUniqueVisits(\"Country\",\"" + this.Country + "\",\"" + FromDateTime + "\",\"" + ToDateTime + "\");'></i>" : this.UniqueVisits) + "</td> " +
                "" + UniqueVisitorLink + "" +
                "<td>" + this.TotalVisits + "</td> " +
                "</tr> ";
        });
        ShowExportDiv(true);
        ShowPagingDiv(true);
        $("#ui_tblReportData").removeClass('no-data-records');
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
        url: "/Analytics/Dashboard/CountryMapData",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'duration': duration, 'fromdate': FromDateTime, 'todate': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            markerLocation.length = 0;
            if (response !== undefined && response !== null && response.Table1 !== undefined && response.Table1 !== null && response.Table1.length > 0) {
                $.each(response.Table1, function () {
                    markerLocation.push({ Lat: this.Latitude, Lng: this.Longitude, Country: this.Country, PageViews: this.TotalVisits });
                });
                BindMap();
            } else {
                BindMap();
            }
        },
        error: ShowAjaxError
    });
}
////////////////////////////////MAP FUNCTIONS START///////////////////////////////////////////////////////////////////////////
var markerPageViewMax = 0;
var grades = [0, 10, 100, 500, 1000, 10000, 50000, 100000];
var colArr = ['#ffffcc', '#ffeda0', '#fed976', '#feb24c', '#fd8d3c', '#fc4e2a', '#e31a1c', '#b10026'];
var mapGeo, info;
async function BindMap() {
    $('#mapid').empty();
    if (markerLocation.length > 0) {
        markerLocation.sort(function (a, b) { return b.PageViews - a.PageViews; });
        markerPageViewMax = parseInt(markerLocation[0].PageViews);
    }
    var container = L.DomUtil.get('mapid'); if (container !== null) { container._leaflet_id = null; }
    var map = new L.map('mapid', {
        center: [39.399872, -8.224454],
        zoom: 1.5,
        attributionControl:false
    });
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '<a target="_blank" href="https://www.plumb5.com">Plumb5</a>'
    }).addTo(map);

    //LOAD geoJSON//////////////////
    let response = await fetch("../../js/analytics/countries_geo_min.js");
    geoJSON = await response.json();
    mapGeo = L.geoJson(geoJSON, {
        style: style,
        onEachFeature: onEachFeature
    }).addTo(map);
    //ADD Legend///////////////////////
    var legend = L.control({ position: 'bottomright' })
    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend')
        var labels = []
        // Add min & max
        div.innerHTML = '<div class="labels"><div class="min">' + grades[0] + '</div> \
			<div class="max">' + grades[grades.length - 1] + '</div></div>'
        grades.forEach(function (limit, index) {
            labels.push('<li style="background-color: ' + colArr[index] + '"></li>');
        })
        div.innerHTML += '<ul>' + labels.join('') + '</ul>';
        div.innerHTML += '<div class="labels"><div class="min">Page Views</div><div class="max">Page Views</div></div>';
        return div;
    }
    legend.addTo(map);
    //ADD Info///////////////////////////
    info = L.control();
    info.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'info');
        this.update();
        return this._div;
    };
    info.update = function (props) {
        this._div.innerHTML = (props ?
            '<b>' + props.name + '</b><br />' + props.pageviews + ' Page Views'
            : '<b class="text-dark">Hover over a Country</b>');
    };
    info.addTo(map);
}
function getColor(ftr) {
    let CountryName = ftr.properties.name;
    let d = -1;
    if (markerLocation.length > 0) {
        let tmpobj = null;
        try { tmpobj = markerLocation.find(t => t.Country.toLowerCase() == CountryName.toLowerCase()); }
        catch{ tmpobj = null; }
        if (tmpobj != null) {
            d = tmpobj.PageViews;
            ftr.properties.pageviews = tmpobj.PageViews;
        }
    }
    return d > grades[6] ? colArr[7] :
        d > grades[5] ? colArr[6] :
            d > grades[4] ? colArr[5] :
                d > grades[3] ? colArr[4] :
                    d > grades[2] ? colArr[3] :
                        d > grades[1] ? colArr[2] :
                            d > grades[0] ? colArr[1] :
                                colArr[0];
}
function style(feature) {
    return {
        fillColor: getColor(feature),
        weight: 1,
        opacity: 1,
        color: '#03477e',
        fillOpacity: 0.7
    };
}
function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 3,
        color: '#03477e',
        dashArray: '',
        fillOpacity: 1
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }

    info.update(layer.feature.properties);
}
function resetHighlight(e) {
    mapGeo.resetStyle(e.target);
    info.update();
}
function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
    });
}
////////////////////////////////MAP FUNCTIONS END///////////////////////////////////////////////////////////////////////////