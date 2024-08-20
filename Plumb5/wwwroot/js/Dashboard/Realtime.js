var Currvisitor = 0;
let newCntr = 0, rtnCntr = 0, webCntr = 0, mobiCntr = 0;
var markerIcon = ""; worldData = [], MarkersScale = {}, MarkersValue = [];
var refresh = 10000;
var LiveVisitorCount = 0;

$(document).ready(function () {
    markerIcon = '<svg width="40" height="40" viewbox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">' +
                    '<circle cx="20" cy="20" fill="none" r="10" stroke="#EF5839" stroke-width="2">' +
                        '<animate attributeName="r" from="8" to="20" dur="1.0s" begin="0s" repeatCount="indefinite"/>' +
                        '<animate attributeName="opacity" from="1" to="0" dur="1.0s" begin="0s" repeatCount="indefinite"/>' +
                    '</circle>' +
                    '<circle cx="20" cy="20" fill="pointColor" stroke="#EF5839" stroke-width="1" r="6"/>' +
                '</svg>';

    GetReport();
    setInterval(function () { GetReport(); }, refresh - 2);
});

function GetReport() {
    newCntr = 0, rtnCntr = 0, webCntr = 0, mobiCntr = 0;
    if (_CallApi.length > 0) {
        var settings = {
            "url": _CallApi+"="+Plumb5AccountId,
            "method": "GET",
            "timeout": 0,
        };

        $.ajax(settings).done(function (response) {
            
            BindReport(response);
            error: ShowAjaxError
        });
    }
    else {
        $.ajax({
            url: "/Dashboard/Realtime/GetRealTimeDashboard",
            type: 'Post',
            data: JSON.stringify({ 'AdsId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: BindReport,
            error: ShowAjaxError
        });
    }

}

function BindReport(response) {
    LiveVisitorCount = 0;
    worldData = [];
    SetNoRecordContent('ui_tblReportData', 5, 'ui_tbodyReportData');
    if (response != undefined && response != null && response.length != 0 && response !="No records found") {
        var reportTableTrs;
        $.each(response, function () {

            //const cityExists = worldData.some(visitor => visitor.name = this.City);
            const cityExists = JSLINQ(worldData).Where(function () { return (this.name === this.City); });
            if (cityExists != null && cityExists.items.length == 0 && this.City != "Unknown") {
                worldData.push({ latLng: [this.Latitude, this.Longitude], name: this.City });
            }

            //Web vs Mobile calculatecount
            if (this.DeviceId > 0) { mobiCntr += 1; }
            else { webCntr += 1; }

            var newvisitor = "";
            var contact = this.Name != null ? this.Name : this.EmailId != null ? this.EmailId : this.PhoneNumber != null ? this.PhoneNumber : this.MachineId;
            if (this.RepeatOrNew != 'R') { newvisitor = '<sup class="newtext">New</sup>'; newCntr = newCntr + 1; }

            console.log(PlumbTimeFormat(GetJavaScriptDateObj(this.Date)));
            var seconds = (new Date().getTime() - GetJavaScriptDateObj(this.Date).getTime());
            if (seconds <= refresh) { LiveVisitorCount = LiveVisitorCount + 1 }
            console.log(seconds);

            reportTableTrs += '<tr>' +
                                '<td class="frmresucp"><i onclick="ShowContactUCP(\'' + this.MachineId + '\',\'\',0);" class="fa fa-address-card-o"></i></td>' +
                                '<td><a href="javascript:void(0)" class="textprilink">' + contact + '</a>' + newvisitor + '</td>' +
                                '<td class="text-color-blue">' + this.ReferType + '</td>' +
                                '<td class="text-color-blue">' + this.PageName + '</td>' +
                                '<td>' +
                                    '<div class="nametitWrap">' +
                                       ' <span class="groupNameTxt">' + this.City + '</span>' +
                                        '<span class="templatenametxt">' + this.Country + '</span>' +
                                    '</div>' +
                               ' </td>' +
                            '</tr>';
        }

        );


        Currvisitor = response.length;
        rtnCntr = Currvisitor - newCntr;

        //Bind active visitor
        $("#spnActiveUser").html(Currvisitor);

        //new vs returning Progress bar
        let newper = Math.round(newCntr * 100 / Currvisitor) + '%';
        let rtnper = Math.round(rtnCntr * 100 / Currvisitor) + '%';
        document.getElementById("txtNew").innerHTML = "New&nbsp;(" + newCntr + ")";
        document.getElementById("txtRet").innerHTML = "Returning&nbsp;(" + rtnCntr + ")";
        document.getElementById("dvnew").style.width = newper;
        document.getElementById("dvret").style.width = rtnper;

        //Web vs Mobile Progress bar
        let webper = Math.round(webCntr * 100 / Currvisitor) + '%';
        let mobper = Math.round(mobiCntr * 100 / Currvisitor) + '%';
        document.getElementById("txtweb").innerHTML = "Web&nbsp;(" + webCntr + ")";
        document.getElementById("txtmob").innerHTML = "Mobile&nbsp;(" + mobiCntr + ")";
        document.getElementById("dvweb").style.width = webper;
        document.getElementById("dvmob").style.width = mobper;

        //Map Plotting

        //$("#world-map").html("");
        GetWorldData();

        $("#ui_tblReportData").removeClass('no-data-records');
        $("#ui_tbodyReportData").html(reportTableTrs);
    } else {
        $("#spnActiveUser").html(0);
        $("#world-map").html("");
        GetWorldData();
    }
    HidePageLoading();
}

RenderRealtimeBarChart();

function GetWorldData() {

    // MarkersScale = {};
    // MarkersValue = [];

    for (var k = 0; k < worldData.length; k++) {
        MarkersScale[k] = imgFromSVG(markerIcon, '#ffe100');
        MarkersValue.push("" + k + "");
    }

    RenderMap('#world-map');

}

function RenderMap(mapelement) {

    if ($(mapelement).children().length == 0) {
        $(mapelement).vectorMap(
            {
                map: 'world_mill',
                backgroundColor: '#FFFFFF',
                enableZoom: true,
                showTooltip: true,
                regionStyle: { initial: { fill: '#195790' }, hover: { fill: '#5B93D3' } },
                markerStyle: { initial: { fill: '#F8E23B', stroke: '#383f47' } },
                markers: worldData,
                series: {
                    markers: [{
                        attribute: 'image',
                        scale: MarkersScale,
                        values: MarkersValue,
                    }]
                }
            });
    } else {
        let jVecMap = $(mapelement).vectorMap('get', 'mapObject');
        jVecMap.removeAllMarkers();
        jVecMap.addMarkers(worldData, []);
        jVecMap.series.markers[0].setValues(MarkersValue);
        jVecMap.series.markers[0].setScale = MarkersScale;

    }

};

function imgFromSVG(svg, pointColor) {
    var newSVG = svg.replace(/pointColor/gi, pointColor);
    return 'data:image/svg+xml;charset=UTF-8,' + escape(newSVG);
}

function RenderRealtimeBarChart() {
    var color = Chart.helpers.color;
    var config = {
        type: 'line',
        responsive: true,

        data: {
            labels: [],
            datasets: [{
                label: 'Live Visitors',
                backgroundColor: color('rgb(54, 162, 235)').alpha(0.5).rgbString(),
                borderColor: 'rgb(54, 162, 235)',
                borderWidth: 0.5,
                data: []
            }]
        },

        options: {
            maintainAspectRatio: false,
            title: {
                display: false,
            },
            legend: {
                display: false,
            },
            scales: {
                xAxes: [{
                    type: 'realtime',
                    barPercentage: 1.0,
                    categoryPercentage: 1.0,
                    realtime: {
                        duration: 30000,
                        refresh: refresh,
                        delay: refresh,
                        onRefresh: onRefresh
                    },
                    gridLines: {
                        display: false
                    },
                    ticks: {
                        display: false
                    }
                }],
                yAxes: [{
                    gridLines: {
                        display: false,
                        drawBorder: false,
                    },
                    scaleLabel: {
                        display: false,
                        labelString: 'value'
                    },
                    ticks: {
                        display: false
                    }
                }]
            },
            tooltips: {
                mode: 'nearest',
                intersect: false
            },
            hover: {
                mode: 'nearest',
                intersect: false
            }
        }
    };
    var ctx = document.getElementById('realtimevisitor').getContext('2d');
    window.myChart = new Chart(ctx, config);
};

function onRefresh(chart) {
    chart.config.data.datasets.forEach(function (dataset) {
        dataset.data.push({
            x: Date.now(),
            y: LiveVisitorCount,
        });
    });
}

function randomScalingFactor() {
    let min = Math.ceil(0);
    let max = Math.floor(1000);
    return Math.floor(Math.random() * (max - min)) + min;
    // return (Math.random() > 0.5 ? 1.0 : -1.0) * Math.round(Math.random() * 100);
}