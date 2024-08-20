var captureFormDiv = "";
var errorCountI = 0, IsOTPForm = 0, InPageOTPForm = 0;
var formBasicDetails, formDesign, formFields, formBannerList, answerDatas = new Array(), feedDataDetails, extraLinks, formFieldsBindingDetails;
var onExitFormData = {};
var FormAppearenceTimeOutData;
var IframeIds = new Array();
var buttonTagName = ""; isStaticCalled = false; isCalled = true;
var P5FormDatalist; LoadingScriptErrorCount = 50;

var FormLoadDetails = { formBasicDetails: "", formDesign: "", formFields: "", formBannerList: "", formFieldsBindingDetails: "", Visitor: "", APIKeyForClickToCall: "", RedirectUrl: "", OTPMessage: "", OTPStatus: "" };

var AllFormDetails = new Array();
var p5EventPaused = true;
var p5EventName = null, p5EventData = null;

var TrackerUrl = {
    TrackDomainUrl: "//pgp5track.plumb5.in/VisitorDetail/InitiateTrackDetail",
    EventTrackingUrl: "//pgp5track.plumb5.in/EventDetails/SaveEventDetails",
    PushNotificationUrl: "//pgp5track.plumb5.in/PushNotification/SaveWebPushUser",
    WebPushSubscriptionSetttingUrl: "//pgp5track.plumb5.in/PushNotification/SaveWebPushUser/GetWebPushSubscriptionSettting",
    ServiceWorkerUrl: "//p5src.p5email.com/P5_Sw.js",
    MainUrl: "//pgsrc.plumb5.in",
    Step2HttpSubDomain: "p5email.com",

    GetTaggedFormDetails: "//pgp5track.plumb5.in/VisitorDetail/GetTaggedFormDetails",
    GetFormDetailsUrl: "//pgp5track.plumb5.in/VisitorDetail/InitiateFormDetail",
    FormSaveUrl: "//pgp5track.plumb5.in/FormInfoDetails/SaveFormDetails",
    FormImpressionUrl: "//pgp5track.plumb5.in/FormInfoDetails/SaveFormImpression",
    FormCloseImpressionUrl: "//pgp5track.plumb5.in/FormInfoDetails/SaveFormCloseImpression",
    LoadOTPFormUrl: "//pgp5track.plumb5.in/FormInfoDetails/LoadOTPForm",
    SaveOTPFormUrl: "//pgp5track.plumb5.in/FormInfoDetails/SaveOTPFormDetails",
    plumb5ChatDomain: "https://pgchat.plumb5.com/",
    ScriptErrorLog: "//pgp5track.plumb5.in/FormInfoDetails/SaveFormScriptErrorLog",
    SaveCustomEventUrl: "//pgp5track.plumb5.in/EventDetails/SaveCustomEventDetails",
    SaveUserDetails: "//pgp5track.plumb5.in/EventDetails/SaveUserDetails"
};

var MainVisitorDetails = {
    BasicDetails: { Machineid: null, Session: null, CurrentTime: null, Prevtime: null, SessionKey: 0, VisitorIp: null },
    WebSiteDetails: { Domain: null, Url: null, PageName: null, PageTitle: null },
    ReferrerDetails: {
        RepeatOrNew: 'N', Referrer: "", ReferrerShorten: null, ReferrerDomain: null, ReferType: 'Direct', SearchBy: null, PaidFlag: 0,
        P5MailUniqueID: null, P5SMSUniqueID: null, P5WhatsAppUniqueID: null, P5WebPushUniqueID: null
    },
    ContactDetails: { EmailId: null, ContactId: null, VisitorId: null },
    UtmTagDetails: { utm_source: null, utm_medium: null, utm_campaign: null, utm_term: null },
    EventDetails: { Name: null, EventName: null, EventValue: null },
    UserAgent: null,
    Browser: null,
    DeviceId: 0,
    AccountId: 1,
    CaptureFormFilledIds: [],
    StaticFormIds: []
};

var PushNotificationDetails = {
    Endpointurl: null,
    Tokenkey: null,
    Authkey: null,
    IsSubscribe: true
};

var p5searchEngine = [".google.", ".yahoo.", "r.search.yahoo", ".bing.", ".altavista.", ".ask.", ".search.", ".isearch.", ".search-results", ".searchya", ".searchyahoo", ".wow.com", ".webcrawler.com", ".info.com", ".duckduckgo.com", ".blekko.com", ".contenko.com", ".dogpile.com", ".alhea.com", ".baidu.com", ".yandex.com", ".yippy.com", "search.lycos.com", ".looksmart.com", ".hotbot.com", ".aolsearch.com"];
var p5Social = [".facebook.", "l.facebook.com", "m.facebook.com", ".twitter.", ".t.co", ".linkedin.", ".pinterest", ".myspace", "plus.google", "plus.url.google", ".deviantart", ".livejournal", ".tagged", ".cafemom", ".ning", ".meetup", ".mylife", ".multiply", ".tumblr", ".foursquare", ".ibibo", "googleplus", ".youtube.", ".reddit", ".delicious", ".flickr", ".picasa", ".xing.com", ".twoo.com", ".whatsapp.com", "web.whatsapp.com", ".instagram.com", ".vk.com", ".stumbleupon.com", ".t.umblr.com"];

var FormInfoDetails = { FormId: 0, OTPFormId: 0, FormType: 0, BannerId: 0, RedirectUrl: "", Name: "", EmailId: "" };

var FormUtil = {
    BindOnExitAndOnLoadForms: function (response) {

        if (AllFormDetails != null && AllFormDetails.length > 0 && response != null) {
            response = response;
            var totalresponselength = response.length;

            if (totalresponselength > 0) {
                for (var a = 0; a < totalresponselength; a++) {

                    var FormId = response[a].formDetails.Id;

                    const found = AllFormDetails.some(el => el.formDetails.Id === FormId);
                    if (!found)
                        AllFormDetails.push(response[a]);
                }
            }
        }
        else {
            AllFormDetails = response = response;
        }

        if (response != null && response.length > 0) {
            for (var i = 0; i < response.length; i++) {

                if (response[i].formDetails.Id > 0) {

                    if (response[i].formDetails != null && response[i].formDetails.EmbeddedFormOrPopUpFormOrTaggedForm == "PopUpForm") {
                        // other than exit form
                        if (response[i].formDetails.AppearOnLoadOnExitOnScroll != 1) {
                            var IframeId = "Plumb5FromCampaign_" + response[i].formDetails.Id;
                            var IsSameFormAlreadyExists = document.getElementById(IframeId);

                            if (IsSameFormAlreadyExists == null) {
                                IframeIds.push(IframeId);
                                FormUtil.CaptureFormInitialise(IframeId, response[i].formDetails.FormType, response[i], "PopUp");
                            }
                        } // Exit form
                        else {
                            var IframeId = "Plumb5FromCampaign_" + response[i].formDetails.Id;

                            var IsSameFormAlreadyExists = document.getElementById(IframeId);

                            if (IsSameFormAlreadyExists == null) {
                                FormUtil.CaptureFormInitialise(IframeId, response[i].formDetails.FormType, response[i], "OnExit");
                            }
                        }
                    }
                    else if (response[i].formDetails != null && response[i].formDetails.EmbeddedFormOrPopUpFormOrTaggedForm == "EmbeddedForm") {

                        var IframeId = "Plumb5FromCampaign_" + response[i].formDetails.Id;

                        FormUtil.StartAppendScript(IframeId);

                        var responseDetails = {}
                        responseDetails["Visitor"] = response[i].Visitor;
                        responseDetails["banner"] = response[i].banner;
                        responseDetails["listExtraLinks"] = response[i].listExtraLinks;
                        responseDetails["APIKeyForClickToCall"] = response[i].APIKeyForClickToCall;
                        responseDetails["formDetails"] = response[i].formDetails;
                        responseDetails["formFields"] = response[i].formFields;
                        responseDetails["formFieldsBindingDetails"] = response[i].formFieldsBindingDetails;
                        FormUtil.CallingRespectiveForms(responseDetails, IframeId);
                    }
                }
            }
        }
    },
    CallingRespectiveForms: function (json, IframeId) {
        var iframeid = IframeId;
        visitorDetails = json.Visitor;
        formBasicDetails = formDesign = json.formDetails;
        formFields = json.formFields;
        formBannerList = json.banner;
        extraLinks = json.listExtraLinks;
        formFieldsBindingDetails = json.formFieldsBindingDetails;

        if (visitorDetails.Age != null && visitorDetails.Age != "")
            visitorDetails.Age = FormUtil.GetJavaScriptDateObj(visitorDetails.Age);

        if (formBasicDetails.FormType == 1)
            FormUtil.BindForms(iframeid, formBasicDetails.FormType);
        else if (formBasicDetails.FormType == 2)
            FormUtil.BindCustomHtmlForms(iframeid, formBasicDetails.FormType);
        else if (formBasicDetails.FormType == 3)
            FormUtil.BindCustomIframeForms(iframeid);
        else if (formBasicDetails.FormType == 4)
            FormUtil.BindCustomBanner(iframeid, formBasicDetails.FormType);
        else if (formBasicDetails.FormType == 5)
            FormUtil.BindVideoForm(iframeid);
    },
    BindForms: function (iframeid, FormType) {

        FormUtil.BindFormDesignStyle(iframeid);
        FormUtil.appearaceSettingOfForm(iframeid);

        if (formBasicDetails.IsNewDivOrOldTable == 0)
            FormUtil.formFieldAppendInTableFormat(iframeid);
        else
            FormUtil.formFieldAppendInDivFormat(iframeid, FormType);

        FormUtil.setHeightWidth(iframeid);

        if (formDesign.EmbeddedFormOrPopUpFormOrTaggedForm == "PopUpForm")
            FormUtil.CheckForAppearenceType(iframeid);
        else if (formDesign.EmbeddedFormOrPopUpFormOrTaggedForm == "EmbeddedForm")
            FormUtil.bindStaticAppearanceForms(iframeid);
    },
    BindCustomHtmlForms: function (iframeid, FormType) {
        if (FormUtil.ReplaceWithProductDetails()) {
            FormUtil.BindFormDesignStyle(iframeid);
            FormUtil.htmlAppend(iframeid, FormType);
            FormUtil.appearaceSettingOfForm(iframeid);
            FormUtil.setHeightWidth(iframeid);

            if (formDesign.EmbeddedFormOrPopUpFormOrTaggedForm == "PopUpForm")
                FormUtil.CheckForAppearenceType(iframeid);
            else if (formDesign.EmbeddedFormOrPopUpFormOrTaggedForm == "EmbeddedForm")
                FormUtil.bindStaticAppearanceForms(iframeid);
        }
        return;
    },
    BindCustomIframeForms: function (iframeid) {
        FormUtil.BindFormDesignStyle(iframeid);
        FormUtil.IframeAppend(iframeid);
        FormUtil.appearaceSettingOfForm(iframeid);
        FormUtil.setHeightWidth(iframeid);

        if (formDesign.EmbeddedFormOrPopUpFormOrTaggedForm == "PopUpForm")
            FormUtil.CheckForAppearenceType(iframeid);
        else if (formDesign.EmbeddedFormOrPopUpFormOrTaggedForm == "EmbeddedForm")
            FormUtil.bindStaticAppearanceForms(iframeid);
    },

    BindCustomBanner: function (iframeid, FormType) {
        FormUtil.BindFormDesignStyle(iframeid);

        var bannerheight = 0;
        var bancontent = formDesign.MainBackgroundDesign;
        var firstContent;

        if (bancontent.indexOf("height") > -1) {
            firstContent = bancontent.substring(bancontent.indexOf("height") + 7, bancontent.length);
            bannerheight = firstContent.substring(0, firstContent.indexOf(";")).replace("px", "");
            bannerheight = bannerheight.trim();
            bannerheight = parseInt(bannerheight);
        }

        FormUtil.appearaceSettingOfForm(iframeid);
        FormUtil.bannerImageAppend(iframeid, FormType, bannerheight);

        FormUtil.setHeightWidth(iframeid);

        if (formDesign.EmbeddedFormOrPopUpFormOrTaggedForm == "PopUpForm")
            FormUtil.CheckForAppearenceType(iframeid);
        else if (formDesign.EmbeddedFormOrPopUpFormOrTaggedForm == "EmbeddedForm")
            FormUtil.bindStaticAppearanceForms(iframeid);
    },

    BindVideoForm: function (iframeid) {
        FormUtil.videoAppend(iframeid);
        FormUtil.BindFormDesignStyle(iframeid);
        FormUtil.appearaceSettingOfForm(iframeid);
        FormUtil.setHeightWidth(iframeid);

        if (formDesign.EmbeddedFormOrPopUpFormOrTaggedForm == "PopUpForm")
            FormUtil.CheckForAppearenceType(iframeid);
        else if (formDesign.EmbeddedFormOrPopUpFormOrTaggedForm == "EmbeddedForm")
            FormUtil.bindStaticAppearanceForms(iframeid);
    },

    bannerImageAppend: function (iframeid, FormType, banheight) {
        var IframeElement = document.getElementById(iframeid);
        var innerDoc = IframeElement.contentDocument || IframeElement.contentWindow.document;

        var anchorTag = document.createElement("a");
        anchorTag.style.textDecoration = "none";
        anchorTag.style.cursor = "pointer";

        anchorTag.target = "_parent";
        anchorTag.addEventListener("click", function (evt) {
            FormUtil.BannerClicked(iframeid, FormType);
        });

        var myImage = document.createElement("img");
        myImage.setAttribute("src", formBannerList.BannerContent);
        anchorTag.appendChild(myImage);

        var div = FormUtil.getDiv("");
        div.className = "dvbannerimg";
        div.append(anchorTag);

        if (innerDoc != undefined) {
            innerDoc.getElementById("dvMainContentDiv").appendChild(div);
        }
    },

    htmlAppend: function (iframeid, FormType) {
        var div = FormUtil.getDiv("");
        div.className = "dvhtmlcontent";
        div.innerHTML = FormUtil.ShowNameAndEmailIdInForms(formBannerList.BannerContent);

        var IframeElement = document.getElementById(iframeid);
        var innerDoc = IframeElement.contentDocument || IframeElement.contentWindow.document;

        if (innerDoc != undefined) {
            innerDoc.getElementById("dvMainContentDiv").appendChild(div);

            innerDoc.body.addEventListener("click", function (evt) {
                FormUtil.BannerClicked(iframeid, FormType);
            });
        }
    },
    IframeAppend: function (iframeid) {
        var div = FormUtil.getDiv("");
        div.className = "dviframecontent";
        div.innerHTML = formBannerList.BannerContent;

        var IframeElement = document.getElementById(iframeid);
        var innerDoc = IframeElement.contentDocument || IframeElement.contentWindow.document;

        if (innerDoc != undefined) {
            innerDoc.getElementById("dvMainContentDiv").appendChild(div);
        }
    },

    videoAppend: function (iframeid) {

        var IframeElement = document.getElementById(iframeid);
        var innerDoc = IframeElement.contentDocument || IframeElement.contentWindow.document;

        if (formBannerList.BannerContent.indexOf("embed") > -1) {

            var div = FormUtil.getDiv("");
            div.className = "dvvideocontent";
            div.innerHTML = formBannerList.BannerContent;

            if (innerDoc != undefined) {
                innerDoc.getElementById("dvMainContentDiv").appendChild(div);
            }
        }
        else if (formBannerList.BannerContent.indexOf("iframe") < 0) {

            formBannerList.BannerContent = "//" + formBannerList.BannerContent.replace("watch?v=", "embed/").replace("http://", "").replace("https://", "");

            if (formBannerList.BannerContent.indexOf("embed") > -1) {
                var contentFrame = document.createElement("iframe");
                contentFrame.className = "dvvideocontent";
                contentFrame.id = "iframeContent"; contentFrame.scrolling = "no"; contentFrame.frameborder = "0"; contentFrame.marginwidth = "0"; contentFrame.marginheight = "0"; contentFrame.allowtransparency = true;
                contentFrame.allowFullscreen = "true";
                contentFrame.webkitallowfullscreen = "true";
                contentFrame.mozallowfullscreen = "true";
                contentFrame.style.border = "none";
                contentFrame.setAttribute("src", formBannerList.BannerContent);
                contentFrame.style.height = formDesign.Height - 26 + "px";
                contentFrame.style.width = "100%";
                contentFrame.style.height = "100%";

                if (innerDoc != undefined) {
                    innerDoc.getElementById("dvMainContentDiv").appendChild(contentFrame);
                }
            }
        }
        else if (formBannerList.BannerContent.indexOf("iframe") > -1) {
            var div = FormUtil.getDiv("");
            div.className = "dvvideocontent";
            div.innerHTML = formBannerList.BannerContent;

            if (innerDoc != undefined) {
                innerDoc.getElementById("dvMainContentDiv").appendChild(div);
            }
        }
    },

    ReplaceWithProductDetails: function () {

        formBannerList.BannerContent = FormUtil.ShowNameAndEmailIdInForms(formBannerList.BannerContent);

        if (formBannerList.BannerContent != null && formBannerList.BannerContent.indexOf("[{*") > 0)
            return false;
        return true;
    },
    ShowNameAndEmailIdInForms: function (content) {
        if (content && content != null) {
            if (FormInfoDetails.Name != null && FormInfoDetails.Name != "") {
                var regNameExpReplace = new RegExp("\\[\\{\\*Name\\*\\}\\]", "ig");
                content = content.replace(regNameExpReplace, FormInfoDetails.Name);
            }

            if (FormInfoDetails.EmailId != null && FormInfoDetails.EmailId != "") {
                var regEmailExpReplace = new RegExp("\\[\\{\\*EmailId\\*\\}\\]", "ig");
                content = content.replace(regEmailExpReplace, FormInfoDetails.EmailId);
            }
        }
        return content;
    },
    BannerClicked: function (iframeid, FormType) {

        if (iframeid != null && iframeid.length > 0) {

            var FormId = iframeid.split("_")[1];

            FormInfoDetails.FormId = parseInt(FormId);

            if (AllFormDetails != null && AllFormDetails.length > 0) {
                for (var i = 0; i < AllFormDetails.length; i++) {
                    if (AllFormDetails[i].banner != null && AllFormDetails[i].banner != "" && AllFormDetails[i].banner.FormId == FormId) {
                        FormInfoDetails.BannerId = AllFormDetails[i].banner.Id;
                        break;
                    }
                }
            }

            FormInfoDetails.FormType = FormType;
            SaveDetails(iframeid, FormType);
        }
    },
    formFieldAppendInDivFormat: function (iframeid, FormType) {

        var IframeElement = document.getElementById(iframeid);
        var innerDoc = IframeElement.contentDocument || IframeElement.contentWindow.document;

        if (AllFormDetails != null && AllFormDetails.length > 0 && iframeid != null) {
            var FormId = iframeid.split("_")[1];

            for (var j = 0; j < AllFormDetails.length; j++) {
                if (AllFormDetails[j].formDetails.Id == FormId) {
                    formDesign = AllFormDetails[j].formDetails;
                }
            }
        }

        var plachoderisNeeded = formDesign.AppearEffectOfFields;

        var tableContent = "", rowContent = "";
        var imagerowcontent = "";
        for (var i = 0; i < formFieldsBindingDetails.length; i++) {
            if (formFieldsBindingDetails[i].FormLayoutOrder == 1) {
                if (formFieldsBindingDetails[i].FieldType == 1 || formFieldsBindingDetails[i].FieldType == 2 || formFieldsBindingDetails[i].FieldType == 3 || formFieldsBindingDetails[i].FieldType == 5 || formFieldsBindingDetails[i].FieldType == 6 || formFieldsBindingDetails[i].FieldType == 21 || formFieldsBindingDetails[i].FieldType == 22 || formFieldsBindingDetails[i].FieldType == 23) {

                    if (plachoderisNeeded == 1)
                        rowContent += "<div class='frminputWrap del'><div class='frmeditrow lblTxtBox'><div id='ui_dvplaceholder" + i + "' class='form-col-4 form-mb-col-12 labelStyle lblAlignPlaceholder adCol-100' style='display: flex;'><label>" + formFieldsBindingDetails[i].Name + "</label></div><div class='form-col-8 form-mb-col-12 txtBox adCol-100'><input type='text' autocomplete='off' id='ui_Field" + i + "' class='input-form-control' /><small id='uilblError" + i + "' class='frmvaliderr' style='display:none;'>Please enter your " + formFieldsBindingDetails[i].Name.toLowerCase() + "</small></div></div></div>";
                    else if (plachoderisNeeded == 0)
                        rowContent += "<div class='frminputWrap del'><div class='frmeditrow lblTxtBox'><div class='form-col-4 form-mb-col-12 labelStyle'><label>" + formFieldsBindingDetails[i].Name + "</label></div><div class='form-col-8 form-mb-col-12 txtBox'><input id='ui_Field" + i + "' type='text' autocomplete='off' class='input-form-control' /><small id='uilblError" + i + "' class='frmvaliderr' style='display:none;'>Please enter your " + formFieldsBindingDetails[i].Name.toLowerCase() + "</small></div></div></div>";
                    else if (plachoderisNeeded == 2)
                        rowContent += "<div class='frminputWrap del'><div class='frmeditrow lblTxtBox'><div class='form-col-4 form-mb-col-12 labelStyle adCol-100'><label>" + formFieldsBindingDetails[i].Name + "</label></div><div class='form-col-8 form-mb-col-12 txtBox adCol-100'><input type='text' autocomplete='off' id='ui_Field" + i + "' class='input-form-control' /><small id='uilblError" + i + "' class='frmvaliderr' style='display:none;'>Please enter your " + formFieldsBindingDetails[i].Name.toLowerCase() + "</small></div></div></div>";
                }
                else if (formFieldsBindingDetails[i].FieldType == 4) {

                    var ClassName = "";

                    if (formFieldsBindingDetails[i].CalendarDisplayType == 0)
                        ClassName = " calender";
                    else if (formFieldsBindingDetails[i].CalendarDisplayType == 1)
                        ClassName = " calenderWithoutPastDates";
                    else if (formFieldsBindingDetails[i].CalendarDisplayType == 2)
                        ClassName = " calenderWithoutFutureDates";

                    if (plachoderisNeeded == 1)
                        rowContent += "<div class='frminputWrap del'><div class='frmeditrow dateBoxWrap'><div id='ui_dvplaceholder" + i + "' class='form-col-4 form-mb-col-12 labelStyle adCol-100 lblAlignPlaceholder' style='display: flex;'><label>" + formFieldsBindingDetails[i].Name + "</label></div><div class='form-col-8 form-mb-col-12 dateWrap adCol-100'><input autocomplete='off' id='ui_Field" + i + "' class='input-form-control prevdtpickrinpt " + ClassName + "' type='text'><small id='uilblError" + i + "' class='frmvaliderr' style='display:none;'>Please enter " + formFieldsBindingDetails[i].Name.toLowerCase() + "</small></div></div></div>";
                    else if (plachoderisNeeded == 0)
                        rowContent += "<div class='frminputWrap del'><div class='frmeditrow dateBoxWrap'><div class='form-col-4 form-mb-col-12 labelStyle' style='display:flex;'><label>" + formFieldsBindingDetails[i].Name + "</label></div><div class='form-col-8 form-mb-col-12 dateWrap'><input id='ui_Field" + i + "' class='input-form-control prevdtpickrinpt " + ClassName + "' type='text' autocomplete='off' placeholder=''" + formFieldsBindingDetails[i].Name + "' (dd-mm-yy)'><small id='uilblError" + i + "' class='frmvaliderr' style='display:none;'>Please enter " + formFieldsBindingDetails[i].Name.toLowerCase() + "</small></div></div></div>";
                    else if (plachoderisNeeded == 2)
                        rowContent += "<div class='frminputWrap del'><div class='frmeditrow dateBoxWrap'><div class='form-col-4 form-mb-col-12 labelStyle adCol-100'><label>" + formFieldsBindingDetails[i].Name + "</label></div><div class='form-col-8 form-mb-col-12 dateWrap adCol-100'><input id='ui_Field" + i + "' class='input-form-control prevdtpickrinpt " + ClassName + "' type='text' autocomplete='off' placeholder=''" + formFieldsBindingDetails[i].Name + "' (dd-mm-yy)'><small id='uilblError" + i + "' class='frmvaliderr' style='display:none;'>Please enter " + formFieldsBindingDetails[i].Name.toLowerCase() + "</small></div></div></div>";
                }
                else if (formFieldsBindingDetails[i].FieldType == 7) {
                    if (plachoderisNeeded == 1)
                        rowContent += "<div class='frminputWrap del'><div class='frmeditrow messBox'><div id='ui_dvplaceholder" + i + "' class='form-col-4 form-mb-col-12 labelStyle adCol-100 lblAlignPlaceholder' style='display: flex;'><label>" + formFieldsBindingDetails[i].Name + "</label></div><div class='form-col-8 form-mb-col-12 textMessWrap adCol-100'><textarea id='ui_Field" + i + "' class='input-form-control'></textarea><small id='uilblError" + i + "' class='frmvaliderr' style='display:none;'>Please enter your " + formFieldsBindingDetails[i].Name.toLowerCase() + "</small></div></div></div>";
                    else if (plachoderisNeeded == 0)
                        rowContent += "<div class='frminputWrap del'><div class='frmeditrow messBox'><div class='form-col-4 form-mb-col-12 labelStyle'><label>" + formFieldsBindingDetails[i].Name + "</label></div><div class='form-col-8 form-mb-col-12 textMessWrap'><textarea id='ui_Field" + i + "' class='input-form-control'></textarea><small id='uilblError" + i + "' class='frmvaliderr' style='display:none;'>Please enter your " + formFieldsBindingDetails[i].Name.toLowerCase() + "</small></div></div></div>";
                    else if (plachoderisNeeded == 2)
                        rowContent += "<div class='frminputWrap del'><div class='frmeditrow messBox'><div class='form-col-4 form-mb-col-12 labelStyle adCol-100'><label>" + formFieldsBindingDetails[i].Name + "</label></div><div class='form-col-8 form-mb-col-12 textMessWrap adCol-100'><textarea id='ui_Field" + i + "' class='input-form-control'></textarea><small id='uilblError" + i + "' class='frmvaliderr' style='display:none;'>Please enter your " + formFieldsBindingDetails[i].Name.toLowerCase() + "</small></div></div></div>";
                }
                else if (formFieldsBindingDetails[i].FieldType == 8) {

                    var options = "", relationFieldIndex, Onchangingfunction = "";

                    if (plachoderisNeeded != 1)
                        options = "<option value='0'>Select</option>";
                    else
                        options = "<option value='0'>Select " + formFieldsBindingDetails[i].Name + "</option>";

                    if (formFieldsBindingDetails[i].RelationField == 0) {
                        var subFieldList = formFieldsBindingDetails[i].SubFields.split(",");
                        for (var j = 0; j < subFieldList.length; j++)
                            options += "<option value='" + subFieldList[j] + "'>" + subFieldList[j] + "</option>"
                    }

                    if (plachoderisNeeded == 1)
                        rowContent += "<div class='frminputWrap del'><div class='frmeditrow selectDropPar'><div class='form-col-4 form-mb-col-12 labelStyle' style='display: none;'><label>" + formFieldsBindingDetails[i].Name + "</label></div><div class='form-col-8 form-mb-col-12 SelectDropId adCol-100'><select id='ui_Field" + i + "' class='input-form-control'>" + options + "</select><small id='uilblError" + i + "' class='frmvaliderr' style='display:none;'>Please select your " + formFieldsBindingDetails[i].Name.toLowerCase() + "</small></div></div></div>";
                    else if (plachoderisNeeded == 0)
                        rowContent += "<div class='frminputWrap del'><div class='frmeditrow selectDropPar'><div class='form-col-4 form-mb-col-12 labelStyle'><label class='labelName'>" + formFieldsBindingDetails[i].Name + "</label></div><div class='form-col-8 form-mb-col-12 SelectDropId'><select id='ui_Field" + i + "' class='input-form-control'>" + options + "</select><small id='uilblError" + i + "' class='frmvaliderr' style='display:none;'>Please select your " + formFieldsBindingDetails[i].Name.toLowerCase() + "</small></div></div></div>";
                    else if (plachoderisNeeded == 2)
                        rowContent += "<div class='frminputWrap del'><div class='frmeditrow selectDropPar'><div class='form-col-4 form-mb-col-12 labelStyle adCol-100'><label>" + formFieldsBindingDetails[i].Name + "</label></div><div class='form-col-8 form-mb-col-12 SelectDropId adCol-100'><select id='ui_Field" + i + "' class='input-form-control'>" + options + "</select><small id='uilblError" + i + "' class='frmvaliderr' style='display:none;'>Please select your " + formFieldsBindingDetails[i].Name.toLowerCase() + "</small></div></div></div>";
                }
                else if (formFieldsBindingDetails[i].FieldType == 9) {

                    var alignclassname = "";

                    if (formDesign.RadioCheckBoxFieldsCss != null && formDesign.RadioCheckBoxFieldsCss.length > 0) {

                        var RadioCheckBoxDesignData = formDesign.RadioCheckBoxFieldsCss.split("@$@");

                        var RadioCheckBoxDesignDataFirstCss = RadioCheckBoxDesignData[0];

                        RadioCheckBoxDesignDataFirstCss = RadioCheckBoxDesignDataFirstCss.split(";");

                        if (RadioCheckBoxDesignDataFirstCss[0].indexOf("justify-content") > -1) {
                            var TextAlign = RadioCheckBoxDesignDataFirstCss[0].split(":")[1];

                            if (TextAlign != null && TextAlign != "" && TextAlign != undefined && TextAlign.length > 0) {
                                if (TextAlign == "left")
                                    alignclassname = "";
                                else if (TextAlign == "center")
                                    alignclassname = "chkbxradialigncenter";
                                else if (TextAlign == "right")
                                    alignclassname = "chkbxradialignright";
                            }
                            else {
                                alignclassname = "";
                            }
                        }
                    }

                    var options = "";
                    var subFieldList = formFieldsBindingDetails[i].SubFields.split(",");

                    var labelclassname = "";

                    if (formFieldsBindingDetails[i].FieldShowOrHide) {
                        labelclassname = "hideradiolbl";
                    }

                    var ClassName = "inline-check";
                    var placeholderClassName = "";

                    if (formFieldsBindingDetails[i].FieldDisplay != undefined && formFieldsBindingDetails[i].FieldDisplay != null && formFieldsBindingDetails[i].FieldDisplay != "" && formFieldsBindingDetails[i].FieldDisplay.length > 0) {
                        if (formFieldsBindingDetails[i].FieldDisplay == "Vertical") {
                            ClassName = "";
                        }
                    }

                    for (var j = 0; j < subFieldList.length; j++)
                        options += "<div class='radio-container " + ClassName + "'><input type='radio' class='input-check checkId' id='ui_rad" + j + "_ui_Field" + i + "' value='" + subFieldList[j] + "' name='ui_Field" + i + "'><label for='ui_rad" + j + "_ui_Field" + i + "' class='label-check'>" + subFieldList[j] + "</label></div>";

                    if (plachoderisNeeded == 1 || plachoderisNeeded == 2) {
                        placeholderClassName = "adCol-100";
                    }

                    rowContent += "<div class='form-radio-wrapee del'><div class='frmeditrow labelTopBot'><div class='form-col-4 form-mb-col-12 w-100 " + placeholderClassName + "'><div class='labelWrap labelWrapradio " + labelclassname + "'><label>" + formFieldsBindingDetails[i].Name + "</label></div></div><div class='form-col-8 form-mb-col-12 w-100 addradioBtn " + placeholderClassName + " " + alignclassname + "'>" + options + "<small id='uilblError" + i + "' class='frmvaliderr' style='display:none;'>Please check the " + formFieldsBindingDetails[i].Name.toLowerCase() + " field</small></div></div></div>";
                }
                else if (formFieldsBindingDetails[i].FieldType == 10) {

                    var alignclassname = "";

                    if (formDesign.RadioCheckBoxFieldsCss != null && formDesign.RadioCheckBoxFieldsCss.length > 0) {

                        var RadioCheckBoxDesignData = formDesign.RadioCheckBoxFieldsCss.split("@$@");

                        var RadioCheckBoxDesignDataFirstCss = RadioCheckBoxDesignData[0];

                        RadioCheckBoxDesignDataFirstCss = RadioCheckBoxDesignDataFirstCss.split(";");

                        if (RadioCheckBoxDesignDataFirstCss[0].indexOf("justify-content") > -1) {
                            var TextAlign = RadioCheckBoxDesignDataFirstCss[0].split(":")[1];

                            if (TextAlign != null && TextAlign != "" && TextAlign != undefined && TextAlign.length > 0) {
                                if (TextAlign == "left")
                                    alignclassname = "";
                                else if (TextAlign == "center")
                                    alignclassname = "chkbxradialigncenter";
                                else if (TextAlign == "right")
                                    alignclassname = "chkbxradialignright";
                            }
                            else {
                                alignclassname = "";
                            }
                        }
                    }

                    var labelclassname = "";

                    if (formFieldsBindingDetails[i].FieldShowOrHide) {
                        labelclassname = "hidecheckbxlbl";
                    }

                    var ClassName = "inline-check";
                    var placeholderClassName = "";

                    if (formFieldsBindingDetails[i].FieldDisplay != undefined && formFieldsBindingDetails[i].FieldDisplay != null && formFieldsBindingDetails[i].FieldDisplay != "" && formFieldsBindingDetails[i].FieldDisplay.length > 0) {
                        if (formFieldsBindingDetails[i].FieldDisplay == "Vertical") {
                            ClassName = "";
                        }
                    }

                    if (plachoderisNeeded == 1 || plachoderisNeeded == 2) {
                        placeholderClassName = "adCol-100";
                    }

                    var options = "";
                    var subFieldList = formFieldsBindingDetails[i].SubFields.split(",");
                    for (var j = 0; j < subFieldList.length; j++)
                        options += "<div class='check-container " + ClassName + "'><input type='checkbox' class='input-check checkId' name='ui_Field" + i + "' id='ui_Field" + i + "_chk" + j + "' value='" + subFieldList[j] + "'><label for='ui_Field" + i + "_chk" + j + "' class='label-check'>" + subFieldList[j] + "</label></div>"

                    rowContent += "<div class='form-check-wrapee del'><div class='frmeditrow labelTopBot'><div class='form-col-4 form-mb-col-12 w-100 " + placeholderClassName + "'><div class='labelWrap labelWrapcheck " + labelclassname + "'><label>" + formFieldsBindingDetails[i].Name + "</label></div></div><div class='form-col-8 form-mb-col-12 w-100 addcheckbox " + placeholderClassName + " " + alignclassname + "'>" + options + "<small id='uilblError" + i + "' class='frmvaliderr' style='display:none;'>Please check the " + formFieldsBindingDetails[i].Name.toLowerCase() + " field</small></div></div></div>";
                }
                else if (formFieldsBindingDetails[i].FieldType == 24) {
                    if (formDesign.ButtonPxOrPer)
                        rowContent += "<div id='submitWrap' class='btnWrapee del'><div id='btnRow' class='frmeditrow parSubBtn'><div class='childSubBtn btn-100'>" + FormUtil.submitButton("ui_btnSave", iframeid, FormType, '' + formFieldsBindingDetails[i].Name + '', formDesign.ButtonPxOrPer) + "</div></div></div>";
                    else
                        rowContent += "<div id='submitWrap' class='btnWrapee del'><div id='btnRow' class='frmeditrow parSubBtn'><div class='childSubBtn'>" + FormUtil.submitButton("ui_btnSave", iframeid, FormType, '' + formFieldsBindingDetails[i].Name + '', formDesign.ButtonPxOrPer) + "</div></div></div>";
                }
                else if (formFieldsBindingDetails[i].FieldType == 25) {

                    var classname = "";
                    if (formFieldsBindingDetails[i].FieldShowOrHide)
                        classname = "hideTitTxt";

                    rowContent += "<div id='formTitle' class='formTitle del editor " + classname + "'><h1 class='headTitOne' id='formHeadOne'>" + formFieldsBindingDetails[i].Name + "</h1></div>";
                }
                else if (formFieldsBindingDetails[i].FieldType == 26) {

                    var classname = "";
                    if (formFieldsBindingDetails[i].FieldShowOrHide)
                        classname = "hideDesTxt";

                    rowContent += "<div id='formDescript' class='formDescriptwrp del " + classname + "'><h4 class='formDescripTxt' id='desCripText'>" + formFieldsBindingDetails[i].Name + "</h4></div>";
                }
                else if (formFieldsBindingDetails[i].FieldType == 27) {
                    if (formDesign.IsBannerImageHidden)
                        imagerowcontent += "<div id='formBanBg' class='bgWrap bgAppend hidebanmob del'><img src='" + formFieldsBindingDetails[i].Name + "'/></div>";
                    else if (!formDesign.IsBannerImageHidden)
                        imagerowcontent += "<div id='formBanBg' class='bgWrap bgAppend del'><img src='" + formFieldsBindingDetails[i].Name + "'/></div>";
                }
            }
            else if (formFieldsBindingDetails[i].FormLayoutOrder == 2) {

                var FieldOneDetails = formFieldsBindingDetails[i];
                var FieldTwoDetails = formFieldsBindingDetails[i + 1];

                var FirstContent = "";
                var SecondContent = "";

                if (FieldOneDetails.FieldType == 1 || FieldOneDetails.FieldType == 2 || FieldOneDetails.FieldType == 3 || FieldOneDetails.FieldType == 5 || FieldOneDetails.FieldType == 6 || FieldOneDetails.FieldType == 21 || FieldOneDetails.FieldType == 22 || FieldOneDetails.FieldType == 23) {
                    if (plachoderisNeeded == 1)
                        FirstContent += '<div class="form-col-6 form-mb-col-12"><div class="frmeditrow positionRel parName"><div id="ui_dvplaceholder' + i + '" class="form-col-4 form-mb-col-12 labelStyle adCol-100 lblAlignPlaceholder" style="display:flex;"><label>' + FieldOneDetails.Name + '</label></div><div class="form-col-8 form-mb-col-12 editDblTextBox adCol-100"><input autocomplete="off" id="ui_Field' + i + '" type="text" class="input-form-control txtBx"/><small id="uilblError' + i + '" class="frmvaliderr" style="display: none;">Please enter your ' + FieldOneDetails.Name.toLowerCase() + '</small></div></div></div>'
                    else if (plachoderisNeeded == 0)
                        FirstContent += '<div class="form-col-6 form-mb-col-12"><div class="frmeditrow positionRel parName"><div class="form-col-4 form-mb-col-12 labelStyle lblAlignCheck"><label>' + FieldOneDetails.Name + '</label></div><div class="form-col-8 form-mb-col-12 editDblTextBox"><input autocomplete="off" id="ui_Field' + i + '" type="text" class="input-form-control txtBx"/><small id="uilblError' + i + '" class="frmvaliderr" style="display: none;">Please enter your ' + FieldOneDetails.Name.toLowerCase() + '</small></div></div></div>'
                    else if (plachoderisNeeded == 2)
                        FirstContent += '<div class="form-col-6 form-mb-col-12"><div class="frmeditrow positionRel parName"><div class="form-col-4 form-mb-col-12 labelStyle lblAlignCheck adCol-100"><label>' + FieldOneDetails.Name + '</label></div><div class="form-col-8 form-mb-col-12 editDblTextBox adCol-100"><input autocomplete="off" id="ui_Field' + i + '" type="text" class="input-form-control txtBx" /><small id="uilblError' + i + '" class="frmvaliderr" style="display: none;">Please enter your ' + FieldOneDetails.Name.toLowerCase() + '</small></div></div></div>'
                }
                else if (FieldOneDetails.FieldType == 4) {

                    var ClassName = "";

                    if (FieldOneDetails.CalendarDisplayType == 0)
                        ClassName = " calender";
                    else if (FieldOneDetails.CalendarDisplayType == 1)
                        ClassName = " calenderWithoutPastDates";
                    else if (FieldOneDetails.CalendarDisplayType == 2)
                        ClassName = " calenderWithoutFutureDates";

                    if (plachoderisNeeded == 1)
                        FirstContent += '<div class="form-col-6 form-mb-col-12"><div class="frmeditrow positionRel parName"><div id="ui_dvplaceholder' + i + '" class="form-col-4 form-mb-col-12 labelStyle adCol-100 lblAlignPlaceholder" style="display:flex;"><label>' + FieldOneDetails.Name + '</label></div><div class="form-col-8 form-mb-col-12 editDblTextBox adCol-100"><input autocomplete="off" id="ui_Field' + i + '" type="text" class="input-form-control txtBx ' + ClassName + '"/><small id="uilblError' + i + '" class="frmvaliderr" style="display: none;">Please enter your ' + FieldOneDetails.Name.toLowerCase() + '</small></div></div></div>'
                    else if (plachoderisNeeded == 0)
                        FirstContent += '<div class="form-col-6 form-mb-col-12"><div class="frmeditrow positionRel parName"><div class="form-col-4 form-mb-col-12 labelStyle lblAlignCheck"><label>' + FieldOneDetails.Name + '</label></div><div class="form-col-8 form-mb-col-12 editDblTextBox"><input autocomplete="off" id="ui_Field' + i + '" type="text" class="input-form-control txtBx ' + ClassName + '"/><small id="uilblError' + i + '" class="frmvaliderr" style="display: none;">Please enter your ' + FieldOneDetails.Name.toLowerCase() + '</small></div></div></div>'
                    else if (plachoderisNeeded == 2)
                        FirstContent += '<div class="form-col-6 form-mb-col-12"><div class="frmeditrow positionRel parName"><div class="form-col-4 form-mb-col-12 labelStyle lblAlignCheck adCol-100"><label>' + FieldOneDetails.Name + '</label></div><div class="form-col-8 form-mb-col-12 editDblTextBox adCol-100"><input autocomplete="off" id="ui_Field' + i + '" type="text" class="input-form-control txtBx ' + ClassName + '" /><small id="uilblError' + i + '" class="frmvaliderr" style="display: none;">Please enter your ' + FieldOneDetails.Name.toLowerCase() + '</small></div></div></div>'
                }
                else if (FieldOneDetails.FieldType == 7) {
                    if (plachoderisNeeded == 1)
                        FirstContent += '<div class="form-col-6 form-mb-col-12"><div class="frmeditrow positionRel parName"><div id="ui_dvplaceholder' + i + '" class="form-col-4 form-mb-col-12 labelStyle adCol-100 lblAlignPlaceholder" style="display:flex;"><label>' + FieldOneDetails.Name + '</label></div><div class="form-col-8 form-mb-col-12 editDblTextBox adCol-100"><textarea id="ui_Field' + i + '" class="input-form-control txtBx"></textarea><small id="uilblError' + i + '" class="frmvaliderr" style="display: none;">Please enter your ' + FieldOneDetails.Name.toLowerCase() + '</small></div></div></div>'
                    else if (plachoderisNeeded == 0)
                        FirstContent += '<div class="form-col-6 form-mb-col-12"><div class="frmeditrow positionRel parName"><div class="form-col-4 form-mb-col-12 labelStyle lblAlignCheck"><label>' + FieldOneDetails.Name + '</label></div><div class="form-col-8 form-mb-col-12 editDblTextBox"><textarea id="ui_Field' + i + '" class="input-form-control txtBx"></textarea><small id="uilblError' + i + '" class="frmvaliderr" style="display: none;">Please enter your ' + FieldOneDetails.Name.toLowerCase() + '</small></div></div></div>'
                    else if (plachoderisNeeded == 2)
                        FirstContent += '<div class="form-col-6 form-mb-col-12"><div class="frmeditrow positionRel parName"><div class="form-col-4 form-mb-col-12 labelStyle lblAlignCheck adCol-100"><label>' + FieldOneDetails.Name + '</label></div><div class="form-col-8 form-mb-col-12 editDblTextBox adCol-100"><textarea id="ui_Field' + i + '" class="input-form-control txtBx"></textarea><small id="uilblError' + i + '" class="frmvaliderr" style="display: none;">Please enter your ' + FieldOneDetails.Name.toLowerCase() + '</small></div></div></div>'
                }
                else if (FieldOneDetails.FieldType == 8) {

                    var options = "";

                    if (plachoderisNeeded != 1)
                        options = "<option value='0'>Select</option>";
                    else
                        options = "<option value='0'>Select " + FieldOneDetails.Name + "</option>";

                    if (FieldOneDetails.RelationField == 0) {
                        var subFieldList = FieldOneDetails.SubFields.split(",");
                        for (var j = 0; j < subFieldList.length; j++)
                            options += "<option value='" + subFieldList[j] + "'>" + subFieldList[j] + "</option>"
                    }

                    if (plachoderisNeeded == 1)
                        FirstContent += '<div class="form-col-6 form-mb-col-12"><div class="frmeditrow positionRel parName"><div id="ui_dvplaceholder' + i + '" class="form-col-4 form-mb-col-12 labelStyle adCol-100 lblAlignPlaceholder" style="display: none;"><label></label></div><div class="form-col-8 form-mb-col-12 editDblTextBox adCol-100"><select id="ui_Field' + i + '" class="input-form-control txtBx">' + options + '</select><small id="uilblError' + i + '" class="frmvaliderr" style="display: none;">Please enter your ' + FieldOneDetails.Name.toLowerCase() + '</small></div></div></div>'
                    else if (plachoderisNeeded == 0)
                        FirstContent += '<div class="form-col-6 form-mb-col-12"><div class="frmeditrow positionRel parName"><div class="form-col-4 form-mb-col-12 labelStyle" style="display: flex;"><label>' + FieldOneDetails.Name + '</label></div><div class="form-col-8 form-mb-col-12 editDblTextBox"><select id="ui_Field' + i + '" class="input-form-control txtBx">' + options + '</select><small id="uilblError' + i + '" class="frmvaliderr" style="display: none;">Please enter your ' + FieldOneDetails.Name.toLowerCase() + '</small></div></div></div>'
                    else if (plachoderisNeeded == 2)
                        FirstContent += '<div class="form-col-6 form-mb-col-12"><div class="frmeditrow positionRel parName"><div class="form-col-4 form-mb-col-12 labelStyle adCol-100" style="display: flex;"><label>' + FieldOneDetails.Name + '</label></div><div class="form-col-8 form-mb-col-12 editDblTextBox adCol-100"><select id="ui_Field' + i + '" class="input-form-control txtBx">' + options + '</select><small id="uilblError' + i + '" class="frmvaliderr" style="display: none;">Please enter your ' + FieldOneDetails.Name.toLowerCase() + '</small></div></div></div>'
                }
                else if (FieldOneDetails.FieldType == 9) {

                    var options = "";
                    var subFieldList = FieldOneDetails.SubFields.split(",");

                    var ClassName = "inline-check";
                    var placeholderClassName = "";

                    if (FieldOneDetails.FieldDisplay != undefined && FieldOneDetails.FieldDisplay != null && FieldOneDetails.FieldDisplay != "" && FieldOneDetails.FieldDisplay.length > 0) {
                        if (FieldOneDetails.FieldDisplay == "Vertical") {
                            ClassName = "";
                        }
                    }

                    for (var j = 0; j < subFieldList.length; j++)
                        options += "<div class='radio-container " + ClassName + "'><input type='radio' class='input-check checkId' id='ui_Field" + i + "_rad" + j + "' value='" + subFieldList[j] + "' name='ui_Field" + i + "'><label for='ui_Field" + i + "_rad" + j + "' class='label-check'>" + subFieldList[j] + "</label></div>";

                    if (plachoderisNeeded == 1 || plachoderisNeeded == 2) {
                        placeholderClassName = "adCol-100";
                    }

                    FirstContent += '<div class="form-col-6 form-mb-col-12"><div class="frmeditrow positionRel parName"><div class="form-col-4 form-mb-col-12 labelStyle ' + placeholderClassName + '"><label>' + FieldOneDetails.Name + '</label></div><div class="form-col-8 form-mb-col-12 editDblTextBox ' + placeholderClassName + '">' + options + '<small id="uilblError' + i + '" class="frmvaliderr" style="display: none;">Please enter your ' + FieldOneDetails.Name.toLowerCase() + '</small></div></div></div >'
                }
                else if (FieldOneDetails.FieldType == 10) {
                    var ClassName = "inline-check";
                    var placeholderClassName = "";

                    if (FieldOneDetails.FieldDisplay != undefined && FieldOneDetails.FieldDisplay != null && FieldOneDetails.FieldDisplay != "" && FieldOneDetails.FieldDisplay.length > 0) {
                        if (FieldOneDetails.FieldDisplay == "Vertical") {
                            ClassName = "";
                        }
                    }

                    if (plachoderisNeeded == 1 || plachoderisNeeded == 2) {
                        placeholderClassName = "adCol-100";
                    }

                    var options = "";
                    var subFieldList = FieldOneDetails.SubFields.split(",");
                    for (var j = 0; j < subFieldList.length; j++)
                        options += "<div class='check-container " + ClassName + "'><input type='checkbox' class='input-check checkId' name='ui_Field" + i + "' id='ui_Field" + i + "_chk" + j + "' value='" + subFieldList[j] + "'><label for='ui_Field" + i + "_chk" + j + "' class='label-check'>" + subFieldList[j] + "</label></div>"

                    FirstContent += '<div class="form-col-6 form-mb-col-12"><div class="frmeditrow positionRel parName"><div class="form-col-4 form-mb-col-12 labelStyle ' + placeholderClassName + '"><label>' + FieldOneDetails.Name + '</label></div><div class="form-col-8 form-mb-col-12 editDblTextBox ' + placeholderClassName + '">' + options + '<small id="uilblError' + i + '" class="frmvaliderr" style="display: none;">Please enter your ' + FieldOneDetails.Name.toLowerCase() + '</small></div></div></div>'
                }

                //this is for second content binding-----------------

                if (FieldTwoDetails.FieldType == 1 || FieldTwoDetails.FieldType == 2 || FieldTwoDetails.FieldType == 3 || FieldTwoDetails.FieldType == 5 || FieldTwoDetails.FieldType == 6 || FieldTwoDetails.FieldType == 21 || FieldTwoDetails.FieldType == 22 || FieldTwoDetails.FieldType == 23) {
                    if (plachoderisNeeded == 1)
                        SecondContent += '<div class="form-col-6 form-mb-col-12"><div class="frmeditrow parName"><div id="ui_dvplaceholder' + (i + 1) + '" class="form-col-4 form-mb-col-12 labelStyle adCol-100 lblAlignPlaceholder" style="display:flex;"><label>' + FieldTwoDetails.Name + '</label></div><div class="form-col-8 form-mb-col-12 editDblTextBox adCol-100"><input id="ui_Field' + (i + 1) + '" type="text" class="input-form-control txtBx"/><small id="uilblError' + (i + 1) + '" class="frmvaliderr" style="display: none;">Please enter your ' + FieldTwoDetails.Name.toLowerCase() + '</small></div></div></div>'
                    else if (plachoderisNeeded == 0)
                        SecondContent += '<div class="form-col-6 form-mb-col-12"><div class="frmeditrow parName"><div class="form-col-4 form-mb-col-12 labelStyle"><label>' + FieldTwoDetails.Name + '</label></div><div class="form-col-8 form-mb-col-12 editDblTextBox"><input id="ui_Field' + (i + 1) + '" type="text" class="input-form-control txtBx" /><small id="uilblError' + (i + 1) + '" class="frmvaliderr" style="display: none;">Please enter your ' + FieldTwoDetails.Name.toLowerCase() + '</small></div></div></div>'
                    else if (plachoderisNeeded == 2)
                        SecondContent += '<div class="form-col-6 form-mb-col-12"><div class="frmeditrow parName"><div class="form-col-4 form-mb-col-12 labelStyle adCol-100"><label>' + FieldTwoDetails.Name + '</label></div><div class="form-col-8 form-mb-col-12 editDblTextBox adCol-100"><input id="ui_Field' + (i + 1) + '" type="text" class="input-form-control txtBx" /><small id="uilblError' + (i + 1) + '" class="frmvaliderr" style="display: none;">Please enter your ' + FieldTwoDetails.Name.toLowerCase() + '</small></div></div></div>'
                }
                else if (FieldTwoDetails.FieldType == 4) {

                    var ClassName = "";

                    if (FieldOneDetails.CalendarDisplayType == 0)
                        ClassName = " calender";
                    else if (FieldOneDetails.CalendarDisplayType == 1)
                        ClassName = " calenderWithoutPastDates";
                    else if (FieldOneDetails.CalendarDisplayType == 2)
                        ClassName = " calenderWithoutFutureDates";


                    if (plachoderisNeeded == 1)
                        SecondContent += '<div class="form-col-6 form-mb-col-12"><div class="frmeditrow parName"><div id="ui_dvplaceholder' + (i + 1) + '" class="form-col-4 form-mb-col-12 labelStyle adCol-100 lblAlignPlaceholder" style="display:flex;"><label>' + FieldTwoDetails.Name + '</label></div><div class="form-col-8 form-mb-col-12 editDblTextBox adCol-100"><input id="ui_Field' + (i + 1) + '" type="text" class="input-form-control txtBx ' + ClassName + '"/><small id="uilblError' + (i + 1) + '" class="frmvaliderr" style="display: none;">Please enter your ' + FieldTwoDetails.Name.toLowerCase() + '</small></div></div></div>'
                    else if (plachoderisNeeded == 0)
                        SecondContent += '<div class="form-col-6 form-mb-col-12"><div class="frmeditrow parName"><div class="form-col-4 form-mb-col-12 labelStyle"><label>' + FieldTwoDetails.Name + '</label></div><div class="form-col-8 form-mb-col-12 editDblTextBox"><input id="ui_Field' + (i + 1) + '" type="text" class="input-form-control txtBx ' + ClassName + '" /><small id="uilblError' + (i + 1) + '" class="frmvaliderr" style="display: none;">Please enter your ' + FieldTwoDetails.Name.toLowerCase() + '</small></div></div></div>'
                    else if (plachoderisNeeded == 2)
                        SecondContent += '<div class="form-col-6 form-mb-col-12"><div class="frmeditrow parName"><div class="form-col-4 form-mb-col-12 labelStyle adCol-100"><label>' + FieldTwoDetails.Name + '</label></div><div class="form-col-8 form-mb-col-12 editDblTextBox adCol-100"><input id="ui_Field' + (i + 1) + '" type="text" class="input-form-control txtBx ' + ClassName + '" /><small id="uilblError' + (i + 1) + '" class="frmvaliderr" style="display: none;">Please enter your ' + FieldTwoDetails.Name.toLowerCase() + '</small></div></div></div>'
                }
                else if (FieldTwoDetails.FieldType == 7) {
                    if (plachoderisNeeded == 1)
                        SecondContent += '<div class="form-col-6 form-mb-col-12"><div class="frmeditrow parName"><div id="ui_dvplaceholder' + (i + 1) + '" class="form-col-4 form-mb-col-12 labelStyle adCol-100 lblAlignPlaceholder" style="display:flex;"><label>' + FieldTwoDetails.Name + '</label></div><div class="form-col-8 form-mb-col-12 editDblTextBox adCol-100"><textarea id="ui_Field' + (i + 1) + '" class="input-form-control txtBx"></textarea><small id="uilblError' + (i + 1) + '" class="frmvaliderr" style="display: none;">Please enter your ' + FieldTwoDetails.Name.toLowerCase() + '</small></div></div></div>'
                    else if (plachoderisNeeded == 0)
                        SecondContent += '<div class="form-col-6 form-mb-col-12"><div class="frmeditrow parName"><div class="form-col-4 form-mb-col-12 labelStyle"><label>' + FieldTwoDetails.Name + '</label></div><div class="form-col-8 form-mb-col-12 editDblTextBox"><textarea id="ui_Field' + (i + 1) + '" class="input-form-control txtBx"></textarea><small id="uilblError' + (i + 1) + '" class="frmvaliderr" style="display: none;">Please enter your ' + FieldTwoDetails.Name.toLowerCase() + '</small></div></div></div>'
                    else if (plachoderisNeeded == 2)
                        SecondContent += '<div class="form-col-6 form-mb-col-12"><div class="frmeditrow parName"><div class="form-col-4 form-mb-col-12 labelStyle adCol-100"><label>' + FieldTwoDetails.Name + '</label></div><div class="form-col-8 form-mb-col-12 editDblTextBox adCol-100"><textarea id="ui_Field' + (i + 1) + '" class="input-form-control txtBx"></textarea><small id="uilblError' + (i + 1) + '" class="frmvaliderr" style="display: none;">Please enter your ' + FieldTwoDetails.Name.toLowerCase() + '</small></div></div></div>'
                }
                else if (FieldTwoDetails.FieldType == 8) {

                    var options = "";

                    if (plachoderisNeeded != 1)
                        options = "<option value='0'>Select</option>";
                    else
                        options = "<option value='0'>Select " + FieldTwoDetails.Name + "</option>";

                    if (FieldTwoDetails.RelationField == 0) {
                        var subFieldList = FieldTwoDetails.SubFields.split(",");
                        for (var j = 0; j < subFieldList.length; j++)
                            options += "<option value='" + subFieldList[j] + "'>" + subFieldList[j] + "</option>"
                    }

                    if (plachoderisNeeded == 1)
                        SecondContent += '<div class="form-col-6 form-mb-col-12"><div class="frmeditrow parName"><div id="ui_dvplaceholder' + (i + 1) + '" class="form-col-4 form-mb-col-12 labelStyle adCol-100 lblAlignPlaceholder" style="display: none;"><label></label></div><div class="form-col-8 form-mb-col-12 editDblTextBox adCol-100"><select id="ui_Field' + (i + 1) + '" class="input-form-control txtBx">' + options + '</select><small id="uilblError' + (i + 1) + '" class="frmvaliderr" style="display: none;">Please enter your ' + FieldTwoDetails.Name.toLowerCase() + '</small></div></div></div>'
                    else if (plachoderisNeeded == 0)
                        SecondContent += '<div class="form-col-6 form-mb-col-12"><div class="frmeditrow parName"><div class="form-col-4 form-mb-col-12 labelStyle" style="display: flex;"><label style="display: block;">' + FieldTwoDetails.Name + '</label></div><div class="form-col-8 form-mb-col-12 editDblTextBox"><select id="ui_Field' + (i + 1) + '" class="input-form-control txtBx">' + options + '</select><small id="uilblError' + (i + 1) + '" class="frmvaliderr" style="display: none;">Please enter your ' + FieldTwoDetails.Name.toLowerCase() + '</small></div></div></div>'
                    else if (plachoderisNeeded == 2)
                        SecondContent += '<div class="form-col-6 form-mb-col-12"><div class="frmeditrow parName"><div class="form-col-4 form-mb-col-12 labelStyle adCol-100" style="display: flex;"><label style="display: block;">' + FieldTwoDetails.Name + '</label></div><div class="form-col-8 form-mb-col-12 editDblTextBox adCol-100"><select id="ui_Field' + (i + 1) + '" class="input-form-control txtBx">' + options + '</select><small id="uilblError' + (i + 1) + '" class="frmvaliderr" style="display: none;">Please enter your ' + FieldTwoDetails.Name.toLowerCase() + '</small></div></div></div>'
                }
                else if (FieldTwoDetails.FieldType == 9) {

                    var options = "";
                    var subFieldList = FieldTwoDetails.SubFields.split(",");

                    var ClassName = "inline-check";
                    var placeholderClassName = "";

                    if (FieldTwoDetails.FieldDisplay != undefined && FieldTwoDetails.FieldDisplay != null && FieldTwoDetails.FieldDisplay != "" && FieldTwoDetails.FieldDisplay.length > 0) {
                        if (FieldTwoDetails.FieldDisplay == "Vertical") {
                            ClassName = "";
                        }
                    }

                    for (var j = 0; j < subFieldList.length; j++)
                        options += "<div class='radio-container " + ClassName + "'><input type='radio' class='input-check checkId' id='ui_Field" + (i + 1) + "_rad" + j + "' value='" + subFieldList[j] + "' name='ui_Field" + (i + 1) + "'><label for='ui_Field" + (i + 1) + "_rad" + j + "' class='label-check'>" + subFieldList[j] + "</label></div>";

                    if (plachoderisNeeded == 1 || plachoderisNeeded == 2) {
                        placeholderClassName = "adCol-100";
                    }

                    SecondContent += '<div class="form-col-6 form-mb-col-12"><div class="frmeditrow parName"><div class="form-col-4 form-mb-col-12 labelStyle ' + placeholderClassName + '"><label>' + FieldTwoDetails.Name + '</label></div><div class="form-col-8 form-mb-col-12 editDblTextBox ' + placeholderClassName + '">' + options + '<small id="uilblError' + (i + 1) + '" class="frmvaliderr" style="display: none;">Please enter your ' + FieldTwoDetails.Name.toLowerCase() + '</small></div></div></div>'
                }
                else if (FieldTwoDetails.FieldType == 10) {
                    var ClassName = "inline-check";
                    var placeholderClassName = "";

                    if (FieldTwoDetails.FieldDisplay != undefined && FieldTwoDetails.FieldDisplay != null && FieldTwoDetails.FieldDisplay != "" && FieldTwoDetails.FieldDisplay.length > 0) {
                        if (FieldTwoDetails.FieldDisplay == "Vertical") {
                            ClassName = "";
                        }
                    }

                    if (plachoderisNeeded == 1 || plachoderisNeeded == 2) {
                        placeholderClassName = "adCol-100";
                    }

                    var options = "";
                    var subFieldList = FieldTwoDetails.SubFields.split(",");
                    for (var j = 0; j < subFieldList.length; j++)
                        options += "<div class='check-container " + ClassName + "'><input type='checkbox' class='input-check checkId' name='ui_Field" + (i + 1) + "' id='ui_Field" + (i + 1) + "_chk" + j + "' value='" + subFieldList[j] + "'><label for='ui_Field" + (i + 1) + "_chk" + j + "' class='label-check'>" + subFieldList[j] + "</label></div>"

                    SecondContent += '<div class="form-col-6 form-mb-col-12"><div class="frmeditrow parName"><div class="form-col-4 form-mb-col-12 labelStyle ' + placeholderClassName + '"><label>' + FieldTwoDetails.Name + '</label></div><div class="form-col-8 form-mb-col-12 editDblTextBox ' + placeholderClassName + '">' + options + '<small id="uilblError' + (i + 1) + '" class="frmvaliderr" style="display: none;">Please enter your ' + FieldTwoDetails.Name.toLowerCase() + '</small></div></div></div>'
                }

                rowContent += '<div class="frmeditrow del doubleWrap positionRel padTopBot">' + FirstContent + '' + SecondContent + '</div>'
                i = i + 1;
            }
        }

        if (formDesign.ThankYouMessage != null && formDesign.ThankYouMessage.length > 0)
            rowContent += "<div id='lbldivthankyou_" + formDesign.Id + "' class='frmthankwrp' style='display:none'><div class='succwrp'><p id='ui_lblThankYouSuccErrIcon_" + formDesign.Id + "'><i class='icon ion-ios-checkmark-outline'></i></p><p id='ui_lblThankYou_" + formDesign.Id + "'>" + formDesign.ThankYouMessage + "</p></div></div>";
        else
            rowContent += "<div id='lbldivthankyou_" + formDesign.Id + "' class='frmthankwrp' style='display:none'><div class='succwrp'><p id='ui_lblThankYouSuccErrIcon_" + formDesign.Id + "'><i class='icon ion-ios-checkmark-outline'></i></p><p id='ui_lblThankYou_" + formDesign.Id + "'>Thank you for showing interest with us.</p></div></div>";

        //tableContent = "<form id='appendFields' method='post' enctype='multipart/form-data'>" + rowContent + " </form>";

        var imagealignmentclassname = "";
        if (formDesign.ImageAppearanceAlignment != null && formDesign.ImageAppearanceAlignment != "" && formDesign.ImageAppearanceAlignment.length > 0) {
            if (formDesign.ImageAppearanceAlignment == "top") {
                imagealignmentclassname = "";
            }
            else if (formDesign.ImageAppearanceAlignment == "left") {
                imagealignmentclassname = "formlayoutRow";
            }
            else if (formDesign.ImageAppearanceAlignment == "right") {
                imagealignmentclassname = "formlayoutRowrevrse";
            }
            else if (formDesign.ImageAppearanceAlignment == "bottom") {
                imagealignmentclassname = "formlayoutColrevrse";
            }
            else if (formDesign.ImageAppearanceAlignment == "leftbgimg") {
                imagealignmentclassname = "lftrghtewid";

                if (innerDoc != undefined) {
                    innerDoc.getElementById("dvMainContentDiv").className += " df-jc-fstart";
                }
            }
            else if (formDesign.ImageAppearanceAlignment == "rightbgimg") {
                imagealignmentclassname = "lftrghtewid";

                if (innerDoc != undefined) {
                    innerDoc.getElementById("dvMainContentDiv").className += " df-jc-fend";
                }
            }
        }

        var div = FormUtil.getDiv("");

        if (imagealignmentclassname != "lftrghtewid") {
            div.style.width = "100%";
        }

        div.className = "frmlayoutwrap " + imagealignmentclassname + "";
        rowContent = "<div class='frmfeildwrap'>" + rowContent + "</div>";
        div.innerHTML = imagerowcontent + rowContent;

        var IframeElement = document.getElementById(iframeid);
        var innerDoc = IframeElement.contentDocument || IframeElement.contentWindow.document;

        if (innerDoc != undefined && innerDoc.getElementById("dvMainContentDiv")) {
            innerDoc.getElementById("dvMainContentDiv").appendChild(div);
        }
        else {
            var mainContentDiv = FormUtil.getDiv("dvMainContentDiv", "simpleForm");
            IframeElement.contentWindow.document.body.appendChild(mainContentDiv);
            innerDoc.getElementById("dvMainContentDiv").appendChild(div);
        }

        setTimeout(function () { document.getElementById(iframeid).contentWindow.intializeCalender(); }, 2000);

        if (innerDoc != undefined) {
            var alldivs = innerDoc.querySelectorAll(".lblAlignPlaceholder");
            var allinputs = innerDoc.querySelectorAll(".input-form-control");

            if (alldivs != null && alldivs.length > 0) {
                for (index = 0; index < alldivs.length; ++index) {
                    innerDoc.querySelector("#" + alldivs[index].id + "", parent.window.document).addEventListener("click", function (event) {
                        FormUtil.hideoption(iframeid, event.currentTarget.id, event.currentTarget.nextSibling.firstChild.id);
                    });
                }
            }


            if (allinputs != null && allinputs.length > 0) {
                for (index = 0; index < allinputs.length; ++index) {

                    innerDoc.querySelector("#" + allinputs[index].id + "", parent.window.document).addEventListener("blur", function (event) {
                        FormUtil.myBlurFunction(iframeid, event.currentTarget.id);
                    });

                    innerDoc.querySelector("#" + allinputs[index].id + "", parent.window.document).addEventListener("focus", function (event) {
                        FormUtil.myFocusFunction(iframeid, event.currentTarget.id);
                    });
                }
            }
        }
    },
    hideoption: function (iframeid, divid, fieldid) {
        var IframeElement = document.getElementById(iframeid);
        var innerDoc = IframeElement.contentDocument || IframeElement.contentWindow.document;

        if (innerDoc != undefined) {
            innerDoc.getElementById(divid).style.display = 'none';
            innerDoc.getElementById(fieldid).focus();
        }
    },
    myBlurFunction: function (iframeid, divid) {
        var IframeElement = document.getElementById(iframeid);
        var innerDoc = IframeElement.contentDocument || IframeElement.contentWindow.document;

        if (innerDoc != undefined && innerDoc.getElementById(divid).value == "") {
            var dvvalue = divid.substring(8);

            if (innerDoc.getElementById("ui_dvplaceholder" + dvvalue + "") != null) {
                innerDoc.getElementById("ui_dvplaceholder" + dvvalue + "").style.display = 'flex';
            }
        }
    },
    myFocusFunction: function (iframeid, divid) {

        var IframeElement = document.getElementById(iframeid);
        var innerDoc = IframeElement.contentDocument || IframeElement.contentWindow.document;

        if (innerDoc != undefined && innerDoc.getElementById(divid).value == "") {
            var dvvalue = divid.substring(8);

            if (innerDoc.getElementById("ui_dvplaceholder" + dvvalue + "") != null) {
                innerDoc.getElementById("ui_dvplaceholder" + dvvalue + "").style.display = 'none';
            }
        }
    },
    intializeCalender: function () {
        try {
            document.getElementsByClassName("calender").datepicker({
                showOtherMonths: true,
                selectOtherMonths: true,
                dateFormat: "dd-mm-yy",
                beforeShow: function () {
                    document.getElementsByClassName("ui-datepicker").css('font-size', 10)
                }
            });
        }
        catch (Err) { }
    },
    intializeCalenderWithoutPastDates: function () {
        try {
            document.getElementsByClassName("calenderWithoutPastDates").datepicker({
                showOtherMonths: true,
                selectOtherMonths: true,
                dateFormat: "dd-mm-yy",
                minDate: 0,
                beforeShow: function () {
                    document.getElementsByClassName("ui-datepicker").css('font-size', 10)
                }
            });
        }
        catch (Err) { }
    },
    intializeCalenderWithoutFutureDates: function () {
        try {
            document.getElementsByClassName("calenderWithoutFutureDates").datepicker({
                showOtherMonths: true,
                selectOtherMonths: true,
                dateFormat: "dd-mm-yy",
                maxDate: 0,
                beforeShow: function () {
                    document.getElementsByClassName("ui-datepicker").css('font-size', 10)
                }
            });
        }
        catch (Err) { }
    },
    resizeTextArea: function (iframeid) {

        var IframeElement = document.getElementById(iframeid);
        var innerDoc = IframeElement.contentDocument || IframeElement.contentWindow.document;

        if (innerDoc != undefined) {
            innerDoc.getElementsByTagName("textarea").css({ height: innerDoc.getElementsByTagName("textarea").height + 15 });
        }
    },
    submitButton: function (tagId, iframeid, FormType, SubmitButtonValue, ButtonPxOrPer) {
        for (var a = 0; a < formFields.length; a++) {
            if (formFields[a].FieldType == 23) {
                IsOTPForm = 1;
                break;
            }
        }

        var BtnWidthClassName = "";

        if (ButtonPxOrPer)
            BtnWidthClassName = "btn-100";

        if (IsOTPForm == 1)
            return "<button type='submit' class='btn-style savebtn " + BtnWidthClassName + "' id='" + tagId + "' onclick=\"parent.SaveOTPFormDetails('" + iframeid + "'," + FormType + ");\">" + SubmitButtonValue + "</button>";
        else
            return "<button type='submit' class='btn-style savebtn " + BtnWidthClassName + "' id='" + tagId + "' onclick=\"parent.SaveDetails('" + iframeid + "'," + FormType + ");\">" + SubmitButtonValue + "</button>";
    },
    BindFormDesignStyle: function (IframeId) {

        var IframeElement = document.getElementById(IframeId);
        var innerDoc = IframeElement.contentDocument || IframeElement.contentWindow.document;

        if (innerDoc != undefined) {
            if (formBasicDetails.MainBackgroundDesign != null && formBasicDetails.MainBackgroundDesign.length > 0) {
                if (innerDoc.getElementById('ui_MainBodyDesignCss') != undefined) {
                    innerDoc.getElementById('ui_MainBodyDesignCss').remove();
                }

                style = document.createElement('STYLE');
                style.type = 'text/css';
                style.id = "ui_MainBodyDesignCss";
                style.appendChild(document.createTextNode(".simpleForm {" + formBasicDetails.MainBackgroundDesign + "}"));
                IframeElement.contentDocument.head.appendChild(style);
            }

            if (formBasicDetails.TitleCss != null && formBasicDetails.TitleCss.length > 0) {
                if (innerDoc.getElementById('ui_TitleCss') != undefined) {
                    innerDoc.getElementById('ui_TitleCss').remove();
                }

                style = document.createElement('STYLE');
                style.type = 'text/css';
                style.id = "ui_TitleCss";
                style.appendChild(document.createTextNode(".headTitOne {" + formBasicDetails.TitleCss + "}"));
                IframeElement.contentDocument.head.appendChild(style);
            }

            if (formBasicDetails.DescriptionCss != null && formBasicDetails.DescriptionCss.length > 0) {

                var descriptionDesignData = formBasicDetails.DescriptionCss.split("@$@");

                var descriptionDesignDataFirstCss = descriptionDesignData[0];
                var descriptionDesignDataSecondCss = descriptionDesignData[1];

                if (innerDoc.getElementById('ui_formDescripTxt') != undefined) {
                    innerDoc.getElementById('ui_formDescripTxt').remove();
                }

                style = document.createElement('STYLE');
                style.type = 'text/css';
                style.id = "ui_formDescripTxt";
                style.appendChild(document.createTextNode(".formDescripTxt {" + descriptionDesignDataFirstCss + "}"));
                IframeElement.contentDocument.head.appendChild(style);

                if (innerDoc.getElementById('ui_formDescript') != undefined) {
                    innerDoc.getElementById('ui_formDescript').remove();
                }

                style = document.createElement('STYLE');
                style.type = 'text/css';
                style.id = "ui_formDescript";
                style.appendChild(document.createTextNode(".formDescriptwrp {" + descriptionDesignDataSecondCss + "}"));
                IframeElement.contentDocument.head.appendChild(style);
            }

            if (formBasicDetails.TextboxDropCss != null && formBasicDetails.TextboxDropCss.length > 0) {

                if (innerDoc.getElementById('ui_TextboxDropCss') != undefined) {
                    innerDoc.getElementById('ui_TextboxDropCss').remove();
                }

                style = document.createElement('STYLE');
                style.type = 'text/css';
                style.id = "ui_TextboxDropCss";
                style.appendChild(document.createTextNode(".input-form-control {" + formBasicDetails.TextboxDropCss + "}"));
                IframeElement.contentDocument.head.appendChild(style);
            }

            if (formBasicDetails.LabelCss != null && formBasicDetails.LabelCss.length > 0) {

                var labelDesignData = formBasicDetails.LabelCss.split("@$@");

                var labelDesignDataFirstCss = labelDesignData[0];
                var labelDesignDataSecondCss = labelDesignData[1];
                var labelDesignDataThirdCss = labelDesignData[2];
                var labelDesignDataFourthCss = labelDesignData[3];

                if (innerDoc.getElementById('ui_labelCssWrp') != undefined) {
                    innerDoc.getElementById('ui_labelCssWrp').remove()
                }

                style = document.createElement('STYLE');
                style.type = 'text/css';
                style.id = "ui_labelCssWrp";
                style.appendChild(document.createTextNode(".labelStyle, .labelWrap, .labelWrapradio, .labelWrapcheck {" + labelDesignDataFirstCss + "}"));
                IframeElement.contentDocument.head.appendChild(style);

                if (innerDoc.getElementById('ui_labelStyleCss') != undefined) {
                    innerDoc.getElementById('ui_labelStyleCss').remove()
                }

                style = document.createElement('STYLE');
                style.type = 'text/css';
                style.id = "ui_labelStyleCss";
                style.appendChild(document.createTextNode(".labelStyle {" + labelDesignDataSecondCss + "}"));
                IframeElement.contentDocument.head.appendChild(style);

                if (labelDesignDataThirdCss != null && labelDesignDataThirdCss != "" && labelDesignDataThirdCss.length > 0) {
                    if (innerDoc.getElementById('ui_labelStyleRadioFontCss') != undefined) {
                        innerDoc.getElementById('ui_labelStyleRadioFontCss').remove()
                    }

                    style = document.createElement('STYLE');
                    style.type = 'text/css';
                    style.id = "ui_labelStyleRadioFontCss";
                    style.appendChild(document.createTextNode(".simpleForm .labelWrapradio {" + labelDesignDataThirdCss + "}"));
                    IframeElement.contentDocument.head.appendChild(style);
                }

                if (labelDesignDataFourthCss != null && labelDesignDataFourthCss != "" && labelDesignDataFourthCss.length > 0) {
                    if (innerDoc.getElementById('ui_labelStyleCheckBoxFontCss') != undefined) {
                        innerDoc.getElementById('ui_labelStyleCheckBoxFontCss').remove()
                    }

                    style = document.createElement('STYLE');
                    style.type = 'text/css';
                    style.id = "ui_labelStyleCheckBoxFontCss";
                    style.appendChild(document.createTextNode(".simpleForm .labelWrapcheck {" + labelDesignDataFourthCss + "}"));
                    IframeElement.contentDocument.head.appendChild(style);
                }
            }

            if (formBasicDetails.CloseCss != null && formBasicDetails.CloseCss.length > 0) {

                var closeDesignData = formBasicDetails.CloseCss.split("@$@");

                var closeDesignDataFirstCss = closeDesignData[0];
                var closeDesignDataSecondCss = closeDesignData[1];
                var closeDesignDataThirdCss = closeDesignData[2];

                if (innerDoc.getElementById('ui_CloseCssWrp') != undefined) {
                    innerDoc.getElementById('ui_CloseCssWrp').remove()
                }

                style = document.createElement('STYLE');
                style.type = 'text/css';
                style.id = "ui_CloseCssWrp";
                style.appendChild(document.createTextNode(".clsWrap {" + closeDesignDataFirstCss + "}"));
                IframeElement.contentDocument.head.appendChild(style);


                if (innerDoc.getElementById('ui_CloseStyleAlignCss') != undefined) {
                    innerDoc.getElementById('ui_CloseStyleAlignCss').remove()
                }

                style = document.createElement('STYLE');
                style.type = 'text/css';
                style.id = "ui_CloseStyleAlignCss";
                style.appendChild(document.createTextNode(".clsleftalign {" + closeDesignDataSecondCss + "}"));
                IframeElement.contentDocument.head.appendChild(style);

                if (innerDoc.getElementById('ui_CloseMinimiseWrpCss') != undefined) {
                    innerDoc.getElementById('ui_CloseMinimiseWrpCss').remove()
                }

                style = document.createElement('STYLE');
                style.type = 'text/css';
                style.id = "ui_CloseMinimiseWrpCss";
                style.appendChild(document.createTextNode(".clsminimsewrp {" + closeDesignDataThirdCss + "}"));
                IframeElement.contentDocument.head.appendChild(style);
            }

            if (formBasicDetails.IsMinimiseButton == 1 && formBasicDetails.MinimiseCss != null && formBasicDetails.MinimiseCss.length > 0) {

                var minimiseDesignData = formBasicDetails.MinimiseCss;

                if (innerDoc.getElementById('ui_MinimiseCssWrp') != undefined) {
                    innerDoc.getElementById('ui_MinimiseCssWrp').remove()
                }

                style = document.createElement('STYLE');
                style.type = 'text/css';
                style.id = "ui_MinimiseCssWrp";
                style.appendChild(document.createTextNode(".minimsebtnwrp {" + minimiseDesignData + "}"));
                IframeElement.contentDocument.head.appendChild(style);
            }

            if (formBasicDetails.ButtonCss != null && formBasicDetails.ButtonCss.length > 0) {

                var buttonDesignData = formBasicDetails.ButtonCss.split("@$@");

                var buttonDesignDataFirstCss = buttonDesignData[0];
                var buttonDesignDataSecondCss = buttonDesignData[1];
                var buttonDesignDataThirdCss = buttonDesignData[2];
                var buttonDesignDataFourthCss = buttonDesignData[3];

                if (innerDoc.getElementById('ui_parSubBtn') != undefined) {
                    innerDoc.getElementById('ui_parSubBtn').remove()
                }

                style = document.createElement('STYLE');
                style.type = 'text/css';
                style.id = "ui_parSubBtn";
                style.appendChild(document.createTextNode(".parSubBtn {" + buttonDesignDataFirstCss + "}"));
                IframeElement.contentDocument.head.appendChild(style);


                if (innerDoc.getElementById('ui_childSubBtn') != undefined) {
                    innerDoc.getElementById('ui_childSubBtn').remove()
                }

                style = document.createElement('STYLE');
                style.type = 'text/css';
                style.id = "ui_childSubBtn";
                style.appendChild(document.createTextNode(".childSubBtn {" + buttonDesignDataSecondCss + "}"));
                IframeElement.contentDocument.head.appendChild(style);

                if (innerDoc.getElementById('ui_btnstyle') != undefined) {
                    innerDoc.getElementById('ui_btnstyle').remove()
                }

                style = document.createElement('STYLE');
                style.type = 'text/css';
                style.id = "ui_btnstyle";
                style.appendChild(document.createTextNode(".btn-style {" + buttonDesignDataThirdCss + "}"));
                IframeElement.contentDocument.head.appendChild(style);

                if (innerDoc.getElementById('ui_btnstyleHover') != undefined) {
                    innerDoc.getElementById('ui_btnstyleHover').remove()
                }

                style = document.createElement('STYLE');
                style.type = 'text/css';
                style.id = "ui_btnstyleHover";
                style.appendChild(document.createTextNode(".btn-style:hover {" + buttonDesignDataFourthCss + "}"));
                IframeElement.contentDocument.head.appendChild(style);
            }

            if (formBasicDetails.PlaceHolderClass != null && formBasicDetails.PlaceHolderClass.length > 0) {
                if (innerDoc.getElementById('ui_PlaceholderClass') != undefined) {
                    innerDoc.getElementById('ui_PlaceholderClass').remove()
                }

                style = document.createElement('STYLE');
                style.type = 'text/css';
                style.id = "ui_PlaceholderClass";
                style.appendChild(document.createTextNode(formDesign.PlaceHolderClass));
                IframeElement.contentDocument.head.appendChild(style);
            }

            if (formBasicDetails.GeneralCss != null && formBasicDetails.GeneralCss.length > 0) {
                if (innerDoc.getElementById('ui_GeneralCssClass') != undefined) {
                    innerDoc.getElementById('ui_GeneralCssClass').remove()
                }

                style = document.createElement('STYLE');
                style.type = 'text/css';
                style.id = "ui_GeneralCssClass";
                style.appendChild(document.createTextNode(formBasicDetails.GeneralCss));
                IframeElement.contentDocument.head.appendChild(style);
            }

            if (formBasicDetails.BannerImageDesignCss != null && formBasicDetails.BannerImageDesignCss.length > 0) {
                if (innerDoc.getElementById('ui_BannerImageDesignCss') != undefined) {
                    innerDoc.getElementById('ui_BannerImageDesignCss').remove();
                }

                style = document.createElement('STYLE');
                style.type = 'text/css';
                style.id = "ui_BannerImageDesignCss";
                style.appendChild(document.createTextNode(".bgAppend {" + formBasicDetails.BannerImageDesignCss + "}"));
                IframeElement.contentDocument.head.appendChild(style);
            }

            if (formBasicDetails.RadioCheckBoxFieldsCss != null && formBasicDetails.RadioCheckBoxFieldsCss.length > 0) {

                var RadioCheckBoxDesignData = formBasicDetails.RadioCheckBoxFieldsCss.split("@$@");

                var RadioCheckBoxDesignDataFirstCss = RadioCheckBoxDesignData[0];
                var RadioCheckBoxDesignDataSecondCss = RadioCheckBoxDesignData[1];

                if (innerDoc.getElementById('ui_labelRadioCheckBox') != undefined) {
                    innerDoc.getElementById('ui_labelRadioCheckBox').remove()
                }

                style = document.createElement('STYLE');
                style.type = 'text/css';
                style.id = "ui_labelRadioCheckBox";
                style.appendChild(document.createTextNode(".simpleForm .label-check {" + RadioCheckBoxDesignDataFirstCss + "}"));
                IframeElement.contentDocument.head.appendChild(style);

                if (innerDoc.getElementById('ui_labelRadioCheckBoxFieldCss') != undefined) {
                    innerDoc.getElementById('ui_labelRadioCheckBoxFieldCss').remove()
                }

                style = document.createElement('STYLE');
                style.type = 'text/css';
                style.id = "ui_labelRadioCheckBoxFieldCss";
                style.appendChild(document.createTextNode(".simpleForm .check-container .input-check, .simpleForm .radio-container .input-check {" + RadioCheckBoxDesignDataSecondCss + "}"));
                IframeElement.contentDocument.head.appendChild(style);
            }
        }

        if (formBasicDetails.GeneralParentCss != null && formBasicDetails.GeneralParentCss.length > 0) {
            if (document.getElementById('ui_GeneralMediaCssClass') != undefined) {
                document.getElementById('ui_GeneralMediaCssClass').remove()
            }

            style = document.createElement('STYLE');
            style.type = 'text/css';
            style.id = "ui_GeneralMediaCssClass";
            style.appendChild(document.createTextNode(formDesign.GeneralParentCss));
            document.head.appendChild(style);
        }
    },
    appearaceSettingOfForm: function (IframeId) {

        var IframeElement = document.getElementById(IframeId);
        var innerDoc = IframeElement.contentDocument || IframeElement.contentWindow.document;

        if (AllFormDetails != null && AllFormDetails.length > 0 && IframeId != null) {
            var FormId = IframeId.split("_")[1];

            for (var j = 0; j < AllFormDetails.length; j++) {
                if (AllFormDetails[j].formDetails.Id == FormId) {
                    formDesign = AllFormDetails[j].formDetails;
                }
            }
        }

        if (innerDoc != undefined) {
            if (formDesign != null && formDesign.CloseCss != null && formDesign.CloseCss.length > 0 && (formDesign.EmbeddedFormOrPopUpFormOrTaggedForm == "PopUpForm" || formDesign.EmbeddedFormOrPopUpFormOrTaggedForm == "EmbeddedForm")) {
                FormUtil.appendCloseButton(IframeId);
            }
        }
    },
    appendCloseButton: function (IframeId) {

        var IframeElement = document.getElementById(IframeId);
        var innerDoc = IframeElement.contentDocument || IframeElement.contentWindow.document;

        if (AllFormDetails != null && AllFormDetails.length > 0 && IframeId != null) {
            var FormId = IframeId.split("_")[1];

            for (var j = 0; j < AllFormDetails.length; j++) {
                if (AllFormDetails[j].formDetails.Id == FormId) {
                    formDesign = AllFormDetails[j].formDetails;
                }
            }
        }

        if (innerDoc != undefined) {

            var closeMinimiseMainDiv = document.createElement("div", "");
            closeMinimiseMainDiv.className = "clsminimsewrp showflex";

            if (formDesign != null && formDesign.CloseAlignmentSetting != null && formDesign.CloseAlignmentSetting != "" && formDesign.CloseAlignmentSetting == "clsleft") {
                closeMinimiseMainDiv.className = "clsminimsewrp clsleftalign showflex";
            }

            //Minimise button

            if (formDesign != null && formDesign.IsMinimiseButton == 1 && formDesign.MinimiseCss != "" && formDesign.MinimiseCss != null && formDesign.MinimiseCss.length > 0) {
                var minimiseButtonDiv = document.createElement("div", "");

                var minimiseclassname = "minimsebtnwrp";

                if (formDesign != null && formDesign.CloseDesignType != null && formDesign.CloseDesignType != "" && formDesign.CloseDesignType == "round") {
                    minimiseclassname = "minimsebtnwrp clsRound";
                }

                if (formDesign != null && formDesign.CloseAlignmentSetting != null && formDesign.CloseAlignmentSetting != "" && formDesign.CloseAlignmentSetting == "clsleft") {
                    if (formDesign != null && formDesign.CloseDesignType != null && formDesign.CloseDesignType != "" && formDesign.CloseDesignType == "round") {
                        minimiseclassname = "minimsebtnwrp clsRound";
                    }
                    else if (formDesign != null && formDesign.CloseDesignType != null && formDesign.CloseDesignType != "" && formDesign.CloseDesignType == "square") {
                        minimiseclassname = "minimsebtnwrp";
                    }
                }

                minimiseButtonDiv.className = minimiseclassname;
                minimiseButtonDiv.title = "Minimise";
                minimiseButtonDiv.style.cursor = "pointer";
                minimiseButtonDiv.innerHTML = "<i class='fas fa-minus' id='btnplusminus'></i>";
                minimiseButtonDiv.onclick = function () { FormUtil.minimiseCaptureFormDiv(IframeId); };
                closeMinimiseMainDiv.appendChild(minimiseButtonDiv);
            }

            var closeButtonDiv = document.createElement("div", "");

            var classname = "clsWrap";

            if (formDesign != null && formDesign.CloseDesignType != null && formDesign.CloseDesignType != "" && formDesign.CloseDesignType == "round") {
                classname = "clsWrap clsRound";
            }

            if (formDesign != null && formDesign.CloseAlignmentSetting != null && formDesign.CloseAlignmentSetting != "" && formDesign.CloseAlignmentSetting == "clsleft") {
                if (formDesign != null && formDesign.CloseDesignType != null && formDesign.CloseDesignType != "" && formDesign.CloseDesignType == "round") {
                    classname = "clsWrap clsRound";
                }
                else if (formDesign != null && formDesign.CloseDesignType != null && formDesign.CloseDesignType != "" && formDesign.CloseDesignType == "square") {
                    classname = "clsWrap";
                }
            }

            closeButtonDiv.className = classname;
            closeButtonDiv.title = "Close";
            closeButtonDiv.style.cursor = "pointer";
            closeButtonDiv.innerHTML = "<i class='fas fa-times'></i>";
            closeButtonDiv.id = "dvCloseBtn";
            closeButtonDiv.onclick = function () { FormUtil.removeCaptureFormDiv(IframeId); };
            closeMinimiseMainDiv.appendChild(closeButtonDiv);
            //innerDoc.getElementById("dvMainContentDiv").appendChild(closeMinimiseMainDiv);

            if (innerDoc != undefined && innerDoc.getElementById("dvMainContentDiv")) {
                innerDoc.getElementById("dvMainContentDiv").appendChild(closeMinimiseMainDiv);
            }
            else {
                var mainContentDiv = FormUtil.getDiv("dvMainContentDiv", "simpleForm");
                IframeElement.contentWindow.document.body.appendChild(mainContentDiv);
                innerDoc.getElementById("dvMainContentDiv").appendChild(closeMinimiseMainDiv);
            }
        }
    },
    setHeightWidth: function (iframeid) {
        var heightWidth = FormUtil.GetHeightWidthFromCustomStyle(iframeid);

        captureFormDiv = parent.window.document.getElementById(iframeid);

        var IsPixceOrPercent = formBasicDetails.BackgroundPxOPer ? "%" : "px";

        if (formBasicDetails.IsMainBackgroundDesignCustom) {
            captureFormDiv.width = heightWidth.ActualWidthValue;
        }
        else {
            captureFormDiv.width = heightWidth.Width + IsPixceOrPercent;
        }

        captureFormDiv.height = heightWidth.ActualHeightValue;
    },
    GetHeightWidthFromCustomStyle: function (iframeid) {
        var height = 0, width = 0, actualWidthValue, actualHeightValue;
        var content = formDesign.MainBackgroundDesign;
        var firstContent;
        if (content.indexOf("width") > -1) {
            firstContent = content.substring(content.indexOf("width") + 6, content.length);
            actualWidthValue = firstContent.substring(0, firstContent.indexOf(";"));
            width = firstContent.substring(0, firstContent.indexOf(";")).replace("px", "");
            width = width.trim();
            width = parseInt(width);
        }
        if (content.indexOf("height") > -1) {
            firstContent = content.substring(content.indexOf("height") + 7, content.length);
            actualHeightValue = firstContent.substring(0, firstContent.indexOf(";"));
            height = firstContent.substring(0, firstContent.indexOf(";")).replace("px", "");
            height = height.trim();
            height = parseInt(height);
        }
        return { Width: width, Height: height, ActualWidthValue: actualWidthValue, ActualHeightValue: actualHeightValue }
    },
    removeCaptureFormDiv: function (IframeId) {
        FormUtil.CloseImpression(IframeId);
    },
    minimiseCaptureFormDiv: function (IframeId) {

        var IframeElement = document.getElementById(IframeId);
        var innerDoc = IframeElement.contentDocument || IframeElement.contentWindow.document;

        if (innerDoc != undefined) {
            if (innerDoc.getElementById("btnplusminus").classList.contains('fa-minus')) {
                var formmaincontent = innerDoc.getElementById("dvMainContentDiv");
                formmaincontent.classList.add("h-auto");

                innerDoc.body.style.backgroundColor = "transparent";

                var testarray = innerDoc.getElementsByClassName("frminputWrap");
                for (var i = 0; i < testarray.length; i++) {
                    testarray[i].className += " hideDiv";
                }

                var testarray = innerDoc.getElementsByClassName("doubleWrap");
                for (var i = 0; i < testarray.length; i++) {
                    testarray[i].className += " hideDiv";
                }

                var testarray = innerDoc.getElementsByClassName("bgWrap");
                for (var i = 0; i < testarray.length; i++) {
                    testarray[i].className += " hideDiv";
                }

                var testarray = innerDoc.getElementsByClassName("form-radio-wrapee");
                for (var i = 0; i < testarray.length; i++) {
                    testarray[i].className += " hideDiv";
                }

                var testarray = innerDoc.getElementsByClassName("form-check-wrapee");
                for (var i = 0; i < testarray.length; i++) {
                    testarray[i].className += " hideDiv";
                }

                var testarray = innerDoc.getElementsByClassName("btnWrapee");
                for (var i = 0; i < testarray.length; i++) {
                    testarray[i].className += " hideDiv";
                }

                var testarray = innerDoc.getElementsByClassName("frmthankwrp");
                for (var i = 0; i < testarray.length; i++) {
                    testarray[i].className += " hideDiv";
                }

                var testarray = innerDoc.getElementsByClassName("dvbannerimg");
                for (var i = 0; i < testarray.length; i++) {
                    testarray[i].className += " hideDiv";
                }

                var testarray = innerDoc.getElementsByClassName("dvvideocontent");
                for (var i = 0; i < testarray.length; i++) {
                    testarray[i].className += " hideDiv";
                }

                var testarray = innerDoc.getElementsByClassName("dviframecontent");
                for (var i = 0; i < testarray.length; i++) {
                    testarray[i].className += " hideDiv";
                }

                var testarray = innerDoc.getElementsByClassName("dvhtmlcontent");
                for (var i = 0; i < testarray.length; i++) {
                    testarray[i].className += " hideDiv";
                }

                var ielement = innerDoc.getElementById("btnplusminus");
                ielement.classList.remove("fa-minus");
                ielement.classList.add("fa-plus");
            }
            else {
                innerDoc.body.removeAttribute("style");
                innerDoc.body.style.backgroundColor = "#f0f2f7";

                var formmaincontent = innerDoc.getElementById("dvMainContentDiv");
                formmaincontent.classList.remove("h-auto");

                var testarray = innerDoc.getElementsByClassName("frminputWrap");
                for (var i = 0; i < testarray.length; i++) {
                    testarray[i].classList.remove("hideDiv");
                }

                var testarray = innerDoc.getElementsByClassName("doubleWrap");
                for (var i = 0; i < testarray.length; i++) {
                    testarray[i].classList.remove("hideDiv");
                }

                var testarray = innerDoc.getElementsByClassName("bgWrap");
                for (var i = 0; i < testarray.length; i++) {
                    testarray[i].classList.remove("hideDiv");
                }

                var testarray = innerDoc.getElementsByClassName("form-radio-wrapee");
                for (var i = 0; i < testarray.length; i++) {
                    testarray[i].classList.remove("hideDiv");
                }

                var testarray = innerDoc.getElementsByClassName("form-check-wrapee");
                for (var i = 0; i < testarray.length; i++) {
                    testarray[i].classList.remove("hideDiv");
                }

                var testarray = innerDoc.getElementsByClassName("btnWrapee");
                for (var i = 0; i < testarray.length; i++) {
                    testarray[i].classList.remove("hideDiv");
                }

                var testarray = innerDoc.getElementsByClassName("frmthankwrp");
                for (var i = 0; i < testarray.length; i++) {
                    testarray[i].classList.remove("hideDiv");
                }

                var testarray = innerDoc.getElementsByClassName("dvbannerimg");
                for (var i = 0; i < testarray.length; i++) {
                    testarray[i].classList.remove("hideDiv");
                }

                var testarray = innerDoc.getElementsByClassName("dvvideocontent");
                for (var i = 0; i < testarray.length; i++) {
                    testarray[i].classList.remove("hideDiv");
                }

                var testarray = innerDoc.getElementsByClassName("dviframecontent");
                for (var i = 0; i < testarray.length; i++) {
                    testarray[i].classList.remove("hideDiv");
                }

                var testarray = innerDoc.getElementsByClassName("dvhtmlcontent");
                for (var i = 0; i < testarray.length; i++) {
                    testarray[i].classList.remove("hideDiv");
                }

                var ielement = innerDoc.getElementById("btnplusminus");
                ielement.classList.remove("fa-plus");
                ielement.classList.add("fa-minus");
            }
        }
    },
    formHideEffect: function (IframeId) {
        FormUtil.RemoveBackgroundFadeColorAndOpacity(IframeId);
        captureFormDiv = parent.window.document.getElementById(IframeId);
        captureFormDiv.remove();
    },
    BindFormDesignExtraLinks: function (response) {
        if (response != null && response.length > 0) {
            extraLinks = response;
            FormUtil.AppendExtraLinks();
        }
    },
    CheckForAppearenceType: function (iframeid) {
        if (formDesign.AppearOnLoadOnExitOnScroll == 0)
            FormAppearenceTimeOutData = setTimeout(function () { FormUtil.appearEffect(iframeid); }, formDesign.TimeDelay);

        else if (formDesign.AppearOnLoadOnExitOnScroll == 1) {
            clearTimeout(FormAppearenceTimeOutData);
            FormUtil.appearEffect(iframeid);
        }
        else if (formDesign.AppearOnLoadOnExitOnScroll == 2) {
            parent.window.addEventListener('scroll', function (e) {
                var scrolledHeight = (parent.window.pageYOffset || parent.window.document.documentElement.scrollTop) - (parent.window.document.documentElement.clientTop || 0);
                if (scrolledHeight >= formDesign.ShowOnScrollDownHeight && document.getElementById(iframeid).style.display == "none" && formDesign != undefined)
                    FormUtil.appearEffect(iframeid);
            });
        }
        else if (formDesign.AppearOnLoadOnExitOnScroll == 3) {
            FormUtil.appearEffect(iframeid);
        }

        if (formDesign.AutoClose > 0) {
            setTimeout(function () { FormUtil.formHideEffect(iframeid); }, formDesign.AutoClose);
        }
    },
    bindStaticAppearanceForms: function (iframeid) {
        setTimeout(function () {
            parent.window.document.getElementById(iframeid).style.display = "block";
        }, 500);
        FormUtil.FormImpressionCountUpdate(iframeid);
    },
    appearEffect: function (iframeid) {
        FormUtil.AppendBackgroundFadeColorAndOpacity();
        var heightWidth = FormUtil.GetHeightWidthFromCustomStyle(iframeid);
        captureFormDiv = parent.window.document.getElementById(iframeid);

        if (AllFormDetails != null && AllFormDetails.length > 0 && iframeid != null) {
            var FormId = iframeid.split("_")[1];

            for (var j = 0; j < AllFormDetails.length; j++) {
                if (AllFormDetails[j].formDetails.Id == FormId) {
                    formDesign = AllFormDetails[j].formDetails;
                }
            }
        }

        var initialBottomValue = formDesign.TopOrBottomPadding, bottomValue = formDesign.TopOrBottomPadding;

        if (formDesign.PositionAlign == 1) {
            captureFormDiv.style.left = formDesign.RightOrLeftPadding + "px";
            captureFormDiv.style.top = formDesign.TopOrBottomPadding + "px";
            captureFormDiv.style.bottom = "";
            captureFormDiv.style.right = "";
            captureFormDiv.className = "p5animated slideInLeft";
            captureFormDiv.style.display = "block";
            captureFormDiv.style.position = "fixed";

            //captureFormDiv.style.position = "fixed";
            //captureFormDiv.style.left = formDesign.RightOrLeftPadding + "px";
            //captureFormDiv.style.top = formDesign.TopOrBottomPadding + "px";
            //captureFormDiv.style.bottom = "";
            //captureFormDiv.style.right = "";
            //setTimeout(function () {
            //    captureFormDiv.style.display = "block";
            //    captureFormDiv.className = "p5animated slideInLeft";
            //}, 500);
        }
        else if (formDesign.PositionAlign == 2) {
            captureFormDiv.style.left = "0px";
            captureFormDiv.style.top = formDesign.TopOrBottomPadding + "px";
            captureFormDiv.style.margin = "auto";
            captureFormDiv.style.right = "0px";
            captureFormDiv.className = "p5animated slideInDown";
            captureFormDiv.style.display = "block";
            captureFormDiv.style.position = "fixed";

            //captureFormDiv.style.position = "fixed";
            //captureFormDiv.style.left = "0px";
            //captureFormDiv.style.top = formDesign.TopOrBottomPadding + "px";
            //captureFormDiv.style.margin = "auto";
            //captureFormDiv.style.right = "0px";

            //setTimeout(function () {
            //    captureFormDiv.style.display = "block";
            //    captureFormDiv.className = "p5animated slideInDown";
            //}, 500);
        }
        else if (formDesign.PositionAlign == 3) {
            captureFormDiv.style.top = formDesign.TopOrBottomPadding + "px";
            captureFormDiv.style.right = formDesign.RightOrLeftPadding + "px";
            captureFormDiv.className = "p5animated slideInRight";
            captureFormDiv.style.display = "block";
            captureFormDiv.style.position = "fixed";

            //captureFormDiv.style.position = "fixed";
            //captureFormDiv.style.top = formDesign.TopOrBottomPadding + "px";
            //captureFormDiv.style.right = formDesign.RightOrLeftPadding + "px";

            //setTimeout(function () {
            //    captureFormDiv.style.display = "block";
            //    captureFormDiv.className = "p5animated slideInRight";
            //}, 500);
        }
        else if (formDesign.PositionAlign == 4) {
            //setTimeout(function () {
            //    captureFormDiv.style.position = "fixed";
            //    captureFormDiv.style.left = "50%";
            //    captureFormDiv.style.top = "50%";
            //    captureFormDiv.className = "p5animated zoomInDown";
            //    captureFormDiv.style.display = "block";
            //    captureFormDiv.style.transform = "translate(-50%, -50%)";
            //}, 500);

            captureFormDiv.style.left = "50%";
            captureFormDiv.style.top = "50%";
            captureFormDiv.style.transform = "translate(-50%, -50%)";
            captureFormDiv.className = "p5animated zoomInDown";
            captureFormDiv.style.display = "block";
            captureFormDiv.style.position = "fixed";

            //captureFormDiv.style.position = "fixed";
            //captureFormDiv.style.left = "50%";
            //captureFormDiv.style.top = "50%";
            //captureFormDiv.style.transform = "translate(-50%, -50%)";

            //setTimeout(function () {
            //    captureFormDiv.style.display = "block";
            //    captureFormDiv.className = "p5animated zoomInDown";
            //}, 1000);
        }
        else if (formDesign.PositionAlign == 5) {
            captureFormDiv.style.left = formDesign.RightOrLeftPadding + "px";
            captureFormDiv.style.bottom = formDesign.TopOrBottomPadding + "px";
            captureFormDiv.className = "p5animated fadeInLeftBig";
            captureFormDiv.style.display = "block";
            captureFormDiv.style.position = "fixed";

            //captureFormDiv.style.position = "fixed";
            //captureFormDiv.style.left = formDesign.RightOrLeftPadding + "px";
            //captureFormDiv.style.bottom = formDesign.TopOrBottomPadding + "px";

            //setTimeout(function () {
            //    captureFormDiv.style.display = "block";
            //    captureFormDiv.className = "p5animated fadeInLeftBig";
            //}, 500);
        }
        else if (formDesign.PositionAlign == 6) {

            captureFormDiv.style.right = "0px";
            captureFormDiv.style.left = "0px";
            captureFormDiv.style.bottom = formDesign.TopOrBottomPadding + "px";
            captureFormDiv.style.margin = "auto";
            captureFormDiv.className = "p5animated fadeInUpBig";
            captureFormDiv.style.display = "block";
            captureFormDiv.style.position = "fixed";

            //captureFormDiv.style.position = "fixed";
            //captureFormDiv.style.right = "0px";
            //captureFormDiv.style.left = "0px";
            //captureFormDiv.style.bottom = formDesign.TopOrBottomPadding + "px";
            //captureFormDiv.style.margin = "auto";

            //setTimeout(function () {
            //    captureFormDiv.style.display = "block";
            //    captureFormDiv.className = "p5animated fadeInUpBig";
            //}, 500);
        }
        else if (formDesign.PositionAlign == 7) {

            captureFormDiv.style.right = formDesign.RightOrLeftPadding + "px";
            captureFormDiv.style.bottom = formDesign.TopOrBottomPadding + "px";
            captureFormDiv.className = "p5animated fadeInRightBig";
            captureFormDiv.style.display = "block";
            captureFormDiv.style.position = "fixed";

            //captureFormDiv.style.position = "fixed";
            //captureFormDiv.style.right = formDesign.RightOrLeftPadding + "px";
            //captureFormDiv.style.bottom = formDesign.TopOrBottomPadding + "px";

            //setTimeout(function () {
            //    captureFormDiv.style.display = "block";
            //    captureFormDiv.className = "p5animated fadeInRightBig";
            //}, 500);
        }
        FormUtil.FormImpressionCountUpdate(iframeid);
    },
    FormImpressionCountUpdate: function (iframeid) {
        if (iframeid != null && iframeid.length > 0) {

            var FormId = iframeid.split("_")[1];

            FormInfoDetails.FormId = parseInt(FormId);

            if (AllFormDetails != null && AllFormDetails.length > 0) {
                for (var i = 0; i < AllFormDetails.length; i++) {
                    if (AllFormDetails[i].banner != null && AllFormDetails[i].banner != "" && AllFormDetails[i].banner.FormId == FormId) {
                        FormInfoDetails.BannerId = AllFormDetails[i].banner.Id;
                        break;
                    }
                }
            }

            var FormDetailsWithVisitorInfo = { FormInfoDetails: FormInfoDetails, MainVisitorDetails: MainVisitorDetails, answerDetails: [], Events: "" };

            var xhr = new XMLHttpRequest();
            xhr.open('Post', TrackerUrl.FormImpressionUrl);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(JSON.stringify(FormDetailsWithVisitorInfo));
        }
    },
    AppendBackgroundFadeColorAndOpacity: function () {
        if (formDesign.BackgroundFadeColor != null && formDesign.BackgroundFadeColor.length > 3) {
            if (parent.window.document.getElementById("dvPlumb5AppendExtraDivForBackground") == undefined && parent.window.document.getElementById("dvPlumb5AppendExtraDivForBackground") == null) {
                var p5divContent = document.createElement('div');
                p5divContent.id = "dvPlumb5AppendExtraDivForBackground"
                p5divContent.setAttribute("style", formDesign.BackgroundFadeColor);
                p5divContent.style.position = "fixed";
                p5divContent.style.height = "100%";
                p5divContent.style.width = "100%";
                p5divContent.style.bottom = "0px";
                //p5divContent.style.left = "0px";
                p5divContent.style.zIndex = 500;
                parent.document.getElementsByTagName("body")[0].appendChild(p5divContent);
            }
        }
    },
    RemoveBackgroundFadeColorAndOpacity: function () {
        if (parent.window.document.getElementById("dvPlumb5AppendExtraDivForBackground") != undefined && parent.window.document.getElementById("dvPlumb5AppendExtraDivForBackground") != null) {
            parent.window.document.getElementById("dvPlumb5AppendExtraDivForBackground").remove()
        }
    },
    AppendChildExtraLinks: function (extraLinks, formid) {
        if (extraLinks && extraLinks != null) {
            for (var i = 0; i < extraLinks.length; i++) {

                if (extraLinks[i].LinkType) {
                    var AppendType = document;

                    if (extraLinks[i].LinkPlacecode.toLowerCase().indexOf("child") > -1) {

                        if (extraLinks[i].FormId != null && extraLinks[i].FormId != "" && extraLinks[i].FormId != "0" && extraLinks[i].FormId.length > 0) {
                            var formids = extraLinks[i].FormId.trim().split(",");

                            if (formids != null && formids != "" && formids != "0" && formids.length > 0) {
                                for (var a = 0; a < formids.length; a++) {
                                    if (formids[a] == formid) {
                                        var IframeDetails = "Plumb5FromCampaign_" + formids[a];
                                        let IframeElement = document.getElementById(IframeDetails);
                                        if (IframeElement != null) {
                                            let innerDoc = IframeElement.contentDocument || IframeElement.contentWindow.document;
                                            if (innerDoc != undefined) {
                                                FormUtil.P5AppendJavascriptIframes(IframeElement.contentWindow.document, extraLinks[i].LinkUrl, i);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                else {
                    if (AllFormDetails != null && AllFormDetails.length > 0) {
                        if (extraLinks[i].LinkAddCsscode != null && extraLinks[i].LinkAddCsscode != "" && extraLinks[i].LinkAddCsscode.length > 0) {
                            if (extraLinks[i].LinkPlacecode.toLowerCase().indexOf("child") > -1) {

                                if (extraLinks[i].FormId != null && extraLinks[i].FormId != "" && extraLinks[i].FormId != "0" && extraLinks[i].FormId.length > 0) {
                                    var formids = extraLinks[i].FormId.trim().split(",");

                                    if (formids != null && formids != "" && formids != "0" && formids.length > 0) {
                                        for (var a = 0; a < formids.length; a++) {
                                            if (formids[a] == formid) {
                                                var IframeDetails = "Plumb5FromCampaign_" + formids[a];
                                                let IframeElement = document.getElementById(IframeDetails);
                                                if (IframeElement != null) {
                                                    let innerDoc = IframeElement.contentDocument || IframeElement.contentWindow.document;
                                                    if (innerDoc != undefined) {
                                                        IframeElement.contentWindow.document.getElementsByTagName("head")[0].innerHTML += "<style type='text/css'> " + extraLinks[i].LinkAddCsscode + "</style>";
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        else {
                            if (extraLinks[i].LinkPlacecode.toLowerCase().indexOf("child") > -1) {

                                if (extraLinks[i].FormId != null && extraLinks[i].FormId != "" && extraLinks[i].FormId != "0" && extraLinks[i].FormId.length > 0) {
                                    var formids = extraLinks[i].FormId.trim().split(",");

                                    if (formids != null && formids != "" && formids != "0" && formids.length > 0) {
                                        for (var a = 0; a < formids.length; a++) {
                                            if (formids[a] == formid) {
                                                var IframeDetails = "Plumb5FromCampaign_" + formids[a];
                                                let IframeElement = document.getElementById(IframeDetails);
                                                if (IframeElement != null) {
                                                    let innerDoc = IframeElement.contentDocument || IframeElement.contentWindow.document;
                                                    if (innerDoc != undefined) {
                                                        FormUtil.AppendStyleIframes(IframeElement.contentWindow.document, extraLinks[i].LinkUrl);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    AppendExtraLinks: function () {
        if (extraLinks && extraLinks != null) {
            for (var i = 0; i < extraLinks.length; i++) {

                if (extraLinks[i].LinkType) {
                    var AppendType = document;

                    if (extraLinks[i].LinkPlacecode.toLowerCase().indexOf("parent") > -1) {
                        FormUtil.P5AppendJavascriptIframes(parent.document, extraLinks[i].LinkUrl, i);
                    }
                    else if (extraLinks[i].LinkPlacecode.toLowerCase().indexOf("child") > -1) {

                        if (extraLinks[i].FormId != null && extraLinks[i].FormId != "" && extraLinks[i].FormId != "0" && extraLinks[i].FormId.length > 0) {
                            var formids = extraLinks[i].FormId.trim().split(",");

                            if (formids != null && formids != "" && formids != "0" && formids.length > 0) {
                                for (var a = 0; a < formids.length; a++) {
                                    var IframeDetails = "Plumb5FromCampaign_" + formids[a];
                                    let IframeElement = document.getElementById(IframeDetails);
                                    if (IframeElement != null) {
                                        let innerDoc = IframeElement.contentDocument || IframeElement.contentWindow.document;
                                        if (innerDoc != undefined) {
                                            FormUtil.P5AppendJavascriptIframes(IframeElement.contentWindow.document, extraLinks[i].LinkUrl, i);
                                        }
                                    }
                                }
                            }
                        }
                        else {
                            if (AllFormDetails != null && AllFormDetails.length > 0) {
                                for (var r = 0; r < AllFormDetails.length; r++) {
                                    var IframeDetails = "Plumb5FromCampaign_" + AllFormDetails[r].formDetails.Id;
                                    var myIframedetails = document.getElementById(IframeDetails);
                                    FormUtil.P5AppendJavascriptIframes(myIframedetails.contentWindow.document, extraLinks[i].LinkUrl, i);
                                }
                            }
                        }
                    }
                }
                else {
                    if (AllFormDetails != null && AllFormDetails.length > 0) {
                        if (extraLinks[i].LinkAddCsscode != null && extraLinks[i].LinkAddCsscode != "" && extraLinks[i].LinkAddCsscode.length > 0) {
                            if (extraLinks[i].LinkPlacecode.toLowerCase().indexOf("parent") > -1) {
                                FormUtil.AppendStyleContentIframes(extraLinks[i].LinkAddCsscode);
                            }
                            else if (extraLinks[i].LinkPlacecode.toLowerCase().indexOf("child") > -1) {

                                if (extraLinks[i].FormId != null && extraLinks[i].FormId != "" && extraLinks[i].FormId != "0" && extraLinks[i].FormId.length > 0) {
                                    var formids = extraLinks[i].FormId.trim().split(",");

                                    if (formids != null && formids != "" && formids != "0" && formids.length > 0) {
                                        for (var a = 0; a < formids.length; a++) {
                                            var IframeDetails = "Plumb5FromCampaign_" + formids[a];
                                            let IframeElement = document.getElementById(IframeDetails);
                                            if (IframeElement != null) {
                                                let innerDoc = IframeElement.contentDocument || IframeElement.contentWindow.document;
                                                if (innerDoc != undefined) {
                                                    IframeElement.contentWindow.document.getElementsByTagName("head")[0].innerHTML += "<style type='text/css'> " + extraLinks[i].LinkAddCsscode + "</style>";
                                                }
                                            }
                                        }
                                    }
                                }
                                else {
                                    if (AllFormDetails != null && AllFormDetails.length > 0) {
                                        for (var r = 0; r < AllFormDetails.length; r++) {
                                            var IframeDetails = "Plumb5FromCampaign_" + AllFormDetails[r].formDetails.Id;
                                            let IframeElement = document.getElementById(IframeDetails);
                                            let innerDoc = IframeElement.contentDocument || IframeElement.contentWindow.document;
                                            if (innerDoc != undefined) {
                                                IframeElement.contentWindow.document.getElementsByTagName("head")[0].innerHTML += "<style type='text/css'> " + extraLinks[i].LinkAddCsscode + "</style>";
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        else {
                            if (extraLinks[i].LinkPlacecode.toLowerCase().indexOf("parent") > -1) {
                                FormUtil.AppendStyleIframes(parent.document, extraLinks[i].LinkUrl);
                            }
                            else if (extraLinks[i].LinkPlacecode.toLowerCase().indexOf("child") > -1) {

                                if (extraLinks[i].FormId != null && extraLinks[i].FormId != "" && extraLinks[i].FormId != "0" && extraLinks[i].FormId.length > 0) {
                                    var formids = extraLinks[i].FormId.trim().split(",");

                                    if (formids != null && formids != "" && formids != "0" && formids.length > 0) {
                                        for (var a = 0; a < formids.length; a++) {
                                            var IframeDetails = "Plumb5FromCampaign_" + formids[a];
                                            let IframeElement = document.getElementById(IframeDetails);
                                            if (IframeElement != null) {
                                                let innerDoc = IframeElement.contentDocument || IframeElement.contentWindow.document;
                                                if (innerDoc != undefined) {
                                                    FormUtil.AppendStyleIframes(IframeElement.contentWindow.document, extraLinks[i].LinkUrl);
                                                }
                                            }
                                        }
                                    }
                                }
                                else {
                                    if (AllFormDetails != null && AllFormDetails.length > 0) {
                                        for (var r = 0; r < AllFormDetails.length; r++) {
                                            var IframeDetails = "Plumb5FromCampaign_" + AllFormDetails[r].formDetails.Id;
                                            var myIframedetails = document.getElementById(IframeDetails);
                                            FormUtil.AppendStyleIframes(myIframedetails.contentWindow.document, extraLinks[i].LinkUrl);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    CaptureFormInitialise: function (IframeId, FormType, response, formtagtype) {
        FormUtil.CreateIframe(IframeId, "z-index:511119260;display:none;border:none;", FormType, response, formtagtype);
    },
    CreateIframe: function (iframeId, styleProperty, FormType, response, formtagtype) {
        var p5iframe = document.createElement('iframe');
        p5iframe.id = iframeId; p5iframe.scrolling = "no"; p5iframe.frameborder = "0"; p5iframe.marginwidth = "0"; p5iframe.marginheight = "0"; p5iframe.allowtransparency = true; p5iframe.setAttribute("style", styleProperty);
        p5iframe.setAttribute("FormType", FormType);
        document.getElementsByTagName("body")[0].appendChild(p5iframe);

        if (formtagtype != null && formtagtype != "" && formtagtype == "PopUp") {
            var inter = window.setInterval(function () {
                var iframeDoc = p5iframe.contentDocument || p5iframe.contentWindow.document;

                if (iframeDoc.readyState == "complete") {
                    window.clearInterval(inter);
                    FormUtil.StartAppendScript(iframeId);

                    var responseDetails = {}
                    responseDetails["Visitor"] = response.Visitor;
                    responseDetails["banner"] = response.banner;
                    responseDetails["listExtraLinks"] = response.listExtraLinks;
                    responseDetails["APIKeyForClickToCall"] = response.APIKeyForClickToCall;
                    responseDetails["formDetails"] = response.formDetails;
                    responseDetails["formFields"] = response.formFields;
                    responseDetails["formFieldsBindingDetails"] = response.formFieldsBindingDetails;
                    FormUtil.CallingRespectiveForms(responseDetails, iframeId);
                }
            }, 100);
        }
        else if (formtagtype != null && formtagtype != "" && formtagtype == "OnExit") {
            var inter = window.setInterval(function () {
                var iframeDoc = p5iframe.contentDocument || p5iframe.contentWindow.document;

                if (iframeDoc.readyState == "complete") {
                    window.clearInterval(inter);
                    FormUtil.StartAppendScript(iframeId);

                    onExitFormData["Visitor"] = response.Visitor;
                    onExitFormData["banner"] = response.banner;
                    onExitFormData["listExtraLinks"] = response.listExtraLinks;
                    onExitFormData["APIKeyForClickToCall"] = response.APIKeyForClickToCall;
                    onExitFormData["formDetails"] = response.formDetails;
                    onExitFormData["formFieldsBindingDetails"] = response.formFieldsBindingDetails;
                    onExitFormData["formFields"] = response.formFields;
                    FormUtil.CheckthisConditionOnExitFormExists(iframeId);
                }
            }, 100);
        }
    },
    StartAppendScript: function (IframeId) {
        var myIframe = document.getElementById(IframeId);
        FormUtil.AppendScriptToFrame(myIframe, IframeId);
    },
    AppendScriptToFrame: function (myIframe, IframeId) {

        var IframeElement = document.getElementById(IframeId);
        var innerDoc = IframeElement.contentDocument || IframeElement.contentWindow.document;

        var responsiveContent = '@media only screen and (min-width:300px) and (max-width: 767px){iframe[id ^= "Plumb5FromCampaign_"]{ width: 100% !important; left: auto!important; right: auto!important; transform: translate(0, -50%) !important;top: 50% !important;bottom: auto!important; }';

        FormUtil.AppendStyleIframes(document, TrackerUrl.MainUrl + "/animate.min.css");
        //FormUtil.AppendStyleIframes(document, TrackerUrl.MainUrl + "/css/p5-client.css");
        FormUtil.AppendStyleContentIframes(responsiveContent);
        FormUtil.AppendStyleIframes(IframeElement.contentWindow.document, TrackerUrl.MainUrl + "/css/form-editor-main-style.css");
        FormUtil.P5AppendJavascriptIframes(myIframe.contentWindow.document, TrackerUrl.MainUrl + "/jquery-1.10.2.min.js", "jqueryUI");
        FormUtil.P5AppendJavascriptIframes(myIframe.contentWindow.document, TrackerUrl.MainUrl + "/jquery-ui.js", "jqueryUI_Js");
        FormUtil.AppendStyleIframes(myIframe.contentWindow.document, "//fonts.googleapis.com/css?family=Source+Sans+Pro|Cantora+One|Cabin+Condensed:400,500,600|Francois+One|Homenaje|Allerta|Allerta+Stencil|PT+Sans+Caption");
        FormUtil.AppendStyleIframes(myIframe.contentWindow.document, TrackerUrl.MainUrl + "/jquery-ui.css");
        FormUtil.AppendStyleIframes(myIframe.contentWindow.document, "https://pro.fontawesome.com/releases/v5.10.0/css/all.css");
        FormUtil.AppendStyleIframes(myIframe.contentWindow.document, TrackerUrl.MainUrl + "/css/Ionicons/css/ionicons.css");
        FormUtil.AppendStyleIframes(myIframe.contentWindow.document, TrackerUrl.MainUrl + "/bootstrap.min.css");
        FormUtil.AppendStyleIframes(IframeElement.contentWindow.document, TrackerUrl.MainUrl + "/css/font-awesome.min.css?ver=2.1");

        var script = document.createElement("script");
        script.textContent = 'function intializeCalender() {try {$(".calender").datepicker({showOtherMonths: true,selectOtherMonths: true,dateFormat: "dd-mm-yy"});}catch (Err){ }try {$(".calenderWithoutPastDates").datepicker({minDate: new Date(),dateFormat: "dd-mm-yy"});}catch (Err){ }try {$(".calenderWithoutFutureDates").datepicker({showOtherMonths: true,selectOtherMonths: true,dateFormat: "dd-mm-yy" });} catch (Err){ }}';
        myIframe.contentWindow.document.head.appendChild(script);

        if (innerDoc != undefined) {
            var mainContentDiv = FormUtil.getDiv("dvMainContentDiv", "simpleForm");
            myIframe.contentWindow.document.body.appendChild(mainContentDiv);
            myIframe.contentWindow.document.body.style.backgroundColor = "transparent";
            captureFormDiv = parent.window.document.getElementById(IframeId);
        }
        else {
            setTimeout(function () { FormUtil.AppendScriptToFrame(myIframe, IframeId); }, 1500);
        }
    },
    getDiv: function (divId, ClassName) {
        var divTag = document.createElement("div");
        if (divId.length > 0) {
            if (!document.getElementById(divId)) {
                divTag.id = divId;
                divTag.className = ClassName;
                return divTag;
            }
        }
        else {
            return divTag;
        }
        return null;
    },
    GetJavaScriptDateObj: function (dateString) {
        return FormUtil.ToJavaScriptDateFromNumber(dateString);
    },
    ToJavaScriptDateFromNumber: function (value) {
        var pattern = /Date\(([^)]+)\)/;
        var results = pattern.exec(value);
        var dt = new Date(parseFloat(results[1]));
        return dt;
    },
    AppendStyleIframes: function (iframeDocumnet, url) {
        var p5linktag, headTag = iframeDocumnet.getElementsByTagName("head")[0];
        p5linktag = iframeDocumnet.createElement('link');
        p5linktag.type = 'text/css'; p5linktag.rel = "stylesheet";
        p5linktag.href = url;
        headTag.appendChild(p5linktag);
    },
    AppendStyleContentIframes: function (content) {
        var head = document.getElementsByTagName('head')[0];
        var s = document.createElement('style');
        s.setAttribute('type', 'text/css');
        if (s.styleSheet) {   // IE
            s.styleSheet.cssText = content;
        } else {                // the world
            s.appendChild(document.createTextNode(content));
        }
        head.appendChild(s);
    },
    P5AppendJavascriptIframes: function (iframeDocumnet, url, scriptId, callback) {
        var js, headTag = iframeDocumnet.getElementsByTagName("head")[0];
        js = iframeDocumnet.createElement('script');
        js.src = url;
        js.setAttribute("id", scriptId);
        if (!iframeDocumnet.getElementById(scriptId)) {
            headTag.appendChild(js);
        }
        if (callback && typeof (callback) === "function") {
            var appendedScript = iframeDocumnet.getElementById(scriptId);

            if (appendedScript.addEventListener) {
                appendedScript.addEventListener('load', function changeCB(params) {
                    appendedScript.removeEventListener("load", changeCB);
                    callback();
                }, false);
            }
            else {
                FormUtil.AppendScriptAfterAjaxLoading(callback);
            }
        }
    },
    AppendScriptAfterAjaxLoading: function (callback) {
        try {
            LoadScript(callback);
        }
        catch (err) {
            errorCountI++;
            if (errorCountI < 3000);
            window.setTimeout(function () { FormUtil.AppendScriptAfterAjaxLoading(callback); }, errorCountI);
        }
    },
    initializeMachineIdAndSessionRefeer: function () {
        //Forms
        var formCookieName = "pfiveCampaignIdNew" + MainVisitorDetails.AccountId;
        var previousForms = TrackingUtil.GetCookie(formCookieName);
        if (previousForms != undefined)
            MainVisitorDetails.CaptureFormFilledIds = previousForms.split(",");
        else
            MainVisitorDetails.CaptureFormFilledIds.push("");
    },
    ChangePropertyValue: function (objectProperty) {
        try {
            for (key in objectProperty) {
                if (objectProperty.hasOwnProperty(key) && objectProperty[key] != undefined && objectProperty[key].length > 0 && key != "CaptureFormFilledIds") {
                    objectProperty[key] = objectProperty[key].replace(/&/g, "$@").replace(/#/g, "@@");
                }
            }
        }
        catch (Error) { }
    },

    ValidateEmailId: function (content) {
        var regEmail = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        return regEmail.test(content);
    },
    validateMobilNoWithExpress: function (mobno, currentValidationType) {
        if (formFields != undefined && currentValidationType != undefined && currentValidationType != null && currentValidationType != "") {
            var ConditionDetail;

            if (typeof currentValidationType != "object") {
                ConditionDetail = JSON.parse(currentValidationType);
            }
            else {
                ConditionDetail = currentValidationType.Data;
            }
            if (ConditionDetail != undefined && ConditionDetail != "" && ConditionDetail.ValidationType == "Number") {
                if (mobno.length >= ConditionDetail.Min && mobno.length <= ConditionDetail.Max) {
                    return true;
                }
                return false;
            }
        }
        var mlen = mobno.length;
        var regNumber = /^\d{10,20}$/;
        var regAnotherNumber = /^\+[0-9]{2,3}-[0-9]\d{10}$/;
        var regNumberPlus = /^\+\d{10,20}$/;
        var regNumberPlus91 = /^\+91\d{10,20}$/;
        var regNumberPlus91Minus = /^\+91-\d{10,20}$/;
        if (regNumber.test(mobno))
            return true;
        if (regNumberPlus.test(mobno))
            return true;
        if (regNumberPlus91.test(mobno))
            return true;
        if (regNumberPlus91Minus.test(mobno))
            return true;
        else if (regAnotherNumber.test(mobno))
            return true;
        else if (mobno.charAt(0) != '+' && mlen == 10)
            return true;
        else if (mobno.charAt(0) == '+' && mobno != null && mobno != "" && mobno.length > 0) {
            if (mobno.substr(0, 3) == '+91' && mobno.replace(/ /g, '').length == 13) {
                return true;
            }
        }
        else if (mobno.indexOf("-") < 0 && mobno.length == 12 && mobno.substr(0, 2) == '91')
            return true;
        else if (mobno.length >= 8 && mobno.length <= 13)
            return true;
        return false;

    },
    validateMobilNoWithExpressForEmbedForms: function (mobno, currentValidationType) {

        if (formFields != undefined && currentValidationType != undefined && currentValidationType != null && currentValidationType != "") {
            var ConditionDetail = JSON.parse(currentValidationType);
            if (ConditionDetail.ValidationType == "Number") {
                if (mobno.length >= ConditionDetail.Min && mobno.length <= ConditionDetail.Max) {
                    return true;
                }
                return false;
            }
        }
        else {
            var mlen = mobno.length;
            var regNumber = /^\d{10,20}$/;
            var regAnotherNumber = /^\+[0-9]{2,3}-[0-9]\d{10}$/;
            var regNumberPlus = /^\+\d{10,20}$/;
            var regNumberPlus91 = /^\+91\d{10,20}$/;
            var regNumberPlus91Minus = /^\+91-\d{10,20}$/;
            if (regNumber.test(mobno))
                return true;
            if (regNumberPlus.test(mobno))
                return true;
            if (regNumberPlus91.test(mobno))
                return true;
            if (regNumberPlus91Minus.test(mobno))
                return true;
            else if (regAnotherNumber.test(mobno))
                return true;
            else if (mobno.charAt(0) != '+' && mlen == 10)
                return true;
            else if (mobno.charAt(0) == '+' && mobno != null && mobno != "" && mobno.length > 0) {
                if (mobno.substr(0, 3) == '+91' && mobno.replace(/ /g, '').length == 13) {
                    return true;
                }
            }
            else if (mobno.indexOf("-") < 0 && mobno.length == 12 && mobno.substr(0, 2) == '91')
                return true;
            else if (mobno.length >= 8 && mobno.length <= 13)
                return true;
            return false;
        }
    },
    ValidateMobileNo: function (mobno) {
        if (FormFields != undefined && FormFields.PhoneValidationType != undefined && FormFields.PhoneValidationType != null && FormFields.PhoneValidationType != "") {
            var ConditionDetail = JSON.parse(FormFields.PhoneValidationType);
            if (ConditionDetail.ValidationType == "Number") {
                if (mobno.length >= ConditionDetail.Min && mobno.length <= ConditionDetail.Max) {
                    return true;
                }
                return false;
            }
        }
        else {
            var mlen = mobno.length;
            var regNumber = /^\d{10,20}$/;
            var regAnotherNumber = /^\+[0-9]{2,3}-[0-9]\d{10}$/;
            var regNumberPlus = /^\+\d{10,20}$/;
            var regNumberPlus91 = /^\+91\d{10,20}$/;
            var regNumberPlus91Minus = /^\+91-\d{10,20}$/;
            if (regNumber.test(mobno))
                return true;
            if (regNumberPlus.test(mobno))
                return true;
            if (regNumberPlus91.test(mobno))
                return true;
            if (regNumberPlus91Minus.test(mobno))
                return true;
            else if (regAnotherNumber.test(mobno))
                return true;
            else if (mobno.charAt(0) != '+' && mlen == 10)
                return true;
            else if (mobno.charAt(0) == '+') {
                if (mobno.substr(0, 3) == '+91' && mobno.length == 13) {
                    return true;
                }
            }
            else if (mobno.indexOf("-") < 0 && mobno.length == 12 && mobno.substr(0, 2) == '91')
                return true;
            else if (mobno.length >= 8 && mobno.length <= 13)
                return true;
            return false;
        }
        return false;
    },
    CleanText: function (content) {
        content = content.replace(/'/g, "‘");
        content = content.replace(/>/g, "&gt;");
        content = content.replace(/</g, "&lt;");
        content = $.trim(content);
        return content;
    },
    CleanTextRemoveSpecialChar: function (content) {
        content = content.replace(/'/g, "‘");
        content = content.replace(/>/g, "&gt;");
        content = content.replace(/</g, "&lt;");
        content = content.replace(/&/g, "$@");
        content = content.replace(/#/g, "@@");
        content = content.trim();
        return content;
    },
    ValidationVistorDetailsBeforeRequestAndChanges: function () {

        FormUtil.ChangePropertyValue(MainVisitorDetails.BasicDetails);
        FormUtil.ChangePropertyValue(MainVisitorDetails.WebSiteDetails);
        FormUtil.ChangePropertyValue(MainVisitorDetails.ReferrerDetails);
        FormUtil.ChangePropertyValue(MainVisitorDetails.UtmTagDetails);
        FormUtil.ChangePropertyValue(MainVisitorDetails.EventDetails);
        FormUtil.ChangePropertyValue(FormInfoDetails);


        for (key in MainVisitorDetails.BasicDetails) {
            if (MainVisitorDetails.BasicDetails.hasOwnProperty(key) && MainVisitorDetails.BasicDetails[key] != undefined && MainVisitorDetails.BasicDetails[key].length > 0 && key != "CaptureFormFilledIds") {
                MainVisitorDetails.BasicDetails[key] = MainVisitorDetails.BasicDetails[key].replace(/&/g, "$@").replace(/#/g, "@@");
            }
        }

        for (key in MainVisitorDetails.WebSiteDetails) {
            if (MainVisitorDetails.WebSiteDetails.hasOwnProperty(key) && MainVisitorDetails.WebSiteDetails[key] != undefined && MainVisitorDetails.WebSiteDetails[key].length > 0 && key != "CaptureFormFilledIds") {
                MainVisitorDetails.WebSiteDetails[key] = MainVisitorDetails.WebSiteDetails[key].replace(/&/g, "$@").replace(/#/g, "@@");
            }
        }

        for (key in MainVisitorDetails.ReferrerDetails) {
            if (MainVisitorDetails.ReferrerDetails.hasOwnProperty(key) && MainVisitorDetails.ReferrerDetails[key] != undefined && MainVisitorDetails.ReferrerDetails[key].length > 0 && key != "CaptureFormFilledIds") {
                MainVisitorDetails.ReferrerDetails[key] = MainVisitorDetails.ReferrerDetails[key].replace(/&/g, "$@").replace(/#/g, "@@");
            }
        }

        for (key in MainVisitorDetails.UtmTagDetails) {
            if (MainVisitorDetails.UtmTagDetails.hasOwnProperty(key) && MainVisitorDetails.UtmTagDetails[key] != undefined && MainVisitorDetails.UtmTagDetails[key].length > 0 && key != "CaptureFormFilledIds") {
                MainVisitorDetails.UtmTagDetails[key] = MainVisitorDetails.UtmTagDetails[key].replace(/&/g, "$@").replace(/#/g, "@@");
            }
        }

        for (key in MainVisitorDetails.EventDetails) {
            if (MainVisitorDetails.EventDetails.hasOwnProperty(key) && MainVisitorDetails.EventDetails[key] != undefined && MainVisitorDetails.EventDetails[key].length > 0 && key != "CaptureFormFilledIds") {
                MainVisitorDetails.EventDetails[key] = MainVisitorDetails.EventDetails[key].replace(/&/g, "$@").replace(/#/g, "@@");
            }
        }

        if (MainVisitorDetails.WebSiteDetails != undefined && MainVisitorDetails.WebSiteDetails != null && MainVisitorDetails.WebSiteDetails.Url != undefined && MainVisitorDetails.WebSiteDetails.Url != null && MainVisitorDetails.WebSiteDetails.Url.length > 0) {
            if (MainVisitorDetails.WebSiteDetails.Url.indexOf("&") > -1) {
                MainVisitorDetails.WebSiteDetails.Url = MainVisitorDetails.WebSiteDetails.Url.replace(/&/g, "$@").replace(/#/g, "@@");
            }
        }

        if (MainVisitorDetails.ReferrerDetails != undefined && MainVisitorDetails.ReferrerDetails != null && MainVisitorDetails.ReferrerDetails.Referrer != undefined && MainVisitorDetails.ReferrerDetails.Referrer != null && MainVisitorDetails.ReferrerDetails.Referrer.length > 0) {
            if (MainVisitorDetails.ReferrerDetails.Referrer.indexOf("&") > -1) {
                var pageUrlDetails = parent.document.domain.replace("http://", "").replace("https://", "").replace("www.", "");
                if (MainVisitorDetails.ReferrerDetails.Referrer.indexOf(pageUrlDetails) > -1) {
                    MainVisitorDetails.ReferrerDetails.Referrer = MainVisitorDetails.ReferrerDetails.Referrer.replace(/&/g, "$@").replace(/#/g, "@@");
                }
                else {
                    MainVisitorDetails.ReferrerDetails.Referrer = MainVisitorDetails.ReferrerDetails.Referrer.split("?")[0];
                }
            }
        }

        if (MainVisitorDetails.ReferrerDetails != undefined && MainVisitorDetails.ReferrerDetails != null && MainVisitorDetails.ReferrerDetails.RefferDomain != undefined && MainVisitorDetails.ReferrerDetails.RefferDomain != null && MainVisitorDetails.ReferrerDetails.RefferDomain.length > 0) {
            if (MainVisitorDetails.ReferrerDetails.RefferDomain.indexOf("&") > -1) {
                MainVisitorDetails.ReferrerDetails.RefferDomain = MainVisitorDetails.ReferrerDetails.RefferDomain.replace(/&/g, "$@").replace(/#/g, "@@");
            }
            if (MainVisitorDetails.ReferrerDetails.RefferDomain.indexOf('"') > -1) {
                MainVisitorDetails.ReferrerDetails.Referrer = MainVisitorDetails.ReferrerDetails.Referrer.replace(/"/g, "\"");
            }
        }

        if (MainVisitorDetails.WebSiteDetails.Url != undefined && MainVisitorDetails.WebSiteDetails.Url.length > 0 && MainVisitorDetails.WebSiteDetails.Url.indexOf('"') > -1) {
            MainVisitorDetails.WebSiteDetails.Url = MainVisitorDetails.WebSiteDetails.Url.replace(/"/g, "\"");
        }

        if (MainVisitorDetails.ReferrerDetails.Referrer != undefined && MainVisitorDetails.ReferrerDetails.Referrer.length > 0 && MainVisitorDetails.ReferrerDetails.Referrer.indexOf('"') > -1) {
            MainVisitorDetails.ReferrerDetails.Referrer = MainVisitorDetails.ReferrerDetails.Referrer.replace(/"/g, "\"");
        }

        if (MainVisitorDetails.ReferrerDetails.RefferDomain != undefined && MainVisitorDetails.ReferrerDetails.RefferDomain.length > 0 && MainVisitorDetails.ReferrerDetails.RefferDomain.indexOf('"') > -1) {
            MainVisitorDetails.ReferrerDetails.RefferDomain = MainVisitorDetails.ReferrerDetails.RefferDomain.replace(/"/g, "\"");
        }
    },
    CloseImpression: function (IframeId) {

        //FormUtil.ChangePropertyValue(MainVisitorDetails.BasicDetails);
        //FormUtil.ChangePropertyValue(MainVisitorDetails.WebSiteDetails);
        //FormUtil.ChangePropertyValue(MainVisitorDetails.ReferrerDetails);
        //FormUtil.ChangePropertyValue(MainVisitorDetails.UtmTagDetails);
        //FormUtil.ChangePropertyValue(MainVisitorDetails.EventDetails);
        //FormUtil.ChangePropertyValue(FormInfoDetails);

        if (IframeId != null && IframeId.length > 0) {

            var FormId = IframeId.split("_")[1];

            FormInfoDetails.FormId = parseInt(FormId);

            if (AllFormDetails != null && AllFormDetails.length > 0) {
                for (var i = 0; i < AllFormDetails.length; i++) {
                    if (AllFormDetails[i].banner != null && AllFormDetails[i].banner != "" && AllFormDetails[i].banner.FormId == FormId) {
                        FormInfoDetails.BannerId = AllFormDetails[i].banner.Id;
                        break;
                    }
                }
            }
        }

        FormUtil.ValidationVistorDetailsBeforeRequestAndChanges();

        var FormDetailsWithVisitorInfo = { FormInfoDetails: FormInfoDetails, MainVisitorDetails: MainVisitorDetails, answerDetails: [], Events: "" };

        var xhr = new XMLHttpRequest();
        xhr.open('Post', TrackerUrl.FormCloseImpressionUrl);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(FormDetailsWithVisitorInfo));
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                FormUtil.formHideEffect(IframeId);
                setTimeout(function () {
                    var IframeElement = document.getElementById(IframeId);

                    if (IframeElement != undefined && IframeElement != null) {
                        var innerDoc = IframeElement.contentDocument || IframeElement.contentWindow.document;

                        if (innerDoc != undefined && innerDoc.getElementById("dvMainContentDiv") != undefined && innerDoc.getElementById("dvMainContentDiv") != null) {
                            innerDoc.getElementById("dvMainContentDiv").innerHTML = "";
                        }
                        document.getElementById(IframeId).style.display = "none";
                    }
                }, 500);
            }
        };
    },
    validationOfForms: function (iframeid) {

        var IframeElement = document.getElementById(iframeid);
        var innerDoc = IframeElement.contentDocument || IframeElement.contentWindow.document;
        var blockemaildomainlist = "";

        if (innerDoc != undefined) {

            var FormId = iframeid.split("_")[1];

            if (AllFormDetails != null && AllFormDetails.length > 0) {
                for (var i = 0; i < AllFormDetails.length; i++) {
                    if (AllFormDetails[i].formDetails.Id == FormId) {
                        blockemaildomainlist = AllFormDetails[i].formDetails.BlockEmailIds;
                        formFieldsBindingDetails = AllFormDetails[i].formFieldsBindingDetails;
                        break;
                    }
                }
            }

            if (formFieldsBindingDetails != null && formFieldsBindingDetails.length > 0) {
                for (var i = 0; i < formFieldsBindingDetails.length; i++) {
                    if (formFieldsBindingDetails[i].Mandatory == 1) {

                        if (formFieldsBindingDetails[i].FieldType == 1 || formFieldsBindingDetails[i].FieldType == 2 || formFieldsBindingDetails[i].FieldType == 3 || formFieldsBindingDetails[i].FieldType == 4 || formFieldsBindingDetails[i].FieldType == 5 || formFieldsBindingDetails[i].FieldType == 6 || formFieldsBindingDetails[i].FieldType == 7 || formFieldsBindingDetails[i].FieldType == 21 || formFieldsBindingDetails[i].FieldType == 22 || formFieldsBindingDetails[i].FieldType == 23) {
                            if (innerDoc.getElementById("ui_Field" + i) != null) {
                                if (innerDoc.getElementById("ui_Field" + i).value.trim().length <= 0) {
                                    innerDoc.getElementById("uilblError" + i).style.display = "block";
                                    return false;
                                }
                                else {
                                    innerDoc.getElementById("uilblError" + i).style.display = "none";
                                }
                                if (formFieldsBindingDetails[i].FieldType == 2) {
                                    if (!FormUtil.ValidateEmailId(innerDoc.getElementById("ui_Field" + i).value.trim().replace(/ /g, ''))) {
                                        innerDoc.getElementById("uilblError" + i).innerHTML = "Please enter valid " + formFieldsBindingDetails[i].Name + "";
                                        innerDoc.getElementById("uilblError" + i).style.display = "block";
                                        return false;
                                    }

                                    if (blockemaildomainlist != null && blockemaildomainlist != "" && blockemaildomainlist.length > 0) {

                                        var blklength = blockemaildomainlist.split(',');

                                        for (var g = 0; g < blklength.length; g++) {

                                            let text = innerDoc.getElementById("ui_Field" + i).value.trim().replace(/ /g, '');
                                            let result = text.match(blklength[g]);

                                            if (result != null && result != "") {
                                                innerDoc.getElementById("uilblError" + i).innerHTML = "Please enter official " + formFieldsBindingDetails[i].Name + "";
                                                innerDoc.getElementById("uilblError" + i).style.display = "block";
                                                return false;
                                            }
                                        }
                                    }
                                }
                                else if (formFieldsBindingDetails[i].FieldType == 3) {
                                    if (!FormUtil.validateMobilNoWithExpressForEmbedForms(innerDoc.getElementById("ui_Field" + i).value.trim().replace(/ /g, ''), formFieldsBindingDetails[i].PhoneValidationType)) {
                                        innerDoc.getElementById("uilblError" + i).innerHTML = "Please enter valid " + formFieldsBindingDetails[i].Name + "";
                                        innerDoc.getElementById("uilblError" + i).style.display = "block";
                                        return false;
                                    }
                                }
                            }
                        }
                        else if (formFieldsBindingDetails[i].FieldType == 8) {
                            if (innerDoc.getElementById("ui_Field" + i) != null) {
                                var dropdowmvalue = innerDoc.getElementById("ui_Field" + i);
                                var optionSelIndex = dropdowmvalue.options[dropdowmvalue.selectedIndex].value;

                                if (optionSelIndex == 0) {
                                    innerDoc.getElementById("uilblError" + i).style.display = "block";
                                    return false;
                                }
                                else {
                                    innerDoc.getElementById("uilblError" + i).style.display = "none";
                                }
                            }
                        }
                        else if (formFieldsBindingDetails[i].FieldType == 9) {

                            if (innerDoc.getElementsByName("ui_Field" + i) != null) {

                                var radioelements = innerDoc.getElementsByName("ui_Field" + i + "");
                                var radioValue = false;

                                for (var j = 0; j < radioelements.length; j++) {
                                    if (radioelements[j].checked == true) {
                                        radioValue = true;
                                        break;
                                    }
                                }

                                if (!radioValue) {
                                    if (innerDoc.getElementById("uilblError" + i) != null)
                                        innerDoc.getElementById("uilblError" + i).style.display = "block";
                                    else
                                        innerDoc.getElementById("ui_lblThankYou").html("Please enter valid input");
                                    return false;
                                }
                                else {
                                    innerDoc.getElementById("uilblError" + i).style.display = "none";
                                    //innerDoc.getElementById("ui_lblThankYou").html("");
                                }
                            }
                        }
                        else if (formFieldsBindingDetails[i].FieldType == 10) {

                            if (innerDoc.getElementsByName("ui_Field" + i) != null) {

                                var checkboxelements = innerDoc.getElementsByName("ui_Field" + i + "");
                                var checkValue = false;

                                for (var k = 0; k < checkboxelements.length; k++) {
                                    if (checkboxelements[k].checked == true) {
                                        checkValue = true;
                                        break;
                                    }
                                }

                                if (!checkValue) {
                                    if (innerDoc.getElementById("uilblError" + i) != null)
                                        innerDoc.getElementById("uilblError" + i).style.display = "block";
                                    else
                                        innerDoc.getElementById("ui_lblThankYou").html("Please enter valid input");
                                    return false;
                                }
                                else {
                                    innerDoc.getElementById("uilblError" + i).style.display = "none";
                                    //innerDoc.getElementById("#ui_lblThankYou").html("");
                                }
                            }
                        }
                    }
                }
            }
        }
        return true;
    },
    getAnswerData: function (iframeid) {
        answerDatas.length = 0;

        var IframeElement = document.getElementById(iframeid);
        var innerDoc = IframeElement.contentDocument || IframeElement.contentWindow.document;

        if (innerDoc != undefined) {

            var FormId = iframeid.split("_")[1];

            if (AllFormDetails != null && AllFormDetails.length > 0) {
                for (var i = 0; i < AllFormDetails.length; i++) {
                    if (AllFormDetails[i].formDetails.Id == FormId) {
                        formFieldsBindingDetails = AllFormDetails[i].formFieldsBindingDetails;
                        break;
                    }
                }
            }

            if (formFieldsBindingDetails != null && formFieldsBindingDetails.length > 0) {
                for (var i = 0; i < formFieldsBindingDetails.length; i++) {
                    if (formFieldsBindingDetails[i].FieldType == 1 || formFieldsBindingDetails[i].FieldType == 2 || formFieldsBindingDetails[i].FieldType == 3 || formFieldsBindingDetails[i].FieldType == 4 || formFieldsBindingDetails[i].FieldType == 5 || formFieldsBindingDetails[i].FieldType == 6 || formFieldsBindingDetails[i].FieldType == 7 || formFieldsBindingDetails[i].FieldType == 21 || formFieldsBindingDetails[i].FieldType == 22 || formFieldsBindingDetails[i].FieldType == 23) {
                        answerDatas.push(FormUtil.CleanTextRemoveSpecialChar(innerDoc.getElementById("ui_Field" + i).value));
                    }
                    else if (formFieldsBindingDetails[i].FieldType == 8) {
                        if (innerDoc.getElementById("ui_Field" + i) != null) {
                            var dropdowmvalue = innerDoc.getElementById("ui_Field" + i);
                            var optionSelIndex = dropdowmvalue.options[dropdowmvalue.selectedIndex].value;

                            if (optionSelIndex != null && optionSelIndex != "")
                                answerDatas.push(FormUtil.CleanTextRemoveSpecialChar(optionSelIndex));
                            else
                                answerDatas.push("");
                        }
                    }
                    else if (formFieldsBindingDetails[i].FieldType == 9) {
                        if (innerDoc.getElementsByName("ui_Field" + i) != null) {

                            var radioelements = innerDoc.getElementsByName("ui_Field" + i + "");
                            var radioValue = "";

                            for (var j = 0; j < radioelements.length; j++) {
                                if (radioelements[j].checked == true) {
                                    radioValue = radioelements[j].value;
                                    break;
                                }
                            }

                            if (radioValue != null && radioValue != "" && radioValue.length > 0)
                                answerDatas.push(FormUtil.CleanTextRemoveSpecialChar(radioValue));
                            else
                                answerDatas.push("");
                        }
                    }
                    else if (formFieldsBindingDetails[i].FieldType == 10) {

                        if (innerDoc.getElementsByName("ui_Field" + i) != null) {

                            var checkboxelements = innerDoc.getElementsByName("ui_Field" + i + "");
                            var allCheckedValues = "";

                            for (var k = 0; k < checkboxelements.length; k++) {
                                if (checkboxelements[k].checked == true) {
                                    allCheckedValues += FormUtil.CleanTextRemoveSpecialChar(checkboxelements[k].value) + "|";
                                }
                            }

                            if (allCheckedValues != null && allCheckedValues != "" && allCheckedValues.length > 0) {
                                allCheckedValues = allCheckedValues.substring(0, allCheckedValues.length - 1);
                                answerDatas.push(allCheckedValues);
                            }
                            else {
                                answerDatas.push("NA");
                            }
                        }
                    }
                }
            }
        }
    },
    setFormCookie: function () {
        var formCookieName = "pfiveCampaignIdNew" + MainVisitorDetails.AccountId;
        var previousForms = TrackingUtil.GetCookie(formCookieName);
        if (previousForms != undefined)
            TrackingUtil.SetCookie(formCookieName, previousForms + "," + FormInfoDetails.FormId, 36500);
        else
            TrackingUtil.SetCookie(formCookieName, FormInfoDetails.FormId, 36500);
    },
    clearFields: function (iframeid) {
        var IframeElement = document.getElementById(iframeid);
        var innerDoc = IframeElement.contentDocument || IframeElement.contentWindow.document;

        if (innerDoc != undefined) {
            var inputtagvalues = innerDoc.getElementsByTagName("input");
            if (inputtagvalues != null && inputtagvalues.length > 0) {
                for (var i = 0; i < inputtagvalues.length; i++) {
                    if (inputtagvalues[i].type == "text") {
                        innerDoc.getElementById(inputtagvalues[i].id).value = "";
                    }
                    else if (inputtagvalues[i].type == "radio") {
                        innerDoc.getElementById(inputtagvalues[i].id).checked = false;
                    }
                    else if (inputtagvalues[i].type == "checkbox") {
                        innerDoc.getElementById(inputtagvalues[i].id).checked = false;
                    }
                }
            }

            var textareatagvalues = innerDoc.getElementsByTagName("textarea");

            if (textareatagvalues != null && textareatagvalues.length > 0) {
                for (var i = 0; i < textareatagvalues.length; i++) {
                    if (textareatagvalues[i].type == "textarea") {
                        innerDoc.getElementById(textareatagvalues[i].id).value = "";
                    }
                }
            }

            var selecttagvalues = innerDoc.getElementsByTagName("select");

            if (selecttagvalues != null && selecttagvalues.length > 0) {
                for (var i = 0; i < selecttagvalues.length; i++) {
                    if (selecttagvalues[i].nodeName.toLowerCase() == "select") {
                        innerDoc.getElementById(selecttagvalues[i].id).selectedIndex = 0;
                    }
                }
            }
        }
    },
    SaveResponseDetails: function (iframeid, FormType) {
        var formsaveresponsedetails = "";

        var IframeElement = document.getElementById(iframeid);
        var innerDoc = IframeElement.contentDocument || IframeElement.contentWindow.document;

        if (innerDoc != undefined) {
            onExitFormData = null;  //onexit form details
            // var previousFontStyle = innerDoc.getElementById("ui_btnSave").style.fontSize = "";

            if (FormType == 1) {
                var previousFontStyle = "";
                innerDoc.getElementById("ui_btnSave").setAttribute("disabled", true);
                innerDoc.getElementById("ui_btnSave").value = "Please wait...";
                innerDoc.getElementById("ui_btnSave").style.fontSize = "12px";
            }

            if (iframeid != null && iframeid.length > 0) {

                var FormId = iframeid.split("_")[1];

                FormInfoDetails.FormId = parseInt(FormId);

                if (AllFormDetails != null && AllFormDetails.length > 0) {
                    for (var i = 0; i < AllFormDetails.length; i++) {
                        if (AllFormDetails[i].banner != null && AllFormDetails[i].banner != "" && AllFormDetails[i].banner.FormId == FormId) {
                            FormInfoDetails.BannerId = AllFormDetails[i].banner.Id;
                            break;
                        }
                    }
                }

                FormInfoDetails.FormType = FormType;
            }

            var FormDetailsWithVisitorInfo = { FormInfoDetails: FormInfoDetails, MainVisitorDetails: MainVisitorDetails, answerDetails: answerDatas, Events: "" };

            var xhr = new XMLHttpRequest();
            xhr.open('Post', TrackerUrl.FormSaveUrl);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(JSON.stringify(FormDetailsWithVisitorInfo));
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    if (this.response != "" && this.response != null) {
                        formsaveresponsedetails = JSON.parse(this.response);

                        if (formsaveresponsedetails != null && formsaveresponsedetails.formDetails.EmbeddedFormOrPopUpFormOrTaggedForm == "EmbeddedForm") {
                            if (FormType == 1) {
                                FormUtil.clearFields(iframeid);
                                innerDoc.getElementById("ui_btnSave").style.fontSize = previousFontStyle;
                                innerDoc.getElementById("ui_btnSave").removeAttribute("disabled");
                                innerDoc.getElementById("ui_btnSave").value = "Submit";
                                innerDoc.getElementById("ui_btnSave").removeAttribute("style");
                            }

                            if (FormType == 1 || FormType == 2) {
                                if (formsaveresponsedetails.RedirectUrl != null && formsaveresponsedetails.RedirectUrl.length > 0) {
                                    if (formsaveresponsedetails.IsRedirectUrlNewWindow) {
                                        if (formsaveresponsedetails.RedirectUrl.indexOf("http") < 0)
                                            parent.window.open("http://" + formsaveresponsedetails.RedirectUrl, "_blank");
                                        else
                                            parent.window.open(formsaveresponsedetails.RedirectUrl, "_blank");
                                    }
                                    else {
                                        if (formsaveresponsedetails.RedirectUrl.indexOf("http") < 0)
                                            parent.window.location.href = "http://" + formsaveresponsedetails.RedirectUrl;
                                        else
                                            parent.window.location.href = formsaveresponsedetails.RedirectUrl;
                                    }
                                }
                            }
                            else if (FormType == 4) {
                                var FormId = iframeid.split("_")[1];

                                if (AllFormDetails != null && AllFormDetails.length > 0) {
                                    for (var i = 0; i < AllFormDetails.length; i++) {
                                        if (AllFormDetails[i].banner != null && AllFormDetails[i].banner != "" && AllFormDetails[i].banner.FormId == FormId) {

                                            if (AllFormDetails[i].banner.RedirectUrl != null && AllFormDetails[i].banner.RedirectUrl != "" && AllFormDetails[i].banner.RedirectUrl.length > 0) {
                                                if (AllFormDetails[i].banner.RedirectUrl.indexOf("http") < 0)
                                                    parent.window.location.href = "http://" + AllFormDetails[i].banner.RedirectUrl;
                                                else
                                                    parent.window.location.href = AllFormDetails[i].banner.RedirectUrl;
                                            }
                                            else if (formsaveresponsedetails.RedirectUrl != null && formsaveresponsedetails.RedirectUrl.length > 0) {
                                                if (formsaveresponsedetails.IsRedirectUrlNewWindow) {
                                                    if (formsaveresponsedetails.RedirectUrl.indexOf("http") < 0)
                                                        parent.window.open("http://" + formsaveresponsedetails.RedirectUrl, "_blank");
                                                    else
                                                        parent.window.open(formsaveresponsedetails.RedirectUrl, "_blank");
                                                }
                                                else {
                                                    if (formsaveresponsedetails.RedirectUrl.indexOf("http") < 0)
                                                        parent.window.location.href = "http://" + formsaveresponsedetails.RedirectUrl;
                                                    else
                                                        parent.window.location.href = formsaveresponsedetails.RedirectUrl;
                                                }
                                            }
                                        }
                                    }
                                }
                            }

                            setTimeout(function () { innerDoc.getElementById('lbldivthankyou_' + FormInfoDetails.FormId + '').style.display = "none"; }, 1000);
                        }
                        else {
                            //For Otp Form either true or false may come from otp so we have biforgetted
                            if (formsaveresponsedetails.formDetails.IsOTPForm && formsaveresponsedetails.OTPMessage != null && formsaveresponsedetails.OTPStatus != null) {
                                //Success
                                if (formsaveresponsedetails.OTPStatus) {
                                    IsOTPForm = 1;

                                    if (FormType == 1)
                                        FormUtil.setFormCookie();

                                    innerDoc.getElementById('ui_lblThankYouSuccErrIcon_' + FormId + '').innerHTML = "<i class='icon ion-ios-checkmark-outline'></i>";
                                    innerDoc.getElementById('ui_lblThankYou_' + FormInfoDetails.FormId + '').innerHTML = formsaveresponsedetails.OTPMessage;
                                    setTimeout(function () { innerDoc.getElementById('lbldivthankyou_' + FormInfoDetails.FormId + '').style.display = "none"; }, 3000);

                                    innerDoc.getElementById("ui_btnSave").style.fontSize = previousFontStyle;

                                    setTimeout(function () {
                                        if (formsaveresponsedetails.RedirectUrl != null && formsaveresponsedetails.RedirectUrl.length > 0) {
                                            if (formsaveresponsedetails.RedirectUrl.indexOf("http") < 0)
                                                parent.window.location.href = "http://" + formsaveresponsedetails.RedirectUrl;
                                            else
                                                parent.window.location.href = formsaveresponsedetails.RedirectUrl;
                                        }
                                        FormUtil.formHideEffect(iframeid);
                                    }, 2000);

                                    setTimeout(function () {
                                        if (formsaveresponsedetails.formDetails.OTPFormId > 0) {
                                            GetDetailsOTP(formsaveresponsedetails.formDetails.OTPFormId, formsaveresponsedetails.formDetails.FormType);
                                        }
                                    }, 3000);
                                }
                                else {
                                    if (AllFormDetails != null && AllFormDetails.length > 0) {
                                        for (var i = 0; i < AllFormDetails.length; i++) {
                                            if (AllFormDetails[i].formDetails != null && AllFormDetails[i].formDetails != "" && AllFormDetails[i].formDetails.Id == FormId) {

                                                if (AllFormDetails[i].formDetails.ButtonName != null && AllFormDetails[i].formDetails.ButtonName != "" && AllFormDetails[i].formDetails.ButtonName.length > 0)
                                                    innerDoc.getElementById("ui_btnSave").value = AllFormDetails[i].formDetails.ButtonName;
                                                else
                                                    innerDoc.getElementById("ui_btnSave").value = "Submit";

                                                break;
                                            }
                                        }
                                    }

                                    innerDoc.getElementById("ui_btnSave").removeAttribute("disabled");
                                    innerDoc.getElementById("ui_btnSave").removeAttribute("style");
                                    innerDoc.getElementById("ui_btnSave").style.fontSize = previousFontStyle;
                                    innerDoc.getElementById('ui_lblThankYouSuccErrIcon_' + FormInfoDetails.FormId + '').innerHTML = "<i class='icon ion-ios-close-outline'></i>";
                                    innerDoc.getElementById('ui_lblThankYou_' + FormInfoDetails.FormId + '').innerHTML = formsaveresponsedetails.OTPMessage;
                                    setTimeout(function () { innerDoc.getElementById('lbldivthankyou_' + FormInfoDetails.FormId + '').style.display = "none"; }, 3000);
                                }
                            }
                            else if (formsaveresponsedetails != null && formsaveresponsedetails.formDetails.EmbeddedFormOrPopUpFormOrTaggedForm == "PopUpForm") {
                                if (FormType == 1) {
                                    FormUtil.setFormCookie();
                                    innerDoc.getElementById("ui_btnSave").style.fontSize = previousFontStyle;
                                }

                                setTimeout(function () {
                                    if (formBasicDetails != undefined && FormType == 18 && (formsaveresponsedetails.RedirectUrl == null || formsaveresponsedetails.RedirectUrl == "")) {
                                        FormUtil.initializeMachineIdAndSessionRefeer();
                                        innerDoc.getElementById("#dvMainContentDiv").innerHTML = "";
                                        GetDetails();
                                    }
                                    else {
                                        if (FormType == 1 || FormType == 2) {
                                            if (formsaveresponsedetails.RedirectUrl != null && formsaveresponsedetails.RedirectUrl.length > 0) {
                                                if (formsaveresponsedetails.IsRedirectUrlNewWindow) {
                                                    if (formsaveresponsedetails.RedirectUrl.indexOf("http") < 0)
                                                        parent.window.open("http://" + formsaveresponsedetails.RedirectUrl, "_blank");
                                                    else
                                                        parent.window.open(formsaveresponsedetails.RedirectUrl, "_blank");
                                                }
                                                else {
                                                    if (formsaveresponsedetails.RedirectUrl.indexOf("http") < 0)
                                                        parent.window.location.href = "http://" + formsaveresponsedetails.RedirectUrl;
                                                    else
                                                        parent.window.location.href = formsaveresponsedetails.RedirectUrl;
                                                }
                                            }
                                        }
                                        else if (FormType == 4) {

                                            var FormId = iframeid.split("_")[1];

                                            if (AllFormDetails != null && AllFormDetails.length > 0) {
                                                for (var i = 0; i < AllFormDetails.length; i++) {
                                                    if (AllFormDetails[i].banner != null && AllFormDetails[i].banner != "" && AllFormDetails[i].banner.FormId == FormId) {

                                                        if (AllFormDetails[i].banner.RedirectUrl != null && AllFormDetails[i].banner.RedirectUrl != "" && AllFormDetails[i].banner.RedirectUrl.length > 0) {
                                                            if (AllFormDetails[i].banner.RedirectUrl.indexOf("http") < 0)
                                                                parent.window.location.href = "http://" + AllFormDetails[i].banner.RedirectUrl;
                                                            else
                                                                parent.window.location.href = AllFormDetails[i].banner.RedirectUrl;
                                                        }
                                                        else if (formsaveresponsedetails.RedirectUrl != null && formsaveresponsedetails.RedirectUrl.length > 0) {
                                                            if (formsaveresponsedetails.IsRedirectUrlNewWindow) {
                                                                if (formsaveresponsedetails.RedirectUrl.indexOf("http") < 0)
                                                                    parent.window.open("http://" + formsaveresponsedetails.RedirectUrl, "_blank");
                                                                else
                                                                    parent.window.open(formsaveresponsedetails.RedirectUrl, "_blank");
                                                            }
                                                            else {
                                                                if (formsaveresponsedetails.RedirectUrl.indexOf("http") < 0)
                                                                    parent.window.location.href = "http://" + formsaveresponsedetails.RedirectUrl;
                                                                else
                                                                    parent.window.location.href = formsaveresponsedetails.RedirectUrl;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    FormUtil.formHideEffect(iframeid);
                                }, 2000);
                            }
                        }
                    }
                    else {
                        for (var j = 0; j < AllFormDetails.length; j++) {
                            if (AllFormDetails[j].formDetails.Id == FormInfoDetails.FormId) {
                                if (AllFormDetails[j].formDetails.EmbeddedFormOrPopUpFormOrTaggedForm == "EmbeddedForm") {
                                    if (FormType == 1) {
                                        FormUtil.clearFields(iframeid);
                                        innerDoc.getElementById("ui_btnSave").style.fontSize = previousFontStyle;
                                        innerDoc.getElementById("ui_btnSave").removeAttribute("disabled");
                                        innerDoc.getElementById("ui_btnSave").value = "Submit";
                                        innerDoc.getElementById("ui_btnSave").removeAttribute("style");
                                        innerDoc.getElementById('lbldivthankyou_' + FormInfoDetails.FormId + '').style.display = "none";
                                    }
                                }
                                else {
                                    FormUtil.formHideEffect(iframeid);
                                }
                            }
                        }
                    }
                }
            };
        }
    },
    CheckthisConditionOnExitFormExists: function (IframeId) {
        if (parent.window.document != undefined && (parent.window.document.readyState === "interactive" || parent.window.document.readyState == "complete")) {
            var mouseY = 0;
            var topValue = 0;
            parent.window.addEventListener("mouseout", function (e) {
                mouseY = e.clientY;
                if (mouseY < topValue) {

                    if (IframeIds != null && IframeIds.length > 0) {
                        for (var i = 0; i < IframeIds.length; i++) {
                            if (document.getElementById(IframeIds[i]) == null && document.getElementById(IframeId).style.display == "none") {
                                if (formBasicDetails != null) {
                                    if (onExitFormData != null && formBasicDetails.Id != onExitFormData.formDetails.Id) {

                                        var IframeElement = document.getElementById(IframeId);
                                        if (IframeElement != undefined && IframeElement != null) {
                                            var innerDoc = IframeElement.contentDocument || IframeElement.contentWindow.document;

                                            if (innerDoc != undefined && innerDoc.getElementById("dvMainContentDiv") != undefined && innerDoc.getElementById("dvMainContentDiv") != null) {
                                                innerDoc.getElementById("dvMainContentDiv").innerHTML = "";
                                            }
                                        }
                                        FormUtil.CallingRespectiveForms(onExitFormData, IframeId);
                                    }
                                }
                                else if (onExitFormData != null && onExitFormData.formDetails.Id > 0) {
                                    FormUtil.CallingRespectiveForms(onExitFormData, IframeId);
                                }
                            }
                            else {
                                if (document.getElementById(IframeId) && document.getElementById(IframeId).style.display == "none") {

                                    if (AllFormDetails != null && AllFormDetails.length > 0 && IframeId != null) {
                                        var FormId = IframeId.split("_")[1];

                                        for (var j = 0; j < AllFormDetails.length; j++) {
                                            if (AllFormDetails[j].formDetails.Id == FormId) {
                                                onExitFormData["Visitor"] = AllFormDetails[j].Visitor;
                                                onExitFormData["banner"] = AllFormDetails[j].banner;
                                                onExitFormData["listExtraLinks"] = AllFormDetails[j].listExtraLinks;
                                                onExitFormData["APIKeyForClickToCall"] = AllFormDetails[j].APIKeyForClickToCall;
                                                onExitFormData["formDetails"] = AllFormDetails[j].formDetails;
                                                onExitFormData["formFieldsBindingDetails"] = AllFormDetails[j].formFieldsBindingDetails;
                                                onExitFormData["formFields"] = AllFormDetails[j].formFields;
                                            }
                                        }
                                    }

                                    if (formBasicDetails != null) {
                                        if (onExitFormData != null && formBasicDetails.Id != onExitFormData.formDetails.Id) {

                                            var IframeElement = document.getElementById(IframeId);
                                            if (IframeElement != undefined && IframeElement != null) {
                                                var innerDoc = IframeElement.contentDocument || IframeElement.contentWindow.document;

                                                if (innerDoc != undefined && innerDoc.getElementById("dvMainContentDiv") != undefined && innerDoc.getElementById("dvMainContentDiv") != null) {
                                                    innerDoc.getElementById("dvMainContentDiv").innerHTML = "";
                                                }
                                            }
                                            FormUtil.CallingRespectiveForms(onExitFormData, IframeId);
                                        }
                                    }
                                    else if (onExitFormData != null && onExitFormData.formDetails.Id > 0) {
                                        FormUtil.CallingRespectiveForms(onExitFormData, IframeId);
                                    }
                                }
                            }
                        }
                    }
                    else {
                        if (document.getElementById(IframeId) && document.getElementById(IframeId).style.display == "none") {

                            if (AllFormDetails != null && AllFormDetails.length > 0 && IframeId != null) {
                                var FormId = IframeId.split("_")[1];

                                for (var j = 0; j < AllFormDetails.length; j++) {
                                    if (AllFormDetails[j].formDetails.Id == FormId) {
                                        onExitFormData["Visitor"] = AllFormDetails[j].Visitor;
                                        onExitFormData["banner"] = AllFormDetails[j].banner;
                                        onExitFormData["listExtraLinks"] = AllFormDetails[j].listExtraLinks;
                                        onExitFormData["APIKeyForClickToCall"] = AllFormDetails[j].APIKeyForClickToCall;
                                        onExitFormData["formDetails"] = AllFormDetails[j].formDetails;
                                        onExitFormData["formFieldsBindingDetails"] = AllFormDetails[j].formFieldsBindingDetails;
                                        onExitFormData["formFields"] = AllFormDetails[j].formFields;
                                    }
                                }
                            }

                            if (formBasicDetails != null) {
                                if (onExitFormData != null && formBasicDetails.Id != onExitFormData.formDetails.Id) {

                                    var IframeElement = document.getElementById(IframeId);
                                    if (IframeElement != undefined && IframeElement != null) {
                                        var innerDoc = IframeElement.contentDocument || IframeElement.contentWindow.document;

                                        if (innerDoc != undefined && innerDoc.getElementById("dvMainContentDiv") != undefined && innerDoc.getElementById("dvMainContentDiv") != null) {
                                            innerDoc.getElementById("dvMainContentDiv").innerHTML = "";
                                        }
                                    }
                                    FormUtil.CallingRespectiveForms(onExitFormData, IframeId);
                                }
                            }
                            else if (onExitFormData != null && onExitFormData.formDetails.Id > 0) {
                                FormUtil.CallingRespectiveForms(onExitFormData, IframeId);
                            }
                        }
                    }
                }
            },
                false);
        }
    },
    GetStaticFormIdsToDisplay: function () {
        var tagObject = document.getElementsByTagName("div");
        var staticformsids = "";
        for (var i = 0; i < tagObject.length; i++) {
            if (tagObject[i].getAttribute("plumb5") != null && tagObject[i].getAttribute("plumb5") != undefined) {
                staticformsids = tagObject[i].getAttribute("plumb5formidentifier");
                FormType = tagObject[i].getAttribute("formtype");
                MainVisitorDetails.StaticFormIds.push(staticformsids);
                FormUtil.CreateStaticIframe(tagObject[i], "Plumb5FromCampaign_" + staticformsids + "", staticformsids, "display:none;", FormType);
            }

            if (tagObject[i].getAttribute("data-plumb5") != null && tagObject[i].getAttribute("data-plumb5") != undefined) {
                datastaticformsids = tagObject[i].getAttribute("data-plumb5formidentifier");
                FormType = tagObject[i].getAttribute("formtype");
                MainVisitorDetails.StaticFormIds.push(datastaticformsids);
                FormUtil.CreateStaticIframe(tagObject[i], "Plumb5FromCampaign_" + datastaticformsids + "", datastaticformsids, "display:none;", FormType);
            }
        }
    },
    CreateStaticIframe: function (tagObject, iframeId, findFormId, styleProperty, FormType) {
        var p5iframe = document.createElement('iframe');
        p5iframe.name = findFormId;
        p5iframe.setAttribute("name", findFormId);
        p5iframe.id = iframeId; p5iframe.scrolling = "no"; p5iframe.frameborder = "0"; p5iframe.marginwidth = "0"; p5iframe.marginheight = "0"; p5iframe.allowtransparency = true; p5iframe.setAttribute("style", styleProperty); p5iframe.style.border = "none";
        p5iframe.setAttribute("FormType", FormType);
        tagObject.appendChild(p5iframe);
    },
    AppendScriptDetails: function (response) {
        if (response != null && response.length > 0) {
            for (var i = 0; i < response.length; i++) {

                if (response[i].FormScriptType == 1) {
                    if (response[i].FormScript != null) {
                        FormUtil.AppnedContent(document, response[i].FormScript, "ui_CustomScriptId_" + i + "");
                    }
                }
                else if (response[i].FormScriptType == 2) {
                    if (response[i].FormScript != null) {
                        var divForm = document.createElement('div');
                        divForm.id = "dvPlumb5InPageScript" + response[i].FormId;
                        divForm.setAttribute("plumb5formidentifier", response[i].FormId);
                        divForm.setAttribute("tagselection", response[i].ConfigurationDetails);
                        document.querySelectorAll(response[i].ConfigurationDetails)[0].appendChild(divForm);
                        FormUtil.P5ExternalLoadInpageForms(response[i].FormId, response[i].ConfigurationDetails);
                    }
                }
            }
            try {
                FormUtil.P5CallFunctionAfterLoading();
            }
            catch (Error) {
                window.console.log(Error);
            }
        }
    },
    AppnedContent: function (iframeDocumnet, content, scriptId) {
        var js, headTag = iframeDocumnet.getElementsByTagName("head")[0];
        js = iframeDocumnet.createElement('script');
        js.type = 'text/javascript';
        js.innerHTML = content
        js.setAttribute("id", scriptId);
        if (!iframeDocumnet.getElementById(scriptId)) {
            headTag.appendChild(js);
        }
    },
    P5ExternalLoadInpageForms: function (formId, tagSelection) {
        var tagObject = document.getElementsByTagName("div");
        for (var i = 0; i < tagObject.length; i++) {
            if (tagObject[i].getAttribute("plumb5formidentifier") != null && tagObject[i].getAttribute("tagselection") != undefined && tagObject[i].getAttribute("tagselection") == tagSelection) {
                var findFormId = tagObject[i].getAttribute("plumb5formidentifier");
                if (findFormId == formId) {
                    FormUtil.CreateStaticIframe(tagObject[i], "Plumb5FromCampaign" + findFormId + "", findFormId, "");
                }
            }
        }
    },
    P5CallFunctionAfterLoading: function () {
        try {
            FormUtil.OnSubmitEventExtended();
        }
        catch (err) {
        }
    },
    OnSubmitEventExtended: function (eventType) {
        window.console.log("OnSubmitEventExtended")
        if (parent.P5FormDatalistExtended != undefined && parent.P5FormDatalistExtended.length > 0) {
            P5FormDatalist = parent.P5FormDatalistExtended;
            FormUtil.CustomisedAutoIntializeFunctionWithParamerter();
        }
    },
    CustomisedAutoIntializeFunctionWithParamerter: function () {
        for (var i = 0; i < P5FormDatalist.length; i++) {
            window.console.log(i);
            InPageOTPForm = 0;

            var Plumb5FieldsData = P5FormDatalist[i].FieldsList;
            var Fields = P5FormDatalist[i].Fields;
            var Mandatory = P5FormDatalist[i].Mandatory;
            var ButtonTagName = P5FormDatalist[i].ButtonTag;
            var eventType = P5FormDatalist[i].eventType;
            var timoutvalue = P5FormDatalist[i].timeout;
            var OnchangeTarget = P5FormDatalist[i].OnchangeTarget;
            var FormTrackingindex = i;
            var FormId = P5FormDatalist[i].FormId;
            var FormType = P5FormDatalist[i].FormType;
            var SelectionType = P5FormDatalist[i].SelectionType;
            var AttributesList = P5FormDatalist[i].AttributesList;
            var SelectorType = P5FormDatalist[i].SelectorType;

            for (var j = 0; j < Fields.length; j++) {
                if (Fields[j] == 23) {
                    InPageOTPForm = 1;
                    break;
                }
            }

            if (InPageOTPForm == 1) {
                window.console.log("OtpCalled");
                FormUtil.CustomisedAutoEventFromParentForOtp(eventType, ButtonTagName, Plumb5FieldsData, Fields, Mandatory, timoutvalue, OnchangeTarget, FormTrackingindex, FormId, FormType, SelectionType, AttributesList, SelectorType);
            }
            else {
                window.console.log("NormalCalled");
                FormUtil.CustomisedAutoEventFromParent(eventType, ButtonTagName, Plumb5FieldsData, Fields, Mandatory, timoutvalue, OnchangeTarget, FormTrackingindex, FormId, FormType, SelectionType, AttributesList, SelectorType);
            }
        }
    },
    CustomisedAutoEventFromParentForOtp: function (eventType, buttonTagName, Plumb5FieldsData, Fields, Mandatory, timoutvalue, OnchangeTarget, FormTrackingindex, FormId, FormType, SelectionType, AttributesList, SelectorType) {

        for (var index in eventType) {
            var formevent = eventType[index].toLowerCase();
            if (formevent != 'onexit' && formevent != 'onchange') {
                document.querySelector(buttonTagName, parent.window.document).addEventListener(eventType[index], function (event) {
                    FormUtil.CustomisedAutoOTPSaveData(event, Plumb5FieldsData, Fields, Mandatory, FormTrackingindex, FormId, FormType, buttonTagName, SelectionType, AttributesList, timoutvalue, SelectorType);
                });
            }
            else if (formevent == 'onexit') {
                document.addEventListener("DOMContentLoaded", function () {
                    var mouseY = 0;
                    var topValue = 0;
                    parent.window.addEventListener("mouseout", function (e) {
                        mouseY = e.clientY;
                        if (mouseY < topValue) {
                            FormUtil.CustomisedAutoOTPSaveData(event, Plumb5FieldsData, Fields, Mandatory, FormTrackingindex, FormId, FormType, buttonTagName, SelectionType, AttributesList, timoutvalue, SelectorType);
                        }
                    },
                        false);
                });
            }
            if (formevent == "onchange") {
                document.querySelector(OnchangeTarget, parent.window.document).addEventListener("change", function (event) {
                    setTimeout(function () {
                        FormUtil.CustomisedAutoOTPSaveData(event, Plumb5FieldsData, Fields, Mandatory, FormTrackingindex, FormId, FormType, buttonTagName, SelectionType, AttributesList, 0, SelectorType)
                    }, timoutvalue);
                });
            }
        }
    },
    CustomisedAutoEventFromParent: function (eventType, buttonTagName, Plumb5FieldsData, Fields, Mandatory, timoutvalue, OnchangeTarget, FormTrackingindex, FormId, FormType, SelectionType, AttributesList, SelectorType) {
        for (var index in eventType) {
            var formevent = eventType[index].toLowerCase();
            if (formevent != 'onexit' && formevent != 'onchange') {
                document.querySelector(buttonTagName, parent.window.document).addEventListener(eventType[index], function (event) {
                    FormUtil.CustomisedAutoSaveData(event, Plumb5FieldsData, Fields, Mandatory, FormTrackingindex, FormId, FormType, buttonTagName, SelectionType, AttributesList, timoutvalue, SelectorType);
                });
            }
            else if (formevent == 'onexit') {
                document.addEventListener("DOMContentLoaded", function () {
                    var mouseY = 0;
                    var topValue = 0;
                    parent.window.addEventListener("mouseout", function (e) {
                        mouseY = e.clientY;
                        if (mouseY < topValue) {
                            FormUtil.CustomisedAutoSaveData(e, Plumb5FieldsData, Fields, Mandatory, FormTrackingindex, FormId, FormType, buttonTagName, SelectionType, AttributesList, timoutvalue, SelectorType);
                        }
                    },
                        false);
                });
            }
            if (formevent == "onchange") {
                document.querySelector(OnchangeTarget, parent.window.document).addEventListener("change", function (event) {
                    setTimeout(function () {
                        FormUtil.CustomisedAutoSaveData(e, Plumb5FieldsData, Fields, Mandatory, FormTrackingindex, FormId, FormType, buttonTagName, SelectionType, AttributesList, timoutvalue, SelectorType);
                    }, timoutvalue);
                });
            }
        }
    },
    CustomisedAutoValidationForData: function (FieldsNames, FieldTypes, Mandatory, SelectionType, AttributesList, SelectorType, FormId) {
        for (var i = 0; i < FieldsNames.length; i++) {

            if (FieldTypes[i] == 1 || FieldTypes[i] == 2 || FieldTypes[i] == 3 || FieldTypes[i] == 4 || FieldTypes[i] == 5 || FieldTypes[i] == 6 || FieldTypes[i] == 7 || FieldTypes[i] == 21 || FieldTypes[i] == 22 || FieldTypes[i] == 23) {
                if (Mandatory[i].IsMandatory == true) {

                    //For Value
                    if (SelectionType[i] == 1) {
                        if (document.querySelectorAll(FieldsNames[i], parent.window.document).length > 0) {
                            if (document.querySelector(FieldsNames[i], parent.window.document).value.trim().length <= 0) {
                                return false;
                            }
                            if (FieldTypes[i] == 2) {
                                if (!FormUtil.ValidateEmailId(document.querySelector(FieldsNames[i], parent.window.document).value)) {
                                    return false;
                                }

                                var blockemaildomainlist = "";

                                if (AllFormDetails != null && AllFormDetails.length > 0) {
                                    for (var p = 0; p < AllFormDetails.length; p++) {
                                        if (AllFormDetails[p].formDetails.Id == FormId) {
                                            blockemaildomainlist = AllFormDetails[p].formDetails.BlockEmailIds;
                                            break;
                                        }
                                    }
                                }

                                if (blockemaildomainlist != null && blockemaildomainlist != "" && blockemaildomainlist.length > 0) {

                                    var blklength = blockemaildomainlist.split(',');

                                    for (var g = 0; g < blklength.length; g++) {

                                        let text = innerDoc.getElementById("ui_Field" + i).value.trim().replace(/ /g, '');
                                        let result = text.match(blklength[g]);

                                        if (result != null && result != "") {
                                            return false;
                                        }
                                    }
                                }
                            }
                            else if (FieldTypes[i] == 3) {
                                if (!FormUtil.validateMobilNoWithExpress(document.querySelector(FieldsNames[i], parent.window.document).value, Mandatory[i])) {
                                    return false;
                                }
                            }
                        }
                        else {
                            return false;
                        }
                    }
                    else if (SelectionType[i] == 2 && AttributesList[i] != null && AttributesList[i] != "" && AttributesList[i] != undefined && AttributesList[i].length > 0) {  //For Attribute
                        if (document.querySelector(FieldsNames[i] + "[" + AttributesList[i] + "]", parent.window.document).length > 0) {
                            if (document.querySelector(FieldsNames[i], parent.window.document).getAttribute(AttributesList[i]).length <= 0) {
                                return false;
                            }
                            if (FieldTypes[i] == 2) {
                                if (!FormUtil.ValidateEmailId(document.querySelector(FieldsNames[i], parent.window.document).getAttribute(AttributesList[i]))) {
                                    return false;
                                }
                            }
                            else if (FieldTypes[i] == 3) {
                                if (!FormUtil.validateMobilNoWithExpress(document.querySelector(FieldsNames[i], parent.window.document).getAttribute(AttributesList[i]), Mandatory[i])) {
                                    return false;
                                }
                            }
                        }
                        else {
                            return false;
                        }
                    }
                }
            }
            else if (FieldTypes[i] == 8 && Mandatory[i].IsMandatory == true) {
                if (document.querySelectorAll(FieldsNames[i], parent.window.document).length > 0) {

                    if (document.querySelector(FieldsNames[i], parent.window.document).querySelectorAll("option").length == 1)
                        return true;

                    if (document.querySelector(FieldsNames[i], parent.window.document).selectedIndex == 0)
                        return false;

                    if (SelectionType[i] == 2 && AttributesList[i] != null && AttributesList[i] != "" && AttributesList[i] != undefined && AttributesList[i].length > 0) {  //For Attribute
                        if (document.querySelector(FieldsNames[i] + " option:checked", parent.window.document).getAttribute(AttributesList[i]) == undefined) {
                            return false;
                        }
                    }
                }
                else {
                    return false;
                }
            }
            else if (FieldTypes[i] == 9 && Mandatory[i].IsMandatory == true) {
                if (document.querySelectorAll(FieldsNames[i], parent.window.document).length > 0) {
                    if (!document.querySelectorAll(FieldsNames[i] + ":checked", parent.window.document).length) {
                        return false;
                    }
                }
                else {
                    return false;
                }
            }
            else if (FieldTypes[i] == 10 && Mandatory[i].IsMandatory == true) {
                if (document.querySelectorAll(FieldsNames[i], parent.window.document).length > 0) {
                    if (!document.querySelectorAll(FieldsNames[i] + ":checked", parent.window.document).length) {
                        return false;
                    }
                }
                else {
                    return false;
                }
            }
        }
        return true;
    },
    CustomisedAutoGetAnswerDetails: function (FieldsNames, FieldTypes, Mandatory, SelectionType, AttributesList, SelectorType) {
        answerDatas.length = 0;
        for (var i = 0; i < FieldsNames.length; i++) {
            if (FieldTypes[i] == 1 || FieldTypes[i] == 2 || FieldTypes[i] == 3 || FieldTypes[i] == 4 || FieldTypes[i] == 5 || FieldTypes[i] == 6 || FieldTypes[i] == 7 || FieldTypes[i] == 21 || FieldTypes[i] == 22 || FieldTypes[i] == 23) {

                if (SelectionType[i] == 1) {  // For Value

                    if (document.querySelector(FieldsNames[i], parent.window.document).value != null && document.querySelector(FieldsNames[i], parent.window.document).value != "" && document.querySelector(FieldsNames[i], parent.window.document).value != undefined && document.querySelector(FieldsNames[i], parent.window.document).value.length > 0) {
                        answerDatas.push(FormUtil.CleanTextRemoveSpecialChar(document.querySelector(FieldsNames[i], parent.window.document).value));
                    }
                    else {
                        answerDatas.push("");
                    }
                }
                else if (SelectionType[i] == 2 && AttributesList[i] != null && AttributesList[i] != "" && AttributesList[i] != undefined && AttributesList[i].length > 0) {  //For Attribute
                    if (document.querySelector(FieldsNames[i], parent.window.document).getAttribute(AttributesList[i]) != null && document.querySelector(FieldsNames[i], parent.window.document).getAttribute(AttributesList[i]) != "" && document.querySelector(FieldsNames[i], parent.window.document).getAttribute(AttributesList[i]) != undefined) {
                        answerDatas.push(FormUtil.CleanTextRemoveSpecialChar(document.querySelector(FieldsNames[i], parent.window.document).getAttribute(AttributesList[i])));
                    }
                    else {
                        answerDatas.push("");
                    }
                }
            }
            else if (FieldTypes[i] == 8) {
                if (SelectionType[i] == 1) { //Value
                    if (document.querySelector(FieldsNames[i], parent.window.document).value != undefined && document.querySelector(FieldsNames[i], parent.window.document).value != null && document.querySelector(FieldsNames[i], parent.window.document).value != "" && document.querySelector(FieldsNames[i], parent.window.document).value.length > 0) {
                        answerDatas.push(FormUtil.CleanTextRemoveSpecialChar(document.querySelector(FieldsNames[i] + " option:checked", parent.window.document).value));
                    }
                    else {
                        answerDatas.push("");
                    }
                }
                else if (SelectionType[i] == 2 && AttributesList[i] != null && AttributesList[i] != "" && AttributesList[i] != undefined && AttributesList[i].length > 0) {  //For Attribute
                    if (document.querySelector(FieldsNames[i], parent.window.document).getAttribute(AttributesList[i]) != undefined) {
                        answerDatas.push(FormUtil.CleanTextRemoveSpecialChar(document.querySelector(FieldsNames[i] + " option:checked", parent.window.document).getAttribute(AttributesList[i])));
                    }
                    else {
                        answerDatas.push("");
                    }
                }
                else if (SelectionType[i] == 3) { //text
                    if (document.querySelector(FieldsNames[i], parent.window.document).textContent != undefined && document.querySelector(FieldsNames[i], parent.window.document).textContent != null && document.querySelector(FieldsNames[i], parent.window.document).textContent != "" && document.querySelector(FieldsNames[i], parent.window.document).textContent.length > 0) {
                        answerDatas.push(FormUtil.CleanTextRemoveSpecialChar(document.querySelector(FieldsNames[i] + " option:checked", parent.window.document).text));
                    }
                    else {
                        answerDatas.push("");
                    }
                }
            }

            else if (FieldTypes[i] == 9) {
                if (SelectionType[i] == 1) { //Value

                    if (SelectorType[i] == 2 || SelectorType[i] == 4 || SelectorType[i] == 6) { // here values are taken on next tag maybe lable or span tag

                        if (document.querySelector(FieldsNames[i] + ":checked", parent.window.document) != null && document.querySelector(FieldsNames[i] + ":checked", parent.window.document).nextElementSibling.textContent != null && document.querySelector(FieldsNames[i] + ":checked", parent.window.document).nextElementSibling.textContent != "" && document.querySelector(FieldsNames[i] + ":checked", parent.window.document).nextElementSibling.textContent != undefined && document.querySelector(FieldsNames[i] + ":checked", parent.window.document).nextElementSibling.textContent.length > 0) {
                            answerDatas.push(FormUtil.CleanTextRemoveSpecialChar(document.querySelector(FieldsNames[i] + ":checked", parent.window.document).nextElementSibling.textContent));
                        }
                        else {
                            answerDatas.push("");
                        }
                    }
                    else {
                        if (document.querySelector(FieldsNames[i] + ":checked", parent.window.document).value != null && document.querySelector(FieldsNames[i] + ":checked", parent.window.document).value != "" && document.querySelector(FieldsNames[i] + ":checked", parent.window.document).value != undefined && document.querySelector(FieldsNames[i] + ":checked", parent.window.document).value.length > 0) {
                            answerDatas.push(FormUtil.CleanTextRemoveSpecialChar(document.querySelector(FieldsNames[i] + ":checked", parent.window.document).value));
                        }
                        else {
                            answerDatas.push("");
                        }
                    }
                }
                else if (SelectionType[i] == 4) {  //checked status
                    if (document.querySelector(FieldsNames[i] + ":checked", parent.window.document).value != undefined && document.querySelector(FieldsNames[i] + ":checked", parent.window.document).value != null && document.querySelector(FieldsNames[i] + ":checked", parent.window.document).value != "" && document.querySelector(FieldsNames[i] + ":checked", parent.window.document).value.length > 0) {
                        answerDatas.push(FormUtil.CleanTextRemoveSpecialChar(document.querySelector(FieldsNames[i] + ":checked", parent.window.document).value));
                    }
                    else {
                        answerDatas.push("off");
                    }
                }
            }
            else if (FieldTypes[i] == 10) {
                if (SelectionType[i] == 1) { //Value
                    if (SelectorType[i] == 2 || SelectorType[i] == 4 || SelectorType[i] == 6) { // here values are taken on next tag maybe lable or span tag
                        if (document.querySelector(FieldsNames[i] + ":checked", parent.window.document) != null && document.querySelector(FieldsNames[i] + ":checked", parent.window.document).nextElementSibling.textContent.length) {
                            var checkboxelements = document.querySelectorAll(FieldsNames[i] + ":checked", parent.window.document);
                            var allCheckedValues = "";

                            for (var k = 0; k < checkboxelements.length; k++) {
                                if (checkboxelements[k].checked == true) {
                                    allCheckedValues += FormUtil.CleanTextRemoveSpecialChar(checkboxelements[k].nextElementSibling.textContent) + "|";
                                }
                            }

                            if (allCheckedValues != null && allCheckedValues != "" && allCheckedValues.length > 0) {
                                allCheckedValues = allCheckedValues.substring(0, allCheckedValues.length - 1);
                                answerDatas.push(allCheckedValues);
                            }
                            else {
                                answerDatas.push("");
                            }
                        }
                        else {
                            answerDatas.push("");
                        }
                    }
                    else {
                        if (document.querySelector(FieldsNames[i] + ":checked", parent.window.document).value) {

                            var checkboxelements = document.querySelectorAll(FieldsNames[i] + ":checked", parent.window.document);
                            var allCheckedValues = "";

                            for (var k = 0; k < checkboxelements.length; k++) {
                                if (checkboxelements[k].checked == true) {
                                    allCheckedValues += FormUtil.CleanTextRemoveSpecialChar(checkboxelements[k].value) + "|";
                                }
                            }

                            if (allCheckedValues != null && allCheckedValues != "" && allCheckedValues.length > 0) {
                                allCheckedValues = allCheckedValues.substring(0, allCheckedValues.length - 1);
                                answerDatas.push(allCheckedValues);
                            }
                            else {
                                answerDatas.push("");
                            }
                        }
                        else {
                            answerDatas.push("");
                        }
                    }
                }
                else if (SelectionType[i] == 4) {//checked status
                    if (document.querySelector(FieldsNames[i] + ":checked", parent.window.document).value != undefined && document.querySelector(FieldsNames[i] + ":checked", parent.window.document).value != null && document.querySelector(FieldsNames[i] + ":checked", parent.window.document).value != "" && document.querySelector(FieldsNames[i] + ":checked", parent.window.document).value.length > 0) {
                        answerDatas.push(FormUtil.CleanTextRemoveSpecialChar(document.querySelector(FieldsNames[i] + ":checked", parent.window.document).value));
                    }
                    else {
                        answerDatas.push("off");
                    }
                }
            }
        }
    },
    CustomisedAutoSaveData: function (event, Plumb5FieldsData, Fields, Mandatory, FormTrackingindex, FormId, FormType, buttonTagName, SelectionType, AttributesList, timoutvalue, SelectorType) {
        try {
            if (FormUtil.CustomisedAutoValidationForData(Plumb5FieldsData, Fields, Mandatory, SelectionType, AttributesList, SelectorType, FormId)) {
                FormUtil.CustomisedAutoGetAnswerDetails(Plumb5FieldsData, Fields, Mandatory, SelectionType, AttributesList, SelectorType);
                FormInfoDetails.FormId = FormId;
                FormInfoDetails.FormType = FormType;

                if (!P5FormDatalist[FormTrackingindex].isStaticCalled) {

                    if (event.type == "click") {
                        if (event.preventDefault)
                            event.preventDefault();
                        else
                            event.returnValue = false;

                        var FormDetailsWithVisitorInfo = { FormInfoDetails: FormInfoDetails, MainVisitorDetails: MainVisitorDetails, answerDetails: answerDatas, Events: "" };

                        var xhr = new XMLHttpRequest();
                        xhr.open('Post', TrackerUrl.FormSaveUrl);
                        xhr.setRequestHeader("Content-Type", "application/json");
                        xhr.send(JSON.stringify(FormDetailsWithVisitorInfo));
                        xhr.onreadystatechange = function () {
                            if (xhr.readyState === 4 && xhr.status === 200) {
                                if (this.response != null) {
                                    formsaveresponsedetails = JSON.parse(this.response);

                                    if (formsaveresponsedetails.formDetails.Id != null) {
                                        document.querySelector(buttonTagName, parent.window.document).click(event.type);
                                    }
                                    //**************** To Show In Page Form Message ********************
                                    if (typeof ShowSuccessErrorMessage == 'function')
                                        ShowSuccessErrorMessage(formsaveresponsedetails.OTPMessage);
                                    else
                                        window.console.log('function not exist');
                                    //************************************************************
                                }
                            }
                        }
                        if (timoutvalue > 0) {
                            setTimeout(function () {
                                p.abort();
                                document.querySelector(buttonTagName, parent.window.document).click(event.type);
                            }, timoutvalue);
                        }
                    }
                    else {
                        var xhr = new XMLHttpRequest();
                        xhr.open('Post', TrackerUrl.FormSaveUrl);
                        xhr.setRequestHeader("Content-Type", "application/json");
                        xhr.send(JSON.stringify(FormDetailsWithVisitorInfo));
                        xhr.onreadystatechange = function () {
                        }
                    }
                    P5FormDatalist[FormTrackingindex].isStaticCalled = true;
                }
            }
        }
        catch (err) {
            FormUtil.FormScriptErrorLog(Error, FormId);
        }
    },
    CustomisedAutoOTPSaveData: function (event, Plumb5FieldsData, Fields, Mandatory, FormTrackingindex, FormId, FormType, buttonTagName, SelectionType, AttributesList, timoutvalue, SelectorType) {
        try {
            if (FormUtil.CustomisedAutoValidationForData(Plumb5FieldsData, Fields, Mandatory, SelectionType, AttributesList, SelectorType, FormId)) {
                FormUtil.CustomisedAutoGetAnswerDetails(Plumb5FieldsData, Fields, Mandatory, SelectionType, AttributesList, SelectorType);
                FormInfoDetails.FormId = FormId;
                FormInfoDetails.FormType = FormType;

                if (!P5FormDatalist[FormTrackingindex].isStaticCalled) {

                    var FormDetailsWithVisitorInfo = { FormInfoDetails: FormInfoDetails, MainVisitorDetails: MainVisitorDetails, answerDetails: answerDatas, Events: "" };

                    if (event.type == "click") {
                        if (event.preventDefault)
                            event.preventDefault();
                        else
                            event.returnValue = false;

                        var xhr = new XMLHttpRequest();
                        xhr.open('Post', TrackerUrl.SaveOTPFormUrl);
                        xhr.setRequestHeader("Content-Type", "application/json");
                        xhr.send(JSON.stringify(FormDetailsWithVisitorInfo));
                        xhr.onreadystatechange = function () {
                            if (xhr.readyState === 4 && xhr.status === 200) {
                                if (this.response != null) {
                                    formsaveresponsedetails = JSON.parse(this.response);
                                    if (formsaveresponsedetails.OTPStatus) {
                                        document.querySelector(buttonTagName, parent.window.document).click(event.type);
                                    }
                                }
                            }
                        };

                        if (timoutvalue > 0) {
                            setTimeout(function () {
                                p.abort();
                                document.querySelector(buttonTagName, parent.window.document).click(event.type);
                            }, timoutvalue);
                        }
                    }
                    else {
                        var xhr = new XMLHttpRequest();
                        xhr.open('Post', TrackerUrl.SaveOTPFormUrl);
                        xhr.setRequestHeader("Content-Type", "application/json");
                        xhr.send(JSON.stringify(FormDetailsWithVisitorInfo));
                        xhr.onreadystatechange = function () {
                        }
                    }
                    P5FormDatalist[FormTrackingindex].isStaticCalled = true;
                }
            }
        }
        catch (err) {
            FormUtil.FormScriptErrorLog(Error, FormId);
        }
    },
    FormScriptErrorLog: function (Error, FormId) {
        var xmlhttp = new XMLHttpRequest();
        var error = "PageUrl - " + MainVisitorDetails.WebSiteDetails.Url + " + Error - " + Error + "";
        var params = "AdsId=" + MainVisitorDetails.AccountId + "&FormId=" + FormId + "&Errorlog=" + error + "";
        //var url = TrackerUrl.ScriptErrorLog + "?AdsId=" + MainVisitorDetails.AccountId + "&FormId=" + FormId + "&Errorlog=" + error + "";
        xmlhttp.open('Post', TrackerUrl.ScriptErrorLog);
        xmlhttp.setRequestHeader("Content-Type", "application/json");
        xmlhttp.send(params);
        xmlhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
            }
        }
    }
};

var TrackingUtil = {
    BasicInitialize: function () {

        TrackingUtil.MainVisitorDetailsInitialize();
        TrackingUtil.WebSiteBehaviourInitialize();
        TrackingUtil.ReferrerInitialize();
        TrackingUtil.UserAgentInitialize();
        TrackingUtil.BrowserIntitialize();
        TrackingUtil.SessionDetailsIntitialization();
        TrackingUtil.ContactDetailsInitialization();
        TrackingUtil.UtmTagInitialization();

        if (!TrackingUtil.IsPushNotificationSubscriptionPage()) {
            if (document != undefined && (document.readyState === "interactive" || document.readyState == "complete")) {
                TrackingUtil.CallTrackUrl();
                TrackingUtil.GetFormDetailsToBind();
                TrackingUtil.GetTaggedFormDetails();
            }
            else {
                window.setTimeout(TrackingUtil.CallTrackUrl, 1000);
                window.setTimeout(TrackingUtil.GetFormDetailsToBind, 1000);
                window.setTimeout(TrackingUtil.GetTaggedFormDetails, 1000);
            }
        }
        else {
            PushNotificationUtil.GetWebPushSubscriptionSettingWithVapidKeyForIntermediatePage(MainVisitorDetails.AccountId);
        }
    },
    IsPushNotificationSubscriptionPage: function () {
        return document.URL.toLowerCase().indexOf('p5subscription.html') > 0 ? true : false;
    },
    MainVisitorDetailsInitialize: function () {

        MainVisitorDetails.BasicDetails.CurrentTime = TrackingUtil.GetCurrentTime();
        MainVisitorDetails.BasicDetails.Machineid = TrackingUtil.GetCookie("p5AccountIdNew" + MainVisitorDetails.AccountId);
        MainVisitorDetails.BasicDetails.Session = TrackingUtil.GetCookie("p5SessionIdNew" + MainVisitorDetails.AccountId);
        MainVisitorDetails.BasicDetails.Prevtime = TrackingUtil.GetCookie("p5PrevTimeNew" + MainVisitorDetails.AccountId);

        //Set the current time
        TrackingUtil.SetCookie("p5PrevTimeNew" + MainVisitorDetails.AccountId, MainVisitorDetails.BasicDetails.CurrentTime, 36500);
        //~~
        MainVisitorDetails.BasicDetails.Prevtime = MainVisitorDetails.BasicDetails.Prevtime == null ? TrackingUtil.GetCookie("p5PrevTimeNew" + MainVisitorDetails.AccountId) : MainVisitorDetails.BasicDetails.Prevtime;

        //~~
        if (MainVisitorDetails.BasicDetails.Machineid == null || MainVisitorDetails.BasicDetails.Session == null) {
            var plumbSession = TrackingUtil.plumbfivegetdate("Session");
            //~~
            if (MainVisitorDetails.BasicDetails.Machineid == null) {
                //~~
                var numdate = TrackingUtil.plumbfivegetdate("Machine");
                MainVisitorDetails.BasicDetails.Machineid = numdate;
                TrackingUtil.SetCookie("p5AccountIdNew" + MainVisitorDetails.AccountId, numdate, 36500);
            }
            TrackingUtil.SetCookie("p5SessionIdNew" + MainVisitorDetails.AccountId, plumbSession, 36500);
            MainVisitorDetails.BasicDetails.Session = plumbSession;
            MainVisitorDetails.BasicDetails.SessionKey = 1;
        }
        else {
            MainVisitorDetails.BasicDetails.SessionKey = 0;
            MainVisitorDetails.ReferrerDetails.RepeatOrNew = 'R';
            MainVisitorDetails.BasicDetails.Session = MainVisitorDetails.BasicDetails.Session.replace(/T/g, '').replace(/-/g, '').replace(/ /g, '').replace(/:/g, '');
        }
    },
    WebSiteBehaviourInitialize: function () {

        MainVisitorDetails.WebSiteDetails.Domain = document.location.hostname.toString().replace("www.", "").toLowerCase();
        MainVisitorDetails.WebSiteDetails.Url = document.location.toString().toLowerCase().replace(/\/$/, "");//document.location.toString().toLowerCase().replace(/%20/g, " ");
        MainVisitorDetails.WebSiteDetails.PageName = window.location.pathname.split("/").pop() == "" ? MainVisitorDetails.WebSiteDetails.Url.replace('http://', '').replace('https://', '') : "/" + window.location.pathname.split("/").pop();
        MainVisitorDetails.WebSiteDetails.PageTitle = document.title.toString().toLowerCase();//.replace(/&/g, "~").replace(/#/g, "~$").replace(/'/g, "‘").toLowerCase();
    },
    ReferrerInitialize: function () {

        //~~
        MainVisitorDetails.ReferrerDetails.Referrer = document.referrer.toLowerCase().replace(/\/$/, ""); //document.referrer.toLowerCase();
        if (MainVisitorDetails.ReferrerDetails.Referrer != "" && window.location.href.toLowerCase().indexOf("p5source=webpush") == -1) {

            MainVisitorDetails.ReferrerDetails.ReferrerShorten = MainVisitorDetails.ReferrerDetails.Referrer.split("/")[2].toString();

            MainVisitorDetails.ReferrerDetails.ReferrerDomain = MainVisitorDetails.ReferrerDetails.Referrer.split("/")[2].toString().replace("www.", "");

            if (MainVisitorDetails.ReferrerDetails.ReferrerDomain == MainVisitorDetails.WebSiteDetails.Domain) {
                //~~
                MainVisitorDetails.ReferrerDetails.ReferType = 'Direct';
            }
            else if (window.location.href.toLowerCase().indexOf("plumb5email=") > -1 || window.location.href.toLowerCase().indexOf("p5uniqueid=") > -1) {
                TrackingUtil.GetMailSmsReferType();
            }
            else {

                if (window.location.href.toLowerCase().indexOf("gclid=") > -1 || MainVisitorDetails.ReferrerDetails.Referrer.indexOf("/aclk?sa=") > -1 ||
                    MainVisitorDetails.ReferrerDetails.Referrer.indexOf("googleads.g.doubleclick.net") > -1 || MainVisitorDetails.ReferrerDetails.Referrer.indexOf("googleadservices") > -1
                    || MainVisitorDetails.ReferrerDetails.Referrer.indexOf("googlesyndication") > -1) {
                    MainVisitorDetails.ReferrerDetails.ReferType = "Paid";
                    MainVisitorDetails.ReferrerDetails.PaidFlag = (MainVisitorDetails.ReferrerDetails.Referrer.indexOf("googlesyndication") > -1 ||
                        MainVisitorDetails.ReferrerDetails.Referrer.indexOf("googleads.g.doubleclick.net") > -1 || MainVisitorDetails.ReferrerDetails.Referrer.indexOf("googleadservices") > -1) ? 2 : 1;
                }
                else {
                    for (var m = 0; m < p5Social.length; m++) {
                        if (("." + MainVisitorDetails.ReferrerDetails.ReferrerDomain).indexOf(p5Social[m]) > -1) { MainVisitorDetails.ReferrerDetails.ReferType = "Social"; break; }
                    }
                    if (MainVisitorDetails.ReferrerDetails.ReferType != "Social") {
                        for (var n = 0; n < p5searchEngine.length; n++) {
                            if (("." + MainVisitorDetails.ReferrerDetails.ReferrerDomain).indexOf(p5searchEngine[n]) > -1) {
                                MainVisitorDetails.ReferrerDetails.ReferType = "Search";
                                var searchParam = ["?q=", "&q=", "#q=", "?p=", "&p=", "?query=", "?searchfor=", "&searchfor="];
                                for (var i = 0; i < searchParam.length; i++) {
                                    if (MainVisitorDetails.ReferrerDetails.Referrer.indexOf(searchParam[i]) > -1) {
                                        MainVisitorDetails.ReferrerDetails.SearchBy = TrackingUtil.GetQueryString(MainVisitorDetails.ReferrerDetails.Referrer, searchParam[i].replace(/&/g, "").
                                            replace("?", "").replace(/#/g, "").replace(/=/g, ""));
                                        break;
                                    }
                                } break;
                            }
                        }
                        if (MainVisitorDetails.ReferrerDetails.ReferType != "Search")
                            MainVisitorDetails.ReferrerDetails.ReferType = 'Refer';
                    }
                }
            }
            // MainVisitorDetails.ReferrerDetails.Referrer = MainVisitorDetails.Referrer;
        }
        else {
            if (window.location.href.toLowerCase().indexOf("plumb5email=") > -1 || window.location.href.toLowerCase().indexOf("p5uniqueid=") > -1) {
                TrackingUtil.GetMailSmsReferType();
            }
            else if (window.location.href.toLowerCase().indexOf("gclid=") > -1) {
                MainVisitorDetails.ReferrerDetails.ReferType = "Paid";
                MainVisitorDetails.ReferrerDetails.PaidFlag = 1;
            }
        }
    },
    GetMailSmsReferType: function () {

        if (window.location.href.toLowerCase().indexOf("p5source=mail") > -1) {
            MainVisitorDetails.ReferrerDetails.ReferType = "Email";

            if (window.location.href.toLowerCase().indexOf("p5uniqueid=") > -1) {
                MainVisitorDetails.ReferrerDetails.P5MailUniqueID = TrackingUtil.GetQueryString(window.location.href.toLowerCase(), 'p5uniqueid');
            }
        }
        else if (window.location.href.toLowerCase().indexOf("plumb5email=") > -1) {
            MainVisitorDetails.ReferrerDetails.ReferType = "Email";

            if (window.location.href.toLowerCase().indexOf("p5uniqueid=") > -1) {
                MainVisitorDetails.ReferrerDetails.P5MailUniqueID = TrackingUtil.GetQueryString(window.location.href.toLowerCase(), 'p5uniqueid');
            }
        }
        else if (window.location.href.toLowerCase().indexOf("p5source=sms") > -1) {
            MainVisitorDetails.ReferrerDetails.ReferType = "Sms";

            if (window.location.href.toLowerCase().indexOf("p5uniqueid=") > -1) {
                MainVisitorDetails.ReferrerDetails.P5SMSUniqueID = TrackingUtil.GetQueryString(window.location.href.toLowerCase(), 'p5uniqueid');
            }
        }
        else if (window.location.href.toLowerCase().indexOf("p5source=webpush") > -1) {
            MainVisitorDetails.ReferrerDetails.ReferType = "WebPush";

            if (window.location.href.toLowerCase().indexOf("p5uniqueid=") > -1)
                MainVisitorDetails.ReferrerDetails.P5WebPushUniqueID = TrackingUtil.GetQueryString(window.location.href.toLowerCase(), 'p5uniqueid');
        }
        else if (window.location.href.toLowerCase().indexOf("p5source=whatsapp") > -1) {
            MainVisitorDetails.ReferrerDetails.ReferType = "Whatsapp";

            if (window.location.href.toLowerCase().indexOf("p5uniqueid=") > -1) {
                MainVisitorDetails.ReferrerDetails.P5WhatsAppUniqueID = TrackingUtil.GetQueryString(window.location.href.toLowerCase(), 'p5uniqueid');
            }
        }
    },
    UserAgentInitialize: function () {

        if (document.all)
            var version = /MSIE \\d+.\\d+/;
        if (!document.all)
            MainVisitorDetails.UserAgent = navigator.userAgent.toLowerCase();
        else
            MainVisitorDetails.UserAgent = navigator.appVersion.match(version).toLowerCase();
        if (MainVisitorDetails.UserAgent.match(/android.+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od|ad)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino|webos/i)) {
            MainVisitorDetails.DeviceId = 1;
        }

    },
    BrowserIntitialize: function () {

        if (MainVisitorDetails.UserAgent.indexOf("opera") != -1 || MainVisitorDetails.UserAgent.indexOf("opr/") != -1) {
            MainVisitorDetails.Browser = "Opera";
        }
        else if (MainVisitorDetails.UserAgent.indexOf("msie") != -1) {
            MainVisitorDetails.Browser = "IE";
        }
        else if (MainVisitorDetails.UserAgent.indexOf("edg") != -1) {
            MainVisitorDetails.Browser = "Microsoft Edge";
        }
        else if (MainVisitorDetails.UserAgent.indexOf("chrome") != -1) {
            MainVisitorDetails.Browser = "Chrome";
        }
        else if (MainVisitorDetails.UserAgent.indexOf("safari") != -1) {
            MainVisitorDetails.Browser = "Safari";
        }
        else if (MainVisitorDetails.UserAgent.indexOf("firefox") != -1) {
            MainVisitorDetails.Browser = "Mozilla";
        }
    },
    SessionDetailsIntitialization: function () {

        MainVisitorDetails.BasicDetails.Prevtime = MainVisitorDetails.BasicDetails.Prevtime != undefined ? ((MainVisitorDetails.BasicDetails.Prevtime.indexOf("T") > -1 ||
            MainVisitorDetails.BasicDetails.Prevtime.indexOf("-") > -1) ? MainVisitorDetails.BasicDetails.Prevtime.replace(/-/g, "/").replace("T", " ") : MainVisitorDetails.BasicDetails.Prevtime) : MainVisitorDetails.BasicDetails.Prevtime;
        var p5sessiondiff = Math.floor((new Date(MainVisitorDetails.BasicDetails.CurrentTime) - new Date(MainVisitorDetails.BasicDetails.Prevtime)) / 1000);

        if (p5sessiondiff > 300 || MainVisitorDetails.ReferrerDetails.ReferType == 'Search' || MainVisitorDetails.ReferrerDetails.ReferType == 'Refer'
            || MainVisitorDetails.ReferrerDetails.ReferType == 'Social' || MainVisitorDetails.ReferrerDetails.ReferType == 'Paid' || MainVisitorDetails.ReferrerDetails.ReferType == 'Email'
            || MainVisitorDetails.ReferrerDetails.ReferType == 'Sms' || MainVisitorDetails.ReferrerDetails.ReferType == 'WhatsApp' || MainVisitorDetails.ReferrerDetails.ReferType == 'WebPush') {
            //~~
            var plumbSession = TrackingUtil.plumbfivegetdate("Session");
            TrackingUtil.SetCookie("p5SessionIdNew" + MainVisitorDetails.AccountId, plumbSession, 36500);
            MainVisitorDetails.BasicDetails.Session = plumbSession;
            MainVisitorDetails.BasicDetails.SessionKey = 1;
        }
    },
    ContactDetailsInitialization: function () {

        if (MainVisitorDetails.WebSiteDetails.Url.toLowerCase().indexOf("plumb5email=") > -1)
            MainVisitorDetails.ContactDetails.EmailId = TrackingUtil.GetQueryString(window.location.href, 'plumb5email');
        if (MainVisitorDetails.WebSiteDetails.Url.toLowerCase().indexOf("p5contactid=") > -1)
            MainVisitorDetails.ContactDetails.ContactId = TrackingUtil.GetQueryString(window.location.href.toLowerCase(), 'p5contactid');

        //~~
        var P5LoggedInEmailIdElement = document.getElementById('p5EmailId');
        if (P5LoggedInEmailIdElement != null && P5LoggedInEmailIdElement != undefined)
            MainVisitorDetails.ContactDetails.EmailId = P5LoggedInEmailIdElement.innerHTML;

        var Plumb5VisitorIdElement = document.getElementById('p5VisitorId');
        if (Plumb5VisitorIdElement != null && Plumb5VisitorIdElement != undefined)
            MainVisitorDetails.ContactDetails.VisitorId = Plumb5VisitorIdElement.innerHTML;
    },
    UtmTagInitialization: function () {

        MainVisitorDetails.UtmTagDetails.utm_source = TrackingUtil.GetQueryString(window.location.href.toLowerCase().replace(/%20/g, " "), 'utm_source');

        MainVisitorDetails.UtmTagDetails.utm_medium = TrackingUtil.GetQueryString(window.location.href.toLowerCase().replace(/%20/g, " "), 'utm_medium');

        MainVisitorDetails.UtmTagDetails.utm_campaign = TrackingUtil.GetQueryString(window.location.href.toLowerCase().replace(/%20/g, " "), 'utm_campaign');

        MainVisitorDetails.UtmTagDetails.utm_term = TrackingUtil.GetQueryString(window.location.href.toLowerCase().replace(/%20"/g, " "), 'utm_term');
    },
    plumbfivegetdate: function (P5key) {
        var today = new Date();
        var strYear = today.getFullYear();
        var iMonth = today.getMonth() + 1;
        var iQuarter = Math.ceil((iMonth / 12) * 4);
        var iDay = today.getDate();
        var strDateOut = "";
        iMonth = (iMonth < 10) ? "0" + iMonth : iMonth;
        iDay = (iDay < 10) ? "0" + iDay : iDay;
        switch (P5key) {
            case "Session":
                strDateOut = strYear.toString() + '' + (iMonth.length == 1 ? '0' + iMonth : iMonth.toString()) + '' + (iDay.length == 1 ? '0' + iDay : iDay.toString()) + '' + (today.getHours().toString().length == 1 ? '0' + today.getHours().toString() : today.getHours().toString()) + '' + (today.getSeconds().toString().length == 1 ? '0' + today.getSeconds().toString() : today.getSeconds().toString()) + '' + (today.getMilliseconds().toString().length == 1 ? '00' + today.getMilliseconds().toString() : today.getMilliseconds().toString()) + '' + (today.getMinutes().toString().length == 1 ? '0' + today.getMinutes().toString() : today.getMinutes().toString()) + (Math.floor(Math.random() * 12345678910)).toString();
                break;
            case "Machine":
                strDateOut = (iMonth.length == 1 ? '0' + iMonth : iMonth.toString()) + '' + (iDay.length == 1 ? '0' + iDay : iDay.toString()) + '' + strYear.toString() + '' + (today.getHours().toString().length == 1 ? '0' + today.getHours().toString() : today.getHours().toString()) + '' + (today.getMinutes().toString().length == 1 ? '0' + today.getMinutes().toString() : today.getMinutes().toString()) + '' + (today.getSeconds().toString().length == 1 ? '0' + today.getSeconds().toString() : today.getSeconds().toString()) + (today.getMilliseconds().toString().length == 1 ? '00' + today.getMilliseconds().toString() : today.getMilliseconds().toString()) + (Math.floor(Math.random() * 12345678910)).toString();
                break;
            case "CurrentTime":
                strDateOut = strYear.toString() + '/' + (iMonth.length == 1 ? '0' + iMonth : iMonth.toString()) + '/' + (iDay.length == 1 ? '0' + iDay : iDay.toString()) + ' ' + (today.getHours().toString().length == 1 ? '0' + today.getHours().toString() : today.getHours().toString()) + ':' + (today.getMinutes().toString().length == 1 ? '0' + today.getMinutes().toString() : today.getMinutes().toString()) + ':' + (today.getSeconds().toString().length == 1 ? '0' + today.getSeconds().toString() : today.getSeconds().toString());
                break;
        }
        return strDateOut;
    },
    GetCurrentTime: function () {
        var today = new Date();
        var strYear = today.getFullYear();
        var iMonth = today.getMonth() + 1;
        var iQuarter = Math.ceil((iMonth / 12) * 4);
        var iDay = today.getDate();
        var strDateOut = "";
        iMonth = (iMonth < 10) ? "0" + iMonth : iMonth;
        iDay = (iDay < 10) ? "0" + iDay : iDay;
        strDateOut = strYear.toString() + '/' + (iMonth.length == 1 ? '0' + iMonth : iMonth.toString()) + '/' + (iDay.length == 1 ? '0' + iDay : iDay.toString()) + ' ' + (today.getHours().toString().length == 1 ? '0' + today.getHours().toString() : today.getHours().toString()) + ':' + (today.getMinutes().toString().length == 1 ? '0' + today.getMinutes().toString() : today.getMinutes().toString()) + ':' + (today.getSeconds().toString().length == 1 ? '0' + today.getSeconds().toString() : today.getSeconds().toString());
        return strDateOut;
    },
    GetCookie: function (c_name) {
        var i, x, y, ARRcookies = document.cookie.split(";");
        for (i = 0; i < ARRcookies.length; i++) {
            x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
            y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
            x = x.replace(/^\s+|\s+$/g, "");
            if (x == c_name) {
                return unescape(y);
            }
        }
    },
    SetCookie: function (c_name, value, exdays) {
        var exdate = new Date();
        exdate.setDate(exdate.getDate() + exdays);
        var c_value = escape(value) + ((exdays == null) ? "" : ";domain=plumb5.in;path=/;expires=" + exdate.toUTCString());
        document.cookie = c_name + "=" + c_value;//
    },
    GetQueryString: function (url, name) {
        url = url.toLowerCase();
        name = name.toLowerCase();
        if (url.indexOf(name) > -1) {
            var results = new RegExp('[\\?&#]' + name + '=([^&#]*)').exec(url.toLowerCase());
            if (!results)
                return '';
            return results[1] || '';
        }
    },

    CallTrackUrl: function () {
        var xhr = new XMLHttpRequest();
        xhr.open('Post', TrackerUrl.TrackDomainUrl);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(MainVisitorDetails));
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                if (this.response != null && this.response != "") {

                    var EventFromChatPushData = JSON.parse(this.response);

                    if (EventFromChatPushData != null)
                        MainVisitorDetails.BasicDetails.VisitorIp = EventFromChatPushData.VisitorIp;

                    //Event Tracking
                    if (EventFromChatPushData.EventSettings != null && EventFromChatPushData.EventSettings.length > 0)
                        TrackingUtil.EventTracking(EventFromChatPushData.EventSettings);

                    //Push Notification
                    if (EventFromChatPushData.WebPushSubscriptionSettingWithVapidPublicKey != null)
                        PushNotificationUtil.BasicInitialize(EventFromChatPushData.WebPushSubscriptionSettingWithVapidPublicKey);

                    //custom events
                    if (p5EventName != null && p5EventData != null) {
                        p5EventPaused = true;
                        plumb5.event(p5EventName, p5EventData);
                    }
                }
            }
        };
    },
    GetFormDetailsToBind: function () {
        FormUtil.initializeMachineIdAndSessionRefeer();
        FormUtil.GetStaticFormIdsToDisplay();

        var xhr = new XMLHttpRequest();
        xhr.open('Post', TrackerUrl.GetFormDetailsUrl);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(MainVisitorDetails));
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                if (this.response != null && this.response != "") {

                    var EventFromChatPushData = JSON.parse(this.response);

                    if (EventFromChatPushData != null) {
                        MainVisitorDetails.BasicDetails.VisitorIp = EventFromChatPushData.VisitorIp;

                        if (EventFromChatPushData.Name != undefined && EventFromChatPushData.Name != null && EventFromChatPushData.Name != "")
                            FormInfoDetails.Name = EventFromChatPushData.Name;

                        if (EventFromChatPushData.EmailId != undefined && EventFromChatPushData.EmailId != null && EventFromChatPushData.EmailId != "")
                            FormInfoDetails.EmailId = EventFromChatPushData.EmailId;

                        if (EventFromChatPushData.ContactId != undefined && EventFromChatPushData.ContactId > 0)
                            MainVisitorDetails.ContactDetails.ContactId = String(EventFromChatPushData.ContactId);
                    }

                    //Form Details
                    if (EventFromChatPushData.formLoadDetails != null && EventFromChatPushData.formLoadDetails.length > 0)
                        FormUtil.BindOnExitAndOnLoadForms(EventFromChatPushData.formLoadDetails);

                    //this is for form extra links
                    if (EventFromChatPushData.listExtraLinks != null)
                        FormUtil.BindFormDesignExtraLinks(EventFromChatPushData.listExtraLinks);
                }
            }
        };
    },
    GetTaggedFormDetails: function () {
        var xhr = new XMLHttpRequest();
        xhr.open('Post', TrackerUrl.GetTaggedFormDetails);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(MainVisitorDetails));
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                if (this.response != null && this.response != "") {
                    var EventFromChatPushData = JSON.parse(this.response);

                    //this is for tagging form scripts
                    if (EventFromChatPushData.formScriptlist != null)
                        FormUtil.AppendScriptDetails(EventFromChatPushData.formScriptlist);
                }
            }
        };
    },
    EventTracking: function (EventDetails) {

        for (var i = 0; i < EventDetails.length; i++) {
            var eventid, idorclass = 0;
            var eventValue;

            if (EventDetails[i].EventType.trim() == 'id') {
                eventid = document.getElementById(EventDetails[i].EventName.trim());

            }

            if (EventDetails[i].EventType.trim() == 'class') {
                eventid = document.getElementsByClassName(EventDetails[i].EventName.trim());
                idorclass = 1;
            }

            if (eventid != null)
                if (idorclass == 1) {//Class 
                    for (var b = 0; b < eventid.length; b++) {
                        TrackingUtil.EventSettings(eventid[b], idorclass);
                    }
                }
                else
                    TrackingUtil.EventSettings(eventid, idorclass);
        }
    },
    EventSettings: function (EventId, IdOrClass) {
        FormUtil.initializeMachineIdAndSessionRefeer();
        TrackingUtil.addEventListener(EventId, 'click', function (e) {

            //MainVisitorDetails.EventDetails.Name = EventId.defaultValue;

            MainVisitorDetails.EventDetails.EventName = IdOrClass == 0 ? EventId.id : EventId.className;

            if (typeof GetClickedEventValue == 'function')
                MainVisitorDetails.EventDetails.EventValue = GetClickedEventValue(this, MainVisitorDetails.EventDetails.EventName);

            // MainVisitorDetails.EventId = IdOrClass == 0 ? EventId.id : EventId.className;
            var xhr = new XMLHttpRequest();
            xhr.open('Post', TrackerUrl.EventTrackingUrl);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(JSON.stringify(MainVisitorDetails));
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    if (this.response != null && this.response != "") {
                        var EventFromChatPushData = JSON.parse(this.response);

                        //Form Details
                        if (EventFromChatPushData.formLoadDetails != null && EventFromChatPushData.formLoadDetails.length > 0) {
                            FormUtil.BindOnExitAndOnLoadForms(EventFromChatPushData.formLoadDetails);

                            if (EventFromChatPushData.listExtraLinks != null && EventFromChatPushData.formLoadDetails[0].formDetails.Id > 0) {
                                var childlinks = new Array();

                                if (EventFromChatPushData.listExtraLinks.length > 0) {
                                    for (var j = 0; j < EventFromChatPushData.listExtraLinks.length; j++) {
                                        if (EventFromChatPushData.listExtraLinks[j].LinkPlacecode.toLowerCase() == "child") {
                                            childlinks.push(EventFromChatPushData.listExtraLinks[j]);
                                        }
                                    }

                                    if (childlinks != null && childlinks != "" && childlinks.length > 0)
                                        FormUtil.AppendChildExtraLinks(childlinks, EventFromChatPushData.formLoadDetails[0].formDetails.Id);
                                }
                            }
                        }

                        //if (EventFromChatPushData.listExtraLinks != null) {
                        //    FormUtil.BindFormDesignExtraLinks(EventFromChatPushData.listExtraLinks);
                        //}
                    }
                }
            };
        });
    },
    addEventListener: function (element, type, callback) {
        if (element.addEventListener) element.addEventListener(type, callback);
        else if (element.attachEvent) element.attachEvent('on' + type, callback);
    }
};

var PushNotificationUtil = {
    BasicInitialize: function (WebPushSubscriptionSetting) {
        PushNotificationUtil.RuleChecking(WebPushSubscriptionSetting);
    },
    GetWebPushSubscriptionSettingWithVapidKeyForIntermediatePage: function () {
        var xhr = new XMLHttpRequest();
        xhr.open('Post', TrackerUrl.WebPushSubscriptionSetttingUrl);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(MainVisitorDetails));
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                if (this.response != null && this.response != "") {
                    var PushNotificationSubscriptionSetting = JSON.parse(this.response);
                    if (PushNotificationSubscriptionSetting != null) {
                        PushNotificationUtil.ServiceRegister(PushNotificationSubscriptionSetting);
                        $('.bwsnotifnativbody').css('background-color', '#' + PushNotificationSubscriptionSetting.NativeBrowserBackgoundColor);
                        $('.bwsnotifnativtext').html(PushNotificationSubscriptionSetting.NativeBrowserMessage);
                        $('.bwsnotifnativtext').css('color', '#' + PushNotificationSubscriptionSetting.NativeBrowserTextColor);
                        $('#NativeBrowserIcon').attr('src', PushNotificationSubscriptionSetting.NativeBrowserIcon);
                    }

                }
            }
        };
    },
    RuleChecking: function (WebPushSubscriptionSetting) {

        var ShowPagesNme = WebPushSubscriptionSetting.ShowSpecificPageUrl != "" && WebPushSubscriptionSetting.ShowSpecificPageUrl != null ? WebPushSubscriptionSetting.ShowSpecificPageUrl.toLowerCase().split(',') : "";
        var DontShowPages = WebPushSubscriptionSetting.ExcludePageUrl != "" && WebPushSubscriptionSetting.ExcludePageUrl != null ? WebPushSubscriptionSetting.ExcludePageUrl.toLowerCase().split(',') : "";

        if (DontShowPages.indexOf(window.location.href.toLowerCase()) == -1 && (WebPushSubscriptionSetting.IsShowOnAllPages == true || ShowPagesNme.indexOf(window.location.href.toLowerCase()) > -1))
            PushNotificationUtil.ShowAllowNotification(WebPushSubscriptionSetting);

    },
    ShowAllowNotification: function (WebPushSubscriptionSetting) {
        if (WebPushSubscriptionSetting.WebPushStep.toUpperCase() == 'STEP1')
            PushNotificationUtil.ServiceRegister(WebPushSubscriptionSetting);
        else
            PushNotificationUtil.LoadNotificationIcons(WebPushSubscriptionSetting);
    },
    LoadNotificationIcons: function (WebPushSubscriptionSetting) {
        PushNotificationUtil.LoadStyleSheet();
        if (WebPushSubscriptionSetting.NotificationPromptType.toUpperCase() == 'BELL')
            PushNotificationUtil.NotificationBellIconLoad(WebPushSubscriptionSetting);
        else
            PushNotificationUtil.NotoficationBoxLoad(WebPushSubscriptionSetting);
    },
    LoadStyleSheet: function () {
        var p5tracker = document.createElement('link');
        p5tracker.rel = 'stylesheet';
        p5tracker.type = 'text/css';
        p5tracker.href = TrackerUrl.MainUrl + '/css/P5Tracker-style.css';//TrackerUrl.MainUrl +
        document.getElementsByTagName("head")[0].appendChild(p5tracker);
    },
    LoadBellIconStyleSheet: function () {
        var ionicon = document.createElement('link');
        ionicon.rel = 'stylesheet';
        ionicon.type = 'text/css';
        ionicon.href = TrackerUrl.MainUrl + '/css/Ionicons/css/ionicons.css';//TrackerUrl.MainUrl +
        document.getElementsByTagName("head")[0].appendChild(ionicon);
    },
    NotificationBellIconLoad: function (WebPushSubscriptionSetting) {
        var NotificationboxCookie = TrackingUtil.GetCookie("p5Notification" + MainVisitorDetails.AccountId);
        if (NotificationboxCookie == undefined) {
            PushNotificationUtil.LoadBellIconStyleSheet();
            var divNotificationBellIcon = document.createElement('div');
            divNotificationBellIcon.id = 'dvP5Notification';
            divNotificationBellIcon.innerHTML = "<div id='dvP5NotificationBell' class='bwsnotifbellwrp " + WebPushSubscriptionSetting.NotificationPosition.toLowerCase() + "' >" +
                "<div class='bwsnotifbellitem'>" +
                "<i class='icon ion-ios-bell'></i>" +
                "</div>" +
                "</div>";
            if (WebPushSubscriptionSetting.ShowOptInDelayTime != 0) {
                setTimeout(function () { document.body.appendChild(divNotificationBellIcon); document.getElementById("dvP5NotificationBell").onclick = function () { PushNotificationUtil.TwoStepNotificationAllow(WebPushSubscriptionSetting) } }, WebPushSubscriptionSetting.ShowOptInDelayTime * 1000);

            } else {
                document.body.appendChild(divNotificationBellIcon);
                document.getElementById("dvP5NotificationBell").onclick = function () { PushNotificationUtil.TwoStepNotificationAllow(WebPushSubscriptionSetting) };
            }
            if (WebPushSubscriptionSetting.HideOptInDelayTime != 0)
                setTimeout(function () { document.getElementById("dvP5Notification").style.display = 'none'; }, WebPushSubscriptionSetting.HideOptInDelayTime * 1000);
        }
    },

    NotoficationBoxLoad: function (WebPushSubscriptionSetting) {
        var NotificationboxCookie = TrackingUtil.GetCookie("p5Notification" + MainVisitorDetails.AccountId);
        if (NotificationboxCookie == undefined) {
            var divNotificationBox = document.createElement('div');
            divNotificationBox.id = 'dvP5Notification';
            divNotificationBox.innerHTML = "<div id='dvP5NotificationBox' class='bwsnotifboxwrp " + WebPushSubscriptionSetting.NotificationPosition + "' style=background-color: #" + WebPushSubscriptionSetting.NotificationBodyBackgoundColor + " !important;'>" +
                "<div class='bwsnotiboxitem'>" +
                "<p class='bwsnotiboxcontent' style='color: #" + WebPushSubscriptionSetting.NotificationBodyTextColor + "!important;'>" + WebPushSubscriptionSetting.NotificationMessage + "</p>" +
                "<div class='bwsnotiboxbtnw' style='background-color: #" + WebPushSubscriptionSetting.NotificationButtonBackgoundColor + " !important;'>" +
                "<button type='button' id='btnNotificationCancel'   class='btn-p5 btn-p5trans btn-p5transtext' style='color:#" + WebPushSubscriptionSetting.NotificationButtonTextColor + " !important;'>" + WebPushSubscriptionSetting.NotificationDoNotAllowButtonText + "</button>" +
                "<button type='button' id='btnNotificationAllow'  class='btn-p5 btn-p5trans btn-p5transtext' style='color:#" + WebPushSubscriptionSetting.NotificationButtonTextColor + " !important;'>" + WebPushSubscriptionSetting.NotificationAllowButtonText + "</button>" +
                "</div>" +
                "</div >" +
                "</div >";
            if (WebPushSubscriptionSetting.ShowOptInDelayTime != 0) {
                setTimeout(function () {
                    document.body.appendChild(divNotificationBox); document.getElementById("btnNotificationAllow").onclick = function () {
                        PushNotificationUtil.TwoStepNotificationAllow(WebPushSubscriptionSetting);
                    };
                    document.body.appendChild(divNotificationBox); document.getElementById("btnNotificationCancel").onclick = PushNotificationUtil.NotificationCancel;
                }, WebPushSubscriptionSetting.ShowOptInDelayTime * 1000);

            } else {
                document.body.appendChild(divNotificationBox);
                document.getElementById("btnNotificationAllow").onclick = function () { PushNotificationUtil.TwoStepNotificationAllow(WebPushSubscriptionSetting) };
                document.body.appendChild(divNotificationBox); document.getElementById("btnNotificationCancel").onclick = PushNotificationUtil.NotificationCancel;
            }
            if (WebPushSubscriptionSetting.HideOptInDelayTime != 0)
                setTimeout(function () { document.getElementById("dvP5Notification").style.display = 'none'; }, WebPushSubscriptionSetting.HideOptInDelayTime * 1000);
        }
    },
    TwoStepNotificationAllow: function (WebPushSubscriptionSetting) {
        document.getElementById("dvP5Notification").style.display = 'none';

        TrackingUtil.SetCookie("p5Notification" + MainVisitorDetails.AccountId, MainVisitorDetails.BasicDetails.CurrentTime, 36500);
        if (WebPushSubscriptionSetting.HttpOrHttpsPush.toUpperCase() == 'HTTPS')
            PushNotificationUtil.ServiceRegister(WebPushSubscriptionSetting);
        else {
            var left = (screen.width / 2) - (450 / 2);
            var top = (screen.height / 2) - (450 / 2);
            //window.open('http://localhost:12347/P5Subscription.html?machineid=' + MainVisitorDetails.BasicDetails.Machineid + '&visitorip=' + MainVisitorDetails.BasicDetails.VisitorIp + '&suburl=' + MainVisitorDetails.WebSiteDetails.Url + '', '_blank', 'directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=450,height=450,top=' + top + ', left=' + left + '');
            window.open('https://' + WebPushSubscriptionSetting.Step2ConfigurationSubDomain + '.' + TrackerUrl.Step2HttpSubDomain + '/P5Subscription.html?machineid=' + MainVisitorDetails.BasicDetails.Machineid + '&visitorip=' + MainVisitorDetails.BasicDetails.VisitorIp + '&suburl=' + MainVisitorDetails.WebSiteDetails.Url + '', '_blank', 'directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=450,height=450,top=' + top + ', left=' + left + '');

        }
    },
    NotificationCancel: function () {
        TrackingUtil.SetCookie("p5Notification" + MainVisitorDetails.AccountId, MainVisitorDetails.BasicDetails.CurrentTime, 36500);
        document.getElementById("dvP5Notification").style.display = 'none';
    },
    ServiceRegister: function (WebPushSubscriptionSetting) {
        if ('https:' == document.location.protocol) {
            var ServiceWorkerUrl = '//' + document.location.hostname.toString().toLowerCase() + '/p5_Sw_Direct.js';
            navigator.serviceWorker.register(ServiceWorkerUrl)
                .then(PushNotificationUtil.InitialiseState(WebPushSubscriptionSetting))
                .catch(function (error) {
                    console.log('Please check configuration settings or "P5_Sw_Direct.js" file is missing in your root' + error);
                });
        } else { console.log('Notifications aren\'t supported for http.'); }
    },
    InitialiseState: function (WebPushSubscriptionSetting) {
        if (!('showNotification' in ServiceWorkerRegistration.prototype)) {
            console.log('Notifications aren\'t supported.');
            return;
        }
        if (Notification.permission === 'denied') {
            console.log('You have blocked notifications for this site.allow notification permission and refresh this page.');
        }
        if (!('PushManager' in window)) {
            console.log('Push messaging isn\'t supported.');
            return;
        }
        navigator.serviceWorker.ready.then(function (serviceWorkerRegistration) {
            // Do we already have a push message subscription?  
            serviceWorkerRegistration.pushManager.getSubscription()
                .then(function (subscription) {
                    if (!subscription) {
                        PushNotificationUtil.SubscribeVapid(WebPushSubscriptionSetting);//vapid function
                        return true;
                    }
                })
                .catch(function (err) {
                    console.log('Error during getSubscription()', err);
                    return;
                });
        }).catch(function (error) {
            console.log('Your browser is not supporting this feature, please get chrome (42+) or firefox (44+) ' + error);
        });
    },
    SubscribeVapid: function (WebPushSubscriptionSetting) {
        navigator.serviceWorker.ready.then(function (reg) {
            var subscribeParams = { userVisibleOnly: true };

            //Setting the public key of our VAPID key pair.
            var applicationServerKey = PushNotificationUtil.ConvertUrlB64ToUint8Array(WebPushSubscriptionSetting.VapidPublicKey);
            subscribeParams.applicationServerKey = applicationServerKey;
            reg.pushManager.subscribe(subscribeParams)
                .then(function (subscription) {

                    console.log(subscription);

                    PushNotificationDetails.Endpointurl = subscription.endpoint;
                    PushNotificationDetails.Tokenkey = PushNotificationUtil.Convertbase64Encode(subscription.getKey('p256dh'));
                    PushNotificationDetails.Authkey = PushNotificationUtil.Convertbase64Encode(subscription.getKey('auth'));
                    if (TrackingUtil.IsPushNotificationSubscriptionPage()) {
                        MainVisitorDetails.WebSiteDetails.Url = TrackingUtil.GetQueryString(window.location.href, 'suburl');
                        MainVisitorDetails.BasicDetails.Machineid = TrackingUtil.GetQueryString(window.location.href, 'machineid');
                        MainVisitorDetails.BasicDetails.VisitorIp = TrackingUtil.GetQueryString(window.location.href, 'visitorip');
                    }

                    var PushNotificationWithVisitorInfo =
                    {
                        PushNotificationDetails: PushNotificationDetails,
                        MainVisitorDetails: MainVisitorDetails
                    };

                    var xhr = new XMLHttpRequest();
                    xhr.open('Post', TrackerUrl.PushNotificationUrl);
                    xhr.setRequestHeader("Content-Type", "application/json");
                    xhr.send(JSON.stringify(PushNotificationWithVisitorInfo));
                    xhr.onreadystatechange = function () {
                        if (xhr.readyState === 4 && xhr.status === 200 && WebPushSubscriptionSetting.WelcomeMessageText != null)
                            PushNotificationUtil.WelcomeNotification(reg, WebPushSubscriptionSetting);
                    };
                })
                .catch(function (e) {
                    console.error('[subscribe] Unable to subscribe to push', e);
                });
        });

    },
    WelcomeNotification: function (reg, WebPushSubscriptionSetting) {
        try {
            WebPushSubscriptionSetting.IsWelcomeMessage = true;
            WebPushSubscriptionSetting.RedirectTo = WebPushSubscriptionSetting.WelcomeMessageRedirectUrl;
            reg.showNotification(WebPushSubscriptionSetting.WelcomeMessageTitle,
                {
                    body: WebPushSubscriptionSetting.WelcomeMessageText,
                    icon: WebPushSubscriptionSetting.WelcomeMessageIcon,
                    tag: 'plumb5',
                    data: WebPushSubscriptionSetting
                });
        } catch (err) {
            console.log(err.message);
        }
        if (TrackingUtil.IsPushNotificationSubscriptionPage())
            window.close();
    },
    ConvertUrlB64ToUint8Array: function (base64String) {
        var padding = '='.repeat((4 - base64String.length % 4) % 4);
        var base64 = (base64String + padding)
            .replace(/\-/g, '+')
            .replace(/_/g, '/');

        var rawData = window.atob(base64);
        var outputArray = new Uint8Array(rawData.length);

        for (var i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    },
    Convertbase64Encode: function (arrayBuffer) {
        return btoa(String.fromCharCode.apply(null, new Uint8Array(arrayBuffer)));
    }
};

TrackingUtil.BasicInitialize();

//For Forms 


function GetDetailsOTP(OTPFormId, FormType) {

    FormInfoDetails.OTPFormId = OTPFormId;
    FormInfoDetails.FormType = FormType;

    FormUtil.ChangePropertyValue(MainVisitorDetails.BasicDetails);
    FormUtil.ChangePropertyValue(MainVisitorDetails.WebSiteDetails);
    FormUtil.ChangePropertyValue(MainVisitorDetails.ReferrerDetails);
    FormUtil.ChangePropertyValue(MainVisitorDetails.UtmTagDetails);
    FormUtil.ChangePropertyValue(MainVisitorDetails.EventDetails);
    FormUtil.ChangePropertyValue(FormInfoDetails);

    FormUtil.ValidationVistorDetailsBeforeRequestAndChanges();

    var FormDetailsWithVisitorInfo = { FormInfoDetails: FormInfoDetails, MainVisitorDetails: MainVisitorDetails, answerDetails: [], Events: "" };

    var xhr = new XMLHttpRequest();
    xhr.open('Post', TrackerUrl.LoadOTPFormUrl);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(FormDetailsWithVisitorInfo));
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            if (this.response != null && this.response != "") {
                //Event Tracking
                var EventFromChatPushData = JSON.parse(this.response);

                //Form Details
                if (EventFromChatPushData.formLoadDetails != null && EventFromChatPushData.formLoadDetails.length > 0) {
                    FormUtil.BindOnExitAndOnLoadForms(EventFromChatPushData.formLoadDetails);
                }
            }
        }
    };
}

function SaveOTPFormDetails(iframeid, FormType) {
    var formsaveresponsedetails = "";

    var IframeElement = document.getElementById(iframeid);
    var innerDoc = IframeElement.contentDocument || IframeElement.contentWindow.document;
    var FormId = 0;
    if (innerDoc != undefined) {
        onExitFormData = null;  //onexit form details

        var previousFontStyle = "";
        innerDoc.getElementById("ui_btnSave").setAttribute("disabled", true);

        if (FormType == 1 && FormUtil.validationOfForms(iframeid)) {

            innerDoc.getElementById("ui_btnSave").value = "Please wait...";
            innerDoc.getElementById("ui_btnSave").style.fontSize = "12px";

            FormUtil.getAnswerData(iframeid);

            if (iframeid != null && iframeid.length > 0) {

                FormId = iframeid.split("_")[1];

                FormInfoDetails.FormId = parseInt(FormId);
                FormInfoDetails.FormType = FormType;
            }

            var FormDetailsWithVisitorInfo = { FormInfoDetails: FormInfoDetails, MainVisitorDetails: MainVisitorDetails, answerDetails: answerDatas, Events: "" };

            var xhr = new XMLHttpRequest();
            xhr.open('Post', TrackerUrl.SaveOTPFormUrl);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(JSON.stringify(FormDetailsWithVisitorInfo));
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    if (this.response != null) {
                        formsaveresponsedetails = JSON.parse(this.response);

                        if (formsaveresponsedetails.OTPStatus) {
                            if (formBasicDetails.FormType == 1)
                                FormUtil.setFormCookie();

                            if (innerDoc != undefined) {

                                var FormId = iframeid.split("_")[1];

                                if (AllFormDetails != null && AllFormDetails.length > 0) {
                                    for (var i = 0; i < AllFormDetails.length; i++) {
                                        if (AllFormDetails[i].formDetails != null && AllFormDetails[i].formDetails != "" && AllFormDetails[i].formDetails.Id == FormId) {

                                            if (AllFormDetails[i].formDetails.ThankYouMessage != null && AllFormDetails[i].formDetails.ThankYouMessage != "" && AllFormDetails[i].formDetails.ThankYouMessage.length > 0)
                                                innerDoc.getElementById('ui_lblThankYou_' + FormId + '').innerHTML = AllFormDetails[i].formDetails.ThankYouMessage;
                                            else
                                                innerDoc.getElementById('ui_lblThankYou_' + FormId + '').innerHTML = "Thank you for showing interest to us.";

                                            break;
                                        }
                                    }
                                }

                                innerDoc.getElementById('ui_lblThankYouSuccErrIcon_' + FormId + '').innerHTML = "<i class='icon ion-ios-checkmark-outline'></i>";
                                innerDoc.getElementById('lbldivthankyou_' + FormId + '').style.display = "flex";
                            }

                            setTimeout(function () {
                                if (formsaveresponsedetails.RedirectUrl != null && formsaveresponsedetails.RedirectUrl.length > 0) {
                                    if (formsaveresponsedetails.RedirectUrl.indexOf("http") < 0)
                                        parent.window.location.href = "http://" + formsaveresponsedetails.RedirectUrl;
                                    else
                                        parent.window.location.href = formsaveresponsedetails.RedirectUrl;
                                }
                                FormUtil.formHideEffect(iframeid);
                            }, 2000);
                        }
                        else {
                            var FormId = iframeid.split("_")[1];

                            if (AllFormDetails != null && AllFormDetails.length > 0) {
                                for (var i = 0; i < AllFormDetails.length; i++) {
                                    if (AllFormDetails[i].formDetails != null && AllFormDetails[i].formDetails != "" && AllFormDetails[i].formDetails.Id == FormId) {

                                        if (AllFormDetails[i].formDetails.ButtonName != null && AllFormDetails[i].formDetails.ButtonName != "" && AllFormDetails[i].formDetails.ButtonName.length > 0)
                                            innerDoc.getElementById("ui_btnSave").value = AllFormDetails[i].formDetails.ButtonName;
                                        else
                                            innerDoc.getElementById("ui_btnSave").value = "Submit";

                                        break;
                                    }
                                }
                            }

                            innerDoc.getElementById("ui_btnSave").removeAttribute("disabled");
                            innerDoc.getElementById("ui_btnSave").removeAttribute("style");
                            innerDoc.getElementById("ui_btnSave").style.fontSize = previousFontStyle;
                            innerDoc.getElementById('lbldivthankyou_' + FormId + '').style.display = "flex";
                            innerDoc.getElementById('ui_lblThankYou_' + FormId + '').innerHTML = "";
                            innerDoc.getElementById('ui_lblThankYouSuccErrIcon_' + FormId + '').innerHTML = "";
                            innerDoc.getElementById('ui_lblThankYouSuccErrIcon_' + FormId + '').innerHTML = "<i class='icon ion-ios-close-outline'></i>";
                            innerDoc.getElementById('ui_lblThankYou_' + FormId + '').innerHTML = formsaveresponsedetails.OTPMessage;
                            setTimeout(function () { innerDoc.getElementById('lbldivthankyou_' + FormInfoDetails.FormId + '').style.display = "none"; }, 2000);
                        }
                    }
                }
            };
        }
        else {
            innerDoc.getElementById("ui_btnSave").removeAttribute("disabled");
        }
    }
}

function SaveDetails(IframeId, FormType) {

    FormUtil.ChangePropertyValue(MainVisitorDetails.BasicDetails);
    FormUtil.ChangePropertyValue(MainVisitorDetails.WebSiteDetails);
    FormUtil.ChangePropertyValue(MainVisitorDetails.ReferrerDetails);
    FormUtil.ChangePropertyValue(MainVisitorDetails.UtmTagDetails);
    FormUtil.ChangePropertyValue(MainVisitorDetails.EventDetails);
    FormUtil.ChangePropertyValue(FormInfoDetails);

    FormUtil.ValidationVistorDetailsBeforeRequestAndChanges();

    if (FormType == 1 && FormUtil.validationOfForms(IframeId)) {

        FormUtil.getAnswerData(IframeId);

        if (IframeId != null && IframeId.length > 0) {

            var FormId = IframeId.split("_")[1];

            var IframeElement = document.getElementById(IframeId);
            var innerDoc = IframeElement.contentDocument || IframeElement.contentWindow.document;

            if (innerDoc != undefined) {

                if (AllFormDetails != null && AllFormDetails.length > 0) {
                    for (var i = 0; i < AllFormDetails.length; i++) {
                        if (AllFormDetails[i].formDetails != null && AllFormDetails[i].formDetails != "" && AllFormDetails[i].formDetails.Id == FormId) {

                            if (AllFormDetails[i].formDetails.ThankYouMessage != null && AllFormDetails[i].formDetails.ThankYouMessage != "" && AllFormDetails[i].formDetails.ThankYouMessage.length > 0)
                                innerDoc.getElementById('ui_lblThankYou_' + FormId + '').innerHTML = AllFormDetails[i].formDetails.ThankYouMessage;
                            else
                                innerDoc.getElementById('ui_lblThankYou_' + FormId + '').innerHTML = "Thank you for showing interest to us.";

                            break;
                        }
                    }
                }

                innerDoc.getElementById('lbldivthankyou_' + FormId + '').style.display = "flex";
            }
        }

        FormUtil.SaveResponseDetails(IframeId, FormType);
    }
    else if (FormType == 2 || FormType == 4) {
        FormUtil.SaveResponseDetails(IframeId, FormType);
    }
}
///Chat Script


function CreateIframe(iframeId, styleProperty, callback) {
    var p5iframe = document.createElement('iframe');
    p5iframe.id = iframeId; p5iframe.scrolling = "no"; p5iframe.frameborder = "0"; p5iframe.marginwidth = "0"; p5iframe.marginheight = "0"; p5iframe.allowtransparency = true; p5iframe.setAttribute("style", styleProperty);
    p5iframe.onload = function () { callback() };
    if (p5iframe.attachEvent)
        p5iframe.attachEvent('onload', callback, false);
    document.getElementsByTagName("body")[0].appendChild(p5iframe);
}

function P5AppendJavascriptIframes(iframeDocumnet, url, scriptId, callback) {
    var js, headTag = iframeDocumnet.getElementsByTagName("head")[0];
    js = iframeDocumnet.createElement('script');
    js.src = url;
    js.setAttribute("id", scriptId);
    if (!iframeDocumnet.getElementById(scriptId)) {
        headTag.appendChild(js);
    }
    if (callback && typeof (callback) === "function") {
        var appendedScript = iframeDocumnet.getElementById(scriptId);

        if (appendedScript.addEventListener) {
            appendedScript.addEventListener('load', function changeCB(params) {
                appendedScript.removeEventListener("load", changeCB);
                callback();
            }, false);
        }
        else {
            AppendScriptAfterAjaxLoading(callback);
        }
    }
}

var myChatIframe;
function P5ChatInitialise() { if (document != undefined && (document.readyState === "interactive" || document.readyState == "complete")) { StartP5ChatInitialise() } else { window.setTimeout(P5ChatInitialise, 10); } }

function StartP5ChatInitialise() {
    CreateIframe("plumb5ChatIframe", "position:fixed;height:600px;bottom:0px;width: 335px;z-index: 511119255;border: 0px;display:none;", ChatAppendScriptToFrame);
}

function ChatAppendScriptToFrame() {
    myChatIframe = document.getElementById("plumb5ChatIframe");
    P5AppendJavascriptIframes(myChatIframe.contentWindow.document, TrackerUrl.MainUrl + "/json2.min.js", "json");
    FormUtil.AppendStyleIframes(myChatIframe.contentWindow.document, TrackerUrl.MainUrl + "/bootstrap.min.css");
    FormUtil.AppendStyleIframes(myChatIframe.contentWindow.document, TrackerUrl.MainUrl + "/new-chat-style.css");
    FormUtil.AppendStyleIframes(myChatIframe.contentWindow.document, TrackerUrl.MainUrl + "/css/Ionicons/css/ionicons.css");
    P5AppendJavascriptIframes(myChatIframe.contentWindow.document, TrackerUrl.MainUrl + "/jquery-1.10.2.min.js", "ChatJquery", AppendSignalRJs);

    var chatContent = "<div class='chatprevwrp'><div class='chatmesscontainer hideDiv'><div class='chatclsewrp'><i class='icon ion-android-close'></i></div><p>&nbsp;</p></div>" +
        "<div class='chatcontainer min-h-500' id='dvChat'><div class='chatboxwrp'><div class='chatboxtpbar' id='ui_chatboxtpbar'>" +
        "<div class='chattitlwrp'><i class='icon ion-chatboxes font-22'></i><h6 id='ui_ChatHeader'>Chat with us</h6></div><div class='chatoptionwrp'><div class='tdcreatedraft hideDiv'><div class='dropdown'>" +
        "<i class='icon ion-android-more-vertical' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'></i>" +
        "<div class='dropdown-menu dropdown-menu-right keepopen' aria-labelledby='filterbycontacts'><a id='dvSound' class='dropdown-item  muteevent' href='javascript:void(0)'> " +
        "<i class='ion-android-volume-up font-14 pr-1'></i><span id='imgSound' src='" + TrackerUrl.MainUrl + "/volume_loud.png'>Unmute</span></a>" +
        "<a class='dropdown-item' href='javascript:void(0)' onclick='ShowOffLineDiv();'><i class='fa fa-pencil-square-o font-14 pr-1'></i>Edit</a></div></div></div><div class='chatclsewrp'><i class='icon ion-close'></i></div></div></div>" +
        "<div id='dvcontentId'><div class='chatboxcontainer h-400 df-ac-jcenter'><div class='chatAgentNmwrp hideDiv'><div class='agentimgwrp mr-3'></div><div class='agentnametit'><small>Your are chatting with</small><h6 id='ui_agentName'></h6></div></div>" +
        "<div class='chatmediawrp p-3 hideDiv' id = 'ulMesg' ></div> " +
        "<div class='chatmediawrp p-3' id='dvTypingMesg' style='display:none'><div class='media mb-4 d-flex align-items-center'><div class='media mb-4'><div class='agentimgwrp'></div>" +
        "<div class='media-body'><div class='livechatusertype'><div class='lchat-three-bounce'><div class='lchat-child lchat-bounce1 bg-gray-800'></div>" +
        "<div class='lchat-child lchat-bounce2 bg-gray-800'></div><div class='lchat-child lchat-bounce3 bg-gray-800'></div></div></div></div></div></div></div>" +
        "<div class='chatfrmwrp'><div></div><div class='chatusericn bg-reef'>" +
        "<i class='fa fa-user-o'></i></div><div class='chatfrmitemwrp p-2'> <div class='form-group mt-2 mb-1'><label class='frmlbltxt' id='FormTitle'></label></div><div class='form-group'><input type='text' class='form-control form-control-sm' id='txtUpOffVisitorName' placeholder='Your Name'></div>" +
        "<div class='form-group'><input type='text' class='form-control form-control-sm' id='txtUpOffEmailId' placeholder='Email Id'></div><div class='form-group'><input type='text' class='form-control form-control-sm' id='txtUpOffPhoneNumber' placeholder='Phone'></div><div class='form-group'><textarea type='text' class='form-control form-control-sm' id='txtUpOffPrivatMsg' placeholder='Message'></textarea></div>" +
        "<div class='custom-control custom-checkbox ml-1'><input type='checkbox' class='custom-control-input' id='cont_1' name='example1'><label id='txtUpOffrivacyContent' class='custom-control-label frmlbltxt' for='cont_1'>I agree to have my personal data processed for chat support</label></div></div>" +
        "<div class='btnwrp mt-2 mb-2' id ='BtnSubOffDet'><button type='button' class='btn btn-purple btn-block border-0 chatbtnfrmbgcol bg-reef' id='btnUpSubmit'>Start Chat</button><label id='lblThankYou' style='color:red;font-size: small'></div></div></div></div>" +
        "<div class='chatboxtypewrp'><div class='chattypebox pr-2'><input type='text' name='' placeholder='Write a Message' class='form-control bg-textbx' autocomplete='off' id='txtP5ChatMessage'disabled></div>" +
        "<div class='chatsendicn' id='P5ChatMessageSend'><i class='icon ion-paper-airplane font-20 cursor-pointer'></i></div></div></div></div>" +
        "<div id='chateventbtn' class='chatbubwrp bg-reef'><i class='icon ion-android-close font-28'></i> </div></div><div id='dvSoundPlay'></div>";


    myChatIframe.contentWindow.document.body.innerHTML = chatContent;
}

function AppendSignalRJs() {
    P5AppendJavascriptIframes(myChatIframe.contentWindow.document, TrackerUrl.MainUrl + "/jquery.signalR-2.2.0.min.js", "signalRJS", AppendHubsJs);
}
function AppendHubsJs() {
    P5AppendJavascriptIframes(myChatIframe.contentWindow.document, TrackerUrl.plumb5ChatDomain + "signalr/hubs", "hubsJs", AppendPlumbChatJs);
}
function AppendPlumbChatJs() {
    P5AppendJavascriptIframes(myChatIframe.contentWindow.document, TrackerUrl.MainUrl + "/popper.min.js", "popperjs");
    P5AppendJavascriptIframes(myChatIframe.contentWindow.document, TrackerUrl.MainUrl + "/bootstrap.min.js", "bootstrapjs");
    P5AppendJavascriptIframes(myChatIframe.contentWindow.document, TrackerUrl.MainUrl + "/NewChat.js?var=3.4", "chatJs");
}

P5ChatInitialise();

//This is for event saving part

var plumb5 = {
    event: function (eventname, data) {
        p5EventName = eventname;
        p5EventData = data;
        if (p5EventPaused && eventname != null && data != null) {
            var CustomEventsDetails = { AccountId: MainVisitorDetails.AccountId, EventName: eventname, Data: JSON.stringify(data), MachineId: MainVisitorDetails.BasicDetails.Machineid, ContactId: MainVisitorDetails.ContactDetails.ContactId, Session: MainVisitorDetails.BasicDetails.Session, P5MailUniqueID: MainVisitorDetails.ReferrerDetails.P5MailUniqueID, P5SMSUniqueID: MainVisitorDetails.ReferrerDetails.P5SMSUniqueID, P5WhatsAppUniqueID: MainVisitorDetails.ReferrerDetails.P5WhatsAppUniqueID, P5WebPushUniqueID: MainVisitorDetails.ReferrerDetails.P5WebPushUniqueID };

            var xhr = new XMLHttpRequest();
            xhr.open('Post', TrackerUrl.SaveCustomEventUrl);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(JSON.stringify(CustomEventsDetails));
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    var customeventresponsedetails = JSON.parse(this.response);
                    if (customeventresponsedetails.Message != null) {
                        window.console.log(customeventresponsedetails.Message);
                    }
                }
            };
            p5EventName = null;
            p5EventData = null;
        }
    },
    user: function (userdetails) {
        p5EventPaused = false;
        var CustomEventsDetails = { AccountId: MainVisitorDetails.AccountId, Data: JSON.stringify(userdetails), MachineId: MainVisitorDetails.BasicDetails.Machineid, ContactId: MainVisitorDetails.ContactDetails.ContactId, Session: MainVisitorDetails.BasicDetails.Session };

        var xhr = new XMLHttpRequest();
        xhr.open('Post', TrackerUrl.SaveUserDetails);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(CustomEventsDetails));
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                if (this.response != null) {
                    var responsedetails = JSON.parse(this.response);
                    if (responsedetails.Message != null) {
                        window.console.log(responsedetails.Message);
                    }

                    if (responsedetails.ContactId > 0) {
                        MainVisitorDetails.ContactDetails.ContactId = String(responsedetails.ContactId);
                    }

                    if (p5EventName != null && p5EventData != null) {
                        p5EventPaused = true;
                        plumb5.event(p5EventName, p5EventData);
                    }
                    else {
                        p5EventPaused = true;
                    }
                }
            }
        };
    }
}