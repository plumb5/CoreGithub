////var filterLead = {
////    UserInfoUserId: 0, OrderBy: -1, StartDate: "", EndDate: "", Score: -1, LmsGroupIdList: "", UserIdList: "", FollowUpUserIdList: "", GroupId: 0, FormId: 0, EmailId: "", PhoneNumber: "", Name: "", LastName: "", Address1: "", Address2: "", StateName: "", Country: "", ZipCode: "",
////    Age: "", Gender: "", MaritalStatus: "", Education: "", Occupation: "", Interests: "", Location: "", Religion: "", CompanyName: "", CompanyWebUrl: "", DomainName: "", CompanyAddress: "", Projects: "", LeadLabel: "", Remarks: "",
////    CustomField1: "", CustomField2: "", CustomField3: "", CustomField4: "", CustomField5: "", CustomField6: "", CustomField7: "", CustomField8: "", CustomField9: "", CustomField10: "",
////    CustomField11: "", CustomField12: "", CustomField13: "", CustomField14: "", CustomField15: "", CustomField16: "", CustomField17: "", CustomField18: "", CustomField19: "", CustomField20: "",
////    CustomField21: "", CustomField22: "", CustomField23: "", CustomField24: "", CustomField25: "", CustomField26: "", CustomField27: "", CustomField28: "", CustomField29: "", CustomField30: "",
////    CustomField31: "", CustomField32: "", CustomField33: "", CustomField34: "", CustomField35: "", CustomField36: "", CustomField37: "", CustomField38: "", CustomField39: "", CustomField40: "",
////    CustomField41: "", CustomField42: "", CustomField43: "", CustomField44: "", CustomField45: "", CustomField46: "", CustomField47: "", CustomField48: "", CustomField49: "", CustomField50: "",
////    CustomField51: "", CustomField52: "", CustomField53: "", CustomField54: "", CustomField55: "", CustomField56: "", CustomField57: "", CustomField58: "", CustomField59: "", CustomField60: "",
////    SearchKeyword: "", PageUrl: "", ReferrerUrl: "", IsAdSenseOrAdWord: "", Place: "", CityCategory: "", CustomField61: "", CustomField62: "", CustomField63: "", CustomField64: "", CustomField65: "",
////    CustomField66: "", CustomField67: "", CustomField68: "", CustomField69: "", CustomField70: "", CustomField71: "", CustomField72: "", CustomField73: "", CustomField74: "", CustomField75: "", CustomField76: "",
////    CustomField77: "", CustomField78: "", CustomField79: "", CustomField80: "", CustomField81: "", CustomField82: "", CustomField83: "", CustomField84: "", CustomField85: "", CustomField86: "", CustomField87: "", CustomField88: "",
////    CustomField89: "", CustomField90: "", CustomField91: "", CustomField92: "", CustomField93: "", CustomField94: "", CustomField95: "", CustomField96: "", CustomField97: "", CustomField98: "", CustomField99: "", CustomField100: ""
////};

function getFilterLeadObject() {
    let filterLeadobject = {
        UserInfoUserId: 0, OrderBy: -1, StartDate: "", EndDate: "", Score: -1, LmsGroupIdList: "", UserIdList: "", FollowUpUserIdList: "", GroupId: 0, FormId: 0, EmailId: "", PhoneNumber: "", Name: "", LastName: "", Address1: "", Address2: "", StateName: "", Country: "", ZipCode: "",
        Age: "", Gender: "", MaritalStatus: "", Education: "", Occupation: "", Interests: "", Location: "", Religion: "", CompanyName: "", CompanyWebUrl: "", DomainName: "", CompanyAddress: "", Projects: "", LeadLabel: "", Remarks: "",
        CustomField1: "", CustomField2: "", CustomField3: "", CustomField4: "", CustomField5: "", CustomField6: "", CustomField7: "", CustomField8: "", CustomField9: "", CustomField10: "",
        CustomField11: "", CustomField12: "", CustomField13: "", CustomField14: "", CustomField15: "", CustomField16: "", CustomField17: "", CustomField18: "", CustomField19: "", CustomField20: "",
        CustomField21: "", CustomField22: "", CustomField23: "", CustomField24: "", CustomField25: "", CustomField26: "", CustomField27: "", CustomField28: "", CustomField29: "", CustomField30: "",
        CustomField31: "", CustomField32: "", CustomField33: "", CustomField34: "", CustomField35: "", CustomField36: "", CustomField37: "", CustomField38: "", CustomField39: "", CustomField40: "",
        CustomField41: "", CustomField42: "", CustomField43: "", CustomField44: "", CustomField45: "", CustomField46: "", CustomField47: "", CustomField48: "", CustomField49: "", CustomField50: "",
        CustomField51: "", CustomField52: "", CustomField53: "", CustomField54: "", CustomField55: "", CustomField56: "", CustomField57: "", CustomField58: "", CustomField59: "", CustomField60: "",
        SearchKeyword: "", PageUrl: "", ReferrerUrl: "", IsAdSenseOrAdWord: null, Place: "", CityCategory: "", CustomField61: "", CustomField62: "", CustomField63: "", CustomField64: "", CustomField65: "",
        CustomField66: "", CustomField67: "", CustomField68: "", CustomField69: "", CustomField70: "", CustomField71: "", CustomField72: "", CustomField73: "", CustomField74: "", CustomField75: "", CustomField76: "",
        CustomField77: "", CustomField78: "", CustomField79: "", CustomField80: "", CustomField81: "", CustomField82: "", CustomField83: "", CustomField84: "", CustomField85: "", CustomField86: "", CustomField87: "", CustomField88: "",
        CustomField89: "", CustomField90: "", CustomField91: "", CustomField92: "", CustomField93: "", CustomField94: "", CustomField95: "", CustomField96: "", CustomField97: "", CustomField98: "", CustomField99: "", CustomField100: "",
        LmsCustomField1: "", LmsCustomField2: "", LmsCustomField3: "", LmsCustomField4: "", LmsCustomField5: "",
        LmsCustomField6: "", LmsCustomField7: "", LmsCustomField8: "", LmsCustomField9: "", LmsCustomField10: "",
        LmsCustomField11: "", LmsCustomField12: "", LmsCustomField13: "", LmsCustomField14: "", LmsCustomField15: ""
    };

    return filterLeadobject;
}

var LmseEditFollowupNotesContactID = 0;
var LmseEditFollowupNotesName = "";
var LmseEditFollowupNotesEmailId = "";
var LmseEditFollowupNotesUserinfouserid = 0;
var LmseEditLmsGroupId = 0;
var LmseEditLmsGroupMemberId = 0;
var LmseEditFollowupScore = 0;
var LmseEditFollowupLeadLabel = 0;
var filterLead = getFilterLeadObject();
var headerflag = false;
var noOfColumns = 7; var IsCheckBoxRequired = false;
var propertynames = [];

var LmsPermissionlevelSeniorUserID = 0;
var LmsPermissionlevelUserinfoID = [];
var leadswithsameagentandgroup = [];
var editfollowupnotespopup = 0;
var createandupdatebuttondisable = false;
var Adminuser = 0;
$(document).ready(function () {
    $('body').stickyHScroll();
});

var LeadReportBindingUtil = {
    //Get MaxCount of the Lead
    GetMaxCount: function () {
        filterLead.UserInfoUserId = parseInt(filterLead.UserInfoUserId);
        filterLead.OrderBy = parseInt(filterLead.OrderBy);
        filterLead.Score = parseInt(filterLead.Score);
        filterLead.GroupId = parseInt(filterLead.GroupId);
        filterLead.FormId = parseInt(filterLead.FormId);
        filterLead.IsAdSenseOrAdWord = parseInt(filterLead.IsAdSenseOrAdWord == '' ? null : filterLead.IsAdSenseOrAdWord);
        filterLead.UserInfoUserId = parseInt(filterLead.UserInfoUserId); 
        $(".mainpanel").addClass("lmsreportwid");
        SetNoRecordContent('ui_tblReportData', noOfColumns, 'ui_tbodyReportData');
        console.log(filterLead);
        $.ajax({
            url: "/Prospect/Leads/GetMaxCount",
            type: 'POST',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'filterLead': filterLead }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                TotalRowCount = result;
                if (TotalRowCount > 0) {
                    //LeadReportBindingUtil.Getlmscustomfields();
                    LeadReportBindingUtil.Getlmsheaderflag();

                }

                else
                    HidePageLoading();

                if (window.location.href.toLowerCase().indexOf("/prospect/followups") > 0)
                    $("#ui_span_FollowUpsCount").html(TotalRowCount);
            },
            error: ShowAjaxError
        });
    },
    Getlmsheaderflag: function () {
        $.ajax({
            url: "/Prospect/Leads/GetLMSHeaderFlag",
            type: 'POST',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                headerflag = result
                if (result) {
                    ShowPageLoading();

                    LeadReportBindingUtil.GetPropertySetting();
                }

                else {
                    ShowPageLoading();
                    propertynames = [];
                    LeadReportBindingUtil.BindPropertySetting(result);
                    LeadReportBindingUtil.GetReport();
                }

            },
            error: ShowAjaxError
        });
    },
    GetPropertySetting: function () {
        ShowPageLoading();
        $.ajax({
            url: "/Prospect/Leads/GetPropertySetting",
            data: JSON.stringify({ 'AccountId': Plumb5AccountId }),
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: LeadReportBindingUtil.BindPropertySetting,
            error: ShowAjaxError
        });
    },
    BindPropertySetting: function (response) {
        ShowPageLoading();
        propertynames = [];
        PropertySettingList = null;
        SetNoRecordContent('ui_tableReport', 3, 'ui_tbodyReportData');
        if (response != undefined && response != null && response.length > 0 && response != false) {
            PropertySettingList = response;
            $("#ui_tableReport").removeClass('no-data-records');
            $("#ui_tbodyReportData").html('');
            $("#ui_trheadReportData").empty();
            let checkboxheaderstatic = ``;
            if (!window.location.pathname.includes('/Prospect/Reports/MyReports'))
                IsCheckBoxRequired = true;
            if (IsCheckBoxRequired) {
                checkboxheaderstatic = ` <th id="dv_CheckBox" class="td-wid-5 m-p-w-40 header-sticky" scope="col">
                                            <div class="custom-control custom-checkbox">
                                            <input type="checkbox" class="custom-control-input selchbxall" id="contacts_check" name="example1">
                                            <label class="custom-control-label" for="contacts_check"></label>
                                            </div>
                                            </th>
`
            }

            let labelClassSticky = "header-sticky head-2-sticky";
            if (!IsCheckBoxRequired)
                labelClassSticky = "header-sticky";

            let reportTableheaderstatic = `<th class="m-p-w-120 td-wid-100px ${labelClassSticky}">
                                            <div class="sortWrap">                                            
                                            </div>
                                            Label
                                            </th>`;

            let reportTableheader = "";
            let lastheaderstatic = `
                                            <th class=" m-p-w-190 td-wid-150px" scope="col">
                                            Stage
                                            </th>

                                            <th class="m-p-w-190 td-wid-190px" scope="col">
                                            <div class="sortWrap">
                                            <i class="icon ion-arrow-down-c addColor"></i>
                                            </div>
                                            Last Updated Date
                                            </th>`
            var positionsofleadscolumns = 0;
            for (let i = 0; i < response.length; i++) {
                if (response[i].DisplayName != "Source")
                    propertynames.push(response[i]);

                if (response[i].DisplayName != "Handled By" && response[i].DisplayName != "Source") {

                    var lmscustmfieldname = "";
                    var _lmscustmfieldname = JSLINQ(Lmscustomfielddetails).Where(function () {
                        return (this.Position == response[i].PropertyName);
                    });

                    let headerSticky3Class = IsCheckBoxRequired == false ? "header-sticky head-2-sticky" : "header-sticky head-3-sticky";

                    var width = i == 0 ? "td-wid-20" : "td-wid-18"; //m-p-w-190 td-wid-190px

                    if (i == 0) {
                        reportTableheader += "<th scope='col' class='m-p-w-220 td-wid-250px " + headerSticky3Class + "'><div class='sortWrap'><i class='icon ion-arrow-down-c addColor'></i></div>" + response[i].DisplayName + "</th>";
                        positionsofleadscolumns++;
                        if (_lmscustmfieldname.items[0] != null && _lmscustmfieldname.items[0] != "" && _lmscustmfieldname.items[0] != undefined) {
                            for (var _lmscustomfield = 0; _lmscustomfield < _lmscustmfieldname.items.length; _lmscustomfield++) {
                                positionsofleadscolumns++;

                                if (_lmscustomfield == 2) {
                                    reportTableheader += lastheaderstatic;
                                    positionsofleadscolumns++;
                                }
                                reportTableheader += "<th scope='col' class='m-p-w-190 td-wid-190px'><div class='sortWrap'><i class='icon ion-arrow-down-c addColor'></i></div>" + _lmscustmfieldname.items[_lmscustomfield].FieldDisplayName + "</th>";

                                var obj = {};
                                obj["PropertyName"] = _lmscustmfieldname.items[_lmscustomfield]["FieldName"];
                                propertynames.push(obj);
                            }
                        }

                    }

                    else {
                        if (positionsofleadscolumns == 3)
                            reportTableheader += lastheaderstatic;
                        positionsofleadscolumns++;
                        reportTableheader += "<th scope='col' class='m-p-w-190 td-wid-190px'><div class='sortWrap'><i class='icon ion-arrow-down-c addColor'></i></div>" + response[i].DisplayName + "</th>";
                        if (positionsofleadscolumns == 3)
                            reportTableheader += lastheaderstatic;

                        if (_lmscustmfieldname.items[0] != null && _lmscustmfieldname.items[0] != "" && _lmscustmfieldname.items[0] != undefined) {
                            for (var _lmscustomfield = 0; _lmscustomfield < _lmscustmfieldname.items.length; _lmscustomfield++) {
                                reportTableheader += "<th scope='col' class='m-p-w-190 td-wid-190px'><div class='sortWrap'><i class='icon ion-arrow-down-c addColor'></i></div>" + _lmscustmfieldname.items[_lmscustomfield].FieldDisplayName + "</th>";

                                positionsofleadscolumns++;
                                if (positionsofleadscolumns == 3) {
                                    reportTableheader += lastheaderstatic;
                                    positionsofleadscolumns++;
                                }

                                var obj = {};
                                obj["PropertyName"] = _lmscustmfieldname.items[_lmscustomfield]["FieldName"];
                                propertynames.push(obj);
                            }
                        }


                    }
                }
                //if (i == 2)
                //    break;
            }

            //propertynames = response 
            ShowPageLoading();
            var adddynamiccolumnnames = checkboxheaderstatic + reportTableheaderstatic + reportTableheader;

            var finaltable = adddynamiccolumnnames;
            $("#ui_trheadReportData").append("<tr>" + finaltable + "</tr>");
            $("#ui_trbodyReportData").empty();

            LeadReportBindingUtil.GetReport();
        }
        else {
            ShowPageLoading();
            $("#ui_tableReport").removeClass('no-data-records');
            $("#ui_tbodyReportData").html('');
            $("#ui_trheadReportData").empty();
            let checkboxheaderstatic = ``;
            if (IsCheckBoxRequired) {
                checkboxheaderstatic = ` <th id="dv_CheckBox" class="td-wid-5 m-p-w-40 header-sticky" scope="col">
                                            <div class="custom-control custom-checkbox">
                                            <input type="checkbox" class="custom-control-input selchbxall" id="contacts_check" name="example1">
                                            <label class="custom-control-label" for="contacts_check"></label>
                                            </div>
                                            </th>
`
            }
            let reportTableheaderstatic = `
                                            
                                <th class="m-p-w-120 td-wid-8">
                                    
                                    Label
                                    
                                </th>
                                <th class="m-p-w-220 td-wid-22">
                                    
                                    Name
                                    
                                </th>
                                <th class="m-p-w-190 td-wid-20" scope="col">
                                    
                                    Email
                                    
                                </th>
                                <th class="m-p-w-190 td-wid-12" scope="col">
                                    
                                    Phone Number
                                    
                                </th>
                                <th class="m-p-w-160 td-wid-13" scope="col">
                                    Stage
                                    
                                </th>
                                <th class="m-p-w-190 td-wid-20" scope="col">
                                   
                                    Last Updated Date
                                    
                                </th>`
            $("#ui_trheadReportData").append("<tr>" + checkboxheaderstatic + reportTableheaderstatic + "</tr>");
            $("#ui_trbodyReportData").empty();

            GetToolTipData();
            BindToolTipData();
            GetRuleToolTipData();
        }
        if (IsCheckBoxRequired)
            LeadReportBindingUtil.Intializeselectcheckboxheader();
        InitiateSorting();
        HidePageLoading();
    },
    //Get Leads
    GetReport: function () {
        ShowPageLoading();
        FetchNext = GetNumberOfRecordsPerPage();
        $.ajax({
            url: "/Prospect/Leads/GetReport",
            type: 'POST',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'filterLead': filterLead, 'OffSet': OffSet, 'FetchNext': FetchNext }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            success: LeadReportBindingUtil.BindReport,
            error: ShowAjaxError
        });
    },
    //Binding the leads based on report
    BindReport: function (responsedata) {
        var response = responsedata.Data;
        SetNoRecordContent('ui_tblReportData', noOfColumns, 'ui_tbodyReportData');
        if (response["Data"] != undefined && response["Data"] != null) {
            CurrentRowCount = response["Data"].length;
            if (response["Notice"].length > 0) {
                LmsPermissionlevelSeniorUserID = response["Notice"][0].SeniorUserId;
                LmsPermissionlevelUserinfoID = response["Notice"];
            }
            PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);
            var reportTableTrs = "";

            let increment = 1;
            $.each(response["Data"], function () {
                reportTableTrs += "<tr id='ui_div_" + this.LmsGroupmemberId + "' >" + LeadReportBindingUtil.BindingContent(this, increment) + "</tr>";

                increment++;
            });
            $("#ui_tblReportData").removeClass('no-data-records');
            $("#ui_tbodyReportData").html(reportTableTrs);
            ShowExportDiv(true);
            ShowPagingDiv(true);
            $('.searchCampWrap').show();
            LmsDefaultFunctionUtil.InitialiseActionsTabClick();
            LmsDefaultFunctionUtil.InitialiseActionsClick();
            LmsDefaultFunctionUtil.RowCheckboxClick();
        }
        else {
            $('.searchCampWrap').hide();
            ShowExportDiv(false);
            ShowPagingDiv(false);
        }
        HidePageLoading();
        CheckAccessPermission("Prospect");
    },
    //Getting binding content
    BindingContent: function (response) {
        var Name = "";
        var column1value = "";
        var NameStartingLetter = "NA";
        if (response.Name != null && response.Name != "" && response.Name.length > 0) {
            Name = response.Name.includes("'") ? response.Name.replace(/'/g, "&lsquo;") : response.Name;
            column1value = response.Name.includes("'") ? response.Name.replace(/'/g, "&lsquo;") : response.Name;
            //if (Name.length > 25)
            //    Name = Name.substring(0, 25) + "..";
            NameStartingLetter = Name.charAt(0);


        }
        var _stagetab = ``;
        var _handlebytab = ``;
        var _labeltab = ``;
        var _completetab = ``;
        var _followuptab = ``;
        var _userinfouserd = response.UserInfoUserId
        var checkboxlabel = ``;
        var _senioruserid = JSLINQ(LmsPermissionlevelUserinfoID).Where(function () {
            return (this.UserInfoUserId == _userinfouserd);
        });

        var _senioruseridvalue = 0;
        var _mainuseridvalue = 0;
        if (_senioruserid.items[0] != null && _senioruserid.items[0] != "" && _senioruserid.items[0] != undefined) {
            _senioruseridvalue = _senioruserid.items[0]["SeniorUserId"];
            _mainuseridvalue = _senioruserid.items[0]["MainUserId"];
        }
        editfollowupnotespopup = 0;
        var permission = {
            IsEmailViewPermission: true, IsSmsViewPermission: true, IsCallViewPermission: true,
            IsWhatsAppViewPermission: true
        };
        var _editmailsmshistorytab = `<div class="leadediticonwrp">
                <span title="Manage Lead" class="EditLead" data-lmspopupswindcont="lmseditlead" data-lmspopuswind="Manage Lead"  onclick='LeadReportBindingUtil.EditFollowUpNoteDetails(${response.LmsGroupmemberId},${response.ContactId},"${Name}","${response.EmailId}",${response.UserInfoUserId},${response.LmsGroupId},${editfollowupnotespopup},${response.Score},"${response.LeadLabel}");' class="lmspopuslftwind"><i class="fa fa-edit"></i></span>
                  <span title="Lead History" data-lmspopupswindcont="lmshistory" data-lmspopuswind="History" onclick='LeadHistory.History(${response.ContactId},"${Name}",${response.UserInfoUserId});'  class="lmspopuslftwind"><i class="fa fa-history"></i></span>
                 </div>`;
        //Checking to give access permission

        if (Plumb5UserId == response.UserInfoUserId || _senioruseridvalue != 0 || _senioruseridvalue == _mainuseridvalue) {
            permission = {
                IsEmailViewPermission: false, IsSmsViewPermission: false, IsCallViewPermission: false,
                IsWhatsAppViewPermission: false
            };
            if (Adminuser == 0)
                Adminuser = _mainuseridvalue;
            editfollowupnotespopup = 1;
            checkboxlabel = `<input type='checkbox' class='custom-control-input selChk' id='lmscontact_${response.LmsGroupmemberId}' lmscontactids='${response.ContactId}' value='${response.LmsGroupmemberId}' lmscontactuseridgroupid='${response.ContactId}_${response.LmsGroupId}_${response.UserInfoUserId}' lmsgroupids='${response.LmsGroupId}'><label class='custom-control-label' for='lmscontact_${response.LmsGroupmemberId}'></label>`

            _stagetab = `<div class='verticnwrplead lmschangestage' onclick='LeadsReportDetailsUtil.AssignSingleStageModalShow(${response.ContactId},${response.Score},${response.Revenue},"${response.ClouserDate}","${response.LmsGroupId}","${response.LmsGroupmemberId}","${response.LmsGroupName}","${response.UserInfoUserId}","${editfollowupnotespopup}","${response.EmailId}","${response.PhoneNumber}");' ><span class='icon ion-android-more-vertical lmschangestage ContributePermission'></span></div>`;
            _handlebytab = `<i id='ui_i_LeadAgent_${response.LmsGroupmemberId}' class='ion ion-ios-compose-outline lmshandlednamedrp' onclick='LeadsReportDetailsUtil.AssignSingleLeadModalShow(${response.ContactId},${response.UserInfoUserId},${response.LmsGroupmemberId},${response.LmsGroupId});'></i>`;
            _labeltab = "<span onclick=\"LeadsReportDetailsUtil.AssignSingleLabelModalShow(" + response.ContactId + ",'Select'," + response.LmsGroupId + "," + response.LmsGroupmemberId + "," + response.UserInfoUserId + ");\" class='icon ion-android-more-vertical lmseditlabel ContributePermission'></span>";
            _completetab = `<span title="Completed Follow-Up" data-lmspopupswindcont="lmsveiwfollowdet" onclick ='LeadsReportDetailsUtil.ShowFollowUpCompletedConfirmationBox(${response.ContactId},${response.UserInfoUserId},${response.LmsGroupmemberId});' data-lmspopuswind="Completed Follow-Up" class=""><i class="fa fa-check-square"></i></span>`;
            _followuptab = `<span onclick='LeadsReportDetailsUtil.ViewFollowUp(${response.ContactId},"${Name}","${response.EmailId}","${response.LmsGroupmemberId}");' title="View Follow-Up" data-lmspopupswindcont="lmsveiwfollowdet" data-lmspopuswind="View Follow-Up" class="lmspopuslftwind"><i class="fa fa-file-text-o"></i></span>`;
            _editmailsmshistorytab = `<div class="leadediticonwrp">
                <span title="Manage Lead" class="EditLead" data-lmspopupswindcont="lmseditlead" data-lmspopuswind="Manage Lead"  onclick='LeadReportBindingUtil.EditFollowUpNoteDetails(${response.LmsGroupmemberId},${response.ContactId},"${Name}","${response.EmailId}",${response.UserInfoUserId},${response.LmsGroupId},${editfollowupnotespopup},${response.Score},"${response.LeadLabel}");' class="lmspopuslftwind"><i class="fa fa-edit"></i></span>
                 <span title="Send Mail" class="SendMail" data-lmspopupswindcont="lmssendmail" data-lmspopuswind="Send Mail" onclick='SendMailToContactUtil.SendMail(${response.ContactId},${response.LmsGroupId},${response.LmsGroupmemberId},${response.UserInfoUserId},${response.Score},"${response.Publisher}","${response.LeadLabel}");' class="lmspopuslftwind"><i class="fa fa-envelope-o"></i></span>
                <span title="Make Call"  class="MakeaCall" data-lmspopupswindcont="lmsclicktocall" data-lmspopuswind="Make Call"  onclick='SendCallToContactUtil.SendCall(${response.ContactId},${response.PhoneNumber},${response.UserInfoUserId},${response.LmsGroupmemberId},${response.LmsGroupId},${response.Score},"${response.LeadLabel}","${response.Publisher}");'  data-lmspopuswind='Send SMS'  class="lmspopuslftwind"><i class="fa fa-phone"></i></span>
                <span title="Send SMS"  class="SendSms" data-lmspopupswindcont="lmssendsms" data-lmspopuswind="Send SMS" onclick ='SendSMSToContactUtil.SendSms(${response.ContactId},${response.LmsGroupId},${response.LmsGroupmemberId},${response.UserInfoUserId},${response.Score},"${response.Publisher}","${response.LeadLabel}");' class="lmspopuslftwind"><i class="fa fa-commenting-o"></i></span>
                <span title="Send WhatsApp"  class="SendWhatsApp" data-lmspopupswindcont="lmssendsms" data-lmspopuswind="Send WhatsApp" onclick ='SendWhatsAppToContactUtil.SendWhatsApp(${response.ContactId},${response.LmsGroupId},${response.LmsGroupmemberId},${response.UserInfoUserId},${response.Score},"${response.Publisher}","${response.LeadLabel}");' class="lmspopuslftwind"><i class="fa fa-whatsapp"></i></span>
                <span title="Lead History" data-lmspopupswindcont="lmshistory" data-lmspopuswind="History" onclick='LeadHistory.History(${response.ContactId},"${Name}",${response.UserInfoUserId});'  class="lmspopuslftwind"><i class="fa fa-history"></i></span>
                <span title="Delete" class="DeleteLead" onclick='LeadsReportDetailsUtil.DeleteModalShow(${response.LmsGroupmemberId},${response.UserInfoUserId});'  class="lmsuserdelpopus"><i class="fa fa-trash-o"></i></span>
                </div>`;
        }
        //Checking if checkbox column is required

        var checkboxdetails;
        if (IsCheckBoxRequired) {

            checkboxdetails = `<td class="column-sticky">
                    <div class='custom-control custom-checkbox'>
                      ${checkboxlabel} 

                    </div>
                    </td>`;
        }

        //Lead label status binding
        let labelClassSticky = "column-sticky col-2-sticky";
        if (!IsCheckBoxRequired)
            labelClassSticky = "column-sticky";


        var LabelStatusValue = "<td id='lblStatus_" + response.LmsGroupmemberId + "' class='text-center " + labelClassSticky + "'><div id='ui_div_lblStatus_" + response.LmsGroupmemberId + "' class='lmslblwrp'><span></span>" + _labeltab + "</div></td>";
        if (response.LeadLabel != null && response.LeadLabel != "" && response.LeadLabel.length > 0) {
            if (response.LeadLabel.toLowerCase() == "hot")
                LabelStatusValue = "<td id='lblStatus_" + response.LmsGroupmemberId + "' class='text-center " + labelClassSticky + "'><div id='ui_div_lblStatus_" + response.LmsGroupmemberId + "' class='lmslblwrp'><span class='lmslabelhot'>" + response.LeadLabel + "</span>" + _labeltab + "</div></td>";
            else if (response.LeadLabel.toLowerCase() == "warm")
                LabelStatusValue = "<td id='lblStatus_" + response.LmsGroupmemberId + "_" + response.LmsGroupId + "' class='text-center " + labelClassSticky + "'><div id='ui_div_lblStatus_" + response.LmsGroupmemberId + "' class='lmslblwrp'><span class='lmslabelwarm'>" + response.LeadLabel + "</span>" + _labeltab + "</div></td>";
            else if (response.LeadLabel.toLowerCase() == "cold")
                LabelStatusValue = "<td id='lblStatus_" + response.LmsGroupmemberId + "_" + response.LmsGroupId + "' class='text-center " + labelClassSticky + "'><div id='ui_div_lblStatus_" + response.LmsGroupmemberId + "' class='lmslblwrp'><span class='lmslabelcold'>" + response.LeadLabel + "</span>" + _labeltab + "</div></td>";
        }

        //Trimming the name if length is greater than 25


        //Binding UCP and it's corresponding onclick function
        var UCP = response.IsNewLead == 1 ? `LeadsReportDetailsUtil.UpdateLeadSeen(${response.ContactId},"${Name}");` : `ShowContactUCP("","",${response.ContactId},${JSON.stringify(permission)});`;
        //Checking if New tag required or not
        var isNewLead = response.IsNewLead == 1 ? `<sup class='newtext'>New</sup>` : ``;
        //Getting lead handledby name
        var leadUserName = ((response.UserName == null) ? LmsDefaultFunctionUtil.GetAgentNameByUserId(response.UserInfoUserId) : (response.UserName.length > 30) ? `${response.UserName.substring(0, 30)}..` : `${response.UserName}`);
        var leadEmailId = ((response.EmailId == null) ? `` : (response.EmailId.length > 25) ? `${response.EmailId.substring(0, 25)}..` : `${response.EmailId}`);
        var leadPhoneNumber = ((response.PhoneNumber == null) ? `` : (response.PhoneNumber.length > 25) ? `${response.PhoneNumber.substring(0, 25)}..` : `${response.PhoneNumber}`);

        var stage = response.Score;
        var sample = JSLINQ(StageList).Where(function () {
            return (this.Score == stage);
        });


        var stagestyle = ``, StageName = ``;
        if (sample.items[0] != null && sample.items[0] != "" && sample.items[0] != undefined) {
            StageName = `${sample.items[0].Stage}`;
            stagestyle = "style='background-color:" + sample.items[0].IdentificationColor + "; color:" + getReadableForeColor(sample.items[0].IdentificationColor) + ";'";
        }

        var lmsgroupid = response.LmsGroupId;
        var sourcesample = JSLINQ(SourceList).Where(function () {
            return (this.LmsGroupId == lmsgroupid);
        });

        var SourceName = ``;
        if (sourcesample.items[0] != null && sourcesample.items[0] != "" && sourcesample.items[0] != undefined) {
            SourceName = `${sourcesample.items[0].Name}`;
        }

        var createdDate = $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(response.CreatedDate)) + ' ' + PlumbTimeFormat(GetJavaScriptDateObj(response.CreatedDate));

        var updatedDate = response.UpdatedDate != null ? $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(response.UpdatedDate)) + ' ' + PlumbTimeFormat(GetJavaScriptDateObj(response.UpdatedDate)) : 'NA';

        var reminderDate = response.ReminderDate != null ? $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(response.ReminderDate)) + ' ' + PlumbTimeFormat(GetJavaScriptDateObj(response.ReminderDate)) : 'NA';
        var followupdate = response.FollowUpDate != null ? $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(response.FollowUpDate)) + ' ' + PlumbTimeFormat(GetJavaScriptDateObj(response.FollowUpDate)) : 'NA';
        var Clouserdate = response.ClouserDate != null ? $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(response.ClouserDate)) : 'NA';
        var followUpStatusCss = response.FollowUpStatus != null && response.FollowUpStatus == 1 ? `` : response.FollowUpStatus != null && response.FollowUpStatus == 3 ? `text-danger` : response.FollowUpStatus != null && response.FollowUpStatus == 2 ? `text-success` : `text-secondary`;

        var SourceMovedIdentification = "";
        if (response.IsSourceMoved != undefined && response.IsSourceMoved != null && response.IsSourceMoved) {
            SourceMovedIdentification = `<i id='ui_i_LeadSourceMoved_${response.ContactId}' class='ion ion-ios-shuffle lmsshuffle lmspopuslftwind' title='Source Moved' onclick='LeadHistory.History(${response.ContactId},"${Name}"${response.UserInfoUserId});'></i>`;
        }
        var Fromthirdcolumvalues = ``;

        if (propertynames.length == 0) {
            Fromthirdcolumvalues = `<td  id='ui_txtEmail_${response.ContactId}'>${leadEmailId}</td><td>${leadPhoneNumber}</td>
                <td class='text-center'><div id='ui_div_LeadStage_${response.LmsGroupmemberId}' class='lmslblwrp'><span class='lmslblstage' ${stagestyle} id='ui_txtStage_${response.ContactId}'>${StageName}</span>${_stagetab}</div>
                <div id='ui_div_LeadStagerevenue_${response.LmsGroupmemberId}'class="revenuewrap text-left mt-2">
                <p class="m-0 viewreminddate text-secondary text-left">Revenue : ${response.Revenue}</p>
                <small class="m-0 viewreminddate text-secondary text-left">Closure Date: ${Clouserdate}</small>
                </div></td>
                <td><p id='ui_p_UpdatedDate_${response.LmsGroupmemberId}' class ="m-0">${updatedDate}</p>
                <small id='ui_small_ViewDate_${response.ContactId}' class ="m-0 viewreminddate ${followUpStatusCss}">Created / Reminder / Follow-up<i class ="icon ion-calendar ml-1"></i><div class ="dashtooltipwrp"><div class ="dashtooltiptit">Created / Reminder / Follow Up</div><div class ="dashtooltipbody"><p class ="m-1 font-12"><b>Created: </b>${createdDate}</p><p id='ui_p_ReminderDate_${response.ContactId}' class ="m-1 font-12"><b>Reminder: </b>${reminderDate}</p><p id='ui_p_FollowUpDate_${response.ContactId}' class ="m-1 font-12"><b>Follow-Up: </b>${followupdate}</p></div></div></small>
                <div class="leadediticonwrp">
                ${_followuptab}
                ${_completetab}
                </div></td>`
        }
        else {
            var columnvalues = "";
            for (var i = 1; i < propertynames.length; i++) {

                if (propertynames[i].PropertyName != "UserInfoUserId") {
                    column1value = response[propertynames[0].PropertyName] == null ? `NA` : response[propertynames[0].PropertyName];

                    if (propertynames[i].PropertyName == "Name" && response[propertynames[i].PropertyName] != null)
                        columnvalues = response[propertynames[i].PropertyName].includes("'") ? response[propertynames[i].PropertyName].replace(/'/g, "&lsquo;") : response[propertynames[i].PropertyName];
                    else if (propertynames[i].PropertyName == "PhoneNumber" && response[propertynames[i].PropertyName] != null)
                        columnvalues = ((response[propertynames[i].PropertyName] == null) ? `` : (response[propertynames[i].PropertyName].length > 25) ? `${response[propertynames[i].PropertyName].substring(0, 25)}..` : `${response[propertynames[i].PropertyName]}`);
                    else if (propertynames[i].PropertyName == "EmailId" && response[propertynames[i].PropertyName] != null)
                        columnvalues = ((response[propertynames[i].PropertyName] == null) ? `` : (response[propertynames[i].PropertyName].length > 25) ? `${response[propertynames[i].PropertyName].substring(0, 25)}..` : `${response[propertynames[i].PropertyName]}`);

                    else if (response[propertynames[i].PropertyName] != null && response[propertynames[i].PropertyName] != "" && response[propertynames[i].PropertyName].length > 0) {
                        if (response[propertynames[i].PropertyName].includes("Date"))
                            columnvalues = $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(response[propertynames[i].PropertyName]))
                        else
                            columnvalues = response[propertynames[i].PropertyName] == null || response[propertynames[i].PropertyName] == "" ? 'NA' : response[propertynames[i].PropertyName]
                    }
                    else

                        columnvalues = response[propertynames[i].PropertyName] == null || response[propertynames[i].PropertyName] == "" ? 'NA' : response[propertynames[i].PropertyName]


                    if (i == 3) {
                        Fromthirdcolumvalues += `
                <td class='text-center'><div id='ui_div_LeadStage_${response.LmsGroupmemberId}' class='lmslblwrp'><span class='lmslblstage' ${stagestyle} id='ui_txtStage_${response.ContactId}'>${StageName}</span>${_stagetab}</div>
                <div id='ui_div_LeadStagerevenue_${response.LmsGroupmemberId}'class="revenuewrap text-left mt-2">
                <p class="m-0 viewreminddate text-secondary text-left">Revenue : ${response.Revenue}</p>
                <small class="m-0 viewreminddate text-secondary text-left">Closure Date: ${Clouserdate}</small>
                </div></td>
                <td><p id='ui_p_UpdatedDate_${response.LmsGroupmemberId}' class ="m-0">${updatedDate}</p>
                <small id='ui_small_ViewDate_${response.LmsGroupmemberId}' class ="m-0 viewreminddate ${followUpStatusCss}">Created / Reminder / Follow-up<i class ="icon ion-calendar ml-1"></i><div class ="dashtooltipwrp"><div class ="dashtooltiptit">Created / Reminder / Follow Up</div><div class ="dashtooltipbody"><p class ="m-1 font-12"><b>Created: </b>${createdDate}</p><p id='ui_p_ReminderDate_${response.LmsGroupmemberId}' class ="m-1 font-12"><b>Reminder: </b>${reminderDate}</p><p id='ui_p_FollowUpDate_${response.LmsGroupmemberId}' class ="m-1 font-12"><b>Follow-Up: </b>${followupdate}</p></div></div></small>
                <div class="leadediticonwrp">
                   ${_followuptab}
                ${_completetab}
                </div></td>
                <td  id='ui_txtEmail_${response.ContactId}'>${columnvalues}</td>`

                    }
                    else {

                        if (isNaN(columnvalues)) {
                            if (columnvalues.includes('https') || columnvalues.includes('http'))
                                Fromthirdcolumvalues += `<td  class='nameTxt'  id='ui_txtEmail_${response.ContactId}'><a>${columnvalues}</a> <a href="${columnvalues}" target="_blank" title="Click to open the page in a new tab"><i class="icon ion-android-open"></i></a></a></td>`
                            else
                                Fromthirdcolumvalues += `<td   id='ui_txtEmail_${response.ContactId}'>${columnvalues}</td>`
                        }

                        else
                            Fromthirdcolumvalues += `<td   id='ui_txtEmail_${response.ContactId}'>${columnvalues}</td>`
                    }

                }
            }
        }

        let IsRepeatLead;
        if (response.RepeatLeadCount != undefined && response.RepeatLeadCount != null && response.RepeatLeadCount > 0)
            IsRepeatLead = `<span class='nameAlpha repeatlead' title='Repeat Lead' onclick='${UCP}'>${NameStartingLetter}</span>`;
        else
            IsRepeatLead = `<span class='nameAlpha' onclick='${UCP}'>${NameStartingLetter}</span>`;
        leadswithsameagentandgroup.push(response.ContactId + "_" + response.LmsGroupId + "_" + response.UserInfoUserId);

        var sticky = IsCheckBoxRequired == false ? "col-2-sticky" : "col-3-sticky";
        var content;
        if (column1value.includes('https') || column1value.includes('http')) {
            content = `${checkboxdetails}${LabelStatusValue}
                <td class='text-left h-100 column-sticky ${sticky}'><div class='lmsactiondrpdwn'><div class='nameWrap'><div class='nameAlpWrap'>
                ${IsRepeatLead}</div>
                       <div id='ui_div_ContactName_${response.ContactId + "_" + response.LmsGroupId}' userid='${response.UserInfoUserId}' class='nameTxtWrap'><span class='nameTxt'>${column1value} <a href="${column1value}" target="_blank" title="Click to open the page in a new tab"><i class="icon ion-android-open"></i></a></a> </span>${isNewLead}</div></div>
                    </div><div class='lmsactiontabcont hideDiv'><div class='list-group'>
                <a data-lmspopupswindcont='lmssendmail' onclick='SendMailToContactUtil.SendMail(${response.ContactId},${response.LmsGroupId},${response.LmsGroupmemberId},${response.UserInfoUserId},${response.Score},"${response.Publisher}","${response.LeadLabel}");' data-lmspopuswind='Send Mail' href='javascript:void(0);' class='list-group-item list-group-item-action lmspopuslftwind ContributePermission SendMail' ><i class='fa fa-envelope'></i>Send Mail</a>
                <a data-lmspopupswindcont='lmssendsms' onclick ='SendSMSToContactUtil.SendSms(${response.ContactId},${response.LmsGroupId},${response.LmsGroupmemberId},${response.UserInfoUserId},${response.LmsGroupmemberId},${response.LmsGroupId},${response.Score},"${response.LeadLabel}");' data-lmspopuswind='Send SMS' href='javascript:void(0);' class='list-group-item list-group-item-action lmspopuslftwind ContributePermission SendSms' ><i class='fa fa-comment'></i>Send SMS</a>
                <a data-lmspopupswindcont='lmsclicktocall' onclick='SendCallToContactUtil.SendCall(${response.ContactId},${response.PhoneNumber},${response.UserInfoUserId},${response.LmsGroupmemberId},${response.LmsGroupId},${response.Score},"${response.LeadLabel}");' data-lmspopuswind='Make Call' href='javascript:void(0);' class='list-group-item list-group-item-action lmspopuslftwind ContributePermission MakeaCall'><i class='fa fa-phone'></i>Make Call</a>
                </div></div></div></div></div></div></div><div class='lmshandledwrp pt-1'>
                <small class='text-color-queued font-11 mr-2'>Handled By: </small>
                <p class='mb-0 text-bold'></p>
				<div id='ui_div_LeadAgent_${response.LmsGroupmemberId}'  class='text-truncate w-100pc' title='${leadUserName}'>${leadUserName}</div>
                ${_handlebytab}
				 ${SourceMovedIdentification}
                </div>
                <div class="sourcewraplms">
                <small class="text-color-queued font-11 mr-2">Sources: <span class="text-color">${SourceName}</span></small>
                </div>
               ${_editmailsmshistorytab}
                </td>${Fromthirdcolumvalues}`;
            return content;
        }
        else {
            content = `${checkboxdetails}${LabelStatusValue}
                <td class='text-left h-100 column-sticky ${sticky}'><div class='lmsactiondrpdwn'><div class='nameWrap'><div class='nameAlpWrap'>
                ${IsRepeatLead}</div>
                <div id='ui_div_ContactName_${response.ContactId + "_" + response.LmsGroupId}' userid='${response.UserInfoUserId}' class='nameTxtWrap'><span class='nameTxt'>${column1value}</span>${isNewLead}</div></div>
                 </div><div class='lmsactiontabcont hideDiv'><div class='list-group'>
                <a data-lmspopupswindcont='lmssendmail' onclick='SendMailToContactUtil.SendMail(${response.ContactId},${response.LmsGroupId},${response.LmsGroupmemberId},${response.UserInfoUserId},${response.Score},"${response.Publisher}","${response.LeadLabel}");' data-lmspopuswind='Send Mail' href='javascript:void(0);' class='list-group-item list-group-item-action lmspopuslftwind ContributePermission SendMail' ><i class='fa fa-envelope'></i>Send Mail</a>
                <a data-lmspopupswindcont='lmssendsms' onclick ='SendSMSToContactUtil.SendSms(${response.ContactId},${response.LmsGroupId},${response.LmsGroupmemberId},${response.UserInfoUserId},${response.LmsGroupmemberId},${response.Score},"${response.Publisher}","${response.LeadLabel}");' data-lmspopuswind='Send SMS' href='javascript:void(0);' class='list-group-item list-group-item-action lmspopuslftwind ContributePermission SendSms' ><i class='fa fa-comment'></i>Send SMS</a>
                <a data-lmspopupswindcont='lmsclicktocall' onclick='SendCallToContactUtil.SendCall(${response.ContactId},${response.PhoneNumber},${response.UserInfoUserId},${response.LmsGroupmemberId},${response.LmsGroupId},${response.Score},"${response.LeadLabel}");' data-lmspopuswind='Make Call' href='javascript:void(0);' class='list-group-item list-group-item-action lmspopuslftwind ContributePermission MakeaCall'><i class='fa fa-phone'></i>Make Call</a>
                </div></div></div></div></div></div></div><div class='lmshandledwrp pt-1'>
                <small class='text-color-queued font-11 mr-2'>Handled By: </small>
                <p class='mb-0 text-bold'></p>
				<div id='ui_div_LeadAgent_${response.LmsGroupmemberId}'  class='text-truncate w-100pc' title='${leadUserName}'>${leadUserName}</div>
                ${_handlebytab}
				 ${SourceMovedIdentification}
                </div>
                <div class="sourcewraplms">
                <small class="text-color-queued font-11 mr-2">Sources: <span class="text-color">${SourceName}</span></small>
                </div>
               ${_editmailsmshistorytab}
                </td>${Fromthirdcolumvalues}`;
            return content;
        }
    },


    Intializeselectcheckboxheader: function () {
        if (window.location.href.toLowerCase().indexOf("/prospect/followups") > 0) {
            $(".selchbxall").click(function () {
                FollowUpsGeneralFunction.SelectAllCheckBoxClick();
            });
        }
        else {
            $(".selchbxall").click(function () {
                LeadsUtil.SelectAllCheckBoxClick();
            });
        }

    },
    EditFollowUpNoteDetails: function (LmsGroupmemberId, Contactid, Name, Emailid, Userinfouserid, LmsGroupId, permissionstatus, score, leadlabel) {
        LmseEditLmsGroupMemberId = LmsGroupmemberId;
        LmseEditFollowupNotesContactID = Contactid;
        LmseEditFollowupNotesName = Name;
        LmseEditFollowupNotesEmailId = Emailid;
        LmseEditFollowupNotesUserinfouserid = Userinfouserid;
        LmseEditLmsGroupId = LmsGroupId;
        LmseEditFollowupScore = score;
        LmseEditFollowupLeadLabel = leadlabel;
        editfollowupnotespopup = permissionstatus;
        $(".lmsedittabitem ").removeClass("active");
        $("#tabLead").addClass("active");
        $(".editlmstabscont").addClass("hideDiv");
        $("#editleadtabscontent").removeClass("hideDiv");

        $('.LeadTab').addClass("hideDiv");
        $(".lmsedittabwrap").removeClass("hideDiv");
        $("#div_EditFollowupNote").removeClass("hideDiv");


        if (Contactid == 0) {
            $("#dvSource").removeClass("hideDiv");
            $("#ui_divContactPopUp").removeClass("hideDiv");
            $('#ui_btn_SubmitCreateContact').attr("BindType", "NEW");
            $('#ui_btn_SubmitCreateContact').removeAttr("disabled");
            $("#ui_divContactPopUp,#dv_AddFollowUp,#dv_LmsNotesNew").css({ "margin-top": "55px", "background": "transparent" });
        }
        else {
            $("#dvSource").addClass("hideDiv");
            $('#mainTab').html("Manage Lead");
            $("#ui_div_" + LmsGroupmemberId).addClass("activeBgRow");
            LeadsReportDetailsUtil.EditLeadDetails(Contactid, LmsGroupId);
            $(".popupsubtitle").html($("#ui_smallContactPopUpSubTitle").text());
            $("#ui_divContactPopUp,#dv_AddFollowUp,#dv_LmsNotesNew").css({ "margin-top": "90px", "background": "transparent" });

        }

    },

    GetPermissionuserid: function () {
        ShowPageLoading();
        FetchNext = GetNumberOfRecordsPerPage();
        $.ajax({
            url: "/Prospect/Leads/GetPermissionlevelUsers",
            type: 'POST',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            success: LeadReportBindingUtil.BindReport,
            error: ShowAjaxError
        });
    },
};


$(document).on('click', "#close-popup,#btnCancel", function () {
    ContactManageUtil.CloseCreateContactPopUp();
    $("#div_EditFollowupNote").addClass("hideDiv");
});

$(document).on('click', ".lmsedittabitem", function () {
    let lmsedittabname = $(this).attr("data-lmsedittab");
    $(".lmsedittabitem").removeClass("active");
    $(this).addClass("active");
    $(".editlmstabscont").addClass("hideDiv");
    $("#" + lmsedittabname).removeClass("hideDiv");
    if (lmsedittabname == "editleadtabscontent" && LmseEditFollowupNotesContactID != 0) {
        LeadsReportDetailsUtil.EditLeadDetails(LmseEditFollowupNotesContactID, 0);
    }
    if (lmsedittabname == "lmsaddfollowup")
        LeadsReportDetailsUtil.ShowAddFollowUpPopUp(LmseEditFollowupNotesContactID, LmseEditFollowupNotesName, LmseEditFollowupNotesEmailId, LmseEditFollowupNotesUserinfouserid, LmseEditFollowupScore, LmseEditFollowupLeadLabel)
    if (lmsedittabname == "lmsaddnotes") {
        LeadsReportDetailsUtil.ShowLMSNotesPopUp(LmseEditFollowupNotesContactID, LmseEditFollowupNotesName, LmseEditFollowupNotesEmailId);
    }
});

