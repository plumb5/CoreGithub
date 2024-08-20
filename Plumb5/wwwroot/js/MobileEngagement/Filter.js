//custom filter for each page ......
getCustomFilter = function () {
    var compare = "";
    $("#dvCustomFilter").css("z-index", "99999").css("width", "400px");
    $("#CalendarControl").css("z-index", "999999");
    var filter = "<div id='frmwrp'><input type='text' onfocus='showCalendarControl(this);' placeholder='From Date' readonly='readonly' class='textBoxSmallSize' id='txtDateFrom' style='float: left; width:44%; height: 30px;' /><div style='float: left; padding: 2px;'></div>" +
         "<input onfocus='showCalendarControl(this);' placeholder='To Date' readonly='readonly' style='float: left; width:44%; height: 30px;' type='text' class='textBoxSmallSize' id='txtDateTo' /><img id='btnGo' src='../../images/arrw_btn.jpg' style=' height: 34px;padding: 0 3px;position: relative;top: 0;width: 28px; cursor:pointer;' value='Go' onclick='Report(5);' disabled='disabled'/></div>" +
         "<div style='font-size: 12px;' class='chk'>" + compare + "" +
         "<div style='float: left; margin-left: 17px;'>" +
         "" +
         "</div>";
    return filter;
};
//Bind Time Duration..................
getDefaultDuration = function () {
    var Duration = "<div style='float: left; '>" +//margin-left: -2px;
        "<input id='btn1' type='button' class='button1' value='Day' onclick='Report(1);' />" +
        "</div>" +
        "<div style='float: left; margin-left: 3px;'>" +
        "<input id='btn2' type='button' class='button1' value='Week' onclick='Report(2);' />" +
        "</div>" +
        "<div style='float: left; margin-left: 3px;'>" +
        "<input id='btn3' type='button' class='button1' value='Month' onclick='Report(3);' />" +
        "</div>" +
        "<div style='float: left; margin-left: 3px;'>" +
        "<input id='btn4' type='button' class='button1' value='Year' onclick='Report(4);' />" +
        "</div>";
    return Duration;
};
//Print and export..................
getPrintExport = function (getPageName, print, viewall, recordsperPage) {
    var record = "", AddGroup = "";
    var getPrint = "";
    if (print == 1) {
        getPrint = "<div id='dv_print' style='float: left; margin-left: 5px;'>" +
            "<a href='javascript:void(0)' class='info' style='background-color: Transparent; float: left;position:relative;top:5px' rel='" + getPageName + "' id='btnPrint' onclick='P5Print();'>" +
            "<img src='" + cdnpath + "Print.png' border='0' /><span style='width: 40px; left: -10px; top: 30px;'>Print</span></a>" +
            "</div>";
    }
    if (recordsperPage != null && recordsperPage == 1) {///Records per page
        record = "<div class='chk' id='dv_records' style='float: left; margin-left: 0px;margin-top: 2px;width:79%'><span>Records Per Page&nbsp;&nbsp;</span><select style='position: relative;top: 1px; width:60px' class='dropdownSmallSize' id='drp_RecordsPerPage' onchange='fn_ChangeRecordsPerPage()'>" +
            "<option value='20' selected='selected'>20</option>" +
            "<option value='50'>50</option>" +
            "<option value='100'>100</option>" +
             "<option value='500'>500</option>" +
             "<option value='1000'>1000</option>" +
             "<option value='5000'>5000</option>" +
             "<option value='10000'>10000</option>" +
             //"<option value='All'>All</option>" +
        "</select></div>";
    }

    var PrintExport = "";
    if (window.location.href.toLowerCase().indexOf("mobile/mobileengagement/campaigndetails") > -1) {
        PrintExport = "" + record + AddGroup + getPrint;
    }
    else {
        PrintExport = "" + record + AddGroup +
                            getPrint + "<div id='dv_PntExp' style='float: left; margin-left: 5px;'>" +
                            "<a href='javascript:void(0)' class='info' style='background-color: Transparent; float: left; position: relative; top: 4px;' rel='" + getPageName + "' id='btnExport' onclick='P5ExportData(\"#btnExport\");'>" +
                            "<img src='" + cdnpath + "excel.png' border='0' /><span style='width: 80px; left: -60px; top: 34px;'>Export as XLS</span></a>" +
                            "</div>";
    }
    return PrintExport;
};
//close custome filter out side the
$(document).click(function (e) {
    if (window.location.href.toLowerCase().indexOf("home.aspx") < 0 && window.location.href.toLowerCase().indexOf("visitorsloyalty.aspx") < 0 && window.location.href.toLowerCase().indexOf("/referringtraffic.aspx") < 0 && window.location.href.toLowerCase().indexOf("usertrackingdetails.aspx") < 0 && window.location.href.toLowerCase().indexOf("eventtrackinginput.aspx") < 0 && window.location.href.toLowerCase().indexOf("createcustom.aspx") < 0) {
        var container = $("#dvCustomFilter");
        var dateObject = $("#CalendarControl");
        if (!container.is(e.target) && container.has(e.target).length === 0 && !dateObject.is(e.target) && dateObject.has(e.target).length === 0) {
            container.hide();
            // hideCalendarControl();
        }
    }
});
$(document).ready(function () {
    $("#lnkFilter").click(function (event) {
        event.stopPropagation();
    });
});
////print.............................
//$(function () {
//$("#btnPrint").click(function () {
function P5Print() {
    var divElements = document.getElementById('divcontent').innerHTML;
    var oldPage = document.body.innerHTML;
    document.body.innerHTML = divElements;
    window.print();
    document.body.innerHTML = oldPage;
}
//});
//});
jQuery.fn.print = function () {
    if (this.size() > 1) {
        this.eq(0).print();
        return;
    } else if (!this.size()) {
        return;
    }
    var strFrameName = ("printer-" + (new Date()).getTime());
    var jFrame = $("<iframe target='_blank' name='" + strFrameName + "'>");
    jFrame
        .css("width", "1px")
        .css("height", "1px")
        .css("position", "absolute")
        .css("left", "-9999px")
        .appendTo($("body:first"));
    var objFrame = window.frames[strFrameName];
    var objDoc = objFrame.document;
    var jStyleDiv = $("<div>").append(
        $("style").clone()
    );
    var ReportTitle = $('#btnPrint').attr('rel');
    objDoc.open();
    objDoc.write("<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">");
    objDoc.write("<html><body><center><span style='font-weight:bold; text-align:center;'>" + ReportTitle + "</span></center><head><title>");
    objDoc.write(document.title);
    objDoc.write("</title><link href='//new.plumb5.com/Content/MainStyle.css' rel='stylesheet' type='text/css'>");
    objDoc.write(jStyleDiv.html() + "</head>" + this.html() + "</body></html>");
    objDoc.close();
    objFrame.focus();
    objFrame.print();
    setTimeout(function () { jFrame.remove(); }, (60 * 1000));
};
//export to xls.............................
$(document).ready(function () {
    //$("#btnExport").click(function () {
    //    P5ExportData(this);
    //});
    $("#btnExportNew").click(function () {
        $("#drp_ExportOption").val("0");
        $("#dvexport_option").toggle("slow");
    });
});
function P5ExportData(value) {
    var FileName = $(value).attr('rel').replace(/ /g, '');
    var data = $("#dvExport").html();
    data = escape(data);
    $('body').prepend("<form method='post' action='/ExportToXls/Export?File=" + FileName + "' style='top:-3333333333px;' id='tempForm'><input type='hidden' name='data' value='" + data + "' ></form>");
    $('#tempForm').submit();
    $("tempForm").remove();
    return false;
}

$(document).ready(function () {
    //Start Mobile App 
    if (window.location.href.toLowerCase().indexOf("mobileengagement/pushcampaign") > -1 || window.location.href.toLowerCase().indexOf("mobileengagement/campaigndetails") > -1 || window.location.href.toLowerCase().indexOf("mobileengagement/campaigneffectiveness") > -1 || window.location.href.toLowerCase().indexOf("mobileengagement/effectivenessreport") > -1) {
        $('#dvMobileEngagement').css('display', 'block');
        $('#ui_lnkMobilePush').css('background-color', 'rgba(166, 149, 6, 0.1) !important');
    }
    else if (window.location.href.toLowerCase().indexOf("mobileengagement/createcampaign") > -1) {
        $('#dvMobileEngagement').css('display', 'block');
        $('#ui_lnkMobileCreatePush').css('background-color', 'rgba(166, 149, 6, 0.1) !important');
    }
    else if (window.location.href.toLowerCase().indexOf("mobileengagement/inappnativ") > -1) {
        $('#dvMobileEngagement').css('display', 'block');
        $('#ui_lnkMobileBanner').css('background-color', 'rgba(166, 149, 6, 0.1) !important');
    }
        //else if (window.location.href.toLowerCase().indexOf("mobileengagement/response") > -1) {
        //    $('#dvMobileEngagement').css('display', 'block');
        //    $('#ui_lnkMobileResponse').css('background-color', 'rgba(166, 149, 6, 0.1) !important');
        //}
    else if (window.location.href.toLowerCase().indexOf("mobileengagement/formresponse") > -1) {
        $('#dvMobileEngagement').css('display', 'block');
        $('#ui_lnkMobileFormResponse').css('background-color', 'rgba(166, 149, 6, 0.1) !important');
    }
    else if (window.location.href.toLowerCase().indexOf("mobileengagement/pushresponse") > -1) {
        $('#dvMobileEngagement').css('display', 'block');
        $('#ui_lnkMobilePushResponse').css('background-color', 'rgba(166, 149, 6, 0.1) !important');
    }
    else if (window.location.href.toLowerCase().indexOf("mobileengagement/visitors") > -1) {
        $('#dvMobileEngagement').css('display', 'block');
        $('#ui_lnkMobileVisitors').css('background-color', 'rgba(166, 149, 6, 0.1) !important');
    }
    else if (window.location.href.toLowerCase().indexOf("mobileengagement/groups") > -1) {
        $('#dvMobileEngagement').css('display', 'block');
        $('#ui_lnkMobileGroups').css('background-color', 'rgba(166, 149, 6, 0.1) !important');
    }
});

//function DeleteConfirmation2(key) {
    
//    $("#dvDeletePanel").remove();
//    var deletemsg = '<div class="bgShadedDiv" style="display: block;"></div><div class="dvdeletepopup"><div class="plumb-frm" style="width: 20%;"><div style="float: left;" class="title">Delete Confirmation</div>' +
//        '<div style="padding-top: 35px;">This item will be deleted permanently,and it cannot be recovered. Are you sure?<br /><br />' +
//         '<input id="ui_create" type="button" class="button" value="Delete" onclick="ConfirmedDelete2(&#34;' + key + '&#34;)" /><span>&nbsp;</span>' +
//         '<input id="ui_cancel" type="button" class="button" value="cancel" onclick="ConfirmedCancel()" /></div></div></div>';

//    var messageDiv = document.createElement("div");
//    messageDiv.id = "dvDeletePanel";
//    messageDiv.innerHTML = deletemsg;
//    document.body.appendChild(messageDiv);
//}



function DeleteConfirmation2(templateId) {

    $("#dialog-confirm").css({ 'font-size': "13px" });

    $(function () {
        $("#dialog-confirm").dialog({
            resizable: false,
            height: 170,
            modal: true,
            buttons: {
                "Delete": function () {

                    ConfirmedDelete2(templateId);
                    $(this).dialog("close");
                },
                Cancel: function () {
                    $(this).dialog("close");
                }
            }
        });
    });

    $("#dialog-confirm").css({ 'font-size': "13px" });
    $(".ui-button-text").css({ 'font-size': "13px" });
    $("#dialog-confirm").css({ 'height': "50px" });
    $("#ui-dialog- title").css({ 'font-size': "13px" });
} 

///// Number Validation
function isNumber(evt) {
    var iKeyCode = (evt.which) ? evt.which : evt.keyCode
    if (iKeyCode != 46 && iKeyCode > 31 && (iKeyCode < 48 || iKeyCode > 57)) {
        ShowErrorMessage("Please enter valid numbers");
        return false;
    }
    return true;
}
function isNumber2(evt) {
    var iKeyCode = (evt.which) ? evt.which : evt.keyCode
    if (iKeyCode == 43) {
    }
    else if (iKeyCode != 46 && iKeyCode > 31 && (iKeyCode < 48 || iKeyCode > 57)) {
        ShowErrorMessage("Please enter valid numbers");
        return false;
    }
    return true;
}
//// Date Time 
function p5commonDateView(fromdate, todate) {
    var removeAr1 = fromdate.split(' ');
    var removeAr2 = todate.split(' ');
    var arSplit1 = removeAr1[0].split('-');
    var arSplit2 = removeAr2[0].split('-');
    var frm1 = arSplit1[2] + "-" + (arSplit1[0].toString().length == 1 ? "0" + arSplit1[0] : arSplit1[0]) + "-" + (arSplit1[1].length == 1 ? "0" + arSplit1[1] : arSplit1[1]);
    var to1 = arSplit2[2] + "-" + (arSplit2[0].length == 1 ? "0" + arSplit2[0] : arSplit2[0]) + "-" + (arSplit2[1].length == 1 ? "0" + arSplit2[1] : arSplit2[1]);
    var a = new Date(frm1);
    var b = new Date(to1);
    lblDate.innerHTML = a.getDate(fromdate) + ' ' + GetMonthName(a.getMonth(fromdate) + 1) + ' ' + a.getFullYear(fromdate) + ' - ' + b.getDate(todate) + ' ' + GetMonthName(b.getMonth(todate) + 1) + ' ' + b.getFullYear(todate);
}
function PlumbTimeFormat(newdate) {
    var date = new Date(newdate);
    var hh = date.getHours();
    var mm = date.getMinutes();
    var ss = date.getSeconds();
    var tt = "AM";
    if (date.getHours() >= 12) {
        tt = "PM";
        if (date.getHours() > 12)
            hh = date.getHours() % 12;
    }
    hh = parseInt(hh) > 9 ? hh : "0" + hh;
    mm = parseInt(mm) > 9 ? mm : "0" + mm;
    ss = parseInt(ss) > 9 ? ss : "0" + ss;
    return hh + ":" + mm + ":" + ss + " " + tt;
}
function GetJavaScriptDateObjNew(dateString) {
    if (dateString.length > 0) {
        if (dateString.indexOf('.') == -1)
            dateString = dateString + ".000";
        var dbDate = dateString.split('T');
        var year = dbDate[0].split('-');
        var time = dbDate[1].split(':');
        var milSec = 0;
        if (time[2].toString().indexOf(".") > 0) {
            milSec = time[2].split('.');
        } else {
            milSec = time[2].split('+');
        }
        var createDate = new Date(year[0], year[1] - 1, year[2], time[0], time[1], milSec[0]);
        return createDate;
    }
    return "";
}