var GoogleAddsLists = [];
var GroupLists = [];
var GoogleAdsdetails = [];
var googleimportsettingsId = 0;
var googleimportsettingsIdpagging = 0;
var googleimportsettinggroupidpagging = 0;
var Googleaccountid = "";
var Googleaccountaudiencegroupid = 0;
var InnerGoogleadsPagingPrevNext;
var Statusvalue = "";
var GoogleGroupId_status = "";
var GoogleCurrentInnerRowCount  = 0;
var GoogleAdsCurrentInnerRowCount = 0;
var groupname = "";
$(document).ready(function () {
    $("#txt_SearchBy").keydown(function (event) {
        if (event.keyCode == 13) {
            if (CleanText($.trim($('#txt_SearchBy').val())).length == 0) {
                ShowErrorMessage(GlobalErrorList.GoogleAdsWords.Groupname);
                return false;
            }

            //CustomEventsReportUtil.MaxCount();
            event.preventDefault();
            return false;
        }
    });
    //googleReportUtil.GetGoogleAdds();  
    googleReportUtil.GetGooglAccountSettingsDetails();
    googleReportUtil.GroupDetails();
    HidePageLoading();
    GetUTCDateTimeRange(2);
    ExportFunctionName = "ExportGoogleAdsData";
     GoogleAdsTotalInnerRowCount = 0;
     GoogleAdsCurrentInnerRowCount = 0;
    InnerOffSet = 0;
    InnerFetchNext = 0;
});

function CallBackFunction() {
    ShowPageLoading();
    TotalRowCount = 0;
    CurrentRowCount = 0;
    googleReportUtil.MaxCount();
}
function CallBackInnerPaging() {
    GoogleAdsCurrentInnerRowCount = 0;
    googleReportUtil.GetResponseReport(googleimportsettingsIdpagging);
}
function CallBackInnerFunction() {
    ShowPageLoading();
    GoogleAdsTotalInnerRowCount = 0;
    GoogleAdsCurrentInnerRowCount = 0;
    googleReportUtil.ResponsedetailsCount(googleimportsettingsIdpagging, googleimportsettinggroupidpagging);
}

var googleReportUtil = {
    GetGoogleAdds: function (googleaccountsid) { 
        $.ajax({
            url: "/GoogleAds/Overview/GetGoogleAds",
            type: 'Post',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId,'googleaccountsid': googleaccountsid}),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: googleReportUtil.BindGoogleAdds,
            error: ShowAjaxError
        });
    },
    BindGoogleAdds: function (response) {
        if (response != null && response != null) {
            GoogleAddsLists = response;
            $.each(GoogleAddsLists, function (i) {
                $("#ddlgoogle_audiencegroups").append(`<option attraudname="${$(this)[0].Name}" value="${$(this)[0].Id}">${$(this)[0].Name}</option>`);
                 
            });
        } 
            $(`#ddlgoogle_audiencegroups`).val(Googleaccountaudiencegroupid).trigger('change');
          
    },
    MaxCount: function () {
        SetNoRecordContent('ui_tableReport', 4, 'ui_trbodyReportData');
        groupname = CleanText($.trim($('#txt_SearchBy').val()));
        $.ajax({
            url: "/GoogleAds/Overview/MaxCount",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime, 'Groupname': groupname }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                TotalRowCount = 0;
                if (response != undefined && response != null && response.returnVal > 0) {
                    TotalRowCount = response.returnVal;
                }

                if (TotalRowCount > 0) {
                    googleReportUtil.GetReport();
                }
                else {
                    $("#ui_tbodyReportData").html('');
                    $("#ui_tableReport").removeClass('no-data-records');
                    SetNoRecordContent('ui_tableReport', 4, 'ui_tbodyReportData');
                    HidePageLoading();
                }
            },
            error: ShowAjaxError
        });
    },
    GetReport: function () {
        FetchNext = GetNumberOfRecordsPerPage(); 
        $.ajax({
            url: "/GoogleAds/Overview/GetReportData",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime, 'OffSet': OffSet, 'FetchNext': FetchNext, 'Groupname': groupname }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: googleReportUtil.BindReport,
            error: ShowAjaxError
        });
    },

    BindReport: function (response) {
        SetNoRecordContent('ui_tableReport', 4, 'ui_tbodyReportData');
        if (response != undefined && response != null && response.length > 0) {
            GoogleAdsdetails = response;
            CurrentRowCount = response.length;
            PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);
            $("#ui_tbodyReportData").html('');
            $("#ui_tableReport").removeClass('no-data-records');
            ShowExportDiv(true);
            ShowPagingDiv(true);

            $.each(response, function (i) {
                var groupname = "";
                let _status = `<p class="mb-0 text-color-success font-11">Active</p>`;
                if (!response[i].Status)
                    _status = `<p class="mb-0 text-color-error font-11" >InActive</p>`;
                let groupid = response[i].GroupId
                var _groupname = JSLINQ(GroupLists).Where(function () {
                    return (this.Id == groupid);
                });
                if (_groupname.items[0] != null && _groupname.items[0] != "" && _groupname.items[0] != undefined) {
                    groupname = `${_groupname.items[0].Name}`;
                }

                let reportTable = ` <tr>
                                    <td class="text-left td-icon">
                                        <div class="groupnamewrap">
                                        <div class="nameTxtWrap">${groupname}${_status}</div>
                                        <div class="tdcreatedraft">
                                        <div class="dropdown">
                                        <button type="button" class="verticnwrp" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <i class="icon ion-android-more-vertical mr-0"></i>
                                        </button>
                                        <div class="dropdown-menu dropdown-menu-right" aria-labelledby="filterbycontacts" x-placement="top-end" style="position: absolute; transform: translate3d(-150px, -51px, 0px); top: 0px; left: 0px; will-change: transform;">
                                        <a class="dropdown-item" href="javascript:void(0)" onclick="googleReportUtil.Editgoolgeads(${response[i].Id});">Edit</a> 
                                        <a class="dropdown-item testrestpop" href="javascript:void(0)"onclick="googleReportUtil.Changestatus(${response[i].Id});">Change Status</a>
                                        <a class="dropdown-item testrestpop" href="javascript:void(0)"onclick="googleReportUtil.ResponsedetailsCount(${response[i].Id},'${response[i].GoogleGroupId}');">Response</a>
                                        <div class="dropdown-divider"></div>
                                        <a data-toggle="modal" data-target="#delete" data-grouptype="groupDelete"
                                                           class="dropdown-item" href="javascript:void(0);" onclick="googleReportUtil.Delete(${response[i].Id});">Delete</a>
                                        </div>
                                        </div>
                                        </div>
                                        </div>
                                    </td>
                                    <td>${response[i].GoogleAudienceName == null ? "NA" : response[i].GoogleAudienceName}</td>
                                    <td>${!response[i].IsRecurring ? 'One-Time' : 'Recurring'}</td>
                                    <td>${response[i].CreatedDate != null ? $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(response[i].CreatedDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(response[i].CreatedDate)) : "NA"}</td>
                              </tr>`;
                $("#ui_tbodyReportData").append(reportTable);
            });
        } else {
            ShowExportDiv(false);
            ShowPagingDiv(false);
        }
        HidePageLoading();
    },
    Editgoolgeads: function (Id) {
        //googleReportUtil.BindGoogleAudience(); 
        var _googleoverviewdetails= JSLINQ(GoogleAdsdetails).Where(function () {
            return (this.Id == Id);
        });
        googleimportsettingsId = Id;
        Googleaccountaudiencegroupid = _googleoverviewdetails.items[0].GoogleGroupId;
        $(`#ddlgoogle_accounts`).val(_googleoverviewdetails.items[0].GoogleAccountSettingsId).trigger('change');
        $("#btngooglesave").html("Update");
        $("#existgoog").prop("checked", true);
        $(".createnewwrap").removeClass("hideDiv");
        $(".createnewinput").addClass("hideDiv");
        $(`#ddlgoogle_contactgroups`).val(_googleoverviewdetails.items[0].GroupId).trigger('change');
        //$(`#ddlgoogle_audiencegroups`).val(_googleoverviewdetails.items[0].GoogleGroupId).trigger('change');
        $(`#ddlhour`).val(_googleoverviewdetails.items[0].Times.split(':')[0]).trigger('change');
        $(`#ddlminute`).val(_googleoverviewdetails.items[0].Times.split(':')[1]).trigger('change');
        
        if (_googleoverviewdetails.items[0].IsRecurring) {
            $(`#ddltimeday`).val(_googleoverviewdetails.items[0].Days).trigger('change');
            $("#recurrin").prop("checked", true);
            $("#dayfield").removeClass("hideDiv");
        }
            
        else {

            $("#onetime").prop("checked", true);
            $("#dayfield").addClass("hideDiv");
        }
            
        $("#googleoverview").removeClass("hideDiv"); 
         
    },
    BindGoogleAudience: function () {

        if (GoogleAddsLists != null && GoogleAddsLists.length > 0) {
            $.each(GoogleAddsLists, function (i) {
                var opt = document.createElement('option');
                opt.value = $(this)[0].Id;
                opt.text = $(this)[0].Name;
                $('#ddlgoogle_audiencegroups').append($("<option></option>").attr({ value: opt.value }).text(opt.text));
            });
        }

    },
    GetGooglAccountSettingsDetails: function () {
        $.ajax({
            url: "/GoogleAds/Overview/GetGooglAccountSettingsDetails",
            type: 'POST',
            data: JSON.stringify({ 'AdsId': Plumb5AccountId,'Id':-1}),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != undefined && response != null) {
                    $.each(response, function () {
                        $("#ddlgoogle_accounts").append(`<option attrgsid="${$(this)[0].GoogleAccountsId}" value="${$(this)[0].Id}">${$(this)[0].GoogleAccountName}</option>`);
                    });
                }
            },
            error: ShowAjaxError

        });
  
},

    GroupDetails: function () {
        $.ajax({
            url: "/GoogleAds/Overview/GetGroupsDetails",
            type: 'POST',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId }),
            async: false,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != undefined && response != null) {
                    GroupLists = response;
                    $.each(response, function () {
                        $("#ddlgoogle_contactgroups").append(`<option value="${$(this)[0].Id}">${$(this)[0].Name}</option>`);
                    });
                }
            },
            error: ShowAjaxError
        });
    },

    ValidateSaveOrUpdate: function () {
        if ($("#ddlgoogle_contactgroups").val() == 0) {
            ShowErrorMessage(GlobalErrorList.GoogleAdsWords.Group);
            $("#ddlgoogle_contactgroups").focus();
            return false;
        }
        if ($("#ddlgoogle_accounts").val() == 0) {
            ShowErrorMessage(GlobalErrorList.GoogleAdsWords.GoogleAccount);
            $("#ddlgoogle_audiencegroups").focus();
            return false;
        }

        if ($("#createnewgoog:checked").length > 0) {
            if ($("#txtgoogleaudience").val() == "") {
                ShowErrorMessage(GlobalErrorList.GoogleAdsWords.Audieancename);
                return false;
            }
            if ($("#txtgoogleaudiencedis").val() == "") {
                ShowErrorMessage(GlobalErrorList.GoogleAdsWords.AudienceDiscription);
                return false;
            }
        }
        if ($("#existgoog:checked").length > 0) {
            if ($("#ddlgoogle_audiencegroups").val() == "0") {
                ShowErrorMessage(GlobalErrorList.GoogleAdsWords.Existingaudiencegroup);
                return false;
            }
        }
        if ($("#recurrin:checked").length > 0) {
            if ($("#ddlhour").val() == "Select") {
                ShowErrorMessage(GlobalErrorList.GoogleAdsWords.Hour);
                return false;
            }
            if ($("#ddlminute").val() == "Select") {
                ShowErrorMessage(GlobalErrorList.GoogleAdsWords.Minute);
                return false;
            }
            if ($("#ddltimeday").val() == "Select") {
                ShowErrorMessage(GlobalErrorList.GoogleAdsWords.Day);
                return false;
            }
        }
        if ($("#onetime:checked").length > 0) {

            if ($("#ddlhour").val() == "Select") {
                ShowErrorMessage(GlobalErrorList.GoogleAdsWords.Hour);
                return false;
            }
            if ($("#ddlminute").val() == "Select") {
                ShowErrorMessage(GlobalErrorList.GoogleAdsWords.Minute);
                return false;
            }

        }
        return true;
    },
    SaveOrUpdate: function (GroupId) {
        var googleimportsettings = {
            Id: googleimportsettingsId,
            GroupId: $("#ddlgoogle_contactgroups").val(),
            GoogleAccountSettingsId: $("#ddlgoogle_accounts").val(),
            GoogleGroupId: $("#existgoog:checked").length > 0 ? $("#ddlgoogle_audiencegroups").val():0,
            Days: $("#recurrin:checked").length > 0 && $("#ddltimeday").val().length > 0 ? $("#ddltimeday").val() : "",
            Times: $("#ddlhour").val() + ":" + $("#ddlminute").val(),
            IsRecurring: $("#recurrin:checked").length > 0 ? true : false,
            Status: true,
            GoogleAudienceName : $("#ddlgoogle_audiencegroups option:selected").attr("attraudname")
        };
        $.ajax({
            url: "/GoogleAds/Overview/SaveOrUpdateDetails",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'googleimportsettings': googleimportsettings, 'googleAudience': $("#txtgoogleaudience").val(), 'googlediscription': $("#txtgoogleaudiencedis").val(), 'Googleaccountid': Googleaccountid}),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response) {
                    $(".setfrmrulewrp").addClass("hideDiv");
                    if (response=="1")
                        ShowSuccessMessage(GlobalErrorList.GoogleAdsWords.UpdateSuccess);
                    else if (!isNaN(response))
                        ShowSuccessMessage(GlobalErrorList.GoogleAdsWords.SaveSuccess);

                    else
                        ShowErrorMessage(response);

                    //CallBackFunction();

                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                }
                else {
                    ShowErrorMessage(GlobalErrorList.GoogleAdsWords.ApiNameExists);
                    HidePageLoading();
                }
            },
            error: ShowAjaxError
        }); ShowAjaxError

    },
    Changestatus: function (Id) {
    ShowPageLoading();
    $.ajax({
        url: "/GoogleAds/Overview/ChangeStatusadwords",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'Id': Id}),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response) {
                ShowSuccessMessage(GlobalErrorList.GoogleAdsWords.ToggleSuccess);
                googleReportUtil.MaxCount();
            }
            else {
                ShowErrorMessage(GlobalErrorList.GoogleAdsWords.ToggleError);
            }
             
            HidePageLoading();
        },
        error: ShowAjaxError
    });
    },
    Delete: function (Id) {
        $("#deleteRowConfirm").attr("DeleteId", Id);
    },
    DeleteGooglerecord: function (Id) {
        ShowPageLoading();
        $.ajax({
            url: "/GoogleAds/Overview/DeleteGooglerecord",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'Id': Id }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response) {
                    ShowSuccessMessage(GlobalErrorList.GoogleAdsWords.DeleteSettingsSuccess);

                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                }
                else {
                    ShowErrorMessage(GlobalErrorList.GoogleAdsWords.DeleteSettingsError);
                }

                $("#deleteRowConfirm").removeAttr("DeleteId");

                
            },
            error: ShowAjaxError
        });
    },
    ClearGoogleAudience: function () {
        $(`#ddlgoogle_accounts`).val("0").trigger('change');
        $("#btngooglesave").html("Save");
        $("#createnewgoog").prop("checked", true);
        $(".createnewinput").removeClass("hideDiv");
        $(".createnewwrap").addClass("hideDiv");
        $(`#ddlgoogle_contactgroups`).val("0").trigger('change');
        $(`#ddlgoogle_audiencegroups`).val("0").trigger('change');
        $(`#ddlhour`).val("Select").trigger('change');
        $(`#ddlminute`).val("Select").trigger('change');
        $(`#txtgoogleaudience`).val("").trigger('change');
        $(`#txtgoogleaudiencedis`).val("").trigger('change');
        $(`#ddltimeday`).val("Select").trigger('change');

    },
    ResponsedetailsCount: function (googleimportsettingsid, GoogleGroupId) {
        googleimportsettingsIdpagging = googleimportsettingsid;
        googleimportsettinggroupidpagging = GoogleGroupId;
        GoogleAdsTotalInnerRowCount = 0;
        WebPushCurrentInnerRowCount = 0;
        InnerOffSet = 0;
        InnerFetchNext = 0;
        GoogleGroupId_status = "";
        GoogleGroupId_status = GoogleGroupId;
        $("#dvgoogleadsresponse").removeClass('hideDiv');
        ShowPageLoading();
        $.ajax({
            url: "/GoogleAds/Overview/ResponsesMaxCount",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'Googleimportsettingsid': googleimportsettingsid, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime}),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                GoogleAdsTotalInnerRowCount = 0;
                if (response != undefined && response != null && response.returnVal > 0) {
                    GoogleAdsTotalInnerRowCount = response.returnVal;
                }

                if (GoogleAdsTotalInnerRowCount > 0) {
                    googleReportUtil.GetResponseReport(googleimportsettingsid);
                }
                else {
                    $("#ui_tbodygoogleadsresponseData").html('');
                    $("#ui_tblgoogleadsresponseData").removeClass('no-data-records');
                    SetNoRecordContent('ui_tblgoogleadsresponseData', 3, 'ui_tbodygoogleadsresponseData');
                    HidePageLoading();
                }
            },
            error: ShowAjaxError
        });
    },
    GetResponseReport: function (googleimportsettingsid) {
        $("#ui_exportgoogleadsresponse").removeClass("hideDiv"); 
        InnerFetchNext = GetInnerNumberOfRecordsPerPage(); 
         
        $.ajax({
            url: "/GoogleAds/Overview/GetGoogleAdsResponses",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'Googleimportsettingsid': googleimportsettingsid, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime, 'OffSet': InnerOffSet, 'FetchNext': InnerFetchNext  }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: googleReportUtil.BindResponseReport,
            error: ShowAjaxError
        });
    },

    BindResponseReport: function (response) {
        SetNoRecordContent('ui_tblgoogleadsresponseData', 3, 'ui_tbodygoogleadsresponseData');
        if (response != undefined && response != null && response.length > 0) { 
            GoogleAdsCurrentInnerRowCount = response.length;
            InnerPagingPrevNext(InnerOffSet, GoogleAdsCurrentInnerRowCount, GoogleAdsTotalInnerRowCount);
            $("#ui_tbodygoogleadsresponseData").html('');
            $("#ui_tblgoogleadsresponseData").removeClass('no-data-records');
            ShowExportDiv(true);
            ShowPagingDiv(true);
            

            $.each(response, function (i) {
                 
                var tablestatusrow = `<td id='Statusvalue_${response[i].Id}'>${response[i].Status}</td>`
                if (response[i].Status == "UnKnown")
                    tablestatusrow = `<td id='Statusvalue_${response[i].Id}' onclick = "googleReportUtil.Responsestatus(${response[i].Id},'${response[i].ResourceName}')"> ${response[i].Status}</td>`
                let reportTable = ` <tr>
                                     
                                    <td>${response[i].ResourceName == null ? "NA" : response[i].ResourceName}</td>
                                     ${tablestatusrow}
                                    <td>${response[i].CreatedDate != null ? $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(response[i].CreatedDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(response[i].CreatedDate)) : "NA"}</td>
                              </tr>`;
                $("#ui_tbodygoogleadsresponseData").append(reportTable);
            });
        } else {
            ShowExportDiv(false);
            ShowPagingDiv(false);
        }
        HidePageLoading();
    },
    Responsestatus: function (Id, googleresponsesname) {
        ShowPageLoading();
        $.ajax({
            url: "/GoogleAds/Overview/GetGoogleAdsResponseStatus",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'Id': Id, 'googleresponsesname': googleresponsesname, 'GoogleGroupId': GoogleGroupId_status }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response)
                    $("#Statusvalue_" + Id).html(response);  
                    HidePageLoading();
                },
             
            error: ShowAjaxError
        });
    }
}
$(document).on('click', "input[name='googleaudiencetype']", function () { 
    let getcheckboxval = $("input[name='googleaudiencetype']:checked").val();
    if (getcheckboxval == "Existing") {
        $(".createnewwrap").removeClass("hideDiv");
        $(".createnewinput").addClass("hideDiv");
    } else {
        $(".createnewinput").removeClass("hideDiv");
        $(".createnewwrap").addClass("hideDiv");
    }
});
$(document).on('click', "input[name='googletime']", function () {

    let getonetimeval = $("input[name='googletime']:checked").val();
    if (getonetimeval == "One-Time") {
        $("#dayfield").addClass("hideDiv");
    } else {
        $("#dayfield").removeClass("hideDiv");
    }
});
$(document).on('click', "#exportgroupgooglebtn", function () {
   /* googleReportUtil.BindGoogleAudience();*/
    $("#recurrin").prop("checked", true);
   
    $("#googleoverview").removeClass("hideDiv");
     
});
$(document).on('click', "#btngooglesave", function () {
 
    ShowPageLoading(); 
    if (!googleReportUtil.ValidateSaveOrUpdate()) {
        HidePageLoading();
        return false;
    }
    googleReportUtil.SaveOrUpdate();
});

$(document).on('click', "#close-popup, .clsepopup", function () {
    googleReportUtil.ClearGoogleAudience()
    $(this).parents(".popupcontainer").addClass("hideDiv");
    $("tr").removeClass("activeBgRow");
    $(".errmsgemlvalidwrp .ion-ios-information").popover("hide");

});
$(document).on('click', "#deleteRowConfirm", function () { 
    googleReportUtil.DeleteGooglerecord(parseInt($("#deleteRowConfirm").attr("DeleteId")));
});

$(document).on('change', '#ddlgoogle_accounts', function () {
        if ($("#ddlgoogle_accounts").val() != "0")
        { 
            Googleaccountid = $("#ddlgoogle_accounts option:selected").attr("attrgsid");
            googleReportUtil.GetGoogleAdds(Googleaccountid);
        }
    
}); 

$(document.body).on('click', '#ui_exportgoogleadsresponse', function (event) {

    ExportFunctionNameInnerPage = "/GoogleAds/Overview/ExportGoogleAdsResponses";
    ExportChannel = "ExportGoogleAdsResponses";

    $("#ui_ContactdownloadModal").modal('show');
});
document.getElementById("txt_SearchBy").addEventListener("keyup", function (event) {
    const key = event.key;
    if (key === "Backspace") {
        if (CleanText($.trim($('#txt_SearchBy').val())).length == 0) {
            groupname = "";
            CallBackFunction();
        }
    }
    else if (key == "Enter") {
        CallBackFunction();
    }
    event.preventDefault(); return false;


});
$(".serchicon").click(function () {
    if (CleanText($.trim($('#txt_SearchBy').val())).length == 0) {
        ShowErrorMessage(GlobalErrorList.GoogleAdsWords.Groupname);
        return false;
    }
    CallBackFunction();
});