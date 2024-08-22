var ignoreProperties = ["Score", "LeadLabel", "EmailId", "PhoneNumber"];

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
        SearchKeyword: "", PageUrl: "", ReferrerUrl: "", IsAdSenseOrAdWord: "", Place: "", CityCategory: "", CustomField61: "", CustomField62: "", CustomField63: "", CustomField64: "", CustomField65: "",
        CustomField66: "", CustomField67: "", CustomField68: "", CustomField69: "", CustomField70: "", CustomField71: "", CustomField72: "", CustomField73: "", CustomField74: "", CustomField75: "", CustomField76: "",
        CustomField77: "", CustomField78: "", CustomField79: "", CustomField80: "", CustomField81: "", CustomField82: "", CustomField83: "", CustomField84: "", CustomField85: "", CustomField86: "", CustomField87: "", CustomField88: "",
        CustomField89: "", CustomField90: "", CustomField91: "", CustomField92: "", CustomField93: "", CustomField94: "", CustomField95: "", CustomField96: "", CustomField97: "", CustomField98: "", CustomField99: "", CustomField100: "",
        LmsCustomField1: "", LmsCustomField2: "", LmsCustomField3: "", LmsCustomField4: "", LmsCustomField5: "",
        LmsCustomField6: "", LmsCustomField7: "", LmsCustomField8: "", LmsCustomField9: "", LmsCustomField10: "",
        LmsCustomField11: "", LmsCustomField12: "", LmsCustomField13: "", LmsCustomField14: "", LmsCustomField15: "", Publisher: "", PrimaryPublisher: ""
    };

    return filterLeadobject;
}
var noOfColumns = 6;
var filterLead = getFilterLeadObject();
var StageList = new Array();
var Lmscustomfielddetails = [];
var IsMaskRequired = true;
var Publishertype = 1;
$(document).ready(function () { 
    
    LeadpublisherReportUtil.Getlmscustomfields();
    setTimeout(ShowPageLoading(), 3000);
    ExportFunctionName = "LeadsPublisherExport";
    $("#ui_printscreen").addClass("hideDiv");
    LeadpublisherReportUtil.GetFilterByPublisherColumn();
    setTimeout(GetUTCDateTimeRange(2), 3000); 
});

function CallBackFunction() {
    ShowPageLoading();
    TotalRowCount = 0;
    CurrentRowCount = 0;
    LeadpublisherReportUtil.GetMaxCount();

}

$(".tap-nav-link").click(function () {
    $('.tap-nav-link').removeClass('active');
    if ($(this).html() == "Primary Leads") {
        Publishertype = 2;
        $(this).addClass('active');
        SearchBoxUtil.ResetValues(); 
    }

    else if ($(this).html() == "Secondary Leads") {
        Publishertype = 3;
        $(this).addClass('active');
        SearchBoxUtil.ResetValues();
       
    }

    else {
        Publishertype = 1;
        $(this).addClass('active');
        SearchBoxUtil.ResetValues();
        
    }
   
    //LeadpublisherReportUtil.GetMaxCount();
});

function CallBackPaging() {
    ShowPageLoading();
    CurrentRowCount = 0;
    LeadpublisherReportUtil.GetReport();
}
var LeadpublisherReportUtil = {
    //Get MaxCount of the Lead
    GetMaxCount: function () {
        ShowPageLoading();
        SetNoRecordContent('ui_tblReportData', noOfColumns, 'ui_tbodyReportData');
        //filterLead[controllerDocumentations.split('~')[1]] = controllerDocumentations.split('~')[2];
        filterLead["Publisher"] = controllerDocumentations.split('~')[1];
        filterLead["PrimaryPublisher"] = controllerDocumentations.split('~')[1];;
        filterLead["OrderBy"] = "CreatedDate";
        filterLead["StartDate"] = FromDateTime;
        filterLead["EndDate"] = ToDateTime;
        IsMaskRequired = controllerDocumentations.split('~')[2]
        if (controllerDocumentations.length > 0) {
            $.ajax({
                url: "/Prospect/Publisher/GetMaxCount",
                type: 'POST',
                data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'filterLead': filterLead, 'publishertype': Publishertype }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (result) {
                    TotalRowCount = result;
                    $('#spnCount').html(TotalRowCount);
                    if (TotalRowCount > 0) {
                        LeadpublisherReportUtil.GetPropertySetting();

                        ShowExportDiv(true);
                        ShowPagingDiv(true);

                    }

                    else {
                        ShowExportDiv(false);
                        ShowPagingDiv(false);
                        SetNoRecordContent('ui_tableReport', 6, 'ui_tbodyReportData');
                        HidePageLoading();
                    }

                },
                error: ShowAjaxError
            });
        }
        else {
            HidePageLoading();
        }

    },
    //Get Leads
    GetReport: function () {
        ShowPageLoading();
        FetchNext = GetNumberOfRecordsPerPage();
        $.ajax({
            url: "/Prospect/Publisher/GetReport",
            type: 'POST',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'filterLead': filterLead, 'OffSet': OffSet, 'FetchNext': FetchNext, 'IsMaskRequired': IsMaskRequired, 'publishertype': Publishertype }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            success: LeadpublisherReportUtil.BindReport,
            error: ShowAjaxError
        });
    },
    //Binding the leads based on report
    BindReport: function (response) {
        SetNoRecordContent('ui_tableReport', 6, 'ui_trbodyReportData');

        if (response != undefined && response != null && response.length > 0) {
            CurrentRowCount = response.length;
            PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);
            var reportTableTrs = "";
            for (var i = 0; i < response.length; i++) {
                reportTableTrs += "<tr id='ui_div_" + response[i].LmsGroupmemberId + "' >" + LeadpublisherReportUtil.BindingContent(response[i], i) + "</tr>";
            };
            ShowExportDiv(true);
            ShowPagingDiv(true);
            $("#ui_tableReport").removeClass('no-data-records');
            $("#ui_tbodyReportData").html(reportTableTrs);
            HidePageLoading();


        }
        else {
            HidePageLoading();
            $("#ui_tableReport").addClass('no-data-records');
            SetNoRecordContent('ui_tableReport', 6, 'ui_tbodyReportData');
        }


    },
    BindingContent: function (response) {
        var Name = "";
        var column1value = "";
        var NameStartingLetter = "NA";
        if (response.Name != null && response.Name != "" && response.Name.length > 0) {
            Name = response.Name.includes("'") ? response.Name.replace(/'/g, "&lsquo;") : response.Name;
            column1value = response.Name.includes("'") ? response.Name.replace(/'/g, "&lsquo;") : response.Name;

            NameStartingLetter = Name.charAt(0);
        }
        var lmsgroupid = response.LmsGroupId;
        var sourcesample = JSLINQ(SourceList).Where(function () {
            return (this.LmsGroupId == lmsgroupid);
        });

        var SourceName = `NA`;
        if (sourcesample.items[0] != null && sourcesample.items[0] != "" && sourcesample.items[0] != undefined) {
            SourceName = `${sourcesample.items[0].Name}`;
        }
        //Lead label status binding 
        let labelClassSticky = "column-sticky";
        var LabelStatusValue = "<td  class='text-center " + labelClassSticky + "'></td>";
        if (response.LeadLabel != null && response.LeadLabel != "" && response.LeadLabel.length > 0) {
            if (response.LeadLabel.toLowerCase() == "hot")
                LabelStatusValue = "<td ' class='text-center " + labelClassSticky + "'><div   class='lmslblwrp'><span class='lmslabelhot'>" + response.LeadLabel + "</span> </div></td>";
            else if (response.LeadLabel.toLowerCase() == "warm")
                LabelStatusValue = "<td  class='text-center " + labelClassSticky + "'><div class='lmslblwrp'><span class='lmslabelwarm'>" + response.LeadLabel + "</span> </div></td>";
            else if (response.LeadLabel.toLowerCase() == "cold")
                LabelStatusValue = "<td   class='text-center " + labelClassSticky + "'><div   class='lmslblwrp'><span class='lmslabelcold'>" + response.LeadLabel + "</span> </div></td>";
        }

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

        var createdDate = $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(response.CreatedDate)) + ' ' + PlumbTimeFormat(GetJavaScriptDateObj(response.CreatedDate));

        var Fromthirdcolumvalues = ``;

        if (propertynames.length == 0) {
            Fromthirdcolumvalues = `<td >${leadEmailId}</td><td>${leadPhoneNumber}</td>  
                <td><p class ="m-0">${updatedDate}</p>
                 </td>`
        }
        else {
            var columnvalues = "";
            for (var i = 1; i < propertynames.length; i++) {

                if (propertynames[i].PropertyName != "UserInfoUserId" && propertynames[i].PropertyName != "LeadLabel") {
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
                    else if (propertynames[i].PropertyName == "LmsGroupId" && response[propertynames[i].PropertyName] != null)
                        columnvalues = SourceName;
                    else if (propertynames[i].PropertyName == "Score" && response[propertynames[i].PropertyName] != null) {
                        columnvalues = StageName;

                    }

                    else

                        columnvalues = response[propertynames[i].PropertyName] == null || response[propertynames[i].PropertyName] == "" ? 'NA' : response[propertynames[i].PropertyName]

                    if (isNaN(columnvalues)) {
                        if (columnvalues.includes('https') || columnvalues.includes('http'))
                            Fromthirdcolumvalues += `<td  class='nameTxt'><a>${columnvalues}</a> <a href="${columnvalues}" target="_blank" title="Click to open the page in a new tab"><i class="icon ion-android-open"></i></a></a></td>`
                        else if (propertynames[i].PropertyName == "Score" && response[propertynames[i].PropertyName] != null) {
                            Fromthirdcolumvalues += ` 
                                    <td class='text-center'><div id='ui_div_LeadStage_${response.LmsGroupmemberId}' class='lmslblwrp'><span class='lmslblstage' ${stagestyle} id='ui_txtStage_${response.ContactId}'>${StageName}</span></div>
                                    </td>`
                        }
                        else
                            Fromthirdcolumvalues += `<td >${columnvalues}</td>`


                    }

                    else
                        Fromthirdcolumvalues += `<td >${columnvalues}</td>`

                }
            }
        }

        var sticky = "col-2-sticky";
        var content;
        if (column1value.includes('https') || column1value.includes('http')) {
            content = `${LabelStatusValue}
                <td class='text-left h-100 column-sticky ${sticky}'> 
                       <div class='nameTxtWrap'><span class='nameTxt'>${column1value} <a href="${column1value}" target="_blank" title="Click to open the page in a new tab"><i class="icon ion-android-open"></i></a>  </span></div></div>
                     
                </td>`;
            return content;
        }
        else {
            content = `${LabelStatusValue}
                <td class='text-left h-100 column-sticky ${sticky}'><div class='lmsactiondrpdwn'><div class='nameWrap'>
                <div  class='nameTxtWrap'><span class='nameTxt'>${column1value}</span> </div> 
                 
                </td>${Fromthirdcolumvalues}`;
            return content;
        }
    },
    RemoveDateAndOrderByFilter: function () {
        filterLead.StartDate = filterLead.EndDate = "";
        filterLead.OrderBy = 3;
    },
    AddDatesQuery: function () {
        filterLead.StartDate = FromDateTime;
        filterLead.EndDate = ToDateTime;
    },
    GetLmsStage: function () {
        $.ajax({
            url: "/Prospect/Leads/GetStageScore",
            type: "POST",
            data: JSON.stringify({ 'accountId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: LeadpublisherReportUtil.BindLmsStageForSingleAssign,
            error: ShowAjaxError
        });
    },
    //Bind Lms Stage for single assign
    BindLmsStageForSingleAssign: function (response) {
        if (response.StagesList != null && response.StagesList.length > 0) {
            StageList = response.AllStages;
            if (StageList != null && StageList.length > 0) {
                $.each(StageList, function (i) {
                    var opt = document.createElement('option');
                    opt.value = $(this)[0].Score;
                    opt.text = $(this)[0].Stage;
                    opt.setAttribute("style", "background-color:" + $(this)[0].IdentificationColor + ";");
                    $('#ui_dllStageSort').append($("<option></option>").attr({ value: opt.value, style: "background-color:" + $(this)[0].IdentificationColor + ";" }).text(opt.text));
                });
            }
        }
        //LeadpublisherReportUtil.GetMaxCount();
    },
    QuickFilterByLabel: function () {
        filterLead = getFilterLeadObject();
        if ($("#ui_dllLeadLabel option:selected").val().length > 0 && $("#ui_dllLeadLabel option:selected").val().toLowerCase() != "select") {
            filterLead.LeadLabel = $("#ui_dllLeadLabel option:selected").val();
        } else {
            filterLead.LeadLabel = "";
        }

        if ($("#ui_dllStageSort option:selected").val() > -1) {
            filterLead.Score = $("#ui_dllStageSort option:selected").val();
        }
        else {
            filterLead.Score = -1;
        }

        ShowPageLoading();
        OffSet = 0;
        LeadpublisherReportUtil.GetMaxCount();
    },

    GetPropertySetting: function () {
        ShowPageLoading();
        $.ajax({
            url: "/Prospect/Publisher/GetPropertySetting",
            data: JSON.stringify({ 'AccountId': Plumb5AccountId }),
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: LeadpublisherReportUtil.BindPropertySetting,
            error: ShowAjaxError
        });
    },
    BindPropertySetting: function (response) {
        var responselist = JSLINQ(response).Where(function () {
            return (this.IsPublisherField == true)
        });
        ShowPageLoading();
        propertynames = [];
        PropertySettingList = null;
        SetNoRecordContent('ui_tableReport', 3, 'ui_tbodyReportData');
        if (responselist.items != undefined && responselist.items != null && responselist.items.length > 0 && responselist.items != false) {
            PropertySettingList = responselist.items;
            $("#ui_tableReport").removeClass('no-data-records');
            $("#ui_tbodyReportData").html('');
            $("#ui_trheadReportData").empty();

            labelClassSticky = "header-sticky";
            let checkboxheaderstatic = ``;
            let reportTableheaderstatic = `<th class="m-p-w-120 td-wid-100px ${labelClassSticky}">
                                            <div class="sortWrap">                                            
                                            </div>
                                            Lead Label
                                            </th>`;

            let reportTableheader = "";

            var positionsofleadscolumns = 0;
            for (let i = 0; i < responselist.items.length; i++) {

                propertynames.push(responselist.items[i]);

                if (responselist.items[i].DisplayName != "Handled By" && responselist.items[i].DisplayName != "Lead Label") {

                    var width = i == 0 ? "td-wid-20" : "td-wid-18"; //m-p-w-190 td-wid-190px
                    let headerSticky3Class = "header-sticky head-2-sticky";
                    if (i == 0) {
                        reportTableheader += "<th scope='col' class='m-p-w-220 td-wid-250px " + headerSticky3Class + "'><div class='sortWrap'><i class='icon ion-arrow-down-c addColor'></i></div>" + responselist.items[i].DisplayName + "</th>";
                    }

                    else {
                        reportTableheader += "<th scope='col' class='m-p-w-190 td-wid-190px'><div class='sortWrap'><i class='icon ion-arrow-down-c addColor'></i></div>" + responselist.items[i].DisplayName + "</th>";



                    }
                    //if (i == 2)
                    //    break;
                }
            }
            if (Lmscustomfielddetails != undefined) {
                for (var _lmscustomfield = 0; _lmscustomfield < Lmscustomfielddetails.Count(); _lmscustomfield++) {


                    reportTableheader += "<th scope='col' class='m-p-w-190 td-wid-190px'><div class='sortWrap'><i class='icon ion-arrow-down-c addColor'></i></div>" + Lmscustomfielddetails.items[_lmscustomfield].FieldDisplayName + "</th>";

                    var obj = {};
                    obj["PropertyName"] = Lmscustomfielddetails.items[_lmscustomfield]["FieldName"];
                    propertynames.push(obj);
                }

            }
            //propertynames = response 
            ShowPageLoading();
            var adddynamiccolumnnames = reportTableheaderstatic + reportTableheader;

            var finaltable = adddynamiccolumnnames;
            $("#ui_trheadReportData").append("<tr>" + finaltable + "</tr>");
            $("#ui_trbodyReportData").empty();

            LeadpublisherReportUtil.GetReport();
        }
        else {
            ShowPageLoading();
            $("#ui_tableReport").removeClass('no-data-records');
            $("#ui_tbodyReportData").html('');
            $("#ui_trheadReportData").empty();
            let checkboxheaderstatic = ``;

            let reportTableheaderstatic = `
                                    
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
                                   
                                    Created Date
                                    
                                </th>`
            $("#ui_trheadReportData").append("<tr>" + checkboxheaderstatic + reportTableheaderstatic + "</tr>");
            $("#ui_trbodyReportData").empty();

            GetToolTipData();
            BindToolTipData();
            GetRuleToolTipData();
        }
        InitiateSorting();
        HidePageLoading();
    },
    Getlmscustomfields: function () {
        Lmscustomfielddetails = [];
        $("#drplmsFields_0").empty();
        $.ajax({
            url: "/Prospect/Leads/GetLMSCustomFields",
            type: 'POST',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                $("#drplmsFields_0").append(`<option value="0">Select</option>`); 
                if (response != undefined && response != null && response.length > 0 && response != false) {
                    Lmscustomfielddetails = JSLINQ(response).Where(function () {
                        return (this.PublisherField == true);
                    });;
                    setTimeout(LeadpublisherReportUtil.GetLmsGroupList(), 5000);
                }
                else
                    setTimeout(LeadpublisherReportUtil.GetLmsGroupList(), 5000);
            },
            error: ShowAjaxError
        });
    },
    GetLmsGroupList: function () {
        $.ajax({
            url: "/Prospect/Leads/LmsGroupsList",
            data: JSON.stringify({ 'accountId': Plumb5AccountId }),
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: LeadpublisherReportUtil.BindLmsGroupForMasterFilter,
            error: ShowAjaxError
        });
    },
    //Bind Lms Group for master filter or custom report
    BindLmsGroupForMasterFilter: function (response) {
        if (response != undefined && response != null && response.length > 0) {
            setTimeout(LeadpublisherReportUtil.GetLmsStage(), 3000);
            SourceList = response;

        }
    },
    GetFilterByPublisherColumn: function () {
        $.ajax({
            type: "POST",
            url: "/Prospect/Publisher/GetIsPublisherColumn",
            data: JSON.stringify({ 'AccountId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != null && response.length > 0) {
                    $.each(response, function () {

                        if (!ignoreProperties.includes(this.PropertyName)) {
                            let searchColumn = `<a class="dropdown-item searchColumn" propertyname='${this.PropertyName}' displayname='${this.DisplayName}' >${this.DisplayName}</a>`;
                            $("#customDropdownMenu").append(searchColumn);
                        }
                    });
                }
            },
            error: ShowAjaxError
        });
    }
}
var phoneNumberCheck = false;
$(document).on("click", ".searchColumn", function () {
    let displayname = $(this).attr("displayname");
    let propertyname = $(this).attr("propertyname");
    if (propertyname.toLowerCase() === "phonenumber") {
        phoneNumberCheck = true;
    } else {
        phoneNumberCheck = false;
    }
    $("#txt_searchemailphone").val("");
    $("#txt_searchemailphone").attr("placeholder", `Search by ${displayname}`);
    $("#txt_searchemailphone").attr("propertyname", `${propertyname}`);
    $("#txt_searchemailphone").attr("displayname", `${displayname}`);
});

var SearchBoxUtil = {
    SearchByEmailOrPhone: function () {
        ShowPageLoading();
        if ($.trim($("#txt_searchemailphone").val()).length == 0) {
            ShowErrorMessage(GlobalErrorList.Leads.SearchErrorValue);
            $("#txt_searchemailphone").focus();
            HidePageLoading();
            return false;
        }
        else {
            filterLead = getFilterLeadObject();
            var query = CleanText($.trim($("#txt_searchemailphone").val()));

            let propertynameColumn = $("#txt_searchemailphone").attr("propertyname");

            if (phoneNumberCheck) {
                filterLead.PhoneNumber = query;
            } else {
                filterLead[propertynameColumn] = query;
            }

            OffSet = 0;
            LeadpublisherReportUtil.RemoveDateAndOrderByFilter();
            LeadpublisherReportUtil.GetMaxCount();
        }
    },
    SearchByEnterEmailOrPhone: function (e) {
        if ((e.which && e.which === 13) || (e.keyCode && e.keyCode === 13)) {
            if (CleanText($.trim($("#txt_searchemailphone").val())).length == 0) {
                ShowErrorMessage(GlobalErrorList.ManageEmbeddedForm.SearchErrorValue);
                return false;
            }
            ShowPageLoading();
            if (window.location.pathname.includes('/Prospect/Publisher')) {
                filterLead = getFilterLeadObject();
                var query = CleanText($.trim($("#txt_searchemailphone").val()));

                let propertynameColumn = $("#txt_searchemailphone").attr("propertyname");

                if (phoneNumberCheck) {
                    filterLead.PhoneNumber = query;
                } else {
                    filterLead[propertynameColumn] = query;
                }

                OffSet = 0;
                //LmsDefaultLeadpublisherReportUtilFunctionUtil.RemoveDateAndOrderByFilter();
                LeadpublisherReportUtil.GetMaxCount();
            }
            else {
                var regex = /^[0-9]+$/;

                //filterLead = getFilterLeadObject();
                var query = CleanText($.trim($("#txt_searchemailphone").val()));
                if (!query.match(regex))
                    filterLead.EmailId = query;
                else
                    filterLead.PhoneNumber = query;


                OffSet = 0;
                //LeadpublisherReportUtil.RemoveDateAndOrderByFilter();
                LeadpublisherReportUtil.GetMaxCount();
            }

        }
    },
    RemoveSearchByEmailOrPhone: function (e) {
        if (e.which && e.which === 8 || e.keyCode && e.keyCode === 46)
            if ($("#txt_searchemailphone").val().length === 0) {
                ShowPageLoading();
                filterLead.PhoneNumber = '';
                filterLead.EmailId = '';
                filterLead = getFilterLeadObject();
                LeadpublisherReportUtil.AddDatesQuery();
                LeadpublisherReportUtil.GetMaxCount();
            }
    },
    ResetValues: function ()
    {
        ShowPageLoading();
        $("#txt_searchemailphone").val("");
        $("#txt_searchemailphone").attr("propertyname", "EmailId"); 
        $("#txt_searchemailphone").html("8719082751");
        $("#ui_dllLeadLabel").val("select");
        $("#ui_dllStageSort").val("select");
        LeadpublisherReportUtil.QuickFilterByLabel();
         
    }
     
};

$("#txt_searchemailphone").keypress(function (e) {
    SearchBoxUtil.SearchByEnterEmailOrPhone(e);
});
$("#SearchByEmailOrPhone").click(function () {
    SearchBoxUtil.SearchByEmailOrPhone();
});

$("#txt_searchemailphone").keyup(function (e) {
    SearchBoxUtil.RemoveSearchByEmailOrPhone(e);
});

$("#ui_dllLeadLabel, #ui_dllStageSort").change(function () {
    LeadpublisherReportUtil.QuickFilterByLabel();
});