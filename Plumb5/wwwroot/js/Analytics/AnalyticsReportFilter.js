var properties = [
    { DisplayName: "Referrer", ColumnName: "Referrer" },
    { DisplayName: "Refer Type", ColumnName: "ReferType" },
    { DisplayName: "Visitor IP", ColumnName: "VisitorIp" },
    { DisplayName: "City", ColumnName: "City" },
    { DisplayName: "Country", ColumnName: "Country" },
    { DisplayName: "Browser", ColumnName: "Browser" },
    { DisplayName: "Network", ColumnName: "Network" },
    { DisplayName: "UTM Source", ColumnName: "UtmSource" },
    { DisplayName: "UTM Medium", ColumnName: "UtmMedium" },
    { DisplayName: "UTM Campaign", ColumnName: "UtmCampaign" },
    { DisplayName: "UTM Term", ColumnName: "UtmTerm" }
];

var sessionTracker = {
    Referrer: "",
    ReferType: "",
    VisitorIp: "",
    City: "",
    Country: "",
    Browser: "",
    Network: "",
    UtmSource: "",
    UtmMedium: "",
    UtmCampaign: "",
    UtmTerm: ""
};

var myAnalyticsReport = {
    Name: "",
    AnalyticJson: "",
    GroupBy: "",
    Status: true,
    AnalyticQuery: "NA"
};

var myAnalyticsReportList = [];

$(document).ready(() => {
    //HidePageLoading();
    BindPorperties();
});

function BindPorperties() {
    $.each(properties, function () {
        $("#myrepanalreportby,#ui_SessionTrackerColumn_1").append(`<option value="${$(this)[0].ColumnName}">${$(this)[0].DisplayName}</option>`);
    });
}


$(".select2drpdwnbrd").select2({
    minimumResultsForSearch: "",
    dropdownAutoWidth: false,
    containerCssClass: "border",
});

var arraycondition = 1;
var arryconditionlist = [1];
$("#addnewconditionbtn").click(function () {
    arraycondition++;
    BindCondition(arraycondition);
    arryconditionlist.push(arraycondition);
});



function BindCondition(index) {
    let prop;
    $.each(properties, function () {
        prop += `<option value="${$(this)[0].ColumnName}">${$(this)[0].DisplayName}</option>`;
    });

    let getcondtionchild = `
    <div class="myrepcontionitem position-relative myanalyticreportdiv">
        <div class="myrepclose" conditionrow="${index}"><i class="icon ion-ios-close-outline"></i></div>
        <div class="myrepandconditwrap">
        <div class="myrepandcond">And</div>
    </div>
    <div class="form-group">
      <label for="" class="frmlbltxt">Fields</label>
      <select class="form-control select2drpdwnbrd" name="" id="ui_SessionTrackerColumn_${index}" data-placeholder="Add Fields">
        <option value="0">Select</option>
       ${prop}
      </select>
    </div>        
    <div class="form-group">
      <label for="" class="frmlbltxt">Value</label>
      <input type="text" name="" class="form-control" id="ui_SessionTrackerColumnvalue_${index}">
    </div>
    </div>`;
    $(".myrepconditionswrap").append(getcondtionchild);

    $(".myrepclose").click(function () {
        const arrayindex = parseInt($(this).attr("conditionrow"));
        const index = arryconditionlist.indexOf(arrayindex);

        if (index !== -1) {
            arryconditionlist.splice(index, 1);
        }

        $(this).parent().remove();
    });

    $(".select2drpdwnbrd").select2({
        minimumResultsForSearch: "",
        dropdownAutoWidth: false,
        containerCssClass: "border",
    });
}


$("#ui_btnSaveReport").click(function () {
    ResesCondition();
    $(".popuptitlwrp h6").html('ADD NEW REPORT');
    $('#ui_dvAddNewReports').removeClass("hideDiv");
    $(".ion-close").click(function () {
        $("#ui_dvAddNewReports").addClass("hideDiv");
    });

    $("#ui_btnsavereport").attr("analyticid", "0");
});


$("#ui_btnsavereport").click(function () {
    if (!Validation()) {
        return;
    }

    for (let i = 0; i < arryconditionlist.length; i++) {
        let ColumnName = $(`#ui_SessionTrackerColumn_${i + 1}`).val();
        sessionTracker[ColumnName] = CleanText($(`#ui_SessionTrackerColumnvalue_${i + 1}`).val());
    }

    ShowPageLoading();

    myAnalyticsReport.Id = parseInt($("#ui_btnsavereport").attr("analyticid"));
    myAnalyticsReport.Name = CleanText($("#ui_ReportName").val());
    myAnalyticsReport.AnalyticJson = JSON.stringify(sessionTracker);
    myAnalyticsReport.GroupBy = $("#myrepanalreportby").val();

    if ($("#lmssaverepopt").is(":checked")) {
        $.ajax({
            url: "/Analytics/AnalyticReports/SaveReport",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'analyticReports': myAnalyticsReport }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response > 0) {
                    ShowSuccessMessage("Saved successfully");
                    AnalyticsSaveReportUtil.BindSavedReports();
                } else if (response == -1) {
                    ShowErrorMessage("Already exists, enter new report name");
                } else {
                    ShowErrorMessage("Something went wrong, try again with new report name");
                }
                ResesCondition();
                HidePageLoading();
                $("#ui_dvAddNewReports").addClass("hideDiv");
            },
            error: ShowAjaxError
        });
    } else {
        filterLead = {
            referrer: "", refertype: "", visitorip: "", machineid: "", pagename: "", accountid: 0, city: "", country: "", countrycode: "", date: "", timeend: "", previousvisit: "",
            searchby: "", flag: "", entrypage: "", lastpage: "", browser: "", network: "", repeatornew: "", latitude: "", longitude: "", pageviews: 0, sessionid: "", visitorid: "", score: 0.0,
            paidcampaignflag: 0, deviceid: 0, utmsource: "", utmmedium: "", utmcampaign: "", utmterm: "", devicebrandname: "", devicemodelname: "", cs_entrypage: 0, cs_lastpage: 0, iscookieblocked: false,
            iseventtriggered: 0, p5mailuniqueid: "", p5smsuniqueid: "", p5whatsappuniqueid: "", p5webpushuniqueid: "", iscustomeventsource: false, isformsource: false
        };
        filterLead = JSON.parse(myAnalyticsReport.AnalyticJson);
        $("#ui_span_SavedReports").html('Custom Report');
        Groupby = myAnalyticsReport.GroupBy;
        AnalyticsSaveReportUtil.GetMaxCount();
        $("#ui_dvAddNewReports").addClass("hideDiv");
    }
});

function Validation() {
    if ($("#myrepanalreportby").val() === "0") {
        ShowErrorMessage("Select report by");
        return false;
    }

    for (let i = 0; i < arryconditionlist.length; i++) {
        if ($(`#ui_SessionTrackerColumn_${i + 1}`).val() === "0") {
            ShowErrorMessage("Select fields");
            return false;
        }

        if (CleanText($(`#ui_SessionTrackerColumnvalue_${i + 1}`).val()).length == 0) {
            ShowErrorMessage("Enter a value");
            return false;
        }

    }

    if ($("#lmssaverepopt").is(":checked")) {
        if (CleanText($("#ui_ReportName").val()).length == 0) {
            ShowErrorMessage("Enter report name");
            return false;
        }
    }

    return true;
}

$('input[name="lmssaverepopt"]').click(function () {
    $(this).parent().next().toggleClass("hideDiv");
});

function EditCondition(id) {
    let items = JSLINQ(myAnalyticsReportList).Where(function () { return (this.Id == id); }).items;
    ResesCondition();
    BindEditConditionData(items[0]);
}

function BindEditConditionData(conditiondata) {
    $("#myrepanalreportby").val(conditiondata.GroupBy).change();
    $("#ui_ReportName").val(conditiondata.Name);

    let objects = JSON.parse(conditiondata.AnalyticJson);

    let index = 1;
    for (let key in objects) {
        if (objects[key] != undefined && objects[key] != null && objects[key] != "") {
            if (index == 1) {
                $(`#ui_SessionTrackerColumn_1`).val(key).change();
                $(`#ui_SessionTrackerColumnvalue_1`).val(objects[key]);
            }
            else {
                BindCondition(index);
                $(`#ui_SessionTrackerColumn_${index}`).val(key).change();
                $(`#ui_SessionTrackerColumnvalue_${index}`).val(objects[key]);
            }
            index++;
        }
    }

    $("#ui_dvAddNewReports").removeClass("hideDiv");
    $("#lmssaverepopt").prop("checked", true);
    $(".lmssaverepdetwrp").removeClass("hideDiv");
    $("#ui_btnsavereport").attr("analyticid", conditiondata.Id);
}

$(".ion-close,.clsepopup").click(function () {
    $("#ui_dvAddNewReports").addClass("hideDiv");
});

function ResesCondition() {
    $("#myrepanalreportby").val("0").change();
    $("#ui_ReportName").val("");
    $("#lmssaverepopt").prop("checked", false);
    $(".lmssaverepdetwrp").addClass("hideDiv");
    $('.myanalyticreportdiv').remove();
    $(`#ui_SessionTrackerColumn_1`).val("0").change();
    $(`#ui_SessionTrackerColumnvalue_1`).val("");
}