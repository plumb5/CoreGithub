var Editrealtimes = [];
var LmsEditrealtimes = [];
var spreadsheets = {};

$("#close-popup, .clsepopup").click(function () {

    $(this).parents(".popupcontainer").addClass("hideDiv");
    SpreadsheetsImportDataUtil.Refreshspreadsheetdetails();
    /* SpreadsheetsImportDataUtil.GetLiveSheetDetails('bulkimport');*/

});
$("#btncancel").click(function () {
    if ($("#btncancel").html() != "Back") {
        $(this).parents(".popupcontainer").addClass("hideDiv");
        SpreadsheetsImportDataUtil.Refreshspreadsheetdetails();
        /*  SpreadsheetsImportDataUtil.GetLiveSheetDetails('bulkimport');*/
    }
    else

        SpreadsheetsImportDataUtil.Refreshspreadsheetdetails();
});
$('#timezone_offset, #ui_drpdwn_GroupName, #ui_drpdwn_APIIRN,#ui_drpdwn_datetimeformat').select2({
    minimumResultsForSearch: '',
    dropdownAutoWidth: false,
    containerCssClass: "border"
});
$(document).ready(function () {
    /*SpreadsheetsImportDataUtil.Getlmscustomfields();*/
});
$("input[name='dataimportType']").click(function () {
    var gsheettypeval = $("input[name='dataimportType']:checked").val();
    if (gsheettypeval == "Real Time Import") {
        SpreadsheetsImportDataUtil.GetLiveSheetDetails(gsheettypeval);
        $("#bulkimportsheet").addClass("hideDiv");
        $("#realtimeimportsheet").removeClass("hideDiv");

    } else {
        SpreadsheetsImportDataUtil.GetLiveSheetDetails(gsheettypeval);
        $("#realtimeimportsheet").addClass("hideDiv");
        $("#bulkimportsheet").removeClass("hideDiv");

    }
});
var DateTimeFormat = [
    { DateTimeColumn: 'MM/dd/yyyy h:mm tt', FrontEndName: 'MM/dd/yyyy h:mm tt' },
    { DateTimeColumn: 'yyyy-MM-dd HH:mm:ss', FrontEndName: 'yyyy-MM-dd HH:mm:ss' },
    { DateTimeColumn: 'dddd, MMMM d, yyyy h:mm tt', FrontEndName: 'dddd, MMMM d, yyyy h:mm tt' },
    { DateTimeColumn: 'M/d/yyyy', FrontEndName: 'M/d/yyyy' }
];
var editdatamapping = 0;
var getmappingfieldsvalue = [];
var deleteId = 0;
var SaveUpdate_Action = 'Save';
var SaveUpdate_Id = 0;
var Plumb5contactColumns = [];
var LmscustomfieldsColumns = [];
var dataMapping = 0;
var LmsdataMapping = 0;
var SpreedsheetID = "";
var Range = "";
var ConnectionName = [];
var Editrealtime = "";
var ContactImportOverview = {
    GroupId: 0, AssociateContactsToGroup: false, GroupAddSuccessCount: 0, OverrideSources: false, OverrideAssignment: false, GroupAddRejectCount: 0
}
$(".googlesheetmap").click(function () {
    //$(document).on("click", ".googlesheetmap", function () {

    if (dataMapping > 0) {
        if (!SpreadsheetsImportDataUtil.ValidateDataMapping())
            return false;
    }

    var addgooglesheetdata = `<div class="datamapcolwrap">
  <div id="trsearch" class="row">
    <div class="col-md-5 col-lg-5">
      <div class="form-group">
        <label class="frmlbltxt" for="">Google Sheet Column</label>
        <select class="form-control" id="ui_drpdwn_GSC_${dataMapping}">
          ${CloumnDropdownList}
        </select>
      </div>
    </div>
    <div class="col-md-5 col-lg-5">
      <div class="form-group">
        <label class="frmlbltxt" for="">Plumb5 Data Column</label>
        <select class="form-control" id="ui_drpdwn_PDC_${dataMapping}">
          ${Plumb5FieldsDropdownList}
        </select>
      </div>
    </div>
    <div class="col-md-2 col-lg-2 d-flex align-items-center justify-content-start p-0">
      <i class="icon ion-ios-close-outline closedatamapcolumns"></i>
    </div>
  </div>
</div>`;

    $(".datamapappndwrap").append(addgooglesheetdata);
    $(".closedatamapcolumns").click(function () {
        $(this).parent().parent().remove();

        //dataMapping--; 
    });
    $('#ui_drpdwn_GSC_' + dataMapping + ', #ui_drpdwn_PDC_' + dataMapping).select2({
        minimumResultsForSearch: '',
        dropdownAutoWidth: false,
        containerCssClass: "border"
    });

    dataMapping++;
});
$(".lmsgooglesheetmap").click(function () {

    if (LmsdataMapping > 0) {
        if (!SpreadsheetsImportDataUtil.LmsValidateDataMapping())
            return false;
    }

    var addgooglesheetdata = `<div class="lmsdatamapcolwrap">
  <div id="lmstrsearch" class="row">
    <div class="col-md-5 col-lg-5">
      <div class="form-group">
        <label class="frmlbltxt" for="">Google Sheet Column</label>
        <select class="form-control" id="ui_lmsdrpdwn_GSC_${LmsdataMapping}">
          ${CloumnDropdownList}
        </select>
      </div>
    </div>
    <div class="col-md-5 col-lg-5">
      <div class="form-group">
        <label class="frmlbltxt" for="">Lms Custom Fields</label>
        <select class="form-control" id="ui_lmsdrpdwn_PDC_${LmsdataMapping}">
          ${LmsFieldsDropdownList}
        </select>
      </div>
    </div>
    <div class="col-md-2 col-lg-2 d-flex align-items-center justify-content-start p-0">
      <i class="icon ion-ios-close-outline lmsclosedatamapcolumns"></i>
    </div>
  </div>
</div>`;

    $(".lmsdatamapappndwrap").append(addgooglesheetdata);
    $(".lmsclosedatamapcolumns").click(function () {
        $(this).parent().parent().remove();

        //dataMapping--; 
    });
    $('#ui_lmsdrpdwn_GSC_' + LmsdataMapping + ', #ui_lmsdrpdwn_PDC_' + LmsdataMapping).select2({
        minimumResultsForSearch: '',
        dropdownAutoWidth: false,
        containerCssClass: "border"
    });

    LmsdataMapping++;
});
$("#gstartImprtbtn").click(function () {
    if (!SpreadsheetsImportDataUtil.ValidateGoogleSheetImport()) {
        return false;
    }
    ShowPageLoading();
    let datamappingdetails = [];
    let Lmsdatamappingdetails = [];
    Plumb5contactColumns = [];
    LmscustomfieldsColumns = [];
    var plumb5columncheck = new Array();
    var lmscolumncheck = new Array();
    for (var i = 0; i < dataMapping; i++) {
        var filterConditions = '';
        var _Plumb5contactColumns = '';
        if ($.inArray($("#ui_drpdwn_GSC_" + i).val(), plumb5columncheck) > -1) {
            $("#ui_drpdwn_GSC_" + i).focus();
            ShowErrorMessage(GlobalErrorList.SpreadsheetsImportData.Duplicateheader);
            HidePageLoading();
            return false;
        }
        if ($("#ui_drpdwn_GSC_" + i + " option:selected").val() != undefined && $("#ui_drpdwn_PDC_" + i + " option:selected").val() != undefined) {
            filterConditions = `{"Key":"` + $("#ui_drpdwn_GSC_" + i + " option:selected").val() + `", "Value":"` + $("#ui_drpdwn_PDC_" + i + " option:selected").val() + `","DataType":"` + $("#ui_drpdwn_PDC_" + i + " option:selected").attr("attr_datatype") + `"}`;
            plumb5columncheck.push($("#ui_drpdwn_GSC_" + i + " option:selected").val());
            datamappingdetails.push(filterConditions);
            _Plumb5contactColumns = `` + $("#ui_drpdwn_GSC_" + i + " option:selected").val() + `,` + $("#ui_drpdwn_PDC_" + i + " option:selected").val() + `,` + $("#ui_drpdwn_PDC_" + i + " option:selected").attr("attr_displayname") + `,` + $("#ui_drpdwn_GSC_" + i + " option:selected").attr("attr_spreadsheetdisplayname") + ``;
            Plumb5contactColumns.push(_Plumb5contactColumns);

        }
    }
    for (var i = 0; i < LmsdataMapping; i++) {
        var filterConditions = '';
        var _LmscustomfieldsColumns = '';
        if ($.inArray($("#ui_lmsdrpdwn_GSC_" + i).val(), lmscolumncheck) > -1) {
            $("#ui_lmsdrpdwn_GSC_" + i).focus();
            ShowErrorMessage(GlobalErrorList.SpreadsheetsImportData.Duplicateheader);
            HidePageLoading();
            return false;
        }
        if ($("#ui_lmsdrpdwn_GSC_" + i + " option:selected").val() != undefined && $("#ui_lmsdrpdwn_PDC_" + i + " option:selected").val() != undefined) {
            filterConditions = `{"Key":"` + $("#ui_lmsdrpdwn_GSC_" + i + " option:selected").val() + `", "Value":"` + $("#ui_lmsdrpdwn_PDC_" + i + " option:selected").val() + `"}`;
            lmscolumncheck.push($("#ui_lmsdrpdwn_GSC_" + i + " option:selected").val());
            Lmsdatamappingdetails.push(filterConditions);
            _LmscustomfieldsColumns = `` + $("#ui_lmsdrpdwn_GSC_" + i + " option:selected").val() + `,` + $("#ui_lmsdrpdwn_PDC_" + i + " option:selected").val() + `,` + $("#ui_lmsdrpdwn_PDC_" + i + " option:selected").attr("attr_displayname") + `,` + $("#ui_lmsdrpdwn_GSC_" + i + " option:selected").attr("attr_spreadsheetdisplayname") + ``;
            LmscustomfieldsColumns.push(_LmscustomfieldsColumns);

        }
    }
    if (!Plumb5contactColumns.join(',').includes('UpdatedDate')) {
        ShowErrorMessage(GlobalErrorList.SpreadsheetsImportData.UpdatedDate);
        HidePageLoading();
        return false;

    }

    if (!Plumb5contactColumns.join(',').includes('EmailId') && !Plumb5contactColumns.join(',').includes('PhoneNumber')) {
        ShowErrorMessage(GlobalErrorList.SpreadsheetsImportData.EmailPhonenumber);
        HidePageLoading();
        return false;

    }
    datamappingdetails = datamappingdetails.join(',');
    Lmsdatamappingdetails = Lmsdatamappingdetails.join(',');
    var is_createstayoveride = 0;
    if ($("#lmsStaySource").is(":checked")) {
        is_createstayoveride = 0;
    }
    else if ($("#lmsOverrideSource").is(":checked")) {
        is_createstayoveride = 1;
    }
    else if ($("#lmsNewSource").is(":checked")) {
        is_createstayoveride = 2;
    }
    spreadsheets = {};
    spreadsheets = {
        Id: 0, UserInfoUserId: Plumb5UserId, Name: $("#ui_txt_ConnectionName").val(), SpreadsheetId: $("#ui_txt_SpreadsheetId").val(), Range: $("#ui_txt_Range").val(),
        ImportType: $("input[name='dataimportType']:checked").val(), MappingFields: datamappingdetails, LastExcuteDateTime: null, APIResponseId: $("#ui_drpdwn_APIIRN option:selected").val(),
        ExcutingStatus: 0, Status: true, ErrorMessage: "", TimeZone: $("#timezone_offset").val(), CreatedDate: null, LmsGroupId: parseInt($("#Ui_leadsource option:selected").val()), OverrideSources: is_createstayoveride, MappingLmscustomFields: Lmsdatamappingdetails, Dateformat: $("#ui_drpdwn_datetimeformat option:selected").val(),
    };

    ContactImportOverview = { GroupId: parseInt($("#ui_drpdwn_GroupName").val()), AssociateContactsToGroup: $("#ui_check_existContacts").is(":checked"), GroupAddRejectCount: 0, GroupAddSuccessCount: 0, OverrideSources: $("#ui_check_overridesources").is(":checked"), OverrideAssignment: $("#ui_check_retainassignconts").is(":checked"), LmsGroupId: parseInt($("#Ui_leadsource").val()) }

    var SelectedUserList = $('#ui_ddlUserList').val();
    if (SelectedUserList != null) {
        ContactImportOverview.UserIdList = SelectedUserList.join(",");
    }

    if ($("input[name='dataimportType']:checked").val() == 'bulkimport') {
        $('#savebulkimport').modal();
    }

    else {
        SpreadsheetsImportDataUtil.SaveSpreadsheetsImportData(spreadsheets);
    }

    HidePageLoading();
});
var ContactImportOverview
var ContactAllPropertyList = [], Plumb5FieldsDropdownList = "", CloumnDropdownList = "", Lmscustomfielddetails = [], LmsFieldsDropdownList = "";
var SpreadsheetsImportDataUtil = {
    GetSpreadsheetsresponses: function () {
        SpreedsheetID = $("#ui_txt_SpreadsheetId").val()
        Range = $("#ui_txt_Range").val()
        CloumnDropdownList = `<option value="select">Select</option>`;
        $.ajax({
            url: "/ManageContact/SpreadsheetsImportData/GetGoogleService",
            type: 'POST',
            data: JSON.stringify({ 'adsId': Plumb5AccountId, 'SpreadsheetId': SpreedsheetID, 'Range': Range }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != "Nodata") {

                    for (var i = 0; i < response.Values[0].length; i++) {
                        CloumnDropdownList += `<option attr_spreadsheetdisplayname="${response.Values[0][i]}" value="${i}">${response.Values[0][i]}</option>`
                    }
                    SpreadsheetsImportDataUtil.GetLeadProperties();
                } else {
                    ShowErrorMessage(GlobalErrorList.SpreadsheetsImportData.Getspreadsheeterror);
                }

                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },
    SaveSpreadsheetsImportData: function (spreadsheets) {
        ShowPageLoading();
        $.ajax({
            url: "/ManageContact/SpreadsheetsImportData/SaveSpreadsheetsImportData",
            type: 'POST',
            data: JSON.stringify({ 'accountid': Plumb5AccountId, 'spreadsheets': spreadsheets, 'Plumb5contactColumns': Plumb5contactColumns, 'SpreedsheetID': SpreedsheetID, 'Range': Range, 'contactImportOverview': ContactImportOverview, 'Action': SaveUpdate_Action, 'Id': SaveUpdate_Id }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response > 0) {
                    ShowSuccessMessage(GlobalErrorList.SpreadsheetsImportData.SaveSuccess);
                    HidePageLoading();
                    location.reload();
                    /*setTimeout(function () { location.reload(); }, 3000);*/
                } else {
                    ShowErrorMessage(GlobalErrorList.SpreadsheetsImportData.SaveError);
                }
                SpreadsheetsImportDataUtil.Refreshspreadsheetdetails();
                $(".clsepopup").click();

            },
            error: ShowAjaxError
        });
    },
    GetLiveSheetDetails: function (ImportType) {
        $.ajax({
            url: "/ManageContact/SpreadsheetsImportData/GetLiveSheetDetails",
            type: 'POST',
            data: JSON.stringify({ 'accountid': Plumb5AccountId, 'ImportType': ImportType }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                $("#ui_tbody_LiveSheetDetails").empty();
                if (response != null && response.length > 0) {

                    let tdContent = ``;
                    ConnectionName = [];
                    $.each(response, function () {

                        let Realtimename = "";
                        var changerealtimestatus = `<td class="text-color-success">Active</td>`;
                        if (this.Status == 0)
                            changerealtimestatus = `<td class="text-color-error">InActive</td>`;

                        if (this.ImportType == "Real Time Import") {
                            var $Editrealtime = "";
                            var $LmsEditrealtime = "";
                            $Editrealtime = this.MappingFields;
                            if (this.MappingLmscustomFields != null)
                                $LmsEditrealtime = this.MappingLmscustomFields;
                            Realtimename = `<td>
                                <div class="groupnamewrap">
                                    <div class="nameTxtWrap">
                                        ${this.Name}
                                    </div>
                                    <div class="tdcreatedraft">
                                        <div class="dropdown">
                                            <button type="button"
                                                class="verticnwrp"
                                                data-toggle="dropdown"
                                                aria-haspopup="true"
                                                aria-expanded="false">
                                                <i class="icon ion-android-more-vertical mr-0"></i>
                                            </button>
                                            <div class="dropdown-menu dropdown-menu-right"
                                                aria-labelledby="filterbycontacts">
                                                <a class='dropdown-item spreedsheetresp' href='javascript:void(0);'
                                                    onclick='spreedsheetoverviewresponse.GetMaxCount("${this.Id}",\"${this.Name}\");'>
                                                    View Responses</a>
                                                <a class="dropdown-item"
                                                    href="javascript:void(0)" id="ui_changestatus" att_changestatus=${this.Id}>Change Status</a>
                                                <a class="dropdown-item"
                                                    href="javascript:void(0)" onclick='SpreadsheetsImportDataUtil.EditRealtimeDetails("${this.Id}","${this.APIResponseId}","${this.LmsGroupId}","${this.OverrideSources}","${this.SpreadsheetId}","${this.Range}","${this.Name}","${this.TimeZone}","${$Editrealtime.replace('[{', '@@').replace('}]', '$').replace(/['"]+/g, '##').replace(/,/g, '&&').replace(/:\s*/g, "**").replace('{', "__").replace('}', "~~")}","${$LmsEditrealtime.replace('[{', '@@').replace('}]', '$').replace(/['"]+/g, '##').replace(/,/g, '&&').replace(/:\s*/g, "**").replace('{', "__").replace('}', "~~")}","${this.Dateformat}");'>Edit</a>
                                                <div class="dropdown-divider"></div> 
                                                <a data-toggle="modal"
                                                    data-target="#deletegroups" id="ui_deletedata"
                                                    data-grouptype="groupDelete"
                                                    class="dropdown-item"
                                                    href="javascript:void(0)" onclick="SpreadsheetsImportDataUtil.ShowDeletePopUp(${this.Id});">Delete</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </td>`
                        }
                        else {
                            Realtimename = `<td>
                                <div class="groupnamewrap">
                                    <div class="nameTxtWrap">
                                        ${this.Name}
                                    </div>
                                </div>
                            </td>`
                        }
                        ConnectionName.push(this.Name)
                        tdContent += `<tr>
                                    ${Realtimename}
                                    ${changerealtimestatus}
                                    <td>${$.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(this.CreatedDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(this.CreatedDate))}</td>
                                </tr>`;
                    });

                    $("#ui_tbody_LiveSheetDetails").append(tdContent);
                } else {
                    $("#ui_tbody_LiveSheetDetails").append(`<tr><td colspan="3" class="border-bottom-0"><div class="no-data ">There is no data for this view.</div></td></tr>`);
                }
            },
            error: ShowAjaxError
        });
    },
    GetAPIIRN: function () {
        SpreadsheetsImportDataUtil.BindLmsSource();
        //SpreadsheetsImportDataUtil.GetLiveSheetDetails('bulkimport');
        $.ajax({
            url: "/ManageContact/ApiImportSettings/GetDetails",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'OffSet': 0, 'FetchNext': 0, 'Name': '' }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            success: function (response) {
                if (response != null) {
                    $.each(response, function () {
                        $("#ui_drpdwn_APIIRN").append($('<option attr_APIIRNname="' + this.Name + '" value="' + this.Name + '" >' + this.Name + '</option>'));
                    });

                }
                if (DateTimeFormat.length > 0) {

                    for (var i = 0; i < DateTimeFormat.length; i++) {
                        $("#ui_drpdwn_datetimeformat").append("<option value='" + DateTimeFormat[i].DateTimeColumn + "'>" + DateTimeFormat[i].FrontEndName + "</option>");

                    }
                }
            },
            error: ShowAjaxError
        });
    },
    GetLeadProperties: function () {
        ShowPageLoading();
        $.ajax({
            url: "/ManageContact/SpreadsheetsImportData/GetAllProperty",
            data: JSON.stringify({ 'AccountId': Plumb5AccountId }),
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: SpreadsheetsImportDataUtil.BindLeadProperties,
            error: ShowAjaxError
        });
    },
    BindLeadProperties: function (response) {
        ShowPageLoading();
        if (response != undefined && response != null && response.length > 0) {
            ContactAllPropertyList = response;
            let DropDownValue = `<option attr_datatype="" value="select">Select</option>`;
            $.each(response, function () {
                if (this.DisplayName != 'Stage' && this.DisplayName != 'Handled By')
                    DropDownValue += `<option attr_displayname ="${this.FrontEndName}" attr_datatype="${this.FieldType}" value="${this.P5ColumnName}">${this.FrontEndName} (${this.FieldType})</option>`;
            });
            DropDownValue += `<option attr_displayname="SpreadSheet Lead Date" attr_datatype="DateTime" value="UpdatedDate">Spreadsheet Lead Date</option>`;
            DropDownValue += `<option attr_displayname="Search Keyword"  attr_datatype="string" value="SearchKeyword">Search Keyword</option>`;
            DropDownValue += `<option attr_displayname="Page Url"  attr_datatype="string" value="PageUrl">Page Url</option>`;
            DropDownValue += `<option attr_displayname="Referrer Url" attr_datatype="string" value="ReferrerUrl">Referrer Url</option>`;
            DropDownValue += `<option attr_displayname="IsAdSenseOrAdWord"  attr_datatype="string" value="IsAdSenseOrAdWord">IsAdSenseOrAdWord</option>`;
            DropDownValue += `<option attr_displayname="Place"  attr_datatype="string" value="Place">Place</option>`;
            DropDownValue += `<option attr_displayname="City"  attr_datatype="string" value="CityCategory">City</option>`;
            DropDownValue += `<option attr_displayname="LeadCreatedDate"  attr_datatype="DateTime" value="LeadCreatedDate">LeadCreatedDate</option>`;
            Plumb5FieldsDropdownList = DropDownValue;
            //for (var i = 0; i < 51; i++) {
            //    CloumnDropdownList += `<option value="${i}">Column ${i}</option>`
            //}
            $(".gsdatamapwrap").removeClass("hideDiv");
            SpreadsheetsImportDataUtil.Getlmscustomfields();
            if (SaveUpdate_Action != 'Update') {
                $(".googlesheetmap").click();
                $("#ui_drpdwn_GSC_0").val("0").select2().trigger('change');
                $("#ui_drpdwn_PDC_0").val("UpdatedDate").select2().trigger('change');
            }
            if (SaveUpdate_Action == 'Update') {

                $(".closedatamapcolumns").click();
                dataMapping = 0;
                var MappingFields = Editrealtimes;
                if (MappingFields != null && MappingFields != "") {
                    var _MappingFields = MappingFields.split(',');
                    $.each(JSON.parse(_MappingFields), function (i, obj) {
                        editdatamapping = i;
                        $(".googlesheetmap").click();
                        $("#ui_drpdwn_GSC_" + i).val(obj.Key).select2().trigger('change');
                        $("#ui_drpdwn_PDC_" + i).val(obj.Value).select2().trigger('change');

                    });
                }
                $('.position-relative').scrollTop(0);
            }

            HidePageLoading();
        }
    },
    ValidateGoogleSheetImport: function () {
        if ($("#ui_txt_ConnectionName").val().length == 0) {
            ShowErrorMessage(GlobalErrorList.SpreadsheetsImportData.ConnectionName);
            $("#ui_txt_ConnectionName").focus();
            return false;
        }
        if (SaveUpdate_Action == 'Save') {
            if (ConnectionName.join(',').includes($("#ui_txt_ConnectionName").val())) {
                ShowErrorMessage(GlobalErrorList.SpreadsheetsImportData.Connectionnameexists);
                return false;
            }
        }
        if ($("#ui_txt_SpreadsheetId").val().length == 0) {
            ShowErrorMessage(GlobalErrorList.SpreadsheetsImportData.SpreadsheetId);
            $("#ui_txt_SpreadsheetId").focus();
            return false;
        }

        if ($("#ui_txt_Range").val().length == 0) {
            ShowErrorMessage(GlobalErrorList.SpreadsheetsImportData.Range);
            $("#ui_txt_Range").focus();
            return false;
        }

        if (dataMapping > 0) {
            if (!SpreadsheetsImportDataUtil.ValidateDataMapping())
                return false;
        }
        if (LmsdataMapping > 0) {
            if (!SpreadsheetsImportDataUtil.LmsValidateDataMapping())
                return false;
        }
        if ($("#timezone_offset").val() == "0") {
            ShowErrorMessage(GlobalErrorList.SpreadsheetsImportData.TimeZone);
            return false;
        }

        var gsheettypeval = $("input[name='dataimportType']:checked").val();
        if (gsheettypeval != "Real Time Import") {

            if ($("#ui_drpdwn_GroupName ").val() == "0") {
                ShowErrorMessage(GlobalErrorList.SpreadsheetsImportData.GroupName);
                return false;
            }
        }

        return true;
    },
    ValidateDataMapping: function () {
        for (var i = 0; i < dataMapping; i++) {
            if ($("#ui_drpdwn_GSC_" + i).val() != undefined && $("#ui_drpdwn_GSC_" + i).val() == 'select') {
                ShowErrorMessage(GlobalErrorList.SpreadsheetsImportData.GSC);
                return false;
            }

            if ($("#ui_drpdwn_PDC_" + i).val() != undefined && $("#ui_drpdwn_PDC_" + i).val() == 'select') {
                ShowErrorMessage(GlobalErrorList.SpreadsheetsImportData.PDC);
                return false;
            }
        }
        return true;
    },
    BindLmsSource: function () {
        $.ajax({
            url: "/ManageContact/SpreadsheetsImportData/GetLMSGroupList",
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ 'accountId': Plumb5AccountId }),
            dataType: "json",
            success: function (groupList) {
                contactGroupList = groupList;
                $.each(groupList, function (i) {
                    let option = `<option value='${$(this)[0].Id}'>${$(this)[0].Name}</option>`;
                    $('#Ui_leadsource').append(option);
                });

            },
            error: ShowAjaxError
        });
    },
    ShowDeletePopUp: function (RealtimeID) {

        deleteId = RealtimeID;
    },
    DeleteRealtimeDetails: function () {

        $.ajax({
            url: "/ManageContact/SpreadsheetsImportData/DeleteRealTimeData",
            data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'Id': deleteId }),
            dataType: "json",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataFilter: function (data) { return data; },
            success: function (response) {
                if (response) {
                    SpreadsheetsImportDataUtil.GetLiveSheetDetails('Real Time Import');
                    ShowSuccessMessage(GlobalErrorList.SpreadsheetsImportData.SuccessDeleted);

                }

                else
                    ShowErrorMessage(GlobalErrorList.SpreadsheetsImportData.FailedDelete);


            },
        });
    },
    EditRealtimeDetails: function (Id, APIResponseId, LmsGroupId, OverrideSources, SpreadsheetId, Range, ConnectionName, TimeZone, MappingFields, LmsEditrealtime, Dateformat) {
        $("#realtimeimport").prop("checked", true);
        $("#bulkimportsheet").addClass("hideDiv");
        $("#realtimeimportsheet").removeClass("hideDiv");
        $("#ui_txt_ConnectionName").attr("disabled", true)
        $("#ui_txt_ConnectionName").val(ConnectionName);
        $("ui_check_overridesourcesRealtime")
        $("#ui_txt_Range").val(Range);
        $("#ui_txt_SpreadsheetId").val(SpreadsheetId);
        $("#timezone_offset").val(TimeZone).select2().trigger('change');
        $("#ui_drpdwn_APIIRN").val(APIResponseId).select2().trigger('change');
        $("#ui_drpdwn_datetimeformat").val(Dateformat).select2().trigger('change');
        $("#Ui_leadsource").val(LmsGroupId).select2().trigger('change');
        $("#bulkimport").attr("disabled", true)

        if (OverrideSources == 0)
            $("#lmsStaySource").prop("checked", true);
        else if (OverrideSources == 1)
            $("#lmsOverrideSource").prop("checked", true);
        else if (OverrideSources == 2)
            $("#lmsNewSource").prop("checked", true);
        Editrealtimes = MappingFields.replace('@@', '[{').replace('$', '}]').replaceAll('__', '{').replaceAll('~~', '}').replaceAll('##', '"').replaceAll('**', ':').replaceAll('&&', ',');
        LmsEditrealtimes = LmsEditrealtime.replace('@@', '[{').replace('$', '}]').replaceAll('__', '{').replaceAll('~~', '}').replaceAll('##', '"').replaceAll('**', ':').replaceAll('&&', ',');
        CallGoogleService();
        $("#gstartImprtbtn").html("Update")
        $("#btncancel").html('Back')
        SaveUpdate_Action = 'Update';
        SaveUpdate_Id = Id;

    },
    Refreshspreadsheetdetails: function () {
        $("#ui_txt_ConnectionName").attr("disabled", false);
        $("#ui_txt_ConnectionName").val("");
        $("#ui_txt_SpreadsheetId").val("");
        $("#ui_txt_Range").val("");
        $("#timezone_offset").val("0").select2().trigger('change');
        $("#ui_drpdwn_APIIRN").val("0").select2().trigger('change');
        $("#ui_drpdwn_datetimeformat").val("0").select2().trigger('change');
        $("#ui_drpdwn_GroupName").val("0").select2().trigger('change');
        $("#Ui_leadsource").val("0").select2().trigger('change');
        $("#realtimeimport").prop("checked", false);
        $("#bulkimport").prop("checked", true);
        $("#bulkimport").attr("disabled", false)
        $("#ui_check_overridesourcesRealtime").prop("checked", false);
        $("#realtimeimportsheet").addClass("hideDiv");
        $("#bulkimportsheet").removeClass("hideDiv");
        $(".closedatamapcolumns").click();
        dataMapping = 0;
        $(".gsdatamapwrap").addClass("hideDiv");
        $(".lmsgsdatamapwrap").addClass("hideDiv");
        $("#ui_check_existContacts, #ui_check_removeContacts,#ui_check_retainassignconts,#ui_check_assignindivconts,#ui_check_overridesources,#customCheckMandate,#ui_check_overridesourcesRealtime").prop("checked", false);
        SaveUpdate_Action = 'Save';
        $("#gstartImprtbtn").html("Start Import")
        $("#btncancel").html("Cancel")

        SpreadsheetsImportDataUtil.GetLiveSheetDetails('bulkimport');
    },
    Getlmscustomfields: function () {

        $.ajax({
            url: "/Prospect/Leads/GetLMSCustomFields",
            type: 'POST',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                Lmscustomfielddetails = response;
                let DropDownValue = `<option attr_datatype="" value="select">Select</option>`;
                $.each(response, function () {
                    if (this.DisplayName != 'Stage' && this.DisplayName != 'Handled By')
                        DropDownValue += `<option attr_displayname ="${this.FieldDisplayName}" attr_datatype="${this.FieldName}" value="${this.FieldName}">${this.FieldDisplayName} </option>`;
                });
                LmsFieldsDropdownList = DropDownValue;

                $(".lmsgsdatamapwrap").removeClass("hideDiv");
                if (SaveUpdate_Action != 'Update') {

                    $("#ui_lmsdrpdwn_GSC_0").val("0").select2().trigger('change');
                    $("#ui_lmsdrpdwn_PDC_0").val("UpdatedDate").select2().trigger('change');
                }
                if (SaveUpdate_Action == 'Update') {

                    $(".lmsclosedatamapcolumns").click();
                    LmsdataMapping = 0;
                    var MappingFields = LmsEditrealtimes;
                    if (MappingFields != null && MappingFields != "") {
                        var _MappingFields = MappingFields.split(',');
                        $.each(JSON.parse(_MappingFields), function (i, obj) {
                            editdatamapping = i;
                            $(".lmsgooglesheetmap").click();
                            $("#ui_lmsdrpdwn_GSC_" + i).val(obj.Key).select2().trigger('change');
                            $("#ui_lmsdrpdwn_PDC_" + i).val(obj.Value).select2().trigger('change');

                        });
                    }
                    $('.position-relative').scrollTop(0);
                }

                HidePageLoading();
            }
        });
    },
    LmsValidateDataMapping: function () {
        for (var i = 0; i < dataMapping; i++) {
            if ($("#ui_lmsdrpdwn_GSC_" + i).val() != undefined && $("#ui_lmsdrpdwn_GSC_" + i).val() == 'select') {
                ShowErrorMessage(GlobalErrorList.SpreadsheetsImportData.GSC);
                return false;
            }

            if ($("#ui_lmsdrpdwn_PDC_" + i).val() != undefined && $("#ui_lmsdrpdwn_PDC_" + i).val() == 'select') {
                ShowErrorMessage(GlobalErrorList.SpreadsheetsImportData.PDC);
                return false;
            }
        }
        return true;
    },
};

$("#customCheckMandate").click(function () {
    if (!$("#customCheckMandate").is(":checked")) {
        $("#customCheckMandate, #customCheckMandate2").prop("checked", false);
        $("#gstartImprtbtn").attr("disabled", true);
    }
    else {
        $("#gstartImprtbtn").removeAttr("disabled");
        $("#customCheckMandate, #customCheckMandate2").prop("checked", true);
    }
});

$("#customCheckMandate2").click(function () {
    if (!$("#customCheckMandate2").is(":checked")) {
        $("#customCheckMandate, #customCheckMandate2").prop("checked", false);
        $("#gstartImprtbtn").attr("disabled", true);
    }
    else {
        $("#gstartImprtbtn").removeAttr("disabled");
        $("#customCheckMandate, #customCheckMandate2").prop("checked", true);
    }
});
function CallGoogleService() {
    if ($("#ui_txt_SpreadsheetId").val() == "") {
        ShowErrorMessage(GlobalErrorList.SpreadsheetsImportData.SpreadsheetId);
        return false;
    }
    $(".closedatamapcolumns").click();
    $(".gsdatamapwrap").addClass("hideDiv");
    $(".lmsgsdatamapwrap").addClass("hideDiv");
    dataMapping = 0;
    SpreadsheetsImportDataUtil.GetSpreadsheetsresponses();

}
$("#deleteRowConfirm").click(function () {
    SpreadsheetsImportDataUtil.DeleteRealtimeDetails();
});

$(document).on('click', '#ui_changestatus', function () {
    var id = $(this).attr('att_changestatus');

    $.ajax({
        url: "/ManageContact/SpreadsheetsImportData/ChangeStatusRealTime",
        data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'Id': id }),
        dataType: "json",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataFilter: function (data) { return data; },
        success: function (response) {
            if (response != undefined && response != null) {
                if (response.returnVal) {
                    SpreadsheetsImportDataUtil.GetLiveSheetDetails('Real Time Import');
                    ShowSuccessMessage(GlobalErrorList.SpreadsheetsImportData.SucessStartTrack);

                }
                else {

                    SpreadsheetsImportDataUtil.GetLiveSheetDetails('Real Time Import');
                    ShowSuccessMessage(GlobalErrorList.SpreadsheetsImportData.SucessStopTrack);
                }
            }
            else
                ShowErrorMessage(GlobalErrorList.SpreadsheetsImportData.FailedStopTrack);


        },
    });
});
$('input[id="ui_check_assignindivconts"]').on('click', function (e) {
    let IsAssignUserChecked = $('input[id="ui_check_assignindivconts"]').prop('checked');
    if (IsAssignUserChecked == true) {
        $('#ui_divUserPopUp').modal();
    }
});

$("#ui_btnCloseUserPopUp,#ui_btnTopCloseUserPopUp").click(function () {
    $('input[id="ui_check_assignindivconts"]').prop('checked', false);
    $("#ui_divUserPopUp").modal('hide');
});

$("#bulksaveConfirm").click(function () {
    SpreadsheetsImportDataUtil.SaveSpreadsheetsImportData(spreadsheets);
    return true;
});

$('.strtimpinfo').popover({
    trigger: 'hover',
    placement: 'top'
})
