var inAppCampaignId = 0;
var FormResponses = [];
$(document).ready(function () {
    MobileInAppFormResponsesUtil.GetMobileInAppFormCampaign();
    ExportFunctionName = "FormResponsesExport";
});

$("#ui_drpdwn_MobileForms").select2({
    minimumResultsForSearch: '',
    dropdownAutoWidth: false
});

$("#ui_drpdwn_MobileForms").on('change', function () {
    ShowPageLoading();
    inAppCampaignId = $("#ui_drpdwn_MobileForms").val();
    MobileInAppFormResponsesUtil.GetMaxCount();
});

function CallBackFunction() {
    TotalRowCount = 0;
    CurrentRowCount = 0;
    MobileInAppFormResponsesUtil.GetMaxCount();
}

function CallBackPaging() {
    CurrentRowCount = 0;
    MobileInAppFormResponsesUtil.GetReport();
}

var MobileInAppFormResponsesUtil = {
    GetMobileInAppFormCampaign: function () {
        $.ajax({
            url: "/MobileInApp/Reports/GetMobileInAppFormCampaign",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != null && response != undefined && response.length > 0) {
                    $.each(response, function (i) {
                        $('#ui_drpdwn_MobileForms').append($("<option></option>").attr("value", this.Id).text(this.Name).attr("title", this.Name));
                    });
                }
                GetUTCDateTimeRange(2);
            },
            error: ShowAjaxError
        });
    },
    GetMaxCount: function () {
        $.ajax({
            url: "/MobileInApp/Reports/GetFormResponsesMaxCount",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime, 'InAppCampaignId': inAppCampaignId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                TotalRowCount = response;

                if (TotalRowCount > 0)
                    MobileInAppFormResponsesUtil.GetReport();
                else {
                    SetNoRecordContent('ui_tblReportData', 4, 'ui_tbodyReportData');
                    HidePageLoading();
                }
            },
            error: ShowAjaxError
        });
    },
    GetReport: function () {
        FetchNext = GetNumberOfRecordsPerPage();
        $.ajax({
            url: "/MobileInApp/Reports/GetFormResponsesReport",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime, 'OffSet': OffSet, 'FetchNext': FetchNext, 'InAppCampaignId': inAppCampaignId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: MobileInAppFormResponsesUtil.BindReport,
            error: ShowAjaxError
        });
    },
    BindReport: function (response) {
        SetNoRecordContent('ui_tblReportData', 4, 'ui_tbodyReportData');
        if (response != undefined && response != null) {
            FormResponses = response;
            CurrentRowCount = response.length;
            PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);

            var reportTableTrs = "";
            $.each(response, function () {
                var UCP = this.IsNew ? `MobileInAppFormResponsesUtil.UpdateIsNew(${this.Id},false,'${this.Field1}',${this.DeviceId},${this.ContactId});` : `ShowContactUCP('','${this.DeviceId}',${this.ContactId});`;
                var isNew = this.IsNew ? `<sup class='newtext'>New</sup>` : ``;
                reportTableTrs += `<tr>
                                    <td class="frmresucp" onclick="${UCP}"><i class="fa fa-address-card-o"></i></td>
                                    <td id="ui_td_MobileInAppName_${this.Id}" onclick=\"MobileInAppFormResponsesUtil.GetResponseDetails(${this.Id},${this.InAppCampaignId});\">
                                        <a href="javascript:void(0);" class="textprilink">${this.Field1}</a>${isNew}
                                    </td>
                                    <td class="text-color-blue">${this.TrackIp}</td>
                                    <td>${$.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(this.ResponseDate))}</td>
                                </tr>`;
            });

            $("#ui_tblReportData").removeClass('no-data-records');
            $("#ui_tbodyReportData").html(reportTableTrs);
            ShowExportDiv(true);
            ShowPagingDiv(true);
        }
        else {
            ShowExportDiv(false);
            ShowPagingDiv(false);
        }
        HidePageLoading();
    },
    UpdateIsNew: function (Id, isNew, Name, DeviceId, ContactId) {
        $.ajax({
            url: "/MobileInApp/Reports/UpdateIsNew",
            type: 'Post',
            data: JSON.stringify({ 'AdsId': Plumb5AccountId, 'Id': Id, 'isNew': isNew }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response) {
                    $("#ui_td_MobileInAppName_" + Id).empty();
                    $("#ui_td_MobileInAppName_" + Id).html("<a href='javascript:void(0);' class='textprilink'>" + Name + "</a>");
                }
                ShowContactUCP("", DeviceId, ContactId);
            },
            error: ShowAjaxError
        });
    },
    GetResponseDetails: function (Id, InAppCampaignId) {
        ShowPageLoading();
        $.ajax({
            url: "/MobileInApp/Reports/GetFields",
            type: 'POST',
            data: JSON.stringify({ 'InAppCampaignId': InAppCampaignId, 'AccountId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {

                MobileInAppFormResponsesUtil.BindResponseData(Id, response);
            },
            error: ShowAjaxError
        });
        $(".popupcontainer").removeClass("hideDiv");
    },
    BindResponseData: function (Id, allFormFields) {
        var responseName = "";
        var responsedetails = $(FormResponses).filter(function (i) {
            return FormResponses[i].Id === Id;
        });

        $("#ui_tbl_FormResponseDetails tbody").empty();
        var tdContent = "";
        if (allFormFields !== null && allFormFields !== undefined && allFormFields.formFields.length > 0) {
            for (var l = 0; l < allFormFields.formFields.length; l++) {
                var value = responsedetails[0]["Field" + (l + 1)] !== null ? responsedetails[0]["Field" + (l + 1)] : "NA";
                tdContent += "<tr>" +
                    "<td class='text-left td-icon'>" + allFormFields.formFields[l].Name + "</td>" +
                    "<td class='wordbreak-all'>" + value + "</td>" +
                    "</tr>";
            }
        }
        $("#ui_tbl_FormResponseDetails tbody").append(tdContent);
        HidePageLoading();

    }

};
$("#close-popup, .clsepopup").click(function () {
    $(this).parents(".popupcontainer").addClass("hideDiv");
});