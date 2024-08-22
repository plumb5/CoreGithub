var ToMailAddress = "";
var SpamUtil = {
    BindActiveEmailIds: function () {
        $.ajax({
            url: "../CaptureForm/CommonDetailsForForms/GetActiveEmailIds",
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                $.each(response, function (i) {
                    var optlist = document.createElement('option');
                    optlist.value = response[i];
                    optlist.text = response[i];
                    document.getElementById("drpSendMailFromEmailId").options.add(optlist);
                });
            },
            error: ShowAjaxError
        });
    },
    BindTemplateName: function (MailTemplateId) {
        $("#lblTemplateName").html("");
        $("#uiSubject").val('');
        $.ajax({
            url: "/Mail/MailTemplate/GetTemplateDetails",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'TemplateId': MailTemplateId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                if (result != null && result.length > 0 && result[0].Name != null && result[0].Name != "") {
                    $("#lblTemplateName").html("(" + result[0].Name + ")");
                    if (result[0].SubjectLine != null && result[0].SubjectLine != 'null' && result[0].SubjectLine != "") {
                        $("#uiSubject").val(result[0].SubjectLine);
                    }
                }
            },
            error: ShowAjaxError
        });
    },
    ShowSignature: function (index) {
        if ($("#ui_signature_" + index).is(":visible"))
            $("#ui_signature_" + index).hide();
        else
            $("#ui_signature_" + index).show();
    },
    ShowBody: function (body) {
        if ($("#ui_bodymessage_" + body).is(":visible"))
            $("#ui_bodymessage_" + body).hide();
        else
            $("#ui_bodymessage_" + body).show();
    },
    ColorIdentifications: function (data) {
        if (data > 5)
            return { ColorCode: "#7dbd1e", ImageClassName: "moreinfo_green" };
        else if (data < 3)
            return { ColorCode: "#D9534F", ImageClassName: "moreinfo_red" };
        else
            return { ColorCode: "#FF9700", ImageClassName: "moreinfo_orange" };
    },
    GetTestedContent: function (TemplateId) {
        ShowPageLoading();

        $.ajax({
            url: "/Mail/MailTemplate/GetTemplateDetails",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'TemplateId': TemplateId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response !== null && response.length > 0 && response[0].ContentFromSpamAssassin != null && response[0].ContentFromSpamAssassin.length > 0) {
                    $("#btncheckSpamScore").text("Re-Verify");
                    SpamUtil.BindSpamResultContent(response[0].ContentFromSpamAssassin, response[0].Id);
                }
                else {
                    $("#btncheckSpamScore").text("Verify");
                }
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },
    BindSpamResultContent: function (response, MailTemplateId) {
        var result = JSON.parse(response);

        if (result === false) {
            ShowErrorMessage(GlobalErrorList.MailSpamCheck.MailNotReachedSpam);
        }
        else {
            $("#divSpamDetail").hide();

            $("#dv_spamTitle").html(result.title);

            if (result.displayedMark === "") {
                $("#ui_divScore").html("<img src='../images/smile.png' />");
                $("#ui_SpamScoreUpdate_" + MailTemplateId).html("0");
            }
            else {
                $("#ui_divScore").html(result.displayedMark);
                $("#ui_SpamScoreUpdate_" + MailTemplateId).html(result.displayedMark.split('/')[0]);

                var data = result.displayedMark.split('/')[0];
                var color = SpamUtil.ColorIdentifications(data);
                $("#ui_lblSpamScore_" + MailTemplateId).html(data).css("color", color.ColorCode);
                $("#ui_lblSpam_" + MailTemplateId).css("color", color.ColorCode);
                $("#ui_imgSpam_" + MailTemplateId).removeClass();
                $("#ui_imgSpam_" + MailTemplateId).removeAttr('class');
                $("#ui_imgSpam_" + MailTemplateId).addClass(color.ImageClassName);
            }

            // spamAssassin Score
            if (result.spamAssassin === null) {
                $("#ui_Spamassin").hide();
            }
            else {
                $("#ui_spamassingError").removeClass("score");
                $("#ui_spamassingError").removeClass("score-1");

                if (result.spamAssassin.mark >= 0)
                    $("#ui_spamassingError").html("<i class='fa fa-check fa-2x'></i>").addClass("score");
                else
                    $("#ui_spamassingError").html(result.spamAssassin.mark).addClass("score-1");

                var rulesDetails = result.spamAssassin.rules;

                $("tblspamrules > tbody").empty();
                var tdContent = "";
                $.each(rulesDetails, function () {
                    tdContent += "<tr><td class='td-wid-20'>" + $(this)[0].score + "</td><td class='td-wid-20'>" + $(this)[0].code + "</td><td class='td-wid-60'>" + $(this)[0].description + "</td></tr>";
                });
                $("#tblspamrules > tbody").append(tdContent);
            }

            // signature part
            if (result.signature === null) {
                $("#ui_Spamsignature").hide();
            }
            else {
                $("#ui_signaturescore").removeClass("score");
                $("#ui_signaturescore").removeClass("score-1");

                if (result.signature.mark >= 0)
                    $("#ui_signaturescore").html("<i class='fa fa-check fa-2x'></i>").addClass("score");
                else
                    $("#ui_signaturescore").html(result.signature.mark).addClass("score-1");

                var signature = result.signature.subtests;
                $("#ui_signature").empty();

                $.each(signature, function (i) {
                    $("#ui_signature").append("<div class='accrdsubItemwrp'><div class='accrdsub-one'><div onclick=\"SpamUtil.ShowSignature('" + i + "');\" class='subplus'><i class='icon ion-ios-circle-filled'></i></div> <div class='spamsubtitle'>" + $(this)[0].title + "</div></div><div id='ui_signature_" + i + "' class='accrdsub-cont'>" + $(this)[0].description + "" + $(this)[0].messages + "</div></div>");
                });
            }

            //links 
            if (result.links === null) {
                $("#ui_Spamlink").hide();
            }
            else {
                $("#ui_linksscore").removeClass("score");
                $("#ui_linksscore").removeClass("score-1");

                if (result.links.mark >= 0)
                    $("#ui_linksscore").html("<i class='fa fa-check fa-2x'></i>").addClass("score");
                else
                    $("#ui_linksscore").html(result.links.mark).addClass("score-1");

                $("#ui_link").empty();
                var link = result.links;
                $("#ui_link").append("<h6>" + link.description + "</h6>");
                $("#ui_link").append("<div class='accord-cont'><div style='width:50%;float:left;'>" + link.messages + "</div></div>");
            }

            //body templates binding

            if (result.body === null) {
                $("#ui_SpamMessage").hide();
            }
            else {
                var message = result.body.html;
                $("#ui_Message").append("<div class='accord-cont'><div id='ui_message'>" + message.title + "</div><div id='ui_messagedisplay' style='display:none'>" + message.content + " </div></div>");
            }

            //blacklists 
            if (result.blacklists === null) {
                $("#ui_SpamblackList").hide();
            }
            else {
                $("#ui_blacklistscore").removeClass("score");
                $("#ui_blacklistscore").removeClass("score-1");

                if (result.blacklists.mark >= 0)
                    $("#ui_blacklistscore").html("<i class='fa fa-check fa-2x'></i>").addClass("score");
                else
                    $("#ui_blacklistscore").html(result.blacklists.mark).addClass("score-1");

                var blacklists = result.blacklists.blacklists;

                $("#ui_blacklisttitle").empty();
                $("#ui_blacklisttitle").html(result.blacklists.title);

                $("tblBlackListsDetails > tbody").empty();

                var tdContent = "";
                $.each(blacklists, function () {
                    tdContent += "<tr><td class='td-wid-30'>" + $(this)[0].name + "</td><td class='td-wid-40'>" + $(this)[0].url + "</td><td class='td-wid-30'>" + $(this)[0].dns + "</td></tr>";
                });
                $("#tblBlackListsDetails > tbody").append(tdContent);
            }

            // messsage body cotains error
            if (result.body === null) {
                $("#ui_Spammessagebody").hide();
            }
            else {
                $("#ui_bodymessagescore").removeClass("score");
                $("#ui_bodymessagescore").removeClass("score-1");

                if (result.body.mark >= 0)
                    $("#ui_bodymessagescore").html("<i class='fa fa-check fa-2x'></i>").addClass("score");
                else
                    $("#ui_bodymessagescore").html(result.body.mark).addClass("score-1");

                var subtests = result.body.subtests;

                $("#ui_messagebody").empty();
                $("#ui_bodymessage").html(result.body.title);

                $.each(subtests, function (i) {
                    $("#ui_messagebody").append("<div class='accrdsubItemwrp'><div class='accrdsub-one'><div onclick=\"SpamUtil.ShowBody('" + i + "');\" class='subplus'><i class='icon ion-ios-circle-filled'></i></div><div class='spamsubtitle'>" + $(this)[0].title + "</div></div><div id='ui_bodymessage_" + i + "' class='accrdsub-cont'> " + $(this)[0].description + "" + $(this)[0].displayedMark + "</div></div>");
                });
            }

            $("#divSpamDetail").show("slow");
            HidePageLoading();
        }
    },
    ValidationSpamCheckDetails: function () {
        if ($('#drpSendMailFromEmailId > option').length === 1) {
            ShowErrorMessage(GlobalErrorList.MailSpamCheck.ConfigureSenderEmailId);
            return false;
        }

        if ($("#drpSendMailFromEmailId").get(0).selectedIndex === 0) {
            ShowErrorMessage(GlobalErrorList.MailSpamCheck.SenderEmailId);
            return false;
        }

        if ($.trim($("#uiFromName").val()).length === 0) {
            $("#uiFromName").focus();
            ShowErrorMessage(GlobalErrorList.MailSpamCheck.FromName);
            return false;
        }

        if ($.trim($("#uiSubject").val()).length === 0) {
            $("#uiSubject").focus();
            ShowErrorMessage(GlobalErrorList.MailSpamCheck.Subject);
            return false;
        }
        return true;
    },
    CheckCredits: function () {
        $.ajax({
            url: "/Mail/SpamCheck/CheckCredits",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != undefined && response != null) {
                    if (response.Status == false) {
                        ShowErrorMessage(GlobalErrorList.MailSpamCheck.NotEnoughCredits);
                        return false;
                    } else {
                        CheckSpamOnButtonClk();
                    }
                }

            },
            error: ShowAjaxError
        });
    }
};

$(document).ready(function () {
    SpamUtil.BindActiveEmailIds();
});

function CheckTemplateSpamScore(TemplateId) {
    if (TemplateId > 0) {
        SpamUtil.BindTemplateName(TemplateId);
        $("#drpSendMailFromEmailId").val(0);
        $("#uiFromName,#uiSubject").val("");
        $("#divSpamDetail").hide("fast");
        $("#dvSpamCheckPopUp").removeClass("hideDiv");
        $("#btncheckSpamScore").removeAttr("TemplateId");
        $("#btncheckSpamScore").attr("TemplateId", TemplateId);
        $("#ui_divSpamPopUp").removeClass("hideDiv");
        SpamUtil.GetTestedContent(TemplateId);
    }
}

$("#btncheckSpamScore").click(function () {

    SpamUtil.CheckCredits();
});

function CheckSpamOnButtonClk() {
    if ($("#btncheckSpamScore").attr("TemplateId") != undefined) {

        ShowPageLoading();

        var Id = $("#btncheckSpamScore").attr("TemplateId");
        Id = parseInt(Id);

        var IsPromotionalOrTransational = 0;

        if ($("input[name='MailType']:checked").val() === "0")
            IsPromotionalOrTransational = false;
        else
            IsPromotionalOrTransational = true;

        if (!SpamUtil.ValidationSpamCheckDetails()) {
            HidePageLoading();
            return false;
        }

        var FromEmail = $("#drpSendMailFromEmailId").val();
        var FromName = $("#uiFromName").val();
        var Subject = $("#uiSubject").val();
        $.ajax({
            url: "/Mail/SpamCheck/SpamAssign",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'Id': Id, 'FromName': FromName, 'FromEmail': FromEmail, 'Subject': Subject, 'IsPromotionalOrTransational': IsPromotionalOrTransational }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response !== null) {
                    ToMailAddress = response.ToMail;
                    if (response.Status && response.Message != null && response.Message.length > 0) {
                        BindSpamResultContent(response.Message, Id);
                    }
                    else {
                        if (response.Message === "Not enough credit is available to check spam score,Please contact support to increase spam credits.")
                            ShowErrorMessage(GlobalErrorList.MailSpamCheck.NotEnoughCredits);
                        else if (response.Message === "No active configuration found for spam score")
                            ShowErrorMessage(GlobalErrorList.MailSpamCheck.NoActiveConfiguration);
                        else if (response.Message === "No Mail Configuration found.")
                            ShowErrorMessage(GlobalErrorList.MailSpamCheck.NoMailConfiguration);
                        else if (response.Message === "Currently we don't have option for everlytic promotional to check spam assign, please try with transactional")
                            ShowErrorMessage(GlobalErrorList.MailSpamCheck.NoEverlyticPromotional);
                        else if (response.ToMail != undefined && response.ToMail != '')
                            GetMailTemplateSpamScore(Id, ToMailAddress);
                        else
                            ShowErrorMessage(GlobalErrorList.MailSpamCheck.GeneralError);
                    }
                }
                HidePageLoading();
            },
            error: function () {
                ShowAjaxError();
                GetMailTemplateSpamScore(Id, ToMailAddress);
            }
        });
    }
    else {
        ShowErrorMessage(GlobalErrorList.MailSpamCheck.GeneralError);
    }
}

var spamCheckingCounter = 0;
function GetMailTemplateSpamScore(Id, ToEmail) {
    $.ajax({
        url: "/Mail/SpamCheck/GetMailTemplateSpamScore",
        type: 'POST',
        data: JSON.stringify({ 'Id': Id, 'ToEmail': ToEmail }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            spamCheckingCounter++;
            if (response != null) {
                if (response.Status) {
                    BindSpamResultContent(response.Message, Id);
                }
                else {
                    if (spamCheckingCounter <= 10)
                        GetMailTemplateSpamScore(Id, ToEmail);
                    else {
                        ShowErrorMessage(GlobalErrorList.MailSpamCheck.MailNotReachedSpam);
                        HidePageLoading();
                    }
                }
            }
            else {
                ShowErrorMessage(GlobalErrorList.MailSpamCheck.MailNotReachedSpam);
                HidePageLoading();
            }

        },
        error: ShowAjaxError
    });
}

function BindSpamResultContent(response, MailTemplateId) {
    SpamUtil.BindSpamResultContent(response, MailTemplateId);
}

$("#ui_close").click(function () {
    $("#divSpamDetail").slideUp("slow");
});

$(".accord-one").click(function () {
    if ($(this).next().is("visible"))
        $(this).next().hide(1000);
    else
        $(this).next().show(1000);
    var mainEventObj = $(this).next();
    $(".accord-one").each(function () {
        if ($(this).next().attr("id") !== mainEventObj.attr("id")) {
            $(this).next().hide(1000);
        }
    });
});

$(".accrdsub-one").click(function () {
    $(".accrdsub-cont").slideUp();
    $(this).next().slideToggle();
});

$("#close-popup, .clsepopup").click(function () {
    $(this).parents("#ui_divSpamPopUp").addClass("hideDiv");
});

