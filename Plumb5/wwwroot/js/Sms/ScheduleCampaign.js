
var AllGroupList = [];
var AllTemplateList = [];
var DeviceChart;
var TestGroupTotalMember = 0;
var GroupTotalMember = 0;
var TotalBatchSize = 4;

var EditCopyAction = "";
var EditCopySmsSendingSettingId = 0;
var EditCopySmsSendingSetting;
var EditCopyMultiBatchData;
var SmsBulkSentTimeSplitScheduleIdDeleteId = [];
var LatestMultipleBatch = [];
var TemplateContainsCounselorTags = false;

$(document).ready(function () {
    SmsScheduleUtil.IsSmsSettingsChecked();
});

var SmsScheduleUtil = {
    IsSmsSettingsChecked: function () {
        $.ajax({
            url: "/Sms/SmsSettings/CheckSmsSettingConfigured",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response) {
                    SmsScheduleUtil.Initialize();
                } else {
                    window.location.href = "/Sms/SmsSettings"
                }
            },
            error: ShowAjaxError
        });
    },
    GetSmsConfigurations: function () {
        $.ajax({
            url: "/Sms/SmsSettings/GetConfigurationNameList",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                var defaultId = 0;
                if (response != undefined && response != null) {
                    $("#ui_ddlCampaignSmsSettings").empty();
                    $("#ui_ddlCampaignSmsSettings").append(`<option value="0">Select Configuration Name</option>`);
                    $.each(response, function (i) {
                        $("#ui_ddlCampaignSmsSettings").append("<option value='" + response[i].Id + "'>" + response[i].ConfigurationName + "</option>");
                        if (response[i].IsDefaultProvider)
                            defaultId = response[i].Id;
                    });
                    $("#ui_ddlCampaignSmsSettings").select2().val(defaultId).change();
                }
            },
            error: ShowAjaxError
        });
    },
    Initialize: function () {
        SmsScheduleUtil.GetSmsConfigurations();
        EditCopyAction = urlParam("Action");
        EditCopySmsSendingSettingId = urlParam("Id");

        $("#ui_divCampaignStep3").addClass("hideDiv");
        $("#ui_divCampaignStep2").addClass("hideDiv");
        $("#ui_divCampaignStep1").removeClass("hideDiv");

        $("#ui_txtSingleSchedule").datepicker({
            defaultDate: "+1d",
            prevText: "click for previous months",
            nextText: "click for next months",
            showOtherMonths: true,
            selectOtherMonths: false,
            minDate: new Date()
        });

        $(document).on('focus', '.deliverydatebatch', function () {
            $(this).removeClass('hasDatepicker').datepicker({
                defaultDate: "+1d",
                prevText: "click for previous months",
                nextText: "click for next months",
                showOtherMonths: true,
                selectOtherMonths: false,
                minDate: new Date()
            });
        });

        $('#ui_txtSlider').ionRangeSlider({
            min: 1,
            max: 8,
            from: 4
        });

        if (EditCopySmsSendingSettingId != undefined && EditCopySmsSendingSettingId != null && EditCopySmsSendingSettingId != 0 && EditCopySmsSendingSettingId > 0 && EditCopyAction != undefined && EditCopyAction != null && EditCopyAction != "" && EditCopyAction != 0 && (EditCopyAction.toLowerCase() == "edit" || EditCopyAction.toLowerCase() == "copy")) {
            SmsScheduleUtil.EditCopyInitialize();
        } else {
            SmsScheduleUtil.CreateInitialize();
        }
    },
    CreateInitialize: function () {
        SmsScheduleUtil.CreateUniqueIdentifier();
        SmsScheduleUtil.GetCampaignList();
    },
    EditCopyInitialize: function () {
        $.ajax({
            url: "/Sms/ScheduleCampaign/GetSmsSendingSettingDetails",
            type: 'POST',
            data: JSON.stringify({
                'accountId': Plumb5AccountId, 'SmsSendingSettingId': EditCopySmsSendingSettingId
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != undefined && response != null) {
                    EditCopySmsSendingSetting = response;

                    if (EditCopySmsSendingSetting.IsPromotionalOrTransactionalType) {
                        $("#ui_rdbtnCamapignTransactional").prop("checked", true);
                    } else {
                        $("#ui_rdbtnCamapignPromotional").prop("checked", true);
                    }

                    if (EditCopyAction == "edit") {
                        $("#ui_txtCampaignIdentifier").val(EditCopySmsSendingSetting.Name);
                        $("#ui_txtCampaignIdentifier").addClass("disableDiv");

                        if (EditCopySmsSendingSetting.ScheduleBatchType != null && EditCopySmsSendingSetting.ScheduleBatchType.toLowerCase() == "single")
                            $("#ui_divGroups").removeClass("disableDiv");
                        else
                            $("#ui_divGroups").addClass("disableDiv");


                        if (EditCopySmsSendingSetting.SmsConfigurationNameId != null && parseInt(EditCopySmsSendingSetting.SmsConfigurationNameId) > 0)
                            $("#ui_ddlCampaignSmsSettings").select2().val(EditCopySmsSendingSetting.SmsConfigurationNameId).change();
                        //$("#ui_divContentType").addClass("disableDiv");
                    } else {
                        var CampaignIdentifierName = EditCopySmsSendingSetting.Name + "_COPY";
                        CampaignIdentifierName = CampaignIdentifierName.length > 50 ? CampaignIdentifierName.substring(0, 50) : CampaignIdentifierName;
                        $("#ui_txtCampaignIdentifier").val(CampaignIdentifierName);
                    }
                    if (EditCopySmsSendingSetting.ScheduleBatchType != null && EditCopySmsSendingSetting.ScheduleBatchType.toLowerCase() == "single") {
                        SmsScheduleUtil.GetCampaignList();
                    } else {
                        SmsScheduleUtil.GetScheduledMultiBatchDetails();
                    }
                }
            },
            error: ShowAjaxError
        });
    },
    GetScheduledMultiBatchDetails: function () {
        $.ajax({
            url: "/Sms/ScheduleCampaign/GetScheduledMultiBatchDetails",
            type: 'POST',
            data: JSON.stringify({
                'accountId': Plumb5AccountId, 'SmsSendingSettingId': EditCopySmsSendingSettingId
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != undefined && response != null) {
                    LatestMultipleBatch = EditCopyMultiBatchData = response;
                }
                SmsScheduleUtil.GetCampaignList();
            },
            error: ShowAjaxError
        });
    },
    CreateUniqueIdentifier: function () {
        var today = new Date();
        var strYear = today.getFullYear().toString() + today.getMonth().toString() + 1 + today.getDate().toString() + today.getMilliseconds().toString();
        $("#ui_txtCampaignIdentifier").val("Sms Campaign Identifier -" + strYear);
    },
    GetCampaignList: function () {
        $("#ui_ddlCampaign").html(`<option value="0">Select Campaign</option>`);
        $.ajax({
            url: "/Sms/ScheduleCampaign/GetCampaignList",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != undefined && response != null) {
                    $.each(response, function () {
                        $("#ui_ddlCampaign").append(`<option value="${$(this)[0].Id}">${$(this)[0].Name}</option>`);
                    });

                    if (EditCopySmsSendingSetting != undefined && EditCopySmsSendingSetting != null) {
                        $("#ui_ddlCampaign").val(EditCopySmsSendingSetting.CampaignId);
                        //if (EditCopyAction == "edit") {
                        //    $("#ui_ddlCampaign").addClass("disableDiv");
                        //    $('#ui_ddlCampaign').select2().prop("disabled", true);
                        //}
                    }
                }
                SmsScheduleUtil.GetGroupList();
            },
            error: ShowAjaxError
        });
    },
    GetGroupList: function () {
        $("#ui_ddlGroups").html('');
        $("#ui_ddlCampaignTestGroup").html(`<option value="0">Select Group</option>`);
        $.ajax({
            url: "/Sms/ScheduleCampaign/GetGroupList",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != undefined && response != null) {
                    AllGroupList = response;
                    $.each(response, function () {
                        $("#ui_ddlGroups").append(`<option value="${$(this)[0].Id}">${$(this)[0].Name}</option>`);
                        $("#ui_ddlCampaignTestGroup").append(`<option value="${$(this)[0].Id}">${$(this)[0].Name}</option>`);
                    });

                    if (EditCopySmsSendingSetting != undefined && EditCopySmsSendingSetting != null) {
                        $("#ui_ddlGroups").val(EditCopySmsSendingSetting.GroupId);

                        //if (EditCopyAction == "edit") {
                        //    $("#ui_ddlGroups").addClass("disableDiv");
                        //    $('#ui_ddlGroups').select2().prop("disabled", true);
                        //}

                        SmsScheduleUtil.GetUniqueRecipient();
                    }
                }
                SmsScheduleUtil.GetTemplateList();
            },
            error: ShowAjaxError
        });
    },
    GetTemplateList: function () {
        $("#ui_ddlTemplate").html(`<option value="0">Select Template</option>`);
        $.ajax({
            url: "/Sms/ScheduleCampaign/GetTemplateList",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != undefined && response != null && response.length > 0) {
                    AllTemplateList = response;

                    if (EditCopySmsSendingSetting != undefined && EditCopySmsSendingSetting != null) {
                        SmsScheduleUtil.BindTemplate();
                    }
                }
                SmsScheduleUtil.InitializeSelect2();
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },
    InitializeSelect2: function () {
        $('#ui_ddlCampaign,#ui_ddlTemplate,#ui_ddlCampaignTestGroup,#ui_ddlCampaignSmsSettings').select2({
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

        if (CampaignId != 0) {
            if ($("input[name='smsCampaignType']:checked").val() === "1") {
                $.each(AllTemplateList, function () {
                    if ($(this)[0].IsPromotionalOrTransactionalType && CampaignId == $(this)[0].SmsCampaignId) {
                        $("#ui_ddlTemplate").append(`<option value="${$(this)[0].Id}">${$(this)[0].Name}</option>`);
                    }
                });

                if (EditCopySmsSendingSetting != undefined && EditCopySmsSendingSetting != null) {
                    $("#ui_ddlTemplate").val(EditCopySmsSendingSetting.SmsTemplateId);
                }
            }
            else if ($("input[name='smsCampaignType']:checked").val() === "0") {
                $.each(AllTemplateList, function () {
                    if ((!$(this)[0].IsPromotionalOrTransactionalType) && CampaignId == $(this)[0].SmsCampaignId) {
                        $("#ui_ddlTemplate").append(`<option value="${$(this)[0].Id}">${$(this)[0].Name}</option>`);
                    }
                });

                if (EditCopySmsSendingSetting != undefined && EditCopySmsSendingSetting != null) {
                    $("#ui_ddlTemplate").val(EditCopySmsSendingSetting.SmsTemplateId);
                }
            }
        }
        HidePageLoading();
    },
    GetUniqueRecipient: function () {
        GroupTotalMember = 0;
        let ListOfGroupId = $('#ui_ddlGroups').select2("val");
        $("#ui_spanTotalSelectedGroup").html($("#ui_ddlGroups option:selected").length);
        if (ListOfGroupId != null) {
            $.ajax({
                url: "/Sms/ScheduleCampaign/GetUniquePhoneContact",
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
            ShowErrorMessage(GlobalErrorList.SmsSchedule.NoIdentifier);
            $("#ui_txtCampaignIdentifier").focus();
            return false;
        }

        if ($("#ui_ddlCampaign").val() == "" || $("#ui_ddlCampaign").val() == "0") {
            ShowErrorMessage(GlobalErrorList.SmsSchedule.NoCampaign);
            return false;
        }

        if (!$("input[name='smsCampaignType']").is(':checked')) {
            ShowErrorMessage(GlobalErrorList.SmsSchedule.NoCampaignType);
            return false;
        }

        if ($("#ui_ddlGroups").select2().val() == undefined || $("#ui_ddlGroups").select2().val() == null || $("#ui_ddlGroups").select2().val().toString() == "" || $("#ui_ddlGroups").select2().val().toString().length == "0" || $("#ui_ddlGroups").select2().val().length == 0) {
            ShowErrorMessage(GlobalErrorList.SmsSchedule.NoGroup);
            return false;
        }

        var totalContact = $("#ui_h1TotalUniqueRecipients").html();

        if (totalContact == undefined || totalContact == null || totalContact == "" || totalContact == "0" || parseInt(totalContact) <= 0) {
            ShowErrorMessage(GlobalErrorList.SmsSchedule.NoTestGroupContact);
            return false;
        }

        if ($("#ui_ddlTemplate").val() == null || $("#ui_ddlTemplate").val() == "" || $("#ui_ddlTemplate").val() == "0") {
            ShowErrorMessage(GlobalErrorList.SmsSchedule.NoTemplate);
            return false;
        }

        if (TemplateContainsCounselorTags) {
            ShowErrorMessage(GlobalErrorList.SmsSchedule.CounselorTags);
            return false;
        }

        return true;
    },
    CheckIdentifierUniqueness: function () {
        ShowPageLoading();
        var IdentifierName = CleanText($.trim($("#ui_txtCampaignIdentifier").val()));
        $.ajax({
            url: "/Sms/ScheduleCampaign/CheckIdentifierUniqueness",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'IdentifierName': IdentifierName }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != undefined && response != null && response || (EditCopySmsSendingSetting != undefined && EditCopySmsSendingSetting != null)) {
                    SmsScheduleUtil.ShowGroupAnalysisPopUp();
                } else {
                    ShowErrorMessage(GlobalErrorList.SmsSchedule.NoUniqueIdentifier);
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

            MultiSelectedGroupName = "Merged_" + MultiSelectedGroupName;
            $("#ui_txtGroupName").val(MultiSelectedGroupName);

            let MultiSelected = "";
            var selectedValue = $('#ui_ddlGroups').select2("data");
            for (var i = 0; i <= selectedValue.length - 1; i++) {
                if (i == 0) {
                    MultiSelected += selectedValue[i].text;
                } else {
                    MultiSelected += ", " + selectedValue[i].text;
                }
            }
            $("#ui_txtGroupDescription").val(MultiSelected);
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
    GetGroupAnalysisDetails: function () {
        if (DeviceChart) {
            DeviceChart.destroy();
        }

        $.ajax({
            url: "/Sms/ScheduleCampaign/GetGroupAnalysisDetails",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'GroupIds': $("#ui_ddlGroups").select2().val().toString() }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != undefined && response != null && response.Table != undefined && response.Table != null && response.Table.length > 0 && response.Table1 != undefined && response.Table1 != null && response.Table1.length > 0) {
                    $("#ui_SmallDeliveryRate").html(`Delivery Rate: ${Math.round(response.Table[0].TotalDeliveredRate).toString()}%`);
                    $("#ui_SmallClickedRate").html(`Click Rate: ${Math.round(response.Table[0].TotalClickedRate).toString()}%`);

                    let Delivered = parseFloat("0." + Math.round(response.Table[0].TotalDeliveredRate).toString());
                    let Clicked = parseFloat("0." + Math.round(response.Table[0].TotalClickedRate).toString());
                    createGauge(Delivered, "#chartgauge1");
                    createGauge(Clicked, "#chartgauge2");

                    let AndroidCount = response.Table1[0].TotalAndroid;
                    let IosCount = response.Table1[0].TotalIos;
                    let OtherCount = response.Table1[0].TotalOther;

                    SmsScheduleUtil.BindChart(AndroidCount, IosCount, OtherCount);

                } else {
                    $("#ui_SmallDeliveryRate").html(`Delivery Rate: 0%`);
                    $("#ui_SmallClickedRate").html(`Click Rate: 0%`);

                    createGauge(parseFloat(0.0), "#chartgauge1");
                    createGauge(parseFloat(0.0), "#chartgauge2");

                    SmsScheduleUtil.BindChart(0, 0, 0);
                }
                HidePageLoading();
            },
            error: ShowAjaxError
        });

        $("#ui_divAnalysisDetails").removeClass("hideDiv");
    },
    BindChart: function (AndroidCount, IosCount, OtherCount) {
        var data = [{
            data: [AndroidCount, IosCount, OtherCount],
            labels: ["Android", "iOS", "Others"],
            backgroundColor: [cssvar('--BarChart-BorderColor-Item1'), cssvar('--BarChart-BorderColor-Item3'), cssvar('--BarChart-BorderColor-Item4')],
            borderColor: "#fff"
        }];

        var options = {
            tooltips: {
                enabled: false
            },
            plugins: {
                datalabels: {
                    formatter: (value, ctx) => {

                        let sum = 0;
                        let dataArr = ctx.chart.data.datasets[0].data;
                        dataArr.map(data => {
                            sum += data;
                        });
                        let percentage = (value * 100 / sum).toFixed(2) + "%";
                        return percentage;
                    },
                    color: '#fff',
                }
            },
        };

        var ctx = document.getElementById("ui_canvasDeviceChart").getContext('2d');
        DeviceChart = new Chart(ctx, {
            type: 'pie',
            data: {
                datasets: data
            },
            options: options
        });
    },
    SaveMergedGroup: function () {
        if (CleanText($.trim($("#ui_txtGroupName").val())).length == 0) {
            ShowErrorMessage(GlobalErrorList.SmsSchedule.NoGroupName);
            HidePageLoading();
            return true;
        }

        if (CleanText($.trim($("#ui_txtGroupDescription").val())).length == 0) {
            ShowErrorMessage(GlobalErrorList.SmsSchedule.NoGroupDescription);
            HidePageLoading();
            return true;
        }

        if ($("#ui_ddlGroups").select2().val().length == 1) {
            ShowSuccessMessage(GlobalErrorList.SmsSchedule.MovingNext);
            SmsScheduleUtil.MoveToStep2();
        }
        else if ($("#ui_ddlGroups").select2().val().length > 1) {
            let groupDetails = { Name: CleanText($.trim($("#ui_txtGroupName").val())), GroupDescription: CleanText($.trim($("#ui_txtGroupDescription").val())) };

            $.ajax({
                url: "/Sms/ScheduleCampaign/GroupCreateAndMergeContact",
                type: 'POST',
                data: JSON.stringify({ 'accountId': Plumb5AccountId, 'ListOfGroupId': $('#ui_ddlGroups').select2().val().toString(), 'groupDetails': groupDetails }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) {
                    if (response != undefined && response != null) {
                        if (response.Result) {
                            ShowSuccessMessage(GlobalErrorList.SmsSchedule.MergedGroupSuccess);
                            AllGroupList.push(response.groupDetails);
                            $("#ui_ddlGroups").append(`<option value="${response.groupDetails.Id}">${response.groupDetails.Name}</option>`);
                            //$("#ui_ddlGroups").val(response.groupDetails.Id.toString()).trigger('change');
                            SmsScheduleUtil.MoveToStep2();
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
        /*$("#ui_ddlCampaignSmsSettings").select2().val(0).change();*/

        if (EditCopySmsSendingSetting != undefined && EditCopySmsSendingSetting != null) {
            $("#ui_divSingleBatch,#ui_divMultiBatch").addClass("hideDiv");
            if (EditCopySmsSendingSetting.ScheduleBatchType != null && EditCopySmsSendingSetting.ScheduleBatchType.toLowerCase() == "single") {
                $("#ui_rdbtnSingleBatch").prop("checked", true);

                var ScheduledDate = SmsScheduleUtil.GetDateValue(EditCopySmsSendingSetting.ScheduledDate);

                $("#ui_txtSingleSchedule").val(ScheduledDate[0]);
                $("#ui_ddlSingleBatchScheduleHour").val(ScheduledDate[1]);
                $("#ui_ddlSingleBatchScheduleMinute").val(ScheduledDate[2]);
                $("#ui_ddlSingleBatchScheduleAMPM").val(ScheduledDate[3]);

                if (EditCopySmsSendingSetting.ScheduleBatchType != null && EditCopySmsSendingSetting.ScheduleBatchType.toLowerCase() != "single") {
                    if (EditCopyAction == "edit") {
                        $("#ui_txtSingleSchedule").addClass("disableDiv");
                        $("#ui_divDeliveryTime").addClass("disableDiv");
                    }
                } else {
                    $("#ui_divBatchType").addClass("disableDiv");
                }

                $("#ui_divSingleBatch").removeClass("hideDiv");
            } else {
                $("#ui_rdbtnMultiBatch").prop("checked", true);
                $("#ui_divBatchType").addClass("disableDiv");
                TotalBatchSize = EditCopyMultiBatchData.length;

                $("#ui_txtSlider").data("ionRangeSlider").update({
                    from: TotalBatchSize
                });

                var BatchDivisionType = "Count";
                SmsScheduleUtil.MakeReadyOfBatchUI(BatchDivisionType, TotalBatchSize);
                SmsScheduleUtil.BindMultipleBatchDate(EditCopyMultiBatchData);

                if (EditCopyAction.toLowerCase() == "edit") {
                    $("#ui_divBatchDivision").addClass("disableDiv");
                    $(".numbervalues").addClass("disableDiv");
                    $(".ion-ios-close").addClass("disableDiv");
                }
                $("#ui_divMultiBatch").removeClass("hideDiv");
            }
        }

        HidePageLoading();
    },
    ValidateStep2SingleBatch: function () {
        if ($("#ui_txtSingleSchedule").val() == "" || $.trim($("#ui_txtSingleSchedule").val()).length == 0) {
            ShowErrorMessage(GlobalErrorList.SmsSchedule.NoSigleBatchDate);
            $("#ui_txtSingleSchedule").focus();
            HidePageLoading();
            return false;
        }

        var SelectedDateString = $("#ui_txtSingleSchedule").val().split("/");
        var ScheduleHour = $("#ui_ddlSingleBatchScheduleHour").val();
        var ScheduleMinute = $("#ui_ddlSingleBatchScheduleMinute").val();
        var ScheduleFormart = $("#ui_ddlSingleBatchScheduleAMPM").val();
        if (ScheduleFormart.toUpperCase() == "PM") {
            ScheduleHour = SmsScheduleUtil.ConvertHourTo24HourFormat(ScheduleHour);
        }

        var SelectedDate = new Date(SelectedDateString[2], parseInt(SelectedDateString[0]) - 1, SelectedDateString[1], ScheduleHour, ScheduleMinute, 59);
        if (SelectedDate <= new Date()) {
            ShowErrorMessage(GlobalErrorList.SmsSchedule.NoSingleGreaterDate);
            HidePageLoading();
            return false;
        }

        if (parseInt($("#ui_ddlCampaignSmsSettings").val()) == 0) {
            ShowErrorMessage(GlobalErrorList.SmsSchedule.SelectSmsProvider);
            HidePageLoading();
            return false;
        }

        SmsScheduleUtil.MoveToStep3();
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
        SmsScheduleUtil.BindTemplateContent();
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
                $("#ui_divAndroidTemplateContent").html(AllTemplateList[i].MessageContent);
                $("#ui_divIosTemplateContent").html(AllTemplateList[i].MessageContent);
                break;
            }
        }
    },
    CheckUniqueRecipient: function () {
        TestGroupTotalMember = 0;
        var TestGroupId = $('#ui_ddlCampaignTestGroup').select2().val();
        if (TestGroupId != null && TestGroupId != "0") {
            $.ajax({
                url: "/Sms/ScheduleCampaign/GetUniquePhoneContact",
                type: 'POST',
                data: JSON.stringify({ 'accountId': Plumb5AccountId, 'ListOfGroupId': TestGroupId.toString() }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) {
                    if (response != undefined && response != null) {
                        TestGroupTotalMember = parseInt(response);
                        if (TestGroupTotalMember == 0) {
                            ShowErrorMessage(GlobalErrorList.SmsSchedule.NoTestGroupContact);
                        } else if (TestGroupTotalMember > 30) {
                            ShowErrorMessage(GlobalErrorList.SmsSchedule.TestGroupMoreContact);
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
    MakeReadyOfBatchUI: function (BatchDivisionType, TotalBatch) {
        var TotalNumberOfRecord = 0;
        $("#ui_divBatchDetails").html("");
        if (BatchDivisionType == "Percent") {
            TotalNumberOfRecord = 100;
        } else {
            TotalNumberOfRecord = GroupTotalMember;
        }

        var eachCompleteRecord = Math.floor(TotalNumberOfRecord / TotalBatch);
        var remainingRecord = TotalNumberOfRecord % TotalBatch;

        for (var i = 1; i <= TotalBatch; i++) {
            if (i == TotalBatch) {
                eachCompleteRecord = eachCompleteRecord + remainingRecord;
            }

            SmsScheduleUtil.BindBatchDiv(eachCompleteRecord, i);

        }
        $("#ui_iconBatchDelete_1").remove();
    },
    ValidateStep2MultiBatch: function () {
        var AssignedTotal = 0;
        for (var i = 1; i <= TotalBatchSize; i++) {

            if ($("#ui_txtBatchRecord_" + i).val() == "" || $.trim($("#ui_txtBatchRecord_" + i).val()).length == 0) {
                ShowErrorMessage(GlobalErrorList.SmsSchedule.NoMultiBatchDataValue);
                $("#ui_txtBatchRecord_" + i).focus();
                HidePageLoading();
                return false;
            }

            if (!($.isNumeric($.trim($("#ui_txtBatchRecord_" + i).val())))) {
                ShowErrorMessage(GlobalErrorList.SmsSchedule.NoMultiBatchDataValueInt);
                $("#ui_txtBatchRecord_" + i).focus();
                HidePageLoading();
                return false;
            }

            AssignedTotal = AssignedTotal + parseInt($.trim($("#ui_txtBatchRecord_" + i).val()));

            if ($("#ui_txtBatchSchedule_" + i).val() == "" || $.trim($("#ui_txtBatchSchedule_" + i).val()).length == 0) {
                ShowErrorMessage(GlobalErrorList.SmsSchedule.NoMultiBatchDate);
                $("#ui_txtBatchSchedule_" + i).focus();
                HidePageLoading();
                return false;
            }

            if ($("#ui_ddlBatchScheduleHour_" + i).val() == "-1") {
                ShowErrorMessage(GlobalErrorList.SmsSchedule.NoMultiBatchHour);
                $("#ui_ddlBatchScheduleHour_" + i).focus();
                HidePageLoading();
                return false;
            }

            if ($("#ui_ddlBatchScheduleMinute_" + i).val() == "-1") {
                ShowErrorMessage(GlobalErrorList.SmsSchedule.NoMultiBatchMinute);
                $("#ui_ddlBatchScheduleMinute_" + i).focus();
                HidePageLoading();
                return false;
            }

            if ($("#ui_ddlBatchScheduleAMPM_" + i).val() == "-1") {
                ShowErrorMessage(GlobalErrorList.SmsSchedule.NoMultiBatchTimeFormat);
                $("#ui_ddlBatchScheduleAMPM_" + i).focus();
                HidePageLoading();
                return false;
            }

            var SelectedDateString = $("#ui_txtBatchSchedule_" + i).val().split("/");
            var ScheduleHour = $("#ui_ddlBatchScheduleHour_" + i).val();
            var ScheduleMinute = $("#ui_ddlBatchScheduleMinute_" + i).val();
            var ScheduleFormart = $("#ui_ddlBatchScheduleAMPM_" + i).val();
            if (ScheduleFormart.toUpperCase() == "PM") {
                ScheduleHour = SmsScheduleUtil.ConvertHourTo24HourFormat(ScheduleHour);
            }

            var SelectedDate = new Date(SelectedDateString[2], parseInt(SelectedDateString[0]) - 1, SelectedDateString[1], ScheduleHour, ScheduleMinute, 59);
            if (SelectedDate <= new Date()) {
                ShowErrorMessage(GlobalErrorList.SmsSchedule.NoMultiBatchGreaterDate);
                $("#ui_ddlBatchScheduleHour_" + i).focus();
                HidePageLoading();
                return false;
            }
        }

        if ($('input[name="BatchDivisionType"]:checked').val() == 0) {
            if (AssignedTotal != 100) {
                ShowErrorMessage(GlobalErrorList.SmsSchedule.NoMultiBatchDataPercentFull);
                $("#ui_txtBatchRecord_1").focus();
                HidePageLoading();
                return false;
            }
        }

        if ($('input[name="BatchDivisionType"]:checked').val() == 1) {
            if (AssignedTotal != GroupTotalMember) {
                ShowErrorMessage(GlobalErrorList.SmsSchedule.NoMultiBatchDataCountFull + " " + GroupTotalMember);
                $("#ui_txtBatchRecord_1").focus();
                HidePageLoading();
                return false;
            }
        }

        if (parseInt($("#ui_ddlCampaignSmsSettings").val()) == 0) {
            ShowErrorMessage(GlobalErrorList.SmsSchedule.SelectSmsProvider);
            HidePageLoading();
            return false;
        }

        SmsScheduleUtil.MoveToStep3();
    },
    SendIndividualTestSMS: function () {
        if ($("#ui_txtCampaignTestNumber").val() == "" || $.trim($("#ui_txtCampaignTestNumber").val()).length == 0) {
            ShowErrorMessage(GlobalErrorList.SmsSchedule.NoIndividualTestNumber);
            $("#ui_txtCampaignTestNumber").focus();
            HidePageLoading();
            return false;
        }

        var IsPromotionalOrTransactionalType;

        if ($("input[name='smsCampaignType']:checked").val() === "1") {
            IsPromotionalOrTransactionalType = true;
        }
        else {
            IsPromotionalOrTransactionalType = false;
        }

        var SmsTemplateId = parseInt($("#ui_ddlTemplate").val());
        var PhoneNumber = $.trim($("#ui_txtCampaignTestNumber").val());

        $.ajax({
            url: "/Sms/ScheduleCampaign/SendIndividualTestSMS",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'SmsTemplateId': SmsTemplateId, 'PhoneNumber': PhoneNumber, 'IsPromotionalOrTransactionalType': IsPromotionalOrTransactionalType, 'SmsConfigurationNameId': parseInt($("#ui_ddlCampaignSmsSettings").val()) }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response.SentStatus) {
                    var responseData = `<tr><td class="text-left td-icon">${PhoneNumber}</td><td>${response.ResponseId}</td></tr>`;
                    $("#ui_tbodyCampaignTestResultData").html(responseData);
                    ShowSuccessMessage(GlobalErrorList.SmsSchedule.TestMessageSuccess);
                }
                else {
                    var responseData = `<tr><td class="text-left td-icon">${PhoneNumber}</td><td>${response.Message}</td></tr>`;
                    $("#ui_tbodyCampaignTestResultData").html(responseData);
                    ShowErrorMessage(GlobalErrorList.SmsSchedule.TestMessageError);
                }
                $("#ui_divCampaignTestResult").removeClass("hideDiv");
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },
    SendGroupTestSMS: function () {
        var IsPromotionalOrTransactionalType;

        if ($("input[name='smsCampaignType']:checked").val() === "1") {
            IsPromotionalOrTransactionalType = true
        }
        else {
            IsPromotionalOrTransactionalType = false;
        }

        var smsSendingSetting = {
            IsPromotionalOrTransactionalType: IsPromotionalOrTransactionalType,
            GroupId: parseInt($("#ui_ddlCampaignTestGroup").val()),
            Name: $.trim($("#ui_txtCampaignIdentifier").val()),
            SmsTemplateId: parseInt($("#ui_ddlTemplate").val()),
            CampaignId: parseInt($("#ui_ddlCampaign").val()),
            ScheduleBatchType: "SINGLE",
            SmsConfigurationNameId: parseInt($("#ui_ddlCampaignSmsSettings").val())
        };

        $.ajax({
            url: "/Sms/ScheduleCampaign/SendGroupTestSMS",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'smsSendingSetting': smsSendingSetting }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != undefined && response != null) {
                    if (response.SentCount > 0 || response.FailureCount > 0 || response.UnsubscribedCount > 0) {
                        $("#ui_tbodyCampaignTestResultData").html("");
                        ShowSuccessMessage(response.Message);

                        if (response.ErrorList != undefined && response.ErrorList != null && response.ErrorList.length > 0) {
                            $.each(response.ErrorList, function () {
                                var responseData = `<tr><td class="text-left td-icon">${$(this)[0].Item1}</td><td>${$(this)[0].Item2}</td></tr>`;
                                $("#ui_tbodyCampaignTestResultData").append(responseData);
                            });
                        }

                        if (response.SuccessList != undefined && response.SuccessList != null && response.SuccessList.length > 0) {
                            $.each(response.SuccessList, function () {
                                var responseData = `<tr><td class="text-left td-icon">${$(this)[0].Item1}</td><td>${$(this)[0].Item2}</td></tr>`;
                                $("#ui_tbodyCampaignTestResultData").append(responseData);
                            });
                        }

                        $("#ui_divCampaignTestResult").removeClass("hideDiv");
                    } else {
                        ShowErrorMessage(response.Message);
                    }
                } else {
                    ShowErrorMessage(GlobalErrorList.SmsSchedule.GroupTestMessageError);
                }
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },
    AddingPrefixZero: function (n) {
        return (n < 10) ? ("0" + n) : n;
    },
    SaveSingleScheduleSMS: function () {
        var IsPromotionalOrTransactionalType;

        if ($('input[name="smsCampaignType"]:checked').val() == 1) {
            IsPromotionalOrTransactionalType = true;
        }
        else {
            IsPromotionalOrTransactionalType = false;
        }

        var SelectedDateString = $("#ui_txtSingleSchedule").val().split("/");
        var ScheduleHour = $("#ui_ddlSingleBatchScheduleHour").val();
        var ScheduleMinute = $("#ui_ddlSingleBatchScheduleMinute").val();
        var ScheduleFormart = $("#ui_ddlSingleBatchScheduleAMPM").val();
        if (ScheduleFormart.toUpperCase() == "PM") {
            ScheduleHour = SmsScheduleUtil.ConvertHourTo24HourFormat(ScheduleHour);
        }

        var SelectedDate = new Date(SelectedDateString[2], parseInt(SelectedDateString[0]) - 1, SelectedDateString[1], ScheduleHour, ScheduleMinute, 00);
        SelectedDate = ConvertDateTimeToUTC(SelectedDate.getFullYear() + '-' + SmsScheduleUtil.AddingPrefixZero((SelectedDate.getMonth() + 1)) + '-' + SmsScheduleUtil.AddingPrefixZero(SelectedDate.getDate()) + " " + SmsScheduleUtil.AddingPrefixZero(SelectedDate.getHours()) + ":" + SmsScheduleUtil.AddingPrefixZero(SelectedDate.getMinutes()) + ":" + SmsScheduleUtil.AddingPrefixZero(SelectedDate.getSeconds()));
        var ScheduledDate = SelectedDate.getFullYear() + '-' + SmsScheduleUtil.AddingPrefixZero((SelectedDate.getMonth() + 1)) + '-' + SmsScheduleUtil.AddingPrefixZero(SelectedDate.getDate()) + " " + SmsScheduleUtil.AddingPrefixZero(SelectedDate.getHours()) + ":" + SmsScheduleUtil.AddingPrefixZero(SelectedDate.getMinutes()) + ":" + SmsScheduleUtil.AddingPrefixZero(SelectedDate.getSeconds());


        var smsSendingSetting = {
            Name: $.trim($("#ui_txtCampaignIdentifier").val()),
            SmsTemplateId: parseInt($("#ui_ddlTemplate").val()),
            GroupId: parseInt($("#ui_ddlGroups").select2().val()[0]),
            IsPromotionalOrTransactionalType: IsPromotionalOrTransactionalType,
            CampaignId: parseInt($("#ui_ddlCampaign").val()),
            ScheduledDate: ScheduledDate,
            ScheduledStatus: 1,
            TotalContact: GroupTotalMember,
            ScheduleBatchType: "SINGLE",
            Id: EditCopySmsSendingSettingId,
            SmsConfigurationNameId: parseInt($("#ui_ddlCampaignSmsSettings").val())
        };

        $.ajax({
            url: "/Sms/ScheduleCampaign/SaveSingleScheduleSMS",
            type: 'POST',
            data: JSON.stringify({
                'accountId': Plumb5AccountId, 'smsSendingSetting': smsSendingSetting, 'EditCopyAction': EditCopyAction.toString()
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                var response = data.smsSendingSetting;
                if (response != undefined && response != null && EditCopyAction != "edit") {
                    if (response.Id > 0) {
                        ShowSuccessMessage(GlobalErrorList.SmsSchedule.CampaignScheduledSuccess);
                        setTimeout(function () { window.location.href = "/Sms/schedules" }, 3000);
                    } else if (response.Id == -1) {
                        ShowErrorMessage(GlobalErrorList.SmsSchedule.CampaignExists);
                        HidePageLoading();
                    } else {
                        ShowErrorMessage(GlobalErrorList.SmsSchedule.CampaignScheduledError);
                        HidePageLoading();
                    }
                } else if (response != undefined && response != null && EditCopyAction == "edit" && data.result == true) {
                    ShowSuccessMessage(GlobalErrorList.SmsSchedule.CampaignScheduledSuccess);
                    setTimeout(function () { window.location.href = "/Sms/schedules" }, 3000);
                } else {
                    ShowErrorMessage(GlobalErrorList.SmsSchedule.CampaignScheduledError);
                    HidePageLoading();
                }
            },
            error: ShowAjaxError
        });

    },
    SaveMultiBatchScheduleSMS: function () {
        var IsPromotionalOrTransactionalType;

        if ($('input[name="smsCampaignType"]:checked').val() == 1) {
            IsPromotionalOrTransactionalType = true;
        }
        else {
            IsPromotionalOrTransactionalType = false;
        }

        var smsSendingSetting = {
            Name: $.trim($("#ui_txtCampaignIdentifier").val()),
            SmsTemplateId: parseInt($("#ui_ddlTemplate").val()),
            GroupId: parseInt($("#ui_ddlGroups").select2().val()[0]),
            IsPromotionalOrTransactionalType: IsPromotionalOrTransactionalType,
            CampaignId: parseInt($("#ui_ddlCampaign").val()),
            TotalContact: GroupTotalMember,
            ScheduleBatchType: "MULTIPLE",
            Id: EditCopySmsSendingSettingId,
            SmsConfigurationNameId: parseInt($("#ui_ddlCampaignSmsSettings").val())
        };

        var SmsBulkSentTimeSplitSchedule = [];
        var totaloffset = 0;
        for (var i = 1; i <= TotalBatchSize; i++) {
            var eachSplit = { Id: 0, IsPercentageORCount: false, ValueOfPercentOrCount: 0, OffSet: 0, FetchNext: 0, IsBulkIntialized: null, ScheduleDate: null };

            eachSplit.ValueOfPercentOrCount = $.trim($("#ui_txtBatchRecord_" + i).val());

            var preloop = i - 1;

            if (i > 1) {
                totaloffset = totaloffset + parseInt($.trim($("#ui_txtBatchRecord_" + preloop).val()))
            }

            var start = totaloffset;
            var rowlength = $.trim($("#ui_txtBatchRecord_" + i).val());

            eachSplit.OffSet = start;
            eachSplit.FetchNext = rowlength;

            var SelectedDateString = $("#ui_txtBatchSchedule_" + i).val().split("/");
            var ScheduleHour = $("#ui_ddlBatchScheduleHour_" + i).val();
            var ScheduleMinute = $("#ui_ddlBatchScheduleMinute_" + i).val();
            var ScheduleFormart = $("#ui_ddlBatchScheduleAMPM_" + i).val();
            if (ScheduleFormart.toUpperCase() == "PM") {
                ScheduleHour = SmsScheduleUtil.ConvertHourTo24HourFormat(ScheduleHour);
            }

            var SelectedDate = new Date(SelectedDateString[2], parseInt(SelectedDateString[0]) - 1, SelectedDateString[1], ScheduleHour, ScheduleMinute, 00);
            SelectedDate = ConvertDateTimeToUTC(SelectedDate.getFullYear() + '-' + SmsScheduleUtil.AddingPrefixZero((SelectedDate.getMonth() + 1)) + '-' + SmsScheduleUtil.AddingPrefixZero(SelectedDate.getDate()) + " " + SmsScheduleUtil.AddingPrefixZero(SelectedDate.getHours()) + ":" + SmsScheduleUtil.AddingPrefixZero(SelectedDate.getMinutes()) + ":" + SmsScheduleUtil.AddingPrefixZero(SelectedDate.getSeconds()));
            var ScheduledDate = SelectedDate.getFullYear() + '-' + SmsScheduleUtil.AddingPrefixZero((SelectedDate.getMonth() + 1)) + '-' + SmsScheduleUtil.AddingPrefixZero(SelectedDate.getDate()) + " " + SmsScheduleUtil.AddingPrefixZero(SelectedDate.getHours()) + ":" + SmsScheduleUtil.AddingPrefixZero(SelectedDate.getMinutes()) + ":" + SmsScheduleUtil.AddingPrefixZero(SelectedDate.getSeconds());

            eachSplit.ScheduleDate = ScheduledDate;
            let id = $("#ui_divBatch_" + i).attr("smsbulksenttimesplitscheduleid_" + i);
            if (id != "0") {
                eachSplit.Id = id;
                for (let i = 0; i < EditCopyMultiBatchData.length; i++) {
                    if (id == EditCopyMultiBatchData[i].Id) {
                        eachSplit.IsBulkIntialized = EditCopyMultiBatchData[i].IsBulkIntialized;
                    }
                }
            }

            SmsBulkSentTimeSplitSchedule.push(eachSplit);
        }

        $.ajax({
            url: "/Sms/ScheduleCampaign/SaveMultiBatchScheduleSMS",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'smsSendingSetting': smsSendingSetting, 'smsTimeSplitScheduled': SmsBulkSentTimeSplitSchedule, 'EditCopyAction': EditCopyAction.toString() }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != undefined && response != null) {
                    if (response.Status) {
                        ShowSuccessMessage(GlobalErrorList.SmsSchedule.CampaignScheduledSuccess);
                        setTimeout(function () { ShowSuccessMessage(response.Message) }, 30);
                        setTimeout(function () { window.location.href = "/Sms/schedules" }, 3000);
                    } else if (!response.Status) {
                        ShowErrorMessage(response.Message);
                        HidePageLoading();
                    }
                }
                else {
                    ShowErrorMessage(GlobalErrorList.SmsSchedule.CampaignScheduledError);
                    HidePageLoading();
                }
            },
            error: ShowAjaxError
        });
    },
    GetDateValue: function (ScheduledDate) {
        let date = GetJavaScriptDateObj(ScheduledDate);
        let TimeFormate = "AM";
        if (date.getHours() > 11) {
            TimeFormate = "PM";
        }

        let time = date.getHours().toString().length == 1 ? "0" + date.getHours().toString() : date.getHours().toString();
        time = SmsScheduleUtil.GetHoursFormate(TimeFormate, time);
        let minutes = date.getMinutes().toString().length == 1 ? "0" + date.getMinutes().toString() : date.getMinutes().toString();
        date = parseInt(date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();
        return [date, time, minutes, TimeFormate];
    },
    GetHoursFormate: function (Formart, hour) {
        if (Formart.toLowerCase() == "pm") {
            switch (hour) {
                case "13":
                    hour = "01";
                    break;
                case "14":
                    hour = "02";
                    break;
                case "15":
                    hour = "03";
                    break;
                case "16":
                    hour = "04";
                    break;
                case "17":
                    hour = "05";
                    break;
                case "18":
                    hour = "06";
                    break;
                case "19":
                    hour = "07";
                    break;
                case "20":
                    hour = "08";
                    break;
                case "21":
                    hour = "09";
                    break;
                case "22":
                    hour = "10";
                    break;
                case "23":
                    hour = "11";
                    break;
                default: hour;
            }
        }

        return hour;
    },
    BindMultipleBatchDate: function (MutlipleBatchSchedule) {
        if (MutlipleBatchSchedule != undefined && MutlipleBatchSchedule != null && MutlipleBatchSchedule.length > 0) {
            let j = 1;
            for (let i = 0; i < MutlipleBatchSchedule.length; i++) {

                if (EditCopyAction.toLowerCase() == "edit" && MutlipleBatchSchedule[i].IsBulkIntialized) {
                    $("#ui_divBatch_" + j).addClass("disableDiv");
                    $("#ui_txtBatchRecord_" + j).val(MutlipleBatchSchedule[i].FetchNext);
                }

                var ScheduledDate = SmsScheduleUtil.GetDateValue(MutlipleBatchSchedule[i].ScheduleDate);

                $("#ui_txtBatchSchedule_" + j).val(ScheduledDate[0]);
                $("#ui_ddlBatchScheduleHour_" + j).val(ScheduledDate[1]);
                $("#ui_ddlBatchScheduleMinute_" + j).val(ScheduledDate[2]);
                $("#ui_ddlBatchScheduleAMPM_" + j).val(ScheduledDate[3]);

                $("#ui_divBatch_" + j).attr("SmsBulkSentTimeSplitScheduleId_" + j, MutlipleBatchSchedule[i].Id);
                j++;
            }
        }
    },
    DeleteMultipleBatch: function (Id) {
        let BulkSplitedId = parseInt($("#ui_divBatch_" + Id).attr("smsbulksenttimesplitscheduleid_" + Id));
        SmsBulkSentTimeSplitScheduleIdDeleteId.push(BulkSplitedId);

        let RecentMultiBatch = EditCopyMultiBatchData;


        if (RecentMultiBatch != undefined && RecentMultiBatch != null && RecentMultiBatch.length > 0) {
            for (let i = 0; i < RecentMultiBatch.length; i++) {
                if (EditCopyMultiBatchData[i].Id == BulkSplitedId) {
                    RecentMultiBatch.splice(i, 1);
                }
            }
        }

        TotalBatchSize = TotalBatchSize - 1;
        $("#ui_txtSlider").data("ionRangeSlider").update({
            from: TotalBatchSize
        });

        if (RecentMultiBatch != undefined && RecentMultiBatch != null && RecentMultiBatch.length > 0) {
            LatestMultipleBatch = RecentMultiBatch;
            SmsScheduleUtil.BindMultipleBatchDate(RecentMultiBatch);
        }
    },
    BindLatesBatchList: function () {
        if (EditCopyAction != undefined && EditCopyAction != null && (EditCopyAction.toString().toLowerCase() == "edit" || EditCopyAction.toString().toLowerCase() == "copy")) {
            if (LatestMultipleBatch.length > TotalBatchSize) {
                for (let i = 0; i < LatestMultipleBatch.length; i++) {
                    if (LatestMultipleBatch[i].IsBulkIntialized == false) {
                        if (!((i + 1) <= TotalBatchSize)) {
                            LatestMultipleBatch.splice(i, 1);
                        }
                    }
                }
            }
            SmsScheduleUtil.BindMultipleBatchDate(LatestMultipleBatch);
        }
    },
    BindBatchDiv: function (eachCompleteRecord, i) {
        let j = 0;
        let eachBatchDiv = `
                            <div class="batchtxtwrap" id="ui_divBatch_${i}" SmsBulkSentTimeSplitScheduleId_${i}="${j}">
                                <div class="btchnumwrp m-mb-5px">
                                    <input type="text" class="form-control form-control-lg numbervalues" value="${eachCompleteRecord}" id="ui_txtBatchRecord_${i}" />
                                </div>
                                <div class="btchtextbx w-100 mr-2 m-mb-5px">
	                                <div class="form-group">
		                                <input type="text" placeholder="Schedule Date" class="form-control form-control-lg deliverydatebatch"  id="ui_txtBatchSchedule_${i}" readonly />
	                                </div>
                                </div>
                                <div class="timwrap">
                                    <div class="d-flex align-items-center">
                                        <div class="hourwrap mr-2">
	                                        <select class="form-control splittimesscheduleselect" index="${i}" id="ui_ddlBatchScheduleHour_${i}">
	                                            <option value="-1">Hours</option>
	                                            <option value="01">01</option>
	                                            <option value="02">02</option>
	                                            <option value="03">03</option>
	                                            <option value="04">04</option>
	                                            <option value="05">05</option>
	                                            <option value="06">06</option>
	                                            <option value="07">07</option>
	                                            <option value="08">08</option>
	                                            <option value="09">09</option>
	                                            <option value="10">10</option>
	                                            <option value="11">11</option>
	                                            <option value="12">12</option>
	                                        </select>
                                        </div>
                                        <div class="minwrap mr-2">
	                                        <select class="form-control" id="ui_ddlBatchScheduleMinute_${i}">
	                                            <option value="-1">Minutes</option>
	                                            <option value="00">00</option>
	                                            <option value="05">05</option>
                                                <option value="10">10</option>
	                                            <option value="15">15</option>
                                                <option value="20">20</option>
                                                <option value="25">25</option>
                                                <option value="30">30</option>
	                                            <option value="35">35</option>
                                                <option value="40">40</option>
                                                <option value="45">45</option>
                                                <option value="50">50</option>
	                                            <option value="55">55</option>
	                                        </select>
                                        </div>
                                        <div class="secondwrap mr-2">
	                                        <select class="form-control splittimesschedule" index="${i}" id="ui_ddlBatchScheduleAMPM_${i}">
                                                <option value="PM">PM</option>
                                                <option value="AM" id="ui_timehideAMOptionsplit_${i}">AM</option>	                                            
	                                        </select>
                                        </div>
                                        <div class="clsewrpbth">
                                            <i class="icon ion-ios-close" id="ui_iconBatchDelete_${i}" onclick="SmsScheduleUtil.DeleteMultipleBatch(${i})"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>`;
        $("#ui_divBatchDetails").append(eachBatchDiv);
    },
    CheckCredits: function () {
        $.ajax({
            url: "/Sms/ScheduleCampaign/CheckCredits",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'TotalContacts': parseInt($("#ui_h1TotalUniqueRecipients").html()) }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != undefined && response != null) {
                    if (response.Status == false) {
                        //alert("Insufficient Credits");
                        ShowErrorMessage(GlobalErrorList.SmsSchedule.NoCredits);
                        return false;
                    } else {
                        ShowPageLoading();
                        if (!SmsScheduleUtil.ValidateStep1()) {
                            HidePageLoading();
                            return true;
                        }

                        SmsScheduleUtil.CheckIdentifierUniqueness();
                    }
                }

            },
            error: ShowAjaxError
        });
    },
    CheckTemplateContainsCounselorTags(SmsTemplateId) {
        ShowPageLoading();

        var SmsTemplate = { Id: SmsTemplateId };
        $.ajax({
            url: "/SMS/Template/CheckCounselorTags",
            type: 'POST',
            data: JSON.stringify({ 'smsTemplate': SmsTemplate }),
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                if (response) {
                    TemplateContainsCounselorTags = true;
                    $("#ui_btnStep1Next").prop('disabled', true);
                    ShowErrorMessage(GlobalErrorList.SmsSchedule.CounselorTags);
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

//#region Step1
$("#ui_ddlCampaign").change(function () {
    var CampaignId = parseInt($("#ui_ddlCampaign").val());

    if (CampaignId == 0) {
        $("#ui_ddlTemplate").html(`<option value="0">Select Template</option>`);
        $("#ui_rdbtnCamapignPromotional,#ui_rdbtnCamapignTransactional").prop('checked', false);
    }
    else {
        ShowPageLoading();
        SmsScheduleUtil.BindTemplate();
    }
});

$('input[type=radio][name=smsCampaignType]').change(function () {
    if ($("#ui_ddlCampaign").val() != "0" && $("#ui_ddlCampaign").val() != "" || parseInt($("#ui_ddlCampaign").val()) > 0) {
        ShowPageLoading();
        SmsScheduleUtil.BindTemplate();
    }
    else {
        ShowErrorMessage(GlobalErrorList.SmsSchedule.NoCampaign);
        $(this).prop('checked', false);
    }
});

$('#ui_ddlGroups').on("change", function (e) {
    ShowPageLoading();
    SmsScheduleUtil.GetUniqueRecipient();
});

$('#ui_ddlTemplate').change(function () {
    if ($("#ui_ddlTemplate").val() > 0)
        SmsScheduleUtil.CheckTemplateContainsCounselorTags($("#ui_ddlTemplate").val())
})

$("#ui_btnStep1Next").click(function () {
    SmsScheduleUtil.CheckCredits();
});

$("#ui_iconCloseAnalysisPopUp").click(function () {
    SmsScheduleUtil.HideGroupAnalysisPopUp();
});

$("#ui_btnCloseAnalysisPopUp").click(function () {
    SmsScheduleUtil.HideGroupAnalysisPopUp();
});

$("#ui_aAnalyze").click(function () {
    ShowPageLoading();
    SmsScheduleUtil.GetGroupAnalysisDetails();
});

$("#ui_btnGroupAnalysisNext").click(function () {
    ShowPageLoading();
    SmsScheduleUtil.SaveMergedGroup();
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

$('input[name=CampaignBatchType]').change(function () {
    $("#ui_divSingleBatch").addClass("hideDiv");
    $("#ui_divMultiBatch").addClass("hideDiv");
    if ($(this).val() == '0') {
        $("#ui_divSingleBatch").removeClass("hideDiv");
    } else if ($(this).val() == '1') {
        if (GroupTotalMember >= 4) {
            TotalBatchSize = 4;
        } else {
            TotalBatchSize = GroupTotalMember;
        }

        $("#ui_txtSlider").data("ionRangeSlider").update({
            from: TotalBatchSize
        });

        var BatchDivisionType = "Percent";
        if ($('input[name="BatchDivisionType"]:checked').val() == 1) {
            BatchDivisionType = "Count";
        }
        SmsScheduleUtil.MakeReadyOfBatchUI(BatchDivisionType, TotalBatchSize);
        $("#ui_divMultiBatch").removeClass("hideDiv");
    }
});

$('input[name="BatchDivisionType"]').change(function () {
    var BatchDivisionType = "Percent";
    if ($(this).val() == '1') {
        BatchDivisionType = "Count";
    }
    SmsScheduleUtil.MakeReadyOfBatchUI(BatchDivisionType, TotalBatchSize);
    if (EditCopyAction != undefined && EditCopyAction != null && EditCopyAction.toLowerCase() == "edit") {
        SmsScheduleUtil.BindMultipleBatchDate(LatestMultipleBatch);
    }
});

$('#ui_txtSlider').change(function () {
    TotalBatchSize = $(this).val();
    var BatchDivisionType = "Percent";
    if ($('input[name="BatchDivisionType"]:checked').val() == 1) {
        BatchDivisionType = "Count";
    }

    if (GroupTotalMember > TotalBatchSize) {
        SmsScheduleUtil.MakeReadyOfBatchUI(BatchDivisionType, TotalBatchSize);
        SmsScheduleUtil.BindLatesBatchList();
    } else {
        ShowErrorMessage(GlobalErrorList.SmsSchedule.GroupCountGreaterThanBatch);
    }
})

//$(document).on("click", "[id^='ui_iconBatchDelete_']", function () {
//    TotalBatchSize = TotalBatchSize - 1;
//    SmsBulkSentTimeSplitScheduleIdDeleteId.push();
//    $("#ui_txtSlider").data("ionRangeSlider").update({
//        from: TotalBatchSize
//    });
//    //var clickedRowNumber = (this.id).replace('ui_iconBatchDelete_', '');
//    //$("#ui_divBatch_" + clickedRowNumber).remove();
//});

$("#ui_btnStep2Back").click(function () {
    ShowPageLoading();
    $("#ui_divCampaignStep3").addClass("hideDiv");
    $("#ui_divCampaignStep2").addClass("hideDiv");
    $("#ui_divAnalysisDetails").addClass("hideDiv");
    $("#ui_divCampaignStep1").removeClass("hideDiv");
    HidePageLoading();
});

$("#ui_btnStep2Next").click(function () {
    ShowPageLoading();

    if ($('input[name="CampaignBatchType"]:checked').val() == 0) {
        SmsScheduleUtil.ValidateStep2SingleBatch();
    } else {
        SmsScheduleUtil.ValidateStep2MultiBatch();
    }
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
    SmsScheduleUtil.CheckUniqueRecipient();
});

$("#ui_btnStep3Back").click(function () {
    ShowPageLoading();
    $("#ui_divCampaignStep1").addClass("hideDiv");
    $("#ui_divCampaignStep3").addClass("hideDiv");
    $("#ui_divAnalysisDetails").addClass("hideDiv");
    $("#ui_divCampaignStep2").removeClass("hideDiv");
    HidePageLoading();
});

$("#ui_btnTestCampaign").click(function () {
    ShowPageLoading();
    if ($('input[name="TestCampaignType"]:checked').val() == 0) {
        SmsScheduleUtil.SendIndividualTestSMS();
    } else {
        SmsScheduleUtil.SendGroupTestSMS();
    }
});

$("#ui_btnShowTestResult").click(function () {
    $("#ui_divCampaignResultDetails").removeClass("hideDiv");
});

$("#ui_iconCloseCampaignResultPopUp").click(function () {
    $("#ui_divCampaignResultDetails").addClass("hideDiv");
});

$("#ui_btnStep3Submit").click(function () {
    ShowPageLoading();

    if ($('input[name="CampaignBatchType"]:checked').val() == 0) {
        SmsScheduleUtil.SaveSingleScheduleSMS();
    } else {
        SmsScheduleUtil.SaveMultiBatchScheduleSMS();
    }
});

//#endregion Step3

$('#ui_ddlGroups').select2({
    minimumResultsForSearch: '',
    dropdownAutoWidth: false
});


$(document).on('change', '#ui_ddlSingleBatchScheduleHour,.splittimesscheduleselect', function () {
    let scheduleHour = $(this).val();
    let index = $(this).attr("index");
    $(`#ui_ddlSingleBatchScheduleAMPM,#ui_ddlBatchScheduleAMPM_${index}`).val("PM").change();
    if (scheduleHour == "12") {
        $(`#ui_timehideAMOption,#ui_timehideAMOptionsplit_${index}`).hide();
    } else {
        $(`#ui_timehideAMOption,#ui_timehideAMOptionsplit_${index}`).show();
    }
});