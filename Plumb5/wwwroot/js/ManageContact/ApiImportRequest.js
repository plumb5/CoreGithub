var JsonContentArray = [];
var Name = "";
var Requestcontent = "";
var IsContactSuccess = null;
var IsLmsSuccess = null;

$(document).ready(() => {
    //GetApiNames();
    GetUTCDateTimeRange(2);
});

async function GetApiNames() {

    try {
        const response = await fetch("/ManageContact/ApiImportRequest/GetApiNames",
            {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ 'AccountId': Plumb5AccountId })
            });
        const apinames = await response.json();
        if (apinames != null && apinames.length > 0) {
            $.each(apinames, function (index, value) {
                $("#ui_dllApiNames").append(`<option value="${value.Name}">${value.Name}</option>`);
            });
        }
    } catch (e) {
        ShowAjaxError(e);
    }
}

function CallBackFunction() {
    ShowPageLoading();
    TotalRowCount = 0;
    CurrentRowCount = 0;
    apiUtil.MaxCount();
}

function CallBackPaging() {
    CurrentRowCount = 0;
    apiUtil.MaxCount();
}

var apiUtil = {
    MaxCount: async () => {
        try {

            const response = await fetch("/ManageContact/ApiImportRequest/GetMaxCount", {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ 'AccountId': Plumb5AccountId, 'FromDateTime': FromDateTime, 'ToDateTime': ToDateTime, 'Requestcontent': Requestcontent, 'Name': Name, 'IsContactSuccess': IsContactSuccess, 'IsLmsSuccess': IsLmsSuccess })
            });
            const responses = await response.json();

            TotalRowCount = 0;
            if (responses != undefined && responses != null && responses.returnVal > 0) {
                TotalRowCount = responses.returnVal;
            }

            if (TotalRowCount > 0) {
                $("#ui_tbodyReportData").empty();
                apiUtil.GetReport();
            }
            else {
                SetNoRecordContent('ui_tableReport', 7, 'ui_tbodyReportData');
                HidePageLoading();
            }
        } catch (e) {
            ShowAjaxError(e);
        }
    },
    GetReport: async () => {
        try {
            FetchNext = GetNumberOfRecordsPerPage();

            const response = await fetch("/ManageContact/ApiImportRequest/GetDetails", {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ 'AccountId': Plumb5AccountId, 'FromDateTime': FromDateTime, 'ToDateTime': ToDateTime, 'Requestcontent': Requestcontent, 'Name': Name, 'IsContactSuccess': IsContactSuccess, 'IsLmsSuccess': IsLmsSuccess, 'offset': OffSet, 'fetchnext': FetchNext })
            });
            const responses = await response.json();

            if (responses != null && responses.Table1 != null && responses.Table1.length > 0) {
                JsonContentArray = responses.Table1;
                CurrentRowCount = responses.Table1.length;
                PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);

                $.each(responses.Table1, async function () {
                    await apiUtil.BindEachReport(this);
                });

                ShowExportDiv(true);
                ShowPagingDiv(true);
            } else {
                ShowExportDiv(false);
                ShowPagingDiv(false);
            }
            HidePageLoading();
        } catch (e) {
            ShowAjaxError(e);
        }
    },
    BindEachReport: async (eachData) => {

        let result = eachData.ErrorMessage != undefined && eachData.ErrorMessage != null && eachData.ErrorMessage != "" && eachData.ErrorMessage.length > 0 ? true : false;
        let APIName = eachData.Name != null && eachData.Name.length > 0 ? eachData.Name : "Direct API Import";
        let reportTablerows = `<tr id="ui_tr_MailTemplate_${eachData.Id}">
                                    <td class="text-center temppreveye">
                                        <i class="icon ion-ios-eye-outline position-relative" onclick="ShowJsonContent(${eachData.Id})">
                                        </i>
                                    </td>
                                    <td class="text-left">
                                        <div class="groupnamewrap">
                                            <div class="nametitWrap">
                                                <span class="groupNameTxt">${APIName}</span>
                                                 ${result ? `<i id="creditalerticn" class="icon ion-ios-information creditalertblink" data-toggle="popover" data-trigger="hover" data-content="${eachData.ErrorMessage}" data-original-title="" title="${eachData.ErrorMessage}"></i>` : ""}
                                                <span class="createdDateTd">${$.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(eachData.CreatedDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(eachData.CreatedDate))}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="text-left">
                                        <div class="groupnamewrap"> 
                                            <div class="nametitWrap">
                                                <span>${eachData.IsContactSuccess == true ? "TRUE" : "FALSE"}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="text-left">                                       
                                        <div class="nametitWrap">
                                            <span class="groupNameTxt">${eachData.ContactErrorMessage == null ? "NA" : eachData.ContactErrorMessage}</span>
                                        </div>                                        
                                    </td>
                                    <td class="text-left">
                                        <div class="nametitWrap">
                                            <span class="groupNameTxt">${eachData.IsLmsSuccess == true ? "TRUE" : "FALSE"}</span>
                                        </div>
                                    </td>
                                    <td class="text-left">
                                        <div class="nametitWrap">
                                            <span class="groupNameTxt">${eachData.LmsErrorMessage == null ? "NA" : eachData.LmsErrorMessage}</span>
                                        </div>
                                    </td>
                                    <td class="text-left">
                                        <div class="nametitWrap">
                                            <span class="groupNameTxt">${eachData.P5UniqueId == null ? "NA" : eachData.P5UniqueId}</span>
                                        </div>
                                    </td>                                    
                                </tr>`;
        $("#ui_tbodyReportData").append(reportTablerows);
    },
    SearchByColumns: function (e) {
        if ((e.which && e.which === 13) || (e.keyCode && e.keyCode === 13)) {
            if (CleanText($.trim($("#ui_txt_RequestsSearch").val())).length == 0) {
                ShowErrorMessage("Enter the value to search");
                return false;
            }

            ShowPageLoading();
            var query = CleanText($.trim($("#ui_txt_RequestsSearch").val()));
            let propertynameColumn = $("#ui_txt_RequestsSearch").attr("propertyname");

            if (propertynameColumn == "IsContactSuccess") {
                if (query.toLowerCase().includes("true")) {
                    IsContactSuccess = true;
                } else if (query.toLowerCase().includes("false")) {
                    IsContactSuccess = false;
                } else {
                    IsContactSuccess = null;
                }
            } else if (propertynameColumn == "IsLmsSuccess") {
                if (query.toLowerCase().includes("true")) {
                    IsLmsSuccess = true;
                } else if (query.toLowerCase().includes("false")) {
                    IsLmsSuccess = false;
                } else {
                    IsLmsSuccess = null;
                }
            } else if (propertynameColumn == "Name") {
                Name = query;
            } else if (propertynameColumn == "RequestContent") {
                Requestcontent = query;
            }

            OffSet = 0;
            apiUtil.MaxCount();
        }
    },
    SearchByColumnsRemove: function (e) {
        if (e.which && e.which === 8 || e.keyCode && e.keyCode === 46) {
            if ($("#ui_txt_RequestsSearch").val().length === 0) {
                Name = "";
                Requestcontent = "";
                IsContactSuccess = null;
                IsLmsSuccess = null;

                ShowPageLoading();
                OffSet = 0;
                apiUtil.MaxCount();
            }
        }
    }
};


$('.addCampName').select2({
    minimumResultsForSearch: '',
    dropdownAutoWidth: false
});

function ShowJsonContent(id) {
    var JsonData = JSLINQ(JsonContentArray).Where(function () { return (this.Id == id); }).items;

    $("#ui_div_ApiWebHookResponse").removeClass("hideDiv");
    if (JsonData.length > 0) {
        new JsonEditor('#ui_div_ResponseJson', GetJsonData(JsonData[0].RequestContent));
        $("#ui_div_ResponseJson").removeClass("hideDiv");
    } else {
        $("#ui_tbl_ResponseReportData").removeClass("hideDiv");
    }
}

function GetJsonData(LogContent) {
    var parsedData;
    try {
        parsedData = JSON.parse(LogContent);
    } catch (e) {
        // is not a valid JSON string
        parsedData = LogContent;
    }

    return parsedData;
}

$(".ion-close").click(() => {
    $("#ui_div_ApiWebHookResponse").addClass("hideDiv");
});

$(document).on("click", ".searchColumn", function () {
    let displayname = $(this).attr("displayname");
    let propertyname = $(this).attr("propertyname");

    $("#ui_txt_RequestsSearch").val("");
    $("#ui_txt_RequestsSearch").attr("placeholder", `Search by ${displayname}`);
    $("#ui_txt_RequestsSearch").attr("propertyname", `${propertyname}`);
    $("#ui_txt_RequestsSearch").attr("displayname", `${displayname}`);
});


$("#ui_txt_RequestsSearch").keypress(function (e) {
    apiUtil.SearchByColumns(e);
});

$("#ui_txt_RequestsSearch").keyup(function (e) {
    apiUtil.SearchByColumnsRemove(e);
});