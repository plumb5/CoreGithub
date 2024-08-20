
var maxRowCount = 0, OffSet = 0, rowIndex = 0, FormStatus, formId = 0, allFormFields = [];
var viewMoreDisable = false;
var formResponses = { FormId: 0 };
var ConfigId = 0;
var Action = 0;

$(document).ready(function () {
    ConfigId = urlParam("ConfigId");
    Action = urlParam("action");
    FromDateTime = urlParam("FromDate") == 0 ? null : urlParam("FromDate").replace('%20', ' ');
    ToDateTime = urlParam("ToDate") == 0 ? null : urlParam("ToDate").replace('%20', ' ');
    GetFields();
});


GetFields = function () {
    $.ajax({
        url: "/Response/GetFormFields",
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            allFormFields = response;

            if ((FromDateTime != null && ToDateTime != null) && (FromDateTime != "" && ToDateTime != "") && (FromDateTime != undefined && ToDateTime != undefined)) {
                a = new Date(FromDateTime);
                b = new Date(ToDateTime);
                window.lblDate.innerHTML = a.getDate(FromDateTime) + ' ' + monthDetials[a.getMonth(FromDateTime)] + ' ' + a.getFullYear(FromDateTime) + ' - ' + b.getDate(ToDateTime) + ' ' + monthDetials[b.getMonth(ToDateTime)] + ' ' + b.getFullYear(ToDateTime);
                GetMaxCount();
            }
            else {
                GetDateTimeRange(2);
            }
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
        url: "/WorkFlow/CampaignFormResponseReport/GetMaxCount",
        type: 'POST',
        data: JSON.stringify({ 'ConfigureFormId': ConfigId, 'Action': Action, 'FromDateTime': FromDateTime, 'ToDateTime': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            maxRowCount = result;
            if (maxRowCount == 0) {
                $("#dvLoading, #divcontent, #dvTipsExport").hide();
                $("#dvDefault").show();
            }
            else if (maxRowCount > 0) {
                $("#dvDefault").hide();
                $("#divcontent").show();
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
        url: "/WorkFlow/CampaignFormResponseReport/GetResponses",
        type: 'Post',
        data: JSON.stringify({ 'ConfigureFormId': ConfigId, 'Action': Action, 'OffSet': OffSet, 'FetchNext': FetchNext, 'FromDateTime': FromDateTime, 'ToDateTime': ToDateTime }),
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

        if (rowIndex >= 1 || maxRowCount >= 1) {
            $("#dvTipsExport").show();
        }

        switch (parseInt(Action)) {
            case 1:
            case 3:
                $("#ui_overallConditionResponse").show();
                BindConditionResponses(responseData);
                break;
            case 2:
                BindAllResponses(responseData);
                break;
            case 4:
                $("#ui_overallConditionResponse").show();
                BindOverAllResponses(responseData);
                break;
        }

        $("#dvLoadingImg").hide();
        viewMoreDisable = false;
        //CheckAccessPermission("Form");
    }
    else {
        $("#dvLoading, #divcontent, #dvTipsExport").hide();
        $("#dvDefault").show();
    }
};

function BindAllResponses(responseData) {
    $.each(responseData, function (i) {
        if ($(this)[0].FormType == 10 || $(this)[0].FormType == 7 || $(this)[0].FormType == 5) {
            $("#ui_overallConditionResponse").show();
            BindConditionResponsesEach($(this)[0]);
        }
        else {
            $("#ui_overallResponse").show();
            BindFormResponseEach($(this)[0]);
        }
    });
}

function BindConditionResponses(responseData) {

    $.each(responseData, function (i) {
        BindConditionResponsesEach($(this)[0]);
    });
}

function BindOverAllResponses(responseData) {
    $.each(responseData, function (i) {
        var tdContent = "";

        //var Heading = $(this)[0].Heading.length > 15 ? $(this)[0].FormName.substring(0, 15) + "..." : $(this)[0].FormName;

        if ($(this)[0].EmailId != null && $(this)[0].EmailId.length > 0) {
            tdContent += "<div style='float:left;width:20%;text-align:left;'><a href='javascript:void(0);' onclick=\"AllShowData(" + $(this)[0].Id + "," + $(this)[0].LeadSeen + ");\"><img class='expandCollapseImg ExpandImage' id='imgLead-" + $(this)[0].Id + "' alt='' src='/images/img_trans.gif' />" + $(this)[0].MachineId + "</div>";
        }
        else {
            tdContent += "<div style='float:left;width:20%;text-align:left;'>" + $(this)[0].MachineId + "</div>";
        }
        tdContent += "<div style='float:left;width:15%;text-align:left;'>" + $(this)[0].TrackIp + "</div>";
        tdContent += "<div style='float:left;width:15%;text-align:left;'>" + GetFormType($(this)[0].FormType) + "</div>";
        tdContent += "<div style='float:left;width:10%;text-align:right;'>" + $(this)[0].ViewedCount + "</div>";
        tdContent += "<div style='float:left;width:10%;text-align:right;'>" + $(this)[0].ResponseCount + "</div>";
        tdContent += "<div style='float:left;width:10%;text-align:right;'>" + $(this)[0].ClosedCount + "</div>";
        tdContent += "<div style='float:right; width: 15%;text-align: right;'>" + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj($(this)[0].RecentDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj($(this)[0].RecentDate)) + "</div>";
        $("#ui_dvData").append("<div class='itemStyle'>" + tdContent + "</div>");

        if ($(this)[0].EmailId != null && $(this)[0].EmailId.length > 0)
            $("#ui_dvData").append("<div class='tdHide itemStyleSubContent' id='tr_" + $(this)[0].Id + "'>" + BindSubFieldsData($(this)[0]) + "</div>");
    });
}

function BindConditionResponsesEach(data) {
    var tdContent = "";
    //var FormName;
    //if ($(this)[0].FormName != null) {
    //    FormName = $(this)[0].FormName.length > 15 ? $(this)[0].FormName.substring(0, 15) + "..." : $(this)[0].FormName;
    //}

    if (data.ContactId > 0) {
        tdContent = "<div style='float: left; width: 5%;text-align: left;'><a id='lnkCustomer" + data.MachineId + "' href=\"javascript:ContactInfo('" + data.MachineId + "','" + data.ContactId + "');\"><img class='UPC' alt='' src='/images/img_trans.gif' /></a></div>";
    }
    else {
        tdContent = "<div style='float: left; width: 5%;text-align: left;'><a id='lnkCustomer" + data.MachineId + "' href=\"javascript:ContactInfo('" + data.MachineId + "','');\"><img class='UPC' alt='' src='/images/img_trans.gif' /></a></div>";
    }

    tdContent += "<div style='float:left;width:15%;text-align:left;'> Visitor - " + data.MachineId.substring(data.MachineId.length - 4) + "</div>";
    tdContent += "<div style='float:left;width:15%;text-align:left;'>" + data.TrackIp + "</div>";
    tdContent += "<div style='float:left;width:15%;text-align:left;'>" + GetFormType(data.FormType) + "</div>";
    tdContent += "<div style='float:left;width:10%;text-align:right;'>" + data.ViewedCount + "</div>";
    tdContent += "<div style='float:left;width:10%;text-align:right;'>" + data.ResponseCount + "</div>";
    tdContent += "<div style='float:left;width:10%;text-align:right;'>" + data.ClosedCount + "</div>";
    tdContent += "<div style='float:right; width: 15%;text-align: right;'>" + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(data.RecentDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(data.RecentDate)) + "</div>";
    $("#ui_dvData").append("<div class='itemStyle'>" + tdContent + "</div>");
}

function BindFormResponseEach(data) {
    var tdContent = "";

    tdContent = "<div style='float: left; width: 5%;text-align: left;'><a id='lnkCustomer" + data.MachineId + "' href=\"javascript:ContactInfo('" + data.MachineId + "','" + data.ContactId + "');\"><img class='UPC' alt='' src='/images/img_trans.gif' /></a></div>";

    var isNewLeadImg = !data.LeadSeen ? "  <img alt='new Lead' title='New Lead' id='newImgLead_" + data.FormResponseId + "' class='NewLead' src='/images/img_trans.gif' />" : "";

    if (data.FormType == "16") {
        var ratingTitle = data.Heading;
        if (ratingTitle.length > 20)
            ratingTitle = ratingTitle.substring(0, 20) + "..";
        tdContent += "<div style='float: left; width: 25%;'><a href='javascript:void(0);' onclick=\"DataShowLead(" + data.FormResponseId + "," + data.LeadSeen + ");\"><img class='expandCollapseImg ExpandImage' id='imgLead-" + data.FormResponseId + "' alt='' src='/images/img_trans.gif' /><label title='" + data.FormHeading + "'>" + ratingTitle + " - " + data.Field1 + "</a> " + isNewLeadImg + "</div>";
    }
    else {
        tdContent += "<div style='float: left; width: 25%;'><a href='javascript:void(0);' onclick=\"DataShowLead(" + data.FormResponseId + "," + data.LeadSeen + ");\"><img class='expandCollapseImg ExpandImage' id='imgLead-" + data.FormResponseId + "' alt='' src='/images/img_trans.gif' /> " + data.Field1 + "</a>" + isNewLeadImg + "</div>";
    }
    tdContent += "<div style='float: left; width: 15%;'>" + GetFormType(data.FormType) + "</div>";


    tdContent += "<div style='float: left; width: 10%;text-align: right;'>0</div>";
    tdContent += "<div style='float: left; width: 10%;text-align: right;'>" + data.TrackIp + "</div>";
    tdContent += "<div style='float: left; width: 15%;text-align: right;'>" + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(data.TrackDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(data.TrackDate)) + "</div>";

    if (data.EmailId != null && data.EmailId.length > 0) {
        tdContent += "<div style='float: left; width: 10%;text-align: right;'><a class='FormAddToGroup ContributePermission' href='javascript:void(0);' onclick=\"PushAddToContact(" + data.ContactId + ");\"><img border='0px;' src='/images/img_trans.gif' class='AddToGroup' title='Add contact' /></a></div>";
        //tdContent += "<div style='float: right; width: auto;text-align: right;'><a class='FormSendMail ContributePermission' href='javascript:void(0);' onclick=\"showSendMail(this);\" emailid='" + $(this)[0].EmailId + "' ContactId=" + $(this)[0].ContactId + "><img border='0px;' src='/images/img_trans.gif' class='SendMailToIndividual' title='Send Mail' /></a></div>";
    }
    else {
        tdContent += "<div style='float: left; width: 10%;text-align: right;'><img border='0px;' src='/images/img_trans.gif' class='AddToGroupBlur' title='Add contact' /></div>";
        //tdContent += "<div style='float: right; width: 10%;text-align: right;'><img border='0px;' src='/images/img_trans.gif' class='SendMailToIndividualBlur' title='Send Mail' /></div>";
    }
    $("#ui_dvData").append("<div class='itemStyle'>" + tdContent + "</div>");
    $("#ui_dvData").append("<div class='tdHide itemStyleSubContent' id='tr_" + data.FormResponseId + "'>" + BindSubFieldsData(data) + "</div>");
}


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
        tdContent += "<div class='itemStyle' style='background-color: #FFFEEA;'><div style='float:left;width:20%;'>Rated</div><div style='float:left;width:auto;'>" + formData.Field1 + "</div></div>"
        exportContentOfEachField += "<td>" + formData.Field1 + "</td>";
        isPool = true;
    }
    else {
        for (var i = 0; i < formFields.length; i++) {
            isPool = false;
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
                url: "/WorkFlow/CampaignFormResponseReport/Update",
                type: 'POST',
                data: JSON.stringify({ 'Id': Id }),
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

function AllShowData(formResponseId, LeadSeen) {
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
        }
    }
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

