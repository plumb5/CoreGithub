
var PrevMonthCliked;
var NextMonthClicked;
var SelectedDate = new Date();
$(document).ready(function () {
    ShowPageLoading();
    GetCampaignRepot();
    HidePageLoading();
});

function GetCampaignRepot(){
    var calendarEl = document.getElementById("campcal");

    ////calendar Date range//////////////////////////////////////
    let startdate = new Date();
    let fromdate = GetUTCStartDateTime(startdate);
    let todate = GetUTCEndDateTime(startdate);

    let sdate = new Date();
    sdate.setDate(0);
    sdate.setDate(1);
    let edate = new Date();
    edate.setMonth(edate.getMonth() + 2);
    edate = new Date(edate.getFullYear(), edate.getMonth() + 1, 0);


    ////calendar set options//////////////////////////////////////
    var calendar = new FullCalendar.Calendar(calendarEl, {
        themeSystem: "bootstrap",
        headerToolbar: {
            left: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
            center: "title",
            right: "today prev,next"

        },
        validRange: function (nowDate) {
            return {
                start: sdate,
                end: edate
            };
        },       
        events: {
            url: "/Dashboard/CampaignCalendar/GetOverallScheduledDetails?AdsId=" + Plumb5AccountId + "&fromDateTime=" + fromdate + "&toDateTime=" + todate,
            method: "POST",
            extraParams: {
                'AdsId': Plumb5AccountId,
                "fromDateTime": fromdate,
                "toDateTime": todate
            },
            failure: function () {
                console.log("error Loading Calendar Data")
            }
        },
        eventTimeFormat: {
            hour: "numeric",
            minute: "2-digit",
            meridiem: "long"
        },
        eventDidMount: function (info) {
            //////////////////add icon and Bg color//////////////////////////////
            switch (info.event.extendedProps.campaigntype.toLowerCase()) {
                case "web":
                    {
                        $(info.el).find(".fc-event-title").prepend("<i class='icon ion-ios-analytics' style='font-size: 16px;vertical-align: middle;'></i>"); //all other views
                        $(info.el).find(".fc-list-event-title").prepend("<i class='icon ion-ios-analytics' style='color:#004c6d; font-size: 18px;'></i>"); /// for list view
                        info.event.setProp("backgroundColor", "#004c6d");
                        break;
                    }
                case "mob":
                    {
                        $(info.el).find(".fc-event-title").prepend("<i class='icon ion-iphone' style='font-size: 16px;vertical-align: middle;'></i>");
                        $(info.el).find(".fc-list-event-title").prepend("<i class='icon ion-iphone' style='color:#B55BBF; font-size: 18px;'></i>");
                        info.event.setProp("backgroundColor", "#B55BBF");
                        break;
                    }
                case "email":
                    {
                        $(info.el).find(".fc-event-title").prepend("<i class='icon ion-ios-email-outline' style='font-size: 16px;vertical-align: middle;'></i>");
                        $(info.el).find(".fc-list-event-title").prepend("<i class='icon ion-ios-email-outline' style='color:#f49e5c; font-size: 18px;'></i>");
                        info.event.setProp("backgroundColor", "#f49e5c");
                        break;
                    }
                case "sms":
                    {
                        $(info.el).find(".fc-event-title").prepend("<i class='icon ion-ios-chatbubble-outline' style='font-size: 16px;vertical-align: middle;'></i>");
                        $(info.el).find(".fc-list-event-title").prepend("<i class='icon ion-ios-chatbubble-outline' style='color:#488f31; font-size: 18px;'></i>");
                        info.event.setProp("backgroundColor", "#488f31");
                        break;
                    }
                case "whatsapp":
                    {
                        $(info.el).find(".fc-event-title").prepend("<i class='icon ion-social-whatsapp-outline' style='font-size: 16px;vertical-align: middle;'></i>");
                        $(info.el).find(".fc-list-event-title").prepend("<i class='icon ion-iphone' style='color:#B55BBF; font-size: 18px;'></i>");
                        info.event.setProp("backgroundColor", "#128c7e");
                        break;
                    }
            }

            //////////////////tooltip//////////////////////////////
            let calel = info.el;
            var tooltip = $(calel).popover({
                html: true,
                trigger: "hover",
                placement: "auto",
                content: function () {
                    $(".caltooltip").find("#pop_campid").text(info.event.title);
                    $(".caltooltip").find("#pop_campdesc").text(info.event.extendedProps.campaigndesc);
                    $(".caltooltip").find("#pop_tempname").text(info.event.extendedProps.templatename);
                    $(".caltooltip").find("#pop_grpname").text(info.event.extendedProps.groupname);
                    return $(".caltooltip").html();
                },
            });
            //////////////////tooltip//////////////////////////////
        }

    });
    calendar.render();
}

function AddingPrefixZeroDayMonth(n) {
    return (n < 10) ? ("0" + n) : n;
}

function GetUTCStartDateTime(date) {
    let startdate = new Date(date.getFullYear(), date.getMonth(), 1);

    let localstartdate = startdate.getFullYear() + '-' + AddingPrefixZeroDayMonth((startdate.getMonth() + 1)) + '-' + AddingPrefixZeroDayMonth(startdate.getDate()) + " 00:00:00";

    let fromdate = ConvertDateTimeToUTC(localstartdate);
    fromdate = fromdate.getFullYear() + '-' + AddingPrefixZeroDayMonth((fromdate.getMonth() + 1)) + '-' + AddingPrefixZeroDayMonth(fromdate.getDate()) + " " + AddingPrefixZeroDayMonth(fromdate.getHours()) + ":" + AddingPrefixZeroDayMonth(fromdate.getMinutes()) + ":" + AddingPrefixZeroDayMonth(fromdate.getSeconds());
    return fromdate;
}

function GetUTCEndDateTime(date) {
    let enddate = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    let localenddate = enddate.getFullYear() + '-' + AddingPrefixZeroDayMonth((enddate.getMonth() + 1)) + '-' + AddingPrefixZeroDayMonth(enddate.getDate()) + " 23:59:59";

    let todate = ConvertDateTimeToUTC(localenddate);
    todate = todate.getFullYear() + '-' + AddingPrefixZeroDayMonth((todate.getMonth() + 1)) + '-' + AddingPrefixZeroDayMonth(todate.getDate()) + " " + AddingPrefixZeroDayMonth(todate.getHours()) + ":" + AddingPrefixZeroDayMonth(todate.getMinutes()) + ":" + AddingPrefixZeroDayMonth(todate.getSeconds());

    return todate;
}