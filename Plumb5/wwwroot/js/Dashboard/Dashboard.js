var grid, LoadingImageCount = 0, NumberOfWidgetsLoaded = 0, TotalWidget = 0, k = 0;
var JsonData = {};
var batchwisearr = [];
var UncheckedWidgets = [];
JsonData.dashwidgets = new Array();
var lateLoadd3chartsArr = new Array();
var DashboardId = 0;
var Widgetclear = 0;

Chart.defaults.global.defaultFontSize = 10;
Chart.defaults.global.legend.labels.boxWidth = 10;

// To  Show Allo Notification
if (Notification.permission === "granted")
    console.log("we have notification permission");
else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(permission => {
        console.log(permission);
    });
}
else {
    console.log("blocked");
}

//DashBoard Over view entry point
$(document).ready(function () {
    GetUTCDateTimeRange(2);
    GetMailAlert();
});

function CallBackFunction() {
    TotalWidget = 0; JsonData = {}; batchwisearr = []; //Clearing batch array
    NumberOfWidgetsLoaded = 0; LoadingImageCount = 0; lateLoadd3chartsArr = [];
    ShowPageLoading();
    GetReport();
}

//Get DashboardOverView Data from DB
function GetReport() {
    $.ajax({
        url: "/Dashboard/DashBoardOverview/GetJsonContent",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'UserId': Plumb5UserId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindJsonData,
        error: ShowAjaxError
    });
}

//Bind Dashboard Widgets
function BindJsonData(response) {
    var myObj = {};
    myObj = JSON.parse(response);
    //Data Exist
    if (myObj.Table1.length > 0) {
        $('.gridsave,.showingWrap').show();
        $('.nodatadashwrp').addClass('hideDiv');

        DashboardId = myObj.Table1[0].Id;
        //if (DashboardId > 0) { GetMailAlert(); }

        JsonData = JSON.parse(myObj.Table1[0].JsonContent);
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
    //No Data
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
//Save Icon Click
//After Changing postion or Adding the new  grid - Save Json Data to Dashboard Table
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
            "widgetType": JsonData.dashwidgets[Position].widgetType,
            containerhtml: findJsonValue(JsonData, node.id)
        });
    });
    var jsonString = JSON.stringify(jsonObj);
    SaveJsonData(jsonString);
}

//Select Widget pop up btn Save Click to Save the selected widgets
$("#btnWidgetSave").click(function () {
    if (JsonData.dashwidgets == undefined || Widgetclear == 1)
        JsonData.dashwidgets = new Array();
    var checkedboxeslength = $('.dashpopupwrp :checkbox:checked').length;
    if (checkedboxeslength === 0) {
        ShowErrorMessage(GlobalErrorList.Dashboard.DashboardWidget_error);
        return;
    }

    if (UncheckedWidgets.length > 0) {
        UncheckedWidgets.forEach(function (item) {
            //finding the position of unchecked checkbox id in JsonData
            var Position = JsonData.dashwidgets.findIndex(obj => obj.checkboxid == item);
            //Removing unchecked checkbox data from JsonData
            if (Position !== undefined)
                JsonData.dashwidgets.splice(Position, 1);

        });
    }

    var containerhtml = "";
    $('#dvDashboardSelectWidgets input[type=checkbox]:checked').each(function () {
        //To Load Charts (Canvas)
        containerhtml = "<div class=\"grdpanel__content\"><canvas id=\"" + $(this).attr("data-id") + "\"><script>" + $(this).attr("data-function") + "(\"" + $(this).attr("data-id") + "\");<\/script><\/canvas>";

        //To Load Mail & Sms Bubble sort Graph(SMS & Mail Campaign Effectiveness)
        if ($(this).attr("data-graphName") != undefined) //load the div and bind the data
            containerhtml = "<div id=\"" + $(this).attr("data-id") + "\" class=\"grdpanel__content\"><script>AddLateLoad(\"" + $(this).attr("data-graphName") + "\",\"" + $(this).attr("data-id") + "\");<\/script></div>";

        //if ($(this).attr("data-partialview") != undefined) // load the PartialViews &  bind the data
        //   containerhtml = "<div id=\"" + $(this).attr("data-id") + "\" class=\"grdpanel__content\"><script>$('#" + $(this).attr("data-id") + "').load('/DashboardOverview/" + $(this).attr("data-partialview") + "');</script><script>AddLateLoad(\"" + $(this).attr("data-graphName") + "\",\"" + $(this).attr("data-id") + "\");<\/script></div>";

        //To load Static html content Div 
        //1.Aggregate Forms Data Widget  2.Web Push Engagement Rate 3.Web Push Delivery Rate 4.Web Push Subscriber 5.Mail Engagement Rate
        //6.Mail Delivery Rate 7.SMS Engagement Rate 8.SMS Delivery Rate 9.Mobile Push Engagement Rate 10.Mobile Push Delivery Rate

        if ($(this).attr("data-StaticHtml") != undefined)//
            containerhtml = "<div class=\"grdpanel__content\"><div id=\"" + $(this).attr("data-id") + "\"><script>" + $(this).attr("data-function") + "(\"" + $(this).attr("data-id") + "\");<\/script></div>";

        //To Load Table Data
        //1.Countries 2.Cities 3.PopularPage 4.Top Entry Page 5.Top Exit Page
        if ($(this).attr("data-table") != undefined)
            containerhtml = "<div class=\"tableWrapper mt-4\"><div id=\"" + $(this).attr("data-id") + "\"><script>" + $(this).attr("data-function") + "(\"" + $(this).attr("data-id") + "\");<\/script></div>";



        //if (JsonData.dashwidgets != undefined) {
        if (JsonData.dashwidgets.filter(e => e.checkboxid === $(this).attr("id")).length == 0) {//Checking for not existing JsonData
            JsonData.dashwidgets.push({
                "title": $(this).attr("data-title"),//$(this).next('label').text(),
                "checkboxid": $(this).attr("id"),
                "width": "6",
                "height": "4",
                "x": "0",
                "y": "0",
                "autoPosition": true,
                "widgetType": $(this).attr("data-widgettype"),
                "containerhtml": containerhtml
            });
        }
        //}
    });
    var jsonString = JSON.stringify(JsonData);
    SaveJsonData(jsonString);
});

//Save Dashboard Widgets
function SaveJsonData(jsonString) {
    $.ajax({
        url: "/Dashboard/DashBoardOverview/SaveOrUpdateDashboardWidgets",
        type: 'POST',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'UserId': Plumb5UserId, 'jsonString': jsonString }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            ShowSuccessMessage(GlobalErrorList.Dashboard.DashboardWidget_SuccessMessage);
            $(".dashpopupwrp").removeClass("r-500");
            lateLoadd3chartsArr = [];
            Widgetclear = 0;
            location.reload();
        }
    });
}

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



//Setting Icon Click - Bind selected check box and get selected widget count
$(".widgticnadd").click(function () {
    if (JsonData != null && JsonData.dashwidgets != undefined) {
        $("#dvDashboardSelectWidgets input[type='checkbox']").prop("checked", false);//Clearing all selected checkbox
        var WebAnalSelectedwidgetcnt = 0, WebEngSelectedwidgetcnt = 0, MailSelectedwidgetcnt = 0, SmsSelectedwidgetcnt = 0,
            MobileAnalSelectedwidgetcnt = 0, MobilePushEngagementSelectedwidgetcnt = 0, LiveChatSelectedwidgetcnt = 0,
            LeadManagementSelectedwidgetcnt = 0;
        JsonData.dashwidgets.forEach(function (data) {
            if (data.widgetType =='WebAnalytics')
                WebAnalSelectedwidgetcnt++;
            if (data.widgetType == 'WebEngagement')
                WebEngSelectedwidgetcnt++;
            if (data.widgetType == 'Mail')
                MailSelectedwidgetcnt++;
            if (data.widgetType == 'Sms')
                SmsSelectedwidgetcnt++;
            if (data.widgetType == 'MobileAnalytics')
                MobileAnalSelectedwidgetcnt++;
            if (data.widgetType == 'MobilePushEngagement')
                MobilePushEngagementSelectedwidgetcnt++;
            if (data.widgetType == 'LiveChat')
                LiveChatSelectedwidgetcnt++;
            if (data.widgetType == 'LeadManagement')
                LeadManagementSelectedwidgetcnt++;


            $("#" + data.checkboxid).prop("checked", true);
        });
        $(".widgtWebAnaly").html("(" + WebAnalSelectedwidgetcnt + ")");
        $(".widgtWebEng").html("(" + WebEngSelectedwidgetcnt + ")");
        $(".widgtEmail").html("(" + MailSelectedwidgetcnt + ")");
        $(".widgtSms").html("(" + SmsSelectedwidgetcnt + ")");
        $(".widgetMobAnaly").html("(" + MobileAnalSelectedwidgetcnt + ")");
        $(".widgetMobEngage").html("(" + MobilePushEngagementSelectedwidgetcnt + ")");
        $(".widgetLiveChat").html("(" + LiveChatSelectedwidgetcnt + ")");
        $(".widgetLMS").html("(" + LeadManagementSelectedwidgetcnt + ")");



        $(".daswidgcount").html(JsonData.dashwidgets.length);
    }
    $(".dashpopupwrp").toggleClass("r-500");
});

$(".clsewidpopup").click(function () {
    Widgetclear = 0;
    $(".dashpopupwrp").removeClass("r-500");
});

//Checkbox clicked event to get the Selected Counts
$(".widgetcountwrp input[type='checkbox']").click(function () {

    if (!$(this).prop('checked'))
        UncheckedWidgets.push($(this).attr('id')); // Unchecked Widget Array
    else { //if once again checked then need to remove the widget from UncheckedWidgets array
        //finding the index 
        var index = UncheckedWidgets.indexOf($(this).attr('id'));
        if (index !== -1)
            UncheckedWidgets.splice(index, 1);
    }


    //Taking Number of widgetselected count
    let dasWidgetItem = $(".widgetcountwrp input[type='checkbox']").filter(
        ":checked"
    ).length;
    //
    if (dasWidgetItem > 9) {
        $(this).prop("checked", false);
        ShowErrorMessage(GlobalErrorList.Dashboard.DashboardWidget_limiterror);
    }
    else {
        $(".daswidgcount").html(dasWidgetItem);
    }
});




//To get the number of widgets selected under each module
$(".chkbxcountWebAnl").click(function () {
    var chkbxwidgtcountWebAnal = $(".chkbxcountWebAnl").filter(":checked").length;
    $(".widgtWebAnaly").html("(" + chkbxwidgtcountWebAnal + ")");
});

$(".chkbxcountWebEng").click(function () {
    var chkbxwidgtcountWebEng = $(".chkbxcountWebEng").filter(":checked").length;
    $(".widgtWebEng").html("(" + chkbxwidgtcountWebEng + ")");
});
$(".chkbxcountemail").click(function () {
    var chkbxwidgtcountEmail = $(".chkbxcountemail").filter(":checked").length;
    $(".widgtEmail").html("(" + chkbxwidgtcountEmail + ")");
});

$(".widgetSMSchkbx").click(function () {
    var chkbxwidgtcountSMS = $(".widgetSMSchkbx").filter(":checked").length;
    $(".widgtSms").html("(" + chkbxwidgtcountSMS + ")");
});

$(".mobanlywidget").click(function () {
    var chkbxcountmobanly = $(".mobanlywidget").filter(":checked").length;
    $(".widgetMobAnaly").html("(" + chkbxcountmobanly + ")");
});
$(".mobaengagewidget").click(function () {
    var chkbxcountmobeng = $(".mobaengagewidget").filter(":checked").length;
    $(".widgetMobEngage").html("(" + chkbxcountmobeng + ")");
});
$(".liveChatwidget").click(function () {
    var chkbxcountchat = $(".liveChatwidget").filter(":checked").length;
    $(".widgetLiveChat").html("(" + chkbxcountchat + ")");
});
$(".lmswidget").click(function () {
    var chkbxcountlms = $(".lmswidget").filter(":checked").length;
    $(".widgetLMS").html("(" + chkbxcountlms + ")");
});


//Refresh Icon Click to uncheck all the selected checkbox
$(".widgtrefresh").click(function () {
    Widgetclear = 1;
    $(".widgetcountwrp input[type='checkbox']").prop("checked", false);
    $(
        ".widgtWebAnaly, .widgtWebEng, .widgtEmail, .widgtSms, .widgetMobAnaly, .widgetMobEngage, .widgetLiveChat, .widgetLMS"
    ).html("(0)");
    $('.daswidgcount').html('0');
});

$(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip();
});



//save mail alert
$("#ui_btnMailAlert").click(function () {

    if ($("#txtToEmailId").val().length === 0 && $("#txtToEmailId").val().length === 0) {
        ShowErrorMessage(GlobalErrorList.Dashboard.ToEmail);
        return false;
    }
    if ($("#txtToEmailId").val().length > 0) {
        var getAllToEmailIds = $("#txtToEmailId").val().split(',');
        for (var k = 0; k < getAllToEmailIds.length; k++) {
            if (!regExpEmail.test(getAllToEmailIds[k])) {
                ShowErrorMessage(GlobalErrorList.Dashboard.ToValidEmail);
                $("#txtToEmailId").focus();
                return false;
            }
        }
    }

    ShowPageLoading();
    var seldashid = parseInt($("#ui_btnMailAlert").attr("data_id")) == 0 ? parseInt($("#ui_btnMailAlertLead").attr("data_id")) + 1 : parseInt($("#ui_btnMailAlert").attr("data_id"));
    var mailAlert = { AlertId: 0, MailAlertType: 1, DashboardId: seldashid, ToEmailId: $("#txtToEmailId").val(), CCFromEmailId: '', IsFornightly: $("#Fornightly").is(':checked'), IsWeekly: $("#Weekly").is(':checked'), IsMonthly: $("#Monthly").is(':checked'), IsQuarterly: $("#Quarterly").is(':checked') };

    $.ajax({
        url: "/Dashboard/DashBoardOverview/SaveOrUpdateDashboardMailAlert",
        type: 'POST',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'mailAlert': mailAlert }),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            if (response.dashboardid > 0) {
                ShowSuccessMessage(GlobalErrorList.Dashboard.SaveEmailAlert);
                $("#dvDashBoardAlert").removeClass("show");
            }

            HidePageLoading();
        },
        error: ShowAjaxError
    });
});

//Get mail alert from DB
function GetMailAlert() {

    $.ajax({
        url: "/Dashboard/DashBoardOverview/GetDashboardAllMailAlert",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindMailAlertData,
        error: ShowAjaxError
    });

}


function BindMailAlertData(responsedata) {
    if (responsedata != null) {
        for (var t = 0; t < responsedata.length; t++) {
            var response = responsedata[t];
            if (response.MailAlertType == 1) {
                $("#ui_btnMailAlert").attr("data_id", response.DashboardId);
                $("#txtToEmailId").val(response.ToEmailId);
                //$("#txtCCFromEmailId").val(response.CCFromEmailId);
                if (response.IsFornightly == true)
                    $("#Fornightly").prop("checked", true);
                if (response.IsWeekly == true)
                    $("#Weekly").prop("checked", true);
                if (response.IsMonthly == true)
                    $("#Monthly").prop("checked", true);
                if (response.IsQuarterly == true)
                    $("#Quarterly").prop("checked", true);
            } else if (response.MailAlertType == 2) {
                $("#ui_btnMailAlertLead").attr("data_id", response.DashboardId);
                $("#txtToEmailIdLead").val(response.ToEmailId);
                //$("#txtCCFromEmailId").val(response.CCFromEmailId);
                if (response.IsDaily == true)
                    $("#DailyLead").prop("checked", true);
                if (response.IsWeekly == true)
                    $("#WeeklyLead").prop("checked", true);
                if (response.IsMonthly == true)
                    $("#MonthlyLead").prop("checked", true);
            }
        }
    }
}

$('input[name="sendreporttype"]').click(function () {
    let getreporttypeval = $('input[name="sendreporttype"]:checked').val();
    $(".dashboardreprtmail").addClass("hideDiv");
    $("#" + getreporttypeval).removeClass("hideDiv");
});


//save mail alert
$("#ui_btnMailAlertLead").click(function () {

    if ($("#txtToEmailIdLead").val().length === 0 && $("#txtToEmailIdLead").val().length === 0) {
        ShowErrorMessage(GlobalErrorList.Dashboard.ToEmail);
        return false;
    }
    if ($("#txtToEmailIdLead").val().length > 0) {
        var getAllToEmailIds = $("#txtToEmailIdLead").val().split(',');
        for (var k = 0; k < getAllToEmailIds.length; k++) {
            if (!regExpEmail.test(getAllToEmailIds[k])) {
                ShowErrorMessage(GlobalErrorList.Dashboard.ToValidEmail);
                $("#txtToEmailIdLead").focus();
                return false;
            }
        }
    }

    ShowPageLoading();
    var seldashid = parseInt($("#ui_btnMailAlertLead").attr("data_id")) == 0 ? parseInt($("#ui_btnMailAlert").attr("data_id")) + 1 : parseInt($("#ui_btnMailAlertLead").attr("data_id"));

    var mailAlert = { AlertId: 0, MailAlertType: 2, DashboardId: seldashid, ToEmailId: $("#txtToEmailIdLead").val(), CCFromEmailId: '', IsDaily: $("#DailyLead").is(':checked'), IsWeekly: $("#WeeklyLead").is(':checked'), IsMonthly: $("#MonthlyLead").is(':checked') };

    $.ajax({
        url: "/Dashboard/DashBoardOverview/SaveOrUpdateDashboardMailAlert",
        type: 'POST',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'mailAlert': mailAlert }),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            if (response.dashboardid > 0) {
                ShowSuccessMessage(GlobalErrorList.Dashboard.SaveEmailAlert);
                $("#dvDashBoardAlert").removeClass("show");
            }

            HidePageLoading();
        },
        error: ShowAjaxError
    });
});