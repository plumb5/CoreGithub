var QuickFilterBy = "", OldQuickFilterBy = "";

$(document).ready(function () {
    GetDropDownReady();
    ShowPageLoading();
    ExportFunctionName = "UtmTagsExportReport";
    GetUTCDateTimeRange(2);
});

function CallBackFunction() {
    ShowPageLoading();
    TotalRowCount = 0;
    CurrentRowCount = 0;
    MaxCount();
}

function CallBackPaging() {
    ShowPageLoading();
    CurrentRowCount = 0;
    GetReport();
}

function MaxCount() {
    $.ajax({
        url: "/Analytics/Traffic/PaidCampaignsReportCount",
        type: 'Post',
        data: JSON.stringify({ 'Action': 'GetUTMTagsMaxCount', 'accountId': Plumb5AccountId, 'fromdate': FromDateTime, 'todate': ToDateTime, 'QuickFilterBy': QuickFilterBy }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            TotalRowCount = 0;
            if (response != undefined && response != null && response.Table1 != undefined && response.Table1 != null && response.Table1.length > 0) {
                $.each(response.Table1, function () {
                    TotalRowCount = this.TotalRows;
                });
            }
            $("#ui_spn_MaxCount").html(TotalRowCount);
            if (TotalRowCount > 0) {
                GetReport();
            }
            else {
                SetNoRecordContent('ui_tableReport', 9, 'ui_trbodyReportData');
                HidePageLoading();
            }
        },
        error: ShowAjaxError
    });
}

function GetReport() {
    FetchNext = GetNumberOfRecordsPerPage();

    $.ajax({
        url: "/Analytics/Traffic/PaidCampaignsReport",
        type: 'Post',
        data: JSON.stringify({ 'Action': 'GetUTMTagsDetails', 'accountId': Plumb5AccountId, 'fromdate': FromDateTime, 'todate': ToDateTime, 'start': OffSet, 'end': FetchNext, 'QuickFilterBy': QuickFilterBy }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindReport,
        error: ShowAjaxError
    });
}

function BindReport(response) {
    SetNoRecordContent('ui_tableReport', 9, 'ui_trbodyReportData');
    if (response != undefined && response != null && response.ds.Table1 != undefined && response.ds.Table1 != null && response.ds.Table1.length > 0) {
        CurrentRowCount = response.ds.Table1.length;
        PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);
        $("#ui_trbodyReportData").html('');
        $("#ui_tableReport").removeClass('no-data-records');

        var reportTableTrs, UniqueVisits;
        $.each(response.ds.Table1, function () {
            //**** For Output Cache ToDateTime *******
            ToDateTime = response.CurrentUTCDateTimeForOutputCache;
            //**** For Output Cache ToDateTime *******

            UniqueVisits = (this.UniqueVisitors != "0" ? "<a class='ViewPermission' href='/Analytics/Uniques/UniqueVisits?dur=" + duration + "&Frm=" + FromDateTime + "&To=" + ToDateTime + "&UTM=" + this.PageName.toString().replace('?', '$').replace(/&/g, '~').replace('#', '^') + "'>" + this.UniqueVisitors + "</a>" : this.UniqueVisitors);
            reportTableTrs += "<tr>" +
                "<td class='text-center'><a href='" + this.EntryPage + "' target='_blank' title='Click to open the page in a new tab'><i class='icon ion-android-open'></i></a></td>" +
                "<td class='text-left'><div class='groupnamewrap'><div class='nametxticnwrp'><span class='pr-4'>" + this.PageName + " </span></div></div></td>" +
                "<td>" + this.PageViews + "</td>" +
                "<td>" + this.Session + "</td>" +
                "<td>" + UniqueVisits + "</td>" +
                "<td>" + this.UtmSource + "</td>" +
                "<td>" + this.UtmMedium + "</td>" +
                "<td>" + this.UtmCampaign + "</td>" +
                "<td>" + $.datepicker.formatDate("M dd yy", ConvertUTCDateTimeToLocal(this.Recency)) + " " + PlumbTimeFormat(ConvertUTCDateTimeToLocal(this.Recency)) + "</td>" +
                "</tr>";
        });
        $("#ui_tableReport").removeClass('no-data-records');
        $("#ui_trbodyReportData").html(reportTableTrs);
        ShowExportDiv(true);
    } else {
        ShowExportDiv(false);
        ShowPagingDiv(false);
    }
    HidePageLoading();
}

$("#ui_drpdwn_QuickFilterBy").change(function () {
    let getlmssourcetypeval = $("#ui_drpdwn_QuickFilterBy option:selected").val();
    $(".subdivWrap").addClass("showDiv");
    $(".filtwrpbar").addClass("hideDiv");
    if (getlmssourcetypeval == "select") {
        $(".lmssourcefilterwrp, .lmsmediumfilterwrp, .lmscampaignfilterwrp").addClass("hideDiv");
        $(".subdivWrap").removeClass("showDiv h-auto");
    } else if (getlmssourcetypeval == "Sources") {
        $(".lmssourcefilterwrp").removeClass("hideDiv");
    } else if (getlmssourcetypeval == "Medium") {
        $(".lmsmediumfilterwrp").removeClass("hideDiv");
    } else if (getlmssourcetypeval == "Campaign") {
        $(".lmscampaignfilterwrp").removeClass("hideDiv");
    }
    $("#ui_drpdwn_QuickFilterBy").val("select");
});

$(".clselmsfiltpaid").click(function () {
    let chksourcfiltwrp = $(".lmssourcefilterwrp").hasClass("hideDiv");
    let chkmediumfiltwrp = $(".lmsmediumfilterwrp").hasClass("hideDiv");
    let chkcampfiltwrp = $(".lmscampaignfilterwrp").hasClass("hideDiv");
    if (chksourcfiltwrp == true && chkmediumfiltwrp == true && chkcampfiltwrp == false) {
        $(".subdivWrap").removeClass("showDiv");
        $(this).parent().parent().addClass("hideDiv");
        $("#ui_drpdwn_Campaigns").select2().val("select").trigger('change');
    } else if (chksourcfiltwrp == false && chkmediumfiltwrp == true && chkcampfiltwrp == true) {
        $(".subdivWrap").removeClass("showDiv");
        $(this).parent().parent().addClass("hideDiv");
        $("#ui_drpdwn_Source").select2().val("select").trigger('change');
    } else if (chksourcfiltwrp == true && chkmediumfiltwrp == false && chkcampfiltwrp == true) {
        $(".subdivWrap").removeClass("showDiv");
        $(this).parent().parent().addClass("hideDiv");
        $("#ui_drpdwn_Medium").select2().val("select").trigger('change');
    } else {
        $(this).parent().parent().addClass("hideDiv");

        if ($(this).parent().parent()[0].className.includes("lmssourcefilterwrp"))
            $("#ui_drpdwn_Source").select2().val("select").trigger('change');

        if ($(this).parent().parent()[0].className.includes("lmsmediumfilterwrp"))
            $("#ui_drpdwn_Medium").select2().val("select").trigger('change');

        if ($(this).parent().parent()[0].className.includes("lmscampaignfilterwrp"))
            $("#ui_drpdwn_Campaigns").select2().val("select").trigger('change');
    }
});

$('#ui_drpdwn_Source, #ui_drpdwn_Medium, #ui_drpdwn_Campaigns').change(function () {
    DecideQuickFilterBy();
});

function DecideQuickFilterBy() {
    ShowPageLoading();
    OldQuickFilterBy = QuickFilterBy;

    let Source = $("#ui_drpdwn_Source").val();
    let Medium = $("#ui_drpdwn_Medium").val();
    let Campaigns = $("#ui_drpdwn_Campaigns").val();

    if (Source != null && Source == "select")
        $(".lmssourcefilterwrp").addClass("hideDiv");

    if (Medium != null && Medium == "select")
        $(".lmsmediumfilterwrp").addClass("hideDiv");

    if (Campaigns != null && Campaigns == "select")
        $(".lmscampaignfilterwrp").addClass("hideDiv");

    let chksourcfiltwrp = $(".lmssourcefilterwrp").hasClass("hideDiv");
    let chkmediumfiltwrp = $(".lmsmediumfilterwrp").hasClass("hideDiv");
    let chkcampfiltwrp = $(".lmscampaignfilterwrp").hasClass("hideDiv");
    if (chksourcfiltwrp == true && chkmediumfiltwrp == true && chkcampfiltwrp == true)
        $(".subdivWrap").removeClass("showDiv");

    let Condition = "";

    if (Source != null && Source != "select")
        Condition += " and UtmSource LIKE '%" + Source + "%'";

    if (Medium != null && Medium != "select")
        Condition += " and UtmMedium LIKE '%" + Medium + "%'";

    if (Campaigns != null && Campaigns != "select")
        Condition += " and UtmCampaign LIKE '%" + Campaigns + "%'";

    QuickFilterBy = Condition;

    MaxCount();
}

$('#ui_drpdwn_Source, #ui_drpdwn_Medium, #ui_drpdwn_Campaigns').select2({
    minimumResultsForSearch: '',
    dropdownAutoWidth: false,
    containerCssClass: "border-0"
});

function GetDropDownReady() {
    $.ajax({
        url: "/Analytics/Traffic/GetDropDownReady",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response != undefined && response != null) {
                if (response.Table1 != undefined && response.Table1 != null && response.Table1.length > 0) {
                    var DropDownContent = `<option value="select">Select Sources</option>`;
                    $.each(response.Table1, function (i) {
                        DropDownContent += this.UtmSource != null && this.UtmSource != "" ? `<option value="${this.UtmSource}">${this.UtmSource}</option>` : ``;
                    });
                    $("#ui_drpdwn_Source").html(DropDownContent);
                }
                if (response.Table1 != undefined && response.Table1 != null && response.Table1.length > 0) {
                    var DropDownContent = `<option value="select">Select Medium</option>`;
                    $.each(response.Table1, function (i) {
                        DropDownContent += this.UtmMedium != null && this.UtmMedium != "" ? `<option value="${this.UtmMedium}">${this.UtmMedium}</option>` : ``;
                    });
                    $("#ui_drpdwn_Medium").html(DropDownContent);
                }
                if (response.Table2 != undefined && response.Table2 != null && response.Table2.length > 0) {
                    var DropDownContent = `<option value="select">Select Campaigns</option>`;
                    $.each(response.Table2, function (i) {
                        DropDownContent += this.UtmCampaign != null && this.UtmCampaign != "" ? `<option value="${this.UtmCampaign}">${this.UtmCampaign}</option>` : ``;
                    });
                    $("#ui_drpdwn_Campaigns").html(DropDownContent);
                }
            }
        },
        error: ShowAjaxError
    });
}