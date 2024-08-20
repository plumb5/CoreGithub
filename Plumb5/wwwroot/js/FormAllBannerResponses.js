
var adsId = 0, formId = 0, formType = 0, maxRowCount = 0, rowIndex = 0, allFormFields, viewMoreDisable = false, OffSet;
var formBannerLoadClick = {
    MachineId: ""
}

$(document).ready(function () {
    $("#dvLoading").show();
    formId = urlParam("FormId");
    Intializer();
    GetMaxCount();
});

Intializer = function () {

};

function GetMaxCount() {

    $.ajax({
        url: "/BannerResponse/GetNumberOfDataCount",
        type: 'POST',
        data: JSON.stringify({ 'formDataDetails': formBannerLoadClick, 'FormId': formId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {

            maxRowCount = result;
            if (maxRowCount == 0) {
                $("#dvViewMore, #dvLoading, #divcontent").hide();
                $("#dvDefault").show();
            }
            else if (maxRowCount > 0) {
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
        url: "/BannerResponse/GetAllReponses",
        type: 'Post',
        data: JSON.stringify({ 'formDataDetails': formBannerLoadClick, 'FormId': formId, 'OFFSET': OffSet, 'FetchNext': FetchNext }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: ResponseData,
        error: ShowAjaxError
    });
}

ResponseData = function (responseData) {
  
    rowIndex = responseData.length + rowIndex;
    $("#div_Records").html(rowIndex + " out of " + maxRowCount + " records");

    if (rowIndex == maxRowCount) {
        $("#ui_lnkViewMore").hide();
    }
    $("#divcontent").show();
    $("#dvPrintExport").show();
    $.each(responseData, function (i) {

        var tdContent = "";

        tdContent = "<div style='float: left; width: 5%;text-align: left;'><a id='lnkCustomer" + $(this)[0].MachineId + "' href=\"javascript:ContactInfo('" + $(this)[0].MachineId + "','');\"><img class='UPC' alt='' src='/images/img_trans.gif' /></a></div>";

        tdContent += "<div style='float: left; width: 25%; text-align: left;'><a href='javascript:void(0);' onclick=\"DataShowLead('" + $(this)[0].MachineId + "');\"><img class='expandCollapseImg ExpandImage' id='imgLead-" + $(this)[0].MachineId + "' alt='' src='/images/img_trans.gif'  /> Visitor - " + $(this)[0].MachineId.split("").reverse().join("").substring(0, 4) + "</a></div>";
        tdContent += "<div style='float: left; width: 15%;text-align: left;'>" + $(this)[0].TrackIp + "</div>";
        tdContent += "<div style='float: left; width: 10%;text-align: right;'>" + $(this)[0].ViewedCount + "</div>";
        tdContent += "<div style='float: left; width: 10%;text-align: right;'>" + $(this)[0].ResponseCount + "</div>";
        tdContent += "<div style='float: left; width: 15%;text-align: right;'>" + $(this)[0].ClosedCount + "</div>";
        tdContent += "<div style='float: right; width: auto;'>" + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj($(this)[0].RecentDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj($(this)[0].RecentDate)) + "</div>";
        $("#dvReport").append("<div class='itemStyle'>" + tdContent + "</tr>");
        $("#dvReport").append("<div class='tdHide' id='tr_" + $(this)[0].MachineId + "'></tr>");
    });
    viewMoreDisable = false;
    $("#dvLoading").hide();
};

function DataShowLead(machineId) {
    if ($("#tr_" + machineId).is(":visible")) {
        $("#imgLead-" + machineId).removeClass("CollapseImg").addClass("ExpandImage");
        $("#tr_" + machineId).hide();
    }
    else {
        $("#imgLead-" + machineId).removeClass("ExpandImage").addClass("CollapseImg");
        if ($("#tr_" + machineId).html().length == 0) {
            BindEachBannerDetails(machineId);
        }
        $("#tr_" + machineId).show();
    }
}

BindEachBannerDetails = function (machineId) {
    $("#dvLoading").show();
    formBannerLoadClick.MachineId = machineId;

    $.ajax({
        url: "/BannerResponse/EachBannerByMachine",
        type: 'Post',
        data: JSON.stringify({ 'formBannerLoadClick': formBannerLoadClick, 'FormId': formId }),
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

            var bannerName = $(this)[0].Name;
            if (bannerName.length > 100)
                bannerName = bannerName.substring(0, 100);

            tdContent += "<div style='float: left;text-align: left;width: 45%;'><b>[</b> " + GetFormType($(this)[0].FormType) + "<b> ]</b> <label title='" + $(this)[0].Name + "'>" + bannerName + "</label></div>";
            tdContent += "<div style='float: left;text-align: right;width:10%;'>" + $(this)[0].ViewedCount + "</div>";
            if ($(this)[0].FormType == "7" || $(this)[0].FormType == "10")
                tdContent += "<div style='float: left;text-align: right;width: 10%;'>" + $(this)[0].ResponseCount + "</div>";
            else
                tdContent += "<div style='float: left;text-align: right;width: 10%;'>-</div>";
            tdContent += "<div style='float: left;text-align: right;width:15%;'>" + $(this)[0].ClosedCount + "</div>";
            tdContent += "<div style='float: right;text-align: right;width:auto;'>" + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj($(this)[0].RecentDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj($(this)[0].RecentDate)) + "</div>";

            trRowData += "<div class='itemStyle' style='background-color:#FFFEEA;'>" + tdContent + "</div>";
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

    return formTypeData;
};