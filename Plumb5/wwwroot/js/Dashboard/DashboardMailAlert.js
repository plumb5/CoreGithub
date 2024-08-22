var grid, LoadingImageCount = 0, NumberOfWidgetsLoaded = 0, TotalWidget = 0, k = 0;
var JsonData = {};
var batchwisearr = [];
var UncheckedWidgets = [];
JsonData.dashwidgets = new Array();
var lateLoadd3chartsArr = new Array();
var DashboardId = 0;

Chart.defaults.global.defaultFontSize = 10;
Chart.defaults.global.legend.labels.boxWidth = 10;
Chart.defaults.global.animation.duration = 0;

var monthDetials = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

var TimeZoneData = ["Asia/Kolkata", -330];

function AddLateLoad(graphName, container_id) {
    lateLoadd3chartsArr = [];
    lateLoadd3chartsArr.push([graphName, container_id]);

}

function resizeGrid() {
    var width = document.body.clientWidth;
    if (width < 700) {
        grid.column(1);

    } else if (width < 850) {
        grid.column(3);

    } else if (width < 950) {
        grid.column(6);

    } else if (width < 1100) {
        grid.column(8);

    } else {
        grid.column(12);

    }
}

function responsivefyv4(svg) {
    // Container is the DOM element, svg is appended.
    // Then we measure the container and find its
    // aspect ratio.

    const container = d3version4.select(svg.node().parentNode),
        width = parseInt(container.style('width'), 10),
        height = parseInt(container.style('height'), 10),
        aspect = width / height;

    // Add viewBox attribute to set the value to initial size
    // add preserveAspectRatio attribute to specify how to scale
    // and call resize so that svg resizes on page load
    svg.attr('viewBox', `0 0 ${width} ${height}`).
        attr('preserveAspectRatio', 'xMinYMin meet').
        call(resize);


    function resize() {
        const targetWidth = parseInt(container.style('width'));
        svg.attr('width', targetWidth);
        svg.attr('height', targetWidth / aspect);

    }
}

function responsivefyv3(svg) {
    // Container is the DOM element, svg is appended.
    // Then we measure the container and find its
    // aspect ratio.

    const container = d3version3.select(svg.node().parentNode),
        width = parseInt(container.style('width'), 10),
        height = parseInt(container.style('height'), 10),
        aspect = width / height;

    // Add viewBox attribute to set the value to initial size
    // add preserveAspectRatio attribute to specify how to scale
    // and call resize so that svg resizes on page load
    svg.attr('viewBox', `0 0 ${width} ${height}`).
        attr('preserveAspectRatio', 'xMinYMin meet').
        call(resize);


    function resize() {
        const targetWidth = parseInt(container.style('width'));
        svg.attr('width', targetWidth);
        svg.attr('height', targetWidth / aspect);

    }
}
//After Changing the grid postition Save Json Data to Dashboard Table
function GetGridJSON() {
    var jsonObj = {};
    jsonObj.dashwidgets = new Array();
    grid.engine.nodes.forEach(function (node, i) {
        var Position = JsonData.dashwidgets.findIndex(obj => obj.title == node.id);
        jsonObj.dashwidgets.push({
            title: node.id,
            "checkboxid": JsonData.dashwidgets[Position].checkboxid,
            width: node.width,
            height: node.height,
            x: node.x,
            y: node.y,
            autoPosition: false,
            containerhtml: findJsonValue(JsonData, node.id)
        });
    });
    var jsonString = JSON.stringify(jsonObj);
    SaveJsonData(jsonString);
}

function findJsonValue(jsonarray, key) {
    let retval = ""
    for (var i = 0; i < jsonarray.dashwidgets.length; i++) {
        // look for the entry with a matching `code` value
        if (jsonarray.dashwidgets[i].title == key) {
            retval = jsonarray.dashwidgets[i].containerhtml;
            break;
        }
    }

    return retval;
}

///top menu Grid resizable////////////////////////////////////////////
$(".gridsave").click(function () {
    $(this).addClass("hideDiv");
    $(this).siblings().not(".saveIcnbtn").addClass("disabled");
    $(".dropdown .ion-ios-calendar-outline").addClass("disabled");
    $(this).next().removeClass("hideDiv");
    grid.movable('.grid-stack-item', true);
    grid.resizable('.grid-stack-item', true);
});

$(".saveIcnbtn").click(function () {
    $(this).addClass("hideDiv");
    $(this).siblings().not(".gridsave").removeClass("disabled");
    $(".dropdown .ion-ios-calendar-outline").removeClass("disabled");
    $(this).prev().removeClass("hideDiv");
    grid.movable('.grid-stack-item', false);
    grid.resizable('.grid-stack-item', false);
    ///write to DB
    GetGridJSON();

});

/////////////////////initialize GridStack///////////////////////
window.addEventListener('resize', function () { resizeGrid() });
grid = GridStack.init({
    disableOneColumnMode: true, // will manually do 1 column
    float: true,
    animate: true,
    disableDrag: true,
    disableResize: true
});

resizeGrid();

grid.on('added', function (e, items) {

    //for (var i = 0; i < lateLoadd3chartsArr.length; i++) {
    if (lateLoadd3chartsArr.length > 0) {
        switch (lateLoadd3chartsArr[0][0]) {
            case "emaileffective":
                {
                    CreateMailEffectivenessBubble(lateLoadd3chartsArr[0][1]);
                    break;
                }
            case "smseffective":
                {
                    CreateSMSEffectivenessBubble(lateLoadd3chartsArr[0][1]);
                    break;
                }
            case "wordcloud":
                {
                    createWordCloud(lateLoadd3chartsArr[i][1]);
                    break;
                }
        }
    }
    //}
});

grid.on('gsresizestop', function (event, element) {

    var chartnode = element.children[0].children[1].id;
    switch (chartnode) {
        case "dvMailCampaignEffectiveness":
            {
                CreateMailEffectivenessBubble(chartnode);
                break;
            }
        case "dvSmsCampaignEffectiveness":
            {
                CreateSMSEffectivenessBubble(chartnode);
                break;
            }
        case "dv_wordcloud":
            {
                createWordCloud("dv_wordcloud");
                break;
            }

    }

});

var Plumb5AccountId, DashboardId, duration, Guid;
$(document).ready(function () {
    Guid = urlParamNew("Guid");
    $("#spnDuration").html($.urlParam("Duration").charAt(0).toUpperCase() + $.urlParam("Duration").slice(1));

    $("#hpLinkAccount").html($.urlParam("Domain"));
    $("#hpLinkAccount").attr("href", $.urlParam("Domain").toLowerCase().indexOf("http:/") > -1 ? $.urlParam("Domain") : "http://" + $.urlParam("Domain"));

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    var pdfdate=dd + ' ' + monthDetials[mm - 1] + ',' + yyyy + ' ' + today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
    $("#spnDate").html(pdfdate);

    FromDateTime = $.urlParam("FromDate").replace(/%20/g, " ");//"2020-10-31 18:30:00";
    ToDateTime = $.urlParam("ToDate").replace(/%20/g, " "); //"2020-11-19 18:29:59";   
    duration = 5;

    CallBackFunction();
});

//$(document).ready(function () {
//    GetUTCDateTimeRange(2);
//});

function urlParamNew(name) {
    name = name;
    var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href.toString());
    if (!results) {
        return 0;
    }
    return results[1] || 0;
}

function CallBackFunction() {
    TotalWidget = 0; JsonData = {}; batchwisearr = []; //Clearing batch array
    NumberOfWidgetsLoaded = 0; LoadingImageCount = 0; lateLoadd3chartsArr = [];
    ShowPageLoading();
    GetReport();
}

//Get existing Widgets from DB
function GetReport() {

    $.ajax({
        url: "/Dashboard/DashboardMailAlert/GetJsonContent",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'DashboardId': DashboardId, 'Guid': Guid }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindJsonData,
        error: ShowAjaxError
    });

    //for (i = 0; i < cars.length; i++) {
    //}
}

//Bind Dashboard Widgets
function BindJsonData(response) {
    var myObj = {};
    myObj = JSON.parse(response);

    Plumb5AccountId = parseInt(myObj.AdsId);;
    DashboardId = parseInt(myObj.DashId);;

    if (myObj.Data.Table1.length > 0) {
        $('.gridsave,.showingWrap').show();
        $('.nodatadashwrp').addClass('hideDiv');



        JsonData = JSON.parse(myObj.Data.Table1[0].JsonContent);
        grid.removeAll();
        grid.batchUpdate();
        //Fetching Batchwise Json Data *********************************
        //batchwisearr.push(JsonData.dashwidgets.slice(0, 4));
        LoadBatchWiseWidgets();

        // while (i < JsonData.dashwidgets.length) 
        //    batchwisearr.push(JsonData.dashwidgets.slice(i, i += 4));//Each array contains 4 objects
        // ******************************************************
        // LoadBatchWiseWidgets(batchwisearr[j]);
        //for (j = 0; j < batchwisearr.length; j++) {
        // if (j == 0) 
        // LoadBatchWiseWidgets(batchwisearr[j]);
        //else { 
        //    (function (j) { //All loops are running simultaneously and the 'j' keeps increasing until it hits arr.length - 1. to fix this we need to change j from a global variable to a local variable.
        //        setTimeout(function () { LoadBatchWiseWidgets(batchwisearr[j]);}, j*5000); //Time out set for 20 Seconds
        //    })(j); 
        //}
        //}
    }
    else {

        $('.nodatadashwrp').removeClass('hideDiv');
        $('.gridsave,.showingWrap').hide();
    }
    HidePageLoading();
}

function LoadBatchWiseWidgets() {
    if (TotalWidget < JsonData.dashwidgets.length) {
        batchwisearr.push(JsonData.dashwidgets.slice(TotalWidget, TotalWidget + 4));
        for (j = 0; j < batchwisearr.length; j++) {
            batchwisearr[j].forEach(function (entry) {
                let chartHtml = '<div><div  class="grdpanel grdpanel--default grid-stack-item-content"><header class="box-title"><h7>' + entry.title + '</h7></header>' + entry.containerhtml + '</div></div>';
                grid.addWidget(chartHtml, entry.x, entry.y, entry.width, entry.height, entry.autoPosition, undefined, undefined, undefined, undefined, entry.title);
                grid.commit();
            });
        }
    }
}
function ShowLoadingImageBasedOnCount() {
    lateLoadd3chartsArr = [];
    if (LoadingImageCount == 0)
        HidePageLoading();
    else
        ShowPageLoading();

    if (NumberOfWidgetsLoaded == 4) {
        batchwisearr = []; //Clearing batch array
        NumberOfWidgetsLoaded = 0; //Reseting NumberOfWidgetsLoaded
        LoadBatchWiseWidgets();
    }


}

function ShowPageLoading() {
    $("#ui_divPageLoading").removeClass('hideDiv').removeClass('showflx').addClass('showflx');
}

function HidePageLoading() {
    $("#ui_divPageLoading").removeClass('hideDiv').removeClass('showflx').addClass('hideDiv');
}

function CalculateDateDifference() {

    var CurrentFromDate = CurrentToDate = GivenDate = DateDifference = NewFromDate = "", Time = "";

    CurrentFromDate = FromDateTime.split(" ");
    CurrentToDate = ToDateTime.split(" ");
    Time = CurrentFromDate[1].toString();

    GivenDate = CurrentFromDate[0].split('-');
    CurrentFromDate = new Date(GivenDate[0], GivenDate[1] - 1, GivenDate[2]);

    GivenDate = CurrentToDate[0].split('-');
    CurrentToDate = new Date(GivenDate[0], GivenDate[1] - 1, GivenDate[2]);

    DateDifference = Math.abs((CurrentFromDate.getTime() - CurrentToDate.getTime()) / (24 * 60 * 60 * 1000));

    NewFromDate = new Date(CurrentFromDate);
    NewFromDate.setDate(NewFromDate.getDate() - (DateDifference));//C

    return NewFromDate.getFullYear() + "-" + AddingPrefixZeroDayMonth(NewFromDate.getMonth() + 1) + "-" + AddingPrefixZeroDayMonth(NewFromDate.getDate()) + " " + Time;
}

function AddingPrefixZeroDayMonth(n) {
    return (n < 10) ? ("0" + n) : n;
}