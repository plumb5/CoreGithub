var AdvancedSettingHandledbyStatus = 0;
var areaname = 'demographic';
var lmsStage = '', lmsAgent = '', lmsGroup = '';
var IsScoringTab = false, IsThreholdTab = false, IsDecayTab = false;
var LeadScoreName = [];
var LeadScore = [];
var LeadScoreAction = [];
var LeadScorevalues = [];
var headerflag = false;

$(document).ready(function () {
    ExportFunctionName = "LeadScoringExport";

    GetContactCustomDetails();
    scoringUtil.GetLeadScoringStatus();
    scoringUtil.GetLmsStage();
});

var scoringUtil = {
    GetLeadScoring: function (AreaType) {
        var search = "";

        if (areaname == 'demographic') {
            search = $('#ui_txtSearch').val();
        }
        else {
            search = $('#ui_txtSearch1').val();
        }
        //var search = areaname == 'demographic' ? $('#ui_txtSearch').val() : $('#ui_txtSearch1').val();

        $.ajax({
            url: "/Prospect/LeadScoring/GetScoreSettingsDetails",
            type: 'Post',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'ScoringAreaType': areaname, 'ScoreName': search }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: scoringUtil.BindScorings,
            error: ShowAjaxError
        });
    },

    BindScorings: function (response) {
        $("#ui_tbodyReportData,#ui_tbodyReportData1").html('');

        var customfieldname = "";
        var customfielidentifier = "";

        if (response != undefined && response != null && response.length > 0) {
            $.each(response, function (i) {
                if (response[i].IdentifierName == "CustomField") {

                    var scorenamesssvalue = response[i].ScoreName;

                    customfieldname = $('#ddlScoringName option[value = "' + scorenamesssvalue + '"').text();
                    customfielidentifier = scorenamesssvalue;


                }
                else {
                    customfieldname = response[i].ScoreName;
                    customfielidentifier = response[i].IdentifierName;
                }

                eachData = response[i];
                let reportTablerows = `<tr> <td id="name${i}" data-channel="${eachData.Channel}" data-identifier="${customfielidentifier}" data-campignid="${eachData.CampaignId}"  data-Action="${eachData.Event}">
                                        ${customfieldname}

                                    </td>
                                    <td class ="td-wid-10 wordbreak" id="desc${i}">
                                        ${eachData.Description}
                                    </td>
                                    <td id="value${i}">${eachData.Value}</td>
                                    <td><input type="number" value="${eachData.Score}" name="" class ="form-control w-100pc" id="score${i}"></td>
                                </tr>`;
                LeadScoreName.push(eachData.ScoreName)
                LeadScore.push(eachData.Score)
                LeadScoreAction.push(eachData.Event)
                LeadScorevalues.push(eachData.Value)
                if (areaname == 'demographic')
                    $("#ui_tbodyReportData").append(reportTablerows);
                else
                    $("#ui_tbodyReportData1").append(reportTablerows);
            });
            HidePageLoading();
        }
        else {
            if ($('#ui_txtSearch').val() == '' && $('#ui_txtSearch1').val() == '') {
                var defaultData = areaname == 'demographic' ? defaultDemographic : defaultBehaviour;
                for (var i = 0; i < defaultDemographic.length; i++) {


                    let reportTablerows = `<tr> <td id="name${i}" data-channel="${defaultData[i].Channel}" data-identifier="${defaultData[i].IdentifierName}">
                                        ${defaultData[i].ScoreName}
                                    </td>
                                    <td class ="td-wid-10 wordbreak" id="desc${i}">
                                        ${defaultData[i].Description}
                                    </td>
                                    <td id="value${i}">True</td>
                                    <td><input type="number" value="0" name="" class ="form-control w-100pc" id="score${i}"></td>
                                </tr>`;
                    if (areaname == 'demographic')
                        $("#ui_tbodyReportData").append(reportTablerows);
                    else
                        $("#ui_tbodyReportData1").append(reportTablerows);
                }
            }
            else {
                SetNoRecordContent('ui_tbodyReport', 4, 'ui_tbodyReportData');
                SetNoRecordContent('ui_tbodyReport1', 4, 'ui_tbodyReportData1');
            }

            HidePageLoading();
        }
    },
    SaveScoreSettings: function () {
        ShowPageLoading();
        var scoreSettingsList = [];
        var ui_Table = areaname == 'demographic' ? 'ui_tbodyReportData' : 'ui_tbodyReportData1';
        //HidePageLoading();
        var scorenames = "";
        var IdentifierName = "";
        for (var l = 0; l < $("#" + ui_Table).find("tr").length; l++) {

            if ($("#name" + l).attr('data-identifier').replace(/[\t\n]+/g, '').trim().toLowerCase().includes("customfield")) {

                scorenames = $("#name" + l).attr('data-identifier').replace(/[\t\n]+/g, '').trim();
                IdentifierName = "CustomField";
            }
            else {
                scorenames = $("#name" + l).html().replace(/[\t\n]+/g, '').trim();
                IdentifierName = $("#name" + l).attr('data-identifier').replace(/[\t\n]+/g, '').trim();


            }
            var scoreSettings = {

                ScoreName: scorenames,
                IdentifierName: IdentifierName,
                Description: $("#desc" + l).html().replace(/[\t\n]+/g, '').trim(),
                Operator: "equal",
                ScoringAreaType: areaname == 'demographic' ? 'demographic' : 'behaviour',
                Channel: $("#name" + l).attr('data-channel').replace(/[\t\n]+/g, '').trim(),
                Event: $("#name" + l).attr('data-Action'),
                Value: $("#value" + l).html().replace(/[\t\n]+/g, '').trim(),
                Score: $("#score" + l).val(),
                CampaignId: $("#name" + l).attr('data-campignid'),


            };

            scoreSettingsList.push(scoreSettings);
        }

        //console.log(scoreSettingsList);

        $.ajax({
            url: "/Prospect/LeadScoring/SaveScoreSettings",
            type: 'POST',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'scoreSettings': scoreSettingsList, 'ScoringAreaType': areaname }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != undefined && response != undefined) {
                    ShowSuccessMessage(GlobalErrorList.LeadScoring.SaveScoreSettings);
                    HidePageLoading();
                }
            },
            error: ShowAjaxError
        });


    },
    SaveThresholdSettings: function () {
        ShowPageLoading();
        var thresholdSettings = [];

        if ($("#tblThresData").find("tr")[0].innerHTML.indexOf('There is no data for this view') > -1) {
            ShowErrorMessage(GlobalErrorList.LeadScoring.SaveThresholdSettingsError);
            HidePageLoading()
        }
        else {
            for (var l = 0; l < $("#tblThresData").find("tr").length; l++) {

                if ($("#scorevalue_" + l).val() == 0) {
                    ShowErrorMessage(GlobalErrorList.LeadScoring.SaveThresholdSettingsZeroError);
                    HidePageLoading();
                    return;
                } else {
                    var scoreSettings = {
                        Score: $("#scorevalue_" + l).val(),
                        Label: $("#labelvalue_" + l).val(),
                        StageId: $("#actionstage_" + l).val(),
                        GroupId: $("#addActgroup_" + l).val(),
                        AgentId: $("#addactagent_" + l).val()
                    };

                    thresholdSettings.push(scoreSettings);
                }
            }

            console.log(thresholdSettings);

            $.ajax({
                url: "/Prospect/LeadScoring/SaveThresholdSettings",
                type: 'POST',
                data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'ThresholdSettings': thresholdSettings }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) {
                    if (response != undefined && response != undefined) {
                        ShowSuccessMessage(GlobalErrorList.LeadScoring.SaveThresholdSettings);
                        HidePageLoading();
                    }
                },
                error: ShowAjaxError
            });

        }
    },
    SaveDecaySettings: function () {
        ShowPageLoading();
        var decaySettings = [];

        for (var l = 0; l < 7; l++) {
            var deSettings = {
                NonActivityDays: $("#txtLabel_" + l).attr('data-value').replace(/[\t\n]+/g, '').trim(),
                IsActive: $("#txtDecaySub_" + l).val() != 0 ? true : false,
                IsClearScore: $("#txtDecayCheck_" + l).prop('checked'),
                ScoreSubstract: $("#txtDecaySub_" + l).val()
            };

            decaySettings.push(deSettings);
        }

        $.ajax({
            url: "/Prospect/LeadScoring/SaveDecaySetting",
            type: 'POST',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'DecaySettingList': decaySettings }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != undefined && response != undefined) {
                    ShowSuccessMessage(GlobalErrorList.LeadScoring.SaveDecaySettings);
                    HidePageLoading();
                }
            },
            error: ShowAjaxError
        });
    },
    UpdateLeadScoring: function (status, area) {
        ShowPageLoading();

        var leadScoring = { IsActiveScoreSettings: false, IsActiveThresholdSettings: false, IsActiveDecaySettings: false };

        if (area == 'score')
            leadScoring.IsActiveScoreSettings = status;
        if (area == 'thres')
            leadScoring.IsActiveThresholdSettings = status;
        if (area == 'decay')
            leadScoring.IsActiveDecaySettings = status;

        $.ajax({
            url: "/Prospect/LeadScoring/SaveScore",
            type: 'POST',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'LeadScoring': leadScoring, 'Area': area }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != undefined && response != undefined && response.Id > 0) {
                    ShowSuccessMessage(GlobalErrorList.LeadScoring.SaveScoreStatus);
                }
                HidePageLoading();
            },
            error: ShowAjaxError
        });

    },
    GetLeadScoringStatus: function (AreaType) {
        $.ajax({
            url: "/Prospect/LeadScoring/GetDetails",
            type: 'Post',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                console.log("load - "+response.IsActiveScoreSettings);
                if (response.IsActiveScoreSettings == true) {
                    IsScoringTab = true;
                    scoringUtil.ToogleScoreing(true);
                    scoringUtil.GetLeadScoring(areaname);
                    $(".demograptab").removeClass("hideDiv");
                    $(".demograptabno").addClass("hideDiv");
                }
                else {
                    IsScoringTab = false;
                    scoringUtil.ToogleScoreing(false);
                    $(".demograptab").addClass("hideDiv");
                    $(".demograptabno").removeClass("hideDiv");
                    HidePageLoading();
                }

                IsThreholdTab = response.IsActiveThresholdSettings == true ? true : false;
                IsDecayTab = response.IsActiveDecaySettings == true ? true : false;

            },
            error: ShowAjaxError
        });
    },
    ToogleScoreing: function (status) {
        $(".toggleUnsub").toggles({
            on: status,
            height: 22
        });
    },
    ToogleThreshold: function (status) {
        if (status) {
            $(".behaviourtabno").addClass("hideDiv");
            $(".behaviourtab").removeClass("hideDiv");
        } else {
            $(".behaviourtab").addClass("hideDiv");
            $(".behaviourtabno").removeClass("hideDiv");
        }

        $(".togglebehav").toggles({
            on: status,
            height: 22
        });
    },
    ToogleDecay: function (status) {

        if (status) {
            $(".decaytabno").addClass("hideDiv");
            $(".decaytabtab").removeClass("hideDiv");
        } else {
            $(".decaytabtab").addClass("hideDiv");
            $(".decaytabno").removeClass("hideDiv");
        }

        $(".toggledecay").toggles({
            on: status,
            height: 22
        });
    },

    //Get Lms Stage
    GetLmsStage: function () {
        ShowPageLoading();
        $.ajax({
            url: "/Prospect/Leads/GetStageScore",
            type: "POST",
            data: JSON.stringify({ 'accountId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response.StagesList != null && response.StagesList.length > 0) {
                    StageList = response.StagesList;
                    $.each(StageList, function (i) {
                        lmsStage += `<option value="${$(this)[0].Score}">${$(this)[0].Stage}</option>`;
                    });
                }
                scoringUtil.BindGroups();


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
                    $.each(response, function () {
                        lmsGroup += `<option value="${$(this)[0].Id}">${$(this)[0].Name}</option>`;
                    });
                }
                scoringUtil.GetLmsAdvacedSettings();
            },
            error: ShowAjaxError
        });
    },
    GetLmsAdvacedSettings: function () {
        $.ajax({
            url: "/Prospect/AdvancedSettings/GetLmAdvacedSettings",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'key': "HANDLEBY" }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                var data = response[0];
                if (data !== undefined) {
                    AdvancedSettingHandledbyStatus = data.Value;
                }
                scoringUtil.GetUsersList();
            },
            error: function (error) {
                HidePageLoading();
            }
        });
    },
    //Get Agent
    GetUsersList: function () {
        $.ajax({
            url: "/Prospect/Leads/GetUser",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'Getallusers': AdvancedSettingHandledbyStatus }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (userDetails) {
                if (userDetails != null && userDetails != undefined && userDetails.length > 0) {
                    UserList = userDetails;
                    $.each(UserList, function (i) {
                        //Binding only active users
                        if (this.ActiveStatus) {
                            lmsAgent += "<option value='" + this.UserInfoUserId + "'>" + this.FirstName + " (" + this.EmailId + ")</option>";
                        }
                    });
                }

            },
            error: ShowAjaxError
        });
        HidePageLoading();
    },
    bindThreshold: function () {
        $("#tblThresData").html('');
        $.ajax({
            url: "/Prospect/LeadScoring/GetThresholdSettings",
            type: 'Post',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                //$("#ui_tbodyReportData,#ui_tbodyReportData1").html('');

                if (response != undefined && response != null && response.length > 0) {
                    $.each(response, function (i) {
                        var eachData = response[i];

                        scoringUtil.bindThresholdData(i, 0, eachData.Id);

                        $("#scorevalue_" + i).val(eachData.Score).change();
                        $("#labelvalue_" + i).val(eachData.Label).change();
                        $("#actionstage_" + i).val(eachData.StageId).change();
                        $("#addActgroup_" + i).val(eachData.GroupId).change();
                        $("#addactagent_" + i).val(eachData.AgentId).change();
                    })
                }
                else {
                    SetNoRecordContent('addactiontable', 6, 'tblThresData');
                    HidePageLoading();
                }
            },
            error: ShowAjaxError
        });

    },
    bindThresholdData: function (actiondivcont, add, Id) {

        if (add == 1)
            actiondivcont = ($("#tblThresData").val() != '') && $("#tblThresData").find("tr")[0].innerHTML.indexOf("There is no data for this view") > -1 ? 0 : $("#tblThresData").find("tr").length;;

        let reportTablerows = `<tr>
                          <td>
                              <input id="scorevalue_${actiondivcont}" type="number" value="0" name=""
                                class="form-control w-100pc" id="">
                        </td>
                        <td><select name="" class="form-control w-100pc" id="labelvalue_${actiondivcont}">
                                <option value="Warm">Warm</option>
                                <option value="Cold">Cold</option>
                                <option value="Hot">Hot</option>
                            </select></td>
                        <td>
                            <div class ="w-160pc">
                            <select name="" class="form-control addactiondrp" id="actionstage_${actiondivcont}">
                                    <option value="0">Select Stage</option>
                                    ${lmsStage}
                                </select></div>
                        </td>
                        <td>
                            <div class="w-200"><select name=""
                                    class ="form-control addactiondrp w-150" id="addActgroup_${actiondivcont}">
                                     <option value="0">Select Group</option>
                                      ${lmsGroup}
                                </select></div>
                        </td>
                        <td>
                            <div class="w-200"><select name=""
                                    class="form-control addactiondrp" id="addactagent_${actiondivcont}">
                                    <option value="0">Select Agent</option>
                                    ${lmsAgent}
                                </select></div>
                        </td>
                        <td class="text-center"><i id="delactionrw"
                                class="ion ion-ios-trash pgeurldel" onclick="DeleteThreshold(${Id});"></i>
                        </td>
                        </tr>`;

        $("#tblThresData").append(reportTablerows);

        //deleteactionrow();
        $(".addactiondrp").select2({
            minimumResultsForSearch: "",
            dropdownAutoWidth: false,
            containerCssClass: "border",
        });
    },
    bindDecay: function () {
        $("#tblDecayData").html('');
        $.ajax({
            url: "/Prospect/LeadScoring/GetDecaySetting",
            type: 'Post',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                //$("#ui_tbodyReportData,#ui_tbodyReportData1").html('');

                if (response != undefined && response != null && response.length > 0) {
                    $.each(response, function (i) {
                        var eachData = response[i];
                        var durday = i > 3 ? "Months" : "days";
                        var totalday = i > 3 ? eachData.NonActivityDays / 30 : eachData.NonActivityDays;

                        var chkbox = eachData.IsClearScore == 1 ? "checked" : "";
                        var ddlchk = eachData.IsClearScore == 1 ? "disabled" : "";

                        let reportTablerows = `<div class="row mb-4">
                                        <div class="col-lg-4">
                                            <label for="" id="txtLabel_${i}" data-value="${eachData.NonActivityDays}" class ="font-16 frmlbltxt">No activity for ${totalday} ${durday}</label>
                                        </div>
                                        <div class="col-lg-6">
                                            <div class="leadinptwrp d-flex align-items-center flex-wrap">
                                                <div class="screinptwrp">
                                                    <input type="number" name="" value="${eachData.ScoreSubstract}" class ="form-control w-60px" id="txtDecaySub_${i}" ${ddlchk}> <span class ="frmlbltxt ml-2">points subtracted </span>
                                                </div>
                                                <div class="clrchckbxwrp">
                                                    <div class ="custom-control custom-checkbox">
                                                        <input type="checkbox" class ="custom-control-input" id="txtDecayCheck_${i}" onclick="decayCheck(${i})" name="clrscore" ${chkbox}>
                                                        <label class ="custom-control-label" for="txtDecayCheck_${i}">Clear lead score</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>`;
                        $("#tblDecayData").append(reportTablerows);
                    })
                }
                else {

                    $("#tblDecayData").html('');
                    for (var i = 0; i < 7; i++) {
                        var dur = i == 0 ? 15 : i == 1 ? 30 : i == 2 ? 60 : i == 3 ? 90 : i == 4 ? 6 : i == 5 ? 9 : 12;
                        var totaldur = i > 3 ? dur * 30 : dur;
                        var durday = i > 3 ? "Months" : "days";

                        let reportTablerows = `<div class="row mb-4">
                                        <div class="col-lg-4">
                                            <label for="" id="txtLabel_${i}" data-value="${totaldur}" class ="font-16 frmlbltxt">No activity for ${dur} ${durday}</label>
                                        </div>
                                        <div class="col-lg-6">
                                            <div class="leadinptwrp d-flex align-items-center flex-wrap">
                                                <div class="screinptwrp">
                                                    <input type="number" name="" value="0" class ="form-control w-60px" id="txtDecaySub_${i}"> <span class ="frmlbltxt ml-2">points subtracted </span>
                                                </div>
                                                <div class="clrchckbxwrp">
                                                    <div class ="custom-control custom-checkbox">
                                                        <input type="checkbox" class ="custom-control-input" id="txtDecayCheck_${i}"  onclick="decayCheck(${i})" name="clrscore" >
                                                        <label class ="custom-control-label" for="txtDecayCheck_${i}">Clear lead score</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>`;
                        $("#tblDecayData").append(reportTablerows);
                    }
                    HidePageLoading();
                }
            },
            error: ShowAjaxError
        });

    },
    GetSmsTemplates: function () {
        $.ajax({
            url: "/Sms/ScheduleCampaign/GetTemplateList",
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ 'accountId': Plumb5AccountId }),
            dataType: "json",
            success: function (response) {
                if (response != undefined && response != null) {
                    $.each(response, function () {
                        $("#ddlCampaign").append(`<option value="${$(this)[0].Id}">${$(this)[0].Name}</option>`);
                    });
                }
            },
            error: ShowAjaxError
        });
    },
    GetMailTemplates: function () {
        $.ajax({
            url: "/Mail/MailTemplate/GetAllTemplateList",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                $.each(response, function () {
                    $("#ddlCampaign").append(`<option value="${$(this)[0].Id}">${$(this)[0].Name}</option>`);
                });
            },
            error: ShowAjaxError
        });
    },
    GetWebPushTemplates: function () {
        $.ajax({
            url: "/Journey/CreateWorkflow/GetWebPushTemplateList",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId }),
            async: false,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                $.each(response, function () {
                    $("#ddlCampaign").append(`<option value="${$(this)[0].Id}">${$(this)[0].TemplateName}</option>`);
                });
            },
            error: ShowAjaxError
        });
    },
    GetAllForms: function () {
        $.ajax({
            url: "/CaptureForm/CommonDetailsForForms/GetFormsList",
            dataType: "json",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataFilter: function (data) { return data; },
            success: function (response) {
                if (response != undefined && response != null && response.length > 0) {
                    var formsList = response;
                    $.each(formsList, function () {
                        if ($(this)[0].EmbeddedFormOrPopUpFormOrTaggedForm != null && $(this)[0].EmbeddedFormOrPopUpFormOrTaggedForm != "") {
                            if ($("#ddlAction option:selected").val().toLowerCase() == "impression") {
                                $("#ddlCampaign").append(`<option value="${$(this)[0].Id}">${$(this)[0].FormIdentifier}</option>`);
                            }
                            else if ($("#ddlAction option:selected").val().toLowerCase() == "response") {
                                if ($(this)[0].FormType == 1 || $(this)[0].FormType == 2 || $(this)[0].FormType == 4)
                                    $("#ddlCampaign").append(`<option value="${$(this)[0].Id}">${$(this)[0].FormIdentifier}</option>`);
                            }
                            else if ($("#ddlAction option:selected").val().toLowerCase() == "close") {
                                if ($(this)[0].EmbeddedFormOrPopUpFormOrTaggedForm.toLowerCase() == "popupform") {
                                    $("#ddlCampaign").append(`<option value="${$(this)[0].Id}">${$(this)[0].FormIdentifier}</option>`);
                                }
                            }
                        }
                        //if ($(this)[0].FormType != 19) {
                        //    $("#ddlCampaign").append(`<option value="${$(this)[0].Id}">${$(this)[0].FormIdentifier}</option>`);
                        //}
                    });
                }
                else {
                    // CreateWorkFlowRulesUtil.AddOptionToDropDown(["ui_ddlRespondedFroms", "ui_ddlNotRespondedFroms", "ui_ddlAnswerDependencyFroms", "ui_ddlFormCloseEvent", "ui_ddlFormImpression", "ui_ddlResponseCountEvent"], "0", "No froms have been added yet", "red");
                }
            },
            error: ShowAjaxError
        });
    },
    BindAction: function (action) {
        $("#ddlAction").html('');
        if (action == 'form')
            $("#ddlAction").append(`<option value="select">Select</option><option value="impression">Impression</option><option value="response">Response</option><option value="close">Closed</option>`);
        if (action == 'email')
            $("#ddlAction").append(`<option value="select">Select</option><option value="open">Opened</option><option value="click">Clicked</option><option value="unsubscribe">Unsubscribe</option>`);
        if (action == 'sms')
            $("#ddlAction").append(`<option value="select">Select</option><option value="deliver">Delivered</option><option value="click">Clicked</option><option value="unsubscribe">Unsubscribe</option>`);
        if (action == 'chat')
            $("#ddlAction").append(`<option value="select">Select</option><option value="miss">Missed</option><option value="complete">completed</option>`);
        if (action == 'webpush')
            $("#ddlAction").append(`<option value="select">Select</option><option value="view">Viewed</option><option value="click">Clicked</option><option value="close">Closed</option><option value="unsubscribe">Unsubscribe</option>`);
        if (action == 'pageutmparameters')
            $("#ddlAction").append(`<option value="select">Select</option><option value="utmterm">Utm Term</option><option value="utmsource">Utm Source</option><option value="utnmedium">Utm Medium</option><option value="utncampign">Utm Campign</option>`);
        if (action == 'behaviourparameters')
            $("#ddlAction").append(`<option value="select">Select</option><option value="pagedepth">Page depth</option><option value="pageview">Page views</option><option value="timespent">Time spent</option>`);

    }

};


$("#btnScoreSave").click(function () {

    var values = "True";
    if (areaname == 'demographic') {

        if ($("#ddlScoringName").val() == 'select') {
            ShowErrorMessage(GlobalErrorList.LeadScoring.ScoringName);
            return false;
        }
        if ($.trim($("#txtScoringDescription").val()).length == 0) {
            ShowErrorMessage(GlobalErrorList.LeadScoring.ScoringDescription);
            return false;
        }

        if ($.trim($("#txtValue").val()).length == 0) {
            ShowErrorMessage(GlobalErrorList.LeadScoring.ScoreValue);
            return false;
        }

        if ($.trim($("#txtScore").val()).length == 0) {
            ShowErrorMessage(GlobalErrorList.LeadScoring.Score);
            return false;
        }

        if ($.inArray($("#ddlScoringName option:selected").text(), LeadScoreName) > -1 && $.inArray(parseInt($("#txtScore").val()), LeadScore) > -1
            || $.inArray($("#ddlScoringName option:selected").val(), LeadScoreName) > -1 && $.inArray(parseInt($("#txtScore").val()), LeadScore) > -1) {

            ShowErrorMessage(GlobalErrorList.LeadScoring.Duplicatevalidation);
            return false;
        }

        var i = $("#ui_tbodyReportData").find("tr")[0].innerHTML.indexOf("There is no data for this view") > -1 ? 0 : $("#ui_tbodyReportData").find("tr").length;
        let reportTablerows = `<tr> <td id="name${i}" data-channel="${$("#ddlScoringName").find(':selected').attr('data-channel')}" data-identifier="${$("#ddlScoringName").val()}">
                                        ${$("#ddlScoringName").find(':selected').text()}
                                    </td>
                                    <td class ="td-wid-10 wordbreak" id="desc${i}">
                                       ${$("#txtScoringDescription").val()}
                                    </td>
                                    <td id="value${i}">${$("#txtValue").val()} </td>
                                    <td><input type="number" value="${$("#txtScore").val()}" name="" class ="form-control w-100pc" id="score${i}"></td>
                                </tr>`;
        $("#ui_tbodyReportData").append(reportTablerows);
        LeadScoreName.push($("#ddlScoringName option:selected").text());
        LeadScore.push(parseInt($("#txtScore").val()));

        //  refreshadddemographicfields();
        $(".clsepopup").click();
    } else {

        if ($("#ddlChannel").val() == 'select') {
            ShowErrorMessage(GlobalErrorList.LeadScoring.Channel);
            return false;
        }
        if ($("#ddlChannel").val() != 'pageurlparameters') {
            if ($("#ddlAction").val() == 'select') {
                ShowErrorMessage(GlobalErrorList.LeadScoring.Action);
                return false;
            }
        }

        if ($("#ddlChannel").val() == 'pageutmparameters' || $("#ddlChannel").val() == 'behaviourparameters' || $("#ddlChannel").val() == 'pageurlparameters') {
            values = $('#txtvalues').val();
            if ($("#txtvalues").val() == '') {
                ShowErrorMessage("please give  value");

                return false;
            }
            if ($("#ddlChannel").val() == 'pageurlparameters') {

                if ($.inArray($("#txtvalues").val(), LeadScorevalues) > -1 && $.inArray(parseInt($("#txtScore1").val()), LeadScore) > -1) {

                    ShowErrorMessage(GlobalErrorList.LeadScoring.Duplicatevalidation);
                    return false;
                }

            }


        }
        if ($("#ddlChannel").val() != 'pageutmparameters' && $("#ddlChannel").val() != 'behaviourparameters' && $("#ddlChannel").val() != 'pageurlparameters') {
            if ($("#ddlCampaign").val() == 'select') {
                ShowErrorMessage(GlobalErrorList.LeadScoring.Campaign);
                return false;
            }
        }
        if ($.trim($("#txtScoringDescription1").val()).length == 0) {
            ShowErrorMessage(GlobalErrorList.LeadScoring.Description1);
            return false;
        }

        if ($.trim($("#txtScore1").val()).length == 0) {
            ShowErrorMessage(GlobalErrorList.LeadScoring.Score1);
            return false;
        }
        if ($.inArray($("#ddlAction").val(), LeadScoreAction) > -1 && $.inArray(parseInt($("#txtScore1").val()), LeadScore) > -1) {

            ShowErrorMessage(GlobalErrorList.LeadScoring.Duplicatevalidation);
            return false;
        }


        var i = $("#ui_tbodyReportData1").find("tr")[0].innerHTML.indexOf("There is no data for this view") > -1 ? 0 : $("#ui_tbodyReportData1").find("tr").length;
        let reportTablerows = `<tr> <td id="name${i}" data-channel="${$("#ddlChannel").find(':selected').attr('data-channel')}" data-identifier="${$("#ddlChannel").val()}" data-campignid="${$("#ddlCampaign").val()}"
                                    data-action="${$("#ddlAction").val()}">
                                        ${$("#ddlChannel").find(':selected').text()}
                                    </td>
                                    <td class ="td-wid-10 wordbreak" id="desc${i}">
                                       ${$("#txtScoringDescription1").val()}
                                    </td>
                                    <td id="value${i}">${values}</td>
                                    <td><input type="number" value="${$("#txtScore1").val()}" name="" class ="form-control w-100pc" id="score${i}"></td>
                                </tr>`;
        if (i == 0) {
            $("#ui_tbodyReportData1").html('');
            refreshaddbehaviourfields();
        }
        $("#ui_tbodyReportData1").append(reportTablerows);
        // refreshaddbehaviourfields();

        LeadScoreName.push($("#ddlChannel option:selected").text());
        LeadScore.push(parseInt($("#txtScore1").val()));
        LeadScorevalues.push($("#txtvalues").val());
        LeadScoreAction.push($("#ddlAction").val());

        $(".clsepopup").click();
    }


});
function refreshadddemographicfields() {
    $("#ddlScoringName").select2().val('select').trigger('change');
    document.getElementById("txtScoringDescription").value = null;
    document.getElementById("txtValue").value = null;
    document.getElementById("txtScore").value = null;


}
function refreshaddbehaviourfields() {
    $("#ddlChannel").select2().val('select').trigger('change');
    $("#ddlAction").select2().val('select').trigger('change');
    $("#ddlCampaign").select2().val('select').trigger('change');
    $('.lblvalues').text("Action Values");
    document.getElementById("txtScoringDescription1").value = null;
    document.getElementById("txtScore1").value = null;
    document.getElementById("txtvalues").value = null;



}
$(".subtabName").click(function () {
    $('.scoresearch,.scoresearchbehaviour').html('');
    let gettabname = $(this).attr("data-subtabcont");
    $(".subtabName").removeClass("btn-primary btn-secondary");
    $(".subtabcontent").addClass("hideDiv");
    $(this).addClass("btn-primary");
    $(this).siblings().addClass("btn-secondary");
    if (gettabname == "subtabtwo") {
        areaname = 'behaviour';
        scoringUtil.GetLeadScoring(areaname);
        $("#" + gettabname).removeClass("hideDiv");
        $(".demograpsavewrp").addClass("hideDiv");
        $(".behavioursavewrp").removeClass("hideDiv");
    } else {
        areaname = 'demographic';
        scoringUtil.GetLeadScoring(areaname);
        $("#" + gettabname).removeClass("hideDiv");
        $(".demograpsavewrp").removeClass("hideDiv");
        $(".behavioursavewrp").addClass("hideDiv");
    }
});

$("#addscorebehbtn").click(function () {
    $(".popupcontainer").removeClass("hideDiv");
    $(".addscoredemowrp").addClass("hideDiv");
    $(".addscorebehavirwrp").removeClass("hideDiv");

});

$(".scoresearch").keypress(function (e) {
    if ((e.which && e.which === 13) || (e.keyCode && e.keyCode === 13)) {
        if (CleanText($.trim($('.scoresearch').val())).length == 0) {
            ShowErrorMessage(GlobalErrorList.LeadScoring.ScoreSearch_error);
            HidePageLoading();
            return false;
        }
        ShowPageLoading();
        scoringUtil.GetLeadScoring(areaname);
    }
});

$(".scoresearch").keyup(function (e) {
    if (e.which && e.which === 8 || e.keyCode && e.keyCode === 46)
        if (CleanText($('.scoresearch').val()).length === 0) {
            ShowPageLoading();
            scoringUtil.GetLeadScoring(areaname);
        }
});

//-------------------------------------

$(".scoresearchbehaviour").keypress(function (e) {
    if ((e.which && e.which === 13) || (e.keyCode && e.keyCode === 13)) {
        if (CleanText($.trim($('.scoresearchbehaviour').val())).length == 0) {
            ShowErrorMessage(GlobalErrorList.LeadScoring.ScoreSearch_error);
            HidePageLoading();
            return false;
        }
        ShowPageLoading();
        scoringUtil.GetLeadScoring(areaname);
    }
});

$(".scoresearchbehaviour").keyup(function (e) {
    if (e.which && e.which === 8 || e.keyCode && e.keyCode === 46)
        if (CleanText($('.scoresearchbehaviour').val()).length === 0) {
            ShowPageLoading();
            scoringUtil.GetLeadScoring(areaname);
        }
});

//$(".scoresearch").keyup(function (event) {
//    if (event.keyCode === 13) {
//        scoringUtil.GetLeadScoring(areaname);
//        event.preventDefault();
//    }
//    else {
//        var templateName = CleanText($('.scoresearch').val());
//        if (templateName === '') {
//            scoringUtil.GetLeadScoring(areaname);
//        }
//    }
//});

$("#SearchBybehaviour").click(function () {
    ShowPageLoading();
    if ($.trim($("#ui_txtSearch1").val()).length == 0) {
        ShowErrorMessage(GlobalErrorList.LeadScoring.ScoreSearch_error);
        $("#ui_txtSearch1").focus();
        setTimeout(function () { HidePageLoading(); }, 500);
        return false;
    }
    else {
        scoringUtil.GetLeadScoring(areaname);
        event.preventDefault();
    }
});

$("#SearchBydemographic").click(function () {
    ShowPageLoading();
    if ($.trim($("#ui_txtSearch").val()).length == 0) {
        ShowErrorMessage(GlobalErrorList.LeadScoring.ScoreSearch_error);
        $("#ui_txtSearch").focus();
        setTimeout(function () { HidePageLoading(); }, 500);
        return false;
    }
    else {
        scoringUtil.GetLeadScoring(areaname);
        event.preventDefault();
    }
});


$('#addgroupoperation').select2({
    minimumResultsForSearch: '',
    dropdownAutoWidth: false
});


$('.useraccntdrp').select2({
    minimumResultsForSearch: '',
    dropdownAutoWidth: false
});

$('.addactiondrp').select2({
    minimumResultsForSearch: '',
    dropdownAutoWidth: false,
    containerCssClass: "border",
});

$(".toggleUnsub").toggles({
    on: true,
    height: 22,
});

$(".togglebehav").toggles({
    on: true,
    height: 22
});

$(".toggledecay").toggles({
    on: true,
    height: 22
});



$(".toggleUnsub").click(function () {
    console.log(IsScoringTab);
    if (IsScoringTab == false) {
        IsScoringTab = true;
        scoringUtil.GetLeadScoring(areaname);
        scoringUtil.UpdateLeadScoring(true, 'score');
        $(".demograptab").removeClass("hideDiv");
        $(".demograptabno").addClass("hideDiv");
    } else {
        IsScoringTab = false;
        scoringUtil.UpdateLeadScoring(false, 'score');
        $(".demograptab").addClass("hideDiv");
        $(".demograptabno").removeClass("hideDiv");
    }
});

$('.togglebehav').click(function () {
    if (IsThreholdTab == false) {
        IsThreholdTab = true;
        scoringUtil.bindThreshold();
        scoringUtil.UpdateLeadScoring(true, 'thres');
        $(".behaviourtab").removeClass("hideDiv");
        $(".behaviourtabno").addClass("hideDiv");
    } else {
        IsThreholdTab = false;
        scoringUtil.UpdateLeadScoring(false, 'thres');
        $(".behaviourtab").addClass("hideDiv");
        $(".behaviourtabno").removeClass("hideDiv");
    }
});

$('.toggledecay').click(function () {
    if (IsDecayTab == false) {
        IsDecayTab = true;
        scoringUtil.bindDecay();
        scoringUtil.UpdateLeadScoring(true, 'decay');
        $(".decaytabno").addClass("hideDiv");
        $(".decaytabtab").removeClass("hideDiv");
    } else {
        IsDecayTab = false;
        scoringUtil.UpdateLeadScoring(false, 'decay');
        $(".decaytabtab").addClass("hideDiv");
        $(".decaytabno").removeClass("hideDiv");
    }
});


$("#addscorebtn").click(function () {
    $(".popupcontainer").removeClass("hideDiv");
    $(".addscorebehavirwrp").addClass("hideDiv");
    $(".addscoredemowrp").removeClass("hideDiv");

});

$("#close-popup, .clsepopup").click(function () {
    $(this).parents(".popupcontainer").addClass("hideDiv");
    $("tr").removeClass("activeBgRow");
    $(".errmsgemlvalidwrp .ion-ios-information").popover("hide");
    refreshaddbehaviourfields();
    refreshadddemographicfields();
});

$(".setttabitem").click(function () {
    var checktabcontname = $(this).attr("data-setttype");
    if (checktabcontname == "tabconttwo") {
        if (IsThreholdTab == true) {
            scoringUtil.ToogleThreshold(true);
            scoringUtil.bindThreshold();
        }
        else {
            scoringUtil.ToogleThreshold(false);
        }
    }
    else if (checktabcontname == "tabcontthree") {
        if (IsDecayTab == true) {
            scoringUtil.ToogleDecay(true);
            scoringUtil.bindDecay();
        }
        else {
            scoringUtil.ToogleDecay(false);
        }
    }


    $(".setttabitem").removeClass("active");
    $(".setttabcontainer").addClass("hideDiv");
    $(this).addClass("active");
    $("#" + checktabcontname).removeClass("hideDiv");
});

$("#addactionbtn").click(function () {
    if ($("#tblThresData").find("tr")[0].innerHTML.indexOf("There is no data for this view") > -1) { $("#tblThresData").html(''); }
    scoringUtil.bindThresholdData(0, 1);
});


deleteactionrow = () => {
    $(document).on("click", "#delactionrw", function () {
        if ($("#tblThresData").html() == '') { SetNoRecordContent('addactiontable', 6, 'tblThresData'); }
        $(this).closest("tr").remove();
    });
};

$(document).on("click", "#delactionrw", function () {
    $(this).closest("tr").remove();
});


function DeleteThreshold(id) {
    $.ajax({
        url: "/Prospect/LeadScoring/DeleteThreshold",
        type: 'Post',
        data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'id': id }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: () => {
            ShowSuccessMessage("Deleted successfully");
        },
        error: ShowAjaxError
    });
}

$("#ddlChannel").change(function () {
    $("#ddlCampaign").html("");
    $("#ddlCampaign").append(`<option value="select">Select</option><option value="0">All Campaign</option>`);
    $(".CampaignDiv").removeClass("hideDiv");
    $(".ActionDiv").removeClass("hideDiv");
    $(".txtvaluesDiv").addClass("hideDiv");
    $('.lblvalues').text("Action Values");
    if ($('option:selected', this).val() == 'form') {
        scoringUtil.BindAction('form');
        //scoringUtil.GetAllForms();
    }

    else if ($('option:selected', this).val() == 'email') {
        scoringUtil.BindAction('email');
        scoringUtil.GetMailTemplates();
    }
    else if ($('option:selected', this).val() == 'sms') {
        scoringUtil.BindAction('sms');
        scoringUtil.GetSmsTemplates();
    }
    else if ($('option:selected', this).val() == 'chat') {
        scoringUtil.BindAction('chat');
        //scoringUtil.GetMailTemplates();
    }
    else if ($('option:selected', this).val() == 'webpush') {
        scoringUtil.BindAction('webpush');
        scoringUtil.GetWebPushTemplates();
    }
    else if ($('option:selected', this).val() == 'pageutmparameters') {
        scoringUtil.BindAction('pageutmparameters');
        $(".CampaignDiv").addClass("hideDiv");
        $(".txtvaluesDiv").removeClass("hideDiv");

    }
    else if ($('option:selected', this).val() == 'behaviourparameters') {
        scoringUtil.BindAction('behaviourparameters');
        $(".CampaignDiv").addClass("hideDiv");
        $(".txtvaluesDiv").removeClass("hideDiv");

    }
    else if ($('option:selected', this).val() == 'pageurlparameters') {

        $(".CampaignDiv").addClass("hideDiv");
        $(".ActionDiv").addClass("hideDiv");
        $(".txtvaluesDiv").removeClass("hideDiv");
        $('.lblvalues').text("Keyword Value");
        $("#ddlAction").val("Null");
    }

});

$("#ddlAction").change(function () {
    if ($("#ddlChannel option:selected").val() != null && $("#ddlChannel option:selected").val() != "" && $("#ddlChannel option:selected").val() != "select") {
        if ($("#ddlChannel option:selected").val() == "form") {
            if ($('option:selected', this).val() != null && $('option:selected', this).val() != "" && $('option:selected', this).val() != "select") {
                if ($('option:selected', this).val() == 'impression' || $('option:selected', this).val() == 'response' || $('option:selected', this).val() == 'close') {
                    $("#ddlCampaign").html("");
                    $("#ddlCampaign").append(`<option value="select">Select</option><option value="0">All Campaign</option>`);
                    scoringUtil.GetAllForms();

                }
            }
            else {
                $("#ddlCampaign").html("");
                $("#ddlCampaign").append(`<option value="select">Select</option><option value="0">All Campaign</option>`);
            }
        }
        $('.lblvalues').text($('option:selected', this).text());
    }


});
function GetContactCustomDetails() {

    $.ajax({
        url: "/Prospect/LeadScoring/LeadScoring_GetContactCustomDetailsDto",
        type: 'POST',
        data: JSON.stringify({ 'accountId': Plumb5AccountId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            for (var i = 0; i < response.length; i++) {
                $("#ddlScoringName").append(`<option value="${'CustomField' + (i + 1)}" data-channel="contact" cstfield="CustomField">${$(response)[i].FieldName}</option>`);

            }
        },

        error: ShowAjaxError
    });
};

function decayCheck(row) {
    if ($("#txtDecayCheck_" + row).is(':checked')) {
        $("#txtDecaySub_" + row).prop("disabled", true);
        $("#txtDecaySub_" + row).val(0);
    } else { $("#txtDecaySub_" + row).prop("disabled", false); }
}

var defaultDemographic = [{
    "ScoreName": "Phone Number",
    "IdentifierName": "phone",
    "Channel": "contact",
    "Description": "Lead Phone Number"
},
{
    "ScoreName": "Free Email Address",
    "IdentifierName": "email",
    "Channel": "contact",
    "Description": "Lead Enters Free Domain Email Address"
}, {
    "ScoreName": "Company Email Address",
    "IdentifierName": "companyemail",
    "Channel": "contact",
    "Description": "Lead Enters Business Email Address"
}, {
    "ScoreName": "Company",
    "IdentifierName": "company",
    "Channel": "contact",
    "Description": "Lead Enters Company Name"
}, {
    "ScoreName": "Gender Male",
    "IdentifierName": "male",
    "Channel": "contact",
    "Description": "If Lead is a Male"
}, {
    "ScoreName": "Gender Female",
    "IdentifierName": "female",
    "Channel": "contact",
    "Description": "If Lead is a Female"
}
];

var defaultBehaviour = [{
    "ScoreName": "Traffic source - Direct",
    "IdentifierName": "directtraffic",
    "Channel": "analytics",
    "Description": "Anyone typing the URL of the website."
},
{
    "ScoreName": "Traffic source - Search",
    "IdentifierName": "searchtraffic",
    "Channel": "analytics",
    "Description": "A person searching for a solution."
}, {
    "ScoreName": "Traffic source - Adwords",
    "IdentifierName": "adwordstraffic",
    "Channel": "analytics",
    "Description": "PPC Campaigns in Search Networks."
}, {
    "ScoreName": "Site Search",
    "IdentifierName": "sitesearch",
    "Channel": "analytics",
    "Description": "Any search done on the website."
}
];

