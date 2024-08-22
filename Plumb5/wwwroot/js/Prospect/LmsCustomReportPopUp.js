var filterConditions = { Id: 0, UserInfoUserId: 0, Name: "", QueryField: "", ShowInDashboard: false };
var ContactAllPropertyList = []; var masterfiltervalue = 0;

$("#btnSearch").click(function () {
    ShowPageLoading();
    LmsCustomReportPopUpUtil.GetLmsFilterResult();
});

var LmsCustomReportPopUpUtil = {
    ValidateSearch: function () {
        if (window.location.href.indexOf('/ManageContact/Contact') > 0) {
            if ($("#drp_Stages").get(0).selectedIndex == 0 && $("#drp_Sources").get(0).selectedIndex == 0 && $("#drpFields_0").get(0).selectedIndex == 0 && $.trim($("#txtStartDate").val()).length == 0 && $.trim($("#txtEndDate").val()).length == 0 && $("#drp_handledBy").get(0).selectedIndex == 0 && $("#ui_drpdwn_OrderBy").get(0).selectedIndex == 0 && $("#ui_drp_ContactGroups").get(0).selectedIndex == 0 && $("#ui_drpdwn_Forms").get(0).selectedIndex == 0) {
                ShowErrorMessage(GlobalErrorList.MyReports.searchoption_ErrorMessage);
                return false;
            }
        }
        else if (window.location.href.indexOf('/Prospect/Leads') > 0) {
            if ($("#drplmsFields_0").get(0).selectedIndex == 0 && $("#drp_Stages").get(0).selectedIndex == 0 && $("#drp_Sources").get(0).selectedIndex == 0 && $("#drpFields_0").get(0).selectedIndex == 0 && $.trim($("#txtStartDate").val()).length == 0 && $.trim($("#txtEndDate").val()).length == 0 && $("#drp_handledBy").get(0).selectedIndex == 0 && $("#ui_drpdwn_OrderBy").get(0).selectedIndex == 0 && $("#ui_drp_ContactGroups").get(0).selectedIndex == 0 && $("#ui_drpdwn_Forms").get(0).selectedIndex == 0) {
                ShowErrorMessage(GlobalErrorList.MyReports.searchoption_ErrorMessage);
                return false;
            }
        }
        else if (window.location.href.indexOf('/Prospect/FollowUps') > 0) {
            if ($("#drplmsFields_0").get(0).selectedIndex == 0 && $("#drp_Stages").get(0).selectedIndex == 0 && $("#drp_Sources").get(0).selectedIndex == 0 && $("#drpFields_0").get(0).selectedIndex == 0 && $.trim($("#txtStartDate").val()).length == 0 && $.trim($("#txtEndDate").val()).length == 0 && $("#drp_handledBy").get(0).selectedIndex == 0 && $("#ui_drpdwn_OrderBy").get(0).selectedIndex == 0 && $("#ui_drp_ContactGroups").get(0).selectedIndex == 0 && $("#ui_drpdwn_Forms").get(0).selectedIndex == 0) {
                ShowErrorMessage(GlobalErrorList.MyReports.searchoption_ErrorMessage);
                return false;
            }
        }
        if ($("#txtStartDate").val().length > 0 || $("#txtEndDate").val().length > 0) {
            if ($("#txtStartDate").val().length == 0) {
                ShowErrorMessage(GlobalErrorList.MyReports.Fieldnotselect_ErrorMessage);
                return false;
            }
            if ($("#txtEndDate").val().length == 0) {
                ShowErrorMessage(GlobalErrorList.MyReports.Daterange_ErrorMessage);
                return false;
            }
        }

        if ($("#drpFields_0").get(0).selectedIndex != 0 && $("#drpFields_0").get(0).selectedIndex != -1 && ($("#txtFieldAnswer_0").val() == "" || $("#txtFieldAnswer_0").val() == 0)) {
            ShowErrorMessage(GlobalErrorList.MyReports.FieldAnswer_ErrorMessage);
            return false;
        }

        //if ($("#sel_drplmsFields_0").get(0).selectedIndex != 0 && ($("#txtLmsFieldAnswer_0").val() == "" || $("#txtLmsFieldAnswer_0").val() == 0)) {
        //    ShowErrorMessage(GlobalErrorList.MyReports.FieldAnswer_ErrorMessage);
        //    return false;
        //}
        let trelementvalidatecount = 0;
        let trvalidateList = $('[id^=trsearch]').last();
        trelementvalidatecount = trvalidateList[0].id.slice(-1);
        trelementvalidatecount = parseInt(trelementvalidatecount) + 1;
        let trelementvalidatecountoflmsfields = 0;
        let trvalidateListoflmsfields = $('[id^=trlmssearch]').last();
        trelementvalidatecountoflmsfields = trvalidateListoflmsfields[0].id.slice(-1);
        trelementvalidatecountoflmsfields = parseInt(trelementvalidatecountoflmsfields) + 1;
        if (trelementvalidatecount > 1 && !LmsCustomReportPopUpUtil.ValidateFieldsAndValues(trelementvalidatecount - 1)) {
            return;
        }
        if (trelementvalidatecountoflmsfields > 1 && !LmsCustomReportPopUpUtil.ValidatelmsFieldsAndValues(trelementvalidatecountoflmsfields - 1)) {
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
    ValidateFieldsAndValues: function (Id) {
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
        return true;
    },
    ValidatelmsFieldsAndValues: function (Id) {
        if ($("#drplmsFields_" + Id).get(0).selectedIndex == 0 && $("#txtLmsFieldAnswer_" + Id).val() == "") {
            ShowErrorMessage(GlobalErrorList.MyReports.FieldValue_ErrorMessage);
            return false;
        }
        if ($("#drplmsFields_" + Id).get(0).selectedIndex == 0 && $("#txtLmsFieldAnswer_" + Id).val() != "") {
            ShowErrorMessage(GlobalErrorList.MyReports.Field_ErrorMessage);
            return false;
        }
        if ($("#drplmsFields_" + Id).get(0).selectedIndex != 0 && ($("#txtLmsFieldAnswer_" + Id).val() == "" || $("#txtLmsFieldAnswer_" + Id).val() == 0)) {
            ShowErrorMessage(GlobalErrorList.MyReports.FieldAnswer_ErrorMessage);
            return false;
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

        var trlmsList = $('[id^=trlmssearch]');
        var drpselectedlmstext = new Array();

        for (var lmscount = 0; lmscount < trlmsList.length; lmscount++) {
            var lmsrowId = trlmsList[lmscount].id.slice(-1);
            if ($.inArray($("#drplmsFields_" + lmsrowId + " option:selected").text(), drpselectedlmstext) > -1) {
                $("#drplmsFields_" + lmsrowId).prop("style", "width: 178px;border:2px solid #82d866;border-radius: 5px;");
                ShowErrorMessage(GlobalErrorList.MyReports.duplicatequery_ErrorMessage);
                return false;
            }
            else {
                drpselectedlmstext.push($("#drplmsFields_" + lmsrowId + " option:selected").text());
            }
        }
        return true;
    },
    GetLmsFilterResult: function () {
        if (!LmsCustomReportPopUpUtil.ValidateSearch()) {
            HidePageLoading();
            return;
        }

        if (!LmsCustomReportPopUpUtil.ValidateDuplicateinDropdown()) {
            HidePageLoading();
            return;
        }

        if (window.location.href.toLowerCase().indexOf("/prospect/leads") > 0) {
            LeadsUtilGeneralFunction.ResetQuickFilter();
            $('#ui_i_filterClose').removeClass("hideDiv");
            $("#ui_i_filterOpen").addClass("hideDiv");
        }
        if (window.location.href.toLowerCase().indexOf("/prospect/followups") > 0) {
            FollowUpsGeneralFunction.ResetQuickFilter();
            $('#ui_i_filterClose').removeClass("hideDiv");
            $("#ui_i_filterOpen").addClass("hideDiv");
        }
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

        filterLead = {
            UserInfoUserId: 0, Score: -1, FormId: 0, EmailId: "", PhoneNumber: "", Name: "", LastName: "", Address1: "", Address2: "", StateName: "", Country: "", ZipCode: "",
            Age: null, Gender: "", MaritalStatus: "", Education: "", Occupation: "", Interests: "", Location: "", Religion: "", CompanyName: "", CompanyWebUrl: "", DomainName: "", CompanyAddress: "", Projects: "", LeadLabel: "", Remarks: "",
            CustomField1: "", CustomField2: "", CustomField3: "", CustomField4: "", CustomField5: "", CustomField6: "", CustomField7: "", CustomField8: "", CustomField9: "", CustomField10: "",
            CustomField11: "", CustomField12: "", CustomField13: "", CustomField14: "", CustomField15: "", CustomField16: "", CustomField17: "", CustomField18: "", CustomField19: "", CustomField20: "",
            CustomField21: "", CustomField22: "", CustomField23: "", CustomField24: "", CustomField25: "", CustomField26: "", CustomField27: "", CustomField28: "", CustomField29: "", CustomField30: "",
            CustomField31: "", CustomField32: "", CustomField33: "", CustomField34: "", CustomField35: "", CustomField36: "", CustomField37: "", CustomField38: "", CustomField39: "", CustomField40: "",
            CustomField41: "", CustomField42: "", CustomField43: "", CustomField44: "", CustomField45: "", CustomField46: "", CustomField47: "", CustomField48: "", CustomField49: "", CustomField50: "",
            CustomField51: "", CustomField52: "", CustomField53: "", CustomField54: "", CustomField55: "", CustomField56: "", CustomField57: "", CustomField58: "", CustomField59: "", CustomField60: "",
            SearchKeyword: "", PageUrl: "", ReferrerUrl: "", IsAdSenseOrAdWord: 0, Place: "", CityCategory: ""
        };


        filterConditions = { Id: 0, UserInfoUserId: 0, Name: "", QueryField: "", ShowInDashboard: false };

        var drpFieldscount = $('[id^=drpFields_]').length;
        var drplmsFieldscount = $('[id^=drplmsFields_]').length;
        if ($("#drpFields_0").val() != "0") {
            for (var i = 0; i < drpFieldscount; i++) {
                filterLead[$("#drpFields_" + i).val()] = $("#txtFieldAnswer_" + i).val();
            }
        }
        if ($("#drplmsFields_0").val() != "0") {
            for (var j = 0; j < drplmsFieldscount; j++) {
                filterLead[$("#drplmsFields_" + j).val()] = $("#txtLmsFieldAnswer_" + j).val();
            }
        }
        filterLead.Score = ($("#drp_Stages").val() == 0 && $('#select2-drp_Stages-container').text() == 'Select') ? -1 : parseInt($("#drp_Stages").val());
        filterLead.LmsGroupIdList = parseInt($("#drp_Sources").val()) > 0 ? $("#drp_Sources").val() : "";

        if ($("#txtStartDate").val() != "" && $("#txtEndDate").val() != "") {
            var fromdate, todate;

            let LocalFromdate = LmsDefaultFunctionUtil.ReturnDateInFormat($("#txtStartDate").val()) + " 00:00:00";
            let LocalTodate = LmsDefaultFunctionUtil.ReturnDateInFormat($("#txtEndDate").val()) + " 23:59:59";

            fromdate = ConvertDateTimeToUTC(LocalFromdate);
            todate = ConvertDateTimeToUTC(LocalTodate);

            var startdate = fromdate.getFullYear() + '-' + PrefixZero((fromdate.getMonth() + 1)) + '-' + PrefixZero(fromdate.getDate()) + " " + PrefixZero(fromdate.getHours()) + ":" + PrefixZero(fromdate.getMinutes()) + ":" + PrefixZero(fromdate.getSeconds());;
            var enddate = todate.getFullYear() + '-' + PrefixZero((todate.getMonth() + 1)) + '-' + PrefixZero(todate.getDate()) + " " + PrefixZero(todate.getHours()) + ":" + PrefixZero(todate.getMinutes()) + ":" + PrefixZero(todate.getSeconds());;

            filterLead.StartDate = startdate;
            filterLead.EndDate = enddate;
        }

        filterLead.OrderBy = $('#ui_drpdwn_OrderBy').val();

        filterLead.GroupId = parseInt($("#ui_drp_ContactGroups").val());
        filterLead.FormId = parseInt($("#ui_drpdwn_Forms").val());

        filterLead.UserInfoUserId = parseInt($("#drp_handledBy").val());
        filterConditions.QueryField = filterLead;
        if (window.location.href.toLowerCase().indexOf("/prospect/followups") > 0 && window.location.href.toLowerCase().indexOf("/prospect/followups/missedfollowups") < 0 && window.location.href.toLowerCase().indexOf("/prospect/followups/completedfollowups") < 0)
        { 
            if (filterLead.UserInfoUserId == -1)
                filterLead.UserInfoUserId = 0
            filterLead.OrderBy = 4;
        }
        if (window.location.href.toLowerCase().indexOf("/prospect/followups/missedfollowups") > 0) {
            if (filterLead.UserInfoUserId == -1)
                filterLead.UserInfoUserId = 0
            filterLead.OrderBy = 5;
        }
        if (window.location.href.toLowerCase().indexOf("/prospect/followups/completedfollowups") > 0) {
            if (filterLead.UserInfoUserId == -1)
                filterLead.UserInfoUserId = 0
            filterLead.OrderBy = 6;
        }


        $('#dvAddOrUpdateReports').addClass("hideDiv");
        if (window.location.href.indexOf("/Prospect/Leads") > 0 || window.location.href.indexOf("/Prospect/Reports/MyReports") > 0 || window.location.href.indexOf("/Prospect/FollowUps") > 0) {
            masterfiltervalue = 1;
            LeadReportBindingUtil.GetMaxCount();
        }
        if (window.location.href.indexOf("/ManageContact/Contact") > 0) {
            ContactsReportBindingUtil.ContactGetMaxCount();
        }
        if ($('#ChkSave').attr('chkid') == '0') {
            if ($("#ChkSave").is(':checked'))
                LmsCustomReportPopUpUtil.SaveLmsFilterConditionDetails();
        }
    },
    SaveLmsFilterConditionDetails: function () {
        if ($("#ChkSave").is(':checked')) {
            var saveFilterConditions = { Id: 0, UserInfoUserId: Plumb5UserId, Name: "", QueryField: "", ShowInDashboard: false };
            saveFilterConditions.Name = $("#ui_txtName").val();
            saveFilterConditions.QueryField = JSON.stringify(filterLead);

            saveFilterConditions.Id = $("#btnSearch").attr("saved-id");

            $.ajax({
                url: "/Prospect/Reports/SaveLmsFilterConditiondetails",
                type: 'POST',
                data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'filterConditions': saveFilterConditions }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) {
                    if (response.Status == 1) {
                        ShowSuccessMessage(GlobalErrorList.MyReports.SearchSave_SuccessMessage);
                        $('#dvAddOrUpdateReports').addClass("hideDiv");
                    }
                    else if (response.Status == 2 && saveFilterConditions.Id == 0) {
                        ShowErrorMessage(GlobalErrorList.MyReports.ReportNameexist_ErrorMessage);
                    }
                    else if (response.Status == 3 && saveFilterConditions.Id > 0) {
                        ShowSuccessMessage(GlobalErrorList.MyReports.SearchUpdate_SuccessMessage);
                        $('#dvAddOrUpdateReports').addClass("hideDiv");
                        LmsCustomReportPopUpUtil.BindSavedReports("hideDiv");
                    }
                    else if (response.Status == 4 && saveFilterConditions.Id > 0) {
                        ShowErrorMessage(GlobalErrorList.MyReports.ReportNameexist_ErrorMessage);
                    }
                    setTimeout(function () { LmsCustomReportPopUpUtil.BindSavedReports(); }, 3000);
                },
                error: ShowAjaxError
            });
        }
    },
    BindSavedReports: function () {
        $.ajax({
            url: "/Prospect/Reports/GetSavedReports",
            type: 'POST',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'UserId': Plumb5UserId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != undefined && response != null && response.length > 0) {
                    var SavedreportTableTrs = "", checkedData = "checked=checked";
                    $.each(response, function () {
                        SavedreportTableTrs += "<tr>" +
                            "<td class='text-left td-wid-5 m-p-w-40'>" +
                            "<div class='custom-control custom-checkbox'>" +
                            "<input type='checkbox' class='custom-control-input' id='rdSavedreports_" + this.Id + "' name='lmssavedrept' " + checkedData + " onclick=\"MyReportsUtil.GetFilterConditionDetails('Bind'," + this.Id + ");\">" +
                            "<label class='custom-control-label' for='rdSavedreports_" + this.Id + "'></label>" +
                            "</div>" +
                            "</td>" +
                            "<td class='text-left'>" +
                            "<div class='lmssavedrepname mb-3'><i class='fa fa-bar-chart'></i>" +
                            "<span>" + this.Name + "</span></div>" +
                            "<div class='editDeleteWrap'>" +
                            "<button data-colheadtitle='Edit Event Tracking' class='td-edit editEventTrack popViewHref ContributePermission' onclick=\"MyReportsUtil.EditSavedReports(" + this.Id + ");\">Edit</button>" +
                            "<button data-toggle='modal' data-target='#deletelmsuser' class='td-delete delEventTrack FullControlPermission' onclick=\"MyReportsUtil.DeleteSavedSearchConfirm(" + this.Id + ");\">Delete</button></div>" +
                            "</td>" +
                            "</tr>";
                        checkedData = '';
                    });
                    $("#ui_tblSavedReportData").removeClass('no-data-records');
                    $("#ui_tbodySavedReportData").html(SavedreportTableTrs);

                }
                else {
                    SetNoRecordContent('ui_tblSavedReportData', 2, 'ui_tbodySavedReportData');
                }
                CheckAccessPermission("Prospect");
            },
            error: ShowAjaxError
        });
    },
    ClearFields: function () {
        $('#txtStartDate,#txtEndDate,#txtFieldAnswer_0,#ui_txtName', '#txtLmsFieldAnswer_0').val('');
        $('#ChkSave').prop('checked', false);
        $('#dvNumOfDays,#dvReportName').addClass('hideDiv');
        $('#drp_Sources,#drpFields_0,#drplmsFields_0,#drp_handledBy,#ui_drp_ContactGroups,#ui_drpdwn_Forms').select2().val(0).trigger('change');
        $('#drp_Stages, #ui_drpdwn_OrderBy').select2().val(-1).trigger('change');
        $('#sel_drpFields_0').empty().html(`<input type="text" class="form-control form-control-sm" id="txtFieldAnswer_0" />`);
        $('#sel_drplmsFields_0').empty().html(`<input type="text" class="form-control form-control-sm" id="txtLmsFieldAnswer_0" />`);
    },
    GetFieldTypeWithData: function (key, value, count) {
        var sField = ContactAllPropertyList.find(x => x.PropertyName === key);
        if (sField != undefined) {
            var fType = sField.FieldType;
            var dData = sField.FieldOption;

            var html = `<input type="text" name="" class="form-control form-control-sm" id="txtFieldAnswer_${count}" value="${value}"/>`;
            if (count != 0) { html += ` <i class="fa fa-trash-o lmssvrepdel"></i>`; }
            if (fType == 3 || fType == 4) {
                var option = JSON.parse(sField.FieldOption);

                let itemDropDownValue = `<option value="0">Select</option>`;
                $.each(option, function () {
                    itemDropDownValue += `<option value="${this.Value.toLowerCase()}">${this.Name}</option>`;
                });
                if (count == 0)
                    html = `<select class="form-control select2p5drpdwn" id="txtFieldAnswer_${count}" >${itemDropDownValue}</select>`;
                else
                    html = `<select class="form-control select2p5drpdwn" id="txtFieldAnswer_${count}" >${itemDropDownValue}</select> <i class="fa fa-trash-o lmssvrepdel"></i>`;
            }
        }
        return html;
    },
    GetlmsFieldTypeWithData: function (key, value, count) {
        var sField = Lmscustomfielddetails.find(x => x.FieldName === key);


        var html = `<input type="text" name="" class="form-control form-control-sm" id="txtLmsFieldAnswer_${count}" value="${value}"/>`;
        if (count != 0) { html += ` <i class="fa fa-trash-o lmssvrepdel"></i>`; }

        return html;
    },
    GetSelectedFieldChange: function (data, value, count) {
        if ($(data).val() != "0") {
            var divid = '#sel_' + data.id;
            var html = LmsCustomReportPopUpUtil.GetFieldTypeWithData($(data).val(), value, count);
            $(divid).html(html);
        }
    },
    GetlmsSelectedFieldChange: function (data, value, count) {
        if ($(data).val() != "0") {
            var divid = '#sel_' + data.id;
            var html = LmsCustomReportPopUpUtil.GetlmsFieldTypeWithData($(data).val(), value, count);
            $(divid).html(html);
        }
    },
    InitialiseCustomReportDropDown: function (Count) {
        $('#drpFields_' + Count).select2({
            minimumResultsForSearch: '',
            dropdownAutoWidth: false,
            containerCssClass: "border"
        });
    },
    InitialiselmsCustomReportDropDown: function (Count) {
        $('#drplmsFields_' + Count).select2({
            minimumResultsForSearch: '',
            dropdownAutoWidth: false,
            containerCssClass: "border"
        });
    },
    GetFieldBindingData: function (Count) {
        let lmsaddrepfild = `<div class="row" id="trsearch${Count}" data-Count="${Count}">
                                    <div class="col-sm-6 colmd-6 col-lg-6 col-xl-6">
                                     <div class="form-group">
                                         <label for="drpFields_${Count}" class="frmlbltxt">Fields</label>
                                         <select onchange="LmsCustomReportPopUpUtil.GetSelectedFieldChange(this,'',${Count})" class ="form-control select2p5drpdwn" name="" id="drpFields_${Count}" data-placeholder="Add Fields"></select>
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
    GetLmsFieldBindingData: function (Count) {
        let lmsaddrepfild = `<div class="row" id="trlmssearch${Count}" data-Count="${Count}">
                                    <div class="col-sm-6 colmd-6 col-lg-6 col-xl-6">
                                     <div class="form-group">
                                         <label for="drplmsFields_${Count}" class="frmlbltxt">Lms Fields</label>
                                         <select onchange="LmsCustomReportPopUpUtil.GetlmsSelectedFieldChange(this,'',${Count})" class ="form-control select2p5drpdwn" name="" id="drplmsFields_${Count}" data-placeholder="Add Fields"></select>
                                     </div>
                                 </div>
                                 <div class="col-sm-6 colmd-6 col-lg-6 col-xl-6">
                                     <div class="form-group">
                                         <label for="txtLmsFieldAnswer_${Count}" class="frmlbltxt">Your Answer</label>
                                          <div id="sel_drplmsFields_${Count}" class ="d-flex align-items-center">
                                             <input type="text" name="" class ="form-control form-control-sm" id="txtLmsFieldAnswer_${Count}"/>
                                             <i class="fa fa-trash-o lmssvrepdel"></i>
                                         </div>
                                     </div>
                                 </div>
                            </div>`;
        return lmsaddrepfild;
    }
};

$(".addcalend").datepicker({
    changeMonth: true,
    changeYear: true,
    prevText: "click for previous months",
    nextText: "click for next months",
    showOtherMonths: true,
    selectOtherMonths: false,
});


$(".lmsfildswrp").click(function () {
    var trList = $('[id^=trsearch]').last();
    let trelementcount = trList[0].id.slice(-1);
    trelementcount = parseInt(trelementcount) + 1;
    if (!LmsCustomReportPopUpUtil.ValidateFieldsAndValues(trelementcount - 1)) {
        return;
    }

    $(".lmsaddrepcontainer").append(LmsCustomReportPopUpUtil.GetFieldBindingData(trelementcount));
    $("#drpFields_" + trelementcount).html($('#drpFields_0').html());
    LmsCustomReportPopUpUtil.InitialiseCustomReportDropDown(trelementcount);
});


$(".lmscustomfildswrp").click(function () {
    var trList = $('[id^=trlmssearch]').last();
    let trelementcount = trList[0].id.slice(-1);
    trelementcount = parseInt(trelementcount) + 1;
    if (!LmsCustomReportPopUpUtil.ValidatelmsFieldsAndValues(trelementcount - 1)) {
        return;
    }

    $(".lmscustomaddrepcontainer").append(LmsCustomReportPopUpUtil.GetLmsFieldBindingData(trelementcount));
    $("#drplmsFields_" + trelementcount).html($('#drplmsFields_0').html());
    LmsCustomReportPopUpUtil.InitialiselmsCustomReportDropDown(trelementcount);
});
$(".lmsrepfildanswrp").on("click", ".lmssvrepdel", function () {
    ShowPageLoading();
    var deletedId = parseInt($(this).parent().parent().parent().parent().attr("data-Count")) + 1;
    var drpFieldscount = $('[id^=drpFields_]').length;
    $(this).parent().parent().parent().parent().remove();
    for (var i = deletedId; i < drpFieldscount; i++) {
        let fieldValue = $('#drpFields_' + i).val();
        let textValue = $('#txtFieldAnswer_' + i).val();
        $("#trsearch" + i).remove();
        $(".lmsaddrepcontainer").append(LmsCustomReportPopUpUtil.GetFieldBindingData(i - 1));
        $("#drpFields_" + (i - 1)).html($('#drpFields_0').html());
        LmsCustomReportPopUpUtil.InitialiseCustomReportDropDown(i - 1);
        $("#drpFields_" + (i - 1)).select2().val(fieldValue).trigger('change');
        $('#txtFieldAnswer_' + (i - 1)).val(textValue);

    }
    HidePageLoading();
});
$(".lmscustomrepfildanswrp").on("click", ".lmssvrepdel", function () {
    ShowPageLoading();
    var deletedId = parseInt($(this).parent().parent().parent().parent().attr("data-Count")) + 1;
    var drpFieldscount = $('[id^=drplmsFields_]').length;
    $(this).parent().parent().parent().parent().remove();
    for (var i = deletedId; i < drpFieldscount; i++) {
        $("#drpFields_" + (i - 1)).select2().val(fieldValue).trigger('change');
        $('#txtFieldAnswer_' + (i - 1)).val(textValue);
        $("#trlmssearch" + i).remove();
        $(".lmscustomaddrepcontainer").append(LmsCustomReportPopUpUtil.GetLmsFieldBindingData(i - 1));
        $("#drplmsFields_" + (i - 1)).html($('#drplmsFields_0').html());
        LmsCustomReportPopUpUtil.InitialiseCustomReportDropDown(i - 1);
        $("#drplmsFields_" + (i - 1)).select2().val(fieldValue).trigger('change');
        $('#txtLmsFieldAnswer_' + (i - 1)).val(textValue);
    }
    HidePageLoading();
});

$('input[name="lmssavereptsbyday"]').click(function () {
    $(this).parent().next().toggleClass("hideDiv");
});

$('input[name="lmssaverepopt"]').click(function () {
    $(this).parent().next().toggleClass("hideDiv");
});

$("#dvAddOrUpdateReportsclose-popup,#btnCancel").click(function () {
    $('#dvAddOrUpdateReports').addClass("hideDiv");
});

$('#drp_Stages, #drp_Sources, #drpFields_0, #drp_handledBy, #ui_drpdwn_OrderBy, #ui_drp_ContactGroups, #ui_drpdwn_Forms,#drplmsFields_0').select2({
    minimumResultsForSearch: '',
    dropdownAutoWidth: false,
    containerCssClass: "border"
});