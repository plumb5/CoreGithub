
var adsId = 0, formId = 0, formType = 0, maxRowCount = 0, rowIndex = 0, allFormFields, viewMoreDisable = false;
var SearchEmailId = "", OffSet = 0;

$(document).ready(function () {
    $("#dvLoading").show();

    formId = urlParam("FormId");
    formType = urlParam("FormType");
    campaignId = 1;//urlParam("CampaignId");

    GetFormList();
    GetMaxCount();
});

GetFormList = function () {

    $.ajax({
        url: "/CommonDetailsForForms/GetFormsList",
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            $.each(response, function () {
                optlist = document.createElement('option');
                optlist.value = $(this)[0].Id;
                optlist.text = $(this)[0].Heading;
                document.getElementById("ui_ddlForms").options.add(optlist);
            });
            $("#dvLoading").hide();
        },
        error: ShowAjaxError
    });
};

GetMaxCount = function () {

    $.ajax({
        url: "/AllInteraction/GetNumberOfDataCount",
        type: 'POST',
        data: JSON.stringify({ 'FormId': formId, 'EmailId': SearchEmailId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            maxRowCount = result;
            if (maxRowCount == 0) {
                $("#dvViewMore, #dvLoading, #divcontent,#dvTipsExport").hide();
                $("#dvDefault").show();
            }
            else if (maxRowCount > 0) {
                $("#dvDefault").hide();
                $("#divcontent, #dvViewMore").show();
                var numberOfRecords = GetNumberOfRecordsPerPage();
                CreateTable(numberOfRecords);
                rowIndex = 0;
                if (maxRowCount > numberOfRecords) {
                    $("#ui_lnkViewMore").show();
                }
            }
        },
        error: ShowAjaxError
    });
}

ViewMore = function () {
    if (!viewMoreDisable) {
        $("#dvLoading").show();
        viewMoreDisable = true;
        var numberOfRecords = GetNumberOfRecordsPerPage();
        CreateTable(numberOfRecords);
    }
};

function CreateTable(numberRowsCount) {

    OffSet = rowIndex;
    var FetchNext = numberRowsCount;

    $.ajax({
        url: "/AllInteraction/GetAllReponses",
        type: 'Post',
        data: JSON.stringify({ 'FormId': formId, 'EmailId': SearchEmailId, 'OFFSET': OffSet, 'FetchNext': FetchNext }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: ResponseData,
        error: ShowAjaxError
    });
}

ResponseData = function (responseData) {

    if (responseData.length > 0) {
        rowIndex = responseData.length + rowIndex;
        $("#div_Records").html(rowIndex + " out of " + maxRowCount + " records");

        if (rowIndex == maxRowCount) {
            $("#ui_lnkViewMore").hide();
        }

        $("#divcontent, #dvTipsExport").show();

        $.each(responseData, function (i) {

            var tdContent = "";
            var visitor = "";
            if ($(this)[0].EmailId != null) {
                visitor = $(this)[0].EmailId;
                tdContent = "<div style='float: left; width: 3%; text-align: left;'><input id='chk_" + $(this)[0].ContactId + "' value='" + $(this)[0].ContactId + "' type='checkbox' autocomplete='off' class='leadchk' style='top: -2px;' /></div>";
            }
            else {
                visitor = "Visitor - " + $(this)[0].MachineId.split("").reverse().join("").substring(0, 4);
                tdContent = "<div style='float: left; width: 3%; text-align: left;'><input type='checkbox' autocomplete='off' disabled='disabled' style='top: -2px;' /></div>";
            }

            tdContent += "<div style='float: left; width: 7%;text-align: left;'><a id='lnkCustomer" + $(this)[0].MachineId + "' href=\"javascript:ContactInfo('" + $(this)[0].MachineId + "','" + $(this)[0].ContactId + "');\"><img class='UPC' alt='' src='/images/img_trans.gif' /></a></div>";
            tdContent += "<div style='float: left; width: 27%; text-align: left;'><a href='javascript:void(0);' onclick=\"DataShowLead('" + $(this)[0].MachineId + "');\"> " + visitor + " <img style='border:0px;float:right;' id='imgLead-" + $(this)[0].MachineId + "' class='SortImage' src='/images/img_trans.gif' /></a></div>";
            tdContent += "<div style='float: left; width: 10%;text-align: right;'>" + $(this)[0].ViewedCount + "</div>";
            tdContent += "<div style='float: left; width: 10%;text-align: right;'>" + $(this)[0].ResponseCount + "</div>";
            tdContent += "<div style='float: left; width: 10%;text-align: right;'>" + $(this)[0].ClosedCount + "</div>";
            tdContent += "<div style='float: left; width: 10%;text-align: right;'>" + $(this)[0].Score + "</div>";
            tdContent += "<div style='float: right; width:auto;'>" + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj($(this)[0].RecentDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj($(this)[0].RecentDate)) + "</div>";
            $("#dvReport").append("<div class='itemStyle'>" + tdContent + "</div>");
            $("#dvReport").append("<div class='tdHide' id='tr_" + $(this)[0].MachineId + "'></div>");

        });
    }
    viewMoreDisable = false;
    $("#dvLoading").hide();
};

function DataShowLead(machineId) {
    if ($("#tr_" + machineId).is(":visible")) {
        $("#imgLead-" + machineId).removeClass("SortUpImage").addClass("SortImage");
        $("#tr_" + machineId).hide();
    }
    else {
        $("#imgLead-" + machineId).removeClass("SortImage").addClass("SortUpImage");
        if ($("#tr_" + machineId).html().length == 0) {
            BindEachBannerDetails(machineId);
        }
        $("#tr_" + machineId).show();
    }
}

BindEachBannerDetails = function (machineId) {
    $("#dvLoading").show();

    $.ajax({
        url: "/AllInteraction/EachBannerByMachine",
        type: 'Post',
        data: JSON.stringify({ 'FormId': formId, 'MachineId': machineId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) { EachBannerResponseData(machineId, response) },
        error: ShowAjaxError
    });
};

EachBannerResponseData = function (machineId, responseData) {

    if (responseData.length > 0) {

        var trRowData = "";
        $.each(responseData, function (i) {
            var tdContent = "";

            var bannerName = $(this)[0].Heading;
            if (bannerName.length > 100)
                bannerName = bannerName.substring(0, 100);

            tdContent += "<div style='float: left; width: 37%; text-align: left;'><b>[</b> " + GetFormType($(this)[0].FormType) + "<b> ]</b> <label title='" + $(this)[0].FormHeading + "'>" + bannerName + "</label></div>";
            tdContent += " <div style='float: left; width: 10%;text-align: right;'>" + $(this)[0].ViewedCount + "</div>";
            if ($(this)[0].FormType == "7" || $(this)[0].FormType == "10" || $(this)[0].FormType == 12 || $(this)[0].FormType == 18 || $(this)[0].FormType == 16 || $(this)[0].FormType == 9)
                tdContent += "<div style='float: left; width: 10%;text-align: right;'>" + $(this)[0].ResponseCount + "</div>";
            else
                tdContent += "<div style='float: left; width: 10%;text-align: right;'>-</div>";
            tdContent += "<div style='float: left; width: 10%;text-align: right;'>" + $(this)[0].ClosedCount + "</div>";
            tdContent += "<div style='float: left; width: 10%;text-align: right;'>" + $(this)[0].Score + "</div>";

            tdContent += "<div style='float: right; width: auto;'>" + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj($(this)[0].RecentDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj($(this)[0].RecentDate)) + "</div>";

            trRowData += "<div class='itemStyle' style='background-color:#FFFEEA;'>" + tdContent + "</div>";//
        });
        $("#tr_" + machineId).html(trRowData);
        $("#dvLoading").hide();
    }
};

GetFormType = function (formType) {
    var formTypeData = "";
    if (formType == 1)
        formTypeData = "Video";
    else if (formType == 2)
        formTypeData = "Facebook Audience";
    else if (formType == 3)
        formTypeData = "Presentation";
    else if (formType == 4)
        formTypeData = "Flash";
    else if (formType == 5)
        formTypeData = "Custom HTML";
    else if (formType == 6)
        formTypeData = "Tweets";
    else if (formType == 7)
        formTypeData = "Custom Banner";
    else if (formType == 8)
        formTypeData = "";
    else if (formType == 9)
        formTypeData = "Polls";
    else if (formType == 10)
        formTypeData = "Test an Offer";
    else if (formType == 12)
        formTypeData = "Lead Generation";
    else if (formType == 16)
        formTypeData = "Ratings";
    else if (formType == 17)
        formTypeData = "RSS Feeds";
    else if (formType == 18)
        formTypeData = "Question";
    else if (formType == 20)
        formTypeData = "Click To Call";

    return formTypeData;
};

$("#chkAll").click(function () {
    if ($(this).is(":checked"))
        $("input:checkbox[class='leadchk']").prop("checked", true);
    else
        $("input:checkbox[class='leadchk']").prop("checked", false);
});

$("#ui_ddlForms").change(function () {
    formId = $(this).val();

    $("#dvReport > .itemStyle, #dvReport > .tdHide").remove();
    OffSet = rowIndex = maxRowCount = 0;
    $("#ui_lnkViewMore").hide();
    GetMaxCount();

});

$("#ui_txtSearchEmailId").keypress(function (e) {
    if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
        $("#dvLoading").show();
        formId = $("#ui_ddlForms").val();

        SearchEmailId = $(this).val();

        $("#dvReport > .itemStyle, #dvReport > .tdHide").remove();
        OffSet = rowIndex = maxRowCount = 0;
        GetMaxCount();
        $("#ui_lnkViewMore").hide();

        return false;
    }
    return true;
});

$("#ui_txtSearchEmailId").keyup(function (e) {
    if (e.which && e.which == 8 || e.keyCode && e.keyCode == 46)
        if ($("#ui_txtSearchEmailId").val().length == 0) {
            formId = $("#ui_ddlForms").val();
            formResponsesReport.SearchEmailId = "";

            $("#dvReport > .itemStyle, #dvReport > .tdHide").remove();
            OffSet = rowIndex = maxRowCount = 0;
            GetMaxCount();
            $("#ui_lnkViewMore").hide();
        }
});

