var MailSendingSetting = { Id: 0, Name: "", MailTemplateId: 0, GroupId: 0, Subject: "", FromName: "", FromEmailId: "", Subscribe: true, Forward: false, ReplyTo: "", IsPromotionalOrTransactionalType: 1, CampaignId: 0, ScheduledDate: "", ScheduledStatus: 1, IsMailSplit: false, SplitContactPercentage: 0, SplitIdentifier: null, SplitVariation: null, ABWinningMetricRate: "", ABTestDuration: 0, FallbackTemplate: "" };

var MailSendingSettingABSplit = {
    Id: 0, Name: "", MailTemplateId: 0, GroupId: 0, Subject: "", FromName: "", FromEmailId: "", Subscribe: true, Forward: false, ReplyTo: "", IsPromotionalOrTransactionalType: true, CampaignId: 0, ScheduledDate: "", ScheduledStatus: 1, IsMailSplit: false, SplitContactPercentage: 0, SplitIdentifier: null, SplitVariation: null, ABWinningMetricRate: "", ABTestDuration: 0, FallbackTemplate: ""
};

var MailSendingSplitSetting = { AMailTemplateId: 0, BMailTemplateId: 0, ASplitContactPercentage: 10, BSplitContactPercentage: 10, ASplitVariation: "A", BSplitVariation: "B" };

var MailSendingSettingSplit = [];
var MailTemplatesList = [];
var GroupList = [];
var MailTemplateSpamScore = { Id: 0, SpamScore: 0 };
var AMailTemplateSpamScore = { Id: 0, SpamScore: 0 };
var BMailTemplateSpamScore = { Id: 0, SpamScore: 0 };
var IsDuplicateCopy = 0;
var MailTemplateContainsCounselorTags = false;
var AMailTemplateContainsCounselorTags = false;
var BMailTemplateContainsCounselorTags = false;
var MailScheduleStatus = 0;

var mailUtil = {
    IsMailSettingsChecked: function () {
        $.ajax({
            url: "/Mail/MailSettings/CheckMailSettingConfigured",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response) {
                    if (MailSendingSetting.Id > 0) {
                        mailUtil.BindCampaign();
                    } else {
                        mailUtil.CreateUniqueIdentifier();
                        mailUtil.BindCampaign();
                    }
                } else {
                    window.location.href = "/Mail/MailSettings";
                }
            },
            error: ShowAjaxError
        });
    },
    GetMailConfigurationName: function () {
        $.ajax({
            url: "/Mail/MailSettings/GetConfigurationNames",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                var defaultId = 0;
                if (response != undefined && response != null) {
                    $("#ui_ConfigurationName").empty();
                    $("#ui_ConfigurationName").append(`<option value="0">Select Configuration Name</option>`);
                    $.each(response, function (i) {
                        $("#ui_ConfigurationName").append("<option value='" + response[i].Id + "'>" + response[i].ConfigurationName + "</option>");
                        if (response[i].IsDefaultProvider)
                            defaultId = response[i].Id;
                    });
                    $("#ui_ConfigurationName").select2().val(defaultId).change();
                }
                mailUtil.BindGroups();
            },
            error: ShowAjaxError
        });
    },
    BindCampaign: function () {
        $.ajax({
            url: "/Mail/MailTemplate/GetMailCampaignList",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != undefined && response != null) {
                    $.each(response, function () {
                        $("#addCampName").append(`<option value="${$(this)[0].Id}">${$(this)[0].Name}</option>`);
                    });
                }
                mailUtil.GetMailConfigurationName();
            },
            error: ShowAjaxError
        });
    },

    BindGroups: function () {
        $.ajax({
            url: "/Mail/Group/GetGroupList",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != undefined && response != null) {
                    GroupList = response;
                    $.each(response, function () {
                        $("#addgroupname,#testcampgroupname").append(`<option value="${$(this)[0].Id}">${$(this)[0].Name}</option>`);
                    });
                }
                mailUtil.BindFormActiveEmailId();
            },
            error: ShowAjaxError
        });
    },

    BindFormActiveEmailId: function () {
        $.ajax({
            url: "/Mail/MailSchedule/GetActiveEmailIds",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (FromEmailActive) {
                if (FromEmailActive != undefined && FromEmailActive != null) {
                    $.each(FromEmailActive, function (i) {
                        $("#ui_FromEmailIdActive").append(`<option value="${FromEmailActive[i]}">${FromEmailActive[i]}</option>`);
                    });
                }
                mailUtil.BindMailTemplate();
            },
            error: ShowAjaxError
        });
    },

    BindMailTemplate: function () {
        $.ajax({
            url: "/Mail/MailTemplate/GetAllTemplateList",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (TemplateList) {
                if (TemplateList != undefined && TemplateList != null && TemplateList.length > 0) {
                    MailTemplatesList = TemplateList;
                }

                if (MailSendingSetting.Id > 0) {
                    mailUtil.InitializeCampaignForEdit(MailSendingSetting.Id);
                }
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },

    CreateUniqueIdentifier: function () {
        var today = new Date();
        var strYear = today.getFullYear().toString() + today.getMonth().toString() + 1 + today.getDate().toString() + today.getMilliseconds().toString();
        $("#ui_txtCampaignIdentifier").val("Mail Campaign Identifier -" + strYear);
    },

    InitializeCampaignForEdit: function (MailSendingSettingId) {
        $.ajax({
            url: "/Mail/MailSchedule/GetMailScheduleDetails",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'MailSendingSettingId': MailSendingSettingId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: mailUtil.BindMailTemplateForCampaign,
            error: ShowAjaxError
        });
    },

    BindMailTemplateForCampaign: function BindTemplate(MailSendingSettingDetails) {
        if (MailSendingSettingDetails != undefined && MailSendingSettingDetails != null && MailSendingSettingDetails.length > 0) {
            if (IsDuplicateCopy == 0) {
                $("#ui_txtCampaignIdentifier").val(MailSendingSettingDetails[0].Name).prop("disabled", true);
            }
            else {
                MailSendingSetting.Id = 0;
                $("#ui_txtCampaignIdentifier").val(MailSendingSettingDetails[0].Name + "_Copy");
            }

            if (MailSendingSettingDetails[0].MailConfigurationNameId != null) {
                $("#ui_ConfigurationName").val(MailSendingSettingDetails[0].MailConfigurationNameId).trigger('change');
            }

            $("#addCampName").select2().val(MailSendingSettingDetails[0].CampaignId).trigger('change');
            $("#addgroupname").val([MailSendingSettingDetails[0].GroupId.toString()]).trigger('change');

            if (MailSendingSettingDetails[0].IsPromotionalOrTransactionalType == true)
                $("#customRadioInline2").prop("checked", true);
            else
                $("#customRadioInline1").prop("checked", true);

            $("#ui_FromEmailIdActive").val(MailSendingSettingDetails[0].FromEmailId).trigger('change');
            $("#ui_ReplyTo").val(MailSendingSettingDetails[0].ReplyTo);

            if (MailSendingSettingDetails[0].Subscribe == true) {
                if (!$(document.getElementsByClassName("toggle-on")[1]).hasClass("active"))
                    $(document.getElementsByClassName("toggle-on")[1]).click();
            } else {
                if ($(document.getElementsByClassName("toggle-on")[1]).hasClass("active"))
                    $(document.getElementsByClassName("toggle-on")[1]).click();
            }

            if (MailSendingSettingDetails[0].Forward == true) {
                if (!$(document.getElementsByClassName("toggle-on")[2]).hasClass("active"))
                    $(document.getElementsByClassName("toggle-on")[2]).click();
            } else {
                if ($(document.getElementsByClassName("toggle-on")[2]).hasClass("active"))
                    $(document.getElementsByClassName("toggle-on")[2]).click();
            }

            let Date = mailUtil.GetDateValue(MailSendingSettingDetails[0].ScheduledDate);
            $("#txtDateFrom").val(Date[0]);
            $("#ui_hours").val(Date[1]).trigger('change');
            $("#ui_minutes").val(Date[2]).trigger('change');
            $("#ui_TimeFormat").val(Date[3]).trigger('change');

            if (MailSendingSettingDetails[0].IsMailSplit == false) {
                $("#ui_MailTemplate").val(MailSendingSettingDetails[0].MailTemplateId).trigger('change');
                $("#ui_SubjectLine").val(ReplaceCustomFields(MailSendingSettingDetails[0].Subject));
            }
            else {
                $(document.getElementsByClassName("toggle-on")[0]).click();
                $.each(MailSendingSettingDetails, function () {
                    if ($(this)[0].SplitVariation == "A") {
                        MailSendingSetting.Id = $(this)[0].Id;
                        $("#ui_AMailTemplate").val($(this)[0].MailTemplateId).trigger('change');
                        $("#ui_SubjectLine").val(ReplaceCustomFields($(this)[0].Subject));

                        if ($(this)[0].ScheduledStatus == 7) {
                            $("#ui_AMailTemplate,#ui_SubjectLine").prop("disabled", true);
                        }
                    }
                    else {
                        MailSendingSettingABSplit.Id = $(this)[0].Id;
                        $("#ui_BMailTemplate").val($(this)[0].MailTemplateId).trigger('change');
                        $("#ui_Subjectlinetemplateb").val(ReplaceCustomFields($(this)[0].Subject));

                        if ($(this)[0].ScheduledStatus == 7) {
                            $("#ui_BMailTemplate,#ui_Subjectlinetemplateb").prop("disabled", true);
                        }
                    }
                });

                adiv.innerHTML = parseInt(MailSendingSettingDetails[0].SplitContactPercentage) + parseInt(MailSendingSettingDetails[0].SplitContactPercentage) + "%";
                bdiv.innerHTML = parseInt(MailSendingSettingDetails[0].SplitContactPercentage) + parseInt(MailSendingSettingDetails[0].SplitContactPercentage) + "%";
                let res = 100 - (parseInt(MailSendingSettingDetails[0].SplitContactPercentage) + parseInt(MailSendingSettingDetails[0].SplitContactPercentage)) + "%";
                let addwidres = (parseInt(parseInt(MailSendingSettingDetails[0].SplitContactPercentage) + parseInt(MailSendingSettingDetails[0].SplitContactPercentage))) + parseInt(60);
                document.getElementById('resultdiv').innerHTML = res;
                awrap.style.width = addwidres + "px";
                bwrap.style.width = addwidres + "px";
                adiv.innerHTML = (parseInt(MailSendingSettingDetails[0].SplitContactPercentage)) + "%";
                bdiv.innerHTML = (parseInt(MailSendingSettingDetails[0].SplitContactPercentage)) + "%";
                MailSendingSplitSetting.ASplitContactPercentage = MailSendingSplitSetting.BSplitContactPercentage = parseInt(MailSendingSettingDetails[0].SplitContactPercentage);
                $("#ddl_ABWinningMetricRate").val(MailSendingSettingDetails[0].ABWinningMetricRate).trigger('change');
                abslider.mbsetVal(MailSendingSettingDetails[0].ABTestDuration);
                $('#testdura').html("(" + MailSendingSettingDetails[0].ABTestDuration + " Hours)");

                if (MailSendingSettingDetails[0].FallbackTemplate != undefined && MailSendingSettingDetails[0].FallbackTemplate != null && MailSendingSettingDetails[0].FallbackTemplate != "") {
                    $("#ddl_ABdraw").val(MailSendingSettingDetails[0].FallbackTemplate).trigger('change');
                }

                if (MailSendingSettingDetails[0].ScheduledStatus == 7) {
                    MailScheduleStatus = MailSendingSetting.ScheduledStatus = MailSendingSettingDetails[0].ScheduledStatus;

                    $("#ui_FromName,#addCampName,#addgroupname,#ui_FromEmailIdActive,#ui_ReplyTo,#txtDateFrom,#ui_hours,#ui_minutes,#ui_TimeFormat").prop("disabled", true);
                    $('input[name=campaignType]').attr("disabled", true);
                    $('.abtoggle').toggleClass('disabled', true);
                }
            }
        }

        $("#ui_FromName").val(MailSendingSettingDetails[0].FromName);
    },

    SaveGroup: function SaveGroup() {
        let group = { Name: "", GroupDescription: "" };
        if (CleanText($.trim($("#editgroupname").val())).length == 0) {
            ShowErrorMessage(GlobalErrorList.MailScheduleError.GroupNameError);
            HidePageLoading();
            return false;
        }

        if (CleanText($.trim($("#editgroupDes").val())).length == 0) {
            ShowErrorMessage(GlobalErrorList.MailScheduleError.GroupDescription);
            HidePageLoading();
            return false;
        }

        group.Name = CleanText($.trim($("#editgroupname").val()));
        group.GroupDescription = CleanText($.trim($("#editgroupDes").val()));

        $.ajax({
            url: "/ManageContact/Group/MergeDistinctContactIntoGroup",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'ListOfGroupId': $('#addgroupname').select2().val().toString(), 'group': group }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != undefined && response != null) {
                    if (response.Result == true) {
                        $("#close-popup").parents(".popupcontainer").addClass("hideDiv");
                        try {
                            $("#addgroupname").append(`<option value="${response.GroupId}">${group.Name}</option>`).val([response.GroupId.toString()]).trigger('change');
                        } catch (ex) {
                            console.log(ex.toString());
                        }
                        setTimeout(function () { mailUtil.NavigateToNext(); }, 3000);
                    } else {
                        ShowErrorMessage(response.LogMessage);
                    }
                } else {
                    ShowErrorMessage(response.LogMessage);
                }
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },

    NavigateToNext: function () {

        if ($("#ui_listCampaignInformation").hasClass("active")) {
            if ($('#addgroupname').select2().val() != null && $('#addgroupname').select2().val().toString().split(',').length > 0 && $("#editgroupname").attr("IsGroupAdd") == "0") {
                $("#editgroupname").attr("IsGroupAdd", "1");
                if ($('#addgroupname').select2().val().toString().split(',').length > 1) {
                    $("#editgroupname,#editgroupDes").val('').prop('disabled', false).attr("NoOfGroup", "0");
                    var today = new Date();
                    var strYear = today.getFullYear().toString() + today.getMonth().toString() + 1 + today.getDate().toString() + today.getMilliseconds().toString();
                    var MultiSelectedGroupName = strYear;

                    MultiSelectedGroupName = "Merged_" + MultiSelectedGroupName;
                    $("#editgroupname").val(MultiSelectedGroupName);

                    let MultiSelected = "";
                    var selectedValue = $('#addgroupname').select2("data");
                    for (var i = 0; i <= selectedValue.length - 1; i++) {
                        if (i == 0) {
                            MultiSelected += selectedValue[i].text;
                        } else {
                            MultiSelected += ", " + selectedValue[i].text;
                        }
                    }
                    $("#editgroupDes").val(MultiSelected);
                } else {
                    $("#editgroupname").attr("NoOfGroup", "1").val($('#addgroupname option:selected').text().toString()).prop('disabled', true);
                    $("#editgroupDes").val($('#addgroupname option:selected').text().toString()).prop('disabled', true);
                }
                $('.segmentwrap').addClass("hideDiv");
                $('.segmentwrap').attr('IsOnce', "true");
                $("#ui_divMerge").removeClass("hideDiv");

            } else {
                if (!mailUtil.ValidateCampaignInformation()) {
                    return false;
                }
                if (urlParam("MailSendingSettingId") == "0") {
                    PreinitalizeValue({ "FirstName": "ui_FromName" });
                }

                $("#ui_divMerge").addClass("hideDiv");
                MailSendingSetting.Name = CleanText($.trim($("#ui_txtCampaignIdentifier").val()));
                MailSendingSetting.CampaignId = parseInt($("#addCampName option:selected").val());
                MailSendingSetting.IsPromotionalOrTransactionalType = parseInt($('input[type="radio"][name="campaignType"]:checked').val()) == 1 ? true : false;
                MailSendingSetting.GroupId = parseInt($('#addgroupname').select2().val().toString());

                $("#ui_listCampaignInformation").removeClass("active");
                $("#ui_divCampaignInformation").addClass("hideDiv");
                $("#ui_listContent").addClass("active");
                $("#ui_divContent,#ui_btnBackContent").removeClass("hideDiv");
            }

        } else if ($("#ui_listContent").hasClass("active")) {

            if (!mailUtil.ValidateContent()) {
                return false;
            }

            MailSendingSetting.FromName = CleanText($.trim($("#ui_FromName").val()));
            MailSendingSetting.FromEmailId = $("#ui_FromEmailIdActive option:selected").val();
            MailSendingSetting.ReplyTo = CleanText($.trim($("#ui_ReplyTo").val()));
            MailSendingSetting.Subject = CleanText($.trim(AppendCustomField($("#ui_SubjectLine").val())));
            MailSendingSetting.Subscribe = $(document.getElementsByClassName("toggle-on")[1]).hasClass("active") ? true : false;
            MailSendingSetting.Forward = $(document.getElementsByClassName("toggle-on")[2]).hasClass("active") ? true : false;

            if ($(document.getElementsByClassName("toggle-on")[0]).hasClass("active")) {
                MailSendingSetting.IsMailSplit = true;
                MailSendingSetting.SplitIdentifier = (Math.floor(new Date().valueOf() * Math.random())).toString();
                MailSendingSplitSetting.AMailTemplateId = parseInt($("#ui_AMailTemplate option:selected").val());
                MailSendingSplitSetting.BMailTemplateId = parseInt($("#ui_BMailTemplate option:selected").val());
                MailSendingSetting.ABWinningMetricRate = $("#ddl_ABWinningMetricRate option:selected").val();
                MailSendingSetting.ABTestDuration = parseInt($("#slider")[0].innerText);
                MailSendingSetting.FallbackTemplate = $("#ddl_ABdraw option:selected").val();
            }
            else {
                MailSendingSetting.MailTemplateId = parseInt($("#ui_MailTemplate option:selected").val());
            }

            $("#ui_listContent").removeClass("active");
            $("#ui_divContent").addClass("hideDiv");
            $("#ui_listSchedule").addClass("active");
            $("#ui_divSchedule,#ui_btnBackContent").removeClass("hideDiv");

        } else if ($("#ui_listSchedule").hasClass("active")) {
            if (!mailUtil.ValidationForSchedule()) {
                return false;
            }

            let hour = $("#ui_hours option:selected").val();
            let minutes = $("#ui_minutes option:selected").val();
            let Formart = $("#ui_TimeFormat option:selected").val();
            if (Formart.toLowerCase() == "pm")
                hour = mailUtil.GetHours(Formart, hour);

            let scheduleValue = $("#txtDateFrom").val().toString().split('/');
            let ScheduledDate = `${scheduleValue[2]}-${scheduleValue[0]}-${scheduleValue[1]} ${hour}:${minutes}:00`;

            ScheduledDate = ConvertDateTimeToUTC(ScheduledDate);
            MailSendingSetting.ScheduledDate = ScheduledDate.getFullYear() + '-' + mailUtil.AddingPrefixZero((ScheduledDate.getMonth() + 1)) + '-' + mailUtil.AddingPrefixZero(ScheduledDate.getDate()) + " " + mailUtil.AddingPrefixZero(ScheduledDate.getHours()) + ":" + mailUtil.AddingPrefixZero(ScheduledDate.getMinutes()) + ":" + mailUtil.AddingPrefixZero(ScheduledDate.getSeconds());

            MailSendingSetting.MailConfigurationNameId = parseInt($("#ui_ConfigurationName option:selected").val());

            let GroupsName = "";
            $.each($('#addgroupname').select2('data'), function () {
                GroupsName += $(this)[0].text + ",";
            });
            $("#ui_SpanGroupsName").html(GroupsName);
            $("#ui_SpanFromName").html(`${MailSendingSetting.FromName} (${MailSendingSetting.FromEmailId})`);
            $("#ui_SpanSubject").html(ReplaceCustomFields(MailSendingSetting.Subject));

            let onlineTemplateURL = "";
            if (MailSendingSetting.IsMailSplit == true) {
                $("#ui_SplitTestTempVariation").removeClass("hideDiv");
                if ($("#ui_variationB").hasClass("active")) {
                    $("#ui_variationB").removeClass("active")
                    $("#ui_variationA").addClass("active");
                }

                onlineTemplateURL = `https://${TemplatePath}Campaign-${Plumb5AccountId}-${MailSendingSplitSetting.AMailTemplateId}/TemplateContent.html?${Math.floor(new Date().valueOf() * Math.random())}`;

            } else {
                onlineTemplateURL = `https://${TemplatePath}Campaign-${Plumb5AccountId}-${MailSendingSetting.MailTemplateId}/TemplateContent.html?${Math.floor(new Date().valueOf() * Math.random())}`;
            }

            let Iframe = `<iframe src="${onlineTemplateURL}" frameborder="0"></iframe>`;
            let MobIframe = `<iframe src="${onlineTemplateURL}" style="width:100%;border:none;height:100%"></iframe>`;

            $("#ui_OnlineTemplateUrl").html(Iframe);
            $("#ui_OnlineMobileTemplateUrl").html(MobIframe);

            $("#ui_listSchedule").removeClass("active");
            $("#ui_divSchedule").addClass("hideDiv");
            $("#ui_listPreviewTest").addClass("active");
            $("#ui_divPreiwTest,#ui_btnBackContent").removeClass("hideDiv");
            $("#ui_btnNext").html(`Save <i class="icon ion-chevron-right pl-2"></i>`);

        } else if ($("#ui_listPreviewTest").hasClass("active")) {
            //Saving
            MailSendingSettingSplit.length = 0;
            if (MailSendingSetting.IsMailSplit == true) {
                MailSendingSetting.MailTemplateId = MailSendingSplitSetting.AMailTemplateId;
                MailSendingSetting.SplitContactPercentage = MailSendingSplitSetting.ASplitContactPercentage;
                MailSendingSetting.SplitVariation = MailSendingSplitSetting.ASplitVariation;
                MailSendingSetting.Subject = CleanText($.trim(AppendCustomField($("#ui_SubjectLine").val())));
                MailSendingSetting.MailConfigurationNameId = parseInt($("#ui_ConfigurationName option:selected").val());
                MailSendingSettingSplit.push(MailSendingSetting);

                MailSendingSettingABSplit.Name = MailSendingSetting.Name;
                MailSendingSettingABSplit.MailTemplateId = MailSendingSplitSetting.BMailTemplateId;
                MailSendingSettingABSplit.GroupId = MailSendingSetting.GroupId;
                MailSendingSettingABSplit.Subject = CleanText($.trim(AppendCustomField($("#ui_Subjectlinetemplateb").val())));
                MailSendingSettingABSplit.FromName = MailSendingSetting.FromName;
                MailSendingSettingABSplit.FromEmailId = MailSendingSetting.FromEmailId;
                MailSendingSettingABSplit.Subscribe = MailSendingSetting.Subscribe;
                MailSendingSettingABSplit.Forward = MailSendingSetting.Forward;
                MailSendingSettingABSplit.ReplyTo = MailSendingSetting.ReplyTo;
                MailSendingSettingABSplit.IsPromotionalOrTransactionalType = MailSendingSetting.IsPromotionalOrTransactionalType;
                MailSendingSettingABSplit.CampaignId = MailSendingSetting.CampaignId;
                MailSendingSettingABSplit.ScheduledDate = MailSendingSetting.ScheduledDate;
                MailSendingSettingABSplit.ScheduledStatus = MailSendingSetting.ScheduledStatus;
                MailSendingSettingABSplit.IsMailSplit = MailSendingSetting.IsMailSplit;
                MailSendingSettingABSplit.SplitContactPercentage = MailSendingSplitSetting.BSplitContactPercentage;
                MailSendingSettingABSplit.SplitIdentifier = MailSendingSetting.SplitIdentifier;
                MailSendingSettingABSplit.SplitVariation = MailSendingSplitSetting.BSplitVariation;
                MailSendingSettingABSplit.ABWinningMetricRate = MailSendingSetting.ABWinningMetricRate;
                MailSendingSettingABSplit.ABTestDuration = MailSendingSetting.ABTestDuration;
                MailSendingSettingABSplit.FallbackTemplate = MailSendingSetting.FallbackTemplate;
                MailSendingSettingABSplit.MailConfigurationNameId = parseInt($("#ui_ConfigurationName option:selected").val());
                MailSendingSettingSplit.push(MailSendingSettingABSplit);
                mailUtil.SaveMailSchedule(MailSendingSettingSplit);
            }
            else {
                MailSendingSettingSplit.push(MailSendingSetting);
                mailUtil.SaveMailSchedule(MailSendingSettingSplit);
            }
        }
    },

    NavigateToBack: function () {
        $("#ui_btnNext").prop('disabled', false);
        $("#editgroupname").attr("IsGroupAdd", "0");
        if ($("#ui_listPreviewTest").hasClass("active")) {
            $("#ui_listPreviewTest").removeClass("active");
            $("#ui_divPreiwTest").addClass("hideDiv");
            $("#ui_listSchedule").addClass("active");
            $("#ui_divSchedule,#ui_btnBackContent").removeClass("hideDiv");
            $("#ui_btnNext").html(`Next <i class="icon ion-chevron-right pl-2"></i>`);
        } else if ($("#ui_listSchedule").hasClass("active")) {
            $("#ui_listSchedule").removeClass("active");
            $("#ui_divSchedule").addClass("hideDiv");
            $("#ui_listContent").addClass("active");
            $("#ui_divContent,#ui_btnBackContent").removeClass("hideDiv");
        } else if ($("#ui_listContent").hasClass("active")) {
            $("#ui_listContent").removeClass("active");
            $("#ui_divContent").addClass("hideDiv");
            $("#ui_listCampaignInformation").addClass("active");
            $("#ui_divCampaignInformation").removeClass("hideDiv");
            $("#ui_btnBackContent").addClass("hideDiv");
        }
    },

    ValidateCampaignInformation: function () {
        if ($("#ui_txtCampaignIdentifier").val() == undefined || $("#ui_txtCampaignIdentifier").val() == null || $("#ui_txtCampaignIdentifier").val() == "" || CleanText($.trim($("#ui_txtCampaignIdentifier").val())).length == 0) {
            ShowErrorMessage(GlobalErrorList.MailScheduleError.CampaignIdentifier);
            $("#ui_txtCampaignIdentifier").focus();
            return false;
        }

        if ($("#addCampName option:selected").val() == undefined || $("#addCampName option:selected").val() == null || $("#addCampName option:selected").val() == "" || $("#addCampName option:selected").val() == "0") {
            ShowErrorMessage(GlobalErrorList.MailScheduleError.CampaignName);
            return false;
        }

        if ($('#addgroupname').select2().val() == undefined || $('#addgroupname').select2().val() == null || $('#addgroupname').select2().val().toString() == "" || $('#addgroupname').select2().val().toString().length == "0") {
            ShowErrorMessage(GlobalErrorList.MailScheduleError.SentToGroup);
            return false;
        }

        var totalContact = $("#ui_h1TotalUniqueRecipients").html();
        if (totalContact == undefined || totalContact == null || totalContact == "" || totalContact == "0" || parseInt(totalContact) <= 0) {
            ShowErrorMessage(GlobalErrorList.MailScheduleError.NoContactInGroup);
            return false;
        }

        return true;
    },

    ValidateContent: function () {
        if ($("#ui_FromName").val() == undefined || $("#ui_FromName").val() == null || $("#ui_FromName").val() == "" || CleanText($.trim($("#ui_FromName").val())).length == 0) {
            ShowErrorMessage(GlobalErrorList.MailScheduleError.FromName);
            $("#ui_FromName").focus();
            return false;
        }

        if ($("#ui_FromEmailIdActive option:selected").val() == undefined || $("#ui_FromEmailIdActive option:selected").val() == null || $("#ui_FromEmailIdActive option:selected").val() == "" || $("#ui_FromEmailIdActive option:selected").val() == "0") {
            ShowErrorMessage(GlobalErrorList.MailScheduleError.FromActiveEmailid);
            return false;
        }

        if (!regExpEmail.test($("#ui_FromEmailIdActive option:selected").val())) {
            ShowErrorMessage(GlobalErrorList.MailScheduleError.FromEmailIdError);
            return false;
        }

        if ($("#ui_ReplyTo").val() == undefined || $("#ui_ReplyTo").val() == null || $("#ui_ReplyTo").val() == "" || CleanText($.trim($("#ui_ReplyTo").val())).length == 0) {
            ShowErrorMessage(GlobalErrorList.MailScheduleError.ReplyToError);
            $("#ui_ReplyTo").focus();
            return false;
        }

        if (!regExpEmail.test($("#ui_ReplyTo").val())) {
            $("#ui_ReplyTo").focus();
            ShowErrorMessage(GlobalErrorList.MailScheduleError.ReplyEmailIdError);
            return false;
        }

        if ($(document.getElementsByClassName("toggle-on")[0]).hasClass("active")) {

            if ($("#ui_AMailTemplate option:selected").val() == undefined || $("#ui_AMailTemplate option:selected").val() == null || $("#ui_AMailTemplate option:selected").val() == "" || $("#ui_AMailTemplate option:selected").val() == "0") {
                ShowErrorMessage(GlobalErrorList.MailScheduleError.AMailTemplate);
                return false;
            }

            if ($("#ui_BMailTemplate option:selected").val() == undefined || $("#ui_BMailTemplate option:selected").val() == null || $("#ui_BMailTemplate option:selected").val() == "" || $("#ui_BMailTemplate option:selected").val() == "0") {
                ShowErrorMessage(GlobalErrorList.MailScheduleError.BMailTemplate);
                return false;
            }

            if (AMailTemplateSpamScore.SpamScore <= 5.00 || AMailTemplateSpamScore.SpamScore === 0.00) {
                ShowErrorMessage(GlobalErrorList.MailScheduleError.MailTemplateSpamScore);
                return false;
            }

            if (BMailTemplateSpamScore.SpamScore <= 5.00 || BMailTemplateSpamScore.SpamScore === 0.00) {
                ShowErrorMessage(GlobalErrorList.MailScheduleError.MailTemplateSpamScore);
                return false;
            }

            if (AMailTemplateSpamScore.Id == BMailTemplateSpamScore.Id) {
                ShowErrorMessage(GlobalErrorList.MailScheduleError.MailTemplateSame);
                return false;
            }

            if (AMailTemplateContainsCounselorTags || BMailTemplateContainsCounselorTags) {
                ShowErrorMessage(GlobalErrorList.MailScheduleError.MailTemplateCounselorTags);
                return false;
            }

            if ($("#ui_SubjectLine").val() == undefined || $("#ui_SubjectLine").val() == null || $("#ui_SubjectLine").val() == "" || CleanText($.trim($("#ui_SubjectLine").val())).length == 0) {
                ShowErrorMessage(GlobalErrorList.MailScheduleError.SubjectA);
                $("#ui_SubjectLine").focus();
                return false;
            }

            if ($("#ui_Subjectlinetemplateb").val() == undefined || $("#ui_Subjectlinetemplateb").val() == null || $("#ui_Subjectlinetemplateb").val() == "" || CleanText($.trim($("#ui_Subjectlinetemplateb").val())).length == 0) {
                ShowErrorMessage(GlobalErrorList.MailScheduleError.SubjectB);
                $("#ui_SubjectLine").focus();
                return false;
            }

            if ($("#ddl_ABWinningMetricRate option:selected").val() == undefined || $("#ddl_ABWinningMetricRate option:selected").val() == null || $("#ddl_ABWinningMetricRate option:selected").val() == "" || $("#ddl_ABWinningMetricRate option:selected").val() == "0") {
                ShowErrorMessage(GlobalErrorList.MailScheduleError.ABWinningMetricRate);
                return false;
            }

        } else {

            if ($("#ui_MailTemplate option:selected").val() == undefined || $("#ui_MailTemplate option:selected").val() == null || $("#ui_MailTemplate option:selected").val() == "" || $("#ui_MailTemplate option:selected").val() == "0") {
                ShowErrorMessage(GlobalErrorList.MailScheduleError.MailTemplate);
                return false;
            }

            if (MailTemplateSpamScore.SpamScore <= 5.00 || MailTemplateSpamScore.SpamScore === 0.00) {
                ShowErrorMessage(GlobalErrorList.MailScheduleError.MailTemplateSpamScore);
                return false;
            }

            if (MailTemplateContainsCounselorTags) {
                ShowErrorMessage(GlobalErrorList.MailScheduleError.MailTemplateCounselorTags);
                return false;
            }

            if ($("#ui_SubjectLine").val() == undefined || $("#ui_SubjectLine").val() == null || $("#ui_SubjectLine").val() == "" || CleanText($.trim($("#ui_SubjectLine").val())).length == 0) {
                ShowErrorMessage(GlobalErrorList.MailScheduleError.Subject);
                $("#ui_SubjectLine").focus();
                return false;
            }
        }

        return true;
    },

    ValidationForSchedule: function () {
        if (MailScheduleStatus == 7) {
            return true;
        }
        else {
            if (CleanText($("#txtDateFrom").val()).length === 0) {
                ShowErrorMessage(GlobalErrorList.MailScheduleError.ScheduleDate);
                return false;
            }
            let selectedDatestring = $("#txtDateFrom").val().split("/");
            let hour = $("#ui_hours option:selected").val();
            let minutes = $("#ui_minutes option:selected").val();
            let Formart = $("#ui_TimeFormat option:selected").val();

            if (Formart.toLowerCase() == "pm")
                hour = mailUtil.GetHours(Formart, hour);

            var selectedDate = new Date(selectedDatestring[2], parseInt(selectedDatestring[0]) - 1, selectedDatestring[1], hour, minutes);
            if (selectedDate <= new Date()) {
                ShowErrorMessage(GlobalErrorList.MailScheduleError.ScheduleDateError);
                return false;
            }

            if ($("#ui_ConfigurationName option:selected").val() == undefined || $("#ui_ConfigurationName option:selected").val() == null || $("#ui_ConfigurationName option:selected").val() == "" || $("#ui_ConfigurationName option:selected").val() == "0") {
                ShowErrorMessage(GlobalErrorList.MailScheduleError.ConfigurationName);
                return false;
            }

            return true;
        }
    },

    ValidateTemplateSpamScore: function (mailTemplate, templateId) {
        ShowPageLoading();
        $.ajax({
            url: "/Mail/MailTemplate/GetTemplateDetails",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'TemplateId': mailTemplate.Id }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                if (result != undefined && result != null && result.length > 0 && (result[0].SpamScore <= 5.00 || result[0].SpamScore === 0.00)) {
                    if (templateId == "ui_MailTemplate") {
                        MailTemplateSpamScore.Id = mailTemplate.Id;
                        MailTemplateSpamScore.SpamScore = result[0].SpamScore;
                    }
                    else if (templateId == "ui_AMailTemplate") {
                        AMailTemplateSpamScore.Id = mailTemplate.Id;
                        AMailTemplateSpamScore.SpamScore = result[0].SpamScore;
                    }
                    else if (templateId == "ui_BMailTemplate") {
                        BMailTemplateSpamScore.Id = mailTemplate.Id;
                        BMailTemplateSpamScore.SpamScore = result[0].SpamScore;
                    }
                    $("#ui_btnNext").prop('disabled', true);
                    ShowErrorMessage(GlobalErrorList.MailScheduleError.MailTemplateSpamScore);
                }
                else {
                    if (templateId == "ui_MailTemplate") {
                        MailTemplateSpamScore.Id = mailTemplate.Id;
                        MailTemplateSpamScore.SpamScore = result[0].SpamScore;
                    }
                    else if (templateId == "ui_AMailTemplate") {
                        AMailTemplateSpamScore.Id = mailTemplate.Id;
                        AMailTemplateSpamScore.SpamScore = result[0].SpamScore;
                    }
                    else if (templateId == "ui_BMailTemplate") {
                        BMailTemplateSpamScore.Id = mailTemplate.Id;
                        BMailTemplateSpamScore.SpamScore = result[0].SpamScore;
                    }
                    $("#ui_btnNext").prop('disabled', false);
                    mailUtil.CheckForCounselorTags(mailTemplate, templateId);
                }
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },

    SaveMailSchedule: function (mailSendingSetting) {
        if (mailSendingSetting != undefined && mailSendingSetting != null && mailSendingSetting.length > 0) {
            ShowPageLoading();
            $.ajax({
                url: "/Mail/MailSchedule/SaveScheduleDetails",
                type: 'POST',
                data: JSON.stringify({ 'accountId': Plumb5AccountId, 'mailSendingSettingList': mailSendingSetting }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (MailSendingSettingId) {
                    if (MailSendingSettingId > 0 && MailSendingSetting.IsMailSplit == true) {
                        ShowSuccessMessage(GlobalErrorList.MailScheduleError.MailSplitMessage);
                        window.location.href = "/Mail/Schedules";
                    } else if (MailSendingSettingId > 0 && MailSendingSetting.IsMailSplit == false) {
                        ShowSuccessMessage(GlobalErrorList.MailScheduleError.MailCampaignSaved);
                        window.location.href = "/Mail/Schedules";
                    } else if (MailSendingSettingId == -5) {
                        ShowErrorMessage(GlobalErrorList.MailScheduleError.MailCampaignAlready);
                    } else {
                        ShowErrorMessage(GlobalErrorList.MailScheduleError.MailCampaignError);
                    }

                    HidePageLoading();
                },
                error: ShowAjaxError
            });
        } else {
            ShowErrorMessage(GlobalErrorList.MailScheduleError.MailCampaignError);
        }
    },

    SendIndividaulTestMail: function (mailSendingSetting, testemailid) {
        $.ajax({
            url: "/Mail/Send/SendTestMail",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'mailSendingSetting': mailSendingSetting, 'emailId': testemailid, 'Areas': 'Mail' }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                if (result.Status) {
                    ShowSuccessMessage(result.Message);
                    $("#ui_testToEmailId").val('');
                }
                else {
                    ShowErrorMessage(result.Message);
                }
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },

    SendGroupTestMail: function (mailSendingSetting) {
        $.ajax({
            url: "/Mail/Send/SendGroupTestMail",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'mailSendingSetting': mailSendingSetting }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                if (result != undefined && result != null) {
                    if (result.SentCount > 0 || result.FailureCount > 0) {
                        $("#ui_ResultPopup").removeClass("hideDiv");
                        mailUtil.ShowGroupTestResult(result);
                    } else {
                        ShowErrorMessage(result.Message);
                    }
                } else {
                    ShowErrorMessage(GlobalErrorList.MailScheduleError.GroupTestResultMessage);
                }
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },

    ShowGroupTestResult: function (result) {
        $("#ui_TestResultMessage").empty();
        if (result.SuccessList.length > 0) {
            $.each(result.SuccessList, function (i) {
                let TestSuccessResult = `<tr>
                            <td class="text-left td-icon">
                                ${result.SuccessList[i]}
                            </td>
                            <td>Success</td>
                          </tr>`;
                $("#ui_TestResultMessage").append(TestSuccessResult);
            });
        }

        if (result.ErrorList.length > 0) {
            $.each(result.ErrorList, function () {
                let TestErrorResult = `<tr>
                            <td class="text-left td-icon">
                                ${$(this)[0].Item1}
                            </td>
                            <td>${$(this)[0].Item2}</td>
                          </tr>`;

                $("#ui_TestResultMessage").append(TestErrorResult);
            });
        }
    },

    ShowSegmentAnalysis: function () {
        $.ajax({
            url: "/Mail/MailSchedule/ShowSegmentAnalysis",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'GroupIds': $('#addgroupname').select2().val().toString() }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (GaugeData) {
                HidePageLoading();
                $("#chartgauge1,#chartgauge2").empty();
                if (GaugeData != undefined && GaugeData != null && GaugeData.Table != undefined && GaugeData.Table != null && GaugeData.Table.length > 0) {
                    $("#ui_SmallOpenRate").html(`Open Rate: ${Math.round(GaugeData.Table[0].TotalOpenedRate).toString()}%`);
                    $("#ui_SmallClickedRate").html(`Click Rate: ${Math.round(GaugeData.Table[0].TotalClickedRate).toString()}%`);
                    let Open = parseFloat("0." + Math.round(GaugeData.Table[0].TotalOpenedRate).toString());
                    let clicked = parseFloat("0." + Math.round(GaugeData.Table[0].TotalClickedRate).toString());
                    createGauge(Open, "#chartgauge1");
                    createGauge(clicked, "#chartgauge2");

                    let MobileDevice = Math.round(((GaugeData.Table[0].TotalMobileDevice / GaugeData.Table[0].TotalDevice) * 100));
                    let DeskTop = Math.round(((GaugeData.Table[0].TotalDesktopDevice / GaugeData.Table[0].TotalDevice) * 100));

                    mailUtil.BindChart(MobileDevice, DeskTop);
                } else {
                    createGauge(0.00, "#chartgauge1");
                    createGauge(0.00, "#chartgauge2");
                    mailUtil.BindChart(0, 0, 0);
                }
            },
            error: ShowAjaxError
        });

        ////////////Gauge Code/////////////////////
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

        };
    },

    GetHours: function (Formart, hour) {
        if (Formart.toLowerCase() == "pm") {
            switch (hour) {
                case "01":
                    hour = "13";
                    break;
                case "02":
                    hour = "14";
                    break;
                case "03":
                    hour = "15";
                    break;
                case "04":
                    hour = "16";
                    break;
                case "05":
                    hour = "17";
                    break;
                case "06":
                    hour = "18";
                    break;
                case "07":
                    hour = "19";
                    break;
                case "08":
                    hour = "20";
                    break;
                case "09":
                    hour = "21";
                    break;
                case "10":
                    hour = "22";
                    break;
                case "11":
                    hour = "23";
                    break;
            }
        }

        return hour;
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
                case "24":
                    hour = "12";
                    break;
                default: hour;
            }
        }

        return hour;
    },

    GetDateValue: function (ScheduledDate) {
        let date = GetJavaScriptDateObj(ScheduledDate);
        let TimeFormate = "AM";
        if (date.getHours() > 12) {
            TimeFormate = "PM";
        }

        let time = date.getHours().toString().length == 1 ? "0" + date.getHours().toString() : date.getHours().toString();
        time = mailUtil.GetHoursFormate(TimeFormate, time);
        let minutes = date.getMinutes().toString().length == 1 ? "0" + date.getMinutes().toString() : date.getMinutes().toString();
        date = parseInt(date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();
        return [date, time, minutes, TimeFormate];
    },

    AddingPrefixZero: function (n) {
        return (n < 10) ? ("0" + n) : n;
    },

    BindChart: function (Mobile, DeskTop) {

        /* Pie */
        var data = [{
            data: [DeskTop, Mobile],
            labels: ["DeskTop", "Mobile"],
            backgroundColor: [cssvar('--BarChart-BorderColor-Item1'), cssvar('--BarChart-BorderColor-Item3')],
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

        var ctx = document.getElementById("topfivesource").getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'pie',
            data: {
                datasets: data
            },

            options: options
        });
    },
    CheckCredits: function () {
        $.ajax({
            url: "/Mail/MailSchedule/CheckCredits",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'TotalContacts': parseInt($("#ui_h1TotalUniqueRecipients").html()) }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != undefined && response != null) {
                    if (response.Status == false) {
                        //alert("Insufficient Credits");
                        ShowErrorMessage(GlobalErrorList.MailScheduleError.NoCredits);
                        return false;
                    } else {
                        mailUtil.NavigateToNext();
                    }
                }

            },
            error: ShowAjaxError
        });
    },
    CheckForCounselorTags: function (mailTemplate, templateId) {
        ShowPageLoading();
        $.ajax({
            url: "/Mail/MailTemplate/CheckCounselorTags",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'MailTemplateId': mailTemplate.Id }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                if (result) {
                    if (templateId == "ui_MailTemplate") {
                        MailTemplateContainsCounselorTags = true;
                    } else if (templateId == "ui_AMailTemplate") {
                        AMailTemplateContainsCounselorTags = true;
                    } else if (templateId == "ui_BMailTemplate") {
                        BMailTemplateContainsCounselorTags = true;
                    }
                    $("#ui_btnNext").prop('disabled', true);
                    ShowErrorMessage(GlobalErrorList.MailScheduleError.MailTemplateCounselorTags);
                }
                else {
                    if (templateId == "ui_MailTemplate") {
                        MailTemplateContainsCounselorTags = false;
                    } else if (templateId == "ui_AMailTemplate") {
                        AMailTemplateContainsCounselorTags = false;
                    } else if (templateId == "ui_BMailTemplate") {
                        BMailTemplateContainsCounselorTags = false;
                    }
                    $("#ui_btnNext").prop('disabled', false);
                }
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    }

};


$(document).ready(function () {
    ShowPageLoading();
    DragDroReportUtil.BindUrlEventMappingDetails('');
    GetContactFielddragdrop('');
    DragDroReportUtil.GetReport();
    MailSendingSetting.Id = urlParam("MailSendingSettingId");
    IsDuplicateCopy = urlParam("IsDuplicate");
    GetLoggedInUserInfo();
    mailUtil.IsMailSettingsChecked();

});

$('#ui_FromEmailIdActive').select2({
    minimumResultsForSearch: '',
    dropdownAutoWidth: false,
});

$('#ui_ConfigurationName').select2({
    minimumResultsForSearch: '',
    dropdownAutoWidth: false,
});

$('#addgroupname').select2({
    minimumResultsForSearch: '',
    dropdownAutoWidth: false,
    maximumSelectionLength: 3
});

$('#addCampName').select2({
    minimumResultsForSearch: '',
    dropdownAutoWidth: false
});

$('#testcampgroupname').select2({
    minimumResultsForSearch: '',
    dropdownAutoWidth: false
});

$('#ui_MailTemplate').select2({
    minimumResultsForSearch: '',
    dropdownAutoWidth: false,
});

$(".tempvariationATest").select2({
    minimumResultsForSearch: '',
    dropdownAutoWidth: false,
});

$(".tempvariationBTest").select2({
    minimumResultsForSearch: '',
    dropdownAutoWidth: false,
});

// Toggles
$('.abtoggle').toggles({
    on: false,
    height: 22
});

$(".toggleUnsub").toggles({
    on: true,
    height: 22
});

$(".toggleforwrd").toggles({
    on: false,
    height: 22
});

$(".abtoggle").click(function () {
    if (MailScheduleStatus == 7) {
        $('.abtoggle').toggles({
            drag: false,
            on: true
        });
    }
    else {
        $("#emailtempone").toggleClass("hideDiv");
        $("#dv_AMailTemplate,#dv_BMailTemplate,#dv_Subjectlinetemplateb,#dv_ABDistribution,#dv_TestDistribution,#dv_DrawResult").toggleClass("hideDiv");


        if ($(".toggle-on").hasClass("active")) {
            $("#ui_subjectlineA").html("Subject Line A");
            $("#ui_subjectlineA").addClass("text-color-blue");
        } else {
            $("#ui_subjectlineA").html("Subject Line");
            $("#ui_subjectlineA").removeClass("text-color-blue");
        }
    }
});

$('input[name="testcampaignType"]').click(function () {
    var gettestcampval = $('input[name="testcampaignType"]:checked').val();
    if (gettestcampval == "Group") {
        $("#indivtxtbox").addClass("hideDiv");
        $("#groupdropdownbox").removeClass("hideDiv");
    } else {
        $("#groupdropdownbox").addClass("hideDiv");
        $("#indivtxtbox").removeClass("hideDiv");
    }
});

let i = document.querySelector("#cust-slider__input"),
    adiv = document.querySelector('.cust-slider-a-percent'),
    bdiv = document.querySelector('.cust-slider-b-percent'),
    awrap = document.querySelector('.cust-slider-a-wrap'),
    bwrap = document.querySelector(".cust-slider-b-wrap");

i.addEventListener('input', function () {
    if (MailScheduleStatus != 7) {
        if (i.value == 10 || i.value == 20 || i.value == 30 || i.value == 40 || i.value == 50 || i.value == 60 || i.value == 70 || i.value == 80 || i.value == 90) {
            adiv.innerHTML = i.value + "%";
            bdiv.innerHTML = i.value + "%";
            let res = 100 - i.value + "%";
            let addwidres = parseInt(i.value) + parseInt(60);
            document.getElementById('resultdiv').innerHTML = res;
            awrap.style.width = addwidres + "px";
            bwrap.style.width = addwidres + "px";
            adiv.innerHTML = (i.value / 2) + "%";
            bdiv.innerHTML = (i.value / 2) + "%";
            MailSendingSplitSetting.ASplitContactPercentage = MailSendingSplitSetting.BSplitContactPercentage = (i.value / 2);
        }
    }
}, false);

var abslider = $("#slider").mbSlider({
    minVal: 2,
    maxVal: 100,
    grid: 1,
    showVal: false,
    labelPos: "top",
    rangeColor: "#ccc",
    formatValue: function (val) { return parseFloat(val) },
    onSlide: function (obj) {
        var val = $(obj).mbgetVal();
        var varBVal = 100 - parseInt(val);
        $('#testdura').html("(" + val + " Hours)");
    },

});
abslider.mbsetVal("2");

$("#addCampName").change(function () {
    $("#ui_MailTemplate,#ui_AMailTemplate,#ui_BMailTemplate").empty().append(`<option value="0">Select</option>`)
    $.each(MailTemplatesList, function () {
        if (parseInt($("#addCampName option:selected").val()) == $(this)[0].MailCampaignId) {
            $("#ui_MailTemplate,#ui_AMailTemplate,#ui_BMailTemplate").append(`<option value="${$(this)[0].Id}">${$(this)[0].Name}</option>`);
        }
    });
});

$('#addgroupname').on("change", function (e) {
    let ListOfGroupId = $('#addgroupname').select2("val");
    $("#ui_spanTotalSelectedGroup").html($("#addgroupname option:selected").length);
    if (ListOfGroupId != null) {
        ShowPageLoading();
        $.ajax({
            url: "/ManageContact/Group/GetTotalUniqueRecipientsCount",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'ListOfGroupId': ListOfGroupId.toString() }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                if (result != undefined && result != null) {
                    $("#ui_h1TotalUniqueRecipients").html(result);
                }
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    }
    else
        $("#ui_h1TotalUniqueRecipients").html("0");

});

$("#ui_SaveDistinctContact").click(function () {
    ShowPageLoading();
    if ($("#editgroupname").attr("NoOfGroup") == "0") {
        mailUtil.SaveGroup();
    } else {
        mailUtil.NavigateToNext();
        HidePageLoading();
    }
});

//function NextContent() {
//    mailUtil.NavigateToNext();
//}

//function BackContent() {
//    mailUtil.NavigateToBack();
//}

$("#ui_btntestCampaign").click(function () {
    ShowPageLoading();
    let mailSendingSettingtest = new Object();
    mailSendingSettingtest.Name = MailSendingSetting.Name;
    mailSendingSettingtest.FromName = MailSendingSetting.FromName;
    mailSendingSettingtest.FromEmailId = MailSendingSetting.FromEmailId;
    mailSendingSettingtest.ReplyTo = MailSendingSetting.ReplyTo;
    mailSendingSettingtest.Subscribe = MailSendingSetting.Subscribe;
    mailSendingSettingtest.Forward = MailSendingSetting.Forward;
    mailSendingSettingtest.IsPromotionalOrTransactionalType = MailSendingSetting.IsPromotionalOrTransactionalType;
    mailSendingSettingtest.ScheduledDate = MailSendingSetting.ScheduledDate;
    mailSendingSettingtest.CampaignId = MailSendingSetting.CampaignId;
    mailSendingSettingtest.MailConfigurationNameId = MailSendingSetting.MailConfigurationNameId;
    if ($("#ui_SplitTestTempVariation").is(":visible")) {

        if ($('input[type="radio"][name="testcampaignType"]:checked').val() == "Individual") {
            if (CleanText($.trim($("#ui_testToEmailId").val())).length > 0 && regExpEmail.test($("#ui_testToEmailId").val())) {
                mailSendingSettingtest.MailTemplateId = $("#ui_variationA").hasClass("active") ? MailSendingSplitSetting.AMailTemplateId : MailSendingSplitSetting.BMailTemplateId;
                mailSendingSettingtest.Subject = $("#ui_variationA").hasClass("active") ? CleanText(AppendCustomField($("#ui_SubjectLine").val())) : CleanText(AppendCustomField($("#ui_Subjectlinetemplateb").val()));
                mailUtil.SendIndividaulTestMail(mailSendingSettingtest, CleanText($.trim($("#ui_testToEmailId").val())));
            } else {
                ShowErrorMessage(GlobalErrorList.MailScheduleError.TestEmailIdError);
                HidePageLoading();
                return false;
            }
        } else {
            if (CleanText($.trim($("#testcampaigngroup").val())).length > 0) {
                mailSendingSettingtest.MailTemplateId = $("#ui_variationA").hasClass("active") ? MailSendingSplitSetting.AMailTemplateId : MailSendingSplitSetting.BMailTemplateId;
                mailSendingSettingtest.Subject = $("#ui_variationA").hasClass("active") ? CleanText(AppendCustomField($("#ui_SubjectLine").val())) : CleanText(AppendCustomField($("#ui_Subjectlinetemplateb").val()));
                mailSendingSettingtest.GroupId = parseInt($('#testcampgroupname').val());
                mailUtil.SendGroupTestMail(mailSendingSettingtest);
            } else {
                ShowErrorMessage(GlobalErrorList.MailScheduleError.GroupTestError);
                HidePageLoading();
                return false;
            }
        }

    } else {

        if ($('input[type="radio"][name="testcampaignType"]:checked').val() == "Individual") {
            if (CleanText($.trim($("#ui_testToEmailId").val())).length > 0 && regExpEmail.test($("#ui_testToEmailId").val())) {
                mailSendingSettingtest.MailTemplateId = MailSendingSetting.MailTemplateId;
                mailSendingSettingtest.Subject = ReplaceCustomFields(MailSendingSetting.Subject);
                mailUtil.SendIndividaulTestMail(mailSendingSettingtest, CleanText($.trim($("#ui_testToEmailId").val())));
            } else {
                ShowErrorMessage(GlobalErrorList.MailScheduleError.TestEmailIdError);
                HidePageLoading();
                return false;
            }
        } else {
            if (CleanText($.trim($("#testcampaigngroup").val())).length > 0) {
                mailSendingSettingtest.MailTemplateId = MailSendingSetting.MailTemplateId;
                mailSendingSettingtest.Subject = ReplaceCustomFields(MailSendingSetting.Subject);
                mailSendingSettingtest.GroupId = parseInt($('#testcampgroupname').val());
                mailUtil.SendGroupTestMail(mailSendingSettingtest);
            } else {
                ShowErrorMessage(GlobalErrorList.MailScheduleError.GroupTestError);
                HidePageLoading();
                return false;
            }
        }
    }
});

$("#ui_FromEmailIdActive").change(function () {
    if ($("#ui_FromEmailIdActive option:selected").val() != undefined && $("#ui_FromEmailIdActive option:selected").val() != null && $("#ui_FromEmailIdActive option:selected").val() != "0") {
        let ReplyTo = $("#ui_FromEmailIdActive option:selected").val();
        $("#ui_ReplyTo").val(ReplyTo);
    }
    else {
        $("#ui_ReplyTo").val("");
    }
});

$("#ui_MailTemplate").change(function () {
    let mailTemplate = { Id: 0 };
    mailTemplate.Id = $("#ui_MailTemplate option:selected").val();
    var SubjectLine = MailTemplatesList.find(o => o.Id === parseInt(mailTemplate.Id)).SubjectLine;
    $("#ui_SubjectLine").val(SubjectLine != null ? SubjectLine : "");

    mailUtil.ValidateTemplateSpamScore(mailTemplate, "ui_MailTemplate");
});

$("#ui_AMailTemplate").change(function () {
    let mailTemplate = { Id: 0 };
    mailTemplate.Id = $("#ui_AMailTemplate option:selected").val();
    var SubjectLine = MailTemplatesList.find(o => o.Id === parseInt(mailTemplate.Id)).SubjectLine;
    $("#ui_SubjectLine").val(SubjectLine != null ? SubjectLine : "");

    mailUtil.ValidateTemplateSpamScore(mailTemplate, "ui_AMailTemplate");
});

$("#ui_BMailTemplate").change(function () {
    let mailTemplate = { Id: 0 };
    mailTemplate.Id = $("#ui_BMailTemplate option:selected").val();
    var SubjectLine = MailTemplatesList.find(o => o.Id === parseInt(mailTemplate.Id)).SubjectLine;
    $("#ui_Subjectlinetemplateb").val(SubjectLine != null ? SubjectLine : "");

    mailUtil.ValidateTemplateSpamScore(mailTemplate, "ui_BMailTemplate");
});

$("#close-popup, .clsepopup").click(function () {
    $(this).parents(".popupcontainer").addClass("hideDiv");
    $("#editgroupname").attr("IsGroupAdd", "0");
});

$(".temppreview").click(function () {
    let onlineTemplateURL = "";
    if ($("#ui_variationA").hasClass("active")) {
        $("#ui_variationA").removeClass("active");
        $("#ui_variationB").addClass("active");
        $("#ui_SpanSubject").html(CleanText($.trim($("#ui_Subjectlinetemplateb").val())));
        onlineTemplateURL = `https://${TemplatePath}Campaign-${Plumb5AccountId}-${MailSendingSplitSetting.BMailTemplateId}/TemplateContent.html?${Math.floor(new Date().valueOf() * Math.random())}`;
    } else {
        $("#ui_variationB").removeClass("active");
        $("#ui_variationA").addClass("active");
        $("#ui_SpanSubject").html(CleanText($.trim($("#ui_SubjectLine").val())));
        onlineTemplateURL = `https://${TemplatePath}Campaign-${Plumb5AccountId}-${MailSendingSplitSetting.AMailTemplateId}/TemplateContent.html?${Math.floor(new Date().valueOf() * Math.random())}`;
    }

    let Iframe = `<iframe src="${onlineTemplateURL}" frameborder="0"></iframe>`;
    let MobIframe = `<iframe src="${onlineTemplateURL}" style="width:100%;border:none;height:100%"></iframe>`;
    $("#ui_OnlineTemplateUrl").html(Iframe);
    $("#ui_OnlineMobileTemplateUrl").html(MobIframe);
});

$(".seggraph").click(function () {
    ShowPageLoading();

    if ($('.segmentwrap').hasClass('hideDiv')) {
        $('.segmentwrap').removeClass("hideDiv");
        if ($('.segmentwrap').attr('IsOnce') == "true") {
            $('.segmentwrap').attr('IsOnce', 'false');
            mailUtil.ShowSegmentAnalysis();
        } else {
            HidePageLoading();
        }
    }
    else {
        $('.segmentwrap').addClass("hideDiv");
        HidePageLoading();
    }
});

$("#txtDateFrom").datepicker({
    defaultDate: "+1d",
    prevText: "click for previous months",
    nextText: "click for next months",
    showOtherMonths: true,
    selectOtherMonths: false,
    minDate: new Date()
});

$(document).on('change', '#ui_hours', function () {
    let scheduleHour = $(this).val();
    $(`#ui_TimeFormat`).val("PM").change();
    if (scheduleHour == "12") {
        $(`#ui_timehideAMOption`).hide();
    } else {
        $(`#ui_timehideAMOption`).show();
    }
});
$('#eventitemstitle').on('change', function () {
    if (this.value != "Select") {
        let cursorPos = $('#ui_SubjectLine').prop('selectionStart');
        let MessageContent = $("#ui_SubjectLine").val();
        let textBefore = MessageContent.substring(0, cursorPos);
        let textAfter = MessageContent.substring(cursorPos, MessageContent.length);
        let customField = " {{*[" + eventname + "]~[" + this.value + "]~[TOP1.DESC]~[fallbackdata]*}} ";
        let newMessageContent = textBefore + customField + textAfter;
        $('#ui_SubjectLine').val(newMessageContent);
    }

});
$('#draganddropcustomtitle').on('change', function () {
    if (this.value != "Select") {
        let cursorPos = $('#ui_SubjectLine').prop('selectionStart');
        let MessageContent = $("#ui_SubjectLine").val();
        let textBefore = MessageContent.substring(0, cursorPos);
        let textAfter = MessageContent.substring(cursorPos, MessageContent.length);
        let customField = " [{*" + this.value + "*}] ";
        let newMessageContent = textBefore + customField + textAfter;
        $('#ui_SubjectLine').val(newMessageContent);
    }


});
$('#eventitemssubb').on('change', function () {
    if (this.value != "Select") {
        let cursorPos = $('#ui_Subjectlinetemplateb').prop('selectionStart');
        let MessageContent = $("#ui_Subjectlinetemplateb").val();
        let textBefore = MessageContent.substring(0, cursorPos);
        let textAfter = MessageContent.substring(cursorPos, MessageContent.length);
        let customField = " {{*[" + eventname + "]~[" + this.value + "]~[TOP1.DESC]~[fallbackdata]*}} ";
        let newMessageContent = textBefore + customField + textAfter;
        $('#ui_Subjectlinetemplateb').val(newMessageContent);
    }

});
$('#draganddropcustomsubb').on('change', function () {
    if (this.value != "Select") {
        let cursorPos = $('#ui_Subjectlinetemplateb').prop('selectionStart');
        let MessageContent = $("#ui_Subjectlinetemplateb").val();
        let textBefore = MessageContent.substring(0, cursorPos);
        let textAfter = MessageContent.substring(cursorPos, MessageContent.length);
        let customField = " [{*" + this.value + "*}] ";
        let newMessageContent = textBefore + customField + textAfter;
        $('#ui_Subjectlinetemplateb').val(newMessageContent);
    }

});