$("#btnSearch").click(function () {
    $(".subdivWrap").removeClass("showDiv");
    $(".subdivFiltWrap").removeClass("showDiv");
    $(".filtwrpbar").addClass("hideDiv");
    $("#filterTags span").html("Filter By Master Filter");
    ShowPageLoading();
    CustomEventsCustomReportPopUpUtil.GetCustomEventFielterResult();
    //clearmasterfilter();
});
var checkboxstatus = 0;
var CustomEventsCustomReportPopUpUtil = {
    MaxCount: function () {
        if (filterEventData.StartDate == '' || filterEventData.StartDate == undefined) {
            filterEventData.StartDate = FromDateTime;
            filterEventData.EndDate = ToDateTime;

        }
        $('#dvmasterfieltercustomeventsReports').addClass("hideDiv");
        $.ajax({
            url: "/CustomEvents/ViewCustomEventData/MasterFilterEventscount",
            type: 'Post',
            data: JSON.stringify({
                'accountId': Plumb5AccountId, 'fromDateTime': filterEventData.StartDate, 'toDateTime': filterEventData.EndDate, 'customeventoverviewid': customeventoverviewid, 'customevents': filterEventData, 'creategroupchk': checkboxstatus, 'Newgroupname': $("#ui_txtName").val(), 'Newgroupdescription': $("#ui_txtdescription").val()
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                TotalRowCount = 0;
                if (response != undefined && response != null && response.returnVals[0] > 0) {
                    TotalRowCount = response.returnVals[0];
                }

                if (TotalRowCount > 0) {
                    $("#totalcountspan").text(TotalRowCount);
                    CustomEventsCustomReportPopUpUtil.GetReport();
                }
                else {
                    $("#totalcountspan").text(0);
                    SetNoRecordContent('ui_tableReport', 6, 'ui_trbodyReportData');
                    HidePageLoading();
                }
                if (response.returnVals[1] > 0) {
                    $("#ui_txtName").val('');
                    $("#ui_txtdescription").val('');
                    ShowSuccessMessage(GlobalErrorList.CustomEvent.EventGroupsSuccess);

                }
                if (response.returnVals[1] < 0) {

                    ShowErrorMessage(GlobalErrorList.CustomEvent.EventGroupsfailure);
                }

            },
            error: ShowAjaxError
        });
    },
    GetReport: function () {

        FetchNext = GetNumberOfRecordsPerPage();
        $.ajax({
            url: "/CustomEvents/ViewCustomEventData/MasterFilterEventsReportData",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'OffSet': OffSet, 'FetchNext': FetchNext, 'fromDateTime': filterEventData.StartDate, 'toDateTime': filterEventData.EndDate, 'customeventoverviewid': customeventoverviewid, 'customevents': filterEventData }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: CustomEventsCartReportUtil.BindReport,
            error: ShowAjaxError
        });
    },
    GetCustomEventFielterResult: function () {
        if (!CustomEventsCustomReportPopUpUtil.ValidateSearch()) {
            HidePageLoading();
            return;
        }



        if ($('#ChkSave').attr('chkid') == '1') {
            if ($("#ChkSave").is(':checked')) {
                if ($("#ui_txtName").val().length == 0) {
                    ShowErrorMessage(GlobalErrorList.Manage_Group.name_error);
                    HidePageLoading();
                    return false;
                }
                if ($("#ui_txtdescription").val().length == 0) {
                    ShowErrorMessage(GlobalErrorList.Manage_Group.description_errorr);
                    HidePageLoading();
                    return false;
                }
                else
                    $("#ui_span_SavedReports").html($("#ui_txtName").val());
                checkboxstatus = 1;
            }

            else
                $("#ui_span_SavedReports").html("Custom Report");
        }
        if (!CustomEventsCustomReportPopUpUtil.ValidateDuplicateinDropdown()) {
            HidePageLoading();
            return;
        }
        $('#ui_i_filterClose').removeClass("hideDiv");
        $("#ui_i_filterOpen").addClass("hideDiv");
        if (window.location.href.toLowerCase().indexOf("/managecontact/contact") > 0) {
            contactDetails.EmailId = contactDetails.PhoneNumber = contactDetails.Name = null;
            $("#e_input").val("");
            $("#1").remove();
            $("#bindsel").html("");
            clearAll();
            $(".filtwrpbar").removeClass("hideDiv");
            $(".subdivWrap").addClass('showDiv');
            $('#ui_i_filterClose').removeClass("hideDiv");
            $("#ui_i_filterOpen").addClass("hideDiv");
        }


        filterConditions = { Id: 0, UserInfoUserId: 0, Name: "", QueryField: "", ShowInDashboard: false };
        CustomEventsCartReportUtil.ResetMasterFilter();
        var drpFieldscount = $('[id^=drpFields_]').length;
        if ($("#drpFields_0").val() != "0") {
            for (var i = 0; i < drpFieldscount; i++) {
                filterEventData[$("#drpFields_" + i).val()] = $("#txtFieldAnswer_" + i).val();
            }
        }
        if ($("#txtStartDate").val() != "" && $("#txtEndDate").val() != "") {
            var fromdate, todate;


            let LocalFromdate = CustomEventsCustomReportPopUpUtil.ReturnDateInFormat($("#txtStartDate").val()) + " 00:00:00";
            let LocalTodate = CustomEventsCustomReportPopUpUtil.ReturnDateInFormat($("#txtEndDate").val()) + " 23:59:59";

            fromdate = ConvertDateTimeToUTC(LocalFromdate);
            todate = ConvertDateTimeToUTC(LocalTodate);

            var startdate = fromdate.getFullYear() + '-' + PrefixZero((fromdate.getMonth() + 1)) + '-' + PrefixZero(fromdate.getDate()) + " " + PrefixZero(fromdate.getHours()) + ":" + PrefixZero(fromdate.getMinutes()) + ":" + PrefixZero(fromdate.getSeconds());;
            var enddate = todate.getFullYear() + '-' + PrefixZero((todate.getMonth() + 1)) + '-' + PrefixZero(todate.getDate()) + " " + PrefixZero(todate.getHours()) + ":" + PrefixZero(todate.getMinutes()) + ":" + PrefixZero(todate.getSeconds());;

            filterEventData.StartDate = startdate;
            filterEventData.EndDate = enddate;
        }

        CustomEventsCustomReportPopUpUtil.MaxCount();

    },
    ValidateFieldsAndValues: function (Id) {
        if ($("#txtStartDate").val().length <= 0 && $("#txtEndDate").val().length <= 0 && $("#drpFields_" + Id).get(0).selectedIndex == 0) {
            ShowErrorMessage(GlobalErrorList.MyReports.FieldValue_ErrorMessage);
            return false;
        }
        else {
            if ($("#drpFields_" + Id).get(0).selectedIndex == 0 && $("#txtFieldAnswer_" + Id).val() == "") {
                ShowErrorMessage(GlobalErrorList.MyReports.FieldValue_ErrorMessage);
                return false;
            }
            if ($("#drpFields_" + Id).get(0).selectedIndex == 0 && $("#txtFieldAnswer_" + Id).val() != "") {
                ShowErrorMessage(GlobalErrorList.MyReports.Field_ErrorMessage);
                return false;
            }
            if ($("#drpFields_" + Id).get(0).selectedIndex != 0 && ($("#txtFieldAnswer_" + Id).val() == "" || $("#txtFieldAnswer_" + Id).val() == 0)) {
                ShowErrorMessage(GlobalErrorList.MyReports.FieldAnswer_ErrorMessage);
                return false;
            }
        }
        return true;
    },
    ValidateSearch: function () {

        if ($("#txtStartDate").val().length <= 0 && $("#txtEndDate").val().length <= 0 && $("#drpFields_0").get(0).selectedIndex == 0) {
            ShowErrorMessage(GlobalErrorList.MyReports.Field_ErrorMessage);
            return false;
        }

        if ($("#txtStartDate").val().length > 0 || $("#txtEndDate").val().length > 0) {
            if ($("#txtStartDate").val() > $("#txtEndDate").val()) {
                ShowErrorMessage(GlobalErrorList.PageHeadingWithDate.from_date_less_then_error);
                return false;
            }

            if ($("#txtStartDate").val().length == 0) {
                ShowErrorMessage(GlobalErrorList.PageHeadingWithDate.from_date_range_error);
                return false;
            }
            if ($("#txtEndDate").val().length == 0) {
                ShowErrorMessage(GlobalErrorList.PageHeadingWithDate.to_date_range_error);
                return false;
            }

        }

        //if ($("#drpFields_0").get(0).selectedIndex == 0) {
        //    ShowErrorMessage(GlobalErrorList.MyReports.Field_ErrorMessage);
        //    return false;
        //}

        if ($("#drpFields_0").get(0).selectedIndex != 0 && ($("#txtFieldAnswer_0").val() == "" || $("#txtFieldAnswer_0").val() == 0)) {
            ShowErrorMessage(GlobalErrorList.MyReports.FieldAnswer_ErrorMessage);
            return false;
        }

        let trelementvalidatecount = 0;
        let trvalidateList = $('[id^=trsearch]').last();
        trelementvalidatecount = trvalidateList[0].id.slice(-1);
        trelementvalidatecount = parseInt(trelementvalidatecount) + 1;

        if (trelementvalidatecount > 1 && !CustomEventsCustomReportPopUpUtil.ValidateFieldsAndValues(trelementvalidatecount - 1)) {
            return;
        }
        if ($('#ChkSave').attr('chkid') == '0') {
            if ($("#ChkSave").is(':checked')) {
                if ($("#ui_txtName").val().length == 0) {
                    ShowErrorMessage(GlobalErrorList.MyReports.ReportName_ErrorMessage);
                    return false;
                }
                else
                    $("#ui_span_SavedReports").html($("#ui_txtName").val());
            }

            else
                $("#ui_span_SavedReports").html("Custom Report");
        }
        if ($('#ChkSave').attr('chkid') == '1') {
            if ($("#ChkSave").is(':checked')) {
                if ($("#ui_txtName").val().length == 0) {
                    ShowErrorMessage(GlobalErrorList.Manage_Group.name_error);
                    return false;
                }
                if ($("#ui_txtdescription").val().length == 0) {
                    ShowErrorMessage(GlobalErrorList.Manage_Group.description_errorr);
                    return false;
                }
                else
                    $("#ui_span_SavedReports").html($("#ui_txtName").val());
            }

            else
                $("#ui_span_SavedReports").html("Custom Report");
        }
        return true;
    },
    ValidateDuplicateinDropdown: function () {

        var trList = $('[id^=trsearch]');
        var drpselectedtext = new Array();

        for (var j = 0; j < trList.length; j++) {
            var rowId = trList[j].id.slice(-1);
            if ($.inArray($("#drpFields_" + rowId + " option:selected").text(), drpselectedtext) > -1) {
                $("#drpFields_" + rowId).prop("style", "width: 178px;border:2px solid #82d866;border-radius: 5px;");
                ShowErrorMessage(GlobalErrorList.MyReports.duplicatequery_ErrorMessage);
                return false;
            }
            else {
                drpselectedtext.push($("#drpFields_" + rowId + " option:selected").text());
            }
        }
        return true;
    },
    GetFieldBindingData: function (Count) {

        let lmsaddrepfild = `<div class="row" id="trsearch${Count}" data-Count="${Count}">
                                    <div class="col-sm-6 colmd-6 col-lg-6 col-xl-6">
                                     <div class="form-group">
                                         <label for="drpFields_${Count}" class="frmlbltxt">Fields</label>
                                         <select   class ="form-control select2p5drpdwn" name="" id="drpFields_${Count}" data-placeholder="Add Fields"></select>
                                     </div>
                                 </div>
                                 <div class="col-sm-6 colmd-6 col-lg-6 col-xl-6">
                                     <div class="form-group">
                                         <label for="txtFieldAnswer_${Count}" class="frmlbltxt">Your Answer</label>
                                          <div id="sel_drpFields_${Count}" class ="d-flex align-items-center">
                                             <input type="text" name="" class ="form-control form-control-sm" id="txtFieldAnswer_${Count}"/>
                                             <i class="fa fa-trash-o lmssvrepdel"></i>
                                         </div>
                                     </div>
                                 </div>
                            </div>`;
        return lmsaddrepfild;
    },
    ReturnDateInFormat: function (dateValue) {
        var res = dateValue.split("/");
        var newDate = res[2] + '-' + res[0] + '-' + res[1];
        return newDate;
    },
    InitialiseCustomReportDropDown: function (Count) {
        $('#drpFields_' + Count).select2({
            minimumResultsForSearch: '',
            dropdownAutoWidth: false,
            containerCssClass: "border"
        });
    },
}


filterEventData = {
    StartDate: "", EndDate: "", EventData1: "", EventData2: "", EventData3: "", EventData4: "", EventData5: "", EventData6: "", EventData7: "", EventData8: "", EventData9: "", EventData10: "",
    EventData11: "", EventData12: "", EventData13: "", EventData14: "", EventData15: "", EventData16: "", EventData17: "", EventData18: "", EventData19: "", EventData20: "",
    EventData21: "", EventData22: "", EventData23: "", EventData24: "", EventData25: "", EventData26: "", EventData27: "", EventData28: "", EventData29: "", EventData30: "",
    EventData31: "", EventData32: "", EventData33: "", EventData34: "", EventData35: "", EventData36: "", EventData37: "", EventData38: "", EventData39: "", EventData40: "",
    EventData41: "", EventData42: "", EventData43: "", EventData44: "", EventData45: "", EventData46: "", EventData47: "", EventData48: "", EventData49: "", EventData50: "",

};
$(document).on('click', '#close-popup,.clsepopup', function () {
    /*clearmasterfilter();*/
    $(this).parents(".Eventpopupcontainer").addClass("hideDiv");


});


$("#dvmasterfieltercustomeventsReportsclose-popup,#btnCancel").click(function () {
    /*clearmasterfilter();*/
    $('#dvmasterfieltercustomeventsReports').addClass("hideDiv");
});

$(".addcalend").datepicker({
    changeMonth: true,
    changeYear: true,
    prevText: "click for previous months",
    nextText: "click for next months",
    showOtherMonths: true,
    selectOtherMonths: false,
});
$('input[name="groupckeckbox"]').click(function () {
    $(this).parent().next().toggleClass("hideDiv");
});
$(".lmsfildswrp").click(function () {
    var trList = $('[id^=trsearch]').last();
    let trelementcount = trList[0].id.slice(-1);
    trelementcount = parseInt(trelementcount) + 1;
    if (EventExtraFiledsName.length != trelementcount) {
        if (!CustomEventsCustomReportPopUpUtil.ValidateFieldsAndValues(trelementcount - 1)) {
            return;
        }

        $(".eventaddrepcontainer").append(CustomEventsCustomReportPopUpUtil.GetFieldBindingData(trelementcount));
        $("#drpFields_" + trelementcount).html($('#drpFields_0').html());
    }
      CustomEventsCustomReportPopUpUtil.InitialiseCustomReportDropDown(trelementcount);
});
$(".eventrepfildanswrp").on("click", ".lmssvrepdel", function () {
    ShowPageLoading();
    var deletedId = parseInt($(this).parent().parent().parent().parent().attr("data-Count")) + 1;
    var drpFieldscount = $('[id^=drpFields_]').length;
    $(this).parent().parent().parent().parent().remove();
    for (var i = deletedId; i < drpFieldscount; i++) {
        let fieldValue = $('#drpFields_' + i).val();
        let textValue = $('#txtFieldAnswer_' + i).val();
        $("#trsearch" + i).remove();
        $(".eventaddrepcontainer").append(CustomEventsCustomReportPopUpUtil.GetFieldBindingData(i - 1));
        $("#drpFields_" + (i - 1)).html($('#drpFields_0').html());
        /*  CustomEventsCustomReportPopUpUtil.InitialiseCustomReportDropDown(i - 1);*/
        $("#drpFields_" + (i - 1)).select2().val(fieldValue).trigger('change');
        $('#txtFieldAnswer_' + (i - 1)).val(textValue);
    }
    HidePageLoading();
});

function clearmasterfilter() {
    $('[id^="trsearch"]:not(:first)').remove();
    $('#txtStartDate,#txtEndDate,#txtFieldAnswer_0,#ui_txtName').val('');
    $('#ChkSave').prop('checked', false);
    $('#drpFields_0').select2().val(0).trigger('change');
    //$('#sel_drpFields_0').empty().html(`<input type="text" class="form-control form-control-sm" id="txtFieldAnswer_0" />`);
    $(".btn-dropdown").focus();
    $("#ui_txtdescription").val('');
    //$("#filterTags span").html("Filter By " + "All");
    //$("#txtsearch").val('')
    //$(".subdivFiltWrap").removeClass("showDiv");
    //MachineId = '';
    //contactDetails.EmailId = contactDetails.PhoneNumber = contactDetails.Name = null;
    CustomEventsCartReportUtil.ResetMasterFilter();
    //CustomEventsCartReportUtil.MaxCount();
    $(".subdivWrap").removeClass("showDiv");
    $(".selchbxall,.selChk").prop("checked", false);

}