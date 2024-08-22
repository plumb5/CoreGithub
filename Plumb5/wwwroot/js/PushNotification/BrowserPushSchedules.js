var maxRowCount = 0, rowIndex = 0, viewMoreDisable = false;
var sheduleDetails = [];
var templateList = [];

$(document).ready(function () {    
    GetBrowserPushTemplate();
    GetDateTimeRange(1);
});

function GetBrowserPushTemplate() {
    $.ajax({
        url: "/Push/Send/GetAllTemplateDetails",
        type: 'Post',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (temp) {
            $.each(temp, function () {
                templateList.push({ label: $(this)[0].CampaignName, value: $(this)[0].CampaignName, assignedValue: $(this)[0].PushId });
            });
        },
        error: ShowAjaxError
    });
}

$("#ui_txtTemplate").autocomplete({
    autoFocus: true,
    minLength: 1,
    source: templateList,
    select: function (events, selectedvalue) {
        $("#ui_txtTemplate").attr("templateid", selectedvalue.item.assignedValue);
    },
    change: function (events, selectedvalue) {
        if (selectedvalue.item == null) {
            $("#ui_txtTemplate").attr("templateid", 0);
        }
    }
})

var CallBackFunction = function () {
    maxRowCount = OffSet = rowIndex = 0;
    $("#ui_dvData").empty();
    GetMaxCount();

};

function GetMaxCount() {

    $.ajax({
        url: "/Push/Schedules/GetMaxCount",
        type: 'POST',
        data: JSON.stringify({ 'FromDateTime': FromDateTime, 'ToDateTime': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            maxRowCount = result;
            if (maxRowCount == 0) {
                $("#dvViewMore, #dvLoading, #divcontent").hide();
                $("#dvDefault").show();
            }
            else if (maxRowCount > 0) {
                $("#dvDefault").hide();
                $("#dvViewMore").show();
                hideCalendarControl();
                var numberOfRecords = GetNumberOfRecordsPerPage();

                CreateTable(numberOfRecords);
                rowIndex = 0;
                if (maxRowCount > numberOfRecords) {
                    $("#ui_lnkViewMore,#dvViewMore").show();
                }
            }
        },
        error: ShowAjaxError
    });
}

function ViewMore() {
    if (!viewMoreDisable) {
        $("#dvLoading").show();
        viewMoreDisable = true;
        var numberOfRecords = GetNumberOfRecordsPerPage();
        CreateTable(numberOfRecords);
    }
}

function CreateTable(numberRowsCount) {

    var OffSet = rowIndex;
    var FetchNext = numberRowsCount;

    $.ajax({
        url: "/Push/Schedules/ShowSetSchedule",
        type: 'POST',
        data: JSON.stringify({ 'OffSet': OffSet, 'FetchNext': FetchNext, 'FromDateTime': FromDateTime, 'ToDateTime': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: onSuccess,
        error: ShowAjaxError
    });
}

function onSuccess(responseData) {
    rowIndex = responseData.length + rowIndex;


    $("#div_Records").html(rowIndex + " out of " + maxRowCount + " records");

    if (rowIndex == maxRowCount) {
        $("#ui_lnkViewMore").hide();
    }

    if (rowIndex > 1 || maxRowCount > 1)
        $(".ActionFieldOnPage").show();
    else
        $(".ActionFieldOnPage").hide();

    $("#divcontent").show();

    $.each(responseData, function (i) {
        sheduleDetails.push($(this)[0]);
        AppendScheduledDetails($(this)[0]);
    });

    $("#dvLoading").hide();
    viewMoreDisable = false;
    //CheckAccessPermission("SMS");
}

AppendScheduledDetails = function (DripsDetails) {
    var tdContent = "";
    var groupName = DripsDetails.GroupName == null ? "&nbsp;" : DripsDetails.GroupName;
    var BrowserPushCampaignName, templateName;

    if (groupName.length > 40)
        groupName = groupName.substring(0, 40) + "..";

    if (DripsDetails.BrowserPushCampaignName.length > 40)
        BrowserPushCampaignName = DripsDetails.BrowserPushCampaignName.substring(0, 40) + "..";
    else
        BrowserPushCampaignName = DripsDetails.BrowserPushCampaignName;


    if (DripsDetails.TemplateName.length > 40)
        templateName = DripsDetails.TemplateName.substring(0, 40) + "..";
    else
        templateName = DripsDetails.TemplateName;


    tdContent += "<div style='float: left; width: 26%; text-align: left;' id=lblDripName_" + DripsDetails.BrowserPushSendingSettingId + " title='" + DripsDetails.TemplateName + "'>" + templateName + "</div>";
    tdContent += "<div style='float: left; width: 26%; text-align: left;' title='" + DripsDetails.BrowserPushCampaignName + "'>" + BrowserPushCampaignName + "</div>";

    tdContent += "<div style='float: left; width: 26%; text-align: left;' title='" + DripsDetails.GroupName + "'>" + groupName + "</div>";
    var statusAndEditOption = GetStatus(DripsDetails.ScheduledStatus, DripsDetails.ApprovalStatus);

    tdContent += "<div style='float: left; width: 3%; text-align: right;'>" + statusAndEditOption.imageTag + "</div>";
    tdContent += "<div style='float: left; width: 11%;text-align: right;' id=tdDate_" + DripsDetails.BrowserPushSendingSettingId + ">" + $.datepicker.formatDate("M dd", GetJavaScriptDateObj(DripsDetails.ScheduledDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(DripsDetails.ScheduledDate)) + "</div>";
    if (statusAndEditOption.IsEditable) {
        tdContent += "<div style='float: left; width: 4%;text-align: right;' id=tdEdit_" + DripsDetails.BrowserPushSendingSettingId + " class='ContributePermission'><span style='cursor:pointer;'  onclick='EditSchedule(" + DripsDetails.BrowserPushSendingSettingId + "," + DripsDetails.BrowserPushTemplateId + ");'>Edit</span></div>";

    }
    else {
        tdContent += "<div style='float: left; width: 4%;text-align: right;' id=tdEdit_" + DripsDetails.BrowserPushSendingSettingId + "' class='ContributePermission'>NA</div>";

    }
    tdContent += "<div style='float: right; width: 4%;text-align: right;'><img  onclick='DeleteDripOrSchedule(" + DripsDetails.BrowserPushSendingSettingId + ");' src='/images/img_trans.gif' border='0' class='DeleteImg FullControlPermission' alt='Delete' title='Delete' style='cursor:pointer' /></div>";

    tdContent = "<div class='itemStyle' id='tr_divScheduled" + DripsDetails.BrowserPushSendingSettingId + "'>" + tdContent + "</div>";

    $("#ui_dvData").append(tdContent)
};


var monthDetials = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
var duration = 0;
var FromDateTime, ToDateTime;
var FromDateTime_JsDate, ToDateTime_JsDate;

$(".CustomDateProvider").click(function () {

    if ($('#dvCustomFilter').is(":visible")) {
        $('#dvCustomFilter').hide('slow');
    }
    else {
        $('#dvCustomFilter').show('slow');
    }
    hideCalendarControl();
});


function GetDateTimeRange(duration) {

    var fromdate = '', todate = '';
    $("#dvLoading").show();
    $("#dvCustomFilter").css("display", "none");

    if (duration == 5) {

        $(".button").attr("class", "button1");

        if ($("#txtDateFrom").val().length == 0) {
            ShowErrorMessage("Please enter From date range");
            $("#dvCustomFilter").show();
            $("#txtDateFrom").focus();
            $("#dvLoading").hide();
            return false;
        }

        if ($("#txtDateTo").val().length == 0) {
            ShowErrorMessage("Please enter To date range");
            $("#dvCustomFilter").show();
            $("#txtDateTo").focus();
            $("#dvLoading").hide();
            return false;
        }

        var fromdate = $("#txtDateFrom").val();
        var todate = $("#txtDateTo").val();

        $("#btn" + duration).attr("GraphBindingId", duration);
        var startEndDates = BindDate(duration, fromdate, todate);
        fromdate = startEndDates[0];
        todate = startEndDates[1];
    }
    else if (duration == 1 || duration == 2 || duration == 3 || duration == 4) {
        $(".button").attr("class", "button1");
        $("#btn" + duration).attr("class", "button buttonWithourCurve");
        $("#btn" + duration).attr("GraphBindingId", duration);

        var startEndDates = BindDate(duration, fromdate, todate);
        fromdate = startEndDates[0];
        todate = startEndDates[1];
        duration = startEndDates[2];
    }

    fromdate = ConvertDateTimeToUTC(fromdate);
    fromdate = fromdate.getFullYear() + '-' + AddingPrefixZero((fromdate.getMonth() + 1)) + '-' + AddingPrefixZero(fromdate.getDate()) + " " + AddingPrefixZero(fromdate.getHours()) + ":" + AddingPrefixZero(fromdate.getMinutes()) + ":" + AddingPrefixZero(fromdate.getSeconds());

    todate = ConvertDateTimeToUTC(todate);
    todate = todate.getFullYear() + '-' + AddingPrefixZero((todate.getMonth() + 1)) + '-' + AddingPrefixZero(todate.getDate()) + " " + AddingPrefixZero(todate.getHours()) + ":" + AddingPrefixZero(todate.getMinutes()) + ":" + AddingPrefixZero(todate.getSeconds());

    FromDateTime = fromdate;
    ToDateTime = todate;
    CallBackFunction();
}

function BindDate(dur, frm, to) {
    var a = new Date(), b = new Date(), startdate = '', enddate = '';
    switch (dur) {
        case 1:
            window.lblDate.innerHTML = a.getDate() + ' ' + monthDetials[a.getMonth()] + ' ' + a.getFullYear();
            startdate = a.getFullYear() + '-' + AddingPrefixZero((a.getMonth() + 1)) + '-' + AddingPrefixZero(a.getDate());
            enddate = a.getFullYear() + '-' + AddingPrefixZero((a.getMonth() + 1)) + '-' + AddingPrefixZero(a.getDate());
            break;
        case 2:
            b.setDate(b.getDate() + 6);
            window.lblDate.innerHTML = a.getDate() + ' ' + monthDetials[a.getMonth()] + ' ' + a.getFullYear() + ' - ' + b.getDate() + ' ' + monthDetials[b.getMonth()] + ' ' + b.getFullYear();
            startdate = a.getFullYear() + '-' + AddingPrefixZero((a.getMonth() + 1)) + '-' + AddingPrefixZero(a.getDate());
            enddate = b.getFullYear() + '-' + AddingPrefixZero((b.getMonth() + 1)) + '-' + AddingPrefixZero(b.getDate());
            break;
        case 3:
            b.setMonth(a.getMonth() + 1);
            b.setDate(b.getDate() + 1);
            window.lblDate.innerHTML = (a.getDate()) + ' ' + monthDetials[a.getMonth()] + ' ' + a.getFullYear() + ' - ' + b.getDate() + ' ' + monthDetials[b.getMonth()] + ' ' + b.getFullYear();
            startdate = a.getFullYear() + '-' + AddingPrefixZero((a.getMonth() + 1)) + '-' + AddingPrefixZero(a.getDate());
            enddate = b.getFullYear() + '-' + AddingPrefixZero((b.getMonth() + 1)) + '-' + AddingPrefixZero(b.getDate());
            break;
        case 4:
            b.setDate(a.getDate() + 365);
            window.lblDate.innerHTML = monthDetials[a.getMonth()] + ' ' + a.getFullYear() + ' - ' + monthDetials[b.getMonth()] + ' ' + b.getFullYear();
            startdate = a.getFullYear() + '-' + AddingPrefixZero((a.getMonth() + 1)) + '-' + AddingPrefixZero(a.getDate());
            enddate = b.getFullYear() + '-' + AddingPrefixZero((b.getMonth() + 1)) + '-' + AddingPrefixZero(b.getDate());
            break;
        case 5:
            a = new Date(frm);
            b = new Date(to);
            window.lblDate.innerHTML = a.getDate() + ' ' + monthDetials[a.getMonth()] + ' ' + a.getFullYear() + ' - ' + b.getDate() + ' ' + monthDetials[b.getMonth()] + ' ' + b.getFullYear();
            startdate = a.getFullYear() + '-' + AddingPrefixZero((a.getMonth() + 1)) + '-' + AddingPrefixZero(a.getDate());
            enddate = b.getFullYear() + '-' + AddingPrefixZero((b.getMonth() + 1)) + '-' + AddingPrefixZero(b.getDate());
            break;
        default:
            break;
    }
    FromDateTime_JsDate = a;
    ToDateTime_JsDate = b;
    startdate = startdate + " " + $("#ui_ddlFromTimeHour").val() + ":" + $("#ui_ddlFromTimeMin").val() + ":00";
    enddate = enddate + " " + $("#ui_ddlToTimeHour").val() + ":" + $("#ui_ddlToTimeMin").val() + ":59";
    duration = dur;
    return [startdate, enddate, duration];
}

function hideCalendarControl() {
    if (calendarControl.visible()) {
        calendarControl.hide();
    }
}
function showCalendarControl(textField) {
    calendarControl.show(textField);
}

function AddingPrefixZero(n) {
    return (n < 10) ? ("0" + n) : n;
}



function GetStatus(ScheduledStatus, ApprovalStatus) {

    if (ScheduledStatus == 0 && ApprovalStatus == 1) {

        return { imageTag: "<img title='Sms have been sent' src='/images/img_trans.gif' class='ActiveImg' />", IsEditable: false };
    }
    else if (ScheduledStatus == 2 && ApprovalStatus == 1) {

        return { imageTag: "<img title='Campaign in progess' src='/images/img_trans.gif' class='CampaignInprogess' />", IsEditable: false };
    }
    else if (ApprovalStatus == 1) {

        return { imageTag: "<img title='Campaign approved.Sms will be sent on schedule date/time.' src='/images/img_trans.gif' class='CampaingnApproved' />", IsEditable: true };

    }
}


function DeleteDripOrSchedule(Id) {

    $("#dialog-confirm").css({ 'font-size': "13px" });

    $("#dialog-confirm").dialog({
        resizable: false,
        height: 170,
        modal: true,
        buttons: {
            "Delete": function () {

                DeleteDetails(Id);
                $(this).dialog("close");
            },
            Cancel: function () {
                $(this).dialog("close");
            }
        }
    });
}

DeleteDetails = function (Id) {

    $.ajax({
        url: "/Push/Schedules/DeleteSetSchedule",
        type: 'POST',
        data: JSON.stringify({ 'Id': Id }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response.Status) {
                $("#tr_divScheduled" + Id).hide("slow");
                ShowErrorMessage(response.Message);
                --rowIndex;
                --maxRowCount;
            }
            $("#div_Records").html(rowIndex + " out of " + maxRowCount + " records");
            if (rowIndex <= 0) {
                $("#divcontent").hide();
                $("#dvDefault").show();
            }
        },
        error: ShowAjaxError
    });
};


var BrowserPushSendingSettingIdForUpdate = 0;
function EditSchedule(BrowserPushSendingSettingId, BrowserPushTemplateId) {

    BrowserPushSendingSettingIdForUpdate = BrowserPushSendingSettingId;
    $.ajax({
        url: "/Push/Schedules/GetSchedule",
        type: 'Post',
        data: JSON.stringify({ 'BrowserPushSendingSettingId': BrowserPushSendingSettingId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response.Status) {
                for (var i = 0; i <= templateList.length; i++) {
                    if (templateList[i].assignedValue == BrowserPushTemplateId) {
                        $("#ui_txtTemplate").val(templateList[i].label).attr("templateid", templateList[i].assignedValue).change();
                        break;
                    }
                }

                $(".bgShadedDiv").show();
                var date = GetJavaScriptDateObj(response.SmsScheduled.ScheduledDate);
                var time = date.getHours();
                if (date.getMinutes() == "15")
                    time = time + ".15";
                else if (date.getMinutes() == "30")
                    time = time + ".30";
                else if (date.getMinutes() == "45")
                    time = time + ".45";

                date = date.getFullYear() + "-" + parseInt(date.getMonth() + 1) + "-" + date.getDate();
                $("#ui_txtDripDate").val(date);
                $("#ui_dllScheduleTime").val(time);
                $("#dvUpdateSchedule").show();
            }
            else {
                ShowErrorMessage("Some thing went wrong");
            }
        },
        error: ShowAjaxError
    });
}

$("#ui_btnUpdate").click(function () {
    $("#dvLoading").show();

    UpdateForSchedules();

});

function UpdateForSchedules() {

    if (!ValidationDripUpdate()) {
        $("#dvLoading").hide();
        return;
    }

    var browserPushScheduled = new Object();
    browserPushScheduled.BrowserPushSendingSettingId = BrowserPushSendingSettingIdForUpdate;

    if ($("#ui_dllScheduleTime").val().includes("15"))
        browserPushScheduled.ScheduledDate = ScheduledDate = $("#ui_txtDripDate").val() + " " + $("#ui_dllScheduleTime").val().toString().replace('.', ':') + ":00";

    else if ($("#ui_dllScheduleTime").val().includes("30"))
        browserPushScheduled.ScheduledDate = ScheduledDate = $("#ui_txtDripDate").val() + " " + $("#ui_dllScheduleTime").val().toString().replace('.', ':') + ":00";

    else if ($("#ui_dllScheduleTime").val().includes("45"))
        browserPushScheduled.ScheduledDate = ScheduledDate = $("#ui_txtDripDate").val() + " " + $("#ui_dllScheduleTime").val().toString().replace('.', ':') + ":00";

    else
        browserPushScheduled.ScheduledDate = ScheduledDate = $("#ui_txtDripDate").val() + " " + $("#ui_dllScheduleTime").val().toString().replace('.', ':') + ":00:00";

    var BrowserPushTemplateId = $("#ui_txtTemplate").attr("templateid");

    var ScheduledDates = ConvertDateTimeToUTC(browserPushScheduled.ScheduledDate);
    browserPushScheduled.ScheduledDate = ScheduledDate = ScheduledDates.getFullYear() + '-' + AddingPrefixZero((ScheduledDates.getMonth() + 1)) + '-' + AddingPrefixZero(ScheduledDates.getDate()) + " " + AddingPrefixZero(ScheduledDates.getHours()) + ":" + AddingPrefixZero(ScheduledDates.getMinutes()) + ":" + AddingPrefixZero(ScheduledDates.getSeconds());

    $.ajax({
        url: "/Push/Schedules/UpdateScheduledSms",
        type: 'POST',
        data: JSON.stringify({ 'BrowserPushTemplateId': BrowserPushTemplateId, 'scheduled': browserPushScheduled }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response) {
                ShowErrorMessage("Updated successfully");

                let SchedulerDatetime = "";
                if ($("#ui_dllScheduleTime").val().includes("15"))
                    SchedulerDatetime = $("#ui_txtDripDate").val() + " " + $("#ui_dllScheduleTime").val().toString().replace('.', ':') + ":00";
                else if ($("#ui_dllScheduleTime").val().includes("30"))
                    SchedulerDatetime = $("#ui_txtDripDate").val() + " " + $("#ui_dllScheduleTime").val().toString().replace('.', ':') + ":00";
                else if ($("#ui_dllScheduleTime").val().includes("45"))
                    SchedulerDatetime = $("#ui_txtDripDate").val() + " " + $("#ui_dllScheduleTime").val().toString().replace('.', ':') + ":00";
                else
                    SchedulerDatetime = $("#ui_txtDripDate").val() + " " + $("#ui_dllScheduleTime").val().toString().replace('.', ':') + ":00:00";

                UpdateConentInGridView(BrowserPushSendingSettingIdForUpdate, BrowserPushTemplateId, SchedulerDatetime);
                setTimeout(function () { HideUpdateSchedule(); }, 1000);

            } else {
                ShowErrorMessage("Some problem in updating");
            }
            $("#dvLoading").hide();
        },
        error: function (objxmlRequest) {
            $("#dvLoading").hide();
            window.console.log(objxmlRequest.responseText);
        }
    });


}

ValidationDripUpdate = function () {

    if ($("#ui_txtTemplate").attr("templateid") == 0) {
        $("#lblMesg").html("Please select template from list.");
        return false;
    }

    if ($.trim($("#ui_txtDripDate").val()).length == 0) {
        $("#lblMesg").html("Please enter date.");
        return false;
    }

    if ($.trim($("#ui_txtDripDate").val()).length > 0) {
        var selectedDatestring = $("#ui_txtDripDate").val().split("-");
        var selectedDate = new Date(selectedDatestring[0], parseInt(selectedDatestring[1]) - 1, selectedDatestring[2], $("#ui_dllScheduleTime").val());
        if ($("#ui_dllScheduleTime").val().toString().includes("15"))
            selectedDate.setMinutes(15);
        else if ($("#ui_dllScheduleTime").val().toString().includes("30"))
            selectedDate.setMinutes(30);
        else if ($("#ui_dllScheduleTime").val().toString().includes("45"))
            selectedDate.setMinutes(45);

        if (selectedDate <= new Date()) {
            ShowErrorMessage("Please enter date and time form next hour onwards.");
            return false;
        }
    }
    $("#lblMesg").html("");
    return true;
}

HideUpdateSchedule = function () {

    $(".CustomPopUp,.bgShadedDiv").hide();
    hideCalendarControl();
};

UpdateConentInGridView = function (dripUpdateId, templateId, dripDate) {

    $("#ui_txtTemplate").attr("templateid");
    $("#lblDripName_" + dripUpdateId).html($('#ui_txtTemplate').val());

    $("#tdDate_" + dripUpdateId).html($.datepicker.formatDate("M dd", DripCustomDate(dripDate)) + " " + PlumbTimeFormat(DripCustomDate(dripDate)));
    let scheduleDate = new Date(dripDate);
    $("#tdDate_" + dripUpdateId).removeAttr("scheduledate").attr("scheduledate", "/Date(" + Number(scheduleDate) + ")/");

    $("#tdEdit_" + dripUpdateId).removeAttr('onclick').attr('onclick', 'EditSchedule(' + dripUpdateId + ',' + templateId + ');');    

    //CheckAccessPermission("Sms");
    
};

DripCustomDate = function (cdate) {
    var dDate, createDate;
    cdate = $.trim(cdate);
    if (cdate.indexOf(" ") > 0) {
        var dDate = cdate.split('-');
        var Day = dDate[2].split(" ");
        var time = $.trim(Day[1]).split(":");
        createDate = new Date(dDate[0], parseInt(dDate[1]) - 1, Day[0], time[0], time[1]);
    }
    else {
        var dDate = cdate.split('-');
        createDate = new Date(dDate[2], parseInt(dDate[1]) - 1, dDate[0]);
    }
    return createDate;
};