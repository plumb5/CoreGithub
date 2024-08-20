
var regExpEmail = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,10}(?:\.[a-z]{2})?)$/i;///^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
var regExpDomain = /^(?!:\/\/)([a-zA-Z0-9]+\.)?[a-zA-Z0-9][a-zA-Z0-9-]+\.[a-zA-Z]{2,6}?$/i;
var regExpUrl = /^((http|https|ftp):\/\/)?(\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i;//var regExpUrl = new RegExp("(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]")
var regExpreplaceLastFour = /.(?=.{4,}$)/g;
var sub = "*"
var IPCheckregExpUrl = /^((http|https|ftp):\/\/)?(\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z0-9]{2,5}(:[0-9]{1,5})?(\/.*)?$/i;
var GlobalErrorList = {}, ToolTipDataList, RuleToolTipDataList;
var LoggedInUserInfo;
var p5daterangesetCookieeName = "p5pgdaterangeset";

$(document).ready(function () {
    InitiateSorting();
    GetErrorListData();
    GetToolTipData();
    BindToolTipData();
    GetRuleToolTipData();
    ShowHideExportToExcelAndSearch();
    //UserIdleSignOut();
});

function GetErrorListData() {
    var errorListJsonUrl = "/json/ErrorListDB.json?" + (new Date()).toString() + "";
    $.getJSON(errorListJsonUrl, function (errordata) {
        GlobalErrorList = errordata;
    });
}

function isGoodDate(dt) {
    var reGoodDate = /^((0?[1-9]|1[012])[- /.](0?[1-9]|[12][0-9]|3[01])[- /.](19|20)?[0-9]{2})*$/;
    return reGoodDate.test(dt);
}

function GetToolTipData() {
    var tooltipjsonurl = "/json/ToolTip.json?" + (new Date()).toString() + "";
    $.getJSON(tooltipjsonurl, function (tooltipdata) {
        ToolTipDataList = tooltipdata;
    });
}

function GetRuleToolTipData() {
    let ruletooltipjsonurl = "/json/RulesToolTip.json?" + (new Date()).toString() + "";
    $.getJSON(ruletooltipjsonurl, function (tooltipdata) {
        RuleToolTipDataList = tooltipdata;
    });
}


//Assign value to the tool tip
var localModule, LocalPage;
function AssignToolTipData(Module, PageName) {
    localModule = Module, LocalPage = PageName;
    if (ToolTipDataList !== undefined) {
        if (Module !== undefined && PageName !== undefined) {
            var a = ToolTipDataList["" + Module.toUpperCase() + ""]["" + PageName.toUpperCase() + ""];
            if (a != undefined) {
                $.each(a[0], function (index, value) {
                    $("#" + value[0] + "").text(value[1]);
                });
            }
        }
    }
    else {
        setTimeout(function (Module, PageName) { AssignToolTipData(localModule, LocalPage); }, 1000);
    }
}

function BindToolTipData() {
    try {
        var path = window.location.pathname;
        if (path.lastIndexOf('/') + 1 == path.length) { path = path.substring(0, path.lastIndexOf('/')); }
        var folder = path.split("/")
        var PageName = folder.pop();
        var Module = folder[1];
        if (ToolTipDataList !== undefined) {
            if (Module !== undefined && PageName !== undefined) {
                var tips = ToolTipDataList["" + Module.toUpperCase() + ""]["" + PageName.toUpperCase() + ""];
                if (tips != undefined) {
                    $.each(tips, function (index, value) {
                        var tipsIndex = 1;

                        for (var k = 0; k < value.length; k++) {
                            for (var m = tipsIndex; m < 15; m++) {
                                var tipsTag = $('#' + index + ' thead tr th:nth-child(' + m + ') .toottipWrap');
                                if (tipsTag.length) {
                                    tipsTag.html(value[k]);
                                    tipsIndex = m + 1;
                                    break;
                                }
                            }
                        }
                    });
                }
            }
        }
        else {
            setTimeout(function (Module, PageName) { BindToolTipData(); }, 1000);
        }
    }
    catch (error) {
        //console.log(error);
    }
}

$(window).scroll(function () {
    ScrollShowErrorMessage();
});


$(document).keyup(function (e) {
    if (e.keyCode == 27) {
        hideCalendarControl();
        CloseCustomPopUp();
    }
});

$(".CustomPopUpClose").click(function () {
    CloseCustomPopUp();
});

$(".bgShadedDiv").click(function () {
    CloseCustomPopUp();
});

CloseCustomPopUp = function () {
    $(".bgShadedDiv").hide();
    $(".CustomPopUp, .CustomPopUpWithOutDivpadding,.CustomWorkFlowPopUp").hide("fast");
};

$(document.body).on('keypress', '.numbervalues', function (event) {
    var charCode = window.event ? window.event.keyCode : event.which; //firefox    
    //if (charCode == 0)
    //    charCode = event.keyCode;
    //if (charCode == 8 || charCode == 39 || charCode == 46)
    //    return true;
    //if ((charCode < 48 || charCode > 57) || (((charCode < 48 || charCode > 57) && charCode < 96) || ((charCode < 48 || charCode > 57) && charCode > 105)) || charCode == 16) return false;
    //return true;
    if (charCode >= 48 && charCode <= 57) return true;
    return false;

});

$(document.body).on('keypress', '.Alphabets', function (event) {
    var keyCode = (event.which) ? event.which : event.keyCode;
    if (keyCode > 31 && (keyCode < 65 || keyCode > 90) && (keyCode < 97 || keyCode > 122) && keyCode != 32)
        return false;
    return true;
    //var keyCode = (event.which) ? event.which : event.keyCode;
    //if ((keyCode < 65 || keyCode > 90) && (keyCode < 97 || keyCode > 123) && keyCode != 32 && keyCode != 8 && keyCode != 46 && keyCode != 37 && keyCode == 39)
    //    return false;
    //return true;
});

$(document.body).on('keypress', '.alphanumericwithcomma', function (event) {
    var keyCode = (event.which) ? event.which : event.keyCode;
    if ((keyCode >= 65 && keyCode <= 90) || (keyCode >= 97 && keyCode <= 122) || (keyCode >= 48 && keyCode <= 57) || keyCode == 44 || keyCode == 32)
        return true;
    return false;
});

$('button.alert-close').click(function () {
    RemoveShowErrorMessage();
});

ShowErrorMessage = function (errMessage) {
    $("#ui_span_MasterError_Message").html(errMessage);
    $('#ui_div_MasterError').removeClass('hideDiv');

    $("#ui_div_MasterError").fadeIn(500).delay(5000).fadeOut(1000, function () {
        $('#ui_div_MasterError').addClass('hideDiv');
    });
};

ShowSuccessMessage = function (errMessage) {
    $("#ui_span_MasterSuccess_Message").html(errMessage);
    $('#ui_div_MasterSuccess').removeClass('hideDiv');

    $("#ui_div_MasterSuccess").fadeIn(500).delay(5000).fadeOut(1000, function () {
        $('#ui_div_MasterSuccess').addClass('hideDiv');
    });
};

RemoveShowErrorMessage = function () {
    $('#ui_div_MasterError').addClass('hideDiv');
    $('#ui_div_MasterSuccess').addClass('hideDiv');
};
ScrollShowErrorMessage = function () {
    if ($(".MsgStyle").length > 0) {
        if ($(window).scrollTop() == 0) {
            $(".MsgStyle").css({ 'position': 'fixed' })
            $(".MsgStyle").css({ 'top': '57px' })
        }
        else {
            $(".MsgStyle").css({ 'position': 'fixed' })
            $(".MsgStyle").css({ 'top': '0px' })
        }
    }
};

ShowAjaxError = function (error) {
    HidePageLoading();
    window.console.log(error);
};

function urlparamwithoutlowercase(name) {
    name = name;
    var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href.toString());
    if (!results) {
        return 0;
    }
    return results[1] || 0;
}

function urlParam(name) {
    name = name.toLowerCase();
    var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href.toString().toLowerCase());
    if (!results) {
        return 0;
    }
    return results[1] || 0;
}

$.urlParam = function (name) {
    name = name.toLowerCase();
    var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href.toString().toLowerCase());
    if (!results) {
        return 0;
    }
    return results[1] || 0;
};


function CleanText(content) {
    if (content == null) content = "";
    content = $.trim(content);
    content = content.replace(/'/g, "‘");
    content = content.replace(/\s\s+/g, ' ');
    content = content.replace(/<script>/ig, ' ');
    content = content.replace(/<\/script>/ig, ' ');
    return content;
}

function CleanTextWithoutScript(content) {
    if (content == null) content = "";
    content = $.trim(content);
    content = content.replace(/'/g, "‘");
    content = content.replace(/\s\s+/g, ' ');
    return content;
}

function getCookie(c_name) {

    var i, x, y, ARRcookies = document.cookie.split(";");
    for (i = 0; i < ARRcookies.length; i++) {
        x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
        y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
        x = x.replace(/^\s+|\s+$/g, "");

        if (x == c_name) {
            return unescape(y);
        }
    }
}

function setCookie(c_name, value, exdays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value;
    if (exdays != 0)
        c_value = escape(value) + ((exdays == null) ? "" : ";path=/;expires=" + exdate.toUTCString());
    else
        c_value = escape(value) + ((exdays == null) ? "" : ";path=/;");

    document.cookie = c_name + "=" + c_value;
}

ValidateMobilNo = function (mobno) {
    var mlen = mobno.length;
    var regNumber = /^\d{10,20}$/;
    var regAnotherNumber = /^\+[0-9]{2,3}-[0-9]\d{10}$/;
    var regNumberPlus = /^\+\d{10,20}$/;
    var regNumberPlus91 = /^\+91\d{10,20}$/;
    var regNumberPlus91Minus = /^\+91-\d{10,20}$/;
    if (regNumber.test(mobno))
        return true;
    if (regNumberPlus.test(mobno))
        return true;
    if (regNumberPlus91.test(mobno))
        return true;
    if (regNumberPlus91Minus.test(mobno))
        return true;
    if (regAnotherNumber.test(mobno))
        return true;
    if (mobno.charAt(0) != '+' && mlen == 10)
        return true;
    if (mobno.charAt(0) == '+') {
        if (mobno.substr(0, 3) == '+91' && mobno.length == 13) {
            return true;
        }
    }
    if (mobno.indexOf("-") < 0 && mobno.length == 12 && mobno.substr(0, 2) == '91')
        return true;

    if (mobno.length >= 3 && mobno.length <= 15) {
        return true;
    }

    return false;
}


function DeleteConfirmation(templateId) {


    $("#dialog-confirm").css({ 'font-size': "13px" });

    $(function () {
        $("#dialog-confirm").dialog({
            resizable: false,
            height: 170,
            modal: true,
            buttons: {
                "Delete": function () {

                    ConfirmedDelete(templateId);
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
}

//function DeleteConfirmation(key) {
//    $("#dvDeletePanel").remove();
//    var deletemsg = '<div class="bgShadedDiv" style="display: block;"></div><div class="dvdeletepopup"><div class="plumb-frm" style="width: 20%;"><div style="float: left;" class="title">Delete Confirmation</div>' +
//        '<div style="padding-top: 35px;">This item will be deleted permanently,and it cannot be recovered. Are you sure?<br /><br />' +
//         '<input id="ui_create" type="button" class="button" value="Delete" onclick="ConfirmedDelete(' + key + ')" /><span>&nbsp;</span>' +
//         '<input id="ui_cancel" type="button" class="button" value="cancel" onclick="ConfirmedCancel()" /></div></div></div>';

//    var messageDiv = document.createElement("div");
//    messageDiv.id = "dvDeletePanel";
//    messageDiv.innerHTML = deletemsg;
//    document.body.appendChild(messageDiv);
//}

function ConfirmedCancel() {
    $("#dvDeletePanel").hide();
}

GetNumberOfRecordsPerPage = function () {
    if ($("#drp_RecordsPerPage").length > 0) {
        if ($("#drp_RecordsPerPage").val().toString().toLowerCase() == "all")
            return 5000;
        else
            return parseInt($("#drp_RecordsPerPage").val());
    }
    return 20;
};


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
function GetJavaScriptDateObj(dateString) {

    if (dateString.indexOf("/") > -1) {
        return ToJavaScriptDateFromNumber(dateString);
    }
    else if (dateString.length > 0 && dateString.indexOf("T") > -1) {
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
        return GetLocalTime(createDate);
    }
    else if (dateString.length > 0 && dateString.indexOf(" ") > -1) {
        var dbDate = dateString.split(' ');
        var year = dbDate[0].split('-');
        var time = dbDate[1].split(':');
        var createDate = new Date(year[0], year[1] - 1, year[2], time[0], time[1], time[2]);
        return GetLocalTime(createDate);
    }
}

function GetLocalTime(dateTime) {
    return GetLocalTimeFromGMT(dateTime);
}
function ConvertToGMT(date) {
    return new Date(date.getTime() + (3600000 * -5.5));
}
function GetLocalTimeFromGMT(sTime) {
    sTime.setTime(sTime.getTime() - TimeZoneData[1] * 60 * 1000);
    return sTime;
}

function ConvertDateTimeToUTC(dateString) {
    var JavaScriptDateTime;

    if (dateString.indexOf("/") > -1) {
        JavaScriptDateTime = ToJavaScriptDateFromNumber(dateString);
    }
    else if (dateString.indexOf("T") > -1) {
        var dbDate = dateString.split('T');
        var year = dbDate[0].split('-');
        var time = dbDate[1].split(':');
        var milSec = 0;
        if (time[2].toString().indexOf(".") > 0) {
            milSec = time[2].split('.');
        } else {
            milSec = time[2].split('+');
        }
        JavaScriptDateTime = new Date(year[0], year[1] - 1, year[2], time[0], time[1], milSec[0]);
    }
    else {
        var dbDate = dateString.split(' ');
        var year = dbDate[0].split('-');
        var time = dbDate[1].split(':');
        JavaScriptDateTime = new Date(year[0], year[1] - 1, year[2], time[0], time[1], time[2]);
    }

    var UtcDateTime = new Date(JavaScriptDateTime.getTime() + (TimeZoneData[1] * 60 * 1000));
    return UtcDateTime;
}

function ConvertUTCDateTimeToLocal(dateString) {
    var JavaScriptDateTime;

    if (dateString.indexOf("/") > -1) {
        JavaScriptDateTime = ToJavaScriptDateFromNumber(dateString);
    }
    else if (dateString.indexOf("T") > -1) {
        var dbDate = dateString.split('T');
        var year = dbDate[0].split('-');
        var time = dbDate[1].split(':');
        var milSec = 0;
        if (time[2].toString().indexOf(".") > 0) {
            milSec = time[2].split('.');
        } else {
            milSec = time[2].split('+');
        }
        JavaScriptDateTime = new Date(year[0], year[1] - 1, year[2], time[0], time[1], milSec[0]);
    } else if (dateString.indexOf(" ") > -1) {
        var dbDate = dateString.split(' ');
        var year = dbDate[0].split('-');
        var time = dbDate[1].split(':');
        JavaScriptDateTime = new Date(year[0], year[1] - 1, year[2], time[0], time[1], time[2]);
    } else {
        JavaScriptDateTime = new Date(dateString);
    }

    var LocalDateTime = new Date(JavaScriptDateTime.getTime() - (TimeZoneData[1] * 60 * 1000));
    return LocalDateTime;
}

function UpdateQueryString(key, value) {
    var url = document.URL;
    if (!url) url = window.location.href;
    var re = new RegExp("([?|&])" + key + "=.*?(&|#|$)(.*)", "gi");

    if (re.test(url)) {
        if (typeof value !== 'undefined' && value !== null)
            return url.replace(re, '$1' + key + "=" + value + '$2$3');
        else {
            var hash = url.split('#');
            url = hash[0].replace(re, '$1$3').replace(/(&|\?)$/, '');
            if (typeof hash[1] !== 'undefined' && hash[1] !== null)
                url += '#' + hash[1];
            return url;
        }
    }
    else {
        if (typeof value !== 'undefined' && value !== null) {
            var separator = url.indexOf('?') !== -1 ? '&' : '?',
                hash = url.split('#');
            url = hash[0] + separator + key + '=' + value;
            if (typeof hash[1] !== 'undefined' && hash[1] !== null)
                url += '#' + hash[1];
            return url;
        }
        else
            return url;
    }
}

function onlyNumbers(event) {
    var charCode = window.event ? window.event.keyCode : event.which; //firefox    
    if (charCode == 0)
        charCode = event.keyCode;
    if (charCode == 8 || charCode == 46)
        return true;
    if ((charCode < 48 || charCode > 57) || (((charCode < 48 || charCode > 57) && charCode < 96) || ((charCode < 48 || charCode > 57) && charCode > 105))) return false;
    return true;
}

function ToJavaScriptDateFromNumber(value) {
    var pattern = /Date\(([^)]+)\)/;
    var results = pattern.exec(value);
    var dt = new Date(parseFloat(results[1]));
    return dt;
}

function GetFileExtension(fileName) {
    return (/[.]/.exec(fileName)) ? /[^.]+$/.exec(fileName) : undefined;
};

function calenders(txtId) {
    document.getElementById(txtId).focus();
}

ShowScriptDetails = function (mainTitle, scriptContent, instruction) {
    $(".CustomPopUp").remove();
    var conformDiv = document.createElement("div");
    conformDiv.className = "CustomPopUp";
    conformDiv.style.width = "55%";
    conformDiv.id = "dvFromScript";
    var conformDivTitle = document.createElement("div");
    conformDivTitle.className = "newTitle";
    conformDivTitle.innerHTML = mainTitle;

    var closeImg = document.createElement("img");
    closeImg.src = "/images/img_trans.gif";
    closeImg.className = "CustomPopUpClose";
    closeImg.style.cursor = "pointer";
    closeImg.style.top = "5px";
    closeImg.onclick = function () { CloseCustomPopUp(); };
    closeImg.style.position = "relative"; closeImg.style.float = "right";
    closeImg.style.float = "right";
    closeImg.setAttribute("style", closeImg.getAttribute("style") + "float:right");
    conformDivTitle.appendChild(closeImg);

    conformDiv.appendChild(conformDivTitle);

    var barDiv = document.createElement("div");
    barDiv.style.borderBottom = "1px solid #e8e8e8";
    conformDiv.appendChild(barDiv);

    var scriptDiv = document.createElement("div");
    scriptDiv.innerHTML = scriptContent; scriptDiv.style.fontSize = "14px";
    conformDiv.appendChild(scriptDiv);

    var contentDiv = document.createElement("div");
    contentDiv.className = "divPadding";
    contentDiv.innerHTML = "<br />" + instruction;
    conformDiv.appendChild(contentDiv);

    document.body.appendChild(conformDiv);
    var midWidth = screen.width / 2 - 350;
    conformDiv.style.left = midWidth + "px";
    conformDiv.style.display = "block";
};

$(function () {
    $("#reportaBugDrag").draggable();
});

function CalculatePercentage(thisValue, OldValue) {
    var result = 0;
    if (OldValue == 0 && thisValue != 0)
        result = 100;
    else if (thisValue > OldValue)
        result = Math.round((thisValue - OldValue) / thisValue * 100).toFixed(0);
    else if (OldValue > thisValue)
        result = Math.round((OldValue - thisValue) / OldValue * 100).toFixed(0);
    else if (thisValue == OldValue)
        result = 0;

    return result;
}

function onlyPhoneNumbersDetails(event) {
    var charCode = window.event ? window.event.keyCode : event.which; //firefox    
    if (charCode == 0)
        charCode = event.keyCode;
    if (charCode == 8 || charCode == 43)
        return true;
    if ((charCode < 48 || charCode > 57) || (((charCode < 48 || charCode > 57) && charCode < 96) || ((charCode < 48 || charCode > 57) && charCode > 105))) return false;
    return true;
}

function onlyPhoneNumbersDetailsComma(event) {
    var charCode = window.event ? window.event.keyCode : event.which; //firefox

    if (charCode == 0)
        charCode = event.keyCode;
    if (charCode == 8 || charCode == 44 || charCode == 43)
        return true;
    if ((charCode < 48 || charCode > 57) || (((charCode < 48 || charCode > 57) && charCode < 96) || ((charCode < 48 || charCode > 57) && charCode > 105))) return false;
    return true;
}

function removeQuerystring(param) {
    var querystring = "";
    var searchIndex = document.URL.indexOf("?");
    if (searchIndex > -1) {
        var sPageURL = document.URL.substring(searchIndex + 1);
        var sURLVariables = sPageURL.split('&');
        for (var i = 0; i < sURLVariables.length; i++) {
            var sParameterName = sURLVariables[i].split('=');
            if (sParameterName[0] != param) {
                if (querystring.indexOf("?") == -1) { querystring = querystring + "?" + sParameterName[0] + "=" + sParameterName[1]; }
                else {
                    querystring = querystring + "&" + sParameterName[0] + "=" + sParameterName[1];
                }
            }
        }
    }
    window.history.replaceState("", "", window.location.href.split('?')[0] + querystring);
}

function ActualUrlWithOutHttpWww(url, IsWithOutQueryString) {
    if (IsWithOutQueryString)
        return url.replace("http://", "").replace("https://", "").replace("www.", "").split('?')[0];
    else
        return url.replace("http://", "").replace("https://", "").replace("www.", "");
}

function CheckValidEmail(Id) {
    if ($("#" + Id + "").val() != null && $("#" + Id + "").val() != undefined && $("#" + Id + "").val().length > 0) {
        if ($("#" + Id + "").val().indexOf(",") > -1) {
            var SplitEmailId = $("#" + Id + "").val().split(",");
            for (var i = 0; i < SplitEmailId.length; i++) {
                if (!regExpEmail.test(SplitEmailId[i])) {
                    ShowErrorMessage("Please enter valid email Id");
                    $("#" + Id + "").focus();
                    return false;
                }
            }
        }
        else {
            if (!regExpEmail.test($("#" + Id + "").val())) {
                ShowErrorMessage("Please enter valid email Id");
                $("#" + Id + "").focus();
                return false;
            }
        }
    }
    return true;
}

function CheckPhoneNumbers(Id) {
    if ($("#" + Id + "").val() != null && $("#" + Id + "").val() != undefined && $("#" + Id + "").val().length > 0) {
        if ($("#" + Id + "").val().indexOf(",") > -1) {
            var SplitPhoneNumbers = $("#" + Id + "").val().split(",");
            for (var i = 0; i < SplitPhoneNumbers.length; i++) {
                if (!ValidateMobilNo(SplitPhoneNumbers[i])) {
                    ShowErrorMessage("Please enter valid phone number");
                    $("#" + Id + "").focus();
                    return false;
                }
            }
        }
        else {
            if (!ValidateMobilNo($("#" + Id + "").val())) {
                ShowErrorMessage("Please enter valid phone number");
                $("#" + Id + "").focus();
                return false;
            }
        }
    }
    return true;
}

function GetTodayDateTime() {
    var d = new Date(new Date().toLocaleString("en-US", { timeZone: TimeZoneData[0] })),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear(),
        hour = '' + d.getHours(),
        minute = '' + d.getMinutes(),
        second = '' + d.getSeconds();

    month = (month.length < 2) ? ('0' + month) : month;
    day = (day.length < 2) ? ('0' + day) : day;
    hour = (hour.length < 2) ? ('0' + hour) : hour;
    minute = (minute.length < 2) ? ('0' + minute) : minute;
    second = (second.length < 2) ? ('0' + second) : second;

    return [year, month, day].join('-') + ' ' + [hour, minute, second].join(':');
}

function AllCallTrackerStatus(module, adsId) {
    $.ajax({
        url: "/Form/CommonDetailsForForms/GetAccountDetails",
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            BindAllCallTrackerStatus(response, module, adsId);
        },
        error: ShowAjaxError
    });
}

function BindAllCallTrackerStatus(response, module, adsId) {

    var CallTrackerUrl = "//connect.plumb5.com/";
    if (response != undefined && response != null && response.TrackerDomain != "" && response.TrackerDomain.length > 0)
        CallTrackerUrl = response.TrackerDomain;

    CallTrackerUrl = CallTrackerUrl.replace("https:", "").replace("http:", "");

    var urldetails = CallTrackerUrl + "?AccountId=" + adsId + "&" + module + "=Whatever";

    for (var i = 0; i < 15; i++) {
        $.ajax({
            url: urldetails,
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {

            },
            error: ShowAjaxError
        });
    }
}

SendError = function (xhr, errorType, exception, functionname) {


    $("#dvLoading").hide();
    var body = xhr.responseText.match(/<body[^>]*>[\s\S]*<\/body>/gi);
    var result = body[0].replace(/(\<.*?\>)/g, '').replace(/\n/g, "").replace(/\s\s+/g, ' ');
    if ($.trim(result).length > 1200) {
        result = result.substring(0, 1200);
        result = result + "...";
    }
    $.ajax({
        url: "http://www.plumb5.com/AjaxError/UpdateError.svc/SendErrorMail",
        type: 'GET',
        data: { 'error': result, 'subject': errorType + ' ====> ' + exception + ' ====> ' + functionname },
        datatype: "json",
        success: function (result) {
        },
        error: function (object) {
        }

    });
}

//This function is check only for null and not undefined
function IsObjectEmpty(obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

function MaskEmailId(content) {
    //if (content != null && content != "" && content != undefined) {
    //    if (content.indexOf(",") > -1) {
    //        var SplitEmailIds = content.split(",");
    //        content = "";
    //        for (var i = 0; i < SplitEmailIds.length; i++) {
    //            content += "," + SplitEmailIds[i].replace(/^(..)(.*)(@.*)$/, (_, a, b, c) => a + b.replace(/./g, '*') + c);
    //        }
    //        content = content.substring(1, content.length);
    //    }
    //    else {
    //        content = content.replace(/^(..)(.*)(@.*)$/, (_, a, b, c) => a + b.replace(/./g, '*') + c);
    //    }
    //}
    //else {
    //    content = "";
    //}
    return content;
}

function MaskPhoneNumber(content) {
    //if (content != null && content != "" && content != undefined) {
    //    if (content.indexOf(",") > -1) {
    //        var SplitPhoneNumbers = content.split(",");
    //        content = "";
    //        for (var i = 0; i < SplitPhoneNumbers.length; i++) {
    //            content += "," + SplitPhoneNumbers[i].replace(regExpreplaceLastFour, sub);
    //        }
    //        content = content.substring(1, content.length);
    //    }
    //    else {
    //        content = content.replace(regExpreplaceLastFour, sub);
    //    }
    //}
    //else {
    //    content = "";
    //}
    return content;
}

function MaskName(content) {
    var nName = "";
    if (content != null) {
        for (var i = 1; i <= content.length; i++) {
            nName += "*";
        }
        return nName;
    }
    else {
        return content = "";
    }
}

function EncryptString(inputContent) {
    //Don't Change below values without knowledge
    var key = CryptoJS.enc.Utf8.parse('8080808080808080');
    var iv = CryptoJS.enc.Utf8.parse('8080808080808080');

    var encryptedContent = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(inputContent), key,
        {
            keySize: 128 / 8,
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });

    return encryptedContent.toString();
}

function IsVulnerableContent(inputContent) {
    if (CleanText(inputContent) != "") {
        if (/select|delete|truncate|insert|drop|union|--/ig.test(inputContent.toLowerCase())) {
            return true;
        }
    }
    return false;
}

function ConvertDateObjectToDateTime(dateString) {
    var JavaScriptDateTime;

    if (dateString != null && dateString.indexOf("/") > -1) {
        JavaScriptDateTime = ToJavaScriptDateFromNumber(dateString);
    }
    else if (dateString != null && dateString.indexOf("T") > -1) {
        var dbDate = dateString.split('T');
        var year = dbDate[0].split('-');
        var time = dbDate[1].split(':');
        var milSec = 0;
        if (time[2].toString().indexOf(".") > 0) {
            milSec = time[2].split('.');
        } else {
            milSec = time[2].split('+');
        }
        JavaScriptDateTime = new Date(year[0], year[1] - 1, year[2], time[0], time[1], milSec[0]);
    }
    else {
        JavaScriptDateTime = new Date(dateString);
    }

    var LocalDateTime = new Date(JavaScriptDateTime.getTime());
    return LocalDateTime;
}

ShowHideExportToExcelAndSearch = function () {
    //var pageFullUrl = window.location.href.toString().toLowerCase();
    //$('#ui_txtSearchEmailId').hide();
    //$('#btnExport').removeClass('ExportShowHide');

    //if (pageFullUrl.indexOf("/mail/mailcampaignresponsereport") > 0) {
    //    $('#ui_txtSearchEmailId').show();
    //    $('#btnExport').addClass('ExportShowHide');
    //}
    //else if (pageFullUrl.indexOf("/mail/triggereachreport") > 0) {
    //    $('#ui_txtSearchEmailId').show();
    //    $('#btnExport').addClass('ExportShowHide');
    //}
    //else if (pageFullUrl.indexOf("/sms/smsreport") > 0) {
    //    $('#ui_txtSearchPhoneNumber').show();
    //    $('#btnExport').addClass('ExportShowHide');
    //}
    //else if (pageFullUrl.indexOf("/sms/triggereachreport") > 0) {
    //    $('#ui_txtSearchPhoneNumber').show();
    //    $('#btnExport').addClass('ExportShowHide');
    //}
};

// this is a utility function to fetch the variables from the CSS
function cssvar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name);
}

//Avearge used in analytics
function fn_AverageTime(Desc) {
    var secnew = 0;
    var seconds = 0, days = 0, hours = 0, minutes = 0;
    var total = '';
    if (Desc != "undefined" && Desc != "") {
        seconds = Desc % 60
        days = Math.floor(Desc / 60 / 60 / 24);
        hours = Math.floor(Desc / 60 / 60) % 24
        minutes = Math.floor(Desc / 60) % 60
        secnew = Math.round(seconds - (days * 86400) - (hours * 3600) - (minutes * 60));
    }
    if (days == 0 && hours == 0 && minutes == 0 && secnew == 0)
        total = "less than a second";
    else
        total = Math.abs(days) + "d " + Math.abs(hours) + "h " + Math.abs(minutes) + "m " + Math.abs(seconds) + "s";
    return (total);
}

function SubstringPageURL(PageURL) {
    let lastcontent = URL = "";
    if (PageURL != undefined && PageURL != null && PageURL.length > 0) {

        if (PageURL.substring(PageURL.length - 1) == "/")
            URL = PageURL.slice(0, -1);

        if (URL.indexOf("http://") != -1 || URL.indexOf("https://") != -1 || URL.indexOf("www.") != -1) {
            URL = URL.replace("http://", "").replace("https://", "").replace("www.", "");
        }

        if (URL == "" && URL.length == 0) {
            lastcontent = PageURL.substring((PageURL.lastIndexOf("/")), PageURL.length);
        }
        else {
            lastcontent = URL.substring((URL.lastIndexOf("/")), URL.length);
        }

        if (lastcontent == "" || lastcontent == "#" || lastcontent == "/#")
            lastcontent = PageURL;

        if (lastcontent.length > 30)
            lastcontent = lastcontent.substring(0, 30) + "...";
    }

    return lastcontent;
}




function InitiateSorting() {

    $("th").click(function () {
        if ($(this).find('.sortWrap').length > 0) {
            ShowPageLoading();
            setTimeout(() => {
                var order = $(this).hasClass("addsorticn") == true ? 1 : -1;
                $("th.helpIcon").removeClass("addsorticn");

                $("th.helpIcon").removeClass("sel_sort");
                $(this).addClass("sel_sort");

                //let tableId = $('.table').attr('id');
                let tableId = $(this).closest(".table").attr('id');
                let selectedColumn = 0;

                $("#" + tableId).find(">thead >tr").each(function () {
                    $(this).find(">th").each(function (index) {
                        if ($(this).hasClass('sel_sort')) {
                            selectedColumn = index;
                        }
                    });
                });

                if (order == -1) {
                    $(this).addClass("addsorticn");
                    SortAscOrDesc(tableId, selectedColumn, -1);
                } else {
                    SortAscOrDesc(tableId, selectedColumn, 1);
                }
                HidePageLoading();
            }, 0);
        }
    });

}

function SortAscOrDesc(tableId, ColumnSelected, sortOrder) {
    var table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById(tableId);
    switching = true;
    /*Make a loop that will continue until
    no switching has been done:*/
    while (switching) {
        //start by saying: no switching is done:
        switching = false;
        rows = table.rows;
        /*Loop through all table rows (except the
        first, which contains table headers):*/
        for (i = 1; i < (rows.length - 1); i++) {
            //start by saying there should be no switching:
            shouldSwitch = false;
            /*Get the two elements you want to compare,
            one from current row and one from the next:*/
            x = rows[i].getElementsByTagName("TD")[ColumnSelected];
            y = rows[i + 1].getElementsByTagName("TD")[ColumnSelected];
            //check if the two rows should switch place:

            if (rows[i].className.toString().toLowerCase() != "isnotsortable") {
                if (sortOrder == 1) {
                    //ascending order

                    //checking for number
                    if ($.isNumeric(x.innerText.toLowerCase()) && $.isNumeric(y.innerText.toLowerCase())) {
                        if (Number(x.innerText.toLowerCase()) > Number(y.innerText.toLowerCase())) {
                            //if so, mark as a switch and break the loop:
                            shouldSwitch = true;
                            break;
                        }
                    }
                    //checking for date
                    else if (isNaN(x.innerText.toLowerCase()) && !isNaN(Date.parse(x.innerText.toLowerCase())) &&
                        isNaN(y.innerText.toLowerCase()) && !isNaN(Date.parse(y.innerText.toLowerCase()))) {
                        if (Date.parse(x.innerText.toLowerCase()) > Date.parse(y.innerText.toLowerCase())) {
                            //if so, mark as a switch and break the loop:
                            shouldSwitch = true;
                            break;
                        }
                    }
                    //checking for day, hour, minit,sec
                    else if (x.innerText.split(" ").length == 4 && x.innerText.split(" ")[0].slice(-1) == 'd' && x.innerText.split(" ")[1].slice(-1) == 'h' &&
                        y.innerText.split(" ").length == 4 && y.innerText.split(" ")[0].slice(-1) == 'd' && y.innerText.split(" ")[1].slice(-1) == 'h') {
                        if (fn_Days_to_AvgTime(x.innerText) > fn_Days_to_AvgTime(y.innerText)) {
                            shouldSwitch = true;
                            break;
                        }
                    }
                    //else string
                    else {
                        if (x.innerText.toLowerCase() > y.innerText.toLowerCase()) {
                            //if so, mark as a switch and break the loop:
                            shouldSwitch = true;
                            break;
                        }
                    }
                }
                else {
                    //Descending order
                    if ($.isNumeric(x.innerText.toLowerCase()) && $.isNumeric(y.innerText.toLowerCase())) {
                        if (Number(x.innerText.toLowerCase()) < Number(y.innerText.toLowerCase())) {
                            //if so, mark as a switch and break the loop:
                            shouldSwitch = true;
                            break;
                        }
                    }
                    else if (isNaN(x.innerText.toLowerCase()) && !isNaN(Date.parse(x.innerText.toLowerCase())) &&
                        isNaN(y.innerText.toLowerCase()) && !isNaN(Date.parse(y.innerText.toLowerCase()))) {
                        if (Date.parse(x.innerText.toLowerCase()) < Date.parse(y.innerText.toLowerCase())) {
                            //if so, mark as a switch and break the loop:
                            shouldSwitch = true;
                            break;
                        }
                    }
                    else if (x.innerText.split(" ").length == 4 && x.innerText.split(" ")[0].slice(-1) == 'd' && x.innerText.split(" ")[1].slice(-1) == 'h' &&
                        y.innerText.split(" ").length == 4 && y.innerText.split(" ")[0].slice(-1) == 'd' && y.innerText.split(" ")[1].slice(-1) == 'h') {
                        if (fn_Days_to_AvgTime(x.innerText) < fn_Days_to_AvgTime(y.innerText)) {
                            shouldSwitch = true;
                            break;
                        }
                    }
                    else {
                        if (x.innerText.toLowerCase() < y.innerText.toLowerCase()) {
                            //if so, mark as a switch and break the loop:
                            shouldSwitch = true;
                            break;
                        }
                    }
                }
            }
        }

        if (shouldSwitch) {
            /*If a switch has been marked, make the switch
            and mark that a switch has been done:*/
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
        }
    }
}

function fn_Days_to_AvgTime(time) {
    var total = 0;
    var seconds = 0, days = 0, hours = 0, minutes = 0;
    if (time != "undefined" && time != "") {
        days = parseInt(time.split(" ")[0]);
        days = days * 24 * 60 * 60;
        hours = parseInt(time.split(" ")[1]);
        hours = hours * 60 * 60;
        minutes = parseInt(time.split(" ")[2]);
        minutes = minutes * 60;
        seconds = parseInt(time.split(" ")[3]);
    }
    total = days + hours + minutes + seconds;
    return (total);
}


function BindIframe() {
    $('.iframe .ion-ios-eye-outline').popover({
        html: true,
        trigger: "click",
        placement: "right",
        content: function () {
            var datapage = $(this).attr("data-page");
            return `<iframe src=${datapage} style="border:none; width:100%; height:250px;" scrolling="yes" frameborder="0"></iframe>`;
        }
    });
}

function PrefixZero(n) {
    return (n < 10) ? ("0" + n) : n;
}

function GenerateUniqueId() {
    return Math.floor(new Date().valueOf() * Math.random());
}


function GetDateCountForGraphData(graphData, FromDate, ToDate) {
    let GraphDataList = [];
    try {
        let From = '';
        if (duration == 1) {
            From = new Date(ToDate);
        } else {
            From = new Date(FromDate);
            From = new Date(From.setDate(From.getDate() + 1));
        }

        let To = new Date(ToDate);
        if (graphData != null && graphData.length > 0) {
            let Dates = GetFromAndToDateDays(From, To);
            for (let i = 0; i < Dates.length; i++) {
                let DateObject = null;
                let Date1 = GetDate(Dates[i]);
                for (let j = 0; j < graphData.length; j++) {
                    let Date2 = GetDate(graphData[j].Date);
                    if (Date1 == Date2) {
                        DateObject = graphData[j];

                        if (DateObject.Date.toString().indexOf("T") > -1)
                            DateObject.Date = new Date(DateObject.Date.toString());

                        if (DateObject.Date.toString().indexOf("/") > -1)
                            DateObject.Date = ToJavaScriptDateFromNumber(DateObject.Date.toString());

                        GraphDataList.push(DateObject);
                        break;
                    }
                }

                if (DateObject == null) {
                    GraphDataList.push({ Date: Dates[i], Count: 0 });
                }
            }
        }
    } catch (ex) {
        console.log(ex)
    }

    return GraphDataList;
}

function GetFromAndToDateDays(FromDate, ToDate) {
    let Dates = [];
    Dates.push(FromDate);
    let DaysDifference = GetNoOfDaysBetweenTwoDates(FromDate, ToDate);
    let i = 1;
    let date = FromDate;
    while (i <= DaysDifference) {
        date = addDays(date, 1);
        Dates.push(date);
        i++;
    }
    return Dates;
}

function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

function GetNoOfDaysBetweenTwoDates(From, To) {
    const diffTime = Math.abs(To - From);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

function GetDate(OnlyDate) {

    if (isDateObject(OnlyDate)) {
        return OnlyDate.getFullYear() + "-" + AddingPrefixZeroDayMonth(OnlyDate.getMonth() + 1) + "-" + AddingPrefixZeroDayMonth(OnlyDate.getDate());
    }

    let dateString = OnlyDate.toString();

    if (dateString.indexOf("T") > -1) {
        let datetimeT = dateString.split('T');
        return datetimeT[0];
    }

    if (dateString.indexOf("/") > -1) {
        OnlyDate = ToJavaScriptDateFromNumber(dateString);
    }
    return OnlyDate.getFullYear() + "-" + AddingPrefixZeroDayMonth(OnlyDate.getMonth() + 1) + "-" + AddingPrefixZeroDayMonth(OnlyDate.getDate());
}

function isDateObject(value) {
    return value instanceof Date;
}

function LoadCachedUniqueVisits(type, parameter, FromDateTime, ToDateTime) {
    ShowPageLoading();
    $(".popupcontainer").removeClass('hideDiv');
    GetCachedUniqueVisitsDetails(type, parameter, FromDateTime, ToDateTime);
    ShowPageLoading();
}

function getReadableForeColor(sHexColor) {
    //HEX to RGB
    const hexToRgb = hex =>
        hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i
            , (m, r, g, b) => '#' + r + r + g + g + b + b)
            .substring(1).match(/.{2}/g)
            .map(x => parseInt(x, 16));
    var rgb = hexToRgb(sHexColor);

    const brightness = Math.round(((parseInt(rgb[0]) * 299) +
        (parseInt(rgb[1]) * 587) +
        (parseInt(rgb[2]) * 114)) / 1000);
    return (brightness > 125) ? 'black' : 'white';
}

function forceDownload(url, fileName) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.responseType = "blob";
    xhr.onload = function () {
        var urlCreator = window.URL || window.webkitURL;
        var imageUrl = urlCreator.createObjectURL(this.response);
        var tag = document.createElement('a');
        tag.href = imageUrl;
        tag.download = fileName;
        document.body.appendChild(tag);
        tag.click();
        document.body.removeChild(tag);
    }
    xhr.send();
}

function GetLoggedInUserInfo() {
    $.ajax({
        url: "/General/GetUserLoginFullDetails",
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            LoggedInUserInfo = response;
        },
        error: ShowAjaxError
    });
}
function PreinitalizeValue(UserFieldData) {

    if (UserFieldData != null && Object.keys(UserFieldData).length > 0 && LoggedInUserInfo != undefined) {
        for (var FieldData in UserFieldData) {

            for (var UserData in LoggedInUserInfo) {

                if (FieldData == UserData) {
                    $('#' + UserFieldData[FieldData]).val(LoggedInUserInfo[UserData]);
                    break;
                }
            }
        }
    }
}

function NumberToWords(number) {
    var digit = ['ZERO', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE'];
    var elevenSeries = ['TEN', 'ELEVEN', 'TWELVE', 'THIRTEEN', 'FOURTEEN', 'FIFTEEN', 'SIXTEEN', 'SEVENTEEN', 'EIGHTEEN', 'NINETEEN'];
    var countingByTens = ['TWENTY', 'THIRTY', 'FORTY', 'FIFTY', 'SIXTY', 'SEVENTY', 'EIGHTY', 'NINETY'];
    var shortScale = ['', 'THOUSAND', 'MILLION', 'BILLION', 'TRILLION'];

    number = number.toString();
    number = number.replace(/[\, ]/g, '');
    if (number != parseFloat(number)) {
        return 'NOT A NUMBER';
    }
    var x = number.indexOf('.');
    if (x == -1) {
        x = number.length;
    }
    if (x > 15) {
        return 'TOO BIG';
    }
    var n = number.split('');
    var str = '';
    var sk = 0;
    for (var i = 0; i < x; i++) {
        if ((x - i) % 3 == 2) {
            if (n[i] == '1') {
                str += elevenSeries[Number(n[i + 1])] + ' ';
                i++;
                sk = 1;
            } else if (n[i] != 0) {
                str += countingByTens[n[i] - 2] + ' ';
                sk = 1;
            }
        } else if (n[i] != 0) {
            str += digit[n[i]] + ' ';
            if ((x - i) % 3 == 0) {
                str += 'HUNDRED ';
            }
            sk = 1;
        }
        if ((x - i) % 3 == 1) {
            if (sk) {
                str += shortScale[(x - i - 1) / 3] + ' ';
            }
            sk = 0;
        }
    }
    if (x != number.length) {
        var y = number.length;
        str += 'POINT ';
        for (var i = x + 1; i < y; i++) {
            str += digit[n[i]] + ' ';
        }
    }
    str = str.replace(/\number+/g, ' ');
    return str.trim() + ".";
}


//Replace Single quote in name

function ReplaceSingleQuote(name) {
    if (name != undefined && name != null) {
        return name.replace(/'/g, "\\\'").replace(/&#39;/g, "\\\'");
    }
    return name;
}

function ReplaceHtmlUrl(name) {
    if (name != undefined && name != null) {
        return name.replace(/&/g, "$@").replace(/#/g, "@$@");
    }
    return name;
}

function getFromAndToDateInUTC(fromGeneralDate, toGeneraldate) {
    if (fromGeneralDate.length == 0 && toGeneraldate.val().length == 0) {
        ShowErrorMessage(GlobalErrorList.PageHeadingWithDate.daterange_error);
        return false;
    }

    if (fromGeneralDate.length == 0) {
        ShowErrorMessage(GlobalErrorList.PageHeadingWithDate.from_date_range_error);
        return false;
    }

    if (toGeneraldate.length == 0) {
        ShowErrorMessage(GlobalErrorList.PageHeadingWithDate.to_date_range_error);
        return false;
    }

    if (!isGoodDate(fromGeneralDate)) {
        ShowErrorMessage(GlobalErrorList.PageHeadingWithDate.date_incorrect_format);

        return false;
    }

    if (!isGoodDate(toGeneraldate)) {
        ShowErrorMessage(GlobalErrorList.PageHeadingWithDate.date_incorrect_format);
        return false;
    }

    if (IsGreaterThanTodayDates(fromGeneralDate)) {
        ShowErrorMessage(GlobalErrorList.PageHeadingWithDate.from_date_Exceeded_error);
        return false;
    }

    if (IsGreaterThanTodayDates(toGeneraldate)) {
        ShowErrorMessage(GlobalErrorList.PageHeadingWithDate.to_date_Exceeded_error);
        return false;
    }

    if (isFromBiggerThanTo(fromGeneralDate, toGeneraldate)) {
        ShowErrorMessage(GlobalErrorList.PageHeadingWithDate.from_date_less_then_error);
        return false;
    }

    let fromgeneraldate = new Date(fromGeneralDate);
    let togeneraldate = new Date(toGeneraldate);

    let startdate = fromgeneraldate.getFullYear() + '-' + AddingPrefixZeroDayMonth((fromgeneraldate.getMonth() + 1)) + '-' + AddingPrefixZeroDayMonth(fromgeneraldate.getDate()) + " 00:00:00";
    let enddate = togeneraldate.getFullYear() + '-' + AddingPrefixZeroDayMonth((togeneraldate.getMonth() + 1)) + '-' + AddingPrefixZeroDayMonth(togeneraldate.getDate()) + " 23:59:59";

    fromgeneraldate = ConvertDateTimeToUTC(startdate);
    fromgeneraldate = fromgeneraldate.getFullYear() + '-' + AddingPrefixZeroDayMonth((fromgeneraldate.getMonth() + 1)) + '-' + AddingPrefixZeroDayMonth(fromgeneraldate.getDate()) + " " + AddingPrefixZeroDayMonth(fromgeneraldate.getHours()) + ":" + AddingPrefixZeroDayMonth(fromgeneraldate.getMinutes()) + ":" + AddingPrefixZeroDayMonth(fromgeneraldate.getSeconds());

    togeneraldate = ConvertDateTimeToUTC(enddate);
    togeneraldate = togeneraldate.getFullYear() + '-' + AddingPrefixZeroDayMonth((togeneraldate.getMonth() + 1)) + '-' + AddingPrefixZeroDayMonth(togeneraldate.getDate()) + " " + AddingPrefixZeroDayMonth(togeneraldate.getHours()) + ":" + AddingPrefixZeroDayMonth(togeneraldate.getMinutes()) + ":" + AddingPrefixZeroDayMonth(togeneraldate.getSeconds());

    return [fromgeneraldate, togeneraldate];
}

function IsGreaterThanTodayDates(chkdate) {
    var todayDate = new Date(new Date().toLocaleString("en-US", { timeZone: TimeZoneData[0] })).toISOString().slice(0, 10);
    var from = new Date(chkdate).getTime();
    var to = new Date(todayDate).getTime();
    return from > to;
}

function isFromBiggerThanTo(dtmfrom, dtmto) {
    var from = new Date(dtmfrom).getTime();
    var to = new Date(dtmto).getTime();
    return from > to;
}

function AddingPrefixZeroDayMonth(n) {
    return (n < 10) ? ("0" + n) : n;
}

function DateFormatToSlash(dateStr) { // 06/01/2023
    const dateObj = new Date(dateStr);

    const formattedDate = dateObj.toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
    });

    return formattedDate;
}

var idleTime = 0;
function UserIdleSignOut() {
    // Increment the idle time counter every minute.
    var idleInterval = setInterval(timerIncrement, 60000); // 1 minute

    // Zero the idle timer on mouse movement.
    $(this).mousemove(function (e) {
        idleTime = 0;
    });
    $(this).keypress(function (e) {
        idleTime = 0;
    });
}

function timerIncrement() {
    idleTime = idleTime + 1;
    if (idleTime > parseInt(SessionTimeout)) { // 20 minutes
        //window.location.reload();
        window.location.href = "/Login/SignOut";
    }
}

//Confirmation to Execute longer Method
setTimeout(function () {
    if (typeof xhr === 'object') {
        var checkHttpRequest = setInterval(function () {
            if (xhr.readyState == 1 && $('#HttpMethodConfirmation').css('display') == 'none') {
                //console.log('bb');
                $("#HttpMethodConfirmation").css({ "padding-right": "10px", "display": "block", "z-index": "10000" });
                clearHttpMethod();
            } else {
                $("#HttpMethodConfirmation").css({ "display": "none" });
            }
        }, 15000);
    }
}, 5000);

function clearHttpMethod() {
    setInterval(function () {
        if (xhr.readyState == 4 && $('#HttpMethodConfirmation').css('display') == 'block') {
            $("#HttpMethodConfirmation").css({ "display": "none" });
        }
    }, 3000);
}

function cancelHttpMethod() {
    xhr.abort();
    $("#HttpMethodConfirmation").css({ "display": "none" });
}
//End Confirmation to Execute longer Method
