var edit = 0;
let groupList = [];
var WebPushSubscriptionSettingId = 0;
var WebPushSubDomain = "";
var IsDomainPresent = false;
var Step1WelcomeMessageIconName = "";
var Step2WelcomeMessageIconName = "";
var Step2NativeBrowserIconName = "";
var GetHttpOrHttps = "HTTP";
var containChk = (currentValue) => currentValue.indexOf('http://') > -1 || currentValue.indexOf('https://') > -1;

$(document).ready(function () {
    WebPushSettingUtil.ToogleWebPushSwitch(false);
    $("#ui_spanStep1ConfigJsPath").html("importScripts('" + OnlineScriptsUrl + "Pg_P5_Sw.js');");
    $("#ui_spanStep1ConfigJsPathHttps").html("importScripts('" + OnlineScriptsUrl + "Pg_P5_Sw.js');");


    $("#ui_divStep2Domain").html("." + PushMainDomain);

    WebPushSettingUtil.GetGroups();
    WebPushSettingUtil.GetWebPushSubDomain();
});

var WebPushSettingUtil = {
    GetWebPushSubDomain: function () {
        $.ajax({
            url: "/WebPush/Setting/GetAccountDetails",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != undefined && response != null && response.WebPushSubDomain != undefined && response.WebPushSubDomain != null && response.WebPushSubDomain.length > 0) {
                    IsDomainPresent = true;
                    $("#ui_txtStep2SubDomain").addClass("disableDiv");
                    WebPushSubDomain = response.WebPushSubDomain.replace("." + PushMainDomain, "");
                } else {
                    IsDomainPresent = false;
                    $("#ui_txtStep2SubDomain").removeClass("disableDiv");
                    WebPushSubDomain = (Plumb5AccountDomain.replace(/\s+/g, "")).toLowerCase().replace("https://", "").replace("http://", "").replace("www.", "").replace("//", "").replace("/", "").replace(".", "");
                }
                $("#ui_txtStep2SubDomain").val(WebPushSubDomain);
                WebPushSettingUtil.GetSettingDetails();
            },
            error: ShowAjaxError
        });
    },
    GetSettingDetails: function () {
        $.ajax({
            url: "/WebPush/Setting/GetSettingDetails",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != undefined && response != null && response.Id > 0) {
                    WebPushSubscriptionSettingId = response.Id;
                    WebPushSettingUtil.BindWebPushSetting(response);
                } else {
                    WebPushSettingUtil.ToogleWebPushSwitch(false);
                }
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },
    BindWebPushSetting: function (response) {
        WebPushSettingUtil.ToogleWebPushSwitch(true);
        $("#ui_divWebpushSteps").fadeIn().toggleClass("hideDiv");
        if (response.WebPushStep == "STEP1") {
            GetHttpOrHttps = "HTTPS";
            $("#ui_rdbtnWebpushStep1").prop("checked", true);
            $("#ui_divWebpushStep2").addClass("hideDiv");
            $("#ui_divWebpushStep1").removeClass("hideDiv");

            if (response.IsShowOnAllPages) {
                $("#ui_rdbtnStep1RuleShowAllPage").prop("checked", true);
                $("#ui_divStep1RuleShowSpecificPage").addClass("hideDiv");
            } else {
                $("#ui_rdbtnStep1RuleShowSpecificPage").prop("checked", true);
                $("#ui_divStep1RuleShowSpecificPage").removeClass("hideDiv");
                $("#ui_txtStep1RuleShowSpecificPageUrls").val(response.ShowSpecificPageUrl);
            }

            $("#ui_txtStep1RuleShowOptInDelay").val(response.ShowOptInDelayTime);
            $("#ui_txtStep1RuleHideOptInDelay").val(response.HideOptInDelayTime);

            $("#ui_chkBoxStep1RuleShowOptInPromptDesktop").prop("checked", false);
            if (response.IsOptInDeviceDesktop) {
                $("#ui_chkBoxStep1RuleShowOptInPromptDesktop").prop("checked", true);
            }

            $("#ui_chkBoxStep1RuleShowOptInPromptMobile").prop("checked", false);
            if (response.IsOptInDeviceMobile) {
                $("#ui_chkBoxStep1RuleShowOptInPromptMobile").prop("checked", true);
            }

            $("#ui_chkBoxStep1RuleSendNotificationToLastDevice").prop("checked", false);
            if (response.IsNotificationToLastDevice) {
                $("#ui_chkBoxStep1RuleSendNotificationToLastDevice").prop("checked", true);
            }

            $("#ui_txtStep1RuleExcludePageUrls").val('');
            if (response.ExcludePageUrl != null && response.ExcludePageUrl.length > 0) {
                $("#ui_txtStep1RuleExcludePageUrls").val(response.ExcludePageUrl);
            }

            $("#ui_txtStep1WelcomeMessageTitle").val('');
            if (response.WelcomeMessageTitle != null && response.WelcomeMessageTitle.length > 0) {
                $("#ui_txtStep1WelcomeMessageTitle").val(response.WelcomeMessageTitle);
            }

            $("#ui_txtStep1WelcomeMessageText").val('');
            if (response.WelcomeMessageText != null && response.WelcomeMessageText.length > 0) {
                $("#ui_txtStep1WelcomeMessageText").val(response.WelcomeMessageText);
            }

            $("#ui_iconStep1WelcomeMessageIconClickUrl").val('');
            if (response.WelcomeMessageRedirectUrl != null && response.WelcomeMessageRedirectUrl.length > 0) {
                $("#ui_iconStep1WelcomeMessageIconClickUrl").val(response.WelcomeMessageRedirectUrl);
            }

            $("#ui_pStep1WelcomeMessageIcon").addClass("hideDiv");
            $("#ui_spanStep1WelcomeMessageIconName").html('');
            if (response.WelcomeMessageIcon != null && response.WelcomeMessageIcon.length > 0) {
                Step1WelcomeMessageIconName = response.WelcomeMessageIcon;
                $("#ui_spanStep1WelcomeMessageIconName").html(WebPushSettingUtil.GetImageNameFromUrl(response.WelcomeMessageIcon));
                $("#ui_pStep1WelcomeMessageIcon").removeClass("hideDiv");
            }

            if (response.GroupId != null && response.GroupId > 0) {

                setTimeout(function () { $("#ui_selectGroupsList1").select2().val(response.GroupId).change(); }, 1000);
            }


            if (response.urlassigngroup!="" && response.urlassigngroup != null && JSON.parse(response.urlassigngroup).length > 0) {
                let _assignGroupjson = JSON.parse(response.urlassigngroup);
                let arrraydata = _assignGroupjson;

                for (let i = 0; i < arrraydata.length; i++) {

                    if (i == 0) {
                        $(`#ui_AssignGroupUrl_${i + 1}`).val(arrraydata[i].URL);

                        if (arrraydata[i].AssignGroup != null && arrraydata[i].AssignGroup != "" && arrraydata[i].AssignGroup != undefined) {
                            $(`#ui_ddl_UrlAssignGroup_${i + 1}`).val(arrraydata[i].AssignGroup).trigger('change');
                        }
                    } else {
                        if (edit == 0)
                            $("#addAssignGroup").click();
                        $(`#ui_AssignGroupUrl_${i + 1}`).val(arrraydata[i].URL);
                        if (arrraydata[i].AssignGroup != null && arrraydata[i].AssignGroup != "" && arrraydata[i].AssignGroup != undefined) {
                            $(`#ui_ddl_UrlAssignGroup_${i + 1}`).val(arrraydata[i].AssignGroup).trigger('change');
                        }
                    }

                }
            }
        }
        else if (response.WebPushStep == "STEP2") {
            GetHttpOrHttps = response.HttpOrHttpsPush;
            $("#ui_rdbtnWebpushStep2").prop("checked", true);
            $("#ui_divWebpushStep1").addClass("hideDiv");
            $("#ui_divWebpushStep2").removeClass("hideDiv");

            $("#ui_divStep2Http").removeClass("active");
            $("#ui_divStep2Https").removeClass("active");

            if (GetHttpOrHttps == "HTTP") {
                $("#bwsnotisettheadingTwostep2,#bwsnotisettconfigstep2").removeClass("hideDiv");
                $("#bwsnotisettheadingTwostep2https,#bwsnotisettconfigstep2https").addClass("hideDiv");
                $("#ui_divAccordian2").removeClass("mt-0");
                $("#ui_divAccordian3").removeClass("hideDiv");
            }
            else if (GetHttpOrHttps == "HTTPS") {
                $("#bwsnotisettheadingTwostep2,#bwsnotisettconfigstep2").addClass("hideDiv");
                $("#bwsnotisettheadingTwostep2https,#bwsnotisettconfigstep2https").removeClass("hideDiv");
                $("#ui_divAccordian2").removeClass("mt-0");
                $("#ui_divAccordian3").addClass("hideDiv");
            };

            $("#ui_ddlStep2NotificationOptInPromptType").val(response.NotificationPromptType);

            $("#ui_ddlStep2NotificationOptInPosition").val(response.NotificationPosition);

            $("#ui_txtStep2NotificationOptInMessage").val(response.NotificationMessage);

            $("#ui_txtStep2NotificationOptInAllowButtonText").val(response.NotificationAllowButtonText);

            $("#ui_txtStep2NotificationOptInNotAllowButtonText").val(response.NotificationDoNotAllowButtonText);

            $("#ui_txtStep2NotificationOptInBodyBackgoundColor").val(response.NotificationBodyBackgoundColor);

            $("#ui_txtStep2NotificationOptInBodyTextColor").val(response.NotificationBodyTextColor);

            $("#ui_txtStep2NotificationOptInButtonBackgroundColor").val(response.NotificationButtonBackgoundColor);

            $("#ui_txtStep2NotificationOptInButtonTextColor").val(response.NotificationButtonTextColor);

            if (response.HttpOrHttpsPush == "HTTPS") {
                $("#ui_divStep2Https").addClass("active");
            } else {
                $("#ui_divStep2Http").addClass("active");

                $("#ui_txtStep2NativeOptInMessage").val(response.NativeBrowserMessage);

                $("#ui_pStep2NativeOptInIcon").addClass("hideDiv");
                $("#ui_spanStep2NativeOptInIconName").html('');

                Step2NativeBrowserIconName = response.NativeBrowserIcon;
                $("#ui_spanStep2NativeOptInIconName").html(WebPushSettingUtil.GetImageNameFromUrl(response.NativeBrowserIcon));
                $("#ui_pStep2NativeOptInIcon").removeClass("hideDiv");

                $("#ui_txtStep2NativeOptInBackgoundColor").val(response.NativeBrowserBackgoundColor);

                $("#ui_txtStep2NativeOptInTextColor").val(response.NativeBrowserTextColor);
            }

            if (response.IsShowOnAllPages) {
                $("#ui_rdbtnStep2RuleShowAllPage").prop("checked", true);
                $("#ui_divStep2RuleShowSpecificPage").addClass("hideDiv");
            } else {
                $("#ui_rdbtnStep2RuleShowSpecificPage").prop("checked", true);
                $("#ui_divStep2RuleShowSpecificPage").removeClass("hideDiv");
                $("#ui_txtStep2RuleShowSpecificPageUrls").val(response.ShowSpecificPageUrl);
            }

            $("#ui_txtStep2RuleShowOptInDelay").val(response.ShowOptInDelayTime);
            $("#ui_txtStep2RuleHideOptInDelay").val(response.HideOptInDelayTime);

            $("#ui_chkBoxStep2RuleShowOptInPromptDesktop").prop("checked", false);
            if (response.IsOptInDeviceDesktop) {
                $("#ui_chkBoxStep2RuleShowOptInPromptDesktop").prop("checked", true);
            }

            $("#ui_chkBoxStep2RuleShowOptInPromptMobile").prop("checked", false);
            if (response.IsOptInDeviceMobile) {
                $("#ui_chkBoxStep2RuleShowOptInPromptMobile").prop("checked", true);
            }

            $("#ui_chkBoxStep2RuleSendNotificationToLastDevice").prop("checked", false);
            if (response.IsNotificationToLastDevice) {
                $("#ui_chkBoxStep2RuleSendNotificationToLastDevice").prop("checked", true);
            }

            $("#ui_txtStep2RuleExcludePageUrls").val('');
            if (response.ExcludePageUrl != null && response.ExcludePageUrl.length > 0) {
                $("#ui_txtStep2RuleExcludePageUrls").val(response.ExcludePageUrl);
            }

            $("#ui_txtStep2WelcomeMessageTitle").val('');
            if (response.WelcomeMessageTitle != null && response.WelcomeMessageTitle.length > 0) {
                $("#ui_txtStep2WelcomeMessageTitle").val(response.WelcomeMessageTitle);
            }

            $("#ui_txtStep2WelcomeMessageText").val('');
            if (response.WelcomeMessageText != null && response.WelcomeMessageText.length > 0) {
                $("#ui_txtStep2WelcomeMessageText").val(response.WelcomeMessageText);
            }

            $("#ui_iconStep2WelcomeMessageIconClickUrl").val('');
            if (response.WelcomeMessageRedirectUrl != null && response.WelcomeMessageRedirectUrl.length > 0) {
                $("#ui_iconStep2WelcomeMessageIconClickUrl").val(response.WelcomeMessageRedirectUrl);
            }

            $("#ui_pStep2WelcomeMessageIcon").addClass("hideDiv");
            $("#ui_spanStep2WelcomeMessageIconName").html('');
            if (response.WelcomeMessageIcon != null && response.WelcomeMessageIcon.length > 0) {
                Step2WelcomeMessageIconName = response.WelcomeMessageIcon;
                $("#ui_spanStep2WelcomeMessageIconName").html(WebPushSettingUtil.GetImageNameFromUrl(response.WelcomeMessageIcon));
                $("#ui_pStep2WelcomeMessageIcon").removeClass("hideDiv");
            }
            $("#ui_selectGroupsList2").val(response.GroupId);

            if (response.urlassigngroup != null && JSON.parse(response.urlassigngroup).length > 0) {
                let _assignGroupjson = JSON.parse(response.urlassigngroup);
                let arrraydata = _assignGroupjson;

                for (let i = 0; i < arrraydata.length; i++) {

                    if (i == 0) {
                        $(`#ui_AssignGroupUrl_${i + 1}`).val(arrraydata[i].URL);

                        if (arrraydata[i].AssignGroup != null && arrraydata[i].AssignGroup != "" && arrraydata[i].AssignGroup != undefined) {
                            $(`#ui_ddl_UrlAssignGroup_${i + 1}`).val(arrraydata[i].AssignGroup).trigger('change');
                        }
                    } else {
                        $("#addAssignGroup").click();
                        $(`#ui_AssignGroupUrl_${i + 1}`).val(arrraydata[i].URL);
                        if (arrraydata[i].AssignGroup != null && arrraydata[i].AssignGroup != "" && arrraydata[i].AssignGroup != undefined) {
                            $(`#ui_ddl_UrlAssignGroup_${i + 1}`).val(arrraydata[i].AssignGroup).trigger('change');
                        }
                    }

                }
            }
        }

        WebPushSettingUtil.BindNotificationPreview();
        WebPushSettingUtil.BindNativeBrowserPreview();
    },
    ToogleWebPushSwitch: function (status) {
        $("#ui_divWebPushSwitch").toggles({
            on: status,
            height: 22
        });
    },
    DownLoadStep1ConfigFile: function () {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent($("#ui_spanStep1ConfigJsPath").html()));
        element.setAttribute('download', 'p5_Sw_Direct.js');

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);

        HidePageLoading();
    },
    CopyStep1ConfigFileText: function () {
        var $temp = $("<input>");
        $("body").append($temp);
        $temp.val($("#ui_spanStep1ConfigJsPath").html()).select();
        document.execCommand("copy");
        $temp.remove();
        ShowSuccessMessage(GlobalErrorList.WebPushSetting.JsTextCopied);
        HidePageLoading();
    },
    CopyStep2ConfigFileText: function () {
        var $temp = $("<input>");
        $("body").append($temp);
        $temp.val($("#ui_spanStep1ConfigJsPathHttps").html()).select();
        document.execCommand("copy");
        $temp.remove();
        ShowSuccessMessage(GlobalErrorList.WebPushSetting.JsTextCopied);
        HidePageLoading();
    },
    DeleteSetting: function () {
        if (WebPushSubscriptionSettingId > 0) {
            $.ajax({
                url: "/WebPush/Setting/Delete",
                type: 'POST',
                data: JSON.stringify({ 'accountId': Plumb5AccountId, 'subscriptionSettingId': WebPushSubscriptionSettingId }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) {
                    if (response != undefined && response != null && response) {
                        ShowSuccessMessage(GlobalErrorList.WebPushSetting.SavedSuccess);
                    } else {
                        ShowErrorMessage(GlobalErrorList.WebPushSetting.SaveError);
                    }
                    HidePageLoading();
                },
                error: ShowAjaxError
            });
        } else {
            ShowErrorMessage(GlobalErrorList.WebPushSetting.NoChange);
            HidePageLoading();
        }
    },
    Step1WelcomeMessageIconUpload: function (fileData) {
        $("#ui_pStep1WelcomeMessageIcon").addClass("hideDiv");
        $("#ui_spanStep1WelcomeMessageIconName").html('');

        var uploadedFileExtension = fileData.name.split('.').pop().toLowerCase();

        if (uploadedFileExtension == "jpeg" || uploadedFileExtension == "jpg" || uploadedFileExtension == "png") {
            var uploadedFileSizeInMb = (((fileData.size) / 1024) / 1024).toFixed(2);
            if (uploadedFileSizeInMb > 1) {
                ShowErrorMessage(GlobalErrorList.WebPushSetting.MoreWelcomeIconImageSize);
                $("#ui_fileStep1WelcomeMessageIconUpload").val('');
                HidePageLoading();
                return false;
            }
        } else {
            ShowErrorMessage(GlobalErrorList.WebPushSetting.NoWelcomeIconValidImage);
            $("#ui_fileStep1WelcomeMessageIconUpload").val('');
            HidePageLoading();
            return false;
        }

        var fromdata = typeof window.FormData == "undefined" ? [] : new window.FormData();

        if (typeof window.FormData == "undefined") {
            fromdata.push(fileData.name, fileData);
        }
        else {
            fromdata.append(fileData.name, fileData);
        }

        $.ajax({
            url: "/WebPush/Setting/UploadSettingIcons?accountId=" + Plumb5AccountId,
            type: 'POST',
            data: fromdata,
            contentType: false,
            processData: false,
            dataType: "json",
            success: function (response) {
                if (response != undefined && response != null && response.FileStatus) {
                    Step1WelcomeMessageIconName = response.SavedFileName;
                    $("#ui_spanStep1WelcomeMessageIconName").html(response.UploadedFileName);
                    $("#ui_pStep1WelcomeMessageIcon").removeClass("hideDiv");
                } else if (response != undefined && response != null && !response.FileStatus) {
                    ShowErrorMessage(response.Message);
                    $("#ui_fileStep1WelcomeMessageIconUpload").val('');
                }
                else {
                    ShowErrorMessage(GlobalErrorList.WebPushSetting.ErrorInFileUpload);
                    $("#ui_fileStep1WelcomeMessageIconUpload").val('');
                }
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },
    ValidateStep1Setting: function () {
        if ($("input[name='Step1RuleShowPage']:checked").val() == "specificpage" && $("#ui_txtStep1RuleShowSpecificPageUrls").val().length == 0) {
            ShowErrorMessage(GlobalErrorList.WebPushSetting.NoShowPageUrl);
            return false;
        }

        if ($("#ui_txtStep1RuleShowOptInDelay").val().length == 0) {
            ShowErrorMessage(GlobalErrorList.WebPushSetting.NoShowOptInDelay);
            return false;
        }

        if (!$.isNumeric($("#ui_txtStep1RuleShowOptInDelay").val())) {
            ShowErrorMessage(GlobalErrorList.WebPushSetting.NoShowOptInDelayInteger);
            return false;
        }

        if ($("#ui_txtStep1RuleHideOptInDelay").val().length == 0) {
            ShowErrorMessage(GlobalErrorList.WebPushSetting.NoHideOptInDelay);
            return false;
        }

        if (!$.isNumeric($("#ui_txtStep1RuleHideOptInDelay").val())) {
            ShowErrorMessage(GlobalErrorList.WebPushSetting.NoHideOptInDelayInteger);
            return false;
        }

        if ($("#ui_chkBoxStep1RuleShowOptInPromptDesktop").prop("checked") == false && $("#ui_chkBoxStep1RuleShowOptInPromptMobile").prop("checked") == false) {
            ShowErrorMessage(GlobalErrorList.WebPushSetting.NoOptInDevice);
            return false;
        }

        var getUrls = $("#ui_txtStep1RuleShowSpecificPageUrls").val().toLowerCase().split(',');
        if (($("#ui_txtStep1RuleShowSpecificPageUrls").val().length > 0) && !getUrls.every(containChk)) {
            ShowErrorMessage(GlobalErrorList.WebPushSetting.ShowSpecificPageUrls);
            return false;
        }

        var getUrls = $("#ui_txtStep1RuleExcludePageUrls").val().toLowerCase().split(',');
        if (($("#ui_txtStep1RuleExcludePageUrls").val().length > 0) && !getUrls.every(containChk)) {
            ShowErrorMessage(GlobalErrorList.WebPushSetting.RuleExcludePageUrls);
            return false;
        }

        if ($("#ui_txtStep1WelcomeMessageTitle").val().length > 0 || $("#ui_txtStep1WelcomeMessageText").val().length > 0 || $("#ui_iconStep1WelcomeMessageIconClickUrl").val().length > 0) {

            if ($("#ui_txtStep1WelcomeMessageTitle").val().length == 0) {
                ShowErrorMessage(GlobalErrorList.WebPushSetting.NoWelcomeTitle);
                return false;
            }

            if ($("#ui_txtStep1WelcomeMessageText").val().length == 0) {
                ShowErrorMessage(GlobalErrorList.WebPushSetting.NoWelcomeText);
                return false;
            }

            if (Step1WelcomeMessageIconName.length == 0) {
                ShowErrorMessage(GlobalErrorList.WebPushSetting.NoWelcomeIconImage);
                return false;
            }

            if ($("#ui_iconStep1WelcomeMessageIconClickUrl").val().length == 0) {
                ShowErrorMessage(GlobalErrorList.WebPushSetting.NoWelcomeClickUrl);
                return false;
            }
            if ($("#ui_iconStep1WelcomeMessageIconClickUrl").val().toLowerCase().indexOf("http") == -1 && $("#ui_iconStep1WelcomeMessageIconClickUrl").val().toLowerCase().indexOf("https") == -1) {
                ShowErrorMessage(GlobalErrorList.WebPushSetting.WelcomeMessageIconClickUrl);
                return false;
            }
        }

        return true;
    },
    SaveStep1Setting: function () {
        var WebPushSubscriptionSetting = { Id: WebPushSubscriptionSettingId, WebPushStep: "STEP1", IsShowOnAllPages: null, ShowSpecificPageUrl: "", ShowOptInDelayTime: 0, HideOptInDelayTime: 0, IsOptInDeviceDesktop: null, IsOptInDeviceMobile: null, IsNotificationToLastDevice: null, ExcludePageUrl: "", WelcomeMessageTitle: "", WelcomeMessageText: "", WelcomeMessageIcon: "", WelcomeMessageRedirectUrl: "", HttpOrHttpsPush: "", Step2ConfigurationSubDomain: "", NotificationPromptType: "", NotificationPosition: "", NotificationMessage: "", NotificationAllowButtonText: "", NotificationDoNotAllowButtonText: "", NotificationBodyBackgoundColor: "", NotificationBodyTextColor: "", NotificationButtonBackgoundColor: "", NotificationButtonTextColor: "", NativeBrowserMessage: "", NativeBrowserIcon: "", NativeBrowserBackgoundColor: "", NativeBrowserTextColor: "" };

        if ($("input[name='Step1RuleShowPage']:checked").val() == "allpages") {
            WebPushSubscriptionSetting.IsShowOnAllPages = true;
        } else {
            WebPushSubscriptionSetting.IsShowOnAllPages = false;
            WebPushSubscriptionSetting.ShowSpecificPageUrl = $("#ui_txtStep1RuleShowSpecificPageUrls").val();
        }

        WebPushSubscriptionSetting.ShowOptInDelayTime = parseInt($("#ui_txtStep1RuleShowOptInDelay").val());
        WebPushSubscriptionSetting.HideOptInDelayTime = parseInt($("#ui_txtStep1RuleHideOptInDelay").val());

        if ($("#ui_chkBoxStep1RuleShowOptInPromptDesktop").prop("checked") == true) {
            WebPushSubscriptionSetting.IsOptInDeviceDesktop = true;
        } else {
            WebPushSubscriptionSetting.IsOptInDeviceDesktop = false;
        }

        if ($("#ui_chkBoxStep1RuleShowOptInPromptMobile").prop("checked") == true) {
            WebPushSubscriptionSetting.IsOptInDeviceMobile = true;
        } else {
            WebPushSubscriptionSetting.IsOptInDeviceMobile = false;
        }

        if ($("#ui_chkBoxStep1RuleSendNotificationToLastDevice").prop("checked") == true) {
            WebPushSubscriptionSetting.IsNotificationToLastDevice = true;
        } else {
            WebPushSubscriptionSetting.IsNotificationToLastDevice = false;
        }

        WebPushSubscriptionSetting.ExcludePageUrl = $("#ui_txtStep1RuleExcludePageUrls").val();
        WebPushSubscriptionSetting.GroupId = $("#ui_selectGroupsList1").val();

        if ($("#ui_txtStep1WelcomeMessageTitle").val().length > 0 || $("#ui_txtStep1WelcomeMessageText").val().length > 0 || $("#ui_iconStep1WelcomeMessageIconClickUrl").val().length > 0) {
            WebPushSubscriptionSetting.WelcomeMessageTitle = $("#ui_txtStep1WelcomeMessageTitle").val();
            WebPushSubscriptionSetting.WelcomeMessageText = $("#ui_txtStep1WelcomeMessageText").val();
            WebPushSubscriptionSetting.WelcomeMessageRedirectUrl = $("#ui_iconStep1WelcomeMessageIconClickUrl").val();
            WebPushSubscriptionSetting.WelcomeMessageIcon = Step1WelcomeMessageIconName;
        }

        //assign group by subscription url
        var AssignGroupLists = [];
        var getAssignGroupJson = new Array();
        for (let m = 0; m < assignGroupArray.length; m++) {

            if (assignGroupArray.length != 1) {
                if ($(`#ui_AssignGroupUrl_${assignGroupArray[m]}`).val().toLowerCase().indexOf("http://") == -1 && $(`#ui_AssignGroupUrl_${assignGroupArray[m]}`).val().toLowerCase().indexOf("https://") == -1) {
                    ShowErrorMessage(GlobalErrorList.WebPushSetting.WelcomeMessageIconClickUrl);
                    HidePageLoading();
                    return false;
                }
            }


            if (assignGroupArray.length == 1) {
                if ($(`#ui_AssignGroupUrl_${assignGroupArray[m]}`).val().length > 0 && $(`#ui_ddl_UrlAssignGroup_${assignGroupArray[m]}`).val() > 0) {
                    getAssignGroupJson = { URL: $(`#ui_AssignGroupUrl_${assignGroupArray[m]}`).val(), AssignGroup: $(`#ui_ddl_UrlAssignGroup_${assignGroupArray[m]}`).val() };
                    AssignGroupLists.push(getAssignGroupJson);
                }
                else if ($(`#ui_AssignGroupUrl_${assignGroupArray[m]}`).val().length > 0 && $(`#ui_ddl_UrlAssignGroup_${assignGroupArray[m]}`).val() != '0') {
                    ShowErrorMessage(GlobalErrorList.WebPushSetting.AssignGroupByURL);
                    HidePageLoading();
                    return false;
                }
                else if ($(`#ui_AssignGroupUrl_${assignGroupArray[m]}`).val().length == 0 && $(`#ui_ddl_UrlAssignGroup_${assignGroupArray[m]}`).val() != '0') {
                    ShowErrorMessage(GlobalErrorList.WebPushSetting.AssignGroupByURL);
                    HidePageLoading();
                    return false;
                }
            }
            else if (assignGroupArray.length != 1) {
                if ($(`#ui_AssignGroupUrl_${assignGroupArray[m]}`).val().length > 0 && $(`#ui_ddl_UrlAssignGroup_${assignGroupArray[m]}`).val() != '0') {
                    getAssignGroupJson = { URL: $(`#ui_AssignGroupUrl_${assignGroupArray[m]}`).val(), AssignGroup: $(`#ui_ddl_UrlAssignGroup_${assignGroupArray[m]}`).val() };
                    AssignGroupLists.push(getAssignGroupJson);
                }
                else {
                    ShowErrorMessage(GlobalErrorList.WebPushSetting.AssignGroupByURL);
                    HidePageLoading();
                    return false;
                }
            }

        }

        WebPushSubscriptionSetting.urlassigngroup = JSON.stringify(AssignGroupLists) == '[]' ? '' : JSON.stringify(AssignGroupLists)
        WebPushSettingUtil.CallWebPushSettingSave(WebPushSubscriptionSetting);
    },
    Step2NativeBrowserIconUpload: function (fileData) {
        $("#ui_pStep2NativeOptInIcon").addClass("hideDiv");
        $("#ui_spanStep2NativeOptInIconName").html('');
        Step2NativeBrowserIconName = "";

        var uploadedFileExtension = fileData.name.split('.').pop().toLowerCase();

        if (uploadedFileExtension == "jpeg" || uploadedFileExtension == "jpg" || uploadedFileExtension == "png") {
            var uploadedFileSizeInMb = (((fileData.size) / 1024) / 1024).toFixed(2);
            if (uploadedFileSizeInMb > 1) {
                ShowErrorMessage(GlobalErrorList.WebPushSetting.MoreNativeIconImageSize);
                $("#ui_fileStep2NativeOptInIconUpload").val('');
                HidePageLoading();
                return false;
            }
        } else {
            ShowErrorMessage(GlobalErrorList.WebPushSetting.NoNativeIconValidImage);
            $("#ui_fileStep2NativeOptInIconUpload").val('');
            HidePageLoading();
            return false;
        }

        var fromdata = typeof window.FormData == "undefined" ? [] : new window.FormData();

        if (typeof window.FormData == "undefined") {
            fromdata.push(fileData.name, fileData);
        }
        else {
            fromdata.append(fileData.name, fileData);
        }

        $.ajax({
            url: "/WebPush/Setting/UploadSettingIcons?accountId=" + Plumb5AccountId,
            type: 'POST',
            data: fromdata,
            contentType: false,
            processData: false,
            dataType: "json",
            success: function (response) {
                if (response != undefined && response != null && response.FileStatus) {
                    Step2NativeBrowserIconName = response.SavedFileName;
                    $("#ui_spanStep2NativeOptInIconName").html(response.UploadedFileName);
                    $("#ui_pStep2NativeOptInIcon").removeClass("hideDiv");

                    $("#").attr("src", Step2NativeBrowserIconName);
                } else if (response != undefined && response != null && !response.FileStatus) {
                    ShowErrorMessage(response.Message);
                    $("#ui_fileStep2NativeOptInIconUpload").val('');
                }
                else {
                    ShowErrorMessage(GlobalErrorList.WebPushSetting.ErrorInFileUpload);
                    $("#ui_fileStep2NativeOptInIconUpload").val('');
                }
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },
    Step2WelcomeMessageIconUpload: function (fileData) {
        $("#ui_pStep2WelcomeMessageIcon").addClass("hideDiv");
        $("#ui_spanStep2WelcomeMessageIconName").html('');
        Step2WelcomeMessageIconName = "";

        var uploadedFileExtension = fileData.name.split('.').pop().toLowerCase();

        if (uploadedFileExtension == "jpeg" || uploadedFileExtension == "jpg" || uploadedFileExtension == "png") {
            var uploadedFileSizeInMb = (((fileData.size) / 1024) / 1024).toFixed(2);
            if (uploadedFileSizeInMb > 1) {
                ShowErrorMessage(GlobalErrorList.WebPushSetting.MoreWelcomeIconImageSize);
                $("#ui_fileStep2WelcomeMessageIconUpload").val('');
                HidePageLoading();
                return false;
            }
        } else {
            ShowErrorMessage(GlobalErrorList.WebPushSetting.NoWelcomeIconValidImage);
            $("#ui_fileStep2WelcomeMessageIconUpload").val('');
            HidePageLoading();
            return false;
        }

        var fromdata = typeof window.FormData == "undefined" ? [] : new window.FormData();

        if (typeof window.FormData == "undefined") {
            fromdata.push(fileData.name, fileData);
        }
        else {
            fromdata.append(fileData.name, fileData);
        }

        $.ajax({
            url: "/WebPush/Setting/UploadSettingIcons?accountId=" + Plumb5AccountId,
            type: 'POST',
            data: fromdata,
            contentType: false,
            processData: false,
            dataType: "json",
            success: function (response) {
                if (response != undefined && response != null && response.FileStatus) {
                    Step2WelcomeMessageIconName = response.SavedFileName;
                    $("#ui_spanStep2WelcomeMessageIconName").html(response.UploadedFileName);
                    $("#ui_pStep2WelcomeMessageIcon").removeClass("hideDiv");
                } else if (response != undefined && response != null && !response.FileStatus) {
                    ShowErrorMessage(response.Message);
                    $("#ui_fileStep2WelcomeMessageIconUpload").val('');
                }
                else {
                    ShowErrorMessage(GlobalErrorList.WebPushSetting.ErrorInFileUpload);
                    $("#ui_fileStep2WelcomeMessageIconUpload").val('');
                }
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },
    ValidateStep2Setting: function () {
        if ($("#ui_txtStep2SubDomain").val().length == 0) {
            ShowErrorMessage(GlobalErrorList.WebPushSetting.NoStep2SubDomain);
            return false;
        }

        if ($("#ui_ddlStep2NotificationOptInPromptType").val() == "0") {
            ShowErrorMessage(GlobalErrorList.WebPushSetting.NoNotificationPromptType);
            return false;
        }

        if ($("#ui_ddlStep2NotificationOptInPosition").val() == "0") {
            ShowErrorMessage(GlobalErrorList.WebPushSetting.NoNotificationPosition);
            return false;
        }

        var NotificationType = $("#ui_ddlStep2NotificationOptInPromptType").val();
        if ($("#ui_txtStep2NotificationOptInMessage").val().length == 0 && NotificationType == "BOX") {
            ShowErrorMessage(GlobalErrorList.WebPushSetting.NoNotificationMessage);
            return false;
        }

        if ($("#ui_txtStep2NotificationOptInAllowButtonText").val().length == 0 && NotificationType == "BOX") {
            ShowErrorMessage(GlobalErrorList.WebPushSetting.NoNotificationAllowText);
            return false;
        }

        if ($("#ui_txtStep2NotificationOptInNotAllowButtonText").val().length == 0 && NotificationType == "BOX") {
            ShowErrorMessage(GlobalErrorList.WebPushSetting.NoNotificationNotAllowText);
            return false;
        }

        if ($("#ui_txtStep2NotificationOptInBodyBackgoundColor").val().length == 0) {
            ShowErrorMessage(GlobalErrorList.WebPushSetting.NoNotificationBodyBackgoundColor);
            return false;
        }

        if ($("#ui_txtStep2NotificationOptInBodyTextColor").val().length == 0) {
            ShowErrorMessage(GlobalErrorList.WebPushSetting.NotificationBodyTextColor);
            return false;
        }

        if ($("#ui_txtStep2NotificationOptInButtonBackgroundColor").val().length == 0) {
            ShowErrorMessage(GlobalErrorList.WebPushSetting.NotificationButtonBackgoundColor);
            return false;
        }

        if ($("#ui_txtStep2NotificationOptInButtonTextColor").val().length == 0) {
            ShowErrorMessage(GlobalErrorList.WebPushSetting.NotificationButtonTextColor);
            return false;
        }

        var getUrls = $("#ui_txtStep2RuleShowSpecificPageUrls").val().toLowerCase().split(',');
        if (($("#ui_txtStep2RuleShowSpecificPageUrls").val().length > 0) && !getUrls.every(containChk)) {
            ShowErrorMessage(GlobalErrorList.WebPushSetting.ShowSpecificPageUrls);
            return false;
        }

        var getUrls = $("#ui_txtStep2RuleExcludePageUrls").val().toLowerCase().split(',');
        if (($("#ui_txtStep2RuleExcludePageUrls").val().length > 0) && !getUrls.every(containChk)) {
            ShowErrorMessage(GlobalErrorList.WebPushSetting.RuleExcludePageUrls);
            return false;
        }

        if ($("#ui_divStep2Http").hasClass("active")) {
            if ($("#ui_txtStep2NativeOptInMessage").val().length == 0) {
                ShowErrorMessage(GlobalErrorList.WebPushSetting.NoNativeOptInMessage);
                return false;
            }

            if (Step2NativeBrowserIconName.length == 0) {
                ShowErrorMessage(GlobalErrorList.WebPushSetting.NoNativeOptInIconImage);
                return false;
            }

            if ($("#ui_txtStep2NativeOptInBackgoundColor").val().length == 0) {
                ShowErrorMessage(GlobalErrorList.WebPushSetting.NoNativeOptInBackgoundColor);
                return false;
            }

            if ($("#ui_txtStep2NativeOptInTextColor").val().length == 0) {
                ShowErrorMessage(GlobalErrorList.WebPushSetting.NoNativeOptInTextColor);
                return false;
            }
        }

        if ($("input[name='Step2RuleShowPage']:checked").val() == "specificpage" && $("#ui_txtStep2RuleShowSpecificPageUrls").val().length == 0) {
            ShowErrorMessage(GlobalErrorList.WebPushSetting.NoShowPageUrl);
            return false;
        }

        if ($("#ui_txtStep2RuleShowOptInDelay").val().length == 0) {
            ShowErrorMessage(GlobalErrorList.WebPushSetting.NoShowOptInDelay);
            return false;
        }

        if (!$.isNumeric($("#ui_txtStep2RuleShowOptInDelay").val())) {
            ShowErrorMessage(GlobalErrorList.WebPushSetting.NoShowOptInDelayInteger);
            return false;
        }

        if ($("#ui_txtStep2RuleHideOptInDelay").val().length == 0) {
            ShowErrorMessage(GlobalErrorList.WebPushSetting.NoHideOptInDelay);
            return false;
        }

        if (!$.isNumeric($("#ui_txtStep2RuleHideOptInDelay").val())) {
            ShowErrorMessage(GlobalErrorList.WebPushSetting.NoHideOptInDelayInteger);
            return false;
        }

        if ($("#ui_chkBoxStep2RuleShowOptInPromptDesktop").prop("checked") == false && $("#ui_chkBoxStep2RuleShowOptInPromptMobile").prop("checked") == false) {
            ShowErrorMessage(GlobalErrorList.WebPushSetting.NoOptInDevice);
            return false;
        }

        if ($("#ui_txtStep2WelcomeMessageTitle").val().length > 0 || $("#ui_txtStep2WelcomeMessageText").val().length > 0 || $("#ui_iconStep2WelcomeMessageIconClickUrl").val().length > 0) {

            if ($("#ui_txtStep2WelcomeMessageTitle").val().length == 0) {
                ShowErrorMessage(GlobalErrorList.WebPushSetting.NoWelcomeTitle);
                return false;
            }

            if ($("#ui_txtStep2WelcomeMessageText").val().length == 0) {
                ShowErrorMessage(GlobalErrorList.WebPushSetting.NoWelcomeText);
                return false;
            }

            if (Step2WelcomeMessageIconName.length == 0) {
                ShowErrorMessage(GlobalErrorList.WebPushSetting.NoWelcomeIconImage);
                return false;
            }

            if ($("#ui_iconStep2WelcomeMessageIconClickUrl").val().length == 0) {
                ShowErrorMessage(GlobalErrorList.WebPushSetting.NoWelcomeClickUrl);
                return false;
            }

            if ($("#ui_iconStep2WelcomeMessageIconClickUrl").val().toLowerCase().indexOf("http") == -1 && $("#ui_iconStep2WelcomeMessageIconClickUrl").val().toLowerCase().indexOf("https") == -1) {
                ShowErrorMessage(GlobalErrorList.WebPushSetting.WelcomeMessageIconClickUrl);
                return false;
            }
        }

        return true;
    },
    SaveStep2Setting: function () {
        var WebPushSubscriptionSetting = { Id: WebPushSubscriptionSettingId, WebPushStep: "STEP2", IsShowOnAllPages: null, ShowSpecificPageUrl: "", ShowOptInDelayTime: 0, HideOptInDelayTime: 0, IsOptInDeviceDesktop: null, IsOptInDeviceMobile: null, IsNotificationToLastDevice: null, ExcludePageUrl: "", WelcomeMessageTitle: "", WelcomeMessageText: "", WelcomeMessageIcon: "", WelcomeMessageRedirectUrl: "", HttpOrHttpsPush: GetHttpOrHttps, Step2ConfigurationSubDomain: "", NotificationPromptType: "", NotificationPosition: "", NotificationMessage: "", NotificationAllowButtonText: "", NotificationDoNotAllowButtonText: "", NotificationBodyBackgoundColor: "", NotificationBodyTextColor: "", NotificationButtonBackgoundColor: "", NotificationButtonTextColor: "", NativeBrowserMessage: "", NativeBrowserIcon: "", NativeBrowserBackgoundColor: "", NativeBrowserTextColor: "" };

        if ($("#ui_divStep2Http").hasClass("active")) {
            WebPushSubscriptionSetting.Step2ConfigurationSubDomain = $("#ui_txtStep2SubDomain").val();

            WebPushSubscriptionSetting.NativeBrowserMessage = $("#ui_txtStep2NativeOptInMessage").val();

            WebPushSubscriptionSetting.NativeBrowserBackgoundColor = $("#ui_txtStep2NativeOptInBackgoundColor").val();

            WebPushSubscriptionSetting.NativeBrowserTextColor = $("#ui_txtStep2NativeOptInTextColor").val();

            WebPushSubscriptionSetting.NativeBrowserIcon = Step2NativeBrowserIconName;
        }

        WebPushSubscriptionSetting.NotificationPromptType = $("#ui_ddlStep2NotificationOptInPromptType").val();

        WebPushSubscriptionSetting.NotificationPosition = $("#ui_ddlStep2NotificationOptInPosition").val();

        WebPushSubscriptionSetting.NotificationMessage = $("#ui_txtStep2NotificationOptInMessage").val();

        WebPushSubscriptionSetting.NotificationAllowButtonText = $("#ui_txtStep2NotificationOptInAllowButtonText").val();

        WebPushSubscriptionSetting.NotificationDoNotAllowButtonText = $("#ui_txtStep2NotificationOptInNotAllowButtonText").val();

        WebPushSubscriptionSetting.NotificationBodyBackgoundColor = $("#ui_txtStep2NotificationOptInBodyBackgoundColor").val();

        WebPushSubscriptionSetting.NotificationBodyTextColor = $("#ui_txtStep2NotificationOptInBodyTextColor").val();

        WebPushSubscriptionSetting.NotificationButtonBackgoundColor = $("#ui_txtStep2NotificationOptInButtonBackgroundColor").val();

        WebPushSubscriptionSetting.NotificationButtonTextColor = $("#ui_txtStep2NotificationOptInButtonTextColor").val();

        if ($("input[name='Step2RuleShowPage']:checked").val() == "allpages") {
            WebPushSubscriptionSetting.IsShowOnAllPages = true;
        } else {
            WebPushSubscriptionSetting.IsShowOnAllPages = false;
            WebPushSubscriptionSetting.ShowSpecificPageUrl = $("#ui_txtStep2RuleShowSpecificPageUrls").val();
        }

        WebPushSubscriptionSetting.ShowOptInDelayTime = parseInt($("#ui_txtStep2RuleShowOptInDelay").val());
        WebPushSubscriptionSetting.HideOptInDelayTime = parseInt($("#ui_txtStep2RuleHideOptInDelay").val());

        if ($("#ui_chkBoxStep2RuleShowOptInPromptDesktop").prop("checked") == true) {
            WebPushSubscriptionSetting.IsOptInDeviceDesktop = true;
        } else {
            WebPushSubscriptionSetting.IsOptInDeviceDesktop = false;
        }

        if ($("#ui_chkBoxStep2RuleShowOptInPromptMobile").prop("checked") == true) {
            WebPushSubscriptionSetting.IsOptInDeviceMobile = true;
        } else {
            WebPushSubscriptionSetting.IsOptInDeviceMobile = false;
        }

        if ($("#ui_chkBoxStep2RuleSendNotificationToLastDevice").prop("checked") == true) {
            WebPushSubscriptionSetting.IsNotificationToLastDevice = true;
        } else {
            WebPushSubscriptionSetting.IsNotificationToLastDevice = false;
        }

        WebPushSubscriptionSetting.ExcludePageUrl = $("#ui_txtStep2RuleExcludePageUrls").val();

        WebPushSubscriptionSetting.GroupId = $("#ui_selectGroupsList2").val();

        if ($("#ui_txtStep2WelcomeMessageTitle").val().length > 0 || $("#ui_txtStep2WelcomeMessageText").val().length > 0 || $("#ui_iconStep2WelcomeMessageIconClickUrl").val().length > 0) {
            WebPushSubscriptionSetting.WelcomeMessageTitle = $("#ui_txtStep2WelcomeMessageTitle").val();
            WebPushSubscriptionSetting.WelcomeMessageText = $("#ui_txtStep2WelcomeMessageText").val();
            WebPushSubscriptionSetting.WelcomeMessageRedirectUrl = $("#ui_iconStep2WelcomeMessageIconClickUrl").val();
            WebPushSubscriptionSetting.WelcomeMessageIcon = Step2WelcomeMessageIconName;
        }

        //assign group by subscription url
        var AssignGroupLists = [];
        var getAssignGroupJson = new Array();
        for (let m = 0; m < assignGroupArray.length; m++) {

            if (assignGroupArray.length == 1) {
                if ($(`#ui_AssignGroupUrl_${assignGroupArray[m]}`).val().length > 0 && $(`#ui_ddl_UrlAssignGroup_${assignGroupArray[m]}`).val() > 0) {
                    getAssignGroupJson = { URL: $(`#ui_AssignGroupUrl_${assignGroupArray[m]}`).val(), AssignGroup: $(`#ui_ddl_UrlAssignGroup_${assignGroupArray[m]}`).val() };
                    AssignGroupLists.push(getAssignGroupJson);
                }
                else if ($(`#ui_AssignGroupUrl_${assignGroupArray[m]}`).val().length > 0 && $(`#ui_ddl_UrlAssignGroup_${assignGroupArray[m]}`).val() != '0') {
                    ShowErrorMessage(GlobalErrorList.WebPushSetting.AssignGroupByURL);
                    HidePageLoading();
                    return false;
                }
                else if ($(`#ui_AssignGroupUrl_${assignGroupArray[m]}`).val().length == 0 && $(`#ui_ddl_UrlAssignGroup_${assignGroupArray[m]}`).val() != '0') {
                    ShowErrorMessage(GlobalErrorList.WebPushSetting.AssignGroupByURL);
                    HidePageLoading();
                    return false;
                }
            }
            else if (assignGroupArray.length != 1) {
                if ($(`#ui_AssignGroupUrl_${assignGroupArray[m]}`).val().length > 0 && $(`#ui_ddl_UrlAssignGroup_${assignGroupArray[m]}`).val() != '0') {
                    getAssignGroupJson = { URL: $(`#ui_AssignGroupUrl_${assignGroupArray[m]}`).val(), AssignGroup: $(`#ui_ddl_UrlAssignGroup_${assignGroupArray[m]}`).val() };
                    AssignGroupLists.push(getAssignGroupJson);
                }
                else {
                    ShowErrorMessage(GlobalErrorList.WebPushSetting.AssignGroupByURL);
                    HidePageLoading();
                    return false;
                }
            }

        }
        WebPushSubscriptionSetting.urlassigngroup = JSON.stringify(AssignGroupLists) == '[]' ? '' : JSON.stringify(AssignGroupLists)
        WebPushSettingUtil.CallWebPushSettingSave(WebPushSubscriptionSetting);
    },
    CallWebPushSettingSave: function (WebPushSubscriptionSetting) {
        $.ajax({
            url: "/WebPush/Setting/SaveWebPushSetting",
            type: 'POST',
            data: JSON.stringify({
                'accountId': Plumb5AccountId, 'subscriptionSetting': WebPushSubscriptionSetting, 'IsDomainPresent': IsDomainPresent
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != undefined && response != null && response.Status) {
                    ShowSuccessMessage(GlobalErrorList.WebPushSetting.SavedSuccess);
                    WebPushSettingUtil.GetSettingDetails();
                } else if (response != undefined && response != null && !response.Status) {
                    ShowErrorMessage(response.Message);
                }
                else {
                    ShowErrorMessage(GlobalErrorList.WebPushSetting.SaveError);
                }
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },
    BindNotificationPreview: function () {
        ShowPageLoading();
        $("#ui_divNotificationPreviewBox,#ui_divNotificationPreviewBell").addClass("hideDiv");
        $("#ui_divNotificationPreviewBox,#ui_divNotificationPreviewBell").removeClass('top-left bottom-left bottom-right top-middle top-right');

        var NotificationType = $("#ui_ddlStep2NotificationOptInPromptType").val();
        if (NotificationType == "BOX") {
            $("#ui_divNotificationPreviewBox").removeClass("hideDiv");
            $(".bwsnotimessgfield, .bwsnotiallowbtnfild, .bwsnotidntallowbtnfild"
            ).removeClass("hideDiv");
        } else {
            $("#ui_divNotificationPreviewBell").removeClass("hideDiv");
            $(".bwsnotimessgfield, .bwsnotiallowbtnfild, .bwsnotidntallowbtnfild"
            ).addClass("hideDiv");
        }

        var NotificationPosition = $("#ui_ddlStep2NotificationOptInPosition").val();

        if (NotificationPosition == "BOTTOM-LEFT") {
            $("#ui_divNotificationPreviewBox,#ui_divNotificationPreviewBell").addClass('bottom-left');
        } else if (NotificationPosition == "BOTTOM-RIGHT") {
            $("#ui_divNotificationPreviewBox,#ui_divNotificationPreviewBell").addClass('bottom-right');
        } else if (NotificationPosition == "TOP-LEFT") {
            $("#ui_divNotificationPreviewBox,#ui_divNotificationPreviewBell").addClass('top-left');
        } else if (NotificationPosition == "TOP-MIDDLE") {
            $("#ui_divNotificationPreviewBox,#ui_divNotificationPreviewBell").addClass('top-middle');
        } else if (NotificationPosition == "TOP-RIGHT") {
            $("#ui_divNotificationPreviewBox,#ui_divNotificationPreviewBell").addClass('top-right');
        }

        $("#ui_pNotificationPreviewBoxMessage").html($("#ui_txtStep2NotificationOptInMessage").val());

        $("#ui_btnNotificationPreviewBoxAllow").html($("#ui_txtStep2NotificationOptInAllowButtonText").val());
        $("#ui_btnNotificationPreviewBoxNotAllow").html($("#ui_txtStep2NotificationOptInNotAllowButtonText").val());

        $("#ui_divNotificationPreviewBox,#ui_divNotificationPreviewBell").css("background-color", "#" + $("#ui_txtStep2NotificationOptInBodyBackgoundColor").val());

        $("#ui_pNotificationPreviewBoxMessage").css("color", "#" + $("#ui_txtStep2NotificationOptInBodyTextColor").val());

        $(".bwsnotifbellitem .ion-ios-bell").css("color", "#" + $("#ui_txtStep2NotificationOptInBodyTextColor").val());

        $(".bwsnotiboxbtnw").css("background-color", "#" + $("#ui_txtStep2NotificationOptInButtonBackgroundColor").val());

        $("#ui_txtStep2NotificationOptInButtonBackgroundColor").css("background-color", "#" + $("#ui_txtStep2NotificationOptInButtonBackgroundColor").val());
        $("#ui_txtStep2NotificationOptInButtonTextColor").css("background-color", "#" + $("#ui_txtStep2NotificationOptInButtonTextColor").val());
        $("#ui_txtStep2NotificationOptInBodyTextColor").css("background-color", "#" + $("#ui_txtStep2NotificationOptInBodyTextColor").val());
        $("#ui_txtStep2NotificationOptInBodyBackgoundColor").css("background-color", "#" + $("#ui_txtStep2NotificationOptInBodyBackgoundColor").val());

        HidePageLoading();
    },
    BindNativeBrowserPreview: function () {
        ShowPageLoading();
        $("#ui_divNativePreviewDomain").html(WebPushSubDomain + "." + PushMainDomain + " wants to:");
        $("#ui_pNativePreviewMessage").html($("#ui_txtStep2NativeOptInMessage").val());
        $("#ui_divNativePreviewBody").css("background-color", "#" + $("#ui_txtStep2NativeOptInBackgoundColor").val());
        $(".brwsnotifbellicon .ion-ios-bell").css("color", "#" + $("#ui_txtStep2NativeOptInTextColor").val());
        $("#ui_pNativePreviewMessage").css("color", "#" + $("#ui_txtStep2NativeOptInTextColor").val());

        $("#ui_txtStep2NativeOptInBackgoundColor").css("background-color", "#" + $("#ui_txtStep2NativeOptInBackgoundColor").val());
        $("#ui_txtStep2NativeOptInTextColor").css("background-color", "#" + $("#ui_txtStep2NativeOptInTextColor").val());
        HidePageLoading();
    },
    GetImageNameFromUrl: function (fp) {
        if (fp != null)
            return fp.substring(fp.lastIndexOf("/") + 1, fp.length);
    },
    GetGroups: function () {
        $.ajax({
            url: "/ManageContact/Group/GetGroupsByStaticOrDynamic",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, GroupType: 1 }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != undefined && response != null && response.GroupDetails != null) {
                    $.each(response.GroupDetails, function () {
                        let groupContent = `<option value="${$(this)[0].Id}">${$(this)[0].Name}</option>`;
                        $("#ui_selectGroupsList1").append(groupContent);

                        $("#ui_selectGroupsList2").append(groupContent);

                        $("#ui_ddl_UrlAssignGroup_1").append(groupContent);

                        groupList.push(groupContent);
                    });
                }
            },
            error: ShowAjaxError
        });
    }

};

$("#ui_divWebPushSwitch").click(function () {
    $("#ui_divWebpushSteps").fadeIn().toggleClass("hideDiv");
    $("#ui_rdbtnWebpushStep1").prop("checked", true);
    if ($(".toggle-on").hasClass("active")) {
        $("#ui_divWebpushStep1, #ui_divWebpushStep2").addClass("hideDiv");
    } else {
        $("#ui_divWebpushStep2").addClass("hideDiv");
        $("#ui_divWebpushStep1").removeClass("hideDiv");
    }
});

$('input[name="WebpushSteps"]').change(function () {
    var StepValue = $(this).val();
    $("#ui_divWebpushStep1, #ui_divWebpushStep2").addClass("hideDiv");
    if (StepValue == "step1") {
        $("#ui_divWebpushStep1").removeClass("hideDiv");
    } else {
        $("#ui_divWebpushStep2").removeClass("hideDiv");

        $("#bwsnotisettheadingTwostep2").removeClass("hideDiv");
        $("#bwsnotisettheadingTwostep2https").addClass("hideDiv");

        $(".bwsnotihttpItem").removeClass("active");
        $("#ui_divStep2Http").addClass("active");
        $("#ui_divAccordian1").removeClass("hideDiv");
        $("#ui_divAccordian2").removeClass("mt-0");
        $("#ui_divAccordian3").removeClass("hideDiv");

        WebPushSettingUtil.BindNotificationPreview();
        WebPushSettingUtil.BindNativeBrowserPreview();
    }
});

$("#ui_iconDownLoadStep1DirectJs").click(function () {
    ShowPageLoading();
    WebPushSettingUtil.DownLoadStep1ConfigFile();
});

$("#ui_iconStep1CopyJsText").click(function () {
    ShowPageLoading();
    WebPushSettingUtil.CopyStep1ConfigFileText();
});

$("#ui_iconStep2CopyJsText").click(function () {
    ShowPageLoading();
    WebPushSettingUtil.CopyStep2ConfigFileText();
});

$('input[name="Step1RuleShowPage"]').change(function () {
    var PageValue = $(this).val();
    $("#ui_txtStep1RuleShowSpecificPageUrls").val('');
    if (PageValue == "allpages") {
        $("#ui_divStep1RuleShowSpecificPage").addClass("hideDiv");
    } else {
        $("#ui_divStep1RuleShowSpecificPage").removeClass("hideDiv");
    }
});

$('input[name="Step2RuleShowPage"]').change(function () {
    var PageValue = $(this).val();
    $("#ui_txtStep2RuleShowSpecificPageUrls").val('');
    if (PageValue == "allpages") {
        $("#ui_divStep2RuleShowSpecificPage").addClass("hideDiv");
    } else {
        $("#ui_divStep2RuleShowSpecificPage").removeClass("hideDiv");
    }
});

$("#ui_fileStep1WelcomeMessageIconUpload").change(function () {
    ShowPageLoading();
    var file = $(this)[0].files[0];
    WebPushSettingUtil.Step1WelcomeMessageIconUpload(file);
});

$("#ui_iconStep1WelcomeMessageIconClose").click(function () {
    ShowPageLoading();
    $("#ui_pStep1WelcomeMessageIcon").addClass("hideDiv");
    $("#ui_spanStep1WelcomeMessageIconName").html('');
    $("#ui_fileStep1WelcomeMessageIconUpload").val('');
    Step1WelcomeMessageIconName = "";
    HidePageLoading();
});

$("#ui_btnSaveSetting").click(function () {
    edit = 1;
    ShowPageLoading();
    if ($(".toggle-on").hasClass("active")) {
        if ($("input[name='WebpushSteps']:checked").val() == "step1") {
            if (!WebPushSettingUtil.ValidateStep1Setting()) {
                HidePageLoading();
            } else {
                WebPushSettingUtil.SaveStep1Setting();
            }
        } else {
            if (!WebPushSettingUtil.ValidateStep2Setting()) {
                HidePageLoading();
            } else {
                WebPushSettingUtil.SaveStep2Setting();
            }
        }
    } else {
        WebPushSettingUtil.DeleteSetting();
    }
});

$("#ui_divStep2Http").click(function () {
    GetHttpOrHttps = "HTTP";
    $(".bwsnotihttpItem").removeClass("active");
    $("#ui_divStep2Http").addClass("active");
    $("#bwsnotisettheadingTwostep2,#bwsnotisettconfigstep2").removeClass("hideDiv");
    $("#bwsnotisettheadingTwostep2https,#bwsnotisettconfigstep2https").addClass("hideDiv");
    $("#ui_divAccordian2").removeClass("mt-0");
    $("#ui_divAccordian3").removeClass("hideDiv");
});

$("#ui_divStep2Https").click(function () {
    GetHttpOrHttps = "HTTPS";
    $(".bwsnotihttpItem").removeClass("active");
    $("#ui_divStep2Https").addClass("active");
    $("#bwsnotisettheadingTwostep2,#bwsnotisettconfigstep2").addClass("hideDiv");
    $("#bwsnotisettheadingTwostep2https,#bwsnotisettconfigstep2https").removeClass("hideDiv");
    $("#ui_divAccordian2").removeClass("mt-0");
    $("#ui_divAccordian3").addClass("hideDiv");
});

$("#ui_fileStep2NativeOptInIconUpload").change(function () {
    ShowPageLoading();
    var file = $(this)[0].files[0];
    WebPushSettingUtil.Step2NativeBrowserIconUpload(file);
});

$("#ui_fileStep2WelcomeMessageIconUpload").change(function () {
    ShowPageLoading();
    var file = $(this)[0].files[0];
    WebPushSettingUtil.Step2WelcomeMessageIconUpload(file);
});

$("#ui_iconStep2NativeOptInIconClose").click(function () {
    ShowPageLoading();
    $("#ui_pStep2NativeOptInIcon").addClass("hideDiv");
    $("#ui_spanStep2NativeOptInIconName").html('');
    $("#ui_fileStep2NativeOptInIconUpload").val('');
    Step2NativeBrowserIconName = "";
    HidePageLoading();
});

$("#ui_iconStep2WelcomeMessageIconClose").click(function () {
    ShowPageLoading();
    $("#ui_pStep2WelcomeMessageIcon").addClass("hideDiv");
    $("#ui_spanStep2WelcomeMessageIconName").html('');
    $("#ui_fileStep2WelcomeMessageIconUpload").val('');
    Step2WelcomeMessageIconName = "";
    HidePageLoading();
});

$("#ui_ddlStep2NotificationOptInPromptType").change(function () {
    WebPushSettingUtil.BindNotificationPreview();
});

$("#ui_ddlStep2NotificationOptInPosition").change(function () {
    WebPushSettingUtil.BindNotificationPreview();
});

$("#ui_txtStep2NotificationOptInMessage").keyup(function () {
    WebPushSettingUtil.BindNotificationPreview();
});

$("#ui_txtStep2NotificationOptInAllowButtonText").keyup(function () {
    WebPushSettingUtil.BindNotificationPreview();
});

$("#ui_txtStep2NotificationOptInNotAllowButtonText").keyup(function () {
    WebPushSettingUtil.BindNotificationPreview();
});

$("#ui_txtStep2NotificationOptInBodyBackgoundColor").change(function () {
    WebPushSettingUtil.BindNotificationPreview();
});

$("#ui_txtStep2NotificationOptInBodyTextColor").change(function () {
    WebPushSettingUtil.BindNotificationPreview();
});

$("#ui_txtStep2NotificationOptInButtonBackgroundColor").change(function () {
    WebPushSettingUtil.BindNotificationPreview();
});

$("#ui_txtStep2NotificationOptInButtonTextColor").change(function () {
    WebPushSettingUtil.BindNotificationPreview();
});

$("#ui_txtStep2NativeOptInMessage").keyup(function () {
    WebPushSettingUtil.BindNativeBrowserPreview();
});

$("#ui_txtStep2NativeOptInBackgoundColor").change(function () {
    WebPushSettingUtil.BindNativeBrowserPreview();
});

$("#ui_txtStep2NativeOptInTextColor").change(function () {
    WebPushSettingUtil.BindNativeBrowserPreview();
});

$("#ui_txtStep2WelcomeMessageTitle").keyup(function () {
    $(".bnottitle").html($(this).val().length);
});
$("#ui_txtStep2WelcomeMessageText").keyup(function () {
    $(".bwnotmess").html($(this).val().length);
});

$('#ui_selectGroupsList1,#ui_selectGroupsList2').select2({
    minimumResultsForSearch: '',
    dropdownAutoWidth: false
});

var assignGroupcount = 1;
var assignGroupArray = [1];
$("#addAssignGroup").click(function () {

    assignGroupcount++;
    assignGroupArray.push(assignGroupcount);
    let addfieldsinput = `<div class="row position-relative">
    
                        <div class="col-sm-5">
                            <div class="form-group">
                                <label for="" class="frmlbltxt">Subscription URL</label>
                                <input type="text" name="" class="form-control form-control-sm frmlbltxtvalue" id="ui_AssignGroupUrl_${assignGroupcount}">
                            </div>
                        </div>
                        <div class="col-sm-5">
                            <div class="form-group">
                                <label class="frmlbltxt" for="">Group</label>

                                <select class="form-control form-control-sm notspecificbtn select2 ddlassignGroup" id="ui_ddl_UrlAssignGroup_${assignGroupcount}">
                                    <option value="0">Group Name</option>${groupList}
                                </select>
                            </div>
                        </div>
                    
                  <i class="ion ion-ios-close-outline font-18 mr-20 cursor-pointer removeAssignGroup" id=${assignGroupcount}></i>   
  
</div>`;
    $(".divUrlAssignGroup").append(addfieldsinput);

    $(".removeAssignGroup").click(function () {

        let id = parseInt($(this).attr("id"));
        assignGroupArray = assignGroupArray.filter(item => item !== id);
        $(this).parent().remove();
    });
    //$('#ui_AssignGroupfields_' + assignGroupcount + ', #ui_ddl_conAssignGroup_' + assignGroupcount).select2({
    //    minimumResultsForSearch: '',
    //    dropdownAutoWidth: false,
    //    containerCssClass: "border"
    //});

    //ApiImportResponsesSettingUtil.BindGrouplist(assignGroupcount);
    //HidePageLoading();
});