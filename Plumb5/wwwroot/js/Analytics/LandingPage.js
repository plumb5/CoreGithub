var CNAME = "", LPNAME = "", IsLandingPageConfigEnabled = false;

$(document).ready(function () {
    ExportFunctionName = "LandingPageExport";
    landingPageUtil.GetLandingPageConfiguration();
});

function CallBackFunction() {
    ShowPageLoading();
    TotalRowCount = 0;
    CurrentRowCount = 0;

    landingPageUtil.MaxCount('');
}

function CallBackPaging() {
    CurrentRowCount = 0;
    landingPageUtil.GetReport('');
}

var landingPageUtil = {
    GetLandingPageConfiguration: function () {
        ShowPageLoading();
        $.ajax({
            url: "/Analytics/LandingPage/GetLandingPageConfiguration",
            type: 'Post',
            data: JSON.stringify({ 'AdsId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (getresponse) {
                if (getresponse.Status != false) {
                    var response = getresponse.data;
                    LPNAME = response.LandingPageName;
                    CNAME = response.CloudFrontUrl;
                    IsLandingPageConfigEnabled = response.IsLandingPageConfigEnabled;
                    $("#ui_span_LPName").html(response.LandingPageName);
                    $("#ui_span_CName").html(response.CloudFrontUrl);
                    if (!response.IsLandingPageConfigEnabled)
                        $(".btnwrp .errermess").removeClass("hideDiv");
                }
                $("#ui_span_DName").html(Plumb5AccountDomain);
                landingPageUtil.MaxCount('');
            },
            error: ShowAjaxError
        });
    },
    MaxCount: function (PageName) {
        $.ajax({
            url: "/Analytics/LandingPage/GetMaxCount",
            type: 'Post',
            data: JSON.stringify({ 'AdsId': Plumb5AccountId, 'PageName': PageName }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                TotalRowCount = 0;
                if (response != undefined && response != null) {
                    TotalRowCount = response;
                }

                if (TotalRowCount > 0) {
                    landingPageUtil.GetReport(PageName);
                }
                else {
                    SetNoRecordContent('ui_tblReportData', 4, 'ui_tbodyReportData');
                    HidePageLoading();
                }
            },
            error: ShowAjaxError
        });
    },
    GetReport: function (PageName) {
        FetchNext = GetNumberOfRecordsPerPage();
        $.ajax({
            url: "/Analytics/LandingPage/GetDetails",
            type: 'Post',
            data: JSON.stringify({ 'AdsId': Plumb5AccountId, 'FetchNext': FetchNext, 'OffSet': OffSet, 'PageName': PageName }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: landingPageUtil.BindReport,
            error: ShowAjaxError
        });
    },
    BindReport: function (response) {
        SetNoRecordContent('ui_tblReportData', 4, 'ui_tbodyReportData');
        if (response != undefined && response != null) {
            CurrentRowCount = response.length;
            PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);

            var reportTableTrs;
            $.each(response, function () {
                let TemplatePaths = "";
                if (this.IsTemplateSaved)
                    TemplatePaths = `https://${this.CloudFrontUrl}/${this.PageName}/Index.html`;
                else
                    TemplatePaths = `${OnlineUrl}Template/no-template-available.html`;

                reportTableTrs += "<tr>" +
                    "<td class='text-center temppreveye'><i class='icon ion-ios-eye-outline position-relative'><div class='previewtabwrp'><div class='thumbnail-container'>" +
                    `<a href='${TemplatePaths}' target='_blank'>` +
                    `<div class='thumbnail'><iframe src='${TemplatePaths}' frameborder='0' onload='this.style.opacity = 1'></iframe></div></a></div></div></i></td>` +
                    "<td class='text-left'><div class='groupnamewrap'><div class='nametitWrap'><span class='groupNameTxt'>" + this.PageName + "</span></div>" +
                    "<div class='tdcreatedraft'><div class='dropdown'><button type='button' class='verticnwrp' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'><i class='icon ion-android-more-vertical mr-0'></i></button>" +
                    `<div id='mailtempaction' class='dropdown-menu dropdown-menu-right' aria-labelledby='filterbycontacts'><a class='dropdown-item editlpage' href='javascript:void(0);' onclick='landingPageUtil.EditPopUpShow(${this.Id},"${this.PageName}", "${this.PageDescription}", ${this.IsBeeTemplate});'>Edit</a><a class ="dropdown-item ContributePermission" href="javascript:void(0);" onclick="landingPageUtil.DuplicateLandingPage(${this.Id},'${this.PageName}', '${this.PageDescription}', ${this.IsBeeTemplate});">Duplicate</a>` +
                    `<a class='dropdown-item' href="/Analytics/LandingPage/DownloadLandingPage?accountId=${Plumb5AccountId}&LandingPageId=${this.Id}">Download</a><a class='dropdown-item' href="javascript:void(0);" onclick="landingPageUtil.VerifyLandingPage(1, '${"https://" + this.LandingPageName + "/" + this.PageName + "/Index.html"}', '${this.CloudFrontUrl}', '${this.LandingPageName}');">Copy URL</a><a class='dropdown-item' href="javascript:void(0);" onclick="landingPageUtil.VerifyLandingPage(2, '${"https://" + this.LandingPageName + "/" + this.PageName + "/Index.html"}', '${this.CloudFrontUrl}', '${this.LandingPageName}');">Page Analysis</a><div class='dropdown-divider'></div><a class='dropdown-item' onclick='landingPageUtil.DeleteModalShow(${this.Id});' href='javascript:void(0);'>Delete</a></div></div></div></div></td>` +
                    "<td class='text-left'><div class='groupnamewrap'><div class='nametitWrap'><span>" + this.PageDescription + "</span></div></div></td>" +
                    "<td>" + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(this.UpdatedDate)) + "</td>" +
                    "</tr>";
            });
            $("#ui_tblReportData").removeClass('no-data-records');
            $("#ui_tbodyReportData").html(reportTableTrs);
            ShowExportDiv(true);
        } else {
            ShowExportDiv(false);
            ShowPagingDiv(false);
        }
        HidePageLoading();
    },
    Validate: function () {

        if ($("#editlpagename").val().length == 0) {
            ShowErrorMessage(GlobalErrorList.LandingPage.PageName_error);
            return false;
        }

        if ($("#editlpagename").val().length > 0 && ($("#editlpagename").val().includes("@") || $("#editlpagename").val().includes(".") || $("#editlpagename").val().includes("#") || $("#editlpagename").val().includes("$") || $("#editlpagename").val().includes("%") || $("#editlpagename").val().includes("*") || $("#editlpagename").val().includes("/") || $("#editlpagename").val().includes("\\") || $("#editlpagename").val().includes("+") || $("#editlpagename").val().includes("-") || $("#editlpagename").val().includes("&") || $("#editlpagename").val().includes(" "))) {
            ShowErrorMessage(GlobalErrorList.LandingPage.PageName_Syntaxerror);
            return false;
        }

        if ($("#editlpagedescrpt").val().length == 0) {
            ShowErrorMessage(GlobalErrorList.LandingPage.PageDescription_error);
            return false;
        }

        return true;
    },
    SaveOrUpdateLandingPage: function (LandingPageDetails) {
        ShowPageLoading();
        $.ajax({
            url: "/Analytics/LandingPage/SaveOrUpdateLandingPage",
            type: 'Post',
            data: JSON.stringify({ 'AdsId': Plumb5AccountId, 'landingPage': LandingPageDetails }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                let id = 0, pagename = LandingPageDetails.PageName;
                if (LandingPageDetails.Id > 0) {
                    id = parseInt(LandingPageDetails.Id);
                    if (response) {
                        ShowSuccessMessage(GlobalErrorList.LandingPage.Update_success);

                        const responseTimeout = setTimeout(function () { ShowPageLoading(); }, 2000);
                        if (LandingPageDetails.IsBeeTemplate == "true")
                            setTimeout(function () { landingPageUtil.RedirectToEditor(id, pagename); }, 3000);
                        else
                            setTimeout(function () { landingPageUtil.RedirectToUploadEditor(id, pagename); }, 3000);
                    }
                    else
                        ShowErrorMessage(GlobalErrorList.LandingPage.Update_error);
                }
                else {
                    if (response > 0) {
                        id = parseInt(response);
                        ShowSuccessMessage(GlobalErrorList.LandingPage.Save_success);

                        const responseTimeout = setTimeout(function () { ShowPageLoading(); }, 2000);
                        const responseOneTimeout = setTimeout(function () { landingPageUtil.RedirectToLandingPageTemplate(id, pagename); }, 3000);
                    }
                    else
                        ShowErrorMessage(GlobalErrorList.LandingPage.Save_error);
                }
                $(".popupcontainer").addClass("hideDiv");
                /*landingPageUtil.MaxCount('');*/
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },
    RedirectToLandingPageTemplate: function () {
        window.location.href = "/Analytics/LandingPageTemplate";
    },
    RedirectToEditor: function (id, pagename) {
        window.location.href = "/Analytics/LandingPageEditor?Id=" + id + "&IsNew=false&PageName=" + encodeURI(pagename);
    },
    RedirectToUploadEditor: function (id, pagename) {
        window.location.href = "/Analytics/LandingPageUploadDesign?Id=" + id + "&IsNew=false&PageName=" + encodeURI(pagename);
    },
    DeleteModalShow: function (Id) {
        $("#deleterow").modal("show");
        $("#deleteRowConfirm").attr("DeleteId", Id);
    },
    DeleteLandingPage: function (Id) {
        ShowPageLoading();
        $.ajax({
            url: "/Analytics/LandingPage/DeleteLandingPage",
            type: 'Post',
            data: JSON.stringify({ 'AdsId': Plumb5AccountId, 'Id': Id }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response)
                    ShowSuccessMessage(GlobalErrorList.LandingPage.Delete_success);
                else
                    ShowErrorMessage(GlobalErrorList.LandingPage.Delete_error);
                $("#deleteRowConfirm").removeAttr("DeleteId");
                landingPageUtil.MaxCount('');
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },
    EditPopUpShow: function (Id, PgeName, PgeDes, IsBeeTemplate) {
        if (CNAME != "" && LPNAME != "" && IsLandingPageConfigEnabled) {
            $(".popuptitle h6").html("Edit Landing Page");
            $("#editlpagename").val("");
            $("#editlpagedescrpt").val("");
            $("#editlpagename").val(PgeName);
            $("#editlpagedescrpt").val(PgeDes);
            $("#ui_btn_LandingPageNext").attr("LPId", Id);
            $("#ui_btn_LandingPageNext").attr("IsBeeTemplate", IsBeeTemplate);
            $("#ui_btn_LandingPageNext").attr("EditOrDuplicate", "edit");
            $("#editlpagename").prop("readonly", true);
            $("#ui_divUploadLandingPage").removeClass('hideDiv');
        }
        else {
            ShowErrorMessage(GlobalErrorList.LandingPage.Configuration_Error);
            return false;
        }
    },
    VerifyLandingPage: function (a, value, getCNAME, getLPNAME) {
        ShowPageLoading();
        $.ajax({
            url: "/Analytics/LandingPage/VerifyLandingPage",
            type: 'Post',
            data: JSON.stringify({ 'CNAME': getCNAME, 'LPNAME': getLPNAME }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response.Status) {
                    if (a == 0) {
                        ShowSuccessMessage(GlobalErrorList.LandingPage.Verify_success);
                    }
                    else {
                        if (a == 1) {
                            copyToClipboard(value)
                        }
                        else if (a == 2) {
                            window.open("Content/PageAnalysis?page=" + value, "_blank");
                        }
                    }
                }
                else
                    ShowErrorMessage(GlobalErrorList.LandingPage.Verify_error);

                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },
    DuplicateLandingPage: function (Id, PgeName, PgeDes, IsBeeTemplate) {
        if (CNAME != "" && LPNAME != "" && IsLandingPageConfigEnabled) {
            $(".popuptitle h6").html("Duplicate Landing Page");
            $("#editlpagename").val("");
            $("#editlpagedescrpt").val("");
            $("#editlpagename").val(PgeName + "_Copy");
            $("#editlpagedescrpt").val(PgeDes);
            $("#ui_btn_LandingPageNext").attr("LPId", Id);
            $("#ui_btn_LandingPageNext").attr("IsBeeTemplate", IsBeeTemplate);
            $("#ui_btn_LandingPageNext").attr("EditOrDuplicate", "duplicate");
            $("#editlpagename").prop("readonly", false);
            $("#ui_divUploadLandingPage").removeClass('hideDiv');
        }
        else {
            ShowErrorMessage(GlobalErrorList.LandingPage.Configuration_Error);
            return false;
        }
    },
    SaveDuplicateLandingPage: function (LandingPageDetails, SourceLPId) {
        ShowPageLoading();
        $.ajax({
            url: "/Analytics/LandingPage/DuplicateLandingPage",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'SourceLPId': SourceLPId, 'landingPage': LandingPageDetails }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                let id = parseInt(response.Id), pagename = LandingPageDetails.PageName;

                if (id > 0) {
                    ShowSuccessMessage(GlobalErrorList.LandingPage.Save_success);
                    if (LandingPageDetails.IsBeeTemplate == "true") {
                        const responseTimeout = setTimeout(function () { ShowPageLoading(); }, 2000);
                        const responseOneTimeout = setTimeout(function () { landingPageUtil.RedirectToEditor(id, pagename); }, 3000);
                    }
                    else {
                        const responseTimeout = setTimeout(function () { ShowPageLoading(); }, 2000);
                        const responseOneTimeout = setTimeout(function () { landingPageUtil.RedirectToUploadEditor(id, pagename); }, 3000);
                    }
                }
                else
                    ShowErrorMessage(GlobalErrorList.LandingPage.Save_error);

                $(".popupcontainer").addClass("hideDiv");
                /*landingPageUtil.MaxCount('');*/
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    }
};

function copyToClipboard(value) {
    var tempInput = document.createElement("input");
    tempInput.style = "position: absolute; left: -1000px; top: -1000px";
    tempInput.value = value;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
}

$("#ui_button_CopyClpbrd").click(function () {
    let value = $("#ui_span_CName").html();
    copyToClipboard(value);
});

$(".crtepagetemp").click(function () {
    if (CNAME != "" && LPNAME != "" && IsLandingPageConfigEnabled) {
        const responseTimeout = setTimeout(function () { ShowPageLoading(); }, 1000);
        const responseOneTimeout = setTimeout(function () { landingPageUtil.RedirectToLandingPageTemplate(); }, 2000);
    }
    else {
        ShowErrorMessage(GlobalErrorList.LandingPage.Configuration_Error);
        return false;
    }
});

$("#ui_btn_LandingPageNext").click(function () {
    if (!landingPageUtil.Validate())
        return false;

    var LandingPageDetails = { Id: 0, UserInfoUserId: 0, UserGroupId: 0, PageName: "", PageDescription: "", CreatedDate: "", Content: "", UpdatedDate: "", LandingPageConfigurationId: 0, IsBeeTemplate: false, IsTemplateSaved: false };

    LandingPageDetails.PageName = $("#editlpagename").val();
    LandingPageDetails.PageDescription = $("#editlpagedescrpt").val();

    const myButton = document.getElementById("ui_btn_LandingPageNext");

    let answer = myButton.hasAttribute("LPId");
    if (answer)
        LandingPageDetails.Id = parseInt($("#ui_btn_LandingPageNext").attr("LPId"));

    let answerOne = myButton.hasAttribute("IsBeeTemplate");
    if (answerOne)
        LandingPageDetails.IsBeeTemplate = $("#ui_btn_LandingPageNext").attr("IsBeeTemplate");

    let answerTwo = myButton.hasAttribute("EditOrDuplicate");
    if ($("#ui_btn_LandingPageNext").attr("EditOrDuplicate").toLowerCase() == "edit")
        landingPageUtil.SaveOrUpdateLandingPage(LandingPageDetails);
    else if ($("#ui_btn_LandingPageNext").attr("EditOrDuplicate").toLowerCase() == "duplicate")
        landingPageUtil.SaveDuplicateLandingPage(LandingPageDetails, parseInt($("#ui_btn_LandingPageNext").attr("LPId")));
});

$("#ui_txt_SearchLandingPage").keypress(function (e) {
    if ((e.which && e.which === 13) || (e.keyCode && e.keyCode === 13)) {
        if (CleanText($.trim($("#ui_txt_SearchLandingPage").val())).length == 0) {
            ShowErrorMessage(GlobalErrorList.LandingPage.SearchErrorValue);
            return false;
        }
        ShowPageLoading();
        let value = $.trim($("#ui_txt_SearchLandingPage").val());
        landingPageUtil.MaxCount(value);
    }
});

$("#ui_txt_SearchLandingPage").keyup(function (e) {
    if (e.which && e.which === 8 || e.keyCode && e.keyCode === 46)
        if (CleanText($.trim($("#ui_txt_SearchLandingPage").val())).length == 0) {
            $("#ui_txt_SearchLandingPage").val("");
            CallBackFunction();
        }
});

$(".searchIcon").click(function () {
    if (CleanText($.trim($("#ui_txt_SearchLandingPage").val())).length == 0) {
        ShowErrorMessage(GlobalErrorList.LandingPage.SearchErrorValue);
        return false;
    }
    ShowPageLoading();
    let value = $.trim($("#ui_txt_SearchLandingPage").val());
    landingPageUtil.MaxCount(value);
});

$("#deleteRowConfirm").click(function () {
    let value = parseInt($("#deleteRowConfirm").attr("DeleteId"));
    landingPageUtil.DeleteLandingPage(value);
});

$(".btnverify").click(function () {
    if (CNAME != "" && LPNAME != "" && IsLandingPageConfigEnabled)
        landingPageUtil.VerifyLandingPage(0, "", CNAME, LPNAME);
    else {
        ShowErrorMessage(GlobalErrorList.LandingPage.Configuration_Error);
        return false;
    }
});

//Search text
$(".contsearchfocus")
    .on("focus", function () {
        $(this).parent().addClass("w-300");
    })
    .on("blur", function () {
        if ($(".contsearchfocus").val().length < 15)
            $(this).parent().removeClass("w-300");
    });

$("#close-popup, .clsepopup").click(function () {
    $(this).parents(".popupcontainer").addClass("hideDiv");
    $("tr").removeClass("activeBgRow");
    $(".errmsgemlvalidwrp .ion-ios-information").popover("hide");
});