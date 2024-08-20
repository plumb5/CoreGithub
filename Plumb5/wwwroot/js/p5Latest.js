var p5accountid = 186;
var p5sessionkey = 0;
var p5TrackDomainUrl = "http://s.plumb5.com/";//"//localhost:6297/";
var p5FormService = "http://m.plumb5.com:81/";
var plumb5ChatDomain = "http://m.plumb5.com:81/";
var Scripts = "http://m.plumb5.com:81/";

p5TrackDomainUrl = 'https:' == document.location.protocol ? p5TrackDomainUrl.replace("http", "https") : p5TrackDomainUrl;
var p5machineid, p5session, p5prevtime;
var plumbCurrentTime = plumbfivegetdate("CurrentTime");

p5machineid = p5GetCookie("p5AccountId" + p5accountid);
p5session = p5GetCookie("p5SessionId" + p5accountid);
p5prevtime = p5GetCookie("p5PrevTime" + p5accountid);
//Set the current time
p5SetCookie("p5PrevTime" + p5accountid, plumbCurrentTime, 36500);
p5prevtime = p5prevtime == null || p5prevtime == undefined ? p5GetCookie("p5PrevTime" + p5accountid) : p5prevtime;
var p5repeatnew = 'N';
if (p5machineid == undefined || p5session == undefined) {
    var plumbSession = plumbfivegetdate("Session");
    if (p5machineid == undefined) {
        var numdate = plumbfivegetdate("Machine");
        p5machineid = numdate;
        p5SetCookie("p5AccountId" + p5accountid, numdate, 36500);
    }
    p5SetCookie("p5SessionId" + p5accountid, plumbSession, 36500);
    p5session = plumbSession;
    p5sessionkey = 1;
}
else { p5repeatnew = 'R'; p5session = p5session.replace(/T/g, '').replace(/-/g, '').replace(/ /g, '').replace(/:/g, '') }
var p5domain = document.location.hostname.toString().replace("www.", "").toLowerCase();
var p5url = document.location.toString().replace(/&/g, "~").replace(/#/g, "~$").replace(/'/g, "‘").toLowerCase();
var p5urlpagename = window.location.pathname.split("/").pop() == "" ? p5url.replace('http://', '').replace('https://', '') : "/" + window.location.pathname.split("/").pop();
var p5title = document.title.toString().replace(/&/g, "~").replace(/#/g, "~$").replace(/'/g, "‘").toLowerCase();
var p5reffer = document.referrer.toLowerCase();
var p5referShortern = 'Null';
if (p5reffer == '' || p5reffer == 'undefined' || p5reffer == 'Null') { p5reffer = 'Null'; }
var p5reffertype = 'Direct';
var p5searchby = 'Null';
var p5PaidFlag = 0;
if (p5reffer != 'Null') {
    p5referShortern = p5reffer.split("/")[2].toString();
    var p5refferdomain = p5reffer.split("/")[2].toString().replace("www.", "");
    if (p5refferdomain == p5domain) { p5reffertype = 'Null'; }
    else
    {
        var p5searchEngine = ["google", "yahoo", "r.search.yahoo", "bing", "altavista", "ask", "search", "isearch", "search-results", "searchya", "searchyahoo", "google.co"];
        var p5Social = ["facebook", "l.facebook", "twitter", "t", "linkedin", "pinterest", "myspace", "plus.google", "deviantart", "livejournal", "tagged", "cafemom", "ning", "meetup", "mylife", "multiply", "tumblr", "foursquare", "ibibo", "googleplus", "youtube", "reddit", "delicious", "flickr", "picasa"];
        if (p5searchEngine.indexOf(p5refferdomain.substring(0, p5refferdomain.lastIndexOf('.'))) > -1 || p5searchEngine.indexOf(p5refferdomain) > -1) {
            p5reffertype = "Search";
            var searchParam = ["?q=", "&q=", "#q=", "?p=", "&p=", "?query=", "?searchfor=", "&searchfor="];
            for (var i = 0; i < searchParam.length; i++)
            { if (p5reffer.indexOf(searchParam[i]) > -1) p5searchby = plumbQueryParam(p5reffer, searchParam[i].replace(/&/g, "").replace("?", "").replace(/#/g, "").replace(/=/g, "")); }
        }
        else if (p5Social.indexOf(p5refferdomain.substring(0, p5refferdomain.lastIndexOf('.'))) > -1 || p5Social.indexOf(p5refferdomain) > -1) { p5reffertype = "Social"; }
        else if (p5reffer.indexOf("/aclk?sa=") > -1 || p5reffer.indexOf("googleads.g.doubleclick.net") > -1 || p5reffer.indexOf("googleadservices") > -1) {
            p5reffertype = "Paid";
            p5PaidFlag = p5reffer.indexOf("/aclk?sa=") > -1 ? 1 : 2;
        }
        else { p5reffertype = 'Refer'; }
    }
    p5reffer = p5reffer.replace(/&/g, "~").replace(/#/g, "~$").replace(/'/g, "‘");
}
var p5sessiondiff = Math.floor((new Date(plumbCurrentTime) - new Date(p5prevtime)) / 1000);
if ((p5sessiondiff > 300 && p5reffertype != 'Null') || p5reffertype == 'Search' || p5reffertype == 'Refer' || p5reffertype == 'Social' || p5reffertype == 'Paid') {//p5reffertype == 'Direct' ||
    var plumbSession = plumbfivegetdate("Session");
    p5SetCookie("p5SessionId" + p5accountid, plumbSession, 36500);
    p5session = plumbSession;
    p5sessionkey = 1;
}
var p5useragent = 'Null';
if (document.all) var version = /MSIE \\d+.\\d+/;
if (!document.all) { p5useragent = navigator.userAgent.toLowerCase(); } else { p5useragent = navigator.appVersion.match(version).toLowerCase(); }
var p5browser = 'Null';
if (p5useragent.indexOf("opera") != -1) { p5browser = "Opera"; }
else if (p5useragent.indexOf("msie") != -1) { p5browser = "IE"; }
else if (p5useragent.indexOf("chrome") != -1) { p5browser = "Chrome"; }
else if (p5useragent.indexOf("safari") != -1) { p5browser = "Safari"; }
else if (p5useragent.indexOf("firefox") != -1) { p5browser = "Mozilla"; }
var p5emailid = '', p5visitorid = '';
if (p5url.toLowerCase().indexOf("plumb5email=") > -1) { p5emailid = plumbQueryParam(p5url, 'plumb5email'); }
var P5LoggedInEmailIdElement = document.getElementById('p5EmailId');
if (P5LoggedInEmailIdElement != null && P5LoggedInEmailIdElement != undefined)
    p5emailid = P5LoggedInEmailIdElement.innerHTML;
var Plumb5VisitorIdElement = document.getElementById('p5VisitorId');
if (Plumb5VisitorIdElement != null && Plumb5VisitorIdElement != undefined)
    p5visitorid = Plumb5VisitorIdElement.innerHTML;
var p5deviceid = 0;
if (p5useragent.match(/android.+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od|ad)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino|webos/i))
    p5deviceid = 1;
var p5trackurl = p5TrackDomainUrl + "P5TrackJs/p5Track.js?AccountId=" + p5accountid + "&MachineId=" + p5machineid + "&SessionId=" + p5session + "&Reffer=" + p5reffer + "&RefferType=" + p5reffertype + "&SearchBy=" + p5searchby + "&PageUrl=" + p5url + "&Domain=" + p5domain + "&PageTitle=" + p5title + "&RepeatNew=" + p5repeatnew + "&EmailId=" + p5emailid + "&VisitorId=" + p5visitorid + "&Browser=" + p5browser + "&UserAgent=" + p5useragent + "&DeviceId=" + p5deviceid + "&SessionKey=" + p5sessionkey + "&PaidFlag=" + p5PaidFlag + "&ShorternPage=" + p5urlpagename + "&ShorternRefer=" + p5referShortern;
P5AppendJavascriptIframes(document, p5trackurl, "jsId");
function plumbfiveChkall(p5eventdata) {
    if (p5eventdata != '0' || p5eventdata != '-1')
        plumbeventTracking(p5eventdata);
}
function p5Forms(FormStatus) {
    if (FormStatus == 'True') Plumb5Engine();
}
function p5Chat(ChatStatus) {
    if (ChatStatus == 'True') P5ChatInitialise();
}
function plumbeventTracking(alleventid) {
    var p5eventidarr = alleventid.split(',');
    for (var i = 0; i < p5eventidarr.length; i++) {
        var p5eventid = document.getElementById(p5eventidarr[i]);
        if (p5eventid != null) {
            addp5Listener(p5eventid, 'click', function (e) {
                p5trackurl = p5TrackDomainUrl + "P5TrackJs/p5Track.js?AccountId=" + p5accountid + "&MachineId=" + p5machineid + "&SessionId=" + p5session + "&PageUrl=" + p5url + "&Domain=" + p5domain + "&UserAgent=" + p5useragent + "&DeviceId=" + p5deviceid + "&EventIds=" + e.target.id;
                P5AppendJavascriptIframes(document, p5trackurl, "jseventId");
            });
        }
    }
}
//default get set cookie function...............
function p5GetCookie(c_name) {
    var i, x, y, ARRcookies = document.cookie.split(";");
    for (i = 0; i < ARRcookies.length; i++) {
        x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
        y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
        x = x.replace(/^\s+|\s+$/g, "");
        if (x == c_name) {
            return unescape(y);
        }
    }
}
function p5SetCookie(c_name, value, exdays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value = escape(value) + ((exdays == null) ? "" : ";domain=.plumb5.com;path=/;expires=" + exdate.toUTCString());
    document.cookie = c_name + "=" + c_value;
}
//Cookie value from time...............
function plumbfivegetdate(P5key) {
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
            strDateOut = strYear.toString() + '' + (iMonth.length == 1 ? '0' + iMonth : iMonth.toString()) + '' + (iDay.length == 1 ? '0' + iDay : iDay.toString()) + '' + (today.getHours().toString().length == 1 ? '0' + today.getHours().toString() : today.getHours().toString()) + '' + (today.getSeconds().toString().length == 1 ? '0' + today.getSeconds().toString() : today.getSeconds().toString()) + '' + (today.getMilliseconds().toString().length == 1 ? '00' + today.getMilliseconds().toString() : today.getMilliseconds().toString()) + '' + (today.getMinutes().toString().length == 1 ? '0' + today.getMinutes().toString() : today.getMinutes().toString());
            break;
        case "Machine":
            strDateOut = (iMonth.length == 1 ? '0' + iMonth : iMonth.toString()) + '' + (iDay.length == 1 ? '0' + iDay : iDay.toString()) + '' + strYear.toString() + '' + (today.getHours().toString().length == 1 ? '0' + today.getHours().toString() : today.getHours().toString()) + '' + (today.getMinutes().toString().length == 1 ? '0' + today.getMinutes().toString() : today.getMinutes().toString()) + '' + (today.getSeconds().toString().length == 1 ? '0' + today.getSeconds().toString() : today.getSeconds().toString()) + (today.getMilliseconds().toString().length == 1 ? '00' + today.getMilliseconds().toString() : today.getMilliseconds().toString());
            break;
        case "CurrentTime":
            strDateOut = strYear.toString() + '-' + (iMonth.length == 1 ? '0' + iMonth : iMonth.toString()) + '-' + (iDay.length == 1 ? '0' + iDay : iDay.toString()) + 'T' + (today.getHours().toString().length == 1 ? '0' + today.getHours().toString() : today.getHours().toString()) + ':' + (today.getMinutes().toString().length == 1 ? '0' + today.getMinutes().toString() : today.getMinutes().toString()) + ':' + (today.getSeconds().toString().length == 1 ? '0' + today.getSeconds().toString() : today.getSeconds().toString());
            break;
    }
    return strDateOut;
}
function plumbQueryParam(url, name) {

    name = name.toLowerCase();
    var results = new RegExp('[\\?&#]' + name + '=([^&#]*)').exec(url.toLowerCase());
    if (!results) {
        return 'Null';
    }
    return results[1] || 'Null';
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
var errorCountI = 0;
function AppendScriptAfterAjaxLoading(callback) {
    try {
        LoadScript(callback);
    }
    catch (err) {
        errorCountI++;
        if (errorCountI < 3000);
        window.setTimeout(function () { AppendScriptAfterAjaxLoading(callback); }, errorCountI);
    }
}


function addp5Listener(element, type, callback) {
    if (element.addEventListener) element.addEventListener(type, callback);
    else if (element.attachEvent) element.attachEvent('on' + type, callback);
}
function p5Transaction(p5Trans) {
    var p5queryTrans = '';
    for (var m = 0; m < p5Trans.length; m++) {
        p5queryTrans += p5Trans[m].productId + "," + p5Trans[m].productName + "," + p5Trans[m].quantity + "," + p5Trans[m].totalAmount + "," + p5Trans[m].status + "," + p5Trans[m].ProductImage + ";";
    }
    p5queryTrans = p5queryTrans.slice(0, -1);
    var p5path = p5TrackDomainUrl + "P5TrackJs/p5Transaction.js?AccountId=" + p5accountid + "&MachineId=" + p5machineid + "&SessionId=" + p5session + "&Domain=" + p5domain + "&PageUrl=" + p5url + "&Transaction=" + p5queryTrans;
    P5AppendJavascriptIframes(document, p5path, "jsTransId");
}


//engagement.................................


function LoadScript(callback) {
    var myIframe = document.getElementById("Plumb5FromCampaign" + formCampaignId + "");
    if (myIframe.contentWindow.$ != undefined) {
        callback();
    }
    else {
        throw "Error";
    }
}
function CreateIframe(iframeId, styleProperty, callback) {
    var p5iframe = document.createElement('iframe');
    p5iframe.id = iframeId; p5iframe.scrolling = "no"; p5iframe.frameborder = "0"; p5iframe.marginwidth = "0"; p5iframe.marginheight = "0"; p5iframe.allowtransparency = true; p5iframe.setAttribute("style", styleProperty);
    p5iframe.onload = function () { callback() };
    if (p5iframe.attachEvent)
        p5iframe.attachEvent('onload', callback, false);
    document.getElementsByTagName("body")[0].appendChild(p5iframe);
}

function AppendStyleIframes(iframeDocumnet, url) {
    var p5linktag, headTag = iframeDocumnet.getElementsByTagName("head")[0];
    p5linktag = iframeDocumnet.createElement('link');
    p5linktag.type = 'text/css'; p5linktag.rel = "stylesheet";
    p5linktag.href = url;
    headTag.appendChild(p5linktag);
}

function FormLoaded() {
    var tagObject = document.getElementsByTagName("div");
    for (var i = 0; i < tagObject.length; i++) {
        if (tagObject[i].getAttribute("plumb5") != null && tagObject[i].getAttribute("plumb5") != undefined) {
            var findFormId = tagObject[i].getAttribute("plumb5formidentifier");
            CreateStaticIframe(tagObject[i], "Plumb5FromCampaign" + findFormId + "", findFormId, "");
        }
    }
}

function CreateStaticIframe(tagObject, iframeId, findFormId, styleProperty) {
    var p5iframe = document.createElement('iframe');
    p5iframe.name = findFormId;
    p5iframe.setAttribute("name", findFormId);
    p5iframe.id = iframeId; p5iframe.scrolling = "no"; p5iframe.frameborder = "0"; p5iframe.marginwidth = "0"; p5iframe.marginheight = "0"; p5iframe.allowtransparency = true; p5iframe.setAttribute("style", styleProperty); p5iframe.style.border = "none";
    p5iframe.onload = function () { StartAppendScriptStaticForm(p5iframe); };
    if (p5iframe.attachEvent)
        p5iframe.attachEvent('onload', function () { StartAppendScriptStaticForm(p5iframe); }, false);
    tagObject.appendChild(p5iframe);
}

function StartAppendScriptStaticForm(p5iframe) {
    AppendScriptToFrame(p5iframe, true);
}

function ParentRedirectIntoAnotherPage(url, NewPage) {
    if (NewPage != undefined && NewPage)
        window.open(url)
    else
        window.location.href = url;
}

//--------------------------------------------



function Plumb5Engine() {
    CaptureFormInitialise(); FormLoaded();
}

function CaptureFormInitialise() {
    CreateIframe("Plumb5FromCampaign", "z-index:20000;display:none;border:none;", StartAppendScript);
}

function StartAppendScript() {
    var myIframe = document.getElementById("Plumb5FromCampaign");
    AppendScriptToFrame(myIframe, false);
}

function CreateIframe(iframeId, styleProperty, callback) {
    var p5iframe = document.createElement('iframe');
    p5iframe.id = iframeId; p5iframe.scrolling = "no"; p5iframe.frameborder = "0"; p5iframe.marginwidth = "0"; p5iframe.marginheight = "0"; p5iframe.allowtransparency = true; p5iframe.setAttribute("style", styleProperty);
    p5iframe.onload = function () { callback() };
    if (p5iframe.attachEvent)
        p5iframe.attachEvent('onload', callback, false);
    document.getElementsByTagName("body")[0].appendChild(p5iframe);
}

function AppendScriptToFrame(myIframe, isStatic) {
    P5AppendJavascriptIframes(myIframe.contentWindow.document, "//code.jquery.com/jquery-1.10.2.min.js", "analyticsJquery",
       function () {
           if (isStatic)
               P5AppendJavascriptIframes(myIframe.contentWindow.document, Scripts + "Scripts/StaticFormGetDetailsToBindDesign.js?ver=1.1", "FromScript");
           else
               P5AppendJavascriptIframes(myIframe.contentWindow.document, Scripts + "Scripts/FormGetDetailsToBindDesign.js?ver=1.1", "FromScript");

           P5AppendJavascriptIframes(myIframe.contentWindow.document, "//code.jquery.com/jquery-1.10.2.min.js", "jqueryUI");
       }
   );
    AppendStyleIframes(myIframe.contentWindow.document, "//fonts.googleapis.com/css?family=Source+Sans+Pro|Cantora+One|Cabin+Condensed:400,500,600|Francois+One|Homenaje|Allerta|Allerta+Stencil|PT+Sans+Caption");
    AppendStyleIframes(myIframe.contentWindow.document, "//code.jquery.com/ui/1.11.1/themes/smoothness/jquery-ui.css");
    AppendStyleIframes(myIframe.contentWindow.document, Scripts + "Scripts/CaptureFormDefaultStyles.css");
}
//-----------------------------Chat Details
var myChatIframe;


function P5ChatInitialise() {
    CreateIframe("plumb5ChatIframe", "position:fixed;height:43px;bottom:0px;width: 285px;z-index: 1000;border: 0px;display:none;", ChatAppendScriptToFrame);
    InitializeVales();
}

function ChatAppendScriptToFrame() {
    myChatIframe = document.getElementById("plumb5ChatIframe");
    P5AppendJavascriptIframes(myChatIframe.contentWindow.document, Scripts + "Scripts/json2.min.js", "json");
    AppendStyleIframes(document, Scripts + "Scripts/p5ChatImagesStyle.css");
    AppendStyleIframes(myChatIframe.contentWindow.document, Scripts + "Scripts/ChatStyle.css");
    P5AppendJavascriptIframes(myChatIframe.contentWindow.document, "//code.jquery.com/jquery-1.10.2.min.js", "ChatJquery", JqueryForSlimScroll);
    var chatContent = "<div class='dvChatMain'><div class='headingClass message offline'><div></div></div><div id='dvcontentId' class='dvcontent' style='display:none;'><div class='dvCurrentMesg'><div id='dvMessagesId' class='dvMessages'><ul id='ulMesg'></ul></div><div style='border-top: 1px solid #d3d3d3;'><textarea class='inputbox sendmessage' id='txtP5ChatMessage' placeholder='Enter message'></textarea></div></div><div class='dvSettingMain'><div style='border-top: 1px solid #D3D3D3;' id='dvChangeName'><span id='spanChangeName' onclick='updateName();'>Update Name</span></div><div id='dvSound' style='display:none;' >Sound<img id='imgSound' src='//m.plumb5.com:81/images/img_trans.gif' alt='On/Off' style='float:right;padding-right:3px;' title='Toggel Sound' /></div><div id='dvDesktopNoti' style='display:none;'>Desktop Notification<img style='float:right;padding-right:3px;' alt='On' title='Desktop Notification Status' id='imgDesktopStatus' src='//m.plumb5.com:81/images/img_trans.gif' /></div><div id='dvOpUpOffDet' onclick='ShowOffLineDiv();'>Update details</div><div onclick='HideChat()'>Exit</div></div><div class='dvTranscript dvTranscriptSub' onclick='DivActiveCall();'><div><b>Get Transcript Details</b></div><div>Enter email id</div><div><input class='inputbox' id='txtEmailTranscript' name='email' placeholder='Eg: name@example.com' /></div><div><input type='button' id='btnTranscript' value='Send' class='inputee' />&nbsp;<input type='button' id='btnTranscriptCancel' value='Cancel' class='inputee' /><div><label id='lblTranscript' class='error'></label></div></div><br /></div><div class='dvOfflineMain active'><div><b>Please leave your details here</b></div><div>Email <small class='error'>*</small></div><div><input class='inputbox' id='txtUpOffEmailId' name='email' placeholder='Ex: name@example.com' /></div><div>Phone</div><div><input class='inputbox' id='txtUpOffPhoneNumber' name='email' placeholder='Ex: +12014840141'></div><div>Name</div><div><input class='inputbox' id='txtUpOffVisitorName' name='UserName' placeholder='Ex: Gordon Sumner' /></div><div>Your message to us</div><div><textarea class='inputbox' style='height: 37px;' id='txtUpOffPrivatMsg' name='plumMessage' placeholder='Ex: Hi want to know on going offers'></textarea></div><div> <input type='button' id='BtnSubOffDet' value='Send' class='inputee' />&nbsp;<input type='button' id='BtnSubOffDetCanel' value='Cancel' class='inputee' /><br /><div style='padding-left: 1px;'><label id='lblThankYou' class='error'></label></div></div></div><div class='dvSetting'><div style='float: left; border-left: 0px;'><div class='btImgBorLt' title='Banner Hide/Show'></div><div title='Settings' class='btImgBor' ></div> <div title='Get Transcript to mail' class='btImgBorRt'></div> </div><div id='ui_dvPlumbLogo' style='float: right;display:none;'><div style='border-left: 2px solid #d3d3d3;' onclick=\"javascript:window.open('http://www.plumb5.com/Chat.html');\"><img alt='Online marketing and measurment tools' style='border: 0px;' title='Online marketing and measurment tools' src='https://www.plumb5.com/images/plumb5.gif' width='69' height='30' /> </div></div></div></div></div><div id='dvSoundPlay'></div>";
    myChatIframe.contentWindow.document.body.innerHTML = chatContent;
}


function JqueryForSlimScroll() {
    P5AppendJavascriptIframes(myChatIframe.contentWindow.document, Scripts + "Scripts/PlumbChatjquery.min.js", "SlimScrollJquery", AppendSignalRJs);
    setTimeout(function () {
        P5AppendJavascriptIframes(myChatIframe.contentWindow.document, Scripts + "Scripts/slimScroll.js", "SlimScroll");
    }, 200);
}
function AppendSignalRJs() {
    P5AppendJavascriptIframes(myChatIframe.contentWindow.document, Scripts + "Scripts/jquery.signalR-2.2.0.min.js", "signalRJS", AppendHubsJs);
}
function AppendHubsJs() {
    P5AppendJavascriptIframes(myChatIframe.contentWindow.document, plumb5ChatDomain + "ChatApp/signalr/hubs", "hubsJs", AppendPlumbChatJs);
}
function AppendPlumbChatJs() {
    P5AppendJavascriptIframes(myChatIframe.contentWindow.document, Scripts + "Scripts/NewChat.js", "chatJs");
}

function InitializeVales() {
    var plumb5MmChatDiv = document.createElement("div");
    plumb5MmChatDiv.setAttribute("id", "P5MMmainDiv");
    document.body.appendChild(plumb5MmChatDiv);
    for (var i = 1; i <= 4; i++) {
        plumb5MmChatDiv = document.createElement("div");
        plumb5MmChatDiv.setAttribute("id", "P5MMdiv_" + i);
        document.body.appendChild(plumb5MmChatDiv);
        document.getElementById("P5MMmainDiv").appendChild(plumb5MmChatDiv);
    }
}

function BindImagesInFlow(imageOrVideoUrl, redirectUrl, theme) {

    imageOrVideoUrl = imageOrVideoUrl.replace("https:", "").replace("http:", "");
    var closeImgBanner = "";
    var videoid = imageOrVideoUrl.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/); var regExpUrl = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    if (videoid != null && imageOrVideoUrl.indexOf("<iframe") < 0) {
        imageOrVideoUrl = '<iframe width="280" height="236" src="' + imageOrVideoUrl.replace("watch?v=", "embed/") + '" frameborder="0" allowfullscreen></iframe>';
    }
    redirectUrl = regExpUrl.test(redirectUrl) ? "href = '" + redirectUrl + "'" : "href='javascript:void();'";
    if (imageOrVideoUrl.indexOf("iframe") < 0 && imageOrVideoUrl.indexOf("embed") < 0) {
        closeImgBanner = imageOrVideoUrl;
        imageOrVideoUrl = "<a id='a_redirect' " + redirectUrl + " target='_blank'><img class='p5img' src='" + imageOrVideoUrl + "' onclick=\"P5BannerClickNoti('" + imageOrVideoUrl + "');\" /></a>";
    }
    var content = "<div id='MMP5ChatBoxHead' class='closeButton' onclick='closeMMDiv(this)' banner='" + closeImgBanner + "'>x</div><div class='bannerMainDiv'>" + imageOrVideoUrl + "</div>";
    BindImagesData(content, theme);
}

function BindImagesData(imagesDiv, theme) {
    var mmImagesCount = CheckImageEmptyDiv();
    document.getElementById("P5MMdiv_" + mmImagesCount).innerHTML = imagesDiv;
    document.getElementById("P5MMdiv_" + mmImagesCount).className = "themeborder" + theme;
}

function CheckImageEmptyDiv() {
    var i;
    var emptyDiv = 4;
    for (i = 1; i <= 4; i++) {
        if (document.getElementById("P5MMdiv_" + i).childNodes.length == 0) {
            if (i < 4) {
                if (document.getElementById("P5MMdiv_" + (i + 1)).childNodes.length > 0) {
                    document.getElementById("P5MMdiv_" + i).innerHTML = document.getElementById("P5MMdiv_" + (i + 1)).innerHTML;
                    document.getElementById("P5MMdiv_" + (i + 1)).innerHTML = "";
                }
            }
        }
    }
    for (i = 1; i < 4; i++) {
        if (document.getElementById("P5MMdiv_" + i).childNodes.length == 0) {
            emptyDiv = i;
            break;
        }
    }
    return emptyDiv;
}

function closeMMDiv(divId) {
    if (divId.getAttribute("banner"))
        myChatIframe.contentWindow.BannerClosed(divId.getAttribute("banner"));

    while (divId && (divId.tagName != "DIV" || !divId.id || divId.id == "MMP5ChatBoxHead"))
        divId = divId.parentNode;
    if (divId) // Check we found a DIV with an ID
    {
        document.getElementById(divId.id).innerHTML = "";
        CheckImageEmptyDiv();
    }
}

P5BannerClickNoti = function (banner) {
    myChatIframe.contentWindow.BannerClicked(banner);
};