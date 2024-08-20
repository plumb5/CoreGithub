
var onlineLinkUrl = "http://localhost:33183/", plumb5ChatDomain = "http://localhost:4412/";
var plumb5DesktopNoti = false, machineId, chatAdsId = 186, myIframe, errorCountI = 0;
onlineLinkUrl = 'https:' == document.location.protocol ? onlineLinkUrl.replace("http", "https") : onlineLinkUrl; plumb5ChatDomain = 'https:' == document.location.protocol ? plumb5ChatDomain.replace("http", "https") : plumb5ChatDomain;
try { Plumb5Chat(); } catch (error) { window.console.log(error); }
function Plumb5Chat() { if (document != undefined && (document.readyState === "interactive" || document.readyState == "complete")) { P5ChatInitialise(); } else { window.setTimeout(Plumb5Chat, 10); } }
var chatCOntent = "<div class='dvChatMain'><div class='headingClass message offline'><div></div></div><div id='dvcontentId' class='dvcontent' style='display:none;'><div class='dvCurrentMesg'><div id='dvMessagesId' class='dvMessages'><ul id='ulMesg'></ul></div><div style='border-top: 1px solid #d3d3d3;'><textarea class='inputbox sendmessage' id='txtP5ChatMessage' placeholder='Enter message'></textarea></div></div><div class='dvSettingMain'><div style='border-top: 1px solid #D3D3D3;' id='dvChangeName'><span id='spanChangeName' onclick='updateName();'>Update Name</span></div><div id='dvSound' style='display:none;' >Sound<img id='imgSound' src='" + plumb5ChatDomain + "ChatDesign/volume_loud.png' alt='On/Off' style='float:right;padding-right:3px;' title='Toggel Sound' /></div><div id='dvDesktopNoti' style='display:none;'>Desktop Notification<img style='float:right;padding-right:3px;' alt='On' title='Desktop Notification Status' id='imgDesktopStatus' src='" + plumb5ChatDomain + "ChatDesign/chatDesktopNotiInActive.png' /></div><div id='dvOpUpOffDet' onclick='ShowOffLineDiv();'>Update details</div><div onclick='HideChat()'>Exit</div></div><div class='dvTranscript dvTranscriptSub' onclick='DivActiveCall();'><div><b>Get Transcript Details</b></div><div>Enter email id</div><div><input class='inputbox' id='txtEmailTranscript' name='email' placeholder='Eg: name@example.com' /></div><div><input type='button' id='btnTranscript' value='Send' class='inputee' />&nbsp;<input type='button' id='btnTranscriptCancel' value='Cancel' class='inputee' /><div><label id='lblTranscript' class='error'></label></div></div><br /></div><div class='dvOfflineMain active'><div><b>Please leave your details here</b></div><div>Email <small class='error'>*</small></div><div><input class='inputbox' id='txtUpOffEmailId' name='email' placeholder='Ex: name@example.com' /></div><div>Phone</div><div><input class='inputbox' id='txtUpOffPhoneNumber' name='email' placeholder='Ex: +12014840141'></div><div>Name</div><div><input class='inputbox' id='txtUpOffVisitorName' name='UserName' placeholder='Ex: Gordon Sumner' /></div><div>Your message to us</div><div><textarea class='inputbox' style='height: 37px;' id='txtUpOffPrivatMsg' name='plumMessage' placeholder='Ex: Hi want to know on going offers'></textarea></div><div> <input type='button' id='BtnSubOffDet' value='Send' class='inputee' />&nbsp;<input type='button' id='BtnSubOffDetCanel' value='Cancel' class='inputee' /><br /><div style='padding-left: 1px;'><label id='lblThankYou' class='error'></label></div></div></div><div class='dvSetting'><div style='float: left; border-left: 0px;'><div class='btImgBorLt' title='Banner Hide/Show'></div><div title='Settings' class='btImgBor' ></div> <div title='Get Transcript to mail' class='btImgBorRt'></div> </div><div id='ui_dvPlumbLogo' style='float: right;display:none;'><div style='border-left: 2px solid #d3d3d3;' onclick=\"javascript:window.open('http://www.plumb5.com/Chat.html');\"><img alt='Online marketing and measurment tools' style='border: 0px;' title='Online marketing and measurment tools' src='https://www.plumb5.com/images/plumb5.gif' width='69' height='30' /> </div></div></div></div></div><div id='dvSoundPlay'></div>";
var linksUrl = plumb5ChatDomain.replace("http:", "").replace("https:", "");
function P5ChatInitialise() {
    CreateChatIframe("plumb5ChatIframe", "position:fixed;height:43px;bottom:0px;width: 285px;z-index: 1000;border: 0px;display:none;");
    myIframe = document.getElementById("plumb5ChatIframe");
    setTimeout(function () { ChatAppendScriptToFrame(); }, 10);
    InitializeVales();
}

function ChatAppendScriptToFrame() {
    setTimeout(function () {
        AppendChatJavascriptIframes(myIframe.contentWindow.document, linksUrl + "Scripts/json2.min.js", "json");
        AppendChatStyleIframes(document, linksUrl + "ChatDesign/p5ChatImagesStyle.css");
        AppendChatStyleIframes(myIframe.contentWindow.document, linksUrl + "ChatDesign/ChatStyle.css");
        AppendChatJavascriptIframes(myIframe.contentWindow.document, "//code.jquery.com/jquery-1.10.2.min.js", "ChatJquery", JqueryForSlimScroll);
        myIframe.contentWindow.document.body.innerHTML = chatCOntent;
    }, 100);
}

function JqueryForSlimScroll() {
    AppendChatJavascriptIframes(myIframe.contentWindow.document, linksUrl + "Scripts/PlumbChatjquery.min.js", "SlimScrollJquery", AppendSignalRJs);
    setTimeout(function () {
        myIframe = document.getElementById("plumb5ChatIframe");
        AppendChatJavascriptIframes(myIframe.contentWindow.document, linksUrl + "Scripts/slimScroll.js", "SlimScroll");
    }, 200);
}
function AppendSignalRJs() {
    AppendChatJavascriptIframes(myIframe.contentWindow.document, linksUrl + "Scripts/jquery.signalR-2.2.0.min.js", "signalRJS", AppendHubsJs);
}
function AppendHubsJs() {
    AppendChatJavascriptIframes(myIframe.contentWindow.document, linksUrl + "signalr/hubs", "hubsJs", AppendPlumbChatJs);
}
function AppendPlumbChatJs() {
    AppendChatJavascriptIframes(myIframe.contentWindow.document, linksUrl + "Scripts/NewChat.js", "chatJs");
}

function CreateChatIframe(iframeId, styleProperty) { var p5iframe = document.createElement('iframe'); p5iframe.id = iframeId; p5iframe.scrolling = "no"; p5iframe.frameborder = "0"; p5iframe.marginwidth = "0"; p5iframe.marginheight = "0"; p5iframe.allowtransparency = true; p5iframe.setAttribute("style", styleProperty); document.getElementsByTagName("body")[0].appendChild(p5iframe); }

function AppendChatJavascriptIframes(iframeDocumnet, url, scriptId, callback) {
    var js, headTag = iframeDocumnet.getElementsByTagName("head")[0]; js = iframeDocumnet.createElement('script');
    js.src = url; js.setAttribute("id", scriptId);
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
            AppendChatScriptAfterAjaxLoading(callback, scriptId);
        }
    }
}

function AppendChatScriptAfterAjaxLoading(callback, scriptId) {

    try {
        LoadScript(callback, scriptId);
    }
    catch (err) {
        document.getElementById("lblContent").innerHTML = document.getElementById("lblContent").innerHTML + errorCountI + err + "<br />";
        errorCountI++;
        if (errorCountI < 10);
        window.setTimeout(function () { AppendChatScriptAfterAjaxLoading(callback, scriptId); }, errorCountI);
    }
}

function LoadScript(callback, scriptId) {

    if (scriptId == "ChatJquery") if (myIframe.contentWindow.$ != undefined) callback(); else throw "Error ChatJquery";
    else if (scriptId == "SlimScrollJquery") if (myIframe.contentWindow.$ != undefined) callback(); else throw "Error SlimScrollJquery";
    else if (scriptId == "signalRJS") if (myIframe.contentWindow.$.signalR != undefined) callback(); else throw "Error signalRJS";
    else if (scriptId == "hubsJs") if (myIframe.contentWindow.$.hubConnection != undefined) callback(); else throw "Error hubsJs";
}

function AppendChatStyleIframes(iframeDocumnet, url) { var p5linktag, headTag = iframeDocumnet.getElementsByTagName("head")[0]; p5linktag = iframeDocumnet.createElement('link'); p5linktag.type = 'text/css'; p5linktag.rel = "stylesheet"; p5linktag.href = url; headTag.appendChild(p5linktag); }

function getCookie(c_name) { var i, x, y, ARRcookies = document.cookie.split(";"); for (i = 0; i < ARRcookies.length; i++) { x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("=")); y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1); x = x.replace(/^\s+|\s+$/g, ""); if (x == c_name) { return unescape(y); } } }

function setCookie(c_name, value, exdays) {
    var exdate = new Date(); exdate.setDate(exdate.getDate() + exdays);
    var c_value = escape(value) + ((exdays == null) ? "" : ";path=/;expires=" + exdate.toUTCString());//domain=." + clientDomain + ";
    document.cookie = c_name + "=" + c_value;
}

function p5getdate() { var today = new Date(); var iMonth = (today.getMonth() + 1 < 10) ? "0" + (today.getMonth() + 1).toString() : (today.getMonth() + 1).toString(); var iDay = (today.getDate() < 10) ? "0" + today.getDate() : today.getDate(); return iDay.toString() + iMonth.toString() + today.getFullYear().toString() + today.getHours().toString() + today.getMinutes().toString() + today.getSeconds().toString() + today.getMilliseconds().toString() + (Math.floor(Math.random() * 12345678910)).toString(); }

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
        myIframe.contentWindow.BannerClosed(divId.getAttribute("banner"));

    while (divId && (divId.tagName != "DIV" || !divId.id || divId.id == "MMP5ChatBoxHead"))
        divId = divId.parentNode;
    if (divId) // Check we found a DIV with an ID
    {
        document.getElementById(divId.id).innerHTML = "";
        CheckImageEmptyDiv();
    }
}

P5BannerClickNoti = function (banner) {
    myIframe.contentWindow.BannerClicked(banner);
};

