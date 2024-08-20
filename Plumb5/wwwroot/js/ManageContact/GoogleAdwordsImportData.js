var Editadwords = [];
var LmsEditadwords = [];
var GoogleAdwords = {};
var GoogleAdwordsoptions = `<option value="Select">Select</option>
                                    <option value = "FULL_NAME" > Full Name</option>
                                                    <option value="FIRST_NAME">First Name</option>
                                                    <option value="LAST_NAME">Last Name</option>
                                                    <option value="EMAIL">Email</option>
                                                    <option value="PHONE_NUMBER">Phonenumber</option>
                                                    <option value="POSTAL_CODE">Postalcode</option>
                                                    <option value="COMPANY_NAME">Companyname</option>
                                                    <option value="JOB_TITLE">Jobtitle</option>
                                                    <option value="WORK_EMAIL">Workemail</option>
                                                    <option value="WORK_PHONE">Workphone</option>
                                                    <option value="STREET_ADDRESS">Streetaddress</option>
                                                    <option value="CITY">City</option>
                                                    <option value="REGION">Region</option>
                                                    <option value="COUNTRY">Country</option>
                                                    <option value="VEHICLE_MODEL">Vehiclemodel</option>
                                                    <option value="VEHICLE_TYPE">Vehicletype</option>
                                                    <option value="PREFERRED_DEALERSHIP">Preferred dealership</option>
                                                    <option value="VEHICLE_PURCHASE_TIMELINE">Cehicle purchase timeline</option>
                                                    <option value="VEHICLE_CONDITION">Vehicle condition</option>
                                                    <option value="VEHICLE_OWNERSHIP">Vehicle ownership</option>
                                                    <option value="VEHICLE_PAYMENT_TYPE">Vehicle payment</option>
                                                    <option value="COMPANY_SIZE">Company size</option>
                                                    <option value="ANNUAL_SALES">Annual sales</option>
                                                    <option value="YEARS_IN_BUSINESS">Years in bussiness</option>
                                                    <option value="JOB_DEPARTMENT">Job department</option>
                                                    <option value="JOB_ROLE">Job role</option>
                                                    <option value="EDUCATION_PROGRAM">Education program</option>
                                                    <option value="EDUCATION_COURSE">Education course</option>
                                                    <option value="PRODUCT">Product</option>
                                                    <option value="SERVICE">Service</option>
                                                    <option value="OFFER">Offer</option>
                                                    <option value="CATEGORY">Category</option>
                                                    <option value="PREFERRED_CONTACT_METHOD">Preferred contact method</option>
                                                    <option value="PREFERRED_LOCATION">Preferred location</option>
                                                    <option value="PREFERRED_CONTACT_TIME">Preferred contact time</option>
                                                    <option value="PURCHASE_TIMELINE">Purchase timeline</option>
                                                    <option value="YEARS_OF_EXPERIENCE">Years of experience</option>
                                                    <option value="JOB_INDUSTRY">Job industry</option>
                                                    <option value="LEVEL_OF_EDUCATION">Level of education</option>
                                                    <option value="PROPERTY_TYPE">Property type</option>
                                                    <option value="REALTOR_HELP_GOAL">Realtor help goal</option>
                                                    <option value="PROPERTY_COMMUNITY">Property community</option>
                                                    <option value="PRICE_RANGE">Price range</option>
                                                    <option value="NUMBER_OF_BEDROOMS">Number of bedrooms</option>
                                                    <option value="FURNISHED_PROPERTY">Furnished property</option>
                                                    <option value="PETS_ALLOWED_PROPERTY">Pets allowed property </option>
                                                    <option value="NEXT_PLANNED_PURCHASE">Next planned purchase</option>
                                                    <option value="EVENT_SIGNUP_INTEREST">Event signup interest</option>
                                                    <option value="PREFERRED_SHOPPING_PLACES">Preferred shopping places</option>
                                                    <option value="FAVORITE_BRAND">Favorite brand</option>
                                                    <option value="TRANSPORTATION_COMMERCIAL_LICENSE_TYPE">Transportation commercial license type</option>
                                                    <option value="EVENT_BOOKING_INTEREST">Event booking interest</option>
                                                    <option value="DESTINATION_COUNTRY">Destination country</option>
                                                    <option value="DESTINATION_CITY">Destination city</option>
                                                    <option value="DEPARTURE_COUNTRY">Departure country</option>
                                                    <option value="DEPARTURE_CITY">Departure city</option>
                                                    <option value="DEPARTURE_DATE">Departure date</option>
                                                    <option value="RETURN_DATE">Return date</option>
                                                    <option value="NUMBER_OF_TRAVELERS">Number of travelers</option>
                                                    <option value="TRAVEL_BUDGET">Travel budjet</option>
                                                    <option value="TRAVEL_ACCOMMODATION">Travel accomoomdation</option>`;
$("#close-popup, .clsepopup").click(function () {

    $(this).parents(".popupcontainer").addClass("hideDiv");
    AdwordsImportDataUtil.Refreshgoogleadwordsdetails();
    /* AdwordsImportDataUtil.GetadwordDetails('bulkimport');*/

});
$("#adwordbtncancel").click(function () {
    if ($("#adwordbtncancel").html() != "Back") {
        $(this).parents(".popupcontainer").addClass("hideDiv");
        AdwordsImportDataUtil.Refreshgoogleadwordsdetails();
        AdwordsImportDataUtil.GetadwordDetails();
    }
    else

        AdwordsImportDataUtil.Refreshgoogleadwordsdetails();
});
$('#adwordstimezone_offset, #ui_drpdwn_GroupNameadwords, #ui_drpdwn_APIIRNAdwords').select2({
    minimumResultsForSearch: '',
    dropdownAutoWidth: false,
    containerCssClass: "border"
});
$(document).ready(function () {


});
var editdatamapping = 0;
var getmappingfieldsvalue = [];
var deleteId = 0;
var SaveUpdate_Action = 'Save';
var SaveUpdate_Id = 0;
var Plumb5contactColumns = [];
var LmscustomfieldsColumns = [];
var dataMapping = 0;
var LmsdataMapping = 0;
var AdwordsConnectionName = [];
var Edit_adwords = "";
var ContactImportOverview = {
    GroupId: 0, AssociateContactsToGroup: false, GroupAddSuccessCount: false, OverrideSources: false, OverrideAssignment: false, GroupAddRejectCount: false
}
$(".googleadwordsmap").click(function () {
    //$(document).on("click", ".googleadwordsmap", function () {

    if (dataMapping > 0) {
        if (!AdwordsImportDataUtil.ValidateDataMapping())
            return false;
    }

    var addgoogleadwordsmap = `<div class="datamapcolwraps">
                                    <div id="trsearch" class="row">
                                        <div class="col-md-5 col-lg-5">
                                            <div class="form-group">
                                                <label class="frmlbltxt" for="">Google Adwords</label>
                                                <select name="" id="ui_drpdwn_GAC_${dataMapping}"class="span5 form-control">
                                                  ${GoogleAdwordsoptions}
                                                </select>
                                            </div>
                                        </div>
                                <div class="col-md-5 col-lg-5">
                                    <div class="form-group">
                                        <label class="frmlbltxt" for="">Plumb5 Data Column</label>
                                        <select class="form-control" id="ui_drpdwn_PDCadw_${dataMapping}">
                                            ${Plumb5FieldsDropdownList}
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-2 col-lg-2 d-flex align-items-center justify-content-start p-0">
                                        <i class="icon ion-ios-close-outline closedatamapcolumnsadw"></i>
                                </div>
                                </div>
                                </div>
                                `;

    $(".datamapappndwraps").append(addgoogleadwordsmap);
    $(".closedatamapcolumnsadw").click(function () {
        $(this).parent().parent().remove();

        //dataMapping--; 
    });
    $('#ui_drpdwn_GAC_' + dataMapping + ', #ui_drpdwn_PDCadw_' + dataMapping).select2({
        minimumResultsForSearch: '',
        dropdownAutoWidth: false,
        containerCssClass: "border"
    });

    dataMapping++;
});
$(".lmsgoogleadwordsmap").click(function () {

    if (LmsdataMapping > 0) {
        if (!AdwordsImportDataUtil.LmsValidateDataMapping())
            return false;
    }

    var addgoogleadwordsmap = `<div class="lmsdatamapcolwraps">
                                    <div id="trsearch" class="row">
                                        <div class="col-md-5 col-lg-5">
                                            <div class="form-group">
                                                <label class="frmlbltxt" for="">Google Adwords</label>
                                               <select name="" id="ui_lmsdrpdwn_GAC_${LmsdataMapping}"class="span5 form-control">
                                                   ${GoogleAdwordsoptions}
                                                </select>
                                            </div>
                                        </div>
                                <div class="col-md-5 col-lg-5">
                                    <div class="form-group">
                                <label class="frmlbltxt" for="">Lms Custom Fields</label>
                                <select class="form-control" id="ui_lmsdrpdwn_PDCadw_${LmsdataMapping}">
                                  ${LmsFieldsDropdownList}
                                </select>
                              </div>
                            </div>
                            <div class="col-md-2 col-lg-2 d-flex align-items-center justify-content-start p-0">
                              <i class="icon ion-ios-close-outline lmsclosedatamapcolumnsadw"></i>
                            </div>
                          </div>
                        </div>`;

    $(".lmsdatamapappndwraps").append(addgoogleadwordsmap);
    $(".lmsclosedatamapcolumnsadw").click(function () {
        $(this).parent().parent().remove();

        //dataMapping--; 
    });
    $('#ui_lmsdrpdwn_GAC_' + LmsdataMapping + ', #ui_lmsdrpdwn_PDCadw_' + LmsdataMapping).select2({
        minimumResultsForSearch: '',
        dropdownAutoWidth: false,
        containerCssClass: "border"
    });

    LmsdataMapping++;
});
$("#adwordatartImprtbtn").click(function () {
    if (!AdwordsImportDataUtil.ValidateGoogleSheetImport()) {
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
        if ($.inArray($("#ui_drpdwn_GAC_" + i).val(), plumb5columncheck) > -1) {
            $("#ui_drpdwn_GAC_" + i).focus();
            ShowErrorMessage(GlobalErrorList.GoogleAdwordsImportData.Duplicateheader);
            HidePageLoading();
            return false;
        }
        if ($("#ui_drpdwn_GAC_" + i + " option:selected").val() != undefined && $("#ui_drpdwn_PDCadw_" + i + " option:selected").val() != undefined) {
            filterConditions = `{"Key":"` + $("#ui_drpdwn_GAC_" + i + " option:selected").val() + `", "Value":"` + $("#ui_drpdwn_PDCadw_" + i + " option:selected").val() + `","DataType":"` + $("#ui_drpdwn_PDCadw_" + i + " option:selected").attr("attr_datatype") + `"}`;
            plumb5columncheck.push($("#ui_drpdwn_GAC_" + i + " option:selected").val());
            datamappingdetails.push(filterConditions);
            _Plumb5contactColumns = `` + $("#ui_drpdwn_GAC_" + i + " option:selected").val() + `,` + $("#ui_drpdwn_PDCadw_" + i + " option:selected").val() + `,` + $("#ui_drpdwn_PDCadw_" + i + " option:selected").attr("attr_displayname") + `,` + $("#ui_drpdwn_GAC_" + i + " option:selected").attr("attr_spreadsheetdisplayname") + ``;
            Plumb5contactColumns.push(_Plumb5contactColumns);

        }
    }
    for (var i = 0; i < LmsdataMapping; i++) {
        var filterConditions = '';
        var _LmscustomfieldsColumns = '';
        if ($.inArray($("#ui_lmsdrpdwn_GAC_" + i).val(), lmscolumncheck) > -1) {
            $("#ui_lmsdrpdwn_GAC_" + i).focus();
            ShowErrorMessage(GlobalErrorList.GoogleAdwordsImportData.Duplicateheader);
            HidePageLoading();
            return false;
        }
        if ($("#ui_lmsdrpdwn_GAC_" + i + " option:selected").val() != undefined && $("#ui_lmsdrpdwn_PDCadw_" + i + " option:selected").val() != undefined) {
            filterConditions = `{"Key":"` + $("#ui_lmsdrpdwn_GAC_" + i + " option:selected").val() + `", "Value":"` + $("#ui_lmsdrpdwn_PDCadw_" + i + " option:selected").val() + `"}`;
            lmscolumncheck.push($("#ui_lmsdrpdwn_GAC_" + i + " option:selected").val());
            Lmsdatamappingdetails.push(filterConditions);
            _LmscustomfieldsColumns = `` + $("#ui_lmsdrpdwn_GAC_" + i + " option:selected").val() + `,` + $("#ui_lmsdrpdwn_PDCadw_" + i + " option:selected").val() + `,` + $("#ui_lmsdrpdwn_PDCadw_" + i + " option:selected").attr("attr_displayname") + `,` + $("#ui_lmsdrpdwn_GAC_" + i + " option:selected").attr("attr_spreadsheetdisplayname") + ``;
            LmscustomfieldsColumns.push(_LmscustomfieldsColumns);

        }
    }


    datamappingdetails = datamappingdetails.join(',');
    Lmsdatamappingdetails = Lmsdatamappingdetails.join(',');
    var is_createstayoveride = 0;
    if ($("#lmsStaySourceadwords").is(":checked")) {
        is_createstayoveride = 0;
    }
    else if ($("#lmsOverrideSourceadwords").is(":checked")) {
        is_createstayoveride = 1;
    }
    else if ($("#lmsNewSourceadwords").is(":checked")) {
        is_createstayoveride = 2;
    }
    GoogleAdwords = {};
    GoogleAdwords = {
        Id: 0, UserInfoUserId: Plumb5UserId, Name: $("#ui_txt_ConnectionNameadwords").val(), SpreadsheetId: $("#ui_txt_SpreadsheetId").val(), Range: $("#ui_txt_Range").val(),
        ImportType: $("input[name='dataimportType']:checked").val(), MappingFields: datamappingdetails, LastExcuteDateTime: null, APIResponseId: $("#ui_drpdwn_APIIRNAdwords option:selected").val(),
        ExcutingStatus: 0, Status: true, ErrorMessage: "", TimeZone: $("#adwordstimezone_offset").val(), CreatedDate: null, LmsGroupId: parseInt($("#Ui_leadsourceadwords option:selected").val()), OverrideSources: is_createstayoveride, MappingLmscustomFields: Lmsdatamappingdetails
    };

    ContactImportOverview = { GroupId: $("#ui_drpdwn_GroupNameadwords").val() != undefined ? parseInt($("#ui_drpdwn_GroupNameadwords").val()) : 0, AssociateContactsToGroup: $("#ui_check_existContactsadwords").is(":checked"), GroupAddRejectCount: $("#ui_check_removeContactsadwords").is(":checked") == true?1:0, GroupAddSuccessCount: 0, OverrideSources: $("#ui_check_overridesources").is(":checked"), OverrideAssignment: $("#ui_check_retainassigncontsadwords").is(":checked"), LmsGroupId: parseInt($("#Ui_leadsourceadwords").val()) }

    var SelectedUserList = $('#ui_ddlUserList').val();
    if (SelectedUserList != null) {
        ContactImportOverview.UserIdList = SelectedUserList.join(",");
    }

    AdwordsImportDataUtil.SaveGoogleWordsImportData(GoogleAdwords);


    HidePageLoading();
});
var ContactImportOverview
var ContactAllPropertyList = [], Plumb5FieldsDropdownList = "", CloumnDropdownList = "", Lmscustomfielddetails = [], LmsFieldsDropdownList = "";
var AdwordsImportDataUtil = {
    SaveGoogleWordsImportData: function (GoogleAdwords) {
        ShowPageLoading();
        $.ajax({
            url: "/ManageContact/GoogleAdWords/SaveGoogleadWordsImportData",
            type: 'POST',
            data: JSON.stringify({ 'accountid': Plumb5AccountId, 'GoogleAdwords': GoogleAdwords, 'Plumb5contactColumns': Plumb5contactColumns,  'contactImportOverview': ContactImportOverview, 'Action': SaveUpdate_Action, 'Id': SaveUpdate_Id }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response > 0) {
                    $("#googleadwordapilink").html(googleadwordApi + Plumb5AccountId + "&glid=" + response)
                    AdwordsImportDataUtil.GetadwordDetails();
                    ShowSuccessMessage(GlobalErrorList.GoogleAdwordsImportData.SaveSuccess);
                    HidePageLoading();
                    //location.reload();
                    /*setTimeout(function () { location.reload(); }, 3000);*/
                } else {
                    ShowErrorMessage(GlobalErrorList.GoogleAdwordsImportData.SaveError);
                }
                AdwordsImportDataUtil.Refreshgoogleadwordsdetails();
                /*$(".clsepopup").click();*/

            },
            error: ShowAjaxError
        });
    },
    GetAPIIRN: function () {

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
                        $("#ui_drpdwn_APIIRNAdwords").append($('<option attr_APIIRNname="' + this.Name + '" value="' + this.Name + '" >' + this.Name + '</option>'));
                    });

                }
                //AdwordsImportDataUtil.GetLeadProperties();
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
            success: AdwordsImportDataUtil.BindLeadProperties,
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
            AdwordsImportDataUtil.Getlmscustomfields();
            if (SaveUpdate_Action != 'Update') {
                $(".googleadwordsmap").click();
                $("#ui_drpdwn_GAC_0").val("Select").select2().trigger('change');
                $("#ui_drpdwn_PDCadw_0").val("select").select2().trigger('change');
            }
            if (SaveUpdate_Action == 'Update') {

                $(".closedatamapcolumnsadw").click();
                dataMapping = 0;
                var MappingFields = Editadwords;
                if (MappingFields != null && MappingFields != "") {
                    var _MappingFields = MappingFields.split(',');
                    $.each(JSON.parse(_MappingFields), function (i, obj) {
                        editdatamapping = i;
                        $(".googleadwordsmap").click();
                        $("#ui_drpdwn_GAC_" + i).val(obj.Key).select2().trigger('change');
                        $("#ui_drpdwn_PDCadw_" + i).val(obj.Value).select2().trigger('change');

                    });
                }
                $('.position-relative').scrollTop(0);
            }

            HidePageLoading();
        }
    },
    ValidateGoogleSheetImport: function () {
        if ($("#ui_txt_ConnectionNameadwords").val().length == 0) {
            ShowErrorMessage(GlobalErrorList.GoogleAdwordsImportData.ConnectionName);
            $("#ui_txt_ConnectionNameadwords").focus();
            return false;
        }
        if (SaveUpdate_Action == 'Save') {
            if (AdwordsConnectionName.join(',').includes($("#ui_txt_ConnectionNameadwords").val())) {
                ShowErrorMessage(GlobalErrorList.GoogleAdwordsImportData.Connectionnameexists);
                return false;
            }
        }
        if (dataMapping > 0) {
            if (!AdwordsImportDataUtil.ValidateDataMapping())
                return false;
        }
        if (LmsdataMapping > 0) {
            if (!AdwordsImportDataUtil.LmsValidateDataMapping())
                return false;
        }
        if ($("#adwordstimezone_offset").val() == "0") {
            ShowErrorMessage(GlobalErrorList.GoogleAdwordsImportData.TimeZone);
            return false;
        }
        if ($("#ui_drpdwn_GroupNameadwords ").val() == "0") {
            ShowErrorMessage(GlobalErrorList.GoogleAdwordsImportData.GroupName);
            return false;
        }
        if ($("#Ui_leadsourceadwords ").val() == "0") {
            ShowErrorMessage(GlobalErrorList.GoogleAdwordsImportData.Source);
            return false;
        }

        return true;
    },
    ValidateDataMapping: function () {
        for (var i = 0; i < dataMapping; i++) {
            if ($("#ui_drpdwn_GAC_" + i).val() == undefined || $("#ui_drpdwn_GAC_" + i).val() == 'select') {
                ShowErrorMessage(GlobalErrorList.GoogleAdwordsImportData.GAW);
                return false;
            }

            if ($("#ui_drpdwn_PDCadw_" + i).val() == undefined || $("#ui_drpdwn_PDCadw_" + i).val() == 'select') {
                ShowErrorMessage(GlobalErrorList.GoogleAdwordsImportData.PDC);
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
                    $('#Ui_leadsourceadwords').append(option);
                });

            },
            error: ShowAjaxError
        });
    },
    ShowDeletePopUp: function (AdwordID) {

        deleteId = AdwordID;
    },
    DeleteGAdwordDetails: function () {

        $.ajax({
            url: "/ManageContact/GoogleAdWords/DeleteadwordsData",
            data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'Id': deleteId }),
            dataType: "json",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataFilter: function (data) { return data; },
            success: function (response) {
                if (response) {
                    AdwordsImportDataUtil.GetadwordDetails();
                    ShowSuccessMessage(GlobalErrorList.SpreadsheetsImportData.SuccessDeleted);
                }

                else
                    ShowErrorMessage(GlobalErrorList.SpreadsheetsImportData.FailedDelete);

                AdwordsImportDataUtil.Refreshgoogleadwordsdetails();
            },
        });
    },
    EditGoogleAdwordsDetails: function (Id, APIResponseId, LmsGroupId, OverrideSources, AdwordsConnectionName, TimeZone, MappingFields, Lms_editadwords, GroupId) {
        $("#googleadwordapilink").html(googleadwordApi + Plumb5AccountId + "&glid=" + Id)
        $("#ui_txt_ConnectionNameadwords").attr("disabled", true)
        $("#ui_txt_ConnectionNameadwords").val(AdwordsConnectionName);
        $("#adwordstimezone_offset").val(TimeZone).select2().trigger('change');
        $("#ui_drpdwn_APIIRNAdwords").val(APIResponseId).select2().trigger('change');
        $("#Ui_leadsourceadwords").val(LmsGroupId).select2().trigger('change');
        $("#ui_drpdwn_GroupNameadwords").val(GroupId).select2().trigger('change');
        if (OverrideSources == 0)
            $("#lmsStaySourceadwords").prop("checked", true);
        else if (OverrideSources == 1)
            $("#lmsOverrideSourceadwords").prop("checked", true);
        else if (OverrideSources == 2)
            $("#lmsNewSourceadwords").prop("checked", true);
        Editadwords = MappingFields.replace('@@', '[{').replace('$', '}]').replaceAll('__', '{').replaceAll('~~', '}').replaceAll('##', '"').replaceAll('**', ':').replaceAll('&&', ',');
        LmsEditadwords = Lms_editadwords.replace('@@', '[{').replace('$', '}]').replaceAll('__', '{').replaceAll('~~', '}').replaceAll('##', '"').replaceAll('**', ':').replaceAll('&&', ',');

        $(".closedatamapcolumnsadw").click();
        $(".gsdatamapwrap").addClass("hideDiv");
        $(".lmsgsdatamapwrap").addClass("hideDiv");
        dataMapping = 0;
        LmsdataMapping = 0;
        AdwordsImportDataUtil.GetLeadProperties();
        $("#adwordatartImprtbtn").html("Update")
        $("#adwordbtncancel").html('Back')
        SaveUpdate_Action = 'Update';
        SaveUpdate_Id = Id;

    },
    Refreshgoogleadwordsdetails: function () {
        $("#ui_txt_ConnectionNameadwords").attr("disabled", false);
        $("#ui_txt_ConnectionNameadwords").val("");
        $("#adwordstimezone_offset").val("0").select2().trigger('change');
        $("#ui_drpdwn_APIIRNAdwords").val("0").select2().trigger('change');
        $("#ui_drpdwn_GroupNameadwords").val("0").select2().trigger('change');
        $("#Ui_leadsourceadwords").val("0").select2().trigger('change');
        $("#customCheckMandateadwords").prop("checked", false);
        $("#lmsStaySourceadwords").prop("checked", true);
        $("#lmsOverrideSourceadwords").prop("checked", false);
        $("#lmsNewSourceadwords").prop("checked", false);
        $(".closedatamapcolumnsadw").click();
        dataMapping = 0;
        LmsdataMapping = 0;
        $(".gsdatamapwrap").addClass("hideDiv");
        $(".lmsgsdatamapwrap").addClass("hideDiv");
        $("#ui_check_existContactsadwords, #ui_check_removeContactsadwords,#ui_check_retainassigncontsadwords,#ui_check_assignindivcontsadwords,#ui_check_overridesources,#customCheckMandate,#ui_check_overridesourcesRealtime").prop("checked", false);
        SaveUpdate_Action = 'Save';
        $("#adwordatartImprtbtn").html("Start Import")
        $("#adwordbtncancel").html("Cancel")

        //AdwordsImportDataUtil.GetadwordDetails();
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

                    $("#ui_lmsdrpdwn_GAC_0").val("0").select2().trigger('change');
                    $("#ui_lmsdrpdwn_PDCadw_0").val("UpdatedDate").select2().trigger('change');
                }
                if (SaveUpdate_Action == 'Update') {

                    $(".lmsclosedatamapcolumnsadw").click();
                    LmsdataMapping = 0;
                    var MappingFields = LmsEditadwords;
                    if (MappingFields != null && MappingFields != "") {
                        var _MappingFields = MappingFields.split(',');
                        $.each(JSON.parse(_MappingFields), function (i, obj) {
                            editdatamapping = i;
                            $(".lmsgoogleadwordsmap").click();
                            $("#ui_lmsdrpdwn_GAC_" + i).val(obj.Key).select2().trigger('change');
                            $("#ui_lmsdrpdwn_PDCadw_" + i).val(obj.Value).select2().trigger('change');

                        });
                    }
                    $('.position-relative').scrollTop(0);
                }

                HidePageLoading();
            }
        });
    },
    LmsValidateDataMapping: function () {
        for (var i = 0; i < LmsdataMapping; i++) {
            if ($("#ui_lmsdrpdwn_GAC_" + i).val() == undefined || $("#ui_lmsdrpdwn_GAC_" + i).val() == 'Select') {
                ShowErrorMessage(GlobalErrorList.GoogleAdwordsImportData.GAW);
                return false;
            }

            if ($("#ui_lmsdrpdwn_PDCadw_" + i).val() == undefined || $("#ui_lmsdrpdwn_PDCadw_" + i).val() == 'select') {
                ShowErrorMessage(GlobalErrorList.GoogleAdwordsImportData.LPDC);
                return false;
            }
        }
        return true;
    },
    GetadwordDetails: function () {
        $.ajax({
            url: "/ManageContact/GoogleAdWords/GetadwordsDetails",
            type: 'POST',
            data: JSON.stringify({ 'accountid': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                $("#ui_tbody_LiveSheetDetailsadwords").empty();
                if (response != null && response.length > 0) {
                    let tdContent = ``;
                    AdwordsConnectionName = [];
                    $.each(response, function () {

                        let Adwordsname = "";
                        var changeadwordsstatus = `<td class="text-color-success">Active</td>`;
                        if (this.Status == 0)
                            changeadwordsstatus = `<td class="text-color-error">InActive</td>`;


                        var $Editgoogleadwords = "";
                        var $LmsEditgoogleadwords = "";
                        $Editgoogleadwords = this.MappingFields;
                        if (this.MappingLmscustomFields != null)
                            $LmsEditgoogleadwords = this.MappingLmscustomFields;
                        Adwordsname = `<td>
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
                                                <a class="dropdown-item"
                                                    href="javascript:void(0)" id="ui_changestatusadw" att_changestatusadw=${this.Id}>Change Status</a>
                                                <a class="dropdown-item"
                                                    href="javascript:void(0)" onclick='AdwordsImportDataUtil.EditGoogleAdwordsDetails("${this.Id}","${this.APIResponseId}","${this.LmsGroupId}","${this.OverrideSources}","${this.Name}","${this.TimeZone}","${$Editgoogleadwords.replace('[{', '@@').replace('}]', '$').replace(/['"]+/g, '##').replace(/,/g, '&&').replace(/:\s*/g, "**").replace('{', "__").replace('}', "~~")}","${$LmsEditgoogleadwords.replace('[{', '@@').replace('}]', '$').replace(/['"]+/g, '##').replace(/,/g, '&&').replace(/:\s*/g, "**").replace('{', "__").replace('}', "~~")}","${this.GroupId}");'>Edit</a>
                                                <a class="dropdown-item"
                                                 href="javascript:void(0)" onclick='copyToClipboard("${this.Id}");'>Copy to clipboard</a>

                                                  <div class="dropdown-divider"></div>
                                                <a data-toggle="modal"
                                                    data-target="#deletegroups" id="ui_deletedata"
                                                    data-grouptype="groupDelete"
                                                    class="dropdown-item"
                                                    href="javascript:void(0)" onclick="AdwordsImportDataUtil.ShowDeletePopUp(${this.Id});">Delete</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </td>`

                        AdwordsConnectionName.push(this.Name)
                        tdContent += `<tr>
                                    ${Adwordsname}
                                    ${changeadwordsstatus}
                                    <td>${$.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(this.CreatedDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(this.CreatedDate))}</td>
                                </tr>`;
                    });

                    $("#ui_tbody_LiveSheetDetailsadwords").append(tdContent);
                } else {
                    $("#ui_tbody_LiveSheetDetailsadwords").append(`<tr><td colspan="3" class="border-bottom-0"><div class="no-data ">There is no data for this view.</div></td></tr>`);
                }
            },
            error: ShowAjaxError
        });
    },
};

$("#customCheckMandate").click(function () {
    if (!$("#customCheckMandate").is(":checked")) {
        $("#customCheckMandate, #customCheckMandateadwords").prop("checked", false);
        $("#adwordatartImprtbtn").attr("disabled", true);
    }
    else {
        $("#adwordatartImprtbtn").removeAttr("disabled");
        $("#customCheckMandate, #customCheckMandateadwords").prop("checked", true);
    }
});

$("#customCheckMandateadwords").click(function () {
    if (!$("#customCheckMandateadwords").is(":checked")) {
        $("#customCheckMandate, #customCheckMandateadwords").prop("checked", false);
        $("#adwordatartImprtbtn").attr("disabled", true);
    }
    else {
        $("#adwordatartImprtbtn").removeAttr("disabled");
        $("#customCheckMandate, #customCheckMandateadwords").prop("checked", true);
    }
});
$("#deleteRowConfirm").click(function () {
    AdwordsImportDataUtil.DeleteGAdwordDetails();
});


$('input[id="ui_check_assignindivcontsadwords"]').on('click', function (e) {
    let IsAssignUserChecked = $('input[id="ui_check_assignindivcontsadwords"]').prop('checked');
    if (IsAssignUserChecked == true) {
        $('#ui_divUserPopUp').modal();
    }
});

$("#ui_btnCloseUserPopUp,#ui_btnTopCloseUserPopUp").click(function () {
    $('input[id="ui_check_assignindivcontsadwords"]').prop('checked', false);
    $("#ui_divUserPopUp").modal('hide');
});

$("#bulksaveConfirm").click(function () {
    AdwordsImportDataUtil.SaveGoogleWordsImportData(GoogleAdwords);
    return true;
});

$('.strtimpinfo').popover({
    trigger: 'hover',
    placement: 'top'
})

$(document).on('click', '#ui_changestatusadw', function () {
    var id = $(this).attr('att_changestatusadw');

    $.ajax({
        url: "/ManageContact/GoogleAdWords/ChangeStatusadwords",
        data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'Id': id }),
        dataType: "json",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataFilter: function (data) { return data; },
        success: function (response) {
            if (response != undefined && response != null) {
                if (response.returnVal) {
                    AdwordsImportDataUtil.GetadwordDetails();
                    ShowSuccessMessage(GlobalErrorList.SpreadsheetsImportData.SucessStartTrack);

                }
            }
            else
                ShowErrorMessage(GlobalErrorList.SpreadsheetsImportData.FailedStopTrack);
            AdwordsImportDataUtil.Refreshgoogleadwordsdetails();

        },
    });
});
function copyToClipboard(value) {
    //$("#googleadwordapilink").html(googleadwordApi + Plumb5AccountId + "&glid=" + Id)
    var tempInput = document.createElement("input");
    tempInput.style = "position: absolute; left: -1000px; top: -1000px";
    tempInput.value = googleadwordApi + Plumb5AccountId + "&glid=" + value;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
}