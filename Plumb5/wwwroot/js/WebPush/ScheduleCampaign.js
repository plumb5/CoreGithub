
var AllGroupList = [];
var AllTemplateList = [];
var DeviceChart;
var TestGroupTotalMember = 0;
var GroupTotalMember = 0;
var TotalBatchSize = 4;
var sendingsettingsid = 0;
var sendingsettingstitle = "";
var Copy = 0;
var TemplateContainsCounselorTags = false;

$(document).ready(function () {
    WebPushScheduleUtil.Initialize();
});

var WebPushScheduleUtil = {
    Initialize: function () {
        $("#ui_divCampaignStep3").addClass("hideDiv");
        $("#ui_divCampaignStep2").addClass("hideDiv");
        $("#ui_divCampaignStep1").removeClass("hideDiv");
        WebPushScheduleUtil.CreateUniqueIdentifier();
        WebPushScheduleUtil.GetCampaignList();

        //sendingsettingsid = urlParam("SettingsId");
        //if (sendingsettingsid != 0) {
        //    $(".pagetitle").html("Update Scheduled Campaigns");
        //    WebPushScheduleUtil.GetSendingDetails(sendingsettingsid);
        //}
        if ((urlParam("Action") != 0) && urlParam("Action") == 'copy') {
            Copy = 1;
        }

        $("#ui_txtSingleSchedule").datepicker({
            defaultDate: "+1d",
            prevText: "click for previous months",
            nextText: "click for next months",
            showOtherMonths: true,
            selectOtherMonths: false,
            minDate: new Date()
        });


    },
    GetSendingDetails: function (getid) {

        $.ajax({
            url: "/WebPush/ScheduleCampaign/GetWebPushSendingSettingDetails",
            type: 'POST',
            data: JSON.stringify({ 'Id': getid }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != undefined && response != null) {

                    sendingsettingstitle = response.Name;
                    if (Copy == 1) { WebPushScheduleUtil.CreateUniqueIdentifier(); } else { $("#ui_txtCampaignIdentifier").val(response.Name); }
                    $("#ui_ddlCampaign").select2().val(response.CampaignId).trigger('change');
                    $("#ui_ddlTemplate").select2().val(response.WebPushTemplateId).trigger('change');

                    $("#ui_txtSingleSchedule").val($.datepicker.formatDate("mm/dd/yy", GetJavaScriptDateObj(response.ScheduledDate)));

                    var getfulltime = PlumbTimeFormat(GetJavaScriptDateObj(response.ScheduledDate)).split(' ');
                    var gettime = getfulltime[0].split(':');
                    $("#ui_ddlSingleBatchScheduleHour").val(gettime[0]);
                    $("#ui_ddlSingleBatchScheduleMinute").val(gettime[1]);
                    $("#ui_ddlSingleBatchScheduleAMPM").val(getfulltime[1]);


                    $("#ui_ddlGroups").select2().val(response.GroupId).trigger('change');
                }

            },
            error: ShowAjaxError
        });
    },
    CreateUniqueIdentifier: function () {
        var today = new Date();
        var strYear = today.getFullYear().toString() + today.getMonth().toString() + 1 + today.getDate().toString() + today.getMilliseconds().toString();
        $("#ui_txtCampaignIdentifier").val("Web Push Campaign Identifier -" + strYear);
    },
    GetCampaignList: function () {
        $("#ui_ddlCampaign").html(`<option value="0">Select Campaign</option>`);
        $.ajax({
            url: "/WebPush/ScheduleCampaign/GetCampaignList",
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != undefined && response != null) {
                    $.each(response, function () {
                        $("#ui_ddlCampaign").append(`<option value="${$(this)[0].Id}">${$(this)[0].Name}</option>`);
                    });
                }
                WebPushScheduleUtil.GetGroupList();
            },
            error: ShowAjaxError
        });
    },
    GetGroupList: function () {
        $("#ui_ddlGroups").html('');
        $("#ui_ddlCampaignTestGroup").html(`<option value="0">Select Group</option>`);
        $.ajax({
            url: "/WebPush/ScheduleCampaign/GetGroupList",
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != undefined && response != null) {
                    AllGroupList = response;
                    $.each(response, function () {
                        $("#ui_ddlGroups").append(`<option value="${$(this)[0].Id}">${$(this)[0].Name}</option>`);
                        $("#ui_ddlCampaignTestGroup").append(`<option value="${$(this)[0].Id}">${$(this)[0].Name}</option>`);
                    });
                }
                WebPushScheduleUtil.GetTemplateList();
            },
            error: ShowAjaxError
        });
    },
    GetTemplateList: function () {
        $("#ui_ddlTemplate").html(`<option value="0">Select Template</option>`);
        $.ajax({
            url: "/WebPush/ScheduleCampaign/GetTemplateList",
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != undefined && response != null && response.length > 0) {
                    AllTemplateList = response;
                }
                WebPushScheduleUtil.InitializeSelect2();
                HidePageLoading();

                sendingsettingsid = urlParam("SettingsId");
                if (sendingsettingsid != 0) {
                    $(".pagetitle").html("Update Scheduled Campaigns");
                    WebPushScheduleUtil.GetSendingDetails(sendingsettingsid);
                }
            },
            error: ShowAjaxError
        });
    },
    InitializeSelect2: function () {
        $('#ui_ddlCampaign,#ui_ddlTemplate,#ui_ddlCampaignTestGroup').select2({
            placeholder: 'This is my placeholder',
            minimumResultsForSearch: '',
            dropdownAutoWidth: false,
            containerCssClass: 'dropdownactiv'
        });

        $('#ui_ddlGroups').select2({
            placeholder: 'This is my placeholder',
            minimumResultsForSearch: '',
            dropdownAutoWidth: false,
            containerCssClass: 'dropdownactiv',
            maximumSelectionLength: 3
        });
    },
    BindTemplate: function () {
        $("#ui_ddlTemplate").html(`<option value="0">Select Template</option>`);
        var CampaignId = parseInt($("#ui_ddlCampaign").val());
        if (CampaignId != "0") {
            $.each(AllTemplateList, function () {
                if (CampaignId == $(this)[0].CampaignId) {
                    $("#ui_ddlTemplate").append(`<option value="${$(this)[0].Id}">${$(this)[0].TemplateName}</option>`);
                }
            });
        }
        HidePageLoading();
    },
    GetUniqueRecipient: function () {
        WebPushScheduleUtil.InitializeSelect2();
        GroupTotalMember = 0;
        let ListOfGroupId = $('#ui_ddlGroups').select2("val");
        $("#ui_spanTotalSelectedGroup").html($("#ui_ddlGroups option:selected").length);
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
    ValidateStep1: function () {
        if ($("#ui_txtCampaignIdentifier").val() == "" || CleanText($.trim($("#ui_txtCampaignIdentifier").val())).length == 0) {
            ShowErrorMessage(GlobalErrorList.WebPushSchedule.NoIdentifier);
            $("#ui_txtCampaignIdentifier").focus();
            return false;
        }

        if ($("#ui_ddlCampaign").val() == "" || $("#ui_ddlCampaign").val() == "0") {
            ShowErrorMessage(GlobalErrorList.WebPushSchedule.NoCampaign);
            return false;
        }

        if ($("#ui_ddlTemplate").val() == "" || $("#ui_ddlTemplate").val() == "0") {
            ShowErrorMessage(GlobalErrorList.WebPushSchedule.NoTemplate);
            return false;
        }

        if ($("#ui_ddlGroups").select2().val() == undefined || $("#ui_ddlGroups").select2().val() == null || $("#ui_ddlGroups").select2().val().toString() == "" || $("#ui_ddlGroups").select2().val().toString().length == "0" || $("#ui_ddlGroups").select2().val().length == 0) {
            ShowErrorMessage(GlobalErrorList.WebPushSchedule.NoGroup);
            return false;
        }

        var totalContact = $("#ui_h1TotalUniqueRecipients").html();

        if (totalContact == undefined || totalContact == null || totalContact == "" || totalContact == "0" || parseInt(totalContact) <= 0) {
            ShowErrorMessage(GlobalErrorList.WebPushSchedule.NoContactInGroup);
            return false;
        }



        return true;
    },
    CheckIdentifierUniqueness: function () {
        ShowPageLoading();
        var IdentifierName = CleanText($.trim($("#ui_txtCampaignIdentifier").val()));
        $.ajax({
            url: "/WebPush/ScheduleCampaign/CheckIdentifierUniqueness",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'IdentifierName': IdentifierName }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != undefined && response != null && response) {
                    WebPushScheduleUtil.ShowGroupAnalysisPopUp();
                } else {
                    ShowErrorMessage(GlobalErrorList.WebPushSchedule.NoUniqueIdentifier);
                    $("#ui_txtCampaignIdentifier").focus();
                }
                HidePageLoading();
            },
            error: ShowAjaxError
        });

    },
    ShowGroupAnalysisPopUp: function () {
        $("#ui_divAnalysisName").removeClass("disableDiv");
        $("#ui_divAnalysisDescription").removeClass("disableDiv");
        $("#ui_txtGroupName").val('');
        $("#ui_txtGroupDescription").val('');
        $("#ui_divAnalysisDetails").addClass("hideDiv");
        $("#ui_h6AnalysisHeading").html('');
        if ($("#ui_ddlGroups").select2().val().length == 1) {
            var selectedGroupId = parseInt($("#ui_ddlGroups").select2().val().toString());
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
        } else if ($("#ui_ddlGroups").select2().val().length > 1) {
            $("#ui_h6AnalysisHeading").html('Create a merged group');

            var today = new Date();
            var strYear = today.getFullYear().toString() + today.getMonth().toString() + 1 + today.getDate().toString() + today.getMilliseconds().toString();
            var MultiSelectedGroupName = strYear;

            var selectedValue = $('#ui_ddlGroups').select2("data");
            for (var i = 0; i <= selectedValue.length - 1; i++) {
                MultiSelectedGroupName += "_" + selectedValue[i].text;
            }

            $("#ui_txtGroupName,#ui_txtGroupDescription").val(MultiSelectedGroupName);
        }
        $("#ui_divGroupAnalysisPopUp").removeClass("hideDiv");
    },
    HideGroupAnalysisPopUp: function () {
        $("#ui_divGroupAnalysisPopUp").addClass("hideDiv");
        $("#ui_divAnalysisName").removeClass("disableDiv");
        $("#ui_divAnalysisDescription").removeClass("disableDiv");
        $("#ui_txtGroupName").val('');
        $("#ui_txtGroupDescription").val('');
        $("#ui_divAnalysisDetails").addClass("hideDiv");
        $("#ui_h6AnalysisHeading").html('');
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

        if ($("#ui_ddlGroups").select2().val().length == 1) {
            ShowSuccessMessage(GlobalErrorList.WebPushSchedule.MovingNext);
            WebPushScheduleUtil.MoveToStep2();
        }
        else if ($("#ui_ddlGroups").select2().val().length > 1) {
            let groupDetails = { Name: CleanText($.trim($("#ui_txtGroupName").val())), GroupDescription: CleanText($.trim($("#ui_txtGroupDescription").val())) };

            $.ajax({
                url: "/WebPush/ScheduleCampaign/GroupCreateAndMergeMachineId",
                type: 'POST',
                data: JSON.stringify({ 'accountId': Plumb5AccountId, 'ListOfGroupId': $('#ui_ddlGroups').select2().val().toString(), 'groupDetails': groupDetails }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) {
                    if (response != undefined && response != null) {
                        if (response.Result) {
                            ShowSuccessMessage(GlobalErrorList.WebPushSchedule.MergedGroupSuccess);
                            AllGroupList.push(response.groupDetails);
                            $("#ui_ddlGroups").append(`<option value="${response.groupDetails.Id}">${response.groupDetails.Name}</option>`);
                            $("#ui_ddlGroups").val(response.groupDetails.Id).trigger('change');
                            WebPushScheduleUtil.MoveToStep2();
                        } else {
                            ShowErrorMessage(response.Message);
                            HidePageLoading();
                        }
                    }
                },
                error: ShowAjaxError
            });
        }
    },
    MoveToStep2: function () {
        $("#ui_divCampaignStep3").addClass("hideDiv");
        $("#ui_divCampaignStep1").addClass("hideDiv");
        $("#ui_divAnalysisDetails").addClass("hideDiv");
        $("#ui_divGroupAnalysisPopUp").addClass("hideDiv");
        $("#ui_divSingleBatch").removeClass("hideDiv");
        $("#ui_divCampaignStep2").removeClass("hideDiv");
        HidePageLoading();
    },
    ValidateStep2SingleBatch: function () {
        if ($("#ui_txtSingleSchedule").val() == "" || $.trim($("#ui_txtSingleSchedule").val()).length == 0) {
            ShowErrorMessage(GlobalErrorList.WebPushSchedule.NoSigleBatchDate);
            $("#ui_txtSingleSchedule").focus();
            HidePageLoading();
            return false;
        }

        var SelectedDateString = $("#ui_txtSingleSchedule").val().split("/");
        var ScheduleHour = $("#ui_ddlSingleBatchScheduleHour").val();
        var ScheduleMinute = $("#ui_ddlSingleBatchScheduleMinute").val();
        var ScheduleFormart = $("#ui_ddlSingleBatchScheduleAMPM").val();
        if (ScheduleFormart.toUpperCase() == "PM") {
            ScheduleHour = WebPushScheduleUtil.ConvertHourTo24HourFormat(ScheduleHour);
        }

        var SelectedDate = new Date(SelectedDateString[2], parseInt(SelectedDateString[0]) - 1, SelectedDateString[1], ScheduleHour, ScheduleMinute, 59);
        if (SelectedDate <= new Date()) {
            ShowErrorMessage(GlobalErrorList.WebPushSchedule.NoSingleGreaterDate);
            HidePageLoading();
            return false;
        }

        WebPushScheduleUtil.MoveToStep3();
    },
    ConvertHourTo24HourFormat: function (hourValue) {
        switch (hourValue) {
            case "01":
                hourValue = "13";
                break;
            case "02":
                hourValue = "14";
                break;
            case "03":
                hourValue = "15";
                break;
            case "04":
                hourValue = "16";
                break;
            case "05":
                hourValue = "17";
                break;
            case "06":
                hourValue = "18";
                break;
            case "07":
                hourValue = "19";
                break;
            case "08":
                hourValue = "20";
                break;
            case "09":
                hourValue = "21";
                break;
            case "10":
                hourValue = "22";
                break;
            case "11":
                hourValue = "23";
                break;
        }
        return hourValue;
    },
    MoveToStep3: function () {
        ShowPageLoading();
        WebPushScheduleUtil.BindTemplateContent();
        $("#ui_divCampaignStep2").addClass("hideDiv");
        $("#ui_divCampaignStep1").addClass("hideDiv");
        $("#ui_divAnalysisDetails").addClass("hideDiv");
        $("#ui_divGroupAnalysisPopUp").addClass("hideDiv");
        $("#ui_divCampaignStep3").removeClass("hideDiv");
        HidePageLoading();
    },
    BindTemplateContent: function () {
        var SelectedTemplateId = $("#ui_ddlTemplate").val();
        for (var i = 0; i < AllTemplateList.length; i++) {
            if (SelectedTemplateId == AllTemplateList[i].Id) {

                if (AllTemplateList[i].IconImage != null && AllTemplateList[i].IconImage.length != 0) {
                    $(".notificonwrp").css("background-image", "url(" + AllTemplateList[i].IconImage + ")");
                }

                if (AllTemplateList[i].BannerImage != null && AllTemplateList[i].BannerImage.length != 0) {
                    $('.notifbanwrp').removeClass('hideDiv');
                    $(".notifbanwrp").css("background-image", "url(" + AllTemplateList[i].BannerImage + ")");
                }


                else
                    $('.notifbanwrp').addClass('hideDiv');


                $("#notifsubbtn").hide(); $("#notifcanbtn").hide();
                $(".notiftitle").html(PreviewSupport(AllTemplateList[i].Title));
                $(".notifdescript").html(PreviewSupport(AllTemplateList[i].MessageContent));
                if (AllTemplateList[i].Button1_Label != null && AllTemplateList[i].Button1_Label.length != 0) { $("#notifsubbtn").show(); $(".bnotbtn1").html(AllTemplateList[i].Button1_Label); }
                if (AllTemplateList[i].Button2_Label != null && AllTemplateList[i].Button2_Label.length != 0) { $("#notifcanbtn").show(); $(".bnotbtn2").html(AllTemplateList[i].Button2_Label); }

                break;
            }
        }
    },
    CheckUniqueRecipient: function () {
        TestGroupTotalMember = 0;
        var TestGroupId = $('#ui_ddlCampaignTestGroup').select2().val();
        if (TestGroupId != null && TestGroupId != "0") {
            $.ajax({
                url: "/WebPush/ScheduleCampaign/GetUniqueMachineId",
                type: 'POST',
                data: JSON.stringify({ 'accountId': Plumb5AccountId, 'ListOfGroupId': TestGroupId.toString() }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) {
                    if (response != undefined && response != null) {
                        TestGroupTotalMember = parseInt(response);
                        if (TestGroupTotalMember == 0) {
                            ShowErrorMessage(GlobalErrorList.WebPushSchedule.NoTestGroupContact);
                        } else if (TestGroupTotalMember > 30) {
                            ShowErrorMessage(GlobalErrorList.WebPushSchedule.TestGroupMoreContact);
                        }
                    }
                    HidePageLoading();
                },
                error: ShowAjaxError
            });
        } else {
            HidePageLoading();
        }
    },
    SaveOrUpdateSendingSettings: function () {

        var SelectedDateString = $("#ui_txtSingleSchedule").val().split("/");
        var ScheduleHour = $("#ui_ddlSingleBatchScheduleHour").val();
        var ScheduleMinute = $("#ui_ddlSingleBatchScheduleMinute").val();
        var ScheduleFormart = $("#ui_ddlSingleBatchScheduleAMPM").val();
        if (ScheduleFormart.toUpperCase() == "PM") {
            ScheduleHour = WebPushScheduleUtil.ConvertHourTo24HourFormat(ScheduleHour);
        }

        var SelectedDate = new Date(SelectedDateString[2], parseInt(SelectedDateString[0]) - 1, SelectedDateString[1], ScheduleHour, ScheduleMinute, 59);

        sendingsettingsid = Copy == 1 ? 0 : sendingsettingsid;
        var SendingSetting = { Id: sendingsettingsid, CampaignId: parseInt($("#ui_ddlCampaign").val()), Name: $("#ui_txtCampaignIdentifier").val(), WebPushTemplateId: parseInt($("#ui_ddlTemplate").val()), GroupId: parseInt($("#ui_ddlGroups").val()), ScheduledDate: SelectedDate };

        $.ajax({
            url: "/WebPush/ScheduleCampaign/SaveOrUpdateSendingSetting",
            type: 'POST',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'webpushSendingSetting': SendingSetting }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                if (data != undefined && data != null) {
                    if (data.Status == true) {
                        var response = data.Result;

                        if (response.Id > 0) {
                            ShowSuccessMessage(GlobalErrorList.WebPushSchedule.CampaignScheduledSuccess);
                            setTimeout(function () { window.location.href = "/WebPush/ManageBrowserNotifications/Scheduled"; }, 500);
                        }
                        else if (response.Id == -1) {
                            ShowErrorMessage(GlobalErrorList.WebPushSchedule.NoUniqueIdentifier);
                        }
                        else {
                            ShowErrorMessage(GlobalErrorList.WebPushSchedule.UpdateIssue);
                        }
                    }
                }
                else {
                    ShowAjaxError(data.Error);
                }

            },
            error: ShowAjaxError
        });
    },
    TestIndividualCampaign: function () {

        $.ajax({
            url: "/WebPush/ScheduleCampaign/SendIndividualTest",
            type: 'POST',
            data: JSON.stringify({ 'WebpushTemplateId': parseInt($("#ui_ddlTemplate").val()), 'MachineId': $("#ui_txtCampaignTestMachineId").val() }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != undefined && response != null) {
                    if (response.SentStatus == true) {
                        ShowSuccessMessage(GlobalErrorList.WebPushSchedule.TestMessageSuccess);
                    }
                    else {
                        ShowErrorMessage(GlobalErrorList.WebPushSchedule.TestMessageError);
                    }
                }

            },
            error: ShowAjaxError
        });
    },
    TestGroupCampaign: function () {

        var SendingSetting = { Id: 0, WebPushTemplateId: parseInt($("#ui_ddlTemplate").val()), GroupId: parseInt($("#ui_ddlCampaignTestGroup").val()) };

        $.ajax({
            url: "/WebPush/ScheduleCampaign/SendGroupTest",
            type: 'POST',
            data: JSON.stringify({ 'webpushSendingSetting': SendingSetting }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != undefined && response != null) {
                    if (response.SentStatus == true) {
                        ShowSuccessMessage(GlobalErrorList.WebPushSchedule.TestMessageSuccess);
                    }
                    else {
                        ShowErrorMessage(GlobalErrorList.WebPushSchedule.TestMessageError);
                    }
                }

            },
            error: ShowAjaxError
        });
    },
    CheckCredits: function () {
        $.ajax({
            url: "/WebPush/ScheduleCampaign/CheckCredits",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'TotalContacts': parseInt($("#ui_h1TotalUniqueRecipients").html()) }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != undefined && response != null) {
                    if (response.Status == false) {
                        //alert("Insufficient Credits");
                        ShowErrorMessage(GlobalErrorList.WebPushSchedule.NoCredits);
                        return false;
                    } else {
                        ShowPageLoading();
                        if (!WebPushScheduleUtil.ValidateStep1()) {
                            HidePageLoading();
                            return true;
                        }

                        if (sendingsettingsid == 0 || (sendingsettingsid != 0 && sendingsettingstitle != $("#ui_txtCampaignIdentifier").val())) {
                            WebPushScheduleUtil.CheckIdentifierUniqueness();
                        } else { WebPushScheduleUtil.ShowGroupAnalysisPopUp(); HidePageLoading(); }
                    }
                }

            },
            error: ShowAjaxError
        });
    },
    CheckCounselorTags: function (TemplateId) {

        var WebpushTemplate = { Id: TemplateId };
        $.ajax({
            url: "/WebPush/Template/CheckCounselorTags",
            type: 'POST',
            data: JSON.stringify({ 'webpushTemplate': WebpushTemplate }),
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                if (response) {
                    TemplateContainsCounselorTags = true;
                    $("#ui_btnStep1Next").prop('disabled', true);
                    ShowErrorMessage(GlobalErrorList.WebPushSchedule.CounselorTags);
                }
                else {
                    TemplateContainsCounselorTags = false;
                    $("#ui_btnStep1Next").prop('disabled', false);
                }
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    }

}

function PreviewSupport(message) {
    var matches = message.match(/\[\{\*(.*?)\*\}\]/g);

    if (matches != null) {
        for (i = 0; i < matches.length; i++) {
            message = message.replace(matches[i], "xxxxxxxxxxxxxx");
        }
    }
    $("#ui_dvMessageContentPreview").html(message);
    return message;
}

$("#ui_btnTestCampaign").click(function () {

    if ($("#ui_rdbtnIndividualTestCampaign").prop("checked")) {
        WebPushScheduleUtil.TestIndividualCampaign();
    } else {
        WebPushScheduleUtil.TestGroupCampaign();
    }
});

//#region Step1
$("#ui_ddlCampaign").change(function () {
    ShowPageLoading();
    WebPushScheduleUtil.BindTemplate();
});

$('#ui_ddlGroups').on("change", function (e) {
    ShowPageLoading();
    WebPushScheduleUtil.GetUniqueRecipient();
});

$('#ui_ddlTemplate').change(function () {
    if ($('#ui_ddlTemplate').val() > 0) {
        ShowPageLoading();
        WebPushScheduleUtil.CheckCounselorTags($('#ui_ddlTemplate').val());
    }
});

$("#ui_btnStep1Next").click(function () {
    WebPushScheduleUtil.CheckCredits();
});

$("#ui_iconCloseAnalysisPopUp").click(function () {
    WebPushScheduleUtil.HideGroupAnalysisPopUp();
});

$("#ui_btnCloseAnalysisPopUp").click(function () {
    WebPushScheduleUtil.HideGroupAnalysisPopUp();
});


$("#ui_btnGroupAnalysisNext").click(function () {
    ShowPageLoading();
    WebPushScheduleUtil.SaveMergedGroup();
});

//#region Gauge Code
function responsivefy(svg) {
    const container = d3.select(svg.node().parentNode),
        width = parseInt(container.style('width'), 10),
        height = parseInt(container.style('height'), 10),
        aspect = width / height;
    svg.attr('viewBox', `0 0 ${width} ${height}`).
        attr('preserveAspectRatio', 'xMaxYMax').
        call(resize);
    d3.select(window).on('resize.' + container.attr('id'), resize);
    function resize() {
        const targetWidth = parseInt(container.style('width'));
        svg.attr('width', targetWidth);
        svg.attr('height', height);
    }
}

function createGauge(gauge_value, div_id) {
    d3.selectAll(div_id + " > *").remove();
    var Needle, arc, arcEndRad, arcStartRad, barWidth, chart, chartInset, degToRad, el, endPadRad, height, i, margin, needle, numSections, padRad, percToDeg, percToRad, percent, radius, ref, sectionIndx, sectionPerc, startPadRad, svg, totalPercent, width;
    margin = {
        top: 10,
        right: 10,
        bottom: 10,
        left: 10
    };
    percent = gauge_value;

    numSections = 3;
    sectionPerc = 1 / numSections / 2;
    padRad = 0.05;
    chartInset = 10;
    totalPercent = .75;

    el = d3.select(div_id);

    width = el[0][0].offsetWidth - margin.left - margin.right;
    height = width;
    radius = Math.min(width, height) / 2;
    barWidth = .20 * radius;
    percToDeg = function (perc) {
        return perc * 360;
    };
    percToRad = function (perc) {
        return degToRad(percToDeg(perc));
    };
    degToRad = function (deg) {
        return deg * Math.PI / 180;
    };

    svg = el.append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .attr('viewBox', `0 0 ${width} ${height}`)
        .attr('preserveAspectRatio', 'xMaxYMax')
        .call(responsivefy);
    chart = svg.append('g').attr('transform', `translate(${(width + margin.left) / 2}, ${(height + margin.top) / 2})`);

    // build gauge bg
    for (sectionIndx = i = 1, ref = numSections;
        (1 <= ref ? i <= ref : i >= ref); sectionIndx = 1 <= ref ? ++i : --i) {
        arcStartRad = percToRad(totalPercent);
        arcEndRad = arcStartRad + percToRad(sectionPerc);
        totalPercent += sectionPerc;
        startPadRad = sectionIndx === 0 ? 0 : padRad / 2;
        endPadRad = sectionIndx === numSections ? 0 : padRad / 2;
        arc = d3.svg.arc().outerRadius(radius - chartInset).innerRadius(radius - chartInset - barWidth).startAngle(arcStartRad + startPadRad).endAngle(arcEndRad - endPadRad);
        chart.append('path').attr('class', `arc chart-color${sectionIndx}`).attr('d', arc);
    }

    Needle = class Needle {
        constructor(len, radius1) {
            this.len = len;
            this.radius = radius1;
        }

        drawOn(el, perc) {
            el.append('circle').attr('class', 'needle-center').attr('cx', 0).attr('cy', 0).attr('r', this.radius);
            return el.append('path').attr('class', 'needle').attr('d', this.mkCmd(perc));
        }

        animateOn(el, perc) {
            var self;
            self = this;
            return el.transition().delay(500).ease('elastic').duration(3000).selectAll('.needle').tween('progress', function () {
                return function (percentOfPercent) {
                    var progress;
                    progress = percentOfPercent * perc;
                    return d3.select(this).attr('d', self.mkCmd(progress));
                };
            });
        }

        mkCmd(perc) {
            var centerX, centerY, leftX, leftY, rightX, rightY, thetaRad, topX, topY;
            thetaRad = percToRad(perc / 2); // half circle
            centerX = 0;
            centerY = 0;
            topX = centerX - this.len * Math.cos(thetaRad);
            topY = centerY - this.len * Math.sin(thetaRad);
            leftX = centerX - this.radius * Math.cos(thetaRad - Math.PI / 2);
            leftY = centerY - this.radius * Math.sin(thetaRad - Math.PI / 2);
            rightX = centerX - this.radius * Math.cos(thetaRad + Math.PI / 2);
            rightY = centerY - this.radius * Math.sin(thetaRad + Math.PI / 2);
            return `M ${leftX} ${leftY} L ${topX} ${topY} L ${rightX} ${rightY}`;
        }

    };

    needle = new Needle(radius - margin.top, 0.1 * radius);
    needle.drawOn(chart, 0);
    needle.animateOn(chart, percent);

}
//#endregion Gauge Code

//#endregion Step1

//#region Step2


$("#ui_btnStep2Back").click(function () {
    ShowPageLoading();
    $("#ui_divCampaignStep3").addClass("hideDiv");
    $("#ui_divCampaignStep1").addClass("hideDiv");
    $("#ui_divAnalysisDetails").addClass("hideDiv");
    $("#ui_divCampaignStep1").removeClass("hideDiv");
    $("#ui_divCampaignStep2").addClass("hideDiv");
    HidePageLoading();
});

$("#ui_btnStep2Next").click(function () {
    ShowPageLoading();

    WebPushScheduleUtil.ValidateStep2SingleBatch();
});

//#endregion Step2

//#region Step3

$('input[name=TestCampaignType]').change(function () {
    $("#ui_divIndividualTestCampaign").addClass("hideDiv");
    $("#ui_divGroupTestCampaign").addClass("hideDiv");
    if ($(this).val() == '0') {
        $("#ui_divIndividualTestCampaign").removeClass("hideDiv");
    }
    else if ($(this).val() == '1') {
        $("#ui_divGroupTestCampaign").removeClass("hideDiv");
    }
});

$('#ui_ddlCampaignTestGroup').change(function () {
    ShowPageLoading();
    WebPushScheduleUtil.CheckUniqueRecipient();
});

$("#ui_btnStep3Back").click(function () {
    ShowPageLoading();
    $("#ui_divCampaignStep1").addClass("hideDiv");
    $("#ui_divCampaignStep3").addClass("hideDiv");
    $("#ui_divAnalysisDetails").addClass("hideDiv");
    $("#ui_divCampaignStep2").removeClass("hideDiv");
    HidePageLoading();
});

$("#ui_btnStep3Submit").click(function () {
    WebPushScheduleUtil.SaveOrUpdateSendingSettings();
});

//#endregion Step3

