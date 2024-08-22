var UserId = 0;
var Userinfolist = new Array();
var Finalresponsedetails = [];
var ordertypedrpdownval = 0;
 
var UserList = new Array();
 

$(document).ready(function () {
    LMSCampaignReportUtil.GetLmsStage();
    LMSCampaignReportUtil.GetLmsGroupList();
    GetUTCDateTimeRange(2);
});
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
        SearchKeyword: "", PageUrl: "", ReferrerUrl: "",  Place: "", CityCategory: "", CustomField61: "", CustomField62: "", CustomField63: "", CustomField64: "", CustomField65: "",
        CustomField66: "", CustomField67: "", CustomField68: "", CustomField69: "", CustomField70: "", CustomField71: "", CustomField72: "", CustomField73: "", CustomField74: "", CustomField75: "", CustomField76: "",
        CustomField77: "", CustomField78: "", CustomField79: "", CustomField80: "", CustomField81: "", CustomField82: "", CustomField83: "", CustomField84: "", CustomField85: "", CustomField86: "", CustomField87: "", CustomField88: "",
        CustomField89: "", CustomField90: "", CustomField91: "", CustomField92: "", CustomField93: "", CustomField94: "", CustomField95: "", CustomField96: "", CustomField97: "", CustomField98: "", CustomField99: "", CustomField100: "",
        LmsCustomField1: "", LmsCustomField2: "", LmsCustomField3: "", LmsCustomField4: "", LmsCustomField5: "",
        LmsCustomField6: "", LmsCustomField7: "", LmsCustomField8: "", LmsCustomField9: "", LmsCustomField10: "",
        LmsCustomField11: "", LmsCustomField12: "", LmsCustomField13: "", LmsCustomField14: "", LmsCustomField15: ""
    };

    return filterLeadobject;
}
var filterLead = getFilterLeadObject();
function CallBackFunction() {

    ShowPageLoading();
    TotalRowCount = 0;
    CurrentRowCount = 0;
    LMSCampaignReportUtil.GetMaxCount(); 
    //LMSCampaignReportUtil.GetUsersList();
}
function CallBackPaging() {
    CurrentRowCount = 0;
    LMSCampaignReportUtil.GetReport();
}
var LMSCampaignReportUtil = {
    GetUsers: function () {
        $.ajax({
            url: "/Prospect/LmsCampaignReport/GetUsers",
            type: 'POST',
            data: JSON.stringify({ 'AdsId': Plumb5AccountId, 'UserId': Plumb5UserId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            success: function (response) {
                if (response != undefined && response != null && response.length > 0) {
                    Userinfolist.push(response);
                }
            },
            error: ShowAjaxError
        });
    },
    GetMaxCount: function () {
        ShowPageLoading();
        SetNoRecordContent('ui_tblReportData', 0, 'ui_tbodyReportData');
        $("#ui_trbodyReportData").empty();
        $.ajax({
            url: "/Prospect/LmsCampaignReport/GetMaxCount",
            type: 'POST',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'UserId': 0, 'filterLead': filterLead, 'FromDateTime': FromDateTime, 'ToDateTime': ToDateTime, 'UserinfoName': $("#txtlmsCampsearchbyname").val(), 'OrderbyVal': ordertypedrpdownval }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                TotalRowCount = result;
                if (TotalRowCount > 0) {
                    $("#ExportDivCampaign").removeClass("hideDiv");
                    ShowPagingDiv(true);
                    LMSCampaignReportUtil.GetReport();
                }

                else {
                    $("#ExportDivCampaign").addClass("hideDiv");
                    ShowPagingDiv(false);
                    SetNoRecordContent('ui_tableReport', 6, 'ui_tbodyReportData');
                    HidePageLoading();
                }
            },
            error: ShowAjaxError
        });
    },
    GetReport: function () {

        FetchNext = GetNumberOfRecordsPerPage();
        $.ajax({
            url: "/Prospect/LmsCampaignReport/GetReport",
            type: 'Post',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'UserId': 0, 'FromDateTime': FromDateTime, 'ToDateTime': ToDateTime, 'OffSet': OffSet, 'FetchNext': FetchNext, 'UserinfoName': $("#txtlmsCampsearchbyname").val().toLowerCase(), 'OrderbyVal': ordertypedrpdownval, 'filterLead': filterLead }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            //success: LMSCampaignReportUtil.BindReport,
            success: function (response) {
                if (response != null && response != undefined && response.length > 0) {
                    LMSCampaignReportUtil.BindReport(response)
                }
                else {
                    HidePageLoading();
                    $("#ui_tableReport").addClass('no-data-records');
                    SetNoRecordContent('ui_tableReport', 6, 'ui_tbodyReportData');
                }
            },

            error: ShowAjaxError
        });
    },
    BindReport: function (response) {
        SetNoRecordContent('ui_tableReport', 5, 'ui_trbodyReportData');

        if (response != undefined && response != null && response.length > 0) {
            CurrentRowCount = response.length;
            PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);
            var reportTableTrs = "";
            for (var i = 0; i < response.length; i++) {
                let _Inbound = '<td><i class="icon ion-ios-information uniqueicon" onclick="LMSCampaignReportUtil.ShowPhoneCallResponseDetails(' + response[i].UserInfoUserId + "," + response[i].CalledNumber + ",'inbound'" + ');"></i>' + response[i].InBound + '</td>';
                let _Outbound = '<td><i class="icon ion-ios-information uniqueicon" onclick="LMSCampaignReportUtil.ShowPhoneCallResponseDetails(' + response[i].UserInfoUserId + "," + response[i].CalledNumber + ",'outbound'" + ');"></i>' + response[i].OutBound + '</td>';
                if (response[i].InBound == 0)
                    _Inbound = '<td>' + response[i].InBound + '</td>';
                if (response[i].OutBound == 0)
                     _Outbound = '<td>' + response[i].OutBound + '</td>';

                reportTableTrs += '<tr>' +
                    '<td class="text-left">' + response[i].UserinfoName + '</td>' +
                    '<td>' + response[i].LMSMailcount + '</td>' +
                    '<td>' + response[i].LMSSmscount + '</td>'+
                    '<td>' + response[i].LMSWhatsAppCount + '</td>'
                    + _Inbound 
                    + _Outbound +
                    '</tr>';
            }
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
    ShowPhoneCallResponseDetails: function (UserInfoUserId, CalledNumber, CallEvents) {
        ShowPageLoading();
        $("#ui_trlmscalldetails").empty();
        $.ajax({
            url: "/Prospect/LmsCampaignReport/LmsPhoneCallResponseDetails",
            type: 'Post',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'UserInfoUserId': UserInfoUserId, 'FromDateTime': FromDateTime, 'ToDateTime': ToDateTime, 'OrderbyVal': ordertypedrpdownval, 'CalledNumber': CalledNumber, 'filterLead': filterLead, 'CallEvents': CallEvents}),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            //success: LMSCampaignReportUtil.BindReport,
            success: function (response) {

                if (response.Table[0] != null && response.Table[0] != undefined && response.Table.length > 0) {
                    $(".rightPopupwrap").addClass('showFlx');
                    $(".popupslideItem").addClass('show');
                    $.each(response.Table, function (i) {
                        LMSCampaignReportUtil.BindEachSourceReport(response, i)
                    });

                }
                else {

                    $(".popupslideItem").addClass('show');
                    $("#ui_trlmscalldetails").addClass('no-data-records');
                    $("#ui_trlmscalldetails").append(GlobalErrorList.MyReports.no_data_error);
                    HidePageLoading();
                }
            },

            error: ShowAjaxError
        });

    },
    BindEachSourceReport: function (response, i) {
        let reportTablerows = `<tr>
                               <td class="text-left">${response.Table[i].CalledStatus == null ? "NA" : response.Table[i].CalledStatus}</td>
                               <td>${response.Table[i].CalledCount}</td>
                           </tr>`;
        $("#ui_trlmscalldetails").append(reportTablerows);
        HidePageLoading();
    },
    GetLmsStage: function () {
        $.ajax({
            url: "/Prospect/Leads/GetStageScore",
            type: "POST",
            data: JSON.stringify({ 'accountId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: LMSCampaignReportUtil.BindLmsStageForcampaignquickfilter,
            error: ShowAjaxError
        });
    },
    BindLmsStageForcampaignquickfilter: function (response) {
        if (response.StagesList != null && response.StagesList.length > 0) {
             
            $.each(response.StagesList, function (i) {
                var opt = document.createElement('option');
                opt.value = $(this)[0].Score;
                opt.text = $(this)[0].Stage;
                opt.setAttribute("style", "background-color:" + $(this)[0].IdentificationColor + ";");
                $('#ui_dllStageSort').append($("<option></option>").attr({ value: opt.value, style: "background-color:" + $(this)[0].IdentificationColor + ";" }).text(opt.text));
            });
        }
    }, 
    GetUsersList: function () {
        $.ajax({
            url: "/Prospect/Leads/GetUser",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'Getallusers': AdvancedSettingHandledbyStatus }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: LMSCampaignReportUtil.BindUserListForCampaignquickfilter,
            error: ShowAjaxError
        });
    },
    BindUserListForCampaignquickfilter: function (userDetails) {
        if (userDetails != null && userDetails != undefined && userDetails.length > 0) {
            UserList = userDetails;
            $.each(UserList, function (i) {
                $('#ui_dllHandledByUser').append("<option value='" + this.UserInfoUserId + "'>" + this.FirstName + " (" + this.EmailId + ")</option>");
            });
        } 

    },
    GetLmsGroupList: function () {
        $.ajax({
            url: "/Prospect/Leads/LmsGroupsList",
            data: JSON.stringify({ 'accountId': Plumb5AccountId }),
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: LMSCampaignReportUtil.BindLmsGroupForcampaignquickfilter,
            error: ShowAjaxError
        });
    },
    BindLmsGroupForcampaignquickfilter: function (response) {
        if (response != undefined && response != null && response.length > 0) {
             
            $.each(response, function () {
                $("#ui_ddlSourceSort").append("<option value='" + this.LmsGroupId + "'>" + this.Name + "</option>");
            });
        } 
    },
    QuickFilterByStage: function () {
        if ($("#ui_dllStageSort option:selected").val() > -1) {
            ShowPageLoading();
            filterLead.Score = $("#ui_dllStageSort option:selected").val();
            //$("#ui_dllStageSort").select2().val(filterLead.Score);
            OffSet = 0;
            $(".checkedCount").html(0);
            $(".visitorsCount").html(0);
            $(".selchbxall,.selChk").prop("checked", false);
            LMSCampaignReportUtil.GetMaxCount();
        }
    },
    OnCloseOfQuickFilter: function () {
        ShowPageLoading();
        $("#lmsallsources").val("select");
        $(".checkedCount").html(0);
        $(".visitorsCount").html(0);
        $(".selchbxall,.selChk").prop("checked", false);
        LMSCampaignReportUtil.HideFullFilterDiv();
        LMSCampaignReportUtil.GetMaxCount();
    },
    HideFullFilterDiv: function () {
        if ($(".lmssourcefilterwrp").hasClass("hideDiv") && $(".lmsstagefilterwrp").hasClass("hideDiv") && $(".lmshandledfilterwrp").hasClass("hideDiv") && $(".lmslabelfilterwrp").hasClass("hideDiv") && $(".filtwrpbar").hasClass("hideDiv") && $('.selChk').filter(':checked').length <= 0) {
            $(".subdivWrap").removeClass("showDiv");
        }
    },
    QuickFilterBySelect: function () {
        let getlmssourcetypeval = $("#campallsources option:selected").val();
        $(".subdivWrap").addClass("showDiv");
        if (getlmssourcetypeval == "select") {
            $(".lmssourcefilterwrp, .lmsstagefilterwrp, .lmshandledfilterwrp, .lmslabelfilterwrp").addClass("hideDiv");
            $(".subdivWrap").removeClass("showDiv h-auto");
        }
        else if (getlmssourcetypeval == "Sources") {
            $('#ui_ddlSourceSort').selectpicker("deselectAll", true).selectpicker("refresh");
            $(".lmssourcefilterwrp").removeClass("hideDiv");
        }
        else if (getlmssourcetypeval == "Stages")
            $(".lmsstagefilterwrp").removeClass("hideDiv");
        else if (getlmssourcetypeval == "Handled")
            $(".lmshandledfilterwrp").removeClass("hideDiv");
        else
            $(".lmslabelfilterwrp").removeClass("hideDiv");

        if (($(".lmssourcefilterwrp").hasClass("hideDiv") && $(".lmsstagefilterwrp").hasClass("hideDiv") && $(".lmshandledfilterwrp").hasClass("hideDiv") && $(".lmslabelfilterwrp").hasClass("hideDiv")) || !$("#ui_i_filterClose").hasClass("hideDiv"))
            $("#ui_i_filterClose").click();

        $("#lmsallsources").val("select");
    },
    QuickFilterByLabel: function () {
        if ($("#ui_dllLeadLabel option:selected").val().length > 0 && $("#ui_dllLeadLabel option:selected").val().toLowerCase() != "select") {
            ShowPageLoading();
            filterLead.LeadLabel = $("#ui_dllLeadLabel option:selected").val();
            OffSet = 0;
            $(".checkedCount").html(0);
            $(".visitorsCount").html(0);
            $(".selchbxall, .selChk").prop("checked", false);
            LMSCampaignReportUtil.GetMaxCount();
        }
    },
    QuickFilterBySource: function () {
        ShowPageLoading();
        if ($('#ui_ddlSourceSort').val() != null) {
            var SelectedValues = $('#ui_ddlSourceSort').val();
            filterLead.LmsGroupIdList = SelectedValues.join();
        }
        else {
            filterLead.LmsGroupIdList = "";
        }

        $(".checkedCount").html(0);
        $(".visitorsCount").html(0);
        $(".selchbxall,.selChk").prop("checked", false);
        OffSet = 0;
        LMSCampaignReportUtil.GetMaxCount();
    }
}
$("#ui_exportOrDownload").click(function () {
    ExportFunctionName = "ExportLmsCampaignReport";
    $("#ui_ddl_ExportDataRange").attr("disabled", false);
});

$(document).ready(function () {
    $("#txtlmsCampsearchbyname").keydown(function (event) {
        if (event.keyCode == 13) {
            if ($("#txtlmsCampsearchbyname").val().length == 0) {
                return false;
            }

            CallBackFunction();
            event.preventDefault();
            return false;
        }
    });
});
$("#txtlmsCampsearchbyname").keyup(function () {
    const key = event.key;
    if (key === "Backspace") {
        if (CleanText($.trim($("#txtlmsCampsearchbyname").val())).length == 0) {
            CallBackFunction();
        }
        return false;
    }
});
$(".lmsorderbymenulmsrep").click(function () {
    ordertypedrpdownval = 0;
    let _ordertypedrpdownval = $(this).attr('data-ordername');
    $(".orderbylmsrepfillwrap").removeClass("hideDiv");
    $(".filttypetextlmsrep").text(_ordertypedrpdownval);
    if (_ordertypedrpdownval != 'Created Date')
        ordertypedrpdownval = 1;
    LMSCampaignReportUtil.GetMaxCount();
});
$("#clsefillmsrep").click(function () {
    $(".orderbylmsrepfillwrap").addClass("hideDiv");
    ordertypedrpdownval = 0;
    LMSCampaignReportUtil.GetMaxCount();
});
$("#campallsources").change(function () {
    LMSCampaignReportUtil.QuickFilterBySelect();
});
$("#ui_dllStageSort").change(function () {
    LMSCampaignReportUtil.QuickFilterByStage();
});

$("#ui_dllLeadLabel").change(function () {
    LMSCampaignReportUtil.QuickFilterByLabel();
});
$("#btnCloseStageSort").click(function () {
    $(this).parent().parent().addClass("hideDiv");
    filterLead.Score = -1;
    $("#ui_dllStageSort").select2().val(-1).trigger('change');
    LMSCampaignReportUtil.OnCloseOfQuickFilter();
});

$("#btnCloseSourceSort").click(function () {
    $(this).parent().parent().addClass("hideDiv");
    filterLead.LmsGroupIdList = "";
    $('#ui_ddlSourceSort').selectpicker("deselectAll", true).selectpicker("refresh");
    LMSCampaignReportUtil.OnCloseOfQuickFilter();
});

$("#btnCloseFilterLabel").click(function () {
    $(this).parent().parent().addClass("hideDiv");
    filterLead.LeadLabel = "";
    $("#ui_dllLeadLabel").select2().val("select").trigger('change');
    LMSCampaignReportUtil.OnCloseOfQuickFilter();
});
$("#ui_ddlSourceSort").change(function () {
    LMSCampaignReportUtil.QuickFilterBySource();
});