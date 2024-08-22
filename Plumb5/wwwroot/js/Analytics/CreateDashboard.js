
var arduration = [], duration = 2;
var DashboardName = '';
$.urlParam = function (name) {
    var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (!results) {
        return -1;
    }
    return results[1] || 0;
}
$(document).ready(function () {
    $("#dvExpend").show().css({ 'height': (620 > $("#dvControlPanel").height() + 51) ? '620px' : $("#dvControlPanel").height() + 51 + 'px' });
    $("#dvPrintExport").append(getPrintExport('CreateDashboard', 0, 0, 0));
    $('#dvPrintExport').css('overflow', 'Visible');
    if (p5keyValue == 0)
        var qryDashId = $.urlParam("DashId");

    $('#selectcontrolm').MultiColumnSelect({
        multiple: true,
        openclass: 'close',
        duration: 200,
        hideselect: true,
    });
    $('#selectcontrolm1').MultiColumnSelect({
        multiple: true,
        openclass: 'close',
        duration: 200,
        hideselect: true,
    });
    if (qryDashId == -1) {
        $("#div_DashboardName").show();
        $("#dvLoading").hide();
    }
    else {
        $.ajax({
            url: "/Analytics/Dashboard/Report",
            type: 'Post',
            data: "{'accountId':'" + parseInt($("#hdn_AccountId").val()) + "','dashId':'" + qryDashId + "'}",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != null && response.Table[0].SegmentOrder != '') {
                    if (response.Table.length > 0) {
                        $("#dvPrintExport").css("display", "block");
                        $("#dv_PntExp").hide();
                        $("#dv_Share").css("display", "block");
                        $("#dv_Share span").css("top", 26);
                        $.each(response.Table, function () {
                            $("#div_title").html(this.DashboardName);
                            var arSegments = this.SegmentOrder.split('-');
                            arduration = this.DurationOrder.split('-');
                            var arNames = this.NameOrder.split('-');
                            var arView = this.DataViewOrder.split('-');
                            $("#div_DashboardName").hide();
                            fn_CreateDivElements
                            $("#dvLoading").hide();
                            $(".Multi").show();
                            AddSegmentHideAndShow(arSegments);
                            fn_CreateDivElementsNew(arSegments, arduration, arNames, arView);
                            return;
                        });
                    }
                    //else {

                    //}
                }
                else {
                    $(".Multi").show();
                    $("#dvPrintExport").css("display", "block");
                    $("#dv_Share").css("display", "none");
                    $("#div_Customize").show();
                    $("#div_title").html(response!=null ?response.Table[0].DashboardName :'');
                    $("#dvLoading").hide();
                    $('#dvDefault').show();
                }
            }
        });
    }
});
//Clicking Duration Mb
function Duration_Click(dur, segmentname) {
    switch (dur) {
        case 1:
            $("#lblDate_" + segmentname).html("Day View");
            break;
        case 2:
            $("#lblDate_" + segmentname).html("Week View");
            break;
        case 3:
            $("#lblDate_" + segmentname).html("Month View");
            break;
    }
    $("#div_" + segmentname).html("<img src='/images/al_loading.gif" + "' alt='Loading' style='width:20px; height:20px; position:relative; top:45%; left: 50%;' />");
    $("#dvCustomFilter_" + segmentname).toggle('slow');
    duration = dur;
    var arElem = [];
    var j = $(".commonone").length;
    for (var p = 0; p < j; p++)
        if ($(".commonone")[p].attributes.style == undefined || $(".commonone")[p].attributes.style.value != "display: none;")
            arElem.push($(".commonone")[p].attributes.id.value);
    $("#dvExpend").show().css({ 'height': (620 > $("#dvControlPanel").height() + 51) ? '620px' : $("#dvControlPanel").height() + 51 + 'px' });
    var vieww = $("#lblView_" + segmentname).html();
    fn_CreateDivElements(arElem, 1, segmentname, 0, vieww == "Grid" ? 2 : 1);
}
//Data View Click Mb
function DataView_Click(view, segmentname) {

    switch (view) {
        case 1:
            $("#lblView_" + segmentname).html("Graph");
            break;
        case 2:
            $("#lblView_" + segmentname).html("Grid");
            break;
    }
    duration = ReturnDuration($("#lblDate_" + segmentname).html());
    $("#div_" + segmentname).html("<img src='/images/al_loading.gif" + "' alt='Loading' style='width:20px; height:20px; position:relative; top:45%; left: 50%;' />");
    $("#dvCustomFilter_view_" + segmentname).toggle('slow');
    var arElem = [];
    var j = $(".commonone").length;
    for (var p = 0; p < j; p++)
        if ($(".commonone")[p].attributes.style == undefined || $(".commonone")[p].attributes.style.value != "display: none;")
            arElem.push($(".commonone")[p].attributes.id.value);
    $("#dvExpend").show().css({ 'height': (620 > $("#dvControlPanel").height() + 51) ? '620px' : $("#dvControlPanel").height() + 51 + 'px' });
    fn_CreateDivElements(arElem, 1, segmentname, 0, view);
    ///////////////else
}
//$("#btnCreateDashboard").click(function () {
function CreateDashboard() {
    DashboardName = CleanText($("#txt_DashboardName").val());
    $("#hdndashboardname").val(DashboardName);
    if ($("#txt_DashboardName").val() == "") {
        $("#dvLoading").hide();
        $("#divmsg").show();
        divmsg.innerHTML = "Please enter the dashboard name";
        setTimeout("FadeOutDiv('divmsg');", 2000);
    }
    else {
        $.ajax({
            url: "/Analytics/Dashboard/CheckDashboardExistOrNot",
            type: 'Post',
            data: "{'accountId':'" + parseInt($("#hdn_AccountId").val()) + "','dashboard':'" + DashboardName + "'}",//,'duration':'2','fromdate':'" + frm + "','todate':'" + to + "'
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response, textStatus, errorThrown) {
                if (errorThrown.status == 201) {
                    var data = JSON.parse(errorThrown.responseText);
                    if (data.Status == false) {
                        ShowErrorMessage(data.Message);
                    }
                }
                else {
                    if (response != null && response.Table.length > 0) {
                        $("#divmsg").show();
                        divmsg.innerHTML = "Dashboard name already exists";
                        setTimeout("FadeOutDiv('divmsg');", 2000);
                    }
                    else {
                        $('#div_customPop').toggle('slow');
                        $(".Multi").show();
                    }
                }
            }
        });
    }
}
//});
//Go Button Segment Mb
var arElements = [];
$("#btn_GoSegment").click(function () {
    $("#hdn_GoOrAdd").val("0");
    $("#div_Save").show();
    arElements = [];
    var j = $("#selectcontrolm .Multi").children(0).length;
    for (var p = 0; p < j; p++)
        if ($("#selectcontrolm .Multi").children(0)[p].attributes.class != undefined && $("#selectcontrolm .Multi").children(0)[p].attributes.class.value == "mcs-item active")
            arElements.push($("#selectcontrolm .Multi").children(0)[p].attributes.data.value);
    if (arElements.length == 0) {
        ShowErrorMessage("Please select segment");
        return false;
    }
    $('#div_customPop').toggle('slow');
    AddSegmentHideAndShow(arElements);

    $("#div_Customize").show();
    fn_CreateDivElements(arElements, 0, '', 0);
    //
    ///Bind Elements Data
    //$("#txt_DashboardName").hide();
    //$("#btnCreateDashboard").hide();
    $("#div_DashboardName").hide();
    $("#lblView_ActiveUsers").hide();
    //$("#span_DashName").hide();
    $("#div_title").html(DashboardName);
    $("#CustomReports").css("class", "mcs-item");
    if ($.inArray('CustomReports', arElements) !== -1) {
        CustomReportSelection(arElem);
    }
    $("#dvExpend").show().css({ 'height': (620 > $("#dvControlPanel").height() + 51) ? '620px' : $("#dvControlPanel").height() + 51 + 'px' });
});
//Add Segment
var arElem = [];
$("#btn_AddSegment").click(function () {
    $("#div_Save").show();
    duration = 2;
    $("#hdn_GoOrAdd").val("1");
    var k = $("#selectcontrolm1 .Multi").children(0).length;
    arElem = [];
    for (var p = 0; p < k; p++)
        if ($("#selectcontrolm1 .Multi").children(0)[p].attributes.class != undefined && $("#selectcontrolm1 .Multi").children(0)[p].attributes.class.value == "mcs-item active")
            arElem.push($("#selectcontrolm1 .Multi").children(0)[p].attributes.data.value);
    if (arElem.length == 0) {
        ShowErrorMessage("Please select the segment");
        return false;
    }
    $('#div_AddSegment').toggle('slow');
    AddSegmentHideAndShow(arElem);
    // for (var i = 0; i < arElem.length; i++) {
    fn_CreateDivElements(arElem, 1, '', 1, 0);
    // }
    $(".boxeHeaderHome").css("cursor", "move");
    //Custom Active User Adjustment
    $("#img_togg_ActiveUsers").hide();
    $("#lblDate_ActiveUsers").hide();
    $("#div_Duration_ActiveUsers a").hide();
    //$("#div_Duration_ActiveUsers").css("height", "15px");
    $("#lblView_ActiveUsers").hide();
    $(".span_date").css("float", "");
    $("#CustomReports").css("class", "mcs-item");

    if ($.inArray('CustomReports', arElem) !== -1) {
        CustomReportSelection(arElem);
    }
    $("#dvExpend").show().css({ 'height': (620 > $("#dvControlPanel").height() + 51) ? '620px' : $("#dvControlPanel").height() + 51 + 'px' });
});
//Hide and Show Add Elements Mb
function AddSegmentHideAndShow(arList) {
    $('#dvDefault').hide();
    if ($.inArray('ActiveUsers', arList) !== -1) {
        $("#selectcontrolm1 .Multi a[data=ActiveUsers]").hide().attr("class", "mcs-item");
    }
    if ($.inArray('PageViews', arList) !== -1) {
        $("#selectcontrolm1 .Multi a[data=PageViews]").hide().attr("class", "mcs-item");
    }
    if ($.inArray('Sessions', arList) !== -1) {
        $("#selectcontrolm1 .Multi a[data=Sessions]").hide().attr("class", "mcs-item");
    }
    if ($.inArray('New', arList) !== -1) {
        $("#selectcontrolm1 .Multi a[data=New]").hide().attr("class", "mcs-item");
    }
    if ($.inArray('Single', arList) !== -1) {
        $("#selectcontrolm1 .Multi a[data=Single]").hide().attr("class", "mcs-item");
    }
    if ($.inArray('Repeat', arList) !== -1) {
        $("#selectcontrolm1 .Multi a[data=Repeat]").hide().attr("class", "mcs-item");
    }
    if ($.inArray('Return', arList) !== -1) {
        $("#selectcontrolm1 .Multi a[data=Return]").hide().attr("class", "mcs-item");
    }
    if ($.inArray('Direct', arList) !== -1) {
        $("#selectcontrolm1 .Multi a[data=Direct]").hide().attr("class", "mcs-item");
    }
    if ($.inArray('Refer', arList) !== -1) {
        $("#selectcontrolm1 .Multi a[data=Refer]").hide().attr("class", "mcs-item");
    }
    if ($.inArray('Search', arList) !== -1) {
        $("#selectcontrolm1 .Multi a[data=Search]").hide().attr("class", "mcs-item");
    }
    //$("#div_Save").show();

}
//
function CustomReportSelection(arElem) {
    $("#div_CustomReport").toggle('slow');
    if ($("#div_CustomReportSelect").html().trim() == "") {
        $("#div_CustomReportSelect").append("<img src='/images/al_loading.gif' alt='Loading' style='width:20px; height:20px; position:relative; top:45%;left: 50%;' />");
        $.ajax({
            type: "POST",
            url: "/Analytics/Dashboard/BindCustomReport",
            data: "{'accountId':'" + parseInt($("#hdn_AccountId").val()) + "'}",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != null && response.Table.length > 0) {
                    $("#div_CustomReportSelect").html("");
                    $.each(response.Table, function () {
                        $("#div_CustomReportSelect").append('<div class="itemStyle" style="height: 28px; font-size: 15px"><div style="float: left; width: 5%;padding-top:5px"><input type="checkbox" value="' + this.CustomReportId + '" /></div><div style="float: left; width: 50%;padding-top:4px;color:#666;">' + this.Title + '</div></div>');
                        return;
                    });
                }
                else if (response != null && response.Table.length == 0)
                    $("#div_CustomReportSelect").html("Custom reports didn't found, <a href='/Analytics/Advanced/CustomReporting?AdsId=" + $("#hdn_AdsId").val() + "'>click here</a> to create");
                else {
                    //$("#dvDefault").css("display", "block"); $("#dvLoading").css("display", "none"); $("#divcontent").css("display", "none");
                }
            },
            failure: function () {

            },
            error: function () {

            }
        });
        $("#div_CustomReportSelect").niceScroll({ cursorcolor: "#CCCCCC", cursorwidth: "0px" }).resize();
    }
    //setTimeout("$('#div_CustomReportSelect div[class='nicescroll-rails']').css('top', '66px')", 2000); 
}
//Custom Report Ok Click
$("#btn_CustomReportOk").click(function () {
    // $("#div_CustomReport").hide('slow');
    var arChecked = [];
    $.each($("#div_CustomReportSelect input:checkbox:checked"), function (key, value) {
        arChecked.push($(value).attr("value"));
    });
    if (arChecked.length == 0) {
        ShowErrorMessage("Please select the custom report");
        return false;
    }
    else {
        $("#div_CustomReport").hide('slow');
    }

    $("#div_Save").show();
    for (var i = 0; i < arChecked.length; i++) {
        fn_CreateDivElements(arChecked[i], 0, '', 1, 2, 1);
    }

    $("#dvExpend").show().css({ 'height': (620 > $("#dvControlPanel").height() + 51) ? '620px' : $("#dvControlPanel").height() + 51 + 'px' });
});
var setTimeInterval = '';
//Create Div Mb
var fn_CreateDivElements = function (arVal, edit, segment, append, view, customReport) {
    if (view == undefined || view == "")
        view = 1;
    var innerhtml = '';
    var segmentLists = '';
    var dataView = '';
    if (segment == '') {
        var imgelement = "<img src='/images/al_loading.gif' alt='Loading' style='width:20px; height:20px; position:relative; top:45%; left: 50%;' />";
        if (customReport == 1) {
            // $.each(arVal, function (index, value) {
            var duration_div = '';
            if (arVal != "CustomReports") {
                duration_div = divCreation(arVal, append);
                var intOrNot = checkIntegerOrNot(arVal);
                if (intOrNot == 1)//Integer -> Custom Report
                    innerhtml += '<div class="commonone" id="' + arVal + '"><div class="boxeHeaderHome" style="height:19px;border: 1px solid #CFCFCF;background:linear-gradient(to bottom, #fdfdfd 35%,#e8e8e8 100%);border-bottom: none;font-family:&#39;Source Sans Pro&#39;,sans-serif"><span id="span_ElementName_' + arVal + '" style="margin-top:0px">&nbsp;&nbsp;</span><img onclick="Fn_EditName(&#39;' + arVal + '&#39;)" id="img_editname_' + arVal + '" src="/images/P5Rename.png" alt="Edit Name" style="left: 0px;position: relative; top: 3px; cursor: pointer; display: ' + (append == 1 ? "" : "none") + ';" /><div style="float:right"><img src="/images/fileclose.png" id="img_Close_' + arVal + '" class="Remove" alt="Close" style="display: none;"></div>' +
                    '</div><div id ="div_' + arVal + '" style="border: 1px solid #CFCFCF; height: 84%; height: 300px; margin: 0px 0px 0px 0px;">' + imgelement + '</div></div>';
                else
                    innerhtml += '<div class="commonone" id="' + arVal + '"><div class="boxeHeaderHome" style="height:19px;border: 1px solid #CFCFCF;background:linear-gradient(to bottom, #fdfdfd 35%,#e8e8e8 100%); border-bottom: none;font-family:&#39;Source Sans Pro&#39;,sans-serif"><span id="span_ElementName_' + arVal + '" style="margin-top:0px">' + RenameNames(arVal) + '</span>&nbsp;&nbsp;<img onclick="Fn_EditName(&#39;' + arVal + '&#39;)" id="img_editname_' + arVal + '" src="/images/P5Rename.png" alt="Edit Name" style="left: 0px;position: relative; top: 3px; cursor: pointer; display: ' + (append == 1 ? "" : "none") + ';" />' + duration_div +
                        '</div><div id ="div_' + arVal + '" style="border: 1px solid #CFCFCF; height: 84%; height: 300px; margin: 0px 0px 0px 0px;">' + imgelement + '</div></div>';
            }
            segmentLists += arVal;
            dataView += "0-"
            if (append == 1) {
                if ($("#" + arVal).val() != undefined) {
                    $("#" + arVal).remove();
                }
            }
        }
        else {
            $.each(arVal, function (index, value) {
                var duration_div = '';
                if (value != "CustomReports") {
                    duration_div = divCreation(value, append);
                    var intOrNot = checkIntegerOrNot(value);
                    if (intOrNot == 1)//Integer -> Custom Report
                        innerhtml += '<div class="commonone" id="' + value + '"><div class="boxeHeaderHome" style="height:19px;border: 1px solid #CFCFCF;background:linear-gradient(to bottom, #fdfdfd 35%,#e8e8e8 100%);border-bottom: none;font-family:&#39;Source Sans Pro&#39;,sans-serif"><span id="span_ElementName_' + value + '" style="margin-top:0px">&nbsp;&nbsp;</span><img onclick="Fn_EditName(&#39;' + value + '&#39;)" id="img_editname_' + value + '" src="/images/P5Rename.png" alt="Edit Name" style="left: 0px;position: relative; top: 3px; cursor: pointer; display: ' + (append == 1 ? "" : "none") + ';" /><div style="float:right"><img src="/images/fileclose.png" id="img_Close_' + value + '" class="Remove" alt="Close" style="display: none;"></div>' +
                        '</div><div id ="div_' + value + '" style="border: 1px solid #CFCFCF; height: 84%; height: 300px; margin: 0px 0px 0px 0px;">' + imgelement + '</div></div>';
                    else
                        innerhtml += '<div class="commonone" id="' + value + '"><div class="boxeHeaderHome" style="height:19px;border: 1px solid #CFCFCF;background:linear-gradient(to bottom, #fdfdfd 35%,#e8e8e8 100%); border-bottom: none;font-family:&#39;Source Sans Pro&#39;,sans-serif"><span id="span_ElementName_' + value + '" style="margin-top:0px">' + RenameNames(value) + '</span>&nbsp;&nbsp;<img onclick="Fn_EditName(&#39;' + value + '&#39;)" id="img_editname_' + value + '" src="/images/P5Rename.png" alt="Edit Name" style="left: 0px;position: relative; top: 3px; cursor: pointer; display: ' + (append == 1 ? "" : "none") + ';" />' + duration_div +
                            '</div><div id ="div_' + value + '" style="border: 1px solid #CFCFCF; height: 84%; height: 300px; margin: 0px 0px 0px 0px;">' + imgelement + '</div></div>';
                }
                segmentLists += value;
                dataView += "0-"
                if (append == 1) {
                    if ($("#" + value).val() != undefined) {
                        $("#" + value).remove();
                    }
                }
            });

        }
        // });
       // var getFilter = Bindfromtodates(duration);
        segmentLists = segmentLists.slice(0, -1);
        dataView = dataView.slice(0, -1);
        if (append == 1) {
            $("#sortable").show().append(innerhtml);
        }
        else
            $("#sortable").show().html(innerhtml);
        if (edit == 1)
            $(".Remove").show();
        //
    }
    var optiondate = '', value = '';
    var getFilter = Bindfromtodates(duration);
    $.ajax({
        url: "/Analytics/Dashboard/BindDatas",
        type: 'Post',
        data: "{'adsId':'" + parseInt($("#hdn_AccountId").val()) + "','segments':'" + arVal + "','duration':'" + duration + "','segmentname':'" + segment + "','dataView':'" + dataView + "','fromdate':'" + getFilter[0] + "','todate':'" + getFilter[1] + "'}",//,'duration':'2','fromdate':'" + frm + "','todate':'" + to + "'
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (segment == "") {
                if (customReport == 1) {//Custom Reports Binding      
                    var totalno = response.Table.length;
                    var   arHeaderId = [];
                    $.each(response.Table1, function () {
                        $("#span_ElementName_" + arVal).html(this.Title);
                        arHeaderId.push(arVal);
                        $("#div_Duration_" + arVal).hide();
                    });
                    var arHeaders = [];
                    for (var k in response.Table[0])
                        arHeaders.push(k);
                    var tot = arHeaders.length;
                    tot = 100 / parseInt(tot);
                    for (var g = 1; g <= totalno; g++) {
                        try {
                            var htmlData = '<div id="divscroll_' + arHeaderId[g - 1] + '"><div class="headerstyle" style="height: 15px;">';
                            for (var m in response.Table[0]) {
                                htmlData += '<div style="float: left; width:' + tot + '%; text-align: left;">' + m + '</div>';
                            }
                            htmlData += '</div>';
                            $.each(response.Table, function () {
                                var c = 0;
                                htmlData += "<div style='height:15px' class='itemStyle'>";
                                for (var k = 0; k < arHeaders.length; k++) {
                                    var header = 'this.' + arHeaders[c]; 
                                    htmlData += "<div style='float: left; width:" + tot + "%;'>" + ((header == "" || header == "null" || header == null) ? "Unknown" : (header != null || header != '' || header != undefined) ? (header.toString().indexOf('contactinfo') > -1 ? header.replace('contactinfo', 'ContactInfo') : header) : header) + "</div>";

                                    c++;
                                }
                                htmlData += '</div>';
                            });

                            $("img_editname_" + arHeaderId[g - 1]).hide();
                            $("#div_" + arHeaderId[g - 1]).css("overflow-y", "hidden").css("overflow-x", "hidden").html(htmlData)
                                .niceScroll({ cursorcolor: "#CCCCCC", cursorwidth: "8px", horizrailenabled: true }).resize();
                            //$("#divscroll_" + arHeaderId[g - 1]).css("width", 160 * response.Table[0].length + 10);
                        }
                        catch (er) {
                            $("#div_" + arHeaderId[g - 1]).html("Something went wrong");
                            //$("#div_Custom").css("class", "divEmptyMsgText");
                            //window.div_Custom.innerHTML = "Something Went wrong";
                        }
                    }
                    if ($("#hdn_GoOrAdd").val() == "1") {//Add Segment not Go
                        $(".Remove").show();
                    }
                }
                else {
                    //New
                    if ($.inArray('New', arVal) !== -1) {
                        $.each(response.Table, function () {
                            optiondate += "'" + this.DateShort + "',";
                            value += this.NewVisitors + ","
                        });
                        optiondate = optiondate.slice(0, -1);
                        value = value.slice(0, -1);
                        if (view == 1)
                            DrawGraph(optiondate, value, 'div_New', 'New Visitors', '#0D8ECF');
                        else
                            GridViewCreation(optiondate, value, 'div_New', 'New Visitors');
                    }
                    //Single
                    if ($.inArray('Single', arVal) !== -1) {
                        optiondate = '';
                        value = '';
                        $.each(response.Table, function () {
                            optiondate += "'" + this.DateShort + "',";
                            value += this.SingleVisitors + ","
                        });
                        optiondate = optiondate.slice(0, -1);
                        value = value.slice(0, -1);
                        if (view == 1)
                            DrawGraph(optiondate, value, 'div_Single', 'Single Visitors', '#EFC419');
                        else
                            GridViewCreation(optiondate, value, 'div_Single', 'Single Visitors');
                    }
                    //
                    //Repeat
                    if ($.inArray('Repeat', arVal) !== -1) {
                        optiondate = '';
                        value = '';
                        $.each(response.Table, function () {
                            optiondate += "'" + this.DateShort + "',";
                            value += this.RepeatVisitors + ","
                        });
                        optiondate = optiondate.slice(0, -1);
                        value = value.slice(0, -1);
                        if (view == 1)
                            DrawGraph(optiondate, value, 'div_Repeat', 'Repeat Visitors', '#FF8D11');
                        else
                            GridViewCreation(optiondate, value, 'div_Repeat', 'Repeat Visitors');
                    }
                    //
                    //Returning
                    if ($.inArray('Return', arVal) !== -1) {
                        optiondate = '';
                        value = '';
                        $.each(response.Table, function () {
                            optiondate += "'" + this.DateShort + "',";
                            value += this.ReturningVisitors + ","
                        });
                        optiondate = optiondate.slice(0, -1);
                        value = value.slice(0, -1);
                        if (view == 1)
                            DrawGraph(optiondate, value, 'div_Return', 'Returning Visits', '#7CB5EC');
                        else
                            GridViewCreation(optiondate, value, 'div_Return', 'Returning Visits');
                    }
                    //
                    //Sessions
                    if ($.inArray('Sessions', arVal) !== -1) {
                        optiondate = '';
                        value = '';
                        $.each(response.Table, function () {
                            optiondate += "'" + this.DateShort + "',";
                            value += this.Session + ","
                        });
                        optiondate = optiondate.slice(0, -1);
                        value = value.slice(0, -1);
                        if (view == 1)
                            DrawGraph(optiondate, value, 'div_Sessions', 'Sessions', '#90ED7D');
                        else
                            GridViewCreation(optiondate, value, 'div_Sessions', 'Sessions');

                    }
                    //
                    //Page Views
                    if ($.inArray('PageViews', arVal) !== -1) {
                        optiondate = '';
                        value = '';
                        $.each(response.Table, function () {
                            optiondate += "'" + this.DateShort + "',";
                            value += (this.TotalVisit != '' ? this.TotalVisit : '0') + ","
                        });
                        optiondate = optiondate.slice(0, -1);
                        value = value.slice(0, -1);
                        if (view == 1)
                            DrawGraph(optiondate, value, 'div_PageViews', 'Page Views', '#47474C');
                        else
                            GridViewCreation(optiondate, value, 'div_PageViews', 'Page Views');
                    }
                    //
                    //Direct
                    if ($.inArray('Direct', arVal) !== -1) {
                        optiondate = '';
                        value = '';
                        $.each(response.TableM, function () {
                            optiondate += "'" + this.DateShort + "',";
                            value += this.Direct + ","
                        });
                        optiondate = optiondate.slice(0, -1);
                        value = value.slice(0, -1);
                        if (view == 1)
                            DrawGraph(optiondate, value, 'div_Direct', 'Direct Source', '#957F2D');
                        else
                            GridViewCreation(optiondate, value, 'div_Direct', 'Direct Source');
                    }
                    //
                    //Refer
                    if ($.inArray('Refer', arVal) !== -1) {
                        optiondate = '';
                        value = '';
                        $.each(response.TableM, function () {
                            optiondate += "'" + this.DateShort + "',";
                            value += this.Refer + ","
                        });
                        optiondate = optiondate.slice(0, -1);
                        value = value.slice(0, -1);
                        if (view == 1)
                            DrawGraph(optiondate, value, 'div_Refer', 'Refer Source', '#BC842A');
                        else
                            GridViewCreation(optiondate, value, 'div_Refer', 'Refer Source');
                    }
                    //
                    //Search
                    if ($.inArray('Search', arVal) !== -1) {
                        optiondate = '';
                        value = '';
                        $.each(response.TableM, function () {
                            optiondate += "'" + this.DateShort + "',";
                            value += this.Search + ","
                        });
                        optiondate = optiondate.slice(0, -1);
                        value = value.slice(0, -1);
                        if (view == 1)
                            DrawGraph(optiondate, value, 'div_Search', 'Search Traffic', '#547050');
                        else
                            GridViewCreation(optiondate, value, 'div_Search', 'Search Traffic');
                    }
                    //
                }
            }
            else {
                switch (segment) {
                    case "New":
                        optiondate = '';
                        value = '';
                        $.each(response.Table, function () {
                            optiondate += "'" + this.DateShort + "',";
                            value += this.NewVisitors + ","
                        });
                        optiondate = optiondate.slice(0, -1);
                        value = value.slice(0, -1);
                        if (view == 1)
                            DrawGraph(optiondate, value, 'div_New', 'New Visitors', '#0D8ECF');
                        else
                            GridViewCreation(optiondate, value, 'div_New', 'New Visitors');
                        break;
                    case "Single":
                        optiondate = '';
                        value = '';
                        $.each(response.Table, function () {
                            optiondate += "'" + this.DateShort + "',";
                            value += this.SingleVisitors + ","
                        });
                        optiondate = optiondate.slice(0, -1);
                        value = value.slice(0, -1);
                        if (view == 1)
                            DrawGraph(optiondate, value, 'div_Single', 'Single Visitors', '#EFC419');
                        else
                            GridViewCreation(optiondate, value, 'div_Single', 'Single Visitors');
                        break;
                    case "Repeat":
                        optiondate = '';
                        value = '';
                        $.each(response.Table, function () {
                            optiondate += "'" + this.DateShort + "',";
                            value += this.RepeatVisitors + ","
                        });
                        optiondate = optiondate.slice(0, -1);
                        value = value.slice(0, -1);
                        if (view == 1)
                            DrawGraph(optiondate, value, 'div_Repeat', 'Repeat Visitors', '#FF8D11');
                        else
                            GridViewCreation(optiondate, value, 'div_Repeat', 'Repeat Visitors');
                        break;
                    case "Return":
                        optiondate = '';
                        value = '';
                        $.each(response.Table, function () {
                            optiondate += "'" + this.DateShort + "',";
                            value += this.ReturningVisitors + ","
                        });
                        optiondate = optiondate.slice(0, -1);
                        value = value.slice(0, -1);
                        if (view == 1)
                            DrawGraph(optiondate, value, 'div_Return', 'Returning Visits', '#7CB5EC');
                        else
                            GridViewCreation(optiondate, value, 'div_Return', 'Returning Visits');
                        break;
                    case "Sessions":
                        optiondate = '';
                        value = '';
                        $.each(response.Table, function () {
                            optiondate += "'" + this.DateShort + "',";
                            value += this.Session + ","
                        });
                        optiondate = optiondate.slice(0, -1);
                        value = value.slice(0, -1);
                        if (view == 1)
                            DrawGraph(optiondate, value, 'div_Sessions', 'Sessions', '#90ED7D');
                        else
                            GridViewCreation(optiondate, value, 'div_Sessions', 'Sessions');
                        break;
                    case "PageViews":
                        optiondate = '';
                        value = '';
                        $.each(response.Table, function () {
                            optiondate += "'" + this.DateShort + "',";
                            value += (this.TotalVisit != '' ? this.TotalVisit : '0') + ","
                        });
                        optiondate = optiondate.slice(0, -1);
                        value = value.slice(0, -1);
                        if (view == 1)
                            DrawGraph(optiondate, value, 'div_PageViews', 'Page Views', '#47474C');
                        else
                            GridViewCreation(optiondate, value, 'div_PageViews', 'Page Views');
                        break;
                    case "Direct":
                        optiondate = '';
                        value = '';
                        $.each(response.TableM, function () {
                            optiondate += "'" + this.DateShort + "',";
                            value += this.Direct + ","
                        });
                        optiondate = optiondate.slice(0, -1);
                        value = value.slice(0, -1);
                        if (view == 1)
                            DrawGraph(optiondate, value, 'div_Direct', 'Direct Source', '#957F2D');
                        else
                            GridViewCreation(optiondate, value, 'div_Direct', 'Direct Source');
                        break;
                    case "Refer":
                        optiondate = '';
                        value = '';
                        $.each(response.TableM, function () {
                            optiondate += "'" + this.DateShort + "',";
                            value += this.Refer + ","
                        });
                        optiondate = optiondate.slice(0, -1);
                        value = value.slice(0, -1);
                        if (view == 1)
                            DrawGraph(optiondate, value, 'div_Refer', 'Refer Source', '#BC842A');
                        else
                            GridViewCreation(optiondate, value, 'div_Refer', 'Refer Source');
                        break;
                    case "Search":
                        optiondate = '';
                        value = '';
                        $.each(response.TableM, function () {
                            optiondate += "'" + this.DateShort + "',";
                            value += this.Search + ","
                        });
                        optiondate = optiondate.slice(0, -1);
                        value = value.slice(0, -1);
                        if (view == 1)
                            DrawGraph(optiondate, value, 'div_Search', 'Search Traffic', '#547050');
                        else
                            GridViewCreation(optiondate, value, 'div_Search', 'Search Traffic');
                        break;
                    default:
                        var intOrNot = checkIntegerOrNot(segment);
                        if (intOrNot == 1) {//Custom Repors Display                            
                            if (response.Table.length > 0) {
                                for (var l in table[0])
                                    arHeaders.push(l);
                                var tot1 = arHeaders.length;
                                tot1 = 100 / parseInt(tot1);
                                try {
                                    var htmlData = '<div id="divscroll_' + segment + '"><div class="headerstyle" style="height: 15px;">';
                                    var arHeaders = [];
                                    for (var m in response.Table[0]) {
                                        htmlData += '<div style="float: left; width: ' + tot1 + '%; text-align: left;">' + m + '</div>';
                                    }
                                    htmlData += '</div>';
                                    $.each(response.Table, function () {
                                        c = 0;
                                        htmlData += "<div style='height:15px' class='itemStyle'>";
                                        for (var k = 0; k < arHeaders.length; k++) {
                                            htmlData += "<div style='float: left; width:" + tot1 + "%;'>" + ('this.' + arHeaders[c] == "" ? "Unknown" : 'this.' + arHeaders[c].replace('contactinfo', 'ContactInfo')) + "</div>";
                                            c++;
                                        }
                                        htmlData += "</div>";
                                    });

                                    $("img_editname_" + segment).hide();
                                    $("#div_" + segment).css("overflow-y", "hidden").css("overflow-x", "hidden").html(htmlData)
                                      .niceScroll({ cursorcolor: "#CCCCCC", cursorwidth: "8px", horizrailenabled: true }).resize();
                                }
                                catch (er) {
                                    $("#div_" + segment).html("Something went wrong");
                                    //$("#div_Custom").css("class", "divEmptyMsgText");
                                    //window.div_Custom.innerHTML = "Something Went wrong";
                                }
                                //$("#divscroll_" + segment).css("width", 160 * response.Table[0].length + 10);
                            }
                        }
                        break;
                }
            }
        }
    });
    //Active Users
    if ($.inArray('ActiveUsers', arVal) !== -1) {
        ActiveUsers();
        setTimeInterval = self.setInterval(ActiveUsers, 10000);
    }
    $(".Remove").click(function () {
        //closeElements(this.id);
        DeleteConfirmation(this.id);
    });
};
function ActiveUsers() {
    var onlinedata;
    var repeat = 0;
    var New = 0;
    //var arVal = new Array();
    $.ajax({
        url: "/Analytics/Dashboard/BindHome",
        type: 'Post',
        data: "{'accountId':'" + $("#hdn_AccountId").val() + "','Domain':'" + $("#hdn_DomainName").val() + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response.Table.length > 0) {
                $("#div_ActiveUsers").css("class", "divEmptyMsgText");
                $("#div_ActiveUsers").css("padding", "20px");
                $.each(response.Table, function (m) {
                    $("#div_ActiveUsers").css("padding", "0px");
                    m++;
                    var tooltips = "New Visitor";
                    if (this.RepeatOrNew.toString() == "R") {
                        tooltips = "Returning Visits";
                        repeat = repeat + 1;
                    }
                    else {
                        New = New + 1;
                    }
                    onlinedata += "<div id='livcnt'><a id='rcnt' style='width:9%' title='" + tooltips + "'>" + this.RepeatOrNew.toString() + "</a><div id='ipwrp'><div class='iptxt'><a href='javascript:void(0)' id='lnkCustomer" + this.MachineId + "' OnClick=ContactInfo('" + this.MachineId + "','');>" + this.MachineIdLink + "</a></div><div id='locwrp'>" +
                                "<div style='width:35%;overflow: hidden;display: inline-block;text-overflow: ellipsis;white-space: nowrap;text-align:left;' class='lnkwrp'>" + this.PageName + "</div><div style='width:25%;overflow: hidden;display: inline-block;text-overflow: ellipsis;white-space: nowrap;' class='delhtxt' title='" + (this.ReferType == "Email" ? "Email" : this.ReferType == "Sms" ? "Sms" : ((this.ReferType == "Null" || this.Referrer == "Null") ? "Direct" : (this.PaidCampaignFlag == "1" ? "AdWords" : (this.PaidCampaignFlag == "2" ? "AdSense" : this.Referrer)))) + "'>" + (this.ReferType == "Email" ? "Email" : this.ReferType == "Sms" ? "Sms" : ((this.ReferType == "Null" || this.Referrer == "Null") ? "Direct" : (this.PaidCampaignFlag == "1" ? "AdWords" : (this.PaidCampaignFlag == "2" ? "AdSense" : this.Referrer)))) + "</div><div style='width:23%;overflow: hidden;display: inline-block;text-overflow: ellipsis;white-space: nowrap;' class='lctxt' title='" + this.Country + " > " + this.City + "'>" + this.Country.toLowerCase() + " > " + this.City.toLowerCase() + "</div></div></div></div>";
                });
                window.div_ActiveUsers.innerHTML = onlinedata.replace("undefined", "") == "" ? "<span style='padding:10px;color:#919191'>Currently there are no active users..</span>" : onlinedata.replace("undefined", "");
                $("#div_ActiveUsers").niceScroll({ cursorcolor: "#CCCCCC", cursorwidth: "8px" }).resize();
                $("#dvLoading").hide();
            }
            else {
                window.div_ActiveUsers.innerHTML = "<span style='padding:10px;color:#919191'>Currently there are no active users..</span>";
                $("#div_ActiveUsers").niceScroll({ cursorcolor: "#CCCCCC", cursorwidth: "8px" }).resize();
                $("#dvLoading").hide();
            }
            if (window.div_ActiveUsers.innerHTML == '<span style="padding:10px;color:#919191">Currently there are no active users..</span>')
                $("#div_ActiveUsers").css("padding-top", "10px").css("height", "289px");
            else
                $("#div_ActiveUsers").css("padding-top", "0").css("height", "300px");
        },
        error: function (objxmlRequest) {
            window.console.log(objxmlRequest.responseText);
        }
    });
}
//Create Div Bind Mb - Display Load
function fn_CreateDivElementsNew(arVal, arduration, arNames, arView) {
    var innerhtml = '';
    var segmentLists = '';
    var dynamicscripts = '';
    var imgelement = "<img src='/images/al_loading.gif" + "' alt='Loading' style='width:20px; height:20px; position:relative; top:45%;left: 50%;' />";
    $.each(arVal, function (index, value) {
        var duration_div = divCreation(value, 2);
        innerhtml += '<div class="commonone" id="' + value + '"><div class="boxeHeaderHome" style="height:19px;border: 1px solid #CFCFCF;background:linear-gradient(to bottom, #fdfdfd 35%,#e8e8e8 100%);border-bottom: none;font-family:&#39;Source Sans Pro&#39;,sans-serif"><span id="span_ElementName_' + value + '" style="margin-top:0px">' + RenameNames(value) + '</span>&nbsp;&nbsp;<img onclick="Fn_EditName(&#39;' + value + '&#39;)" id="img_editname_' + value + '" src="/images/P5Rename.png" alt="Edit Name" style="left: 0px;position: relative; top:3px; cursor: pointer; display: none;" />' + duration_div +
            '</div><div id ="div_' + value + '" style="border: 1px solid #CFCFCF; height: 84%; height: 300px; margin: 0px 0px 0px 0px; ">' + imgelement + '</div></div>';
        segmentLists += value + "-";
        switch (arduration[index]) {
            case "1":
                dynamicscripts += '$("#lblDate_' + value + '").html("Day View");';
                break;
            case "2":
                dynamicscripts += '$("#lblDate_' + value + '").html("Week View");';
                break;
            case "3":
                dynamicscripts += '$("#lblDate_' + value + '").html("Month View");';
                break;
        }
        switch (arView[index]) {
            case "1":
                dynamicscripts += '$("#lblView_' + value + '").html("Graph");';
                break;
            case "2":
                dynamicscripts += '$("#lblView_' + value + '").html("Grid");';
                break;
        }
        dynamicscripts += '$("#span_ElementName_' + value + '").html("' + arNames[index] + '");';
    });
    segmentLists = segmentLists.slice(0, -1);
    $("#sortable").show().html(innerhtml);
   
    $("#div_Save").show();
    $("#div_Customize").show();
    $("#lblView_ActiveUsers").hide();

    $("#dvExpend").show().css({ 'height': (620 > $("#dvControlPanel").height() + 51) ? '620px' : $("#dvControlPanel").height() + 51 + 'px' });
    //if (edit == 1)
    //    $(".Remove").show();
    //
    $.each(arVal, function (index, value) {
        var optiondate = '', value = '';
        var getFilter = Bindfromtodates(arduration[index]);
        $.ajax({
            url: "/Analytics/Dashboard/BindDatasNew",
            type: 'Post',
            data: "{'adsId':'" + parseInt($("#hdn_AccountId").val()) + "','segment':'" + arVal[index] + "','duration':'" + arduration[index] + "','fromdate':'" + getFilter[0] + "','todate':'" + getFilter[1] + "'}",//,'duration':'2','fromdate':'" + frm + "','todate':'" + to + "'
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response.Table.length > 0) {
                    duration = parseInt(arduration[index]);
                    switch (arVal[index]) {
                        //New
                        case "New":
                            {
                                $.each(response.Table, function () {
                                    optiondate += "'" + this.DateShort + "',";
                                    value += this.NewVisitors + ","
                                });
                                optiondate = optiondate.slice(0, -1);
                                value = value.slice(0, -1);
                                if (arView[index] == "1")
                                    DrawGraph(optiondate, value, 'div_New', 'New Visitors', '#0D8ECF');
                                else
                                    GridViewCreation(optiondate, value, 'div_New', 'New Visitors');
                                break;
                            }
                            //Single
                        case 'Single':
                            {
                                $.each(response.Table, function () {
                                    optiondate += "'" + this.DateShort + "',";
                                    value += this.SingleVisitors + ","
                                });
                                optiondate = optiondate.slice(0, -1);
                                value = value.slice(0, -1);
                                if (arView[index] == "1")
                                    DrawGraph(optiondate, value, 'div_Single', 'Single Visitors', '#EFC419');
                                else
                                    GridViewCreation(optiondate, value, 'div_Single', 'Single Visitors');
                                break;
                            }
                            //
                            //Repeat
                        case 'Repeat':
                            {
                                $.each(response.Table, function () {
                                    optiondate += "'" + this.DateShort + "',";
                                    value += this.RepeatVisitors + ","
                                });
                                optiondate = optiondate.slice(0, -1);
                                value = value.slice(0, -1);
                                if (arView[index] == "1")
                                    DrawGraph(optiondate, value, 'div_Repeat', 'Repeat Visitors', '#FF8D11');
                                else
                                    GridViewCreation(optiondate, value, 'div_Repeat', 'Repeat Visitors');
                                break;
                            }
                            //
                            //Returning
                        case 'Return':
                            {
                                $.each(response.Table, function () {
                                    optiondate += "'" + this.DateShort + "',";
                                    value += this.ReturningVisitors + ","
                                });
                                optiondate = optiondate.slice(0, -1);
                                value = value.slice(0, -1);
                                if (arView[index] == "1")
                                    DrawGraph(optiondate, value, 'div_Return', 'Returning Visits', '#7CB5EC');
                                else
                                    GridViewCreation(optiondate, value, 'div_Return', 'Returning Visits');
                                break;
                            }
                            //
                            //Sessions
                        case 'Sessions':
                            {
                                $.each(response.Table, function () {
                                    optiondate += "'" + this.DateShort + "',";
                                    value += this.Session + ","
                                });
                                optiondate = optiondate.slice(0, -1);
                                value = value.slice(0, -1);
                                if (arView[index] == "1")
                                    DrawGraph(optiondate, value, 'div_Sessions', 'Sessions', '#90ED7D');
                                else
                                    GridViewCreation(optiondate, value, 'div_Sessions', 'Sessions');
                                break;
                            }
                            //
                            //Page Views
                        case 'PageViews':
                            {
                                $.each(response.Table, function () {
                                    optiondate += "'" + this.DateShort + "',";
                                    value += (this.TotalVisit != '' ? this.TotalVisit : '0') + ","
                                });
                                optiondate = optiondate.slice(0, -1);
                                value = value.slice(0, -1);
                                if (arView[index] == "1")
                                    DrawGraph(optiondate, value, 'div_PageViews', 'Page Views', '#47474C');
                                else
                                    GridViewCreation(optiondate, value, 'div_PageViews', 'Page Views');
                                break;
                            }
                            //
                            //Direct
                        case 'Direct':
                            {
                                $.each(response.Table, function () {
                                    optiondate += "'" + this.DateShort + "',";
                                    value += this.Direct + ","
                                });
                                optiondate = optiondate.slice(0, -1);
                                value = value.slice(0, -1);
                                if (arView[index] == "1")
                                    DrawGraph(optiondate, value, 'div_Direct', 'Direct Source', '#957F2D');
                                else
                                    GridViewCreation(optiondate, value, 'div_Direct', 'Direct Source');
                                break;
                            }
                            //
                            //Refer
                        case 'Refer':
                            {
                                $.each(response.Table, function () {
                                    optiondate += "'" + this.DateShort + "',";
                                    value += this.Refer + ","
                                });
                                optiondate = optiondate.slice(0, -1);
                                value = value.slice(0, -1);
                                if (arView[index] == "1")
                                    DrawGraph(optiondate, value, 'div_Refer', 'Refer Source', '#BC842A');
                                else
                                    GridViewCreation(optiondate, value, 'div_Refer', 'Refer Source');
                                break;
                            }
                            //
                            //Search
                        case 'Search':
                            {
                                $.each(response.Table, function () {
                                    optiondate += "'" + this.DateShort + "',";
                                    value += this.Search + ","
                                });
                                optiondate = optiondate.slice(0, -1);
                                value = value.slice(0, -1);
                                if (arView[index] == "1")
                                    DrawGraph(optiondate, value, 'div_Search', 'Search Traffic', '#547050');
                                else
                                    GridViewCreation(optiondate, value, 'div_Search', 'Search Traffic');
                                break;
                            }
                        default:
                            {
                                var val = arVal[index];
                                var intOrNot = checkIntegerOrNot(val);
                                if (intOrNot == 1) {//Custom Repors Display
                                    if (response.Table.length > 0) {
                                        var htmlData;
                                        if (response.Table[0].Title === undefined)
                                            htmlData = '<div id="divscroll_' + val + '"><div class="headerstyle" style="height: 15px;">';
                                        else
                                            htmlData = '<div id="divscroll_' + val + '">';
                                        var arHeaders = [];
                                        for (var k in response.Table[0])
                                            arHeaders.push(k);
                                        var tot = arHeaders.length;
                                        tot = 100 / parseInt(tot);
                                        for (var m in response.Table[0]) {
                                            if (m != 'Title')
                                                htmlData += '<div style="float: left; width:' + tot + '%; text-align: left;">' + m + '</div>';
                                        }
                                        htmlData += '</div>';
                                        $.each(response.Table, function () {
                                            c = 0;
                                            htmlData += "<div style='height:15px' class='itemStyle'>";
                                            for (var k = 0; k < arHeaders.length; k++) {
                                                var header = 'this.' + arHeaders[c];
                                                htmlData += "<div style='float: left; width:" + tot + "%;'>" + ((header == "" || header == null) ? "Custom report is not available" : (header != null || header != '' || header != undefined) ? (header.toString().indexOf('contactinfo') > -1 ? header.replace('contactinfo', 'ContactInfo') : header) : header) + "</div>";
                                                c++;
                                            }
                                            htmlData += "</div>";
                                        });
                                        $("img_editname_" + val).hide();
                                        $("#div_" + val).css("overflow-y", "hidden").css("overflow-x", "hidden").html(htmlData)
                                          .niceScroll({ cursorcolor: "#CCCCCC", cursorwidth: "8px", horizrailenabled: true }).resize();
                                        //$("#divscroll_" + val).css("width", 160 * response.Table[0].length + 10);
                                    }
                                }
                                break;
                            }
                    }
                }
            }
        });
    });
    //Active
    if ($.inArray('ActiveUsers', arVal) !== -1) {
        ActiveUsers();
        setTimeInterval = self.setInterval(ActiveUsers, 10000);
    }
    $(".Remove").click(function () {
        DeleteConfirmation(this.id);
    });
}
//Div Creation
function divCreation(value, append) {
    var disp_attr = "";
    var intOrNot = checkIntegerOrNot(value);
    if (intOrNot == 1) {
        disp_attr = "display:none"
    }
    var duration_div = "<div id='div_Duration_" + value + "' style='width: 42%;overflow: hidden;float: right;'>" +
            "<span style='font-family: &#39;Source Sans Pro&#39;, sans-serif; font-size: 15px;" + disp_attr + "' id='lblView_" + value + "' >Graph</span>" +
            "<a style='" + disp_attr + "' href='javascript:void(0)' onclick='javascript:$(&#39;#dvCustomFilter_view_" + value + "&#39;).css(&#39;top&#39;,$(&#39;#lblView_" + value + "&#39;).position().top + 24).css(&#39;left&#39;,$(&#39;#lblView_" + value + "&#39;).position().left - 11);$(&#39;#dvCustomFilter_view_" + value + "&#39;).toggle(&#39;slow&#39;);$(&#39;#dvCustomFilter_" + value + "&#39;).hide();' id='lnkServer' style='padding-right:6px'>" +
            "<img id='img_togg_view_" + value + "' border='0' src='/images/togg.png' alt='' style = 'display:" + (append == 1 ? '' : 'none') + "; position: relative; top: 2px;' /></a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
            "<div id='dvCustomFilter_view_" + value + "' class='datediv' style='width: 110px; position:absolute;border-radius: 0;' name='Graph'>" +
            "<div id='Graph_Click_" + value + "' style='height: 15px; cursor: pointer;' class='itemStyle' onclick='DataView_Click(1,&#39;" + value + "&#39;)'>" +
            "Graph" +
            "</div>" +
            "<div id='Grid_Click_" + value + "' style='height: 15px; cursor: pointer;' class='itemStyle' onclick='DataView_Click(2,&#39;" + value + "&#39;)'>" +
            "Grid" +
            "</div>" +
            "</div>" +
            "<span style='font-family: &#39;Source Sans Pro&#39;, sans-serif; font-size: 15px;float:right;" + disp_attr + "' class='span_date' id='lblDate_" + value + "'>Week View</span>" +
            "<a style='" + disp_attr + "' href='javascript:void(0)' onclick='javascript:$(&#39;#dvCustomFilter_" + value + "&#39;).css(&#39;top&#39;,$(&#39;#lblDate_" + value + "&#39;).position().top + 24).css(&#39;left&#39;,$(&#39;#lblDate_" + value + "&#39;).position().left - 11);$(&#39;#dvCustomFilter_" + value + "&#39;).toggle(&#39;slow&#39;);$(&#39;#dvCustomFilter_view_" + value + "&#39;).hide();' id='lnkServer'>" +
            "<img id='img_togg_" + value + "' border='0' src='/images/togg.png' alt='' style = 'display:" + (append == 1 ? '' : 'none') + ";position: relative; top: 2px;' /></a>" +
            "<div id='dvCustomFilter_" + value + "' class='datediv' style='width: 110px; position:absolute;border-radius: 0;' name='week'>" +
            "<div id='Day_Click_" + value + "' style='height: 15px; cursor: pointer;' class='itemStyle' onclick='Duration_Click(1,&#39;" + value + "&#39;)'>" +
            "Day View" +
            "</div>" +
            "<div id='Week_Click_" + value + "' style='height: 15px; cursor: pointer;' class='itemStyle' onclick='Duration_Click(2,&#39;" + value + "&#39;)'>" +
            "Week View" +
            "</div>" +
            "<div id='Month_Click_" + value + "' style='height: 15px; cursor: pointer;' class='itemStyle' onclick='Duration_Click(3,&#39;" + value + "&#39;)'>" +
            "Month View" +
            "</div>" +
            "</div>" +
            "<div style='float: right; padding: 6px;'><img alt='Close' class='Remove'" +
            "id='img_Close_" + value + "' src='/images/fileclose.png' /></div></div>";
    return duration_div;
}
//Grid View Creation Mb
function GridViewCreation(optiondate, value, renderId, name) {
    var dv = "";
    var arvaldate = optiondate.split(',');
    var arvalvalue = value.split(',');
    $.each(arvaldate, function (index, value) {
        dv += "<div class='itemStyle' style='height: 15px;'><div style='float: left; width:50%;'>" + arvaldate[index].slice(1).slice(0, -1) + "</div><div class='short1' style='float: left; width: 47%; text-align: right;padding-right: 2%;'>" + arvalvalue[index] + "</div></div>";
    });
    $("#" + renderId).html("<div id='divGrid_" + renderId + "' class='gridClass' style='height:300px;overflow-y: hidden;'>" + dv + "</div>");
    $(".gridClass").niceScroll({ cursorcolor: "#CCCCCC", cursorwidth: "8px", touchbehavior: true, cursordragontouch: true }).resize();
}
//Drawing Graph Mb
function DrawGraph(optiondate, value, renderId, name, color) {
    //$("#div_Duration_Direct").css("width", "auto");
    var interval = duration == 3 ? 4 : 2;
    var graph = "(function($){var chart;$(document).ready(function(){chart = new Plumbcharts.Chart({" +
                         "chart: {renderTo: '" + renderId + "',type: 'spline'},title: {" +
                         "style: {color: '#5f5f5f',fontWeight: 'bold',fontSize: '14px',fontFamily:'tahoma'}," +
                         "text:''" +
                         "},subtitle: {text: ''},xAxis: {" +
                         "categories: [" + optiondate + "]," +
                         "tickInterval: " + interval +
                         "},yAxis: { min: 0, title : ''},tooltip: {formatter: function() {return '<b>'+ this.x + '<br />'+ this.series.name +'</b>: '+ this.y;}}," +
                         "series: [{color: '" + color + "',name: '" + name + "',data: [" + value + "]} ]});});" +
                         "})(jQuery);";
    $("head").append("<" + "script" + " type='text/javascript'>" + graph + "<" + "/script" + ">");
}
//Clicking Customize Mb
var m = 0;
$("#div_Customize").click(function () {
    if ($.trim($("#div_Customize").html()) == "Customize" && m == 0) {
        $("#div_Customize").html("<span onclick='Span_Cancel()' style='padding-right:12px'><img src='/images/P5-CancelEdit.png' alt='Cancel' title='Cancel Editing' style='width:25px'/></span>  <span onclick='javascript:$(&#39;#div_AddSegment&#39;).toggle(&#39;slow&#39;);' style='padding-right:12px'><img src='/images/P5_AddSegments.png' alt='Add Segments' title='Add Segments' style='width:25px;'/></span>");
        $(".Remove").show();
        $(".boxeHeaderHome img").show();
        $(".boxeHeaderHome div span").css("float", "");
        $("#sortable").sortable({
            update: function (event, ui) {
                $(".gridClass").niceScroll({ cursorcolor: "#CCCCCC", cursorwidth: "8px" }).resize();
            }
        });
        $("#lnkServer img").show();
        $(".boxeHeaderHome").css("cursor", "move");
        //Active Users Custom Adjust
        $("#lblDate_ActiveUsers").hide();
        $("#div_Duration_ActiveUsers a").hide();
        $("#div_Duration_ActiveUsers").css("height", "21px");
    }
    else
        m = 0;
});
//Clicking Save Mb
function Span_Save() {
    //alert($("#updatedashboardid").val());
    var dataView = '';
    var type = ($.urlParam("DashId") == "-1" ? "Insert" : "Update");
    var dashId = type == "Update" ? $.urlParam("DashId") : "0";
    if ($("#updatedashboardid").val() != "") {
        dashId = $("#updatedashboardid").val();
        type = "Update";
    }
    $("#dvLoading").show();
    var i = $("#sortable").children(0).length;
    var arIdLists = [];
    var segmentLists = '';
    var durationOrder = '', nameOrder = '';
    for (var n = 0; n < i; n++) {
        if ($("#sortable").children(0)[n].attributes.style == undefined || $("#sortable").children(0)[n].attributes.style.value == "") {
            arIdLists.push($("#sortable").children(0)[n].id);//.attributes["0"].value);
            segmentLists += arIdLists[n] + "-";
            durationOrder += ReturnDuration($("#lblDate_" + $("#sortable").children(0)[n].id).html()) + "-";
            nameOrder += $("#span_ElementName_" + $("#sortable").children(0)[n].id).html() + "-";
            dataView += ($("#lblView_" + $("#sortable").children(0)[n].id).html() == "Graph" ? "1" : "2") + "-";
        }
    }
    segmentLists = segmentLists.slice(0, -1);
    durationOrder = durationOrder.slice(0, -1);
    nameOrder = nameOrder.slice(0, -1);
    dataView = dataView.slice(0, -1);
    $.ajax({
        url: "/Analytics/Dashboard/SaveSegments",
        type: 'Post',
        data: "{'adsId':'" + parseInt($("#hdn_AccountId").val()) + "','dashboard':'" + DashboardName + "','segments':'" + segmentLists + "','durationorder':'" + durationOrder + "','nameOrder':'" + nameOrder + "','type':'" + type + "','dashId':'" + dashId + "','dataView':'" + dataView + "'}",//,'duration':'2','fromdate':'" + frm + "','todate':'" + to + "'
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response, textStatus, errorThrown) {
            if (errorThrown.status == 201) {
                var data = JSON.parse(errorThrown.responseText);
                if (data.Status == false) {
                    ShowErrorMessage(data.Message);
                    $("#div_Save").hide();
                    $('#dvLoading').hide();
                    $('#dvDefault').show();
                }
            }
            else {
                //if (response != "0" && parseInt(response) > 0) {
                if (segmentLists != '') {
                    if (response.Table.length > 0) {
                        $.each(response.Table, function () {
                            for (var m in response.Table[0]) {
                                if (m == "IdentityId") {
                                    $("#updatedashboardid").val(this.IdentityId);
                                }
                            }
                            //if (response.Table[0].IdentityId == "IdentityId") {
                            //}
                            $("#divmsg").show();

                            $("#dvLoading").hide();
                            var insertOrupdate = type == "Insert" ? "created" : "updated";
                            divmsg.innerHTML = "Dashboard " + insertOrupdate + " successfully";
                            setTimeout("FadeOutDiv('divmsg')", 2000);
                            Span_Cancel();
                        });
                    }
                }
                else {
                    $("#div_Save").hide();
                    $('#dvLoading').hide();
                    $('#dvDefault').show();
                }
            }
        }
    });
}
//Return Duration
function ReturnDuration(Duration) {
    switch (Duration) {
        case "Day View":
            return "1";
            break;
        case "Week View":
            return "2";
            break;
        case "Month View":
            return "3";
            break;
        default:
            return "0";
            break;
    }
}
//Cancel Button
function Span_Cancel() {
    m = 1;
    $("#div_Customize").html("Customize");
    $("#sortable .boxeHeaderHome").css("cursor", "");
    $(".Remove").hide();
    $("#sortable").sortable("destroy");
    $(".boxeHeaderHome").css("cursor", "");
    $(".commonone div img").hide();
    $(".span_date").css("float", "right");
}
function ConfirmedDelete(id) {
    //$(".dvdeletepopup").css("padding-top", "0%"); $(".dvdeletepopup").css("padding-left", "0%"); $(".dvdeletepopup").css("top", "528px"); $(".dvdeletepopup").css("left", "558px");
    closeElements(id);
    $("#dvDeletePanel").hide();
}
function closeElements(id) {
    //$(function () {
    //    $("#dialog-confirm").dialog({
    //        resizable: false,
    //        height: 170,
    //        modal: true,
    //        buttons: {
    //            //"Delete": function () {
    ///
    var divId = "";
    switch (id) {
        case "img_Close_ActiveUsers":
            divId = "ActiveUsers";
            $("#selectcontrolm1 .Multi a[data=ActiveUsers]").show();
            clearInterval(setTimeInterval);
            break;
        case "img_Close_Sessions":
            divId = "Sessions";
            $("#selectcontrolm1 .Multi a[data=Sessions]").show();
            break;
        case "img_Close_New":
            divId = "New";
            $("#selectcontrolm1 .Multi a[data=New]").show();
            break;
        case "img_Close_Repeat":
            divId = "Repeat";
            $("#selectcontrolm1 .Multi a[data=Repeat]").show();
            break;
        case "img_Close_PageViews":
            divId = "PageViews";
            $("#selectcontrolm1 .Multi a[data=PageViews]").show();
            break;
        case "img_Close_Single":
            divId = "Single";
            $("#selectcontrolm1 .Multi a[data=Single]").show();
            break;
        case "img_Close_Return":
            divId = "Return";
            $("#selectcontrolm1 .Multi a[data=Return]").show();
            break;
        case "img_Close_Direct":
            divId = "Direct";
            $("#selectcontrolm1 .Multi a[data=Direct]").show();
            break;
        case "img_Close_Refer":
            divId = "Refer";
            $("#selectcontrolm1 .Multi a[data=Refer]").show();
            break;
        case "img_Close_Search":
            divId = "Search";
            $("#selectcontrolm1 .Multi a[data=Search]").show();
            break;
        default:
            var ar = id.split('_');
            if (ar != undefined && ar.length > 2) {
                var t = checkIntegerOrNot(ar[2]);
                if (t == 1) {
                    divId = ar[2];
                    $("#selectcontrolm1 .Multi a[data=" + divId + "]").show();
                }
            }
            break;
    }
    $("#" + divId + "").toggle('slow');
    setTimeout("$('#" + divId + "').remove();formatSide()", 1000);
    //$(this).dialog("close");
    //},
    //Cancel: function () {
    //    $(this).dialog("close");
    //}
    //}
    //});
    //});
}
function formatSide() {
    $("#dvExpend").show().css({ 'height': (620 > $("#dvControlPanel").height() + 51) ? '620px' : $("#dvControlPanel").height() + 51 + 'px' });
}
function Fn_EditName(segment) {//img_editname_PageViews
    $("#img_editname_" + segment).hide();
    $("#span_ElementName_" + segment).html('<input type="text" class="drpdwn" style="height: 16px; padding: 4px; width: 140px; position: relative; top: -3px; background: none;" id="txt_Rename_' + segment + '"  value="' + $("#span_ElementName_" + segment).html() + '" />&nbsp;&nbsp;' +
        '<input type="button" id="btn_SearchBy" value="Go" class="btngo" style="height: 25.7px; padding: 0 5px; position: relative;top:-3px;font-weight: bold;" onclick="fn_SegmentRename(&#39;' + segment + '&#39;)" />');
}
function fn_SegmentRename(segment) {
    $("#img_editname_" + segment).show();
    var txt = $("#txt_Rename_" + segment).val().split("-").join("_");
    $("#span_ElementName_" + segment).html(txt);
}
function lettersOnly(evt) {
    evt = (evt) ? evt : event;
    var charCode = (evt.charCode) ? evt.charCode : ((evt.keyCode) ? evt.keyCode :
  ((evt.which) ? evt.which : 0));
    if (charCode > 31 && (charCode < 65 || charCode > 90) &&
  (charCode < 97 || charCode > 122)) {
        return false;
    }
    return true;
}
function RenameNames(name) {
    switch (name) {
        case "ActiveUsers":
            return "Active Users";
            break;
        case "PageViews":
            return "Page Views";
            break;
        case "Sessions":
            return "Sessions";
            break;
        case "New":
            return "New Visitors";
            break;
        case "Repeat":
            return "Repeat Visitors";
            break;
        case "Return":
            return "Returning Visits";
            break;
        case "Single":
            return "Single Visitors";
            break;
        case "Direct":
            return "Direct Traffic";
            break;
        case "Refer":
            return "Refer Traffic";
            break;
        case "Search":
            return "Search Traffic";
            break;
        case "CustomReports":
            return "Custom Reports";
            break;
        default:
            var t = checkIntegerOrNot(name);
            if (t == 1)
                return "<img src='/images/al_loading.gif" + "' alt='Loading' style='width:20px; height:20px; position:relative; top:45%;left: 50%;' />";
            return name;
            break;
    }
}
function Bindfromtodates(dur, frm, to) {
    var a = new Date(), b = new Date(), startdate = '', enddate = '';
    switch (dur) {
        case "1":
            startdate = (a.getMonth() + 1) + '/' + a.getDate() + '/' + a.getFullYear() + " 00:00:00.000";
            enddate = (a.getMonth() + 1) + '/' + a.getDate() + '/' + a.getFullYear() + " 23:59:59.000";
            break;
        case "2":
            b.setDate(a.getDate() - 6);
            startdate = (b.getMonth() + 1) + '/' + b.getDate() + '/' + b.getFullYear() + " 00:00:00.000";
            enddate = (a.getMonth() + 1) + '/' + a.getDate() + '/' + a.getFullYear() + " 23:59:59.000";
            break;
        case "3":
            b.setMonth(a.getMonth() - 1);
            b.setDate(b.getDate() + 1);
            startdate = (b.getMonth() + 1) + '/' + b.getDate() + '/' + b.getFullYear() + " 00:00:00.000";
            enddate = (a.getMonth() + 1) + '/' + a.getDate() + '/' + a.getFullYear() + " 23:59:59.000";
            break;
        default:
            break;
    }
    return [startdate, enddate];
}
function GetMonthName(mnth) {
    var month = '';
    switch (mnth) {
        case 1:
            month = 'January';
            break;
        case 2:
            month = 'February';
            break;
        case 3:
            month = 'March';
            break;
        case 4:
            month = 'April';
            break;
        case 5:
            month = 'May';
            break;
        case 6:
            month = 'June';
            break;
        case 7:
            month = 'July';
            break;
        case 8:
            month = 'August';
            break;
        case 9:
            month = 'September';
            break;
        case 10:
            month = 'October';
            break;
        case 11:
            month = 'November';
            break;
        case 12:
            month = 'December';
            break;
        //default:
        //    month = '';
        //    break;
    }
    return month;
}
function checkIntegerOrNot(name) {
    var t = 0;
    try {
        if (parseInt(name) >= 0)
            t = 1;
    }
    catch (er) {
        t = 0;
    }
    return t;
}
$('#dvControlPanel').click(function (event) {
    var EventTargetId = event.target.id.toString();
    if (EventTargetId.indexOf("img_togg_") != 0 && EventTargetId.indexOf("img_togg_view_") == -1) {  // if click is not in 'mydiv'
        $('div[name=Graph]').hide();
    }
    if (EventTargetId.indexOf("img_togg_view_") != 0 && EventTargetId.indexOf("img_togg_") == -1) {  // if click is not in 'mydiv'
        $('div[name=week]').hide();

    }
});

