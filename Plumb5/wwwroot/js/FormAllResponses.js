var maxRowCount = 0, OffSet = 0, rowIndex = 0, FormStatus, formId = 0, allFormFields = [];
var viewMoreDisable = false;
var formResponses = { FormId: 0 };
var visitorType = 0;

$(document).ready(function () {
    formId = urlParam("FormId");
    Intializer();
    GetFields();
});

Intializer = function () {
    formResponses.FormId = formId;
};

GetFields = function () {
    $.ajax({
        url: "/Form/Response/GetFormFields",
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            allFormFields = response;
            GetDateTimeRange(2);
        },
        error: ShowAjaxError
    });
};

var CallBackFunction = function () {
    maxRowCount = OffSet = rowIndex = 0;
    $("#ui_dvData").empty();
    GetMaxCount();
};

function GetMaxCount() {

    $.ajax({
        url: "/Form/Response/GetMaxCount",
        type: 'POST',
        data: JSON.stringify({ 'FromDateTime': FromDateTime, 'ToDateTime': ToDateTime, 'VisitorType': visitorType }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            maxRowCount = result;
            if (maxRowCount === 0) {
                $("#dvLoading, #divcontent, #dvTipsExport").hide();
                $("#dvDefault").show();
            }
            else if (maxRowCount > 0) {
                $("#dvDefault").hide();
                var numberOfRecords = GetNumberOfRecordsPerPage();
                CreateTable(numberOfRecords);
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
        url: "/Form/Response/GetResponses",
        type: 'Post',
        data: JSON.stringify({ 'FormId': formId, 'OffSet': OffSet, 'FetchNext': FetchNext, 'FromDateTime': FromDateTime, 'ToDateTime': ToDateTime, 'VisitorType': visitorType }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: ResponseData,
        error: ShowAjaxError
    });
}

ResponseData = function (responseData) {

    rowIndex = responseData.length + rowIndex;
    $("#div_Records").html(rowIndex + " out of " + maxRowCount + " records");

    if (rowIndex === maxRowCount) {
        $("#ui_lnkViewMore").hide();
    }

    if (rowIndex >= 1 || maxRowCount >= 1) {
        $("#dvTipsExport").show();
    }

    $("#divcontent, #dvPrintExport").show();
    $.each(responseData, function (i) {

        var tdContent = "";

        tdContent = "<div style='float: left; width: 5%;text-align: center;'><a id='lnkCustomer" + $(this)[0].MachineId + "' href=\"javascript:ContactInfo('" + $(this)[0].MachineId + "','" + $(this)[0].ContactId + "');\"><img class='UPC' alt='' src='/images/img_trans.gif' /></a></div>";

        var isNewLeadImg = !$(this)[0].LeadSeen ? "  <img alt='new Lead' title='New Lead' id='newImgLead_" + $(this)[0].FormResponseId + "' class='NewLead' src='/images/img_trans.gif' />" : "";

        if ($(this)[0].FormType == "16") {
            var ratingTitle = $(this)[0].Heading;
            if (ratingTitle.length > 20)
                ratingTitle = ratingTitle.substring(0, 20) + "..";
            tdContent += "<div style='float: left; width: 20%;'><a href='javascript:void(0);' onclick=\"DataShowLead(" + $(this)[0].FormResponseId + "," + $(this)[0].LeadSeen + ");\"><img class='expandCollapseImg ExpandImage' id='imgLead-" + $(this)[0].FormResponseId + "' alt='' src='/images/img_trans.gif' /><label title='" + $(this)[0].FormHeading + "'>" + ratingTitle + " - " + $(this)[0].Field1 + "</a> " + isNewLeadImg + "</div>";
        }
        else {
            tdContent += "<div style='float: left; width: 20%;'><a href='javascript:void(0);' onclick=\"DataShowLead(" + $(this)[0].FormResponseId + "," + $(this)[0].LeadSeen + ");\"><img class='expandCollapseImg ExpandImage' id='imgLead-" + $(this)[0].FormResponseId + "' alt='' src='/images/img_trans.gif' /> " + $(this)[0].Field1 + "</a>" + isNewLeadImg + "</div>";
        }

        if ($(this)[0].VisitorType > 1)
            tdContent += "<div style='float: left;text-align: center; width: 15%;'>Repeat Visitor</div>";
        else
            tdContent += "<div style='float: left;text-align: center; width: 15%;'>New Visitor</div>";

        tdContent += "<div style='float: left; width: 11%; text-align: center;'>" + GetFormType($(this)[0].FormType) + "</div>";

        tdContent += "<div style='float: left; width: 10%;text-align: right; text-align: center;'>0</div>";
        tdContent += "<div style='float: left; width: 10%;text-align: right;'>" + $(this)[0].TrackIp + "</div>";
        tdContent += "<div style='float: left; width: 15%;text-align: right;'>" + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj($(this)[0].TrackDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj($(this)[0].TrackDate)) + "</div>";

        if ($(this)[0].ContactId > 0)
            tdContent += "<div style='float: left; width: 7%;text-align: right;'><a class='FormAddToGroup ContributePermission' href='javascript:void(0);' onclick=\"PushAddToContact(" + $(this)[0].ContactId + ");\"><img border='0px;' src='/images/img_trans.gif' class='AddToGroup' title='Add contact' /></a></div>";
        else
            tdContent += "<div style='float: left; width: 7%;text-align: right;'><img border='0px;' src='/images/img_trans.gif' class='AddToGroupBlur' title='Add contact' /></div>";

        if ($(this)[0].EmailId != null && $(this)[0].EmailId.length > 0)
            tdContent += "<div style='float: right; width: auto;text-align: right;'><a class='FormSendMail ContributePermission' href='javascript:void(0);' onclick=\"showSendMail(this);\" emailid='" + $(this)[0].EmailId + "' ContactId=" + $(this)[0].ContactId + "><img border='0px;' src='/images/img_trans.gif' class='SendMailToIndividual' title='Send Mail' /></a></div>";
        else
            tdContent += "<div style='float: right; width: 7%;text-align: right;'><img border='0px;' src='/images/img_trans.gif' class='SendMailToIndividualBlur' title='Send Mail' /></div>";

        $("#ui_dvData").append("<div class='itemStyle'>" + tdContent + "</div>");
        $("#ui_dvData").append("<div class='tdHide itemStyleSubContent' id='tr_" + $(this)[0].FormResponseId + "'>" + BindSubFieldsData($(this)[0]) + "</div>");
    });
    $("#dvLoading").hide();
    viewMoreDisable = false;
    CheckAccessPermission("Form");
};

BindSubFieldsData = function (formData) {

    var formFields, isPool = false;
    var tdContent = "<div class='itemStyle' style='background-color: #FFFEEA;'><div style='float:left;width:20%;'>Form Title</div><div style='float:left;width:auto;'>" + formData.Heading + "</div></div>";

    var subHeading = formData.SubHeading == null ? "" : formData.SubHeading

    tdContent += "<div class='itemStyle' style='background-color: #FFFEEA;'><div style='float:left;width:20%;'>Form description</div><div style='float:left;width:auto;'>" + subHeading + "</div></div>";

    var exportContentOfEachField = "";
    for (var i = 0; i < allFormFields.length; i++)
        if (allFormFields[i].length > 0 && allFormFields[i][0].FormId == formData.FormId) { formFields = allFormFields[i]; break; }


    if (formData.FormType == "9" || formData.FormType == "18" || formData.FormType == "16") {
        tdContent += "<div class='itemStyle' style='background-color: #FFFEEA;'><div style='float:left;width:20%;'>Rated</div><div style='float:left;width:auto;'>" + formData.Field1 + "</div></div>"
        exportContentOfEachField += "<td>" + formData.Field1 + "</td>";
        isPool = true;
    }
    else {
        for (var i = 0; i < formFields.length; i++) {
            isPool = false;
            if (formFields[i].FieldType < 15 || formFields[i].FieldType > 20)
                tdContent += "<div class='itemStyle' style='background-color: #FFFEEA;'><div style='float:left;width:20%;'>" + formFields[i].Name + "</div><div style='float:left;width:auto;'>" + formData["Field" + (i + 1)] + "</div></div>"
        }
    }

    tdContent += "<div class='itemStyle' style='background-color: #FFFEEA;'><div style='float:left;width:20%;'>Place</div><div style='float:left;width:auto;'>" + (formData.City == null ? "" : formData.City) + "</div></div>";

    var PageUrl = formData.PageUrl == null ? "" : formData.PageUrl;

    if (PageUrl != "" && PageUrl.length > 120)
        PageUrl = PageUrl.substring(0, 120) + "..";

    tdContent += "<div class='itemStyle' style='background-color: #FFFEEA;'><div style='float:left;width:20%;'>Page Url</div><div title='" + formData.PageUrl + "' style='float:left;width:auto;'>" + PageUrl + "</div></div>";

    tdContent += "<div class='itemStyle' style='background-color: #FFFEEA;'><div style='float:left;width:20%;'>Referrer Page</div><div style='float:left;width:auto;'>" + (formData.Referrer == null ? "" : formData.Referrer) + "</div></div>";

    var IsAdSenseOrAdWord = formData.IsAdSenseOrAdWord != "0" ? formData.IsAdSenseOrAdWord == "1" ? " - <b>AdWord</b>" : " - <b>AdSense</b>" : "";
    tdContent += "<div class='itemStyle' style='background-color: #FFFEEA;'><div style='float:left;width:20%;'>Search Keyword</div><div style='float:left;width:auto;'>" + formData.SearchKeyword + IsAdSenseOrAdWord + "</div></div>";
    tdContent += "<div class='itemStyle' style='background-color: #FFFEEA;'><div style='float:left;width:20%;'>UTM Tag Source</div><div style='float:left;width:auto;'>" + (formData.UtmTagSource != null && formData.UtmTagSource != "" && formData.UtmTagSource != undefined && formData.UtmTagSource.length > 0 ? formData.UtmTagSource : "NA") + "</div></div>";
    tdContent += "<div class='itemStyle' style='background-color: #FFFEEA;'><div style='float:left;width:20%;'>Utm Medium</div><div style='float:left;width:auto;'>" + (formData.UtmMedium != null && formData.UtmMedium != "" && formData.UtmMedium != undefined && formData.UtmMedium.length > 0 ? formData.UtmMedium : "NA") + "</div></div>";
    tdContent += "<div class='itemStyle' style='background-color: #FFFEEA;'><div style='float:left;width:20%;'>Utm Campaign</div><div style='float:left;width:auto;'>" + (formData.UtmCampaign != null && formData.UtmCampaign != "" && formData.UtmCampaign != undefined && formData.UtmCampaign.length > 0 ? formData.UtmCampaign : "NA") + "</div></div>";
    tdContent += "<div class='itemStyle' style='background-color: #FFFEEA;'><div style='float:left;width:20%;'>Utm Term</div><div style='float:left;width:auto;'>" + (formData.UtmTerm != null && formData.UtmTerm != "" && formData.UtmTerm != undefined && formData.UtmTerm.length > 0 ? formData.UtmTerm : "NA") + "</div></div>";
    tdContent += "<div class='itemStyle' style='background-color: #FFFEEA;'><div style='float:left;width:20%;'>Utm Content</div><div style='float:left;width:auto;'>" + (formData.UtmContent != null && formData.UtmContent != "" && formData.UtmContent != undefined && formData.UtmContent.length > 0 ? formData.UtmContent : "NA") + "</div></div>";
    tdContent += "<div class='itemStyle' style='background-color: #FFFEEA;'><div style='float:left;width:20%;'>MailSubscribe</div><div style='float:left;width:auto;'>" + (formData.MailSubscribe != null && formData.MailSubscribe != undefined ? formData.MailSubscribe : "NA") + "</div></div>";
    tdContent += "<div class='itemStyle' style='background-color: #FFFEEA;'><div style='float:left;width:20%;'>MailOverallSubscribe</div><div style='float:left;width:auto;'>" + (formData.MailOverallSubscribe != null && formData.MailOverallSubscribe != undefined ? formData.MailOverallSubscribe : "NA") + "</div></div>";
    tdContent += "<div class='itemStyle' style='background-color: #FFFEEA;'><div style='float:left;width:20%;'>SmsSubscribe</div><div style='float:left;width:auto;'>" + (formData.SmsSubscribe != null && formData.SmsSubscribe != undefined ? formData.SmsSubscribe : "NA") + "</div></div>";
    tdContent += "<div class='itemStyle' style='background-color: #FFFEEA;'><div style='float:left;width:20%;'>SmsOverallSubscribe</div><div style='float:left;width:auto;'>" + (formData.SmsOverallSubscribe != null && formData.SmsOverallSubscribe != undefined ? formData.SmsOverallSubscribe : "NA") + "</div></div>";

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
            $("#dvLoading").show();

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

GetFormType = function (formType) {
    var formTypeData = "";
    if (formType === 1)
        formTypeData = "Video";
    else if (formType === 2)
        formTypeData = "Facebook Audience";
    else if (formType === 3)
        formTypeData = "Presentation";
    else if (formType === 4)
        formTypeData = "Flash";
    else if (formType === 5)
        formTypeData = "Custom HTML";
    else if (formType === 6)
        formTypeData = "Tweets";
    else if (formType === 7)
        formTypeData = "Custom Banner";
    else if (formType === 8)
        formTypeData = "";
    else if (formType === 9)
        formTypeData = "Polls";
    else if (formType === 10)
        formTypeData = "Test an Offer";
    else if (formType === 12)
        formTypeData = "Lead Generation";
    else if (formType === 16)
        formTypeData = "Ratings";
    else if (formType === 17)
        formTypeData = "RSS Feeds";
    else if (formType === 18)
        formTypeData = "Question";
    else if (formType === 20)
        formTypeData = "Click To Call";

    return formTypeData;
};

ShowVisitorType = function () {
    if ($("#lblVisitorType").is(":visible")) {
        $("#lblVisitorType").hide();
        $("#ui_ddlVisitorType").show();
    }
    else {
        $("#lblVisitorType").show();
        $("#ui_ddlVisitorType").hide();
    }
};

SortByVisitorType = function () {
    ShowVisitorType();
    var filtervalue = '';
    visitorType = parseInt($('#ui_ddlVisitorType').val());

    if (visitorType === 1)
        filtervalue = "<div id='1' class='vrAutocomplete' style='vertical-align: middle;'><span class='vnAutocomplete'><div class='vtAutocomplete'>VisitorType = New </div></span></div>";

    if (visitorType === 2)
        filtervalue = "<div id='2' class='vrAutocomplete' style='vertical-align: middle;'><span class='vnAutocomplete'><div class='vtAutocomplete'>VisitorType = Repeat </div></span></div>";

    $("#bindsel").html(filtervalue);

    rowIndex = 0;
    $('#ui_dvData').empty();
    GetMaxCount();
};
