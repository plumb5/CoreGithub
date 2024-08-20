var IsCreatedDate = true;
$(document).ready(function () {
    ExportFunctionName = "ExportStageReport";
    GetUTCDateTimeRange(2);
    GetUserHeirarchy();
});

function CallBackFunction() {
    ShowPageLoading();
    OffSet = 0;
    TotalRowCount = 0;
    CurrentRowCount = 0;
    GetMaxCount();
}

function CallBackPaging() {
    ShowPageLoading();
    CurrentRowCount = 0;
    GetReportData();
}

function GetMaxCount() {

    $.ajax({
        url: "/Prospect/StageReports/GetMaxCount",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime, 'UserInfoUserId': $("#ui_dllUserLists").val(), "IsCreatedDate": IsCreatedDate }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response != undefined && response != null && response.returnVal > 0) {
                TotalRowCount = response.returnVal;
            }

            if (TotalRowCount > 0) {
                GetReportData();
                ShowExportDiv(true);
            }
            else {
                $("#ui_trheadReportData").empty();
                $("#ui_trbodyReportData").empty();
                SetNoRecordContent('ui_tableReport', 5, 'ui_trbodyReportData');
                HidePageLoading();
            }

        }
    })
}

function GetReportData() {

    FetchNext = GetNumberOfRecordsPerPage();

    $.ajax({
        url: "/Prospect/StageReports/GetReport",
        type: 'POST',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime, 'OffSet': OffSet, 'FetchNext': FetchNext, 'UserInfoUserId': $("#ui_dllUserLists").val(), "IsCreatedDate": IsCreatedDate }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindReport,
        error: ShowAjaxError
    });
}

function BindReport(response) {
    CurrentRowCount = response.Table1.length;
    PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);

    if (response.Table1 !== undefined && response !== null && response.Table1 !== undefined && response.Table1 !== null && response.Table1.length > 0) {
        $("#ui_trheadReportData").empty();
        $("#ui_trbodyReportData").empty();
        BindGridHeader(response.Table1[0]);
        $.each(response.Table1, function () {
            GetGridRows(this);
        });
    }
    HidePageLoading();
}

function BindGridHeader(Data) {
    let headers = Object.keys(Data);
    let poppedName = headers.pop();
    let theaders = [poppedName].concat(headers);

    let headerHtml = ``;
    $.each(theaders, function (index) {

        if (index == 0) {
            if (this.toLowerCase() != "userinfouserid") {
                if (this != undefined && this != null && this.length > 20) {
                    let head = this.substring(0, 12);
                    headerHtml += `<th scope="col" class="helpIcon td-wid-150px header-sticky">
                            <div class="sortWrap">
                                <i class="icon ion-arrow-down-c addColor"></i>
                            </div>
                            ${head} 
                         </th>`;
                } else {
                    headerHtml += `<th scope="col" class="helpIcon td-wid-150px header-sticky">
                            <div class="sortWrap">
                                <i class="icon ion-arrow-down-c addColor"></i>
                            </div>
                            ${this} 
                          </th>`;
                }
            }
        } else {
            if (this.toLowerCase() != "userinfouserid") {
                if (this != undefined && this != null && this.length > 20) {
                    let head = this.substring(0, 12);
                    headerHtml += `<th scope="col" class="helpIcon td-wid-150px">
                            <div class="sortWrap">
                                <i class="icon ion-arrow-down-c addColor"></i>
                            </div>
                            ${head} 
                         </th>`;
                } else {
                    headerHtml += `<th scope="col" class="helpIcon td-wid-150px">
                            <div class="sortWrap">
                                <i class="icon ion-arrow-down-c addColor"></i>
                            </div>
                            ${this} 
                          </th>`;
                }
            }
        }



    });

    $("#ui_trheadReportData").append(`<tr>${headerHtml}</tr>`);
}

function GetGridRows(Data) {
    const headers = Object.keys(Data);
    let poppedName = headers.pop();
    let theaders = [poppedName].concat(headers);


    let htmlContent = ``;
    $.each(theaders, function (index) {
        if (this.toLowerCase() != "userinfouserid") {
            if (this === "Name") {
                htmlContent += `<td>${Data[this]}</td>`;
            } else {
                if (index == 0) {
                    htmlContent += `<td class="column-sticky">${Data[this] == null ? "NA" : Data[this]}</td>`;
                } else {
                    htmlContent += `<td>${Data[this] == null ? 0 : Data[this]}</td>`;
                }
            }
        }
    });

    $("#ui_trbodyReportData").append(`<tr>${htmlContent}</tr>`);
}

$(".addCampName").select2({
    minimumResultsForSearch: "",
    dropdownAutoWidth: false,
});

function GetUserHeirarchy() {
    $.ajax({
        type: "POST",
        url: "/ManageUsers/Users/GetUsersBySeniorIdForTree",
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'UserId': Plumb5UserId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response != undefined && response != null && response.length > 0) {
                $.each(response, function () {
                    $("#ui_dllUserLists").append(`<option value="${$(this)[0].UserInfoUserId}">${$(this)[0].FirstName}</option>`);
                });
            }
        },
        error: ShowAjaxError
    });
}

$("#ui_dllUserLists").change(function () {
    CallBackFunction();
});

$(".lmsorderbymenulmsrep").click(function () {
    let ordertypedrpdownval = $(this).attr('data-ordername');
    $(".orderbylmsrepfillwrap").removeClass("hideDiv");
    $(".filttypetextlmsrep").text(ordertypedrpdownval);
    if (ordertypedrpdownval == "Created Date") {
        IsCreatedDate = true;
    } else {
        IsCreatedDate = false;
    }
    CallBackFunction();
});

$("#clsefillmsrep").click(function () {
    $(".orderbylmsrepfillwrap").addClass("hideDiv");
    IsCreatedDate = true;
    CallBackFunction();
});