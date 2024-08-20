var ChannelType = '';
var CampaignName = "";
var TemplateName = "";

$(document).ready(() => {
    ExportFunctionName = "ExportCampaignOveriViewReport";
    GetTemplates();
    GetCampaignnames();
    GetUTCDateTimeRange(2);
});

function CallBackFunction() {
    ShowPageLoading();
    OffSet = 0;
    TotalRowCount = 0;
    CurrentRowCount = 0;
    GetMaxCount();
}

function CallBackPaging() {
    ShowPageLoading();
    CurrentRowCount = 0;
    GetReportData();
}


function GetMaxCount() {

    $.ajax({
        url: "/Dashboard/CampaignOverView/GetMaxCount",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime, 'CampaignName': CampaignName, 'TemplateName': TemplateName, 'ChannelType': ChannelType }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response != undefined && response != null && response.returnVal > 0) {
                TotalRowCount = response.returnVal;
            }

            if (TotalRowCount > 0) {
                GetReportData();
                ShowExportDiv(true);
            }
            else {
                $("#ui_trbodyReportData").empty();
                $("#ui_totaldivoverveiw").empty();
                SetNoRecordContent('ui_tableReport', 5, 'ui_trbodyReportData');
                HidePageLoading();
            }

        }
    })

}

function GetReportData() {

    FetchNext = GetNumberOfRecordsPerPage();

    $.ajax({
        url: "/Dashboard/CampaignOverView/GetReportDetails",
        type: 'POST',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'OffSet': OffSet, 'FetchNext': FetchNext, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime, 'CampaignName': CampaignName, 'TemplateName': TemplateName, 'ChannelType': ChannelType }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindReport,
        error: ShowAjaxError
    });
}

function BindReport(response) {
    CurrentRowCount = response.Table1.length;
    PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);

    if (response.Table1 !== undefined && response !== null && response.Table1 !== undefined && response.Table1 !== null && response.Table1.length > 0) {
        $("#ui_trbodyReportData").empty();
        $.each(response.Table1, function () {
            $("#ui_trbodyReportData").append(GetChannelGrid(this));
        });
    }

    if (ChannelType != undefined && ChannelType != null && ChannelType.length > 0) {
        if (response.Table11 !== undefined && response !== null && response.Table11 !== undefined && response.Table11 !== null && response.Table11.length > 0) {
            $("#ui_totaldivoverveiw").empty();
            $.each(response.Table11, function () {
                GetTotalChannelGrid(this);
            });
        } else {
            $("#ui_totaldivoverveiw").empty();
        }
    } else {
        $("#ui_totaldivoverveiw").empty();
    }

    HidePageLoading();
}

function GetChannelGrid(Data) {

    let RedirectUrl = "";

    if (Data.ChannelType.toLowerCase() == "email" && Data.IsWorkFlowOrNotification == 0 && Data.IsMailSplit == true) { //Redirect to ABTestingReport
        RedirectUrl = `<div class="tdiconwrap">
                            <a href="/Mail/AbTestingReport?duration=${duration}&ssid=${Data.Id}&frmdate=${FromDateTime}&todate=${ToDateTime}&SplitIdentifier=${Data.SplitIdentifier}"><img src="/Content/images/ab-testing.png" alt=""></a>
                            <a href="/Mail/AbTestingReport?duration=${duration}&ssid=${Data.Id}&frmdate=${FromDateTime}&todate=${ToDateTime}&SplitIdentifier=${Data.SplitIdentifier}"><i class="icon ion-ios-information"></i></a>
                       </div>`;
    } else if (Data.ChannelType.toLowerCase() == "email" && Data.IsWorkFlowOrNotification == 0 && Data.IsMailSplit == 0) { //Redirect to campaign
        RedirectUrl = `<a href="/Mail/Responses?duration=${duration}&ssid=${Data.Id}&frmdate=${FromDateTime}&todate=${ToDateTime}"><i class="icon ion-ios-information"></i></a>`;
    } else if (Data.ChannelType.toLowerCase() == "email" && Data.IsWorkFlowOrNotification == 2) { //Redirect to Alerts&Notification
        RedirectUrl = `<a href="/Mail/individualResponse?duration=${duration}&campid=${Data.CampaignId}&tempid=${Data.TemplatedId}&frmdate=${FromDateTime}&todate=${ToDateTime}"><i class="icon ion-ios-information"></i></a>`;
    } else if (Data.ChannelType.toLowerCase() == "sms" && Data.IsWorkFlowOrNotification == 0) { //Redirect to campaign
        RedirectUrl = `<a href="/Sms/Report?duration=${duration}&ssid=${Data.Id}&frmdate=${FromDateTime}&todate=${ToDateTime}"><i class="icon ion-ios-information"></i></a>`;
    } else if (Data.ChannelType.toLowerCase() == "sms" && Data.IsWorkFlowOrNotification == 2) { //Redirect to alerts
        RedirectUrl = `<a href="/Sms/SmsIndividualResponse?duration=${duration}&campid=${Data.CampaignId}&tempid=${Data.TemplatedId}&frmdate=${FromDateTime}&todate=${ToDateTime}"><i class="icon ion-ios-information"></i></a>`;
    } else if (Data.ChannelType.toLowerCase() == "whatsapp" && Data.IsWorkFlowOrNotification == 0) { //Redirect to campaign
        RedirectUrl = `<a href="/WhatsApp/Report?duration=${duration}&ssid=${Data.Id}&frmdate=${FromDateTime}&todate=${ToDateTime}"><i class="icon ion-ios-information"></i></a>`;
    } else if (Data.ChannelType.toLowerCase() == "whatsapp" && Data.IsWorkFlowOrNotification == 2) { //Redirect to alerts
        RedirectUrl = `<a href="/WhatsApp/WhatsAppIndividualResponse?duration=${duration}&campid=${Data.CampaignId}&tempid=${Data.TemplatedId}&frmdate=${FromDateTime}&todate=${ToDateTime}"><i class="icon ion-ios-information"></i></a>`;
    } else if (Data.ChannelType.toLowerCase() == "webpush" && Data.IsWorkFlowOrNotification == 0) { //Redirect to campaign
        RedirectUrl = `<a href="/WebPush/Report?duration=${duration}&ssid=${Data.Id}&frmdate=${FromDateTime}&todate=${ToDateTime}"><i class="icon ion-ios-information"></i></a>`;
    } else if (Data.ChannelType.toLowerCase() == "webpush" && Data.IsWorkFlowOrNotification == 2) { //Redirect to alerts
        RedirectUrl = `<a href="/WebPush/WebPushIndividualResponse?duration=${duration}&campid=${Data.CampaignId}&tempid=${Data.TemplatedId}&frmdate=${FromDateTime}&todate=${ToDateTime}"><i class="icon ion-ios-information"></i></a>`;
    }
    else if ((Data.ChannelType.toLowerCase() == "email" || Data.ChannelType.toLowerCase() == "sms" || Data.ChannelType.toLowerCase() == "whatsapp" || Data.ChannelType.toLowerCase() == "webpush") && Data.IsWorkFlowOrNotification == 1) { //Redirect to workflow
        RedirectUrl = `<div class="tdiconwrap">
                             <a href="/Journey/Responses?WorkFlowId=${Data.Id}&frmdate=${FromDateTime}&todate=${ToDateTime}"><i class="fa fa-sitemap"></i></a>
                             <a href="/Journey/Responses?WorkFlowId=${Data.Id}&frmdate=${FromDateTime}&todate=${ToDateTime}"><i class="icon ion-ios-information"></i></a>
                       </div>`;
    }

    let Icons = "";
    let CampaignPerformance = "";
    let Engagement = "";

    if (Data.ChannelType.toLowerCase() == "email") {
        Icons = `<i class="fa fa-envelope text-color-queued"></i> <span class="text-color">Email</span>`;
        CampaignPerformance = `<div class="campperformwrap">
                                    <div class="campperfrmitem">
                                        <p>${Data.TotalSent}</p>
                                        <small>Sent</small>
                                    </div>
                                    <div class="campperfrmitem">
                                        <p>${Data.TotalOpened}</p>
                                        <small>Opened</small>
                                    </div>
                                    <div class="campperfrmitem">
                                        <p>${Data.TotalClicked}</p>
                                        <small>Clicked</small>
                                    </div>
                                </div>
                                <div class="campperformwrap">
                                    <div class="campperfrmitem">
                                        <p>${Data.TotalUnsubscribed}</p>
                                        <small>Optout</small>
                                    </div>
                                    <div class="campperfrmitem">
                                        <p>${Data.TotalBounced}</p>
                                        <small>Bounced</small>
                                    </div>                                                                        
                                </div>`;

        Engagement = `<div class="campengagwrap">
                        <div class="delivrdrate">
                            <small>Open Rate:</small>
                            <p>${parseInt(Data.TotalSent) > 0 ? parseInt(Math.round((Data.TotalOpened / Data.TotalSent) * 100).toFixed(2)) : 0}%</p>
                        </div>
                        <div class="openedrate">
                            <small>Clicked Rate:</small>
                            <p>${parseInt(Data.TotalOpened) > 0 ? parseInt(Math.round((Data.TotalClicked / Data.TotalOpened) * 100).toFixed(2)) : 0}%</p>
                        </div>
                    </div>`;

    } else if (Data.ChannelType.toLowerCase() == "sms") {
        Icons = `<i class="fa fa-comment text-color-queued"></i> <span class="text-color">SMS</span>`;
        CampaignPerformance = `<div class="campperformwrap">
                                    <div class="campperfrmitem">
                                        <p>${Data.TotalSent}</p>
                                        <small>Sent</small>
                                    </div>
                                    <div class="campperfrmitem">
                                        <p>${Data.TotalDelivered}</p>
                                        <small>Delivered</small>
                                    </div>
                                    <div class="campperfrmitem">
                                        <p>${Data.TotalClicked}</p>
                                        <small>Clicked</small>
                                    </div>
                                </div>
                                <div class="campperformwrap">
                                    <div class="campperfrmitem">
                                        <p>${Data.TotalUnsubscribed}</p>
                                        <small>Optout</small>
                                    </div>
                                    <div class="campperfrmitem">
                                        <p>${Data.TotalBounced}</p>
                                        <small>Bounced</small>
                                    </div>                                                                        
                                </div>`;

        Engagement = `<div class="campengagwrap">
                        <div class="delivrdrate">
                            <small>Delivered Rate:</small>
                            <p>${parseInt(Data.TotalSent) > 0 ? parseInt(Math.round((Data.TotalDelivered / Data.TotalSent) * 100).toFixed(2)) : 0}%</p>
                        </div>
                        <div class="openedrate">
                            <small>Clicked Rate:</small>
                            <p>${parseInt(Data.TotalDelivered) > 0 ? parseInt(Math.round((Data.TotalClicked / Data.TotalDelivered) * 100).toFixed(2)) : 0}%</p>
                        </div>
                    </div>`;
    } else if (Data.ChannelType.toLowerCase() == "whatsapp") {
        Icons = `<i class="fa fa-whatsapp text-color-queued"></i> <span class="text-color">WhatsApp</span>`;
        CampaignPerformance = `<div class="campperformwrap">
                                    <div class="campperfrmitem">
                                        <p>${Data.TotalSent}</p>
                                        <small>Sent</small>
                                    </div>
                                    <div class="campperfrmitem">
                                        <p>${Data.TotalDelivered}</p>
                                        <small>Delivered</small>
                                    </div>
                                    <div class="campperfrmitem">
                                        <p>${Data.TotalRead}</p>
                                        <small>Read</small>
                                    </div>
                                </div>
                                <div class="campperformwrap">
                                    <div class="campperfrmitem">
                                        <p>${Data.TotalClicked}</p>
                                        <small>Clicked</small>
                                    </div>
                                    <div class="campperfrmitem">
                                        <p>${Data.TotalFailed}</p>
                                        <small>Failed</small>
                                    </div>                                                                        
                                </div>`;

        Engagement = `<div class="campengagwrap">
                        <div class="delivrdrate">
                            <small>Delivered Rate:</small>
                            <p>${parseInt(Data.TotalSent) > 0 ? parseInt(Math.round((Data.TotalDelivered / Data.TotalSent) * 100).toFixed(2)) : 0}%</p>
                        </div>
                        <div class="openedrate">
                            <small>Read Rate:</small>
                            <p>${parseInt(Data.TotalDelivered) > 0 ? parseInt(Math.round((Data.TotalRead / Data.TotalDelivered) * 100).toFixed(2)) : 0}%</p>
                        </div>
                        <div class="clickrate">
                            <small>Clicked Rate:</small>
                            <p>${parseInt(Data.TotalRead) > 0 ? parseInt(Math.round((Data.TotalClicked / Data.TotalRead) * 100).toFixed(2)) : 0}%</p>
                        </div>
                    </div>`;
    } else if (Data.ChannelType.toLowerCase() == "webpush") {
        Icons = `<i class="fa fa-bell text-color-queued"></i> <span class="text-color">Web Push</span>`;
        CampaignPerformance = `<div class="campperformwrap">
                                    <div class="campperfrmitem">
                                        <p>${Data.TotalSent}</p>
                                        <small>Sent</small>
                                    </div>
                                    <div class="campperfrmitem">
                                        <p>${Data.TotalOpened}</p>
                                        <small>Viewed</small>
                                    </div>
                                    <div class="campperfrmitem">
                                        <p>${Data.TotalClicked}</p>
                                        <small>Clicked</small>
                                    </div>
                                </div>
                                <div class="campperformwrap">
                                    <div class="campperfrmitem">
                                        <p>${Data.TotalClosed}</p>
                                        <small>Closed</small>
                                    </div>
                                    <div class="campperfrmitem">
                                        <p>${Data.TotalUnsubscribed}</p>
                                        <small>Optout</small>
                                    </div>                                                                        
                                </div>`;

        Engagement = `<div class="campengagwrap">
                        <div class="delivrdrate">
                            <small>Viewed Rate:</small>
                            <p>${parseInt(Data.TotalSent) > 0 ? parseInt(Math.round((Data.TotalOpened / Data.TotalSent) * 100).toFixed(2)) : 0}%</p>
                        </div>
                        <div class="openedrate">
                            <small>Read Rate:</small>
                            <p>${parseInt(Data.TotalOpened) > 0 ? parseInt(Math.round((Data.TotalClicked / Data.TotalOpened) * 100).toFixed(2)) : 0}%</p>
                        </div>
                    </div>`;
    }


    let Name = Data.Name.replace("&amp;", "&").length > 22 ? Data.Name.replace("&amp;", "&").substring(0, 23) + "..." : Data.Name;

    let htmlcontent = `<tr>
                           <td class="text-left">
                                <div class="td-actionFlexSB">
                                    <div class="nametitWrap">
                                        <span class="groupNameTxt" title="${Data.Name}">${Name}</span>
                                        <span class="templatenametxt">${$.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(Data.CreatedDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(Data.CreatedDate))}</span>
                                    </div>
                                    <div class="tdiconwrap">
                                        ${RedirectUrl}
                                    </div>
                                </div>
                           </td>
                            <td class="text-left">
                                <div class="td-actionFlexSB">
                                    <div class="nametitWrap">
                                        <span class="groupNameTxt">${Data.CampaignName}</span>
                                        <span class="createdDateTd">${Data.TemplateName}</span>
                                    </div>
                                </div>
                            </td>
                            <td class="text-left">
                                ${Icons}
                            </td>
                            <td>
                                ${CampaignPerformance}
                            </td>
                            <td>
                                ${Engagement}
                            </td>
                        </tr>`;

    return htmlcontent;
}

function GetTemplates() {
    $("#ui_dlltemplateCampaign").empty();
    $("#ui_dlltemplateCampaign").append('<option value="0">Filter by Templates</option>');
    $.ajax({
        url: "/Dashboard/CampaignOverView/GetTemplateList",
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'ChannelType': ChannelType }),
        dataType: "json",
        success: function (response) {

            if (response.Table1 !== undefined && response !== null && response.Table1 !== undefined && response.Table1 !== null && response.Table1.length > 0) {
                $.each(response, function () {
                    for (let i = 0; i < response.Table1.length; i++) {

                        $("#ui_dlltemplateCampaign").append(`<option value="${response.Table1[i].TemplateName}">${response.Table1[i].TemplateName}</option>`);
                    }
                });
            }
        },
        error: ShowAjaxError
    });
}

function GetCampaignnames() {
    $("#ui_ddCampaignnames").empty();
    $("#ui_ddCampaignnames").append('<option value="0">Filter by Campaigns</option>');
    $.ajax({
        url: "/Dashboard/CampaignOverView/GetCampaignList",
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'ChannelType': ChannelType }),
        dataType: "json",
        success: function (response) {

            if (response.Table1 !== undefined && response !== null && response.Table1 !== undefined && response.Table1 !== null && response.Table1.length > 0) {
                for (let i = 0; i < response.Table1.length; i++) {

                    $("#ui_ddCampaignnames").append(`<option value="${response.Table1[i].CampaignName}">${response.Table1[i].CampaignName}</option>`);
                }
            }
        },
        error: ShowAjaxError
    });
}

function GetTotalChannelGrid(data) {

    let htmlcontent = '';
    if (ChannelType.toLowerCase() == "email") {
        htmlcontent = ` <div class="totalcampwrap">
                                <p id="totalsentnumb" class="campcountnumb">${data.TotalSent}</p>
                                <small id="totalsenttit" class="counttype">Total Sent</small>
                            </div>                            
                            <div class="totalcampwrap">
                                <p id="totalopenednumb" class="campcountnumb">${data.TotalOpened}</p>
                                <small id="totalopenedtit" class="counttype">Total Opened</small>
                            </div>
                            <div class="totalcampwrap">
                                <p id="totalclickednumb" class="campcountnumb">${data.TotalClicked}</p>
                                <small id="totalclickedtit" class="counttype">Total clicked</small>
                            </div>
                            <div class="totalcampwrap">
                                <p id="totaloptoutnumb" class="campcountnumb">${data.TotalUnsubscribed}</p>
                                <small id="totaloptouttit" class="counttype">Total OptOut</small>
                            </div>
                            <div class="totalcampwrap">
                                <p id="totalbouncednumb" class="campcountnumb">${data.TotalBounced}</p>
                                <small id="totalbouncedtit" class="counttype">Total bounced</small>
                            </div>
                           `;
    } else if (ChannelType.toLowerCase() == "sms") {
        htmlcontent = ` <div class="totalcampwrap">
                                <p id="totalsentnumb" class="campcountnumb">${data.TotalSent}</p>
                                <small id="totalsenttit" class="counttype">Total Sent</small>
                            </div>                            
                            <div class="totalcampwrap">
                                <p id="totaldeliverednumb" class="campcountnumb">${data.TotalDelivered}</p>
                                <small id="totaldeliveredtit" class="counttype">Total Delivered</small>
                            </div>
                            <div class="totalcampwrap">
                                <p id="totalclickednumb" class="campcountnumb">${data.TotalClicked}</p>
                                <small id="totalclickedtit" class="counttype">Total clicked</small>
                            </div>
                            <div class="totalcampwrap">
                                <p id="totaloptoutnumb" class="campcountnumb">${data.TotalUnsubscribed}</p>
                                <small id="totaloptouttit" class="counttype">Total OptOut</small>
                            </div>
                            <div class="totalcampwrap">
                                <p id="totalbouncednumb" class="campcountnumb">${data.TotalBounced}</p>
                                <small id="totalbouncedtit" class="counttype">Total bounced</small>
                            </div>
                           `;
    } else if (ChannelType.toLowerCase() == "whatsapp") {
        htmlcontent = `     <div class="totalcampwrap">
                                <p id="totalsentnumb" class="campcountnumb">${data.TotalSent}</p>
                                <small id="totalsenttit" class="counttype">Total Sent</small>
                            </div>                            
                            <div class="totalcampwrap">
                                <p id="totaldeliverednumb" class="campcountnumb">${data.TotalDelivered}</p>
                                <small id="totaldeliveredtit" class="counttype">Total Delivered</small>
                            </div>
                            <div class="totalcampwrap">
                                <p id="totalsentnumb" class="campcountnumb">${data.TotalRead}</p>
                                <small id="totalsenttit" class="counttype">Total Read</small>
                            </div>
                            <div class="totalcampwrap">
                                <p id="totalclickednumb" class="campcountnumb">${data.TotalClicked}</p>
                                <small id="totalclickedtit" class="counttype">Total clicked</small>
                            </div>                            
                            <div class="totalcampwrap">
                                <p id="totalbouncednumb" class="campcountnumb">${data.TotalFailed}</p>
                                <small id="totalbouncedtit" class="counttype">Total Failed</small>
                            </div>
                           `;
    } else if (ChannelType.toLowerCase() == "webpush") {
        htmlcontent = `     <div class="totalcampwrap">
                                <p id="totalsentnumb" class="campcountnumb">${data.TotalSent}</p>
                                <small id="totalsenttit" class="counttype">Total Sent</small>
                            </div>                            
                            <div class="totalcampwrap">
                                <p id="totaldeliverednumb" class="campcountnumb">${data.TotalOpened}</p>
                                <small id="totaldeliveredtit" class="counttype">Total Viewed</small>
                            </div>                            
                            <div class="totalcampwrap">
                                <p id="totalclickednumb" class="campcountnumb">${data.TotalClicked}</p>
                                <small id="totalclickedtit" class="counttype">Total clicked</small>
                            </div>                            
                            <div class="totalcampwrap">
                                <p id="totalbouncednumb" class="campcountnumb">${data.TotalClosed}</p>
                                <small id="totalbouncedtit" class="counttype">Total Closed</small>
                            </div>
                            <div class="totalcampwrap">
                                <p id="totaloptoutnumb" class="campcountnumb">${data.TotalUnsubscribed}</p>
                                <small id="totaloptouttit" class="counttype">Total OptOut</small>
                            </div>
                           `;
    }


    $("#ui_totaldivoverveiw").html(htmlcontent);
}

$(".dropdown-item.contfiltby").click(function () {
    ChannelType = '';
    let checkfiltypeval = $(this).text();
    ChannelType = $(this).text().replace(' ', '');
    $(".subdivWrap").addClass("showDiv");
    $(".filtwrpbar").removeClass("hideDiv");
    $(".filttypetext").html(checkfiltypeval);

    GetTemplates();
    GetCampaignnames();
    CallBackFunction();
});

$(".filtwrpbar .ion-android-close").click(function () {
    ChannelType = '';
    $(".subdivWrap").removeClass("showDiv");
    $(".filtwrpbar").addClass("hideDiv");
    $(".filttypetext").html("");
    $("#ui_dlltemplateCampaign").empty();
    $("#ui_ddCampaignnames").empty();
    $("#ui_dlltemplateCampaign").append('<option value="0">Filter by Templates</option>');
    $("#ui_ddCampaignnames").append('<option value="0">Filter by Campaign</option>');

    GetTemplates();
    GetCampaignnames();
    CallBackFunction();
});


$("#ui_dlltemplateCampaign").change(function () {
    CampaignName = $("#ui_ddCampaignnames").val() != "0" ? $("#ui_ddCampaignnames").val() : "";
    TemplateName = $("#ui_dlltemplateCampaign").val() != "0" ? $("#ui_dlltemplateCampaign").val() : "";

    CallBackFunction();
});

$("#ui_ddCampaignnames").change(function () {
    CampaignName = $("#ui_ddCampaignnames").val() != "0" ? $("#ui_ddCampaignnames").val() : "";
    TemplateName = $("#ui_dlltemplateCampaign").val() != "0" ? $("#ui_dlltemplateCampaign").val() : "";

    CallBackFunction();
});
$("#ui_exportOrDownload").click(function () {
    ExportFunctionName = "ExportCampaignOveriViewReport";
    $("#ui_ddl_ExportDataRange").attr("disabled", false);
});

$('.addCampName').select2({
    placeholder: 'This is my placeholder',
    minimumResultsForSearch: '',
    dropdownAutoWidth: false,
    containerCssClass: 'dropdownactiv'
});