var UserId = 0;
var Userinfolist = new Array();
var Finalresponsedetails = [];
var ordertypedrpdownval = 0;

var UserList = new Array();
var Stagename = 'Closed Won';

$(document).ready(function () {
    PublisherReportUtil.GetUsersList();
    PublisherReportUtil.GetLmsStage();
    PublisherReportUtil.GetPublisher();
    PublisherReportUtil.GetLmsGroupList();
    setTimeout(GetUTCDateTimeRange(2), 30000);
    //filterLead.Score = 5;
    ExportFunctionName = "PublisherReportExport";
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
var filterLead = getFilterLeadObject();
function CallBackFunction() {

    ShowPageLoading();
    TotalRowCount = 0;
    CurrentRowCount = 0;
    PublisherReportUtil.GetMaxCount();

}
function CallBackPaging() {
    CurrentRowCount = 0;
    PublisherReportUtil.GetReport();
}
var PublisherReportUtil = {
    GetUsers: function () {
        $.ajax({
            url: "/Prospect/PublisherReport/GetUsers",
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
        SetNoRecordContent('ui_tblReportData', 8, 'ui_tbodyReportData');
        $("#ui_trbodyReportData").empty();
        let userinfoName = $("#txtlmsCampsearchbyname").val() == undefined ? "" : $("#txtlmsCampsearchbyname").val();


        $.ajax({
            url: "/Prospect/PublisherReport/GetMaxCount",
            type: 'POST',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'UserId': UserId, 'filterLead': filterLead, 'FromDateTime': FromDateTime, 'ToDateTime': ToDateTime, 'UserinfoName': userinfoName, 'OrderbyVal': ordertypedrpdownval, 'Stagename': Stagename }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                TotalRowCount = result;
                if (TotalRowCount > 0) {
                    $("#ExportDivCampaign").removeClass("hideDiv");
                    ShowPagingDiv(true);
                    PublisherReportUtil.GetReport();
                }

                else {
                    $("#ExportDivCampaign").addClass("hideDiv");
                    ShowPagingDiv(false);
                    SetNoRecordContent('ui_tableReport', 8, 'ui_tbodyReportData');
                    HidePageLoading();
                }
            },
            error: ShowAjaxError
        });
    },
    GetReport: function () {

        FetchNext = GetNumberOfRecordsPerPage();
        $.ajax({
            url: "/Prospect/PublisherReport/GetReport",
            type: 'Post',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'UserId': UserId, 'FromDateTime': FromDateTime, 'ToDateTime': ToDateTime, 'OffSet': OffSet, 'FetchNext': FetchNext, 'UserinfoName': '', 'OrderbyVal': ordertypedrpdownval, 'filterLead': filterLead, Stagename: Stagename }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            //success: PublisherReportUtil.BindReport,
            success: function (response) {
                if (response != undefined && response != null && response.Table1.length > 0) {
                    PublisherReportUtil.BindReport(response)
                }
                else {
                    HidePageLoading();
                    $("#ui_tableReport").addClass('no-data-records');
                    SetNoRecordContent('ui_tableReport', 8, 'ui_tbodyReportData');
                }
            },

            error: ShowAjaxError
        });
    },
    BindReport: function (response) {
        SetNoRecordContent('ui_tableReport', 8, 'ui_trbodyReportData');

        if (response != undefined && response != null && response.Table1.length > 0) {
            CurrentRowCount = response.Table1.length;
            PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);
            var reportTableTrs = "";
            var totalreportTableTrs = "";
            var TotalLeads = 0;
            var TotalMailsent = 0;
            var TotalSmsSent = 0;
            var TotalCalled = 0;
            var TotalScore = 0;
            for (var i = 0; i < response.Table1.length; i++) {
                var UserinfoName = "";
                let _UserInfoUserId = response.Table1[i].UserInfoUserId
                var _UserinfoName = JSLINQ(UserList).Where(function () {
                    return (this.UserInfoUserId == _UserInfoUserId);
                });
                if (_UserinfoName.items[0] != null && _UserinfoName.items[0] != "" && _UserinfoName.items[0] != undefined) {
                    UserinfoName = `${_UserinfoName.items[0].FirstName}`;
                }
                TotalLeads += response.Table1[i].TotalLeads;
                TotalMailsent += response.Table1[i].LmsMailCount;
                TotalSmsSent += response.Table1[i].LmsSmsCount;
                TotalCalled += response.Table1[i].CalledCount;
                TotalScore += response.Table1[i].StageCount;
                var conversionrate = "0%";
                if (response.Table1[i].TotalLeads > 0)
                    conversionrate = parseFloat(((response.Table1[i].StageCount / response.Table1[i].TotalLeads) * 100).toFixed(2)) + " %";

                var totallead = response.Table1[i].TotalLeads > 0 ? '<a href="javascript:void(0)" onclick="PublisherReportUtil.GetSourceReport(\'' + 0 + '\' ,\'' + response.Table1[i].Publisher + '\' ,' + _UserInfoUserId + ' )">' + response.Table1[i].TotalLeads + '</a>' : '0';
                var totalStage = response.Table1[i].StageCount > 0 ? '<a href="javascript:void(0)" onclick="PublisherReportUtil.GetSourceReport(\'' + 1 + '\' ,\'' + response.Table1[i].Publisher + '\' ,' + _UserInfoUserId + ')">' + response.Table1[i].StageCount + '</a>' : '0';

                var _publisher = response.Table1[i].Publisher == 'null' ? 'NA' : response.Table1[i].Publisher;
                reportTableTrs += '<tr>' +
                    '<td class="text-left">' + _publisher + '</td>' +
                    '<td class="text-left">' + UserinfoName + '</td>' +
                    '<td data-sentdetail="TotalLeads" class="sentpopup" >' + totallead + '</td>' +
                    '<td>' + response.Table1[i].LmsMailCount + '</td>' +
                    '<td>' + response.Table1[i].LmsSmsCount + '</td>' +
                    '<td>' + response.Table1[i].CalledCount + '</td>' +
                    '<td data-sentdetail="TotalLeads" class="sentpopup" >' + totalStage + '</td>' +
                    '<td>' + conversionrate + '</td>'
                '</tr>';
            }
            var Totalconversionrate = 0;
            if (TotalLeads > 0)
                Totalconversionrate = parseFloat(((TotalScore / TotalLeads) * 100)).toFixed(2) + " %";
            totalreportTableTrs += '<tr>' +
                '<td>' + "" + '</td>' +
                '<td>' + "" + '</td>' +
                '<td>' + TotalLeads + '</td>' +
                '<td>' + TotalMailsent + '</td>' +
                '<td>' + TotalSmsSent + '</td>' +
                '<td>' + TotalCalled + '</td>' +
                '<td>' + TotalScore + '</td>' +
                ' <td>' + Totalconversionrate + '</td>'
            '</tr>';
            ShowExportDiv(true);
            ShowPagingDiv(true);
            $("#ui_tableReport").removeClass('no-data-records');
            $("#ui_tbodyReportData").html(totalreportTableTrs + reportTableTrs);
            HidePageLoading();


        }
        else {
            HidePageLoading();
            $("#ui_tableReport").addClass('no-data-records');
            SetNoRecordContent('ui_tableReport', 8, 'ui_tbodyReportData');
        }

    },
    ShowPhoneCallResponseDetails: function (UserInfoUserId, CalledNumber, CallEvents) {
        ShowPageLoading();
        $("#ui_trlmscalldetails").empty();
        $.ajax({
            url: "/Prospect/PublisherReport/LmsPhoneCallResponseDetails",
            type: 'Post',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'UserInfoUserId': UserInfoUserId, 'FromDateTime': FromDateTime, 'ToDateTime': ToDateTime, 'OrderbyVal': ordertypedrpdownval, 'CalledNumber': CalledNumber, 'filterLead': filterLead, 'CallEvents': CallEvents }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            //success: PublisherReportUtil.BindReport,
            success: function (response) {

                if (response.Table1[0] != null && response.Table1[0] != undefined && response.Table1.length > 0) {
                    $(".rightPopupwrap").addClass('showFlx');
                    $(".popupslideItem").addClass('show');
                    $.each(response.Table1, function (i) {
                        PublisherReportUtil.BindEachSourceReport(response, i)
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
                               <td class="text-left">${response.Table1[i].CalledStatus == null ? "NA" : response.Table1[i].CalledStatus}</td>
                               <td>${response.Table1[i].CalledCount}</td>
                           </tr>`;
        $("#ui_trlmscalldetails").append(reportTablerows);
        HidePageLoading();
    },
    GetLmsStage: function () {
        $.ajax({
            url: "/Prospect/PublisherReport/GetStageScore",
            type: "POST",
            data: JSON.stringify({ 'accountId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: PublisherReportUtil.BindLmsStageForpublisherquickfilter,
            error: ShowAjaxError
        });
    },
    GetPublisher: function () {
        $.ajax({
            url: "/Prospect/PublisherReport/GetPublisherList",
            type: "POST",
            data: JSON.stringify({ 'accountId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: PublisherReportUtil.BindPublisherForpublisherquickfilter,
            error: ShowAjaxError
        });
    },
    BindLmsStageForpublisherquickfilter: function (response) {
        if (response.StagesList != null && response.StagesList.length > 0) {

            $.each(response.StagesList, function (i) {
                var opt = document.createElement('option');
                opt.value = $(this)[0].Score;
                opt.text = $(this)[0].Stage;
                opt.setAttribute("style", "background-color:" + $(this)[0].IdentificationColor + ";");
                $('#ui_dllStageSort').append($("<option></option>").attr({ value: opt.text, style: "background-color:" + $(this)[0].IdentificationColor + ";" }).text(opt.text));
            });
        }
    },
    BindPublisherForpublisherquickfilter: function (response) {
        if (response != null && response != undefined && response.length > 0) {

            $.each(response, function (i) {
                $('#ui_dllpublisher').append("<option value='" + this.publisher + "'>" + this.publisher + "</option>");
            });
        }

    },
    GetUsersList: function () {
        $.ajax({
            url: "/Prospect/PublisherReport/GetUser",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'Getallusers': 2 }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: PublisherReportUtil.BindUserListForpublisherquickfilter,
            error: ShowAjaxError
        });
    },
    BindUserListForpublisherquickfilter: function (userDetails) {
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
            success: PublisherReportUtil.BindLmsGroupForpublisherquickfilter,
            error: ShowAjaxError
        });
    },
    BindLmsGroupForpublisherquickfilter: function (response) {
        if (response != undefined && response != null && response.length > 0) {

            $.each(response, function () {
                $("#ui_ddlSourceSort").append("<option value='" + this.LmsGroupId + "'>" + this.Name + "</option>");
            });
        }
    },
    QuickFilterByStage: function () {
        if ($("#ui_dllStageSort option:selected").val() != -1) {
            ShowPageLoading();
            Stagename = $("#ui_dllStageSort option:selected").val();
            //filterLead.Score = $("#ui_dllStageSort option:selected").val();
            //$("#ui_dllStageSort").select2().val(filterLead.Score);
            OffSet = 0;
            $(".checkedCount").html(0);
            $(".visitorsCount").html(0);
            $(".selchbxall,.selChk").prop("checked", false);
            PublisherReportUtil.GetMaxCount();
        }
    },
    OnCloseOfQuickFilter: function () {
        ShowPageLoading();
        $("#campallsources").val("select");
        $(".checkedCount").html(0);
        $(".visitorsCount").html(0);
        $(".selchbxall,.selChk").prop("checked", false);
        PublisherReportUtil.HideFullFilterDiv();
        PublisherReportUtil.GetMaxCount();
    },
    HideFullFilterDiv: function () {
        if ($(".lmssourcefilterwrp").hasClass("hideDiv") && $(".lmsstagefilterwrp").hasClass("hideDiv") && $(".lmshandledfilterwrp").hasClass("hideDiv") && $(".lmspublisherfilterwrp").hasClass("hideDiv") && $(".filtwrpbar").hasClass("hideDiv") && $('.selChk').filter(':checked').length <= 0) {
            $(".subdivWrap").removeClass("showDiv");
        }
    },
    QuickFilterBySelect: function () {
        let getlmssourcetypeval = $("#campallsources option:selected").val();
        $(".subdivWrap").addClass("showDiv");
        if (getlmssourcetypeval == "select") {
            $(".lmsstagefilterwrp, .lmshandledfilterwrp, .lmspublisherfilterwrp").addClass("hideDiv");
            $(".subdivWrap").removeClass("showDiv h-auto");
        }

        else if (getlmssourcetypeval == "Stages")
            $(".lmsstagefilterwrp").removeClass("hideDiv");
        else if (getlmssourcetypeval == "Handled")
            $(".lmshandledfilterwrp").removeClass("hideDiv");
        else
            $(".lmspublisherfilterwrp").removeClass("hideDiv");

        if (($(".lmsstagefilterwrp").hasClass("hideDiv") && $(".lmshandledfilterwrp").hasClass("hideDiv") && $(".lmspublisherfilterwrp").hasClass("hideDiv")) || !$("#ui_i_filterClose").hasClass("hideDiv"))
            $("#ui_i_filterClose").click();

        $("#campallsources").val("select");
    },
    QuickFilterByPublisher: function () {
        if ($("#ui_dllpublisher option:selected").val().length > 0 && $("#ui_dllpublisher option:selected").val().toLowerCase() != "select") {
            ShowPageLoading();
            filterLead.Publisher = $("#ui_dllpublisher option:selected").val();
            OffSet = 0;
            $(".checkedCount").html(0);
            $(".visitorsCount").html(0);
            $(".selchbxall, .selChk").prop("checked", false);
            PublisherReportUtil.GetMaxCount();
        }
    },
    QuickFilterByHandleby: function () {
        ShowPageLoading();
        if ($('#ui_dllHandledByUser').val() != null) {
            //var SelectedValues = $('#ui_dllHandledByUser').val();
            UserId = parseInt($('#ui_dllHandledByUser').val());
        }
        else {
            filterLead.LmsGroupIdList = "";
        }

        $(".checkedCount").html(0);
        $(".visitorsCount").html(0);
        $(".selchbxall,.selChk").prop("checked", false);
        OffSet = 0;
        PublisherReportUtil.GetMaxCount();
    },
    GetSourceMaxcount: function (Type, publisher, UserInfoUserId) {

        if (Type == 0) {
            filterLead.Score = -1;
        }
        else {
            Stagename = 'Closed Won';
            if ($("#ui_dllStageSort option:selected").val() != -1) {
                Stagename = $("#ui_dllStageSort option:selected").val();
                //filterLead.Score = $("#ui_dllStageSort option:selected").val();
                //$("#ui_dllStageSort").select2().val(filterLead.Score); 
            }
        }
        $("#Publishersourcereport").removeClass("hideDiv");
        UserId = UserInfoUserId;
        filterLead.Publisher = publisher;
        FetchNext = GetNumberOfRecordsPerPage();
        $.ajax({
            url: "/Prospect/PublisherReport/GetSourceReport",
            type: 'Post',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'UserId': UserId, 'FromDateTime': FromDateTime, 'ToDateTime': ToDateTime, 'OrderbyVal': ordertypedrpdownval, 'filterLead': filterLead }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            //success: PublisherReportUtil.BindReport,
            success: function (response) {
                if (response != undefined && response != null && response.Table1.length > 0) {
                    $("#ui_exportDownloadwhatsappdetails").removeClass("hideDiv");
                    $(".popupfooter").show();
                    $("#ui_trsourcedata").empty();
                    $.each(response.Table1, function (i) {


                        let trtablerow = ` <tr>

                                <td class="text-left">${response.Table1[i].LmsGroupName}</td>
                                <td>${response.Table1[i].TotalCount}</td>
                                </tr>`;

                        $("#ui_trsourcedata").append(trtablerow);

                    });

                }
                else {
                    HidePageLoading();
                    $("#ui_tableReport").addClass('no-data-records');
                    SetNoRecordContent('tbllmssource', 2, 'ui_trsourcedata');
                }
            },

            error: ShowAjaxError
        });
    },
    GetSourceReport: function (Type, publisher, UserInfoUserId) {

        if (Type == 0) {
            filterLead.Score = -1;
        }
        else {
            Stagename = 'Closed Won';
            if ($("#ui_dllStageSort option:selected").val() != -1) {
                Stagename = $("#ui_dllStageSort option:selected").val();
                //filterLead.Score = $("#ui_dllStageSort option:selected").val();
                //$("#ui_dllStageSort").select2().val(filterLead.Score); 
            }

        }

        $("#Publishersourcereport").removeClass("hideDiv");
        UserId = UserInfoUserId;
        filterLead.Publisher = publisher;
        //FetchNext = GetNumberOfRecordsPerPage();
        $.ajax({
            url: "/Prospect/PublisherReport/GetSourceReport",
            type: 'Post',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'UserId': UserId, 'FromDateTime': FromDateTime, 'ToDateTime': ToDateTime, 'OffSet': OffSet, 'FetchNext': FetchNext, 'UserinfoName': '', 'OrderbyVal': ordertypedrpdownval, 'filterLead': filterLead }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            //success: PublisherReportUtil.BindReport,
            success: function (response) {
                if (response != undefined && response != null && response.Table1.length > 0) {
                    $("#ui_exportDownloadwhatsappdetails").removeClass("hideDiv");
                    $(".popupfooter").show();
                    $("#ui_trsourcedata").empty();
                    $.each(response.Table1, function (i) {


                        let trtablerow = ` <tr>

                                <td class="text-left">${response.Table1[i].LmsGroupName}</td>
                                <td>${response.Table1[i].TotalCount}</td>
                                </tr>`;

                        $("#ui_trsourcedata").append(trtablerow);

                    });

                }
                else {
                    HidePageLoading();
                    $("#ui_tableReport").addClass('no-data-records');
                    SetNoRecordContent('tbllmssource', 2, 'ui_trsourcedata');
                }
            },

            error: ShowAjaxError
        });
    },

}
$("#ui_exportOrDownload").click(function () {
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
    PublisherReportUtil.GetMaxCount();
});
$("#clsefillmsrep").click(function () {
    $(".orderbylmsrepfillwrap").addClass("hideDiv");
    ordertypedrpdownval = 0;
    PublisherReportUtil.GetMaxCount();
});
$("#campallsources").change(function () {
    PublisherReportUtil.QuickFilterBySelect();
});
$("#ui_dllStageSort").change(function () {
    PublisherReportUtil.QuickFilterByStage();
});

$("#ui_dllpublisher").change(function () {
    PublisherReportUtil.QuickFilterByPublisher();
});
$("#btnCloseStageSort").click(function () {
    $(this).parent().parent().addClass("hideDiv");
    Stagename = 'Closed Won';
    $("#ui_dllStageSort").select2().val(-1).trigger('change');
    PublisherReportUtil.OnCloseOfQuickFilter();
});

$("#btnCloseHandledByUser").click(function () {
    $(this).parent().parent().addClass("hideDiv");
    filterLead.LmsGroupIdList = "";
    UserId = 0;
    //$('#ui_dllHandledByUser').selectpicker("deselectAll", true).selectpicker("refresh");
    $("#ui_dllHandledByUser").select2().val("0").trigger('change');
    PublisherReportUtil.OnCloseOfQuickFilter();
});

$("#btnCloseFilterPublisher").click(function () {
    $(this).parent().parent().addClass("hideDiv");
    filterLead.Publisher = "";
    $("#ui_dllpublisher").select2().val("select").trigger('change');
    PublisherReportUtil.OnCloseOfQuickFilter();
});
$("#ui_dllHandledByUser").change(function () {
    PublisherReportUtil.QuickFilterByHandleby();
});
$("#close-popup, .clsepopup").click(function () {
    $(this).parents(".popupcontainer").addClass("hideDiv");
    if ($('#ui_dllHandledByUser').val() == null)
        filterLead.LmsGroupIdList = "";
    filterLead.Publisher = "";
    UserId = 0;
    if ($("#ui_dllpublisher option:selected").val().length == 0 && $("#ui_dllpublisher option:selected").val().toLowerCase() == "select")
        filterLead.Publisher = "";
    if ($("#ui_dllStageSort option:selected").val() == -1)
        Stagename = 'Closed Won';
    $(".errmsgemlvalidwrp .ion-ios-information").popover("hide");

});
$(document.body).on('click', '#ui_exportDownloadsourcedetails', function (event) {

    ExportFunctionNameInnerPage = "/Prospect/PublisherReport/ExportSourceReport";
    ExportChannel = "PublisherSourceReport";

    $("#ui_ContactdownloadModal").modal('show');
});
$(".lmsorderbymenulmsrep").click(function () {
    ordertypedrpdownval = 0;
    let _ordertypedrpdownval = $(this).attr('data-ordername');
    $(".orderbylmsrepfillwrap").removeClass("hideDiv");
    $(".filttypetextlmsrep").text(_ordertypedrpdownval);
    if (_ordertypedrpdownval != 'Created Date')
        ordertypedrpdownval = 1;
    PublisherReportUtil.GetMaxCount();
});
$('#ui_dllpublisher,#ui_dllHandledByUser,#campallsources').select2({
    minimumResultsForSearch: '',
    dropdownAutoWidth: false,
    containerCssClass: "border"
});