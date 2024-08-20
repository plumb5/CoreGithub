var GId = 0, Valid = 1;
var Goallist;
var arrPageUrl = new Array();
$(document).ready(function () {
    GetUTCDateTimeRange(2);
});
function CallBackFunction() {
    ShowPageLoading();
    TotalRowCount = 0;
    CurrentRowCount = 0;
    GoalsUtil.MaxCount();
}
function CallBackPaging() {
    ShowPageLoading();
    CurrentRowCount = 0;
    GoalsUtil.GetReport();
}
var GoalsUtil = {
    MaxCount: function () {
        $.ajax({
            url: "/Analytics/Conversions/GoalsMaxCount",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'fromdate': FromDateTime, 'todate': ToDateTime }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                TotalRowCount = 0;
                if (response !== undefined && response !== null && response.Table1 !== undefined && response.Table1 !== null && response.Table1.length > 0)
                    TotalRowCount = response.Table1[0].TotalRows;

                if (TotalRowCount > 0)
                    GoalsUtil.GetReport();
                else {
                    $('#dvGoalReport').addClass('hideDiv');
                    $('.nodatadashwrp').removeClass('hideDiv');
                    HidePageLoading();
                }
            },
            error: ShowAjaxError
        });
    },
    GetReport: function () {
        FetchNext = GetNumberOfRecordsPerPage();
        $.ajax({
            url: "/Analytics/Conversions/GoalsReport",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'fromdate': FromDateTime, 'todate': ToDateTime, 'start': OffSet, 'end': FetchNext }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: GoalsUtil.BindReport,
            error: ShowAjaxError
        });
    },
    BindReport: function (response) {

        if (response != undefined && response != null && response.Table1 != undefined && response.Table1 != null && response.Table1.length > 0) {
            Goallist = response.Table1;
            $('#dvGoalReport').removeClass('hideDiv');
            $('.nodatadashwrp').addClass('hideDiv');
            CurrentRowCount = response.Table1.length;
            PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);
            $("#ui_tbodyReportData").html('');
            $("#ui_tableReport").removeClass('no-data-records');

            $('.goadNametit').text(response.Table1[0].GoalName);
            var reportTableTrs;

            $.each(response.Table1, function (i) {
                if (i == 0)
                    reportTableTrs += "<tr data-goalId=" + this.GoalId + " class='active'>";
                else
                    reportTableTrs += "<tr data-goalId=" + this.GoalId + ">";

                reportTableTrs +=
                    "<td>" +
                    "<div class='groupnamewrap'>" +
                    "<div class='nameTxtWrap'>" + this.GoalName + "</div>" +
                    "<div class='tdcreatedraft'>" +
                    "<div class='dropdown'> " +
                    "<button type='button' class='verticnwrp' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'><i class='icon ion-android-more-vertical mr-0'></i></button>" +
                    "<div class='dropdown-menu dropdown-menu-right' aria-labelledby='filterbycontacts'>" +
                    "<a class='dropdown-item'  href='javascript:void(0)' onclick='GoalsUtil.Edit(" + this.GoalId + ");'>Edit</a> <div class='dropdown-divider'></div >" +
                    "<a data-toggle='modal' data-target='#deleterow' class='dropdown-item' data-actiontype='delete' href='javascript:void(0)' onclick=\"GoalsUtil.DeleteGoalConfirm(" + this.GoalId + ");\">Delete</a>" +
                    "</div></div></div></div>" +
                    "</td>" +
                    "<td class='td-wid-10 wordbreak'>" + $.datepicker.formatDate("M dd yy", ConvertUTCDateTimeToLocal(this.Date)) + " " + PlumbTimeFormat(ConvertUTCDateTimeToLocal(this.Date)) + "</td>" +
                    "<td id='tdGoalCompletion" + this.GoalId + "'>-</td>" +
                    "</tr>";

            });
            $("#ui_tableReport").removeClass('no-data-records');
            $("#ui_tbodyReportData").html(reportTableTrs);

            GoalsUtil.GetForwardGoalDetails(response.Table1[0].GoalId);
        } else {
            $('#dvGoalReport').addClass('hideDiv');
            $('.nodatadashwrp').removeClass('hideDiv');
            ShowPagingDiv(false);
        }


        HidePageLoading();
    },
    GetForwardGoalDetails: function (GoalId) {
        ShowPageLoading();
        var data = []; var funneldata = {};
        $.ajax({
            url: "/Analytics/Conversions/ForwardGoalView",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'fromdate': FromDateTime, 'todate': ToDateTime, 'GoalId': GoalId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != undefined && response != null && response.Table1 != undefined && response.Table1 != null && response.Table1.length > 0) {
                    $.each(response.Table1, function () {
                        funneldata = {};
                        if (this.PageName != '' && this.PageName != null) {
                            funneldata.label = this.PageName;
                            funneldata.value = this.UniqueVisits;
                            data.push(funneldata);
                        }
                    });
                    GoalsUtil.DrawFunnel(data, GoalId);
                }
            },
            error: ShowAjaxError
        });
    },
    DrawFunnel: function (data, GoalId) {
        var divElement_name = "#funnel";
        function getMax(arr, prop) {
            var max;
            for (var i = 0; i < arr.length; i++) {
                if (max == null || parseInt(arr[i][prop]) > parseInt(max[prop]))
                    max = arr[i];
            }
            return max;
        }
        d3.select(divElement_name).html("");

        var options = {
            block: {
                highlight: true,
                minHeight: 15,
                fill: {
                    type: 'gradient'
                }
            },
            chart: {
                animate: 150,
                bottomPinch: 1,
                curve: {
                    enabled: true
                }
            },
            label: {
                format: function (label, value) { return label + "\n" + value; }
            },
            tooltip: {
                enabled: true,
                format: function (label, value) {
                    var maxval = getMax(data, "value");
                    var prcnt = parseInt((value * 100) / maxval.value);
                    prcnt = isNaN(prcnt) ? 0 : prcnt;
                    $('#tdGoalCompletion' + GoalId).html(prcnt + "%");// Binding GoalCompletion Table column
                    return "Goal Completion\n" + prcnt + "%\n" + label;
                }
            }
        };
        var chart = new D3Funnel(divElement_name);
        chart.draw(data, options);
        HidePageLoading();

    },
    Validate: function () {
        if ($("#txtGoalName").val() == '') {
            ShowErrorMessage(GlobalErrorList.Goals.GoalName_Error);
            return false;
        }
        $("input[name=txtgoal").each(function () {
            if ($(this).val().length == 0) {
                ShowErrorMessage(GlobalErrorList.Goals.GoalUrl_Error);
                Valid = 0;
                return false;
            }
        });

        var goal = $.trim($("#txtGoalName").val());
        if (Goallist != null && Goallist.length > 0) {
            var goalItem;
            if (GId == 0) {
                goalItem = JSLINQ(Goallist).Where(function () {
                    return (this.GoalName.toLowerCase() == goal.toLowerCase());
                });
            }
            else {
                goalItem = JSLINQ(Goallist).Where(function () {
                    return (this.GoalName.toLowerCase() == goal.toLowerCase() && this.GoalId != GId);
                });
            }
            if (goalItem != null && goalItem != undefined && goalItem.items[0] != null && goalItem.items[0] != "" && goalItem.items[0] != undefined) {
                ShowErrorMessage(GlobalErrorList.Goals.GoalName_ExistMessage);
                return false;
            }

        }

        if (arrPageUrl.length == 1) {
            ShowErrorMessage(GlobalErrorList.Goals.GoalPageUrl_MinErrorMessage);
            return false;
        }
        return true;
    },
    ClearFields: function () {
        stepItem = 1; GId = 0;
        $('#txtGoalName').val('');
        $("#dvGoalSteps").find("input:text").val('');
        $(".popupcontainer").addClass("hideDiv");
        $('#dvGoalSteps div:not(:first-child)').remove();

    },
    Edit: function (Id) {
        GId = Id;
        $(".popupcontainer").removeClass("hideDiv");
        var GoalDetails = JSLINQ(Goallist).Where(function () { return (this.GoalId == Id); });
        if (GoalDetails.items.length > 0) {
            stepItem = 1;
            $('#txtGoalName').val(GoalDetails.items[0].GoalName);
            $('#txtgoalurl_1').val(GoalDetails.items[0].FirstPage);
            if (GoalDetails.items[0].SecondPage != '') {
                GoalsUtil.AddMoreSteps();
                $('#txtgoalurl_2').val(GoalDetails.items[0].SecondPage);

            }
            if (GoalDetails.items[0].ThirdPage != '') {
                GoalsUtil.AddMoreSteps();
                $('#txtgoalurl_3').val(GoalDetails.items[0].ThirdPage);
            }
            if (GoalDetails.items[0].FourthPage != '') {
                GoalsUtil.AddMoreSteps();
                $('#txtgoalurl_4').val(GoalDetails.items[0].FourthPage);
            }
            if (GoalDetails.items[0].FifthPage != '') {
                GoalsUtil.AddMoreSteps();
                $('#txtgoalurl_5').val(GoalDetails.items[0].FifthPage);
            }
            if (GoalDetails.items[0].SixthPage != '') {
                GoalsUtil.AddMoreSteps();
                $('#txtgoalurl_6').val(GoalDetails.items[0].SixthPage);
            }
            if (GoalDetails.items[0].SeventhPage != '') {
                GoalsUtil.AddMoreSteps();
                $('#txtgoalurl_7').val(GoalDetails.items[0].SeventhPage);
            }
            if (GoalDetails.items[0].EighthPage != '') {
                GoalsUtil.AddMoreSteps();
                $('#txtgoalurl_8').val(GoalDetails.items[0].EighthPage);
            }
            if (GoalDetails.items[0].NinthPage != '') {
                GoalsUtil.AddMoreSteps();
                $('#txtgoalurl_9').val(GoalDetails.items[0].NinthPage);
            }
            if (GoalDetails.items[0].TenthPage != '') {
                GoalsUtil.AddMoreSteps();
                $('#txtgoalurl_10').val(GoalDetails.items[0].TenthPage);
            }

        }
    },
    DeleteGoalConfirm: function (Id) {
        $("#deleteRowConfirmGoal").attr("onclick", "GoalsUtil.DeleteGoal(" + Id + ");");
    },
    DeleteGoal: function (Id) {
        ShowPageLoading();
        $.ajax({
            url: "/Analytics/Conversions/GoalDelete",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'Id': Id }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response) {
                    ShowSuccessMessage(GlobalErrorList.Goals.Delete_Message);
                    GoalsUtil.GetReport();
                }
            },
            error: ShowAjaxError
        });
    },
    AddMoreSteps: function () {
        if (stepItem <= 9) {
            stepItem++;
            var stepfield =
                '<div class="form-group"><div class="stepwrap"><label class="frmlbltxt" for="">Step</label><span class="numbstep">' +
                stepItem +
                '</span></div><div class="d-flex align-items-center stepinputwrp"><input type="text" placeholder="URL" class="form-control inputtext" name="txtgoal" id="txtgoalurl_' +
                stepItem +
                '"> <span class="ml-3"><i class="icon ion-ios-close"></i></span></div></div>';
            $(".appndstepitem").append(stepfield);
            stepItemminus = stepItem;
        }
        else {

            ShowErrorMessage(GlobalErrorList.Goals.Goals_limiterror);

        }

    }

};


$(".createbtn-pop").click(function () {
    $(".popupcontainer").removeClass("hideDiv");
});
var stepItem = 1;
var stepItemminus;
$(".addstep").click(function () {
    GoalsUtil.AddMoreSteps();
});
$("#close-popup, .clsepopup").click(function () {
    $(this).parents(".popupcontainer").addClass("hideDiv");
    $("tr").removeClass("activeBgRow");
    GoalsUtil.ClearFields();
});
$(".appndstepitem").on("click", ".stepinputwrp .ion-ios-close", function () {
    Valid = 1;
    stepItemminus--;
    $(this).parents(".form-group").remove();
    stepItem = stepItemminus;
    let j = 0;
    for (let i = 0; i < stepItem; i++) {
        j++;
        $(document.getElementsByClassName("numbstep")[i]).html(j);
        $(document.getElementsByClassName("inputtext")[i]).attr(
            "id",
            "goalurl_" + j
        );
    }
    return stepItem;
});
$("#btnSubmit").click(function () {
    Valid = 1;
    ShowPageLoading();
    arrPageUrl = new Array();
    $('#dvGoalSteps input[type="text"]').each(function () {

        arrPageUrl.push(CleanText($(this).val()));
    });
    if (!GoalsUtil.Validate()) {
        HidePageLoading();
        return;
    }
    if (Valid == 1) {
        $.ajax({
            url: "/Analytics/Conversions/SaveGoalSetting",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'goalId': GId, 'goalName': $('#txtGoalName').val(), 'channel': 'Website', 'pages': arrPageUrl.toString() }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (GId == 0)
                    ShowSuccessMessage(GlobalErrorList.Goals.GoalSaved_SuccessMessage);
                else
                    ShowSuccessMessage(GlobalErrorList.Goals.GoalUpdated_SuccessMessage);

                GoalsUtil.ClearFields();
                HidePageLoading();
                //GoalsUtil.GetReport();
                GoalsUtil.MaxCount();
            },
            error: ShowAjaxError
        });
    }
    else {
        HidePageLoading();
    }
});

$(document).on('click', "a.dropdown-item", function () {
    getactionTypeval = $(this).attr("data-actiontype");
    getgoalNameval = $(this).parents(".tddropmenuWrap").prev(".nameTxtWrap").children(".nameTxt").text();

});



$(document).on("click", ".goalstble .Table1 tr", function () {
    $(".goalstble .Table1 tr").removeClass("active");
    $(this).addClass("active");
    var firstcoltext = $(this).find(".nameTxtWrap").text();
    var gId = $(this).attr("data-goalId");
    $(".goadNametit").text(firstcoltext);
    GoalsUtil.GetForwardGoalDetails(gId);
});