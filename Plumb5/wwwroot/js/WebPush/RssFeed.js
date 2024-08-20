var expression = /^(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/;
var regex = new RegExp(expression);
var fromdata = typeof window.FormData == "undefined" ? [] : new window.FormData();
var CampaignTestResult;
var GroupTotalMember = 0;
var AllGroupList = [];

var webPushRssFeed = {
    Id: 0, CampaignName: "", RssUrl: "", CheckRssFeedEvery: "", IsAdvancedOptions: false, IsAutoHide: false, IsAndroidBadgeDefaultOrCustom: false,
    ImageUrl: "", UploadedIconFileName: "", GroupId: 0, CampaignId: 0
};

var rssFeedUtil = {
    Initialize: function () {
        rssFeedUtil.GetCampaignList();
        var today = new Date();
        var strYear = today.getMonth().toString() + 1 + today.getDate().toString() + today.getMilliseconds().toString();
        $("#ui_txtCampaignIdentifier").val("WebPush Campaign Identifier -" + strYear);
    },
    GetCampaignList: function () {
        $.ajax({
            url: "/WebPush/ScheduleCampaign/GetCampaignList",
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != undefined && response != null) {
                    $.each(response, function () {
                        $("#ui_txtCampaignName").append(`<option value="${$(this)[0].Id}">${$(this)[0].Name}</option>`);
                    });
                }
                rssFeedUtil.GetGroups();
            },
            error: ShowAjaxError
        });
    },
    GetGroups: function () {
        $.ajax({
            url: "/ManageContact/Group/GetGroupList",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != undefined && response != null) {
                    AllGroupList = response;
                    $.each(response, function () {
                        $("#testcampgroupname,#campgroupname").append(`<option value="${$(this)[0].Id}">${$(this)[0].Name}</option>`);
                    });
                }

                if (webPushRssFeed.Id > 0) {
                    rssFeedUtil.BindEditDetails();
                }

                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },
    NavigateToNext: function () {

        if ($("#ui_listCampaignInformation").hasClass("active")) {
            if (rssFeedUtil.ValidateCampaignInformation()) {
                webPushRssFeed.CampaignId = $("#ui_txtCampaignName").val();
                webPushRssFeed.CampaignName = CleanText($.trim($("#ui_txtCampaignIdentifier").val()));
                webPushRssFeed.RssUrl = CleanText($.trim($("#ui_txtRssUrl").val()));
                webPushRssFeed.GroupId = $("#campgroupname").val();
                webPushRssFeed.CheckRssFeedEvery = `${CleanText($.trim($("#id_selectHour").val()))}:${CleanText($.trim($("#id_selectMinutes").val()))}`;
                rssFeedUtil.ShowOptionTab();
            }
        } else if ($("#ui_listOptions").hasClass("active")) {
            if ($(document.getElementsByClassName("toggle-on")[0]).hasClass("active")) {
                webPushRssFeed.IsAdvancedOptions = true;
                if ($("#specificbtn").is(":checked")) {
                    webPushRssFeed.IsAutoHide = true;
                } else {
                    webPushRssFeed.IsAutoHide = false;
                }

                if ($("#advdefaultbadge").is(":checked")) {
                    webPushRssFeed.IsAndroidBadgeDefaultOrCustom = false;
                    webPushRssFeed.ImageUrl = "";
                    rssFeedUtil.ShowTestNotificationTab();
                } else {
                    webPushRssFeed.IsAndroidBadgeDefaultOrCustom = true;

                    if (!rssFeedUtil.ValidateIconAndImgUrl()) {
                        return false;
                    }

                    let Iconfile = $("#bwnotcustimg").prop('files')[0];
                    if (Iconfile != undefined) {
                        fromdata.append(Iconfile.name, Iconfile);
                        webPushRssFeed.UploadedIconFileName = Iconfile.name;
                    }
                    webPushRssFeed.ImageUrl = CleanText($.trim($("#ui_ImgUrl").val()));
                    rssFeedUtil.ShowTestNotificationTab();
                }

            } else {
                webPushRssFeed.IsAdvancedOptions = false;
                webPushRssFeed.IsAutoHide = false;
                webPushRssFeed.IsAndroidBadgeDefaultOrCustom = false;
                webPushRssFeed.ImageUrl = "";
                rssFeedUtil.ShowTestNotificationTab();
            }
        } else {
            rssFeedUtil.SaveRssFeedDetails(webPushRssFeed);
        }
    },
    ValidateCampaignInformation: function () {
        if ($("#ui_txtCampaignIdentifier").val() == "" || CleanText($.trim($("#ui_txtCampaignIdentifier").val())).length == 0) {
            ShowErrorMessage(GlobalErrorList.WebPushRssError.CampaignIdentifier);
            $("#ui_txtCampaignIdentifier").focus();
            return false;
        }

        if ($("#ui_txtCampaignName").val() == undefined || $("#ui_txtCampaignName").val() == null || $("#ui_txtCampaignName").val() == "0") {
            ShowErrorMessage(GlobalErrorList.WebPushRssError.CampaignNameError);
            $("#ui_txtCampaignName").focus();
            return false;
        }

        if ($("#ui_txtRssUrl").val() == undefined || $("#ui_txtRssUrl").val() == null || $("#ui_txtRssUrl").val() == "" || CleanText($.trim($("#ui_txtRssUrl").val())).length == 0) {
            ShowErrorMessage(GlobalErrorList.WebPushRssError.RssUrlError);
            $("#ui_txtRssUrl").focus();
            return false;
        }

        if (!regex.test($("#ui_txtRssUrl").val())) {
            ShowErrorMessage(GlobalErrorList.WebPushRssError.RssUrlCorrectUrlError);
            $("#ui_txtRssUrl").focus();
            return false;
        }

        if ($("#campgroupname").select2().val() == undefined || $("#campgroupname").select2().val() == null || $("#campgroupname").select2().val().toString() == "" || $("#campgroupname").select2().val().toString().length == "0" || $("#campgroupname").select2().val().length == 0) {
            ShowErrorMessage(GlobalErrorList.WebPushRssError.SelectGroupError);
            $("#campgroupname").focus();
            return false;
        }


        if ($("#id_selectHour").val() == "00") {
            if ($("#id_selectMinutes").val() == "00") {
                ShowErrorMessage(GlobalErrorList.WebPushRssError.HourMinutesError);
                return false;
            }
        }

        if ($("#id_selectMinutes").val() == "00") {
            if ($("#id_selectHour").val() == "00") {
                ShowErrorMessage(GlobalErrorList.WebPushRssError.HourMinutesError);
                return false;
            }
        }


        rssFeedUtil.ValidateRssFeedURL(CleanText($.trim($("#ui_txtRssUrl").val())));
        return false;
    },
    ValidateIconAndImgUrl: function () {
        let files = $('#bwnotcustimg').prop('files');
        if (files != undefined && files != null && files.length == 0 && !regex.test($("#ui_ImgUrl").val())) {
            ShowErrorMessage(GlobalErrorList.WebPushRssError.UploadFilesError);
            return false;
        }

        if (files != undefined && files != null && files.length > 1) {
            ShowErrorMessage(GlobalErrorList.WebPushRssError.UploadSingleIconFilesError);
            return false;
        }

        //if (!regex.test($("#ui_ImgUrl").val())) {
        //    ShowErrorMessage(GlobalErrorList.WebPushRssError.ImgUrlError);
        //    $("#ui_ImgUrl").focus();
        //    return false;
        //}
        return true;
    },
    NavigateToBack: function () {
        if ($("#ui_listTest").hasClass("active")) {
            rssFeedUtil.ShowOptionTab();
        } else if ($("#ui_listOptions").hasClass("active")) {
            rssFeedUtil.ShowCampaignInformationTab();
        } else {
            rssFeedUtil.ShowTestNotificationTab();
        }
    },
    ShowCampaignInformationTab: function () {
        $("#ui_listCampaignInformation,#ui_listOptions,#ui_listTest").removeClass("active");
        $("#ui_listCampaignInformation").addClass("active");
        $("#ui_secOption,#ui_secTestCampaign").addClass("hideDiv");
        $("#ui_secCampaignInformation").removeClass("hideDiv");
        $("#ui_BackContent").addClass("hideDiv");
        $("#ui_btnNext").html(`Next <i class="icon ion-chevron-right pl-2"></i>`);
    },
    ShowOptionTab: function () {
        HidePageLoading();
        $("#ui_divGroupAnalysisPopUp").addClass("hideDiv");
        $("#ui_listCampaignInformation,#ui_listOptions,#ui_listTest").removeClass("active");
        $("#ui_listOptions").addClass("active");
        $("#ui_secCampaignInformation,#ui_secTestCampaign").addClass("hideDiv");
        $("#ui_secOption").removeClass("hideDiv");
        $("#ui_BackContent").removeClass("hideDiv");
        $("#ui_btnNext").html(`Next <i class="icon ion-chevron-right pl-2"></i>`);
    },
    ShowTestNotificationTab: function () {
        $("#ui_listCampaignInformation,#ui_listOptions,#ui_listTest").removeClass("active");
        $("#ui_listTest").addClass("active");
        $("#ui_secCampaignInformation,#ui_secOption").addClass("hideDiv");
        $("#ui_secTestCampaign").removeClass("hideDiv");
        $("#ui_BackContent").removeClass("hideDiv");
        $("#ui_btnNext").html(`Save <i class="icon ion-chevron-right pl-2"></i>`);
    },
    SaveRssFeedDetails: function (webPushRssFeed) {
        ShowPageLoading();

        let queryString = Object.keys(webPushRssFeed).map((key) => {
            return encodeURIComponent(key) + '=' + encodeURIComponent(webPushRssFeed[key])
        }).join('&');


        $.ajax({
            url: `/WebPush/RssFeed/Save?AccountId=${Plumb5AccountId}&${queryString}`,
            type: 'POST',
            data: fromdata,
            contentType: false,
            processData: false,
            dataType: "json",
            success: function (WebPushRssFeedId) {
                if (WebPushRssFeedId > 0 && webPushRssFeed.Id == 0) {
                    ShowSuccessMessage(GlobalErrorList.WebPushRssError.SavedSuccess);
                    rssFeedUtil.RedirectUrl();
                } else if (WebPushRssFeedId > 0 && webPushRssFeed.Id > 0) {
                    ShowSuccessMessage(GlobalErrorList.WebPushRssError.UpdateSuccess);
                    rssFeedUtil.RedirectUrl();
                } else if (WebPushRssFeedId == -1) {
                    ShowErrorMessage(GlobalErrorList.WebPushRssError.AlreadyExistsMessage);
                } else if (WebPushRssFeedId == 0) {
                    ShowErrorMessage(GlobalErrorList.WebPushRssError.UnableToSaveOrUpdate);
                }
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },
    RedirectUrl: function () {
        setTimeout(() => window.location.href = "/WebPush/ManageBrowserNotifications/Rss", 2000);
    },
    BindEditDetails: function () {
        $.ajax({
            url: "/WebPush/RssFeed/GetRssFeedDetails",
            type: 'POST',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'webPushRssFeed': webPushRssFeed }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (WebPushRssFeedDeatils) {
                if (WebPushRssFeedDeatils != null && WebPushRssFeedDeatils.Id > 0) {
                    $("#ui_txtCampaignIdentifier").val(WebPushRssFeedDeatils.CampaignName);
                    $("#ui_txtCampaignName").val(WebPushRssFeedDeatils.CampaignId).trigger("change");
                    $("#ui_txtRssUrl").val(WebPushRssFeedDeatils.RssUrl);
                    $("#campgroupname").val(WebPushRssFeedDeatils.GroupId).trigger("change");
                    let minuteHour = WebPushRssFeedDeatils.CheckRssFeedEvery.split(':');
                    $("#id_selectHour").val(minuteHour[0]).trigger("change");
                    $("#id_selectMinutes").val(minuteHour[1]).trigger("change");

                    if (WebPushRssFeedDeatils.IsAdvancedOptions == true) {
                        if (!$(document.getElementsByClassName("toggle-on")[0]).hasClass("active"))
                            $(document.getElementsByClassName("toggle-on")[0]).click();

                        if (WebPushRssFeedDeatils.IsAutoHide == true)
                            $("#specificbtn").prop('checked', true);
                        else
                            $("#specificbtn").prop('checked', false);

                        if (WebPushRssFeedDeatils.IsAndroidBadgeDefaultOrCustom == true) {
                            $("#advcustbadge").click();
                            $("#advdefaultbadge").prop("checked", false);
                            $("#advcustbadge").prop("checked", true);

                            $("#ui_ImgUrl").val(WebPushRssFeedDeatils.ImageUrl);

                            $(".brwsnotfilename").removeClass('hideDiv');
                            $(".appndfilename").html(WebPushRssFeedDeatils.UploadedIconFileName);
                        } else {
                            $("#advcustbadge").prop("checked", false);
                            $("#advdefaultbadge").prop("checked", true);
                        }


                    } else {
                        if ($(document.getElementsByClassName("toggle-on")[1]).hasClass("active"))
                            $(document.getElementsByClassName("toggle-on")[1]).click();
                    }
                }
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },
    SendWebPushTest: function () {
        var gettestcampval = $('input[name="testcampaignType"]:checked').val();
        if (gettestcampval == "Individaul") {
            rssFeedUtil.SendIndividualTestWebPush();
        } else {
            rssFeedUtil.SendGroupTestWebPush();
        }
    },
    SendIndividualTestWebPush: function () {
        ShowPageLoading();
        if (CleanText($.trim($("#ui_MachineId").val())).length > 0) {
            $.ajax({
                url: "/WebPush/RssFeed/SendIndividaulWebPushRssFeedTest",
                type: 'POST',
                data: JSON.stringify({ 'accountId': Plumb5AccountId, 'webPushRssFeed': webPushRssFeed, MachineId: CleanText($.trim($("#ui_MachineId").val())) }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) {
                    //if (response != undefined && response != null) {
                    //    if (response.Status == true) {
                    //        ShowSuccessMessage(response.Message);
                    //    } else {
                    //        ShowErrorMessage(response.Message);
                    //    }
                    //} else {
                    //    ShowErrorMessage(GlobalErrorList.WebPushRssError.InternalError);
                    //}
                    if (response != undefined && response != null && response.ResponseMessage != null && response.WepushResponseUserList != null) {
                        CampaignTestResult = response.WepushResponseUserList;
                        ShowSuccessMessage(GlobalErrorList.WebPushRssError.IndividualTestResult);
                    } else {
                        ShowErrorMessage(GlobalErrorList.WebPushRssError.InternalError);
                    }
                    HidePageLoading();
                },
                error: ShowAjaxError
            });
        } else {
            HidePageLoading();
            ShowErrorMessage(GlobalErrorList.WebPushRssError.SelectMachineId);
        }
    },
    SendGroupTestWebPush: function () {
        ShowPageLoading();
        if ($("#testcampgroupname option:selected").val() != "0") {
            $.ajax({
                url: "/WebPush/RssFeed/SendGroupWebPushRssFeedTest",
                type: 'POST',
                data: JSON.stringify({ 'accountId': Plumb5AccountId, 'webPushRssFeed': webPushRssFeed, GroupId: $("#testcampgroupname option:selected").val() }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) {
                    if (response != undefined && response != null && response.ResponseMessage != null && response.WepushResponseUserList != null) {
                        CampaignTestResult = response.WepushResponseUserList;
                        ShowSuccessMessage(GlobalErrorList.WebPushRssError.GroupTestResult);
                    } else {
                        ShowErrorMessage(GlobalErrorList.WebPushRssError.InternalError);
                    }
                    HidePageLoading();
                },
                error: ShowAjaxError
            });
        } else {
            HidePageLoading();
            ShowErrorMessage(GlobalErrorList.WebPushRssError.SelectGroupError);
        }
    },
    ShowTestResult: function () {
        $("#ui_tdbodyResult").empty();
        if (CampaignTestResult != undefined && CampaignTestResult != null && CampaignTestResult.length > 0) {
            $.each(CampaignTestResult, function () {
                let resultContent = `
                                <tr>
                                    <td class="text-left td-icon">
                                        ${$(this)[0].Item1}
                                    </td>
                                    <td class="text-left td-icon">${$(this)[0].Item2}</td>
                                </tr>`;

                $("#ui_tdbodyResult").append(resultContent);
            });
        } else {
            SetNoRecordContent('ui_tableTestResult', 2, 'ui_tdbodyResult');
        }
    },
    ValidateRssFeedURL: function (RssFeedUrl) {
        ShowPageLoading();
        $.ajax({
            url: "/WebPush/RssFeed/ValidateRSSFeedURL",
            type: 'POST',
            data: JSON.stringify({ 'RssFeedUrl': RssFeedUrl }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: true,
            success: function (response) {
                if (response.result) {
                    ShowSuccessMessage(GlobalErrorList.WebPushRssError.ValidateRssFeedURLSuccess);
                    webPushRssFeed.CampaignId = $("#ui_txtCampaignName").val();
                    webPushRssFeed.CampaignName = CleanText($.trim($("#ui_txtCampaignIdentifier").val()));
                    webPushRssFeed.RssUrl = CleanText($.trim($("#ui_txtRssUrl").val()));
                    webPushRssFeed.CheckRssFeedEvery = `${CleanText($.trim($("#id_selectHour").val()))}:${CleanText($.trim($("#id_selectMinutes").val()))}`;
                    rssFeedUtil.ShowGroupMergerOption();
                    //rssFeedUtil.ShowOptionTab();
                }
                else {
                    if (!response.result) {
                        ShowErrorMessage(response.ErrorMessage);
                    } else {
                        ShowErrorMessage(GlobalErrorList.WebPushRssError.ValidateRssFeedURLFailure);
                    }
                }
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },
    GetUniqueRecipient: function () {
        GroupTotalMember = 0;
        let ListOfGroupId = $('#campgroupname').select2("val");
        $("#ui_spanTotalSelectedGroup").html($("#campgroupname option:selected").length);
        if (ListOfGroupId != null) {
            $.ajax({
                url: "/WebPush/ScheduleCampaign/GetUniqueMachineId",
                type: 'POST',
                data: JSON.stringify({ 'accountId': Plumb5AccountId, 'ListOfGroupId': ListOfGroupId.toString() }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) {
                    if (response != undefined && response != null) {
                        GroupTotalMember = parseInt(response);
                        $("#ui_h1TotalUniqueRecipients").html(GroupTotalMember);
                    }
                    HidePageLoading();
                },
                error: ShowAjaxError
            });
        }
        else {
            $("#ui_h1TotalUniqueRecipients").html("0");
            HidePageLoading();
        }
    },
    ShowGroupMergerOption: function () {
        $("#ui_divAnalysisName").removeClass("disableDiv");
        $("#ui_divAnalysisDescription").removeClass("disableDiv");
        $("#ui_txtGroupName").val('');
        $("#ui_txtGroupDescription").val('');
        $("#ui_divAnalysisDetails").addClass("hideDiv");
        $("#ui_h6AnalysisHeading").html('');
        if ($("#campgroupname").select2().val().length == 1) {
            var selectedGroupId = parseInt($("#campgroupname").select2().val().toString());
            for (var i = 0; i < AllGroupList.length; i++) {
                if (selectedGroupId == AllGroupList[i].Id) {
                    $("#ui_txtGroupName").val(AllGroupList[i].Name);
                    $("#ui_txtGroupDescription").val(AllGroupList[i].GroupDescription);
                    break;
                }
            }

            $("#ui_divAnalysisName").addClass("disableDiv");
            $("#ui_divAnalysisDescription").addClass("disableDiv");
            $("#ui_h6AnalysisHeading").html('Group Details');
        } else if ($("#campgroupname").select2().val().length > 1) {
            $("#ui_h6AnalysisHeading").html('Create a merged group');

            var today = new Date();
            var strYear = today.getFullYear().toString() + today.getMonth().toString() + 1 + today.getDate().toString() + today.getMilliseconds().toString();
            var MultiSelectedGroupName = strYear;

            var selectedValue = $('#campgroupname').select2("data");
            for (var i = 0; i <= selectedValue.length - 1; i++) {
                MultiSelectedGroupName += "_" + selectedValue[i].text;
            }

            $("#ui_txtGroupName,#ui_txtGroupDescription").val(MultiSelectedGroupName);
        }
        $("#ui_divGroupAnalysisPopUp").removeClass("hideDiv");
    },
    SaveMergedGroup: function () {
        if (CleanText($.trim($("#ui_txtGroupName").val())).length == 0) {
            ShowErrorMessage(GlobalErrorList.WebPushSchedule.NoGroupName);
            HidePageLoading();
            return true;
        }

        if (CleanText($.trim($("#ui_txtGroupDescription").val())).length == 0) {
            ShowErrorMessage(GlobalErrorList.WebPushSchedule.NoGroupDescription);
            HidePageLoading();
            return true;
        }

        if ($("#campgroupname").select2().val().length == 1) {
            ShowSuccessMessage(GlobalErrorList.WebPushSchedule.MovingNext);
            webPushRssFeed.GroupId = parseInt($("#campgroupname").select2().val()[0]);
            rssFeedUtil.ShowOptionTab();
        }
        else if ($("#campgroupname").select2().val().length > 1) {
            let groupDetails = { Name: CleanText($.trim($("#ui_txtGroupName").val())), GroupDescription: CleanText($.trim($("#ui_txtGroupDescription").val())) };

            $.ajax({
                url: "/WebPush/ScheduleCampaign/GroupCreateAndMergeMachineId",
                type: 'POST',
                data: JSON.stringify({ 'accountId': Plumb5AccountId, 'ListOfGroupId': $('#campgroupname').select2().val().toString(), 'groupDetails': groupDetails }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) {
                    if (response != undefined && response != null) {
                        if (response.Result) {
                            ShowSuccessMessage(GlobalErrorList.WebPushSchedule.MergedGroupSuccess);
                            AllGroupList.push(response.groupDetails);
                            $("#campgroupname").append(`<option value="${response.groupDetails.Id}">${response.groupDetails.Name}</option>`);
                            $("#campgroupname").val(response.groupDetails.Id).trigger('change');
                            webPushRssFeed.GroupId = parseInt(response.groupDetails.Id);
                            rssFeedUtil.ShowOptionTab();
                        } else {
                            ShowErrorMessage(response.Message);
                        }
                    }
                    HidePageLoading();
                },
                error: ShowAjaxError
            });
        }
    }
}

$(document).ready(() => {
    webPushRssFeed.Id = urlParam("WebPushRssFeedId");
    rssFeedUtil.Initialize();
});

$(".bnotiadvanOptions").toggles({
    on: false,
    height: 22
});

$(".toggleUnsub").toggles({
    on: true,
    height: 22
});

$('#testcampgroupname,#ui_txtCampaignName').select2({
    minimumResultsForSearch: '',
    dropdownAutoWidth: false
});

$('#campgroupname').select2({
    placeholder: 'This is my placeholder',
    minimumResultsForSearch: '',
    dropdownAutoWidth: false,
    containerCssClass: 'dropdownactiv',
    maximumSelectionLength: 3
});

$('#ui_txtCampaignName').select2({
    minimumResultsForSearch: '',
    dropdownAutoWidth: false
});


$(".bnotiadvanOptions").click(function () {
    $(this).parents(".rsscontwrp").next().slideToggle();
});

$('input[name="advbadgetype"]').click(function () {
    var advbadgeval = $(this).val();
    if (advbadgeval == "advcustbadge") {
        $(".advbrowsewrap").slideDown();
    } else {
        $(".advbrowsewrap").slideUp();
    }
});

$('input[name="testcampaignType"]').click(function () {
    $("#testcampgroupname").val("0").trigger("change");
    $("#ui_MachineId").val("");

    var gettestcampval = $('input[name="testcampaignType"]:checked').val();
    if (gettestcampval == "Group") {
        $("#indivtxtbox").addClass("hideDiv");
        $("#groupdropdownbox").removeClass("hideDiv");
    } else {
        $("#groupdropdownbox").addClass("hideDiv");
        $("#indivtxtbox").removeClass("hideDiv");
    }
});

$(".testrestpop").click(function () {
    $(".popupcontainer").addClass("hideDiv");
    $('#dvCampaignResults').removeClass('hideDiv');
    rssFeedUtil.ShowTestResult();
});

$("#close-popup, .clsepopup,#ui_iconCloseAnalysisPopUp").click(function () {
    $(this).parents(".popupcontainer").addClass("hideDiv");
});

$("#bwnotcustimg").change(function (s) {
    let bwsupldimg = s.target.files[0].name;
    $(".brwsnotfilename").removeClass('hideDiv');
    $(".appndfilename").html(bwsupldimg);
});

$(".brwsfileremoveicn").click(function () {
    $("#bwnotcustimg").val('');
    $(".appndfilename").empty("");
    $(".brwsnotfilename").addClass('hideDiv');
});

$('#campgroupname').on("change", function (e) {
    ShowPageLoading();
    rssFeedUtil.GetUniqueRecipient();
});

$("#ui_btnGroupAnalysisNext").click(function () {
    ShowPageLoading();
    rssFeedUtil.SaveMergedGroup();
});