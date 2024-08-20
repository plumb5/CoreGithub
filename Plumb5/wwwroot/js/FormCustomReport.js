
var formResponses = { FormId: 0, TrackIp: "", SearchByText: "", PageUrl: "", SearchKeyword: "", Referrer: "", IsAdSenseOrAdWord: 0 };
var allFormFields = [];
var FromDate = "", ToDate = "";

$(document).ready(function () {
    GetIpAddress();
    GetForm();
});
function GetIpAddress() {
    $.ajax({
        url: "/Form/CustomReport/GetIpAddress",
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            $.each(response, function () {
                optlist = document.createElement('option');
                optlist.value = this;
                optlist.text = this;
                document.getElementById("ddlIpAddress").options.add(optlist);
            });
        },
        error: ShowAjaxError
    });
}

function GetForm() {

    $.ajax({
        url: "/Form/CommonDetailsForForms/GetFormsList",
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            $.each(response, function () {

                if ($(this)[0].FormType == 12 || $(this)[0].FormType == 9 || $(this)[0].FormType == 18 || $(this)[0].FormType == 20) {

                    optlist = document.createElement('option');
                    optlist.value = $(this)[0].Id;
                    optlist.text = $(this)[0].Heading;
                    document.getElementById("ddlForms").options.add(optlist);
                }
            });
            $("#dvLoading").hide();
        },
        error: ShowAjaxError
    });
}

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

$("#ui_btnCustomReport").click(function () {
    if (!Validation()) {
        $("#dvLoading").hide();
        return;
    }
    $("#dvLoading").show();
    rowIndex = maxRowCount = 0;
    $("#dvDefault").hide();
    //$("#ui_btnCustomReport").attr("disabled", true);
    $("#dvReport > .itemStyle, #dvReport > .tdHide").remove();
    GetFields();
});

Validation = function () {

    if ($("#txtFromDate").val().length == 0 && $("#ddlIpAddress").get(0).selectedIndex == 0 && $("#ddlForms").get(0).selectedIndex == 0 && $("#txtSearchString").val().length == 0 && $("#drpFields").get(0).selectedIndex == 0) {
        ShowErrorMessage("Please enter any one condition");
        return false;
    }

    if ($("#txtFromDate").val().length > 0 || $("#txtToDate").val().length > 0) {
        if ($("#txtFromDate").val().length == 0) {
            ShowErrorMessage("Please enter From date range");
            return false;
        }
        if ($("#txtToDate").val().length == 0) {
            ShowErrorMessage("Please enter To date range");
            return false;
        }
    }

    if ($("#drpFields").get(0).selectedIndex > 0 && $("#txtFieldAnswer").val().length == 0) {
        ShowErrorMessage("Please enter field answer value");
        return false;
    }

    formResponses.FormId = $("#ddlForms").val();
    formResponses.TrackIp = $("#ddlIpAddress").val();
    FromDate = $("#txtFromDate").val();
    ToDate = $("#txtToDate").val();
    formResponses.SearchByText = $("#txtSearchString").val();

    return true;
};

GetFields = function () {
    $.ajax({
        url: "/Form/Response/GetFormFields",
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            allFormFields = response;
            GetMaxCount();
        },
        error: ShowAjaxError
    });
};

function GetMaxCount() {
    GetFilterConditionIfExists(formResponses);
    $.ajax({
        url: "/Form/CustomReport/GetCustomMaxCount",
        type: 'POST',
        data: JSON.stringify({ 'formResponses': formResponses, 'FromDate': FromDate, 'ToDate': ToDate }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            maxRowCount = result;
            if (maxRowCount == 0) {
                $("#dvViewMore, #dvLoading, #ui_dvContent,#dvTipsExport").hide();
                $("#dvDefault").show();
                $("#ui_btnCustomReport").attr("disabled", false);
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


GetFilterConditionIfExists = function (formResponsesReport) {
    formResponses.IsAdSenseOrAdWord = 0;
    formResponses.PageUrl = formResponsesReport.SearchKeyword = formResponsesReport.Referrer = "";
    if ($("#drpFields").val() == "1" && $("#txtFieldAnswer").val().length > 0) {
        formResponses.PageUrl = $("#txtFieldAnswer").val();

    }
    else if ($("#drpFields").val() == "2" && $("#txtFieldAnswer").val().length > 0) {
        formResponses.SearchKeyword = $("#txtFieldAnswer").val();
    }
    else if ($("#drpFields").val() == "3" && $("#txtFieldAnswer").val().length > 0) {
        formResponses.Referrer = $("#txtFieldAnswer").val();

    }
    else if ($("#drpFields").val() == "4" && $("#txtFieldAnswer").val().length > 0) {
        formResponses.IsAdSenseOrAdWord = $("#txtFieldAnswer").val();
    }
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
        url: "/Form/CustomReport/GetCustomResponses",
        type: 'Post',
        data: JSON.stringify({ 'formResponses': formResponses, 'OffSet': OffSet, 'FetchNext': FetchNext, 'FromDate': FromDate, 'ToDate': ToDate }),
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

    if (rowIndex >= 1 || maxRowCount >= 1) {
        $("#dvTipsExport").show();
    }

    $("#ui_dvContent, #dvPrintExport").show();
    $.each(responseData, function (i) {

        var tdContent = "";

        tdContent = "<div style='float: left; width: 5%;text-align: left;'><a id='lnkCustomer" + $(this)[0].MachineId + "' href=\"javascript:ContactInfo('" + $(this)[0].MachineId + "','" + $(this)[0].ContactId + "');\"><img class='UPC' alt='' src='/images/img_trans.gif' /></a></div>";

        var isNewLeadImg = !$(this)[0].LeadSeen ? "  <img alt='new Lead' title='New Lead' id='newImgLead_" + $(this)[0].FormResponseId + "'  class='NewLead' src='/images/img_trans.gif' />" : "";

        if ($(this)[0].FormType == "16") {
            var ratingTitle = $(this)[0].Heading;
            if (ratingTitle.length > 20)
                ratingTitle = ratingTitle.substring(0, 20) + "..";
            tdContent += "<div style='float: left; width: 25%;'><a href='javascript:void(0);' onclick=\"DataShowLead(" + $(this)[0].FormResponseId + "," + $(this)[0].LeadSeen + ");\"><img class='expandCollapseImg ExpandImage' id='imgLead-" + $(this)[0].FormResponseId + "' alt='' src='/images/img_trans.gif' /><label title='" + $(this)[0].FormHeading + "'>" + ratingTitle + " - " + $(this)[0].Field1 + "</a> " + isNewLeadImg + "</div>";
        }
        else {
            tdContent += "<div style='float: left; width: 25%;'><a href='javascript:void(0);' onclick=\"DataShowLead(" + $(this)[0].FormResponseId + "," + $(this)[0].LeadSeen + ");\"><img class='expandCollapseImg ExpandImage' id='imgLead-" + $(this)[0].FormResponseId + "' alt='' src='/images/img_trans.gif' /> " + $(this)[0].Field1 + "</a>" + isNewLeadImg + "</div>";
        }
        tdContent += "<div style='float: left; width: 15%;'>" + GetFormType($(this)[0].FormType) + "</div>";
     
        tdContent += "<div style='float: left; width: 10%;text-align: right;'>0</div>";
        tdContent += "<div style='float: left; width: 10%;text-align: right;'>" + $(this)[0].TrackIp + "</div>";
        tdContent += "<div style='float: left; width: 15%;text-align: right;'>" + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj($(this)[0].TrackDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj($(this)[0].TrackDate)) + "</div>";
        if ($(this)[0].EmailId != null && $(this)[0].EmailId.length > 0) {
            tdContent += "<div style='float: left; width: 10%;text-align: right;'><a href='javascript:void(0);' onclick=\"PushAddToContact(" + $(this)[0].ContactId + ");\"><img border='0px;' src='/images/img_trans.gif' class='AddToGroup' title='Add contact' /></a></div>";
            tdContent += "<div style='float: right; width: auto;text-align: right;'><a href='javascript:void(0);' onclick=\"showSendMail(this);\" emailid='" + $(this)[0].EmailId + "'><img border='0px;' src='/images/img_trans.gif' class='SendMailToIndividual' title='Send Mail' /></a></div>";
        }
        else {
            tdContent += "<div style='float: left; width: 10%;text-align: right;'><img border='0px;' src='/images/img_trans.gif' class='AddToGroupBlur' title='Add contact' /></div>";
            tdContent += "<div style='float: right; width: 10%;text-align: right;'><img border='0px;' src='/images/img_trans.gif' class='SendMailToIndividualBlur' title='Send Mail' /></div>";
        }
        $("#dvReport").append("<div class='itemStyle'>" + tdContent + "</div>");
        $("#dvReport").append("<div class='tdHide itemStyleSubContent' id='tr_" + $(this)[0].FormResponseId + "'>" + BindSubFieldsData($(this)[0]) + "</div>");
    });
    $("#dvLoading").hide();
    viewMoreDisable = false;
};

BindSubFieldsData = function (formData) {

    var formFields, isPool = false;
    var tdContent = "<div class='itemStyle' style='background-color: #FFFEEA;'><div style='float:left;width:20%;'>Form Heading</div><div style='float:left;width:auto;'>" + formData.Heading + "</div></div>";

    var subHeading = formData.SubHeading == null ? "" : formData.SubHeading

    tdContent += "<div class='itemStyle' style='background-color: #FFFEEA;'><div style='float:left;width:20%;'>Form description</div><div style='float:left;width:auto;'>" + subHeading + "</div></div>";

    var exportContentOfEachField = "";
    for (var i = 0; i < allFormFields.length; i++)
        if (allFormFields[i].length > 0 && allFormFields[i][0].FormId == formData.FormId)
        { formFields = allFormFields[i]; break; }


    if (formData.FormType == "9" || formData.FormType == "18" || formData.FormType == "16") {
        tdContent += "<div class='itemStyle' style='background-color: #FFFEEA;'><div style='float:left;width:20%;'>Ratted</div><div style='float:left;width:auto;'>" + formData.Field1 + "</div></div>"
        exportContentOfEachField += "<td>" + formData.Field1 + "</td>";
        isPool = true;
    }
    else {
        for (var i = 0; i < formFields.length; i++) {
            isPool = false;
            tdContent += "<div class='itemStyle' style='background-color: #FFFEEA;'><div style='float:left;width:20%;'>" + formFields[i].Name + "</div><div style='float:left;width:auto;'>" + formData["Field" + (i + 1)] + "</div></div>"
        }
    }


    tdContent += "<div class='itemStyle' style='background-color: #FFFEEA;'><div style='float:left;width:20%;'>Place</div><div style='float:left;width:auto;'>" + formData.City + "</div></div>";
    tdContent += "<div class='itemStyle' style='background-color: #FFFEEA;'><div style='float:left;width:20%;'>Page Url</div><div style='float:left;width:auto;'>" + formData.PageUrl + "</div></div>";
    tdContent += "<div class='itemStyle' style='background-color: #FFFEEA;'><div style='float:left;width:20%;'>Referrer Page</div><div style='float:left;width:auto;'>" + formData.Referrer + "</div></div>";

    var IsAdSenseOrAdWord = formData.IsAdSenseOrAdWord != "0" ? formData.IsAdSenseOrAdWord == "1" ? " - <b>AdWord</b>" : " - <b>AdSense</b>" : "";
    tdContent += "<div class='itemStyle' style='background-color: #FFFEEA;'><div style='float:left;width:20%;'>Search Keyword</div><div style='float:left;width:auto;'>" + formData.SearchKeyword + IsAdSenseOrAdWord + "</div></div>";
    return tdContent;
};

function DataShowLead(formResponseId, LeadSeen) {
    if ($("#tr_" + formResponseId).is(":visible")) {
        $("#imgLead-" + formResponseId).removeClass("CollapseImg").addClass("ExpandImage");
        $("#tr_" + formResponseId).hide();
    }
    else {
        $("#imgLead-" + formResponseId).removeClass("ExpandImage").addClass("CollapseImg");
        $("#tr_" + formResponseId).show();
        if (!LeadSeen) {
            $("#newImgLead_" + formResponseId).hide();

            $.ajax({
                url: "/Form/Response/Update",
                type: 'POST',
                data: JSON.stringify({ 'Id': formResponseId }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) {
                    $("#dvLoading").hide();
                },
                error: ShowAjaxError
            });
        }
    }
}


