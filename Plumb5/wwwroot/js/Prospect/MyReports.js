$(document).ready(function () {
    MyReportsPageDocumentReadtUtil.LoadingSymbol();
    MyReportsPageDocumentReadtUtil.DocumentReady();
});

function CallBackFunction() {
    ShowPageLoading();
    TotalRowCount = 0;
    CurrentRowCount = 0;
    LeadReportBindingUtil.GetMaxCount();
}

function CallBackPaging() {
    ShowPageLoading();
    CurrentRowCount = 0;
    LeadReportBindingUtil.GetReport();
}

$("#ui_exportOrDownloadAll").click(function () {
    $("#ui_ddl_ExportDataRange").val('2').change().attr("disabled", true);
    ExportFunctionName = "GetHistoryReport";
});

$("#ui_exportOrDownload").click(function () {
    ExportFunctionName = "MyReportsExport";
    $("#ui_ddl_ExportDataRange").attr("disabled", false);
});

var MyReportsUtil = {
    GetRecentSavedReportDetails: function () {
        SetNoRecordContent('ui_tblReportData', 6, 'ui_tbodyReportData');
        $.ajax({
            url: "/Prospect/Reports/GetRecentSavedReportDetails",
            type: 'Post',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'UserId': Plumb5UserId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != null) {
                    filterLead = new Object();
                    filterLead = JSON.parse(response.QueryField);
                    LeadReportBindingUtil.GetMaxCount();
                    $("#ui_span_SavedReports").html(response.Name);
                }
                else {
                    SetNoRecordContent('ui_tblReportData', 6, 'ui_tbodyReportData');
                    HidePageLoading();
                }
            },
            error: ShowAjaxError
        });
    },
    EditSavedReports: function (Id) {
        $(".popuptitlwrp h6").html('EDIT SAVED REPORT');
        $('#dvAddOrUpdateReports').removeClass("hideDiv");
        MyReportsUtil.GetFilterConditionDetails('Edit', Id);
    },
    GetFilterConditionDetails: function (Action, Id) {
        ShowPageLoading();
        $("input:checkbox[name='lmssavedrept']").prop("checked", false);
        $("#rdSavedreports_" + Id).prop("checked", true);
        TotalRowCount = 0;
        CurrentRowCount = 0;
        OffSet = 0;
        $.ajax({
            url: "/Prospect/Reports/GetFilterConditionDetails",
            type: 'Post',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'FilterConditionId': Id }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (Action == 'Edit')
                    MyReportsUtil.BindFilterCondtionDetails(response);
                else if (Action == 'Bind') {
                    if (response != null) {
                        $("#ui_span_SavedReports").html(response.Name);
                        filterLead = {
                            UserInfoUserId: 0, OrderBy: -1, StartDate: "", EndDate: "", Score: -1, LmsGroupIdList: "", UserIdList: "", FollowUpUserIdList: "", GroupId: 0, FormId: 0, EmailId: "", PhoneNumber: "", Name: "", LastName: "", Address1: "", Address2: "", StateName: "", Country: "", ZipCode: "",
                            Age: "", Gender: "", MaritalStatus: "", Education: "", Occupation: "", Interests: "", Location: "", Religion: "", CompanyName: "", CompanyWebUrl: "", DomainName: "", CompanyAddress: "", Projects: "", LeadLabel: "", Remarks: "",
                            CustomField1: "", CustomField2: "", CustomField3: "", CustomField4: "", CustomField5: "", CustomField6: "", CustomField7: "", CustomField8: "", CustomField9: "", CustomField10: "",
                            CustomField11: "", CustomField12: "", CustomField13: "", CustomField14: "", CustomField15: "", CustomField16: "", CustomField17: "", CustomField18: "", CustomField19: "", CustomField20: "",
                            CustomField21: "", CustomField22: "", CustomField23: "", CustomField24: "", CustomField25: "", CustomField26: "", CustomField27: "", CustomField28: "", CustomField29: "", CustomField30: "",
                            CustomField31: "", CustomField32: "", CustomField33: "", CustomField34: "", CustomField35: "", CustomField36: "", CustomField37: "", CustomField38: "", CustomField39: "", CustomField40: "",
                            CustomField41: "", CustomField42: "", CustomField43: "", CustomField44: "", CustomField45: "", CustomField46: "", CustomField47: "", CustomField48: "", CustomField49: "", CustomField50: "",
                            CustomField51: "", CustomField52: "", CustomField53: "", CustomField54: "", CustomField55: "", CustomField56: "", CustomField57: "", CustomField58: "", CustomField59: "", CustomField60: "",
                            SearchKeyword: "", PageUrl: "", ReferrerUrl: "", IsAdSenseOrAdWord: "", Place: "", CityCategory: ""
                        };
                        filterLead = JSON.parse(response.QueryField);
                        LeadReportBindingUtil.GetMaxCount();
                    }
                }
                $('#dvSavedReports').addClass("hideDiv");
            },
            error: ShowAjaxError
        });
    },
    BindFilterCondtionDetails: function (response) {
        $('[id^="trsearch"]:not(:first)').remove();
        $('[id^="trlmssearch"]:not(:first)').remove();
        LmsCustomReportPopUpUtil.ClearFields();
        $("#btnSearch").attr("saved-id", response.Id);

        var customfieldandans = JSON.parse(response.QueryField);
        var lmscustomfieldandans = JSON.parse(response.QueryField);
        if (customfieldandans != null) {
            if (customfieldandans.StartDate != null && customfieldandans.StartDate != "" && customfieldandans.StartDate != undefined) {
                var FromDate = ConvertUTCDateTimeToLocal(customfieldandans.StartDate);
                var customFromDate = FromDate != null ? PrefixZero((FromDate.getMonth() + 1)) + "/" + PrefixZero((FromDate.getDate().toString())) + "/" + FromDate.getFullYear() : response.FromDate;
                $("#txtStartDate").val(customFromDate);
            }

            if (customfieldandans.EndDate != null && customfieldandans.EndDate != "" && customfieldandans.EndDate != undefined) {
                var ToDate = ConvertUTCDateTimeToLocal(customfieldandans.EndDate);
                var customToDate = ToDate != null ? PrefixZero((ToDate.getMonth() + 1)) + "/" + PrefixZero((ToDate.getDate().toString())) + "/" + ToDate.getFullYear() : response.ToDate;
                $("#txtEndDate").val(customToDate);
            }

            var stagedetails = JSLINQ(StageList).Where(function () { return (this.Score == customfieldandans.Score); });
            if (stagedetails.items.length > 0) {
                $('#drp_Stages').select2().val(stagedetails.items[0].Score).trigger('change');
            }
            else {
                $('#drp_Stages').select2().val(-1).trigger('change');
            }

            var sourcedetails = JSLINQ(SourceList).Where(function () { return (this.LmsGroupId == customfieldandans.LmsGroupIdList); });
            if (sourcedetails.items.length > 0) {
                $('#drp_Sources').select2().val(sourcedetails.items[0].LmsGroupId).trigger('change');
            }
            else {
                $('#drp_Sources').select2().val(0).trigger('change');
            }

            var userdetails = JSLINQ(UserList).Where(function () { return (this.UserInfoUserId == customfieldandans.UserInfoUserId); });
            if (userdetails.items.length > 0) {
                $('#drp_handledBy').select2().val(userdetails.items[0].UserInfoUserId).trigger('change');
            }
            else {
                $('#drp_handledBy').select2().val(0).trigger('change');
            }


            $('#ui_drpdwn_OrderBy').select2().val(customfieldandans.OrderBy).trigger('change');

            $('#ui_drp_ContactGroups').select2().val(customfieldandans.GroupId).trigger('change');

            $('#ui_drpdwn_Forms').select2().val(customfieldandans.FormId).trigger('change');

            $.each(customfieldandans, function (key, value) {
                if (value === "" || value === null || key.includes("LmsCustomField") == true) {
                    delete customfieldandans[key]; 
                }
                if (value === "" || value === null || key.includes("LmsCustomField") != true) {
                    delete lmscustomfieldandans[key];
                }
            });

            //delete other value except custom field search
            var DeleteOtherfielsds = ["GroupId", "FormId", "Score", "StartDate", "EndDate", "LmsGroupIdList", "OrderBy", "UserIdList", "UserInfoUserId"];
            if (DeleteOtherfielsds.length > 0) {
                for (var i = 0; i < DeleteOtherfielsds.length; i++) {
                    if (customfieldandans.hasOwnProperty(DeleteOtherfielsds[i])) {
                        delete customfieldandans[DeleteOtherfielsds[i]];
                    }
                }
            }

            if (customfieldandans != null && Object.keys(customfieldandans)[0] != undefined) {
                
                    var count = 0;
                    //bind the value to fiels and answer and clone
                    $.each(customfieldandans, function (key, value) {
                        if (count == 0)
                        {
                                $('#drpFields_0').select2().val(key).trigger('change');
                                $('#txtFieldAnswer_0').val(value); 
                        }
                        else {
                            //var html = LmsCustomReportPopUpUtil.GetFieldTypeWithData(key, value, count);
                             
                                $(".lmsaddrepcontainer").append(LmsCustomReportPopUpUtil.GetFieldBindingData(count));
                                $("#drpFields_" + count).html($('#drpFields_0').html());

                                LmsCustomReportPopUpUtil.InitialiseCustomReportDropDown(count);
                                $("#drpFields_" + count).select2().val(key).trigger('change');
                                $('#txtFieldAnswer_' + count).val(value);
                            
                        }
                        count++;
                    });
                
            }
            if (lmscustomfieldandans != null && Object.keys(lmscustomfieldandans)[0] != undefined)
            {
                
                var lmscount = 0;
                $.each(lmscustomfieldandans, function (key, value) {
                    if (lmscount == 0)
                    {
                                $('#drplmsFields_0').select2().val(key).trigger('change');
                                $('#txtLmsFieldAnswer_0').val(value); 
                    }
                        else {

                        $(".lmscustomaddrepcontainer").append(LmsCustomReportPopUpUtil.GetLmsFieldBindingData(lmscount));
                        $("#drplmsFields_" + lmscount).html($('#drplmsFields_0').html());
                        LmsCustomReportPopUpUtil.InitialiselmsCustomReportDropDown(lmscount);
                        $("#drplmsFields_" + lmscount).select2().val(key).trigger('change');
                        $('#txtLmsFieldAnswer_' + lmscount).val(value);

                        }
                    lmscount++;
                    });
            }
      
        }

        if (response.Name != null && response.Name.length > 0) {
            $('#ChkSave').prop('checked', true);
            $('#dvReportName').removeClass('hideDiv');
            $('#ui_txtName').val(response.Name);
        }
        HidePageLoading();
    },
    DeleteSavedSearchConfirm: function (Id) {
        $("#deleteRowConfirmreport").attr("onclick", "MyReportsUtil.DeleteSavedSearch(" + Id + ");");
    },
    DeleteSavedSearch: function (Id) {
        ShowPageLoading();
        $.ajax({
            url: "/Prospect/Reports/DeleteSavedSearch",
            type: 'POST',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'Id': Id }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response)
                    ShowSuccessMessage(GlobalErrorList.MyReports.Delete_SuccessMessage);
                else
                    ShowErrorMessage(GlobalErrorList.MyReports.Delete_ErrorMessage);
                $('#dvAddOrUpdateReports').addClass("hideDiv");
                LmsCustomReportPopUpUtil.BindSavedReports();
                MyReportsUtil.GetRecentSavedReportDetails()
            },
            error: ShowAjaxError
        });
    }
};

$("#btnAddnewReport").click(function () {
    $("#btnSearch").attr("saved-id", 0);
    $(".popuptitlwrp h6").html('ADD NEW REPORT');
    $('[id^="trsearch"]:not(:first)').remove();
    LmsCustomReportPopUpUtil.ClearFields();
    $('#dvAddOrUpdateReports').removeClass("hideDiv");
});

$("#btnSavedReport").click(function () {
    $(".popuptitlwrp h6").html('SAVED REPORTS');
    $('#dvSavedReports').removeClass("hideDiv");
});

