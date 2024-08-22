
var FormDetails = { Id: 0, FormType: 0, Heading: "", FormCampaignId: 0, FormStatus: null };
var maxRowCount = 0, Offset = 0, rowIndex = 0, FormStatus;
var viewMoreDisable = false;

$(document).ready(function () {
    GetMaxCount();
});

function GetMaxCount() {

    FormDetails.Heading = $("#txt_SearchBy").val();

    if ($("#ui_dllSortStatus").val() == 1)
        FormDetails.FormStatus = true;
    else if ($("#ui_dllSortStatus").val() == 0)
        FormDetails.FormStatus = false;
    else if ($("#ui_dllSortStatus").val() == 2)
        FormDetails.FormStatus = null;

    FormDetails.FormType = $("#ui_dllTypeSort").val();

    $.ajax({
        url: "../Form/AllForms/GetMaxCount",
        type: 'POST',
        data: JSON.stringify({ 'formDetails': FormDetails }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            maxRowCount = response.returnVal;
            if (maxRowCount == 0) {
                $("#dvLoading, #ui_dvContent, #dvTipsExport").hide();
                if ($("#dv_BindingValue").attr("SearchId") == 0) {
                    ClearValues();
                }
                else {
                    $("#dvDefault").show();
                }
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

function ViewMore() {
    if (!viewMoreDisable) {
        $("#dvLoading").show();
        viewMoreDisable = true;
        var numberOfRecords = GetNumberOfRecordsPerPage();
        CreateTable(numberOfRecords);
    }
}

function CreateTable(numberRowsCount) {

    FormDetails.Heading = $("#txt_SearchBy").val();

    if ($("#ui_dllSortStatus").val() == 1)
        FormDetails.FormStatus = true;
    else if ($("#ui_dllSortStatus").val() == 0)
        FormDetails.FormStatus = false;
    else if ($("#ui_dllSortStatus").val() == 2)
        FormDetails.FormStatus = null;

    FormDetails.FormType = $("#ui_dllTypeSort").val();

    var OffSet = rowIndex;
    var FetchNext = numberRowsCount;

    $.ajax({
        url: "../Form/AllForms/Get",
        type: 'Post',
        data: JSON.stringify({ 'OffSet': OffSet, 'FetchNext': FetchNext, 'formDetails': FormDetails }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindFormsDetails,
        error: function (objxmlRequest) {
            window.console.log(objxmlRequest.responseText);
        }
    });
}

function BindFormsDetails(FormDetailsList) {

    rowIndex = FormDetailsList.length + rowIndex;
    $("#div_Records").html(rowIndex + " out of " + maxRowCount + " records");

    if (rowIndex == maxRowCount) {
        $("#ui_lnkViewMore").hide();
    }
    if (rowIndex >= 1 || maxRowCount >= 1) {
        $("#dvTipsExport").show();
    }

    $("#ui_dvContent").show();

    $.each(FormDetailsList, function () {

        var tdContent = "";
        var formDetails = UpdateFormDetails($(this)[0]);

        tdContent = "<div style='float: left; width: 20%;'><a href='" + formDetails.FormResponseUrl + "'>" + $(this)[0].Heading + "</a></div>";
        tdContent += "<div style='float: left; width: 15%;'>" + formDetails.FormType + "</div>";

        if ($(this)[0].FormStatus == true) {
            tdContent += "<div style='float: left; width: 10%;text-align: center;'><img id='imgStatus_" + $(this)[0].Id + "' src='/images/img_trans.gif' class='ActiveImg' onclick='ToogleStatus(" + $(this)[0].Id + ");' border='0' alt='Active' title='Active' style='border:0px;cursor:pointer'/></div>";
        }
        else if ($(this)[0].FormStatus == false) {
            tdContent += "<div style='float: left; width: 10%;text-align: center;'><img id='imgStatus_" + $(this)[0].Id + "' src='/images/img_trans.gif' class='InactiveImg'  src='/images/img_trans.gif' onclick='ToogleStatus(" + $(this)[0].Id + ");' border='0' alt='Stoped' title='InActive' style='border:0px;cursor:pointer'/></div>";
        }

        tdContent += "<div style='float: left; width: 10%;text-align: right;'><a class='IsLeadContributor' href='" + formDetails.ManageUrl + "'>Manage</a> </div>";
        tdContent += "<div style='float: left; width: 10%;text-align: right;'><a href='javascript:void(0);' onclick='GetHtmlContent(" + $(this)[0].Id + "," + $(this)[0].FormType + ");'>Preview</a></div>";

        tdContent += "<div style='float: left; width: 10%;text-align: right;'><img class='IsLeadContributor FormPriorityUpsideImg' title='Move Up' style='border:0px;cursor:pointer;' onclick='ChangePriority(1," + $(this)[0].Id + ");' src='/images/img_trans.gif' alt='up'>  <img class='IsLeadContributor FormPriorityDownImg' title='Move Down' style='border:0px;cursor:pointer;' onclick='ChangePriority(2," + $(this)[0].Id + ");' src='/images/img_trans.gif' alt='down'></div>";
        tdContent += "<div style='float: left; width: 15%;text-align: right;'>" + $.datepicker.formatDate("M dd yy", new Date($(this)[0].CreatedDate.replace("T", " "))) + " " + PlumbTimeFormat(new Date($(this)[0].CreatedDate.replace("T", " "))) + "</div>";
        tdContent += "<div style='float:right;width:auto;text-align: right;'><a onclick='DeleteConfirmation(" + $(this)[0].Id + ");'><img src='/images/img_trans.gif' border='0' class='DeleteImg' alt='Delete' title='Delete' style='cursor:pointer'/></a></div>";
        tdContent = "<div id='ui_div_" + $(this)[0].Id + "' class='itemStyle'>" + tdContent + "</div>";

        $("#ui_dvData").append(tdContent);

    });

    $("#dvLoading").hide();
    viewMoreDisable = false;
}



UpdateFormDetails = function (formDetails) {

    var formResponseUrl = "/Form/Dashboard?FormId=" + formDetails.Id + "&FormType=" + formDetails.FormType + "";

    var formHeading = formDetails.Heading;
    if (formHeading.length > 30)
        formHeading = formHeading.substring(0, 30) + "...";

    var formManageUrl = "", formType = "";

    if (formDetails.FormType == 1) {
        formType = "Video";
        formManageUrl = "/Form/ManageEmbedForm?FormId=" + formDetails.Id + "&FormType=" + formDetails.FormType + "&tab=Personalization";
    }
    else if (formDetails.FormType == 2) {
        formType = "Facebook Audience";
        formManageUrl = "/Form/ManageEmbedForm?FormId=" + formDetails.Id + "&FormType=" + formDetails.FormType + "&tab=Personalization";

    }
    else if (formDetails.FormType == 3) {
        formType = "Presentation";
        formManageUrl = "/Form/ManageEmbedForm?FormId=" + formDetails.Id + "&FormType=" + formDetails.FormType + "&tab=Personalization";

    }
    else if (formDetails.FormType == 4) {
        formType = "Flash";
        formManageUrl = "/Form/ManageEmbedForm?FormId=" + formDetails.Id + "&FormType=" + formDetails.FormType + "&tab=Personalization";

    }
    else if (formDetails.FormType == 5) {
        formType = "Custom HTML";
        formManageUrl = "/Form/ManageEmbedForm?FormId=" + formDetails.Id + "&FormType=" + formDetails.FormType + "&tab=Personalization";

    }
    else if (formDetails.FormType == 6) {
        formType = "Tweets";
        formManageUrl = "/Form/ManageEmbedForm?FormId=" + formDetails.Id + "&FormType=" + formDetails.FormType + "&tab=Personalization";

    }
    else if (formDetails.FormType == 7) {
        formType = "Custom Banner";
        formManageUrl = "/Form/ManageBanner?FormId=" + formDetails.Id + "&FormType=" + formDetails.FormType + "&tab=Personalization";
    }
    else if (formDetails.FormType == 9) {
        formType = "Polls";
        formManageUrl = "/Form/ManagePoll?FormId=" + formDetails.Id + "&FormType=" + formDetails.FormType + "&tab=Personalization";
    }
    else if (formDetails.FormType == 10) {
        formType = "Test an Offer";
        formManageUrl = "/Form/ManageVarietTest?FormId=" + formDetails.Id + "&FormType=" + formDetails.FormType + "&tab=Personalization";
    }
    else if (formDetails.FormType == 12) {
        formType = "Lead Generation";
        formManageUrl = "/Form/CaptureForm?FormId=" + formDetails.Id + "&FormType=" + formDetails.FormType + "&tab=Personalization";
    }
    else if (formDetails.FormType == 16) {
        formType = "Ratings";
        formManageUrl = "/Form/ManageRating?FormId=" + formDetails.Id + "&FormType=" + formDetails.FormType + "&tab=Personalization";
    }
    else if (formDetails.FormType == 17) {
        formType = "RSS Feeds";
        formManageUrl = "/Form/ManageRssFeed?FormId=" + formDetails.Id + "&FormType=" + formDetails.FormType + "&tab=Personalization";
    }
    else if (formDetails.FormType == 18) {
        formType = "Question";
        formManageUrl = "/Form/ManageQuestion?FormId=" + formDetails.Id + "&FormType=" + formDetails.FormType + "&tab=Personalization";
    }
    else if (formDetails.FormType == 19) {
        formType = "Conditional Multi Banner";
        formResponseUrl = formManageUrl = "/Form/MultiConditionBanner?FormId=" + formDetails.Id + "&FormType=" + formDetails.FormType + "&tab=Personalization";
    }
    else if (formDetails.FormType == 20) {
        formType = "Click To Call";
        formManageUrl = "/Form/ManageClickToCall?FormId=" + formDetails.Id + "&FormType=" + formDetails.FormType + "&tab=Personalization";
    }
    return { Heading: formHeading, ManageUrl: formManageUrl, FormType: formType, FormResponseUrl: formResponseUrl };
};

function ClearValues() {

    $("#dvDefault").show();
    $("#dv_BindingValue").removeAttr("SearchId");
    $("#txt_SearchBy").val("");
    $('#ui_dllSortStatus').val('2');
    $('#ui_dllTypeSort').val('0');
}

function ChangePriority(FormPriority, Id) {

    $.ajax({
        url: "../Form/AllForms/ChangePriority",
        type: 'Post',
        data: JSON.stringify({ 'Id': Id, 'FormPriority': FormPriority }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response) {
                $("#ui_dvData > .itemStyle").remove();
                rowIndex = maxRowCount = 0;
                GetMaxCount();
            }
        },
        error: ShowAjaxError
    });
}

ConfirmedDelete = function (Id) {

    $("#dvDeletePanel").hide();
    $.ajax({
        url: "/AllForms/Delete",
        type: 'POST',
        data: JSON.stringify({ 'Id': Id }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response) {
                --rowIndex;
                --maxRowCount;
                $("#div_Records").html(rowIndex + " out of " + maxRowCount + " records");
                $("#ui_div_" + Id).hide("slow");
                if (rowIndex <= 0 || maxRowCount <= 0) {
                    $("#ui_dvContent").hide();
                    $("#dvTipsExport").hide();
                    $("#dvDefault").show();
                }
            }
            $("#dvLoading").hide();
        },
        error: ShowAjaxError
    });
};

function ToogleStatus(Id) {
    $("#dvLoading").show();

    FormDetails.Id = Id;

    if ($("#imgStatus_" + Id).hasClass("InactiveImg"))
        FormDetails.FormStatus = 1;
    else
        FormDetails.FormStatus = 0;

    $.ajax({
        url: "../Form/AllForms/ToogleStatus",
        type: 'POST',
        data: JSON.stringify({ 'formDetails': FormDetails }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response) {
                if (FormDetails.FormStatus == 1)
                    $("#imgStatus_" + Id).removeClass("InactiveImg").addClass("ActiveImg").attr("title", "Toogle to inactive");
                else
                    $("#imgStatus_" + Id).removeClass("ActiveImg").addClass("InactiveImg").attr("title", "Toogle to active");
                CallTrackerStatus();
            }
            $("#dvLoading").hide();
        },
        error: ShowAjaxError
    });
}

ShowSortStatus = function () {

    if ($("#dvSortStatus").is(":visible")) {
        $("#dvSortStatus").hide();
        $("#ui_dllSortStatus").show();
    }
    else {
        $("#dvSortStatus").show();
        $("#ui_dllSortStatus").hide();
    }
};

SortByStatus = function () {

    ShowSortStatus();

    $("#ui_dvData > .itemStyle").remove();
    rowIndex = maxRowCount = 0;
    $("#dv_BindingValue").html("There is no data availaible based on the searched status.Please click on the link <a style='cursor:pointer;color:red;' onclick='GetMaxCount();' href='javascript:void(0);'>back</a> to go back");
    $("#dv_BindingValue").attr("SearchId", 0);
    GetMaxCount();
};

ShowTypeSort = function () {

    if ($("#dvTypeSort").is(":visible")) {
        $("#dvTypeSort").hide();
        $("#ui_dllTypeSort").show();
    }
    else {
        $("#dvTypeSort").show();
        $("#ui_dllTypeSort").hide();
    }
};

SortByType = function () {

    ShowTypeSort();
    $("#ui_dvData > .itemStyle").remove();
    rowIndex = maxRowCount = 0;
    $("#dv_BindingValue").html("There is no data availaible based on the searched status.Please click on the link <a style='cursor:pointer;color:red;' onclick='GetMaxCount();' href='javascript:void(0);'>back</a> to go back");
    $("#dv_BindingValue").attr("SearchId", 0);
    GetMaxCount();
};

function SearchByName() {

    if ($.trim($("#txt_SearchBy").val()).length == 0) {
        ShowErrorMessage("Please enter search by value");
        $("#txt_SearchBy").focus();
        return false;
    }
    else {
        rowIndex = maxRowCount = 0;
        $("#ui_dvData > .itemStyle").remove();
        $("#dv_BindingValue").html("There is no data availaible based on your search.Please click on the link <a style='cursor:pointer;color:red;' onclick='GetMaxCount();' href='javascript:void(0);'>back</a> to go back");
        $("#dv_BindingValue").attr("SearchId", 0);
        GetMaxCount();
    }
}

CallTrackerStatus = function () {

    $.ajax({
        url: "http://s.plumb5.com/P5TrackJs/p5Track.js?AccountId=" + adsId + "&FormStatus=Whatever",
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {

        },
        error: ShowAjaxError
    });
};