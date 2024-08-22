
var monthDetials = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

var duration = 0;
var FromDateTime, ToDateTime, LocalFromDateTime, LocalToDateTime;
var FromDateTime_JsDate, ToDateTime_JsDate;
var TotalRowCount = 0, OffSet = 0, FetchNext = 0, CurrentRowCount = 0;

//Below Variable using in differnt places too. Please take care before changing
var MainControlerUrl, Areas;

$(document).ready(function () {
    var re = /[^/]*/g;
    Areas = window.location.href.match(re)[5];

    MainControlerUrl = window.location.href.match(re)[7];

    if (MainControlerUrl.indexOf("?") > -1) {
        MainControlerUrl = MainControlerUrl.substring(0, MainControlerUrl.indexOf("?"));
    }
});

$('#ui_aMyAccount').click(function () {
    $("#ui_divMyAccountPopUp").addClass("showDiv");
});

//$("#ui_divMyAccountPopUp").mouseleave(function () {
//    setTimeout(function () {
//        $("#ui_divMyAccountPopUp").removeClass("showDiv");
//    }, 2000);
//});

$('input[type=radio][name=UserDefaultAccount]').on('change', function () {
    ShowPageLoading();
    ShowSuccessMessage(GlobalErrorList.AccountSelection.updatingDefaultAccount);
    var SelectedAccountId = $(this).val();
    $.ajax({
        url: "/Account/SetPreferredAccount",
        type: 'Post',
        data: JSON.stringify({
            'PreferredAccountId': SelectedAccountId, 'UserId': Plumb5UserId
        }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response != undefined && response != null && response == true) {
                ShowSuccessMessage(GlobalErrorList.AccountSelection.updatingDefaultAccount_Success);
                CloseMyAccountPopUp();
            } else {
                ShowErrorMessage(GlobalErrorList.AccountSelection.updatingDefaultAccount_Error);
                CloseMyAccountPopUp();
            }
            HidePageLoading();
        },
        error: ShowAjaxError
    });
});

$('#ui_iconCloseAccountPopUp').click(function () {
    CloseMyAccountPopUp();
});

function CloseMyAccountPopUp() {
    $("#ui_divMyAccountPopUp").removeClass("showDiv");
}

$(".MyAccountMenuItem").click(function () {
    if ($(this).parent().parent().is('.active')) {
        //It is active only
    }
    else {
        ShowPageLoading();
        var SelectedAccountId = $(this).attr("AccountId");

        $.ajax({
            url: "/Account/SetAnotherAccount",
            type: 'Post',
            data: JSON.stringify({ 'AdsId': SelectedAccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response.Status) {
                    if (response.publisherenqid != null && response.publisherenqid != "" && response.publisherenqid != undefined) {
                        window.location.href = '/Prospect/Publisher?value=' + response.publisherenqid + '';
                    }
                    else {
                        $(".MyAccountMenu").removeClass("active");
                        $(this).parent().parent().toggleClass("active");
                        ShowSuccessMessage(GlobalErrorList.AccountSelection.success);
                        var PurchaseDetailsList = response.PurchaseList;
                        var FeaturesData = [{ "Feature": "analytics", "FeatureId": 1 }, { "Feature": "captureform", "FeatureId": 2 }, { "Feature": "webpush", "FeatureId": 23 },
                        { "Feature": "mobileanalytics", "FeatureId": 27 }, { "Feature": "mobilepushnotification", "FeatureId": 26 }, { "Feature": "mobileinapp", "FeatureId": 14 },
                        { "Feature": "mail", "FeatureId": 3 }, { "Feature": "sms", "FeatureId": 4 }, { "Feature": "chat", "FeatureId": 7 },
                        { "Feature": "facebookpage", "FeatureId": 12 }, { "Feature": "prospect", "FeatureId": 6 }, { "Feature": "journey", "FeatureId": 22 },
                        { "Feature": "segmentbuilder", "FeatureId": 22 }
                        ];
                        var featurename = window.location.pathname.split('/');
                        let featurendetails = FeaturesData.filter(function (e) {
                            return e.Feature == featurename[1].toLowerCase();
                        });
                        if (featurendetails.length > 0) {
                            //Account Switch Page redirecction based on selected feature
                            var featurePermission = JSLINQ(PurchaseDetailsList).Where(function () { return (this.FeatureId == featurendetails[0].FeatureId && this.AccountId == response.AccountId && this.FeatureStatus == 1); });
                            if (featurePermission.items.length == 0) {
                                window.location.href = '/Dashboard/DashboardOverview';
                            }
                            else {
                                setTimeout(function () { location.reload(); }, 2000);
                            }
                        }
                        else {
                            setTimeout(function () { location.reload(); }, 2000);
                        }
                    }
                }
                else {
                    ShowErrorMessage(GlobalErrorList.AccountSelection.error);
                }
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    }
});

function SetNoRecordContent(ReportTableId, NumberOfColumn, ReportTableTbodyId) {
    if (ReportTableId != undefined && ReportTableId != null && ReportTableId != '' && NumberOfColumn != undefined && NumberOfColumn != null && NumberOfColumn != '' && $.isNumeric(NumberOfColumn) && ReportTableTbodyId != undefined && ReportTableTbodyId != null && ReportTableTbodyId != '') {
        $("#" + ReportTableId).removeClass('no-data-records').addClass('no-data-records');
        $("#" + ReportTableTbodyId).html("<tr><td colspan=" + NumberOfColumn + " class='border-bottom-none'><div class='no-data'>There is no data for this view</div></td></tr>");
        if ($("#ui_divReportExport").length)
            ShowExportDiv(false);
        if ($("#ui_divPaging").length)
            ShowPagingDiv(false);
    }
}

function ShowPageLoading() {
    $("#ui_divPageLoading").removeClass('hideDiv').removeClass('showflx').addClass('showflx');
}

function HidePageLoading() {
    $("#ui_divPageLoading").removeClass('hideDiv').removeClass('showflx').addClass('hideDiv');
}

$("#ui_btnRedirectContactSetting").click(function () {
    ShowPageLoading();
    window.location.href = "/ManageContact/Settings";
    HidePageLoading();
});