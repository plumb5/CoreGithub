var ruleStatus = 0, pushId = 0, PoweredByStatus = 0;
var urlregex = new RegExp("^(http:\/\/|https:\/\/){1}([0-9A-Za-z]+\.)");
$(document).ready(function () {
    $('#img_Status').removeAttr('title');
    CheckWelcomeMsgStatus();
    pushId = $.urlParam("PushId");
    if (pushId > 0) {
        $("#dv_HidenotifBox").show();
        $("#dv_largeImg").show();
        BindNotification();
    }
    if (window.location.href.toLowerCase().indexOf("browsernotifysetting") > -1) {
        $("#dv_HidenotifBox").hide();
        $("#dv_largeImg").hide();
        BindNotificationSettings();
        $("#dv_crtNotify").css("float", "").css("padding", "20px");
        $("#dv_pd").css("padding", "");
    }
    //window.location.href.toLowerCase().indexOf("sendnotification") > -1 ? BindNotification() : window.location.href.toLowerCase().indexOf("browsernotifysetting") > -1 ? BindNotificationSettings() : function () { };
});
$("#div_Pbox").click(function () {
    $("#div_Pbox_Content").toggle('slow');
});
$("#div_PnativeBrowser").click(function () {
    $("#div_PnativeBrowser_Content").toggle('slow');
});
$("#divOne").click(function () {
    $("#divOne_Content").toggle('slow');
});

var OptIn = 1;
function changerad(val, type) {
    if (val == 4) {
        $("#ui_rad1").last().addClass("md-checked");
        $("#ui_rad2").last().removeClass("md-checked");
        $("#OneStep").show();
        $("#TwoStep1").hide();
        $("#TwoStep2").hide();
        OptIn = 4;
    } else {
        $("#ui_rad2").last().addClass("md-checked");
        $("#ui_rad1").last().removeClass("md-checked");
        $("#OneStep").hide();
        $("#TwoStep1").show();
        $("#TwoStep2").show();
        OptIn = 1;
    }
    if (type != 'onload')
        SettingUpStaticDictionary();
}


var wlMsgStatus = 0;
function wlMsgControl(val) {
    if (val.className.indexOf("md-checked") == -1) {
        $("#ui_mdchk").last().addClass("md-checked");
        $("#div_PBtnLinks_Content").show('fade');
        wlMsgStatus = 1;
    } else {
        $("#ui_mdchk").last().removeClass("md-checked");
        $("#div_PBtnLinks_Content").hide('fade');
        wlMsgStatus = 0;
    }
}

$("#chk_hideBox").click(function () {
    if ($("#chk_hideBox").is(':checked'))
        $("#di_hideNotif").show();
    else
        $("#di_hideNotif").hide();
});

$("#chk_hideImg").click(function () {
    if ($("#chk_hideImg").is(':checked')) {
        $("#dv_AddLImg").show();
        $("#span_Img").show();
    }
    else {
        $("#dv_LImg").hide();
        $("#logo_upload7").val('');
        $('#img_uploading7').attr('src', '');
        $("#dv_AddLImg").hide();
        $("#span_Img").hide();
    }
});

function TitleSub(value) {
    $("#dv_Images").show();
    if (value == "imagewithText") {
        $("#dv_Tckr").show();
        $("#dv_img").show();
        $("#dv_withText").show();
        $("#dv_withOutText").hide();
        $("#drp_positionWithTxt").show();
        $("#drp_positionWithImg").hide();
        $("#dv_prv").css("width", "81%");
        $('#dvPoweredby').show();
        if ($("#drp_positionWithTxt").val() == "custom")
            $("#ui_txtcustom").show();
        else
            $("#ui_txtcustom").hide();

        $("#dvD_Img").show();
        $("#dvD_Istyles").show();
        $("#dvD_Font").show();
        $("#dvD_Back").show();
        $("#dvD_Bstyles").show();
        $("#dvD_Ttl").show();
        $("#dvD_Tstyles").show();
        $("#dvD_STtl").show();
        $("#dvD_STstyles").show();
        $("#dvD_AB").show();
        $("#dvD_ABstyles").show();
        $("#dvD_DB").show();
        $("#dvD_DBstyles").show();
    }
    else if (value == "text") {
        $("#dv_Images").hide();
        $("#dv_img").hide();
        $("#dv_Tckr").show();
        $("#dv_withText").show();
        $("#dv_withOutText").hide();
        $("#drp_positionWithTxt").show();
        $("#drp_positionWithImg").hide();
        $("#dv_prv").css("width", "100%");
        $('#dvPoweredby').show();
        if ($("#drp_positionWithTxt").val() == "custom")
            $("#ui_txtcustom").show();
        else
            $("#ui_txtcustom").hide();

        $("#dvD_Img").show();
        $("#dvD_Istyles").show();
        $("#dvD_Font").show();
        $("#dvD_Back").show();
        $("#dvD_Bstyles").show();
        $("#dvD_Ttl").show();
        $("#dvD_Tstyles").show();
        $("#dvD_STtl").show();
        $("#dvD_STstyles").show();
        $("#dvD_AB").show();
        $("#dvD_ABstyles").show();
        $("#dvD_DB").show();
        $("#dvD_DBstyles").show();
    }
    else {
        $("#dv_Tckr").hide();
        $("#dv_withText").hide();
        $("#dv_withOutText").show();
        $("#drp_positionWithTxt").hide();
        $("#drp_positionWithImg").show();
        $('#dvPoweredby').hide();

        $("#dvD_Img").show();
        $("#dvD_Istyles").show();

        $("#dvD_Font").hide();
        $("#dvD_Back").hide();
        $("#dvD_Bstyles").hide();
        $("#dvD_Ttl").hide();
        $("#dvD_Tstyles").hide();
        $("#dvD_STtl").hide();
        $("#dvD_STstyles").hide();
        $("#dvD_AB").hide();
        $("#dvD_ABstyles").hide();
        $("#dvD_DB").hide();
        $("#dvD_DBstyles").hide();


        $("#dv_preview").css("position", "absolute");
        $("#dv_preview").css("margin-top", "0");
        if ($("#drp_positionWithImg").val() == "custom")
            $("#ui_txtcustom").show();
        else
            $("#ui_txtcustom").hide();
    }
}

function imagePosition(val) {
    $("#dv_imagePos").css("bottom", "0px");
    $("#dv_imagePos").css("float", "right");
    $("#dv_imagePos").css("left", "0");
    $("#ui_txtcustom").hide();
    switch (val) {
        case "top:1px;left: calc(100% - 460px);":
        case "top:1px;left: calc(100% - 100px);":
            $("#dv_imagePos").css("bottom", "0px");
            $("#dv_imagePos").css("float", "right");
            break;
        case "top:1px;":
            $("#dv_imagePos").css("bottom", "0px");
            $("#dv_imagePos").css("float", "left");
            break;
        case "bottom: 1px;left: calc(100% - 460px);": //Bottom Right
        case "bottom: 1px;left: calc(100% - 100px);":
            $("#dv_imagePos").css("bottom", "-85px");
            $("#dv_imagePos").css("float", "right");
            break;
        case "bottom: 1px;"://Bottom Left
            $("#dv_imagePos").css("bottom", "-85px");
            $("#dv_imagePos").css("float", "left");
            break;
        case "left: calc(100% - 460px);top: calc(50% - 100px);"://Center Right
        case "left: calc(100% - 100px);top: calc(50% - 100px);":
            $("#dv_imagePos").css("bottom", "-30%");
            $("#dv_imagePos").css("float", "right");
            break;
        case "top: calc(50% - 100px);"://Center Left
            $("#dv_imagePos").css("bottom", "-30%");
            $("#dv_imagePos").css("float", "left");
            break;
        case "top:1px;left: calc(50% - 220px);"://Top Center
        case "top:1px;left: calc(50% - 50px);":
            $("#dv_imagePos").css("left", "43%");
            $("#dv_imagePos").css("float", "left");
            $("#dv_imagePos").css("bottom", "0");
            break;
        case "bottom:1px;left: calc(50% - 220px);"://Bottom Center
        case "bottom:1px;left: calc(50% - 50px);":
            $("#dv_imagePos").css("left", "43%");
            $("#dv_imagePos").css("float", "left");
            $("#dv_imagePos").css("bottom", "-59%");
            break;
        case "custom":
            $("#ui_txtcustom").show();
            break;
    }
}
function LogoUpload(inputVal) {
    if ($("#logo_upload1").val() != "") {
        var uploadFile = $("#logo_upload1").get(0);
        var uploadedfile = uploadFile.files;
        var fromdata;
        if (typeof window.FormData == "undefined") {
            fromdata = [];
        }
        else {
            fromdata = new window.FormData();
        }
        for (var i = 0; i < uploadedfile.length; i++) {
            if (typeof window.FormData == "undefined") {
                fromdata.push(uploadedfile[i].name, uploadedfile[i]);
            }
            else {
                fromdata.append(uploadedfile[i].name, uploadedfile[i]);
            }
        }
        var choice = {};
        choice.url = "../Browser/FileFormat",
            choice.type = "POST";
        choice.data = fromdata;
        choice.contentType = false;
        choice.processData = false;
        choice.async = false;
        choice.success = function (response) {
            if (response == 0) {
                $("#logo_upload1").val('');
                ShowErrorMessage("Please Select Only Image File!");
            }
            else {
                var reader = new FileReader();
                reader.onload = function (e) {
                    if ($("#drp_ticker").val() == "image")
                        $('#img_uploading1').attr('src', e.target.result);
                    else
                        $('#img_uploading').attr('src', e.target.result);
                }
                reader.readAsDataURL(inputVal.files[0]);
            }
        };
        choice.error = function (result) {
            $("#dvLoading").hide();
            ShowErrorMessage("Error!!");
        };
        $.ajax(choice);
        event.preventDefault();
    }
}
function LogoUpload2(inputVal) {
    if ($("#logo_upload2").val() != "") {
        var uploadFile = $("#logo_upload2").get(0);
        var uploadedfile = uploadFile.files;
        var fromdata;
        if (typeof window.FormData == "undefined") {
            fromdata = [];
        }
        else {
            fromdata = new window.FormData();
        }
        for (var i = 0; i < uploadedfile.length; i++) {
            if (typeof window.FormData == "undefined") {
                fromdata.push(uploadedfile[i].name, uploadedfile[i]);
            }
            else {
                fromdata.append(uploadedfile[i].name, uploadedfile[i]);
            }
        }
        var choice = {};
        choice.url = "../Browser/FileFormat",
            choice.type = "POST";
        choice.data = fromdata;
        choice.contentType = false;
        choice.processData = false;
        choice.async = false;
        choice.success = function (response) {
            if (response == 0) {
                $("#logo_upload2").val('');
                ShowErrorMessage("Please Select Only Image File!");
            }
            else {
                var reader = new FileReader();
                reader.onload = function (e) {
                    $('#img_uploading2').attr('src', e.target.result);
                }
                reader.readAsDataURL(inputVal.files[0]);
            }
        };
        choice.error = function (result) {
            $("#dvLoading").hide();
            ShowErrorMessage("Error!!");
        };
        $.ajax(choice);
        event.preventDefault();
    }
}
function LogoUpload3(inputVal) {
    if ($("#logo_upload3").val() != "") {
        var uploadFile = $("#logo_upload3").get(0);
        var uploadedfile = uploadFile.files;
        var fromdata;
        if (typeof window.FormData == "undefined") {
            fromdata = [];
        }
        else {
            fromdata = new window.FormData();
        }
        for (var i = 0; i < uploadedfile.length; i++) {
            if (typeof window.FormData == "undefined") {
                fromdata.push(uploadedfile[i].name, uploadedfile[i]);
            }
            else {
                fromdata.append(uploadedfile[i].name, uploadedfile[i]);
            }
        }
        var choice = {};
        choice.url = "../Browser/FileFormat",
            choice.type = "POST";
        choice.data = fromdata;
        choice.contentType = false;
        choice.processData = false;
        choice.async = false;
        choice.success = function (response) {
            if (response == 0) {
                $("#logo_upload3").val('');
                ShowErrorMessage("Please Select Only Image File!");
            }
            else {
                var reader = new FileReader();
                reader.onload = function (e) {
                    $('#img_uploading3').attr('src', e.target.result);
                }
                reader.readAsDataURL(inputVal.files[0]);
            }
        };
        choice.error = function (result) {
            $("#dvLoading").hide();
            ShowErrorMessage("Error!!");
        };
        $.ajax(choice);
        //event.preventDefault();
    }
}
function LogoUpload4(inputVal) {
    if ($("#logo_upload4").val() != "") {
        var uploadFile = $("#logo_upload4").get(0);
        var uploadedfile = uploadFile.files;
        var fromdata;
        if (typeof window.FormData == "undefined") {
            fromdata = [];
        }
        else {
            fromdata = new window.FormData();
        }
        for (var i = 0; i < uploadedfile.length; i++) {
            if (typeof window.FormData == "undefined") {
                fromdata.push(uploadedfile[i].name, uploadedfile[i]);
            }
            else {
                fromdata.append(uploadedfile[i].name, uploadedfile[i]);
            }
        }
        var choice = {};
        choice.url = "../Browser/FileFormat",
            choice.type = "POST";
        choice.data = fromdata;
        choice.contentType = false;
        choice.processData = false;
        choice.async = false;
        choice.success = function (response) {
            if (response == 0) {
                $("#logo_upload4").val('');
                ShowErrorMessage("Please Select Only Image File!");
            }
            else {
                var reader = new FileReader();
                reader.onload = function (e) {
                    $('#img_uploading4').attr('src', e.target.result);
                    $("#imgbtn1").attr('src', e.target.result);
                    $("#imgbtn1").css('opacity', 1);
                    $("#span_btn1").css("left", "3px");
                }
                reader.readAsDataURL(inputVal.files[0]);
            }
        };
        choice.error = function (result) {
            $("#dvLoading").hide();
            ShowErrorMessage("Error!!");
        };
        $.ajax(choice);
        //event.preventDefault();
    }
}
function LogoUpload5(inputVal) {
    if ($("#logo_upload5").val() != "") {
        var uploadFile = $("#logo_upload5").get(0);
        var uploadedfile = uploadFile.files;
        var fromdata;
        if (typeof window.FormData == "undefined") {
            fromdata = [];
        }
        else {
            fromdata = new window.FormData();
        }
        for (var i = 0; i < uploadedfile.length; i++) {
            if (typeof window.FormData == "undefined") {
                fromdata.push(uploadedfile[i].name, uploadedfile[i]);
            }
            else {
                fromdata.append(uploadedfile[i].name, uploadedfile[i]);
            }
        }
        var choice = {};
        choice.url = "../Browser/FileFormat",
            choice.type = "POST";
        choice.data = fromdata;
        choice.contentType = false;
        choice.processData = false;
        choice.async = false;
        choice.success = function (response) {
            if (response == 0) {
                $("#logo_upload5").val('');
                ShowErrorMessage("Please Select Only Image File!");
            }
            else {
                var reader = new FileReader();
                reader.onload = function (e) {
                    $('#img_uploading5').attr('src', e.target.result);
                    $("#imgbtn2").attr('src', e.target.result);
                    $("#imgbtn2").css('opacity', 1);
                    $("#span_btn2").css("left", "3px");
                }
                reader.readAsDataURL(inputVal.files[0]);
            }
        };
        choice.error = function (result) {
            $("#dvLoading").hide();
            ShowErrorMessage("Error!!");
        };
        $.ajax(choice);
        //event.preventDefault();
    }
}
function LogoUpload6(inputVal) {
    if ($("#logo_upload6").val() != "") {
        var uploadFile = $("#logo_upload6").get(0);
        var uploadedfile = uploadFile.files;
        var fromdata;
        if (typeof window.FormData == "undefined") {
            fromdata = [];
        }
        else {
            fromdata = new window.FormData();
        }
        for (var i = 0; i < uploadedfile.length; i++) {
            if (typeof window.FormData == "undefined") {
                fromdata.push(uploadedfile[i].name, uploadedfile[i]);
            }
            else {
                fromdata.append(uploadedfile[i].name, uploadedfile[i]);
            }
        }
        var choice = {};
        choice.url = "../Browser/FileFormat",
            choice.type = "POST";
        choice.data = fromdata;
        choice.contentType = false;
        choice.processData = false;
        choice.async = false;
        choice.success = function (response) {
            if (response == 0) {
                $("#logo_upload6").val('');
                ShowErrorMessage("Please Select Only Image File!");
            }
            else {
                var reader = new FileReader();
                reader.onload = function (e) {
                    $('#img_uploading6').attr('src', e.target.result);
                }
                reader.readAsDataURL(inputVal.files[0]);
            }
        };
        choice.error = function (result) {
            $("#dvLoading").hide();
            ShowErrorMessage("Error!!");
        };
        $.ajax(choice);
        //event.preventDefault();
    }
}
var largeImage = 0;
function LogoUpload7(inputVal) {
    if ($("#logo_upload7").val() != "") {
        largeImage = 1;
        var uploadFile = $("#logo_upload7").get(0);
        var uploadedfile = uploadFile.files;
        var fromdata;
        if (typeof window.FormData == "undefined") {
            fromdata = [];
        }
        else {
            fromdata = new window.FormData();
        }
        for (var i = 0; i < uploadedfile.length; i++) {
            if (typeof window.FormData == "undefined") {
                fromdata.push(uploadedfile[i].name, uploadedfile[i]);
            }
            else {
                fromdata.append(uploadedfile[i].name, uploadedfile[i]);
            }
        }
        var choice = {};
        choice.url = "../Browser/FileFormat",
            choice.type = "POST";
        choice.data = fromdata;
        choice.contentType = false;
        choice.processData = false;
        choice.async = false;
        choice.success = function (response) {
            if (response == 0) {
                $("#logo_upload7").val('');
                ShowErrorMessage("Please Select Only Image File!");
            }
            else {
                $("#dv_LImg").show();
                var reader = new FileReader();
                reader.onload = function (e) {
                    $('#img_uploading7').attr('src', e.target.result);

                    setTimeout(function () { 
                    var bigImg = document.querySelector("#img_uploading7");
                    if (bigImg.naturalWidth != 720 || bigImg.naturalHeight != 360) {
                        ShowErrorMessage("Please use recommended image size (720px * 360px)");
                    }
                    }, 1000);
                }
                reader.readAsDataURL(inputVal.files[0]);
            }
        };
        choice.error = function (result) {
            $("#dvLoading").hide();
            ShowErrorMessage("Error!!");
        };
        $.ajax(choice);
        //event.preventDefault();
    }
}
//// Change
function ChangeText(id, value) {
    switch (id) {
        case "Ttl":
            document.getElementById('title_preview').innerHTML = (value == "" ? "&nbsp;" : value);
            break;
        case "Sub":
            document.getElementById('subtitle_preview').innerHTML = (value == "" ? "&nbsp;" : value);
            break;
        case "header":
            document.getElementById('spn_Header').innerHTML = (value == "" ? "&nbsp;" : value);
            break;
        case "content":
            document.getElementById('spn_Content').innerHTML = (value == "" ? "&nbsp;" : value);
            break;
        case "Allow":
            document.getElementById('ui_btnAllow').value = (value == "" ? "&nbsp;" : value);
            break;
        case "Disallow":
            document.getElementById('ui_btnDntAllow').value = (value == "" ? "&nbsp;" : value);
            break;
        case "WelMsg":
            document.getElementById('wlcm_Title').innerHTML = (value == "" ? "&nbsp;" : value);
            break;
        case "Welcontent":
            document.getElementById('wlcm_content').innerHTML = (value == "" ? "&nbsp;" : value);
            break;
        case "Btn1":
            $("#dv_btn1").show();
            document.getElementById('span_btn1').innerHTML = (value == "" ? "&nbsp;" : value);
            break;
        case "Btn2":
            $("#dv_btn2").show();
            document.getElementById('span_btn2').innerHTML = (value == "" ? "&nbsp;" : value);
            break;
    }
}
var BackgroundCSS = "", TitleCSS = "", SubTitleCSS = "", AllowCSS = "", DisAllowCSS = "", HeaderCSS = "", ContentCSS = "";
var bg = "#FAFAFA;", bgcolor = "#FAFAFA;", Ttlcolor = "#212121;", SubTtlcolor = "#212121;", bgAllow = "#FFFFFF;", colorAllow = "#000000;", bgDis = "#E8E8E8;",
    colorDis = "#000000;", font = "Source Sans Pro, sans-serif;", sizeTtl = "15;", sizeSub = "12;",
    FontH = "Source Sans Pro, sans-serif;", sizeH = "26;", sizeC = "17;", colorH = "#7c8081;", colorC = "#7c8081;", widthImg = "", heightImg = "",
    widthImg2 = "", heightImg2 = "";
//// CSS Settings
function CSSchange(type, val, id) {
    switch (id) {
        case "Background":
            $("#dv_preview").css("background-color", val);
            bg = type + val + ";";
            break;
        case "Border":
            $("#dv_withText").css("border", "1px solid " + val);
            bgcolor = type + "1px solid " + val + ";";
            break;
        case "widthImg":
            if ($("#drp_ticker").val() == "imagewithText") {
                $("#dv_img").css("width", val);
            }
            else if ($("#drp_ticker").val() == "image") {
                $("#img_uploading1").css("width", val);
            }
            widthImg = type + val + ";";
            break;
        case "heightImg":
            if ($("#drp_ticker").val() == "imagewithText") {
                $("#dv_img").css("height", val);
            }
            else if ($("#drp_ticker").val() == "image") {
                $("#img_uploading1").css("height", val);
            }
            heightImg = type + val + ";"
            break;
        case "colorTitle":
            $("#title_preview").css("color", val);
            Ttlcolor = type + val + ";";
            break;
        case "colorSubtitle":
            $("#subtitle_preview").css("color", val);
            SubTtlcolor = type + val + ";";
            break;
        case "backgroundAllow":
            $("#ui_btnAllow").css("background-color", val);
            bgAllow = type + val + ";";
            break;
        case "colorAllow":
            $("#ui_btnAllow").css("color", val);
            colorAllow = type + val + ";";
            break;
        case "backgroundDisallow":
            $("#ui_btnDntAllow").css("background-color", val);
            bgDis = type + val + ";";
            break;
        case "colorDisallow":
            $("#ui_btnDntAllow").css("color", val);
            colorDis = type + val + ";";
            break;
        case "widthImg2":
            $("#img_uploading2").css("width", val);
            widthImg2 = type + val + ";";
            break;
        case "heightImg2":
            $("#img_uploading2").css("height", val);
            heightImg2 = type + val + ";"
            break;
        case "colorHeader":
            $("#spn_Header").css("color", val);
            colorH = type + val + ";";
            break;
        case "colorContent":
            $("#spn_Content").css("color", val);
            colorC = type + val + ";";
            break;
        case "TitleFont":
            $("#title_preview").css("font-family", val);
            $("#subtitle_preview").css("font-family", val);
            $("#ui_btnAllow").css("font-family", val);
            $("#ui_btnDntAllow").css("font-family", val);
            font = type + val + ";";
            break;
        case "HeaderFont":
            $("#spn_Header").css("font-family", val);
            $("#spn_Content").css("font-family", val);
            FontH = type + val + ";";
            break;
        case "sizeTilte":
            if (25 > parseInt(val))
                $("#title_preview").css("font-size", parseInt(val));
            else {
                $("#ui_txtTtlFS").val();
                $("#title_preview").css("font-size", 25);
                ShowErrorMessage("Font size maximum value up to 25px!");
            }
            sizeTtl = type + val + ";";
            break;
        case "sizeSubtitle":
            if (25 > parseInt(val))
                $("#subtitle_preview").css("font-size", parseInt(val));
            else {
                $("#ui_txtSTtlFS").val();
                $("#subtitle_preview").css("font-size", 25);
                ShowErrorMessage("Font size maximum value up to 25px!");
            }
            sizeSub = type + val + ";";
            break;
        case "sizeHeader":
            if (30 > parseInt(val))
                $("#spn_Header").css("font-size", parseInt(val));
            else {
                $("#ui_txtHeaderFS").val();
                $("#spn_Header").css("font-size", 30);
                ShowErrorMessage("Font size maximum value up to 30px!");
            }
            sizeH = type + val + ";";
            break;
        case "sizeContent":
            if (30 > parseInt(val))
                $("#spn_Content").css("font-size", parseInt(val));
            else {
                $("#ui_txtContentFS").val();
                $("#spn_Content").css("font-size", 30);
                ShowErrorMessage("Font size maximum value up to 30px!");
            }
            sizeC = type + val + ";";
            break;

        case "customBackground":
            var exStyle = $("#dv_preview").attr("style");
            $("#dv_preview").attr("style", (exStyle == undefined ? "" : exStyle) + val);
            break;
        case "customImage":
            if ($("#drp_ticker").val() == "imagewithText") {
                var exStyle = $("#dv_img").attr("style");
                $("#dv_img").attr("style", (exStyle == undefined ? "" : exStyle) + val);
            }
            else if ($("#drp_ticker").val() == "image") {
                var exStyle = $("#img_uploading1").attr("style");
                $("#img_uploading1").attr("style", (exStyle == undefined ? "" : exStyle) + val);
            }
            break;
        case "customImage2":
            var exStyle = $("#img_uploading2").attr("style");
            $("#img_uploading2").attr("style", (exStyle == undefined ? "" : exStyle) + val);
            break;
        case "customTitle":
            var exStyle = $("#title_preview").attr("style");
            $("#title_preview").attr("style", (exStyle == undefined ? "" : exStyle) + val);
            break;
        case "customSubTitle":
            var exStyle = $("#subtitle_preview").attr("style");
            $("#subtitle_preview").attr("style", (exStyle == undefined ? "" : exStyle) + val);
            break;
        case "customAllow":
            var exStyle = $("#ui_btnAllow").attr("style");
            $("#ui_btnAllow").attr("style", (exStyle == undefined ? "" : exStyle) + val);
            break;
        case "customDisAllow":
            var exStyle = $("#ui_btnDntAllow").attr("style");
            $("#ui_btnDntAllow").attr("style", (exStyle == undefined ? "" : exStyle) + val);
            break;
        case "customHeader":
            var exStyle = $("#spn_Header").attr("style");
            $("#spn_Header").attr("style", (exStyle == undefined ? "" : exStyle) + val);
            break;
        case "customContent":
            var exStyle = $("#spn_Content").attr("style");
            $("#spn_Content").attr("style", (exStyle == undefined ? "" : exStyle) + val);
            break;
    }
}

var welcomeNotificationOrSendNotification;
//// Saving Image and Permission
function SaveNotificationPermission() {
    welcomeNotificationOrSendNotification = 0;
    $("#hdn_image1").val('');
    $("#hdn_image2").val('');
    $("#hdn_image3").val('');
    $("#hdn_image7").val('');
    if ($("#logo_upload1").val() != "") {
        var uploadFile = $("#logo_upload1").get(0);
        var uploadedfile = uploadFile.files;
        var fromdata;
        if (typeof window.FormData == "undefined")
            fromdata = [];
        else
            fromdata = new window.FormData();
        for (var i = 0; i < uploadedfile.length; i++) {
            if (typeof window.FormData == "undefined")
                fromdata.push(uploadedfile[i].name, uploadedfile[i]);
            else
                fromdata.append(uploadedfile[i].name, uploadedfile[i]);
        }
        var choice = {};
        choice.url = "../Browser/SaveImage",
            choice.type = "POST";
        choice.data = fromdata;
        choice.contentType = false;
        choice.processData = false;
        choice.async = false;
        choice.success = function (response) {
            if (response == 0)
                $("#logo_upload1").val('');
            else {
                $("#hdn_image1").val(response);
                if ($("#logo_upload2").val() != "") {
                    SaveImage2();
                }
                else
                    SaveData();
            }
        };
        choice.error = function (result) {
            $("#dvLoading").hide();
            ShowErrorMessage("Error!!");
        };
        $.ajax(choice);
        event.preventDefault();
    }
    else {
        //SaveData();
        SaveImage2();
    }
}
var saveOrSend = "";
///Save and Send Browser Notification
function SaveAndSendBrowserNotification(key) {
    $("#dvLoading").show();
    saveOrSend = key;
    welcomeNotificationOrSendNotification = 1;
    SaveImage3();
}
//Save Image - Browser Opt In
function SaveImage2() {
    if ($("#logo_upload2").val() != "") {
        var uploadFile = $("#logo_upload2").get(0);
        var uploadedfile = uploadFile.files;
        var fromdata;
        if (typeof window.FormData == "undefined")
            fromdata = [];
        else
            fromdata = new window.FormData();
        for (var i = 0; i < uploadedfile.length; i++) {
            if (typeof window.FormData == "undefined")
                fromdata.push(uploadedfile[i].name, uploadedfile[i]);
            else
                fromdata.append(uploadedfile[i].name, uploadedfile[i]);
        }
        var choice = {};
        choice.url = "../Browser/SaveImage",
            choice.type = "POST";
        choice.data = fromdata;
        choice.contentType = false;
        choice.processData = false;
        choice.async = false;
        choice.success = function (response) {
            if (response == 0)
                $("#logo_upload2").val('');
            else {
                $("#hdn_image2").val(response);
                if ($("#logo_upload3").val() != "") {
                    SaveImage3();
                }
                else
                    SaveData();
            }
        };
        choice.error = function (result) {
            $("#dvLoading").hide();
            ShowErrorMessage("Error!!");
        };
        $.ajax(choice);
        event.preventDefault();
    }
    else {
        //SaveData();
        SaveImage3();
    }
}
//Save Image - Welcome Message/Send Notification
function SaveImage3() {
    if ($("#logo_upload3").val() != "") {
        var uploadFile = $("#logo_upload3").get(0);
        var uploadedfile = uploadFile.files;
        var fromdata;
        if (typeof window.FormData == "undefined") {
            fromdata = [];
        }
        else {
            fromdata = new window.FormData();
        }
        for (var i = 0; i < uploadedfile.length; i++) {
            if (typeof window.FormData == "undefined") {
                fromdata.push(uploadedfile[i].name, uploadedfile[i]);
            }
            else {
                fromdata.append(uploadedfile[i].name, uploadedfile[i]);
            }
        }
        var choice = {};
        choice.url = "../Browser/SaveImage",
            choice.type = "POST";
        choice.data = fromdata;
        choice.contentType = false;
        choice.processData = false;
        choice.async = false;
        choice.success = function (response) {
            if (response == 0) {
                $("#logo_upload3").val('');
            }
            else {
                $("#hdn_image3").val(response);
                welcomeNotificationOrSendNotification == 0 ? SaveData() : SaveSendPushnotification();
            }
        };
        choice.error = function (result) {
            $("#dvLoading").hide();
            ShowErrorMessage("Error!!");
        };
        $.ajax(choice);
        //event.preventDefault();
    }
    else {
        //SaveData();
        welcomeNotificationOrSendNotification == 0 ? SaveData() : SaveSendPushnotification();
    }
}
function SaveLargerImage() {
    if ($("#logo_upload7").val() != "") {
        var uploadFile = $("#logo_upload7").get(0);
        var uploadedfile = uploadFile.files;
        var fromdata;
        if (typeof window.FormData == "undefined") {
            fromdata = [];
        }
        else {
            fromdata = new window.FormData();
        }
        for (var i = 0; i < uploadedfile.length; i++) {
            if (typeof window.FormData == "undefined") {
                fromdata.push(uploadedfile[i].name, uploadedfile[i]);
            }
            else {
                fromdata.append(uploadedfile[i].name, uploadedfile[i]);
            }
        }
        var choice = {};
        choice.url = "../Browser/SaveImage",
            choice.type = "POST";
        choice.data = fromdata;
        choice.contentType = false;
        choice.processData = false;
        choice.async = false;
        choice.success = function (response) {
            if (response == 0) {
                $("#logo_upload7").val('');
            }
            else {
                $("#hdn_image7").val(response);
            }
        };
        choice.error = function (result) {
            $("#dvLoading").hide();
            ShowErrorMessage("Error!!");
        };
        $.ajax(choice);
    }
}
function SaveExtraButtonImages(id) {
    if ($("#logo_upload" + id).val() != "") {
        var uploadFile = $("#logo_upload" + id).get(0);
        var uploadedfile = uploadFile.files;
        var fromdata;
        if (typeof window.FormData == "undefined") {
            fromdata = [];
        }
        else {
            fromdata = new window.FormData();
        }
        for (var i = 0; i < uploadedfile.length; i++) {
            if (typeof window.FormData == "undefined") {
                fromdata.push(uploadedfile[i].name, uploadedfile[i]);
            }
            else {
                fromdata.append(uploadedfile[i].name, uploadedfile[i]);
            }
        }
        var choice = {};
        choice.url = "../Browser/SaveImage",
            choice.type = "POST";
        choice.data = fromdata;
        choice.contentType = false;
        choice.processData = false;
        choice.async = false;
        choice.success = function (response) {
            if (response == 0) {
                $("#logo_upload" + id).val('');
            }
            else {
                $("#hdn_image" + id).val(response);
            }
        };
        choice.error = function (result) {
            $("#dvLoading").hide();
            ShowErrorMessage("Error!!");
        };
        $.ajax(choice);
    }
}
var hdnCount = 0
//// Saving Data
function SaveData() {
    $("#dvLoading").hide();
    var val123 = 0, ExtnlVal = 0;
    if (document.getElementById('dv_AddAction0').style.display != "none") {
        hdnCount = 1;
    }
    if (document.getElementById('dv_AddAction01').style.display != "none") {
        hdnCount = 2;
    }
    if (hdnCount != 0) {
        for (var m = 0; m < hdnCount; m++) {
            var b = m === 0 ? "" : m;
            if ($("#ui_txtActionName0" + b).val() == "") {
                val123 = 1;
            }
            else if ($("#ui_ddlAction0" + b).val() != 0) {
                if ($("#ui_ddlAction0" + b).val() == "1") {
                    if ($("#ui_txtClickRedirect0" + b).val() == "") {
                        val123 = 1;
                    }
                    else if ($("#ui_txtClickRedirect0" + b).val().indexOf("http") == -1) {
                        ExtnlVal = 1
                    }
                    else if (urlregex.test($("#ui_txtClickRedirect0" + b).val()) == false) {
                        ShowErrorMessage("Please enter the valid URL!");
                        return false;
                    }
                }
            }
            if ($("#ui_radIconYes0" + b).is(':checked')) {
                SaveExtraButtonImages(b + 4);
            }
        }
    }
    if ($("#chk_Poweredby").is(':checked'))
        PoweredByStatus = 1;
    if ($("#ui_txtTitle").val() == "") {
        ShowErrorMessage("Please provide the Title!");
    }
    else if ($("#ui_txtSub").val() == "") {
        ShowErrorMessage("Please provide the SubTitle!");
    }
    else if ($("#ui_txtAllow").val() == "") {
        ShowErrorMessage("Please provide the Allow button text!");
    }
    else if ($("#ui_txtDisallow").val() == "") {
        ShowErrorMessage("Please provide the Disallow button text!");
    }
    else if ($("#ui_drpFntFmy").val() == "customFont" && $("#ui_txtcustomFont").val() == "") {
        ShowErrorMessage("Please provide the Font Family!");
    }
    else if ($("#ui_txtHeader").val() == "") {
        ShowErrorMessage("Please provide the Header!");
    }
    else if ($("#ui_txtContent").val() == "") {
        ShowErrorMessage("Please provide the Content!");
    }
    else if ($("#ui_drpFntFmy2").val() == "customFont2" && $("#ui_txtcustomFont2").val() == "") {
        ShowErrorMessage("Please provide the Header Font Family!");
    }
    else if ($("#ui_txtNotificationName").val() == "" && wlMsgStatus == 1)
        ShowErrorMessage("Please provide the Notification name!");
    else if ($("#ui_txtwlMsg").val() == "" && wlMsgStatus == 1) {
        ShowErrorMessage("Please provide the Welcome Message!");
    }
    else if ($("#ui_txtwlcContent").val() == "" && wlMsgStatus == 1) {
        ShowErrorMessage("Please provide the Content Text!");
    }
    else if ($("#ui_txtwlcLink").val() == "" && wlMsgStatus == 1) {
        ShowErrorMessage("Please provide the Redirection link!");
    }
    else if ($("#ui_txtwlcLink").val().indexOf("http") == -1 && wlMsgStatus == 1) {
        ShowErrorMessage("Please provide the valid 'http/https' Url!");
    }
    else if (urlregex.test($("#ui_txtwlcLink").val()) == false && wlMsgStatus == 1) {
        ShowErrorMessage("Please enter the valid URL!");
    }
    else if (val123 == 1) {
        for (var m6 = 0; m6 < hdnCount; m6++) {
            var b6 = m6 === 0 ? "" : m6;
            if ($("#ui_txtActionName0" + b6).val() == "") {
                ShowErrorMessage("Please enter the Button Name!");
                return false;
            }
            else if ($("#ui_ddlAction0" + b6).val() != 0) {
                if ($("#ui_ddlAction0" + b6).val() == "1") {
                    if ($("#ui_txtClickRedirect0" + b6).val() == "") {
                        ShowErrorMessage("Please enter the Redirect URL!");
                        return false;
                    }
                }
            }
        }
    }
    else if (ExtnlVal == 1) {
        ShowErrorMessage("Please provide the valid 'http/https' Url!");
        return false;
    }
    else {
        $("#dvLoading").show();
        var imageUpld1 = "", imageUpld2 = "", imageUpld3 = "", extra = "", cus = 0;
        if ($("#hdn_image1").val() == "") {
            if ($("#drp_ticker").val() == "image") {
                imageUpld1 = window.img_uploading1.src;
            }
            else {
                imageUpld1 = window.img_uploading.src;
            }
        }
        else {
            imageUpld1 = $("#hdn_image1").val();
        }
        if ($("#hdn_image2").val() == "") {
            imageUpld2 = window.img_uploading2.src;
        }
        else {
            imageUpld2 = $("#hdn_image2").val();
        }
        if ($("#hdn_image3").val() == "") {
            imageUpld3 = window.img_uploading3.src;
        }
        else {
            imageUpld3 = $("#hdn_image3").val();
        }
        if ($("#drp_ticker").val() == "image") {
            extra = $("#drp_positionWithImg").val() == "custom" ? $("#ui_txtcustom").val() : $("#drp_positionWithImg").val();
            cus = $("#drp_positionWithImg").val() == "custom" ? 1 : 0;
        }
        else {
            extra = $("#drp_positionWithTxt").val() == "custom" ? $("#ui_txtcustom").val() : $("#drp_positionWithTxt").val();
            cus = $("#drp_positionWithTxt").val() == "custom" ? 1 : 0
        }
  
       //var vapidvalue=$("#ui_rad3").val();
        var inputs1 = {
            Action: 'InsertReq1', ImageUrl: imageUpld1, Ticker: $("#drp_ticker").val(), Title: $("#ui_txtTitle").val().trim().replace('“', '"').replace('”', '"'),
            Message: $("#ui_txtSub").val().trim(), ExtraActions: extra, DisplayDuration: $("#ui_txtdisplayTime").val(), Duration: $("#ui_txthideTime").val(),
            PoweredBy: PoweredByStatus, WelcomeMsg: OptIn, Custom: cus, ButtonText: $("#ui_txtAllow").val() + "," + $("#ui_txtDisallow").val(),

            BackgroundCss: $("#ui_radBackgroundDefault").is(":checked") ? font + bg + bgcolor : $("#ui_txtcustomBackground").val(),
            IsBackgroundCustomCss: $("#ui_radBackgroundDefault").is(":checked") ? 0 : 1,
            ImageCss: $("#ui_radImageDefault").is(":checked") ? widthImg + heightImg : $("#ui_txtcustomImage").val(),
            IsImageCustomCss: $("#ui_radImageDefault").is(":checked") ? 0 : 1,
            TitleCss: $("#ui_radTtlDefault").is(":checked") ? font + Ttlcolor + sizeTtl : $("#ui_txtcustomTitle").val(),
            IsTitleCustomCss: $("#ui_radTtlDefault").is(":checked") ? 0 : 1,
            SubTitleCss: $("#ui_radSubTtlDefault").is(":checked") ? font + SubTtlcolor + sizeSub : $("#ui_txtcustomSubTitle").val(),
            IsSubTitleCustomCss: $("#ui_radSubTtlDefault").is(":checked") ? 0 : 1,
            AllowCss: $("#ui_radAllowDefault").is(":checked") ? font + bgAllow + colorAllow : $("#ui_txtcustomAllow").val(),
            IsAllowCustomCss: $("#ui_radAllowDefault").is(":checked") ? 0 : 1,
            DisAllowCss: $("#ui_radDisAllowDefault").is(":checked") ? font + bgDis + colorDis : $("#ui_txtcustomDisAllow").val(),
            IsDisAllowCustomCss: $("#ui_radDisAllowDefault").is(":checked") ? 0 : 1,

            Browser: $('input:radio[name=rad_Browser]:checked').val(), ShowWelcomeMsg: $('input:radio[name=rad_showNbox]:checked').val(),
            ShowPages: $('input:radio[name=rad_showNbox]:checked').val() == 2 ? $("#ui_txtShowPages").val() : "",
            DontShowPages: $("#ui_chkPages").is(":checked") ? $("#ui_txtDntShowPages").val() : ""
        };
        var inputs2 = {
            Action: 'InsertReq2', ImageUrl: imageUpld2, Title: $("#ui_txtHeader").val().trim(), Message: $("#ui_txtContent").val().trim(), WelcomeMsg: 2,
            Ticker: $("#ui_YesRNoImage").is(":checked") ? "Image" : "NoImage",

            InterPageImageCss: $("#ui_radImage2Default").is(":checked") ? widthImg2 + heightImg2 : $("#ui_txtcustomImage2").val(),
            IsInterPageImageCustomCss: $("#ui_radImage2Default").is(":checked") ? 0 : 1,
            HeaderCss: $("#ui_radHeaderDefault").is(":checked") ? FontH + sizeH + colorH : $("#ui_txtcustomHeader").val(),
            IsHeaderCustomCss: $("#ui_radHeaderDefault").is(":checked") ? 0 : 1,
            ContentCss: $("#ui_radContentDefault").is(":checked") ? FontH + sizeC + colorC : $("#ui_txtcustomContent").val(),
            IsContentCustomCss: $("#ui_radContentDefault").is(":checked") ? 0 : 1
        };
        //// Extra Buttons
        var extraBtn = "";
        for (var m9 = 0; m9 < hdnCount; m9++) {
            var b9 = m9 === 0 ? "" : m9;
            extraBtn += $("#ui_txtActionName0" + b9).val();

            if ($("#ui_ddlAction0" + b9).val() == "1")
                extraBtn += "^" + $("#ui_txtClickRedirect0" + b9).val();
            else if ($("#ui_ddlAction0" + b4).val() == "2")
                extraBtn += "^" + "Event"
            else
                extraBtn += "^" + "Close"
            extraBtn += "~" + $("input[name=Hide0" + b9 + "]:checked").val();
            if ($("#ui_radIconYes0" + b9).is(':checked')) {
                if ($("#hdn_image" + (b9 + 4)).val() == "") {
                    if (b9 == 0 || b9 == "")
                        extraBtn += "^" + window.img_uploading4.src;
                    else if (b9 == 1)
                        extraBtn += "^" + window.img_uploading5.src;
                    else if (b9 == 2)
                        extraBtn += "^" + window.img_uploading6.src;
                }
                else {
                    extraBtn += "^" + cdnpath + 'WebNotificationUploads/' + $("#hdn_image" + (b9 + 4)).val();
                }
            }
            else {
                extraBtn2 += "^" + '';
            }
            extraBtn += ",";
        }
        extraBtn = extraBtn.slice(0, -1);
        var inputs3 = {
            Action: 'InsertReq3', ImageUrl: imageUpld3, Title: $("#ui_txtwlMsg").val().trim(), Message: $("#ui_txtwlcContent").val().trim(),
            RedirectTo: $("#ui_txtwlcLink").val(), WelcomeMsg: 3, ExtraActions: extraBtn, WelMsgStatus: wlMsgStatus
        };

        $.ajax({
            url: "../Browser/SaveNPermissionData",
            type: "Post",
            data: JSON.stringify({ 'data1': inputs1, 'data2': inputs2, 'data3': inputs3 }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (parseInt(response) > 0) {
                    ShowErrorMessage("Successfully created the Notification");
                }
                else if (parseInt(response) === -3) {
                    ShowErrorMessage("Successfully updated the Notification");
                }
                else if (parseInt(response) === -2)
                    ShowErrorMessage("Notification name is already exists");
                $("#dvLoading").hide();
                SettingUpStaticDictionary();
            },
            error: function (objxmlRequest) {
                window.console.log(objxmlRequest.responseText);
            }
        });
    }
}
var hdnCount2 = 0
//Save Button Click - Save Send Notification
function SaveSendPushnotification() {
    SaveLargerImage();
    $("#dvLoading").hide();
    var valA123 = 0, ExtnlVal2 = 0;
    if (document.getElementById('dv_AddAction0').style.display != "none") {
        hdnCount2 = 1;
    }
    if (document.getElementById('dv_AddAction01').style.display != "none") {
        hdnCount2 = 2;
    }
    if (hdnCount2 != 0) {
        for (var m2 = 0; m2 < hdnCount2; m2++) {
            var b2 = m2 === 0 ? "" : m2;
            if ($("#ui_txtActionName0" + b2).val() == "") {
                valA123 = 1;
            }
            else if ($("#ui_ddlAction0" + b2).val() != 0) {
                if ($("#ui_ddlAction0" + b2).val() == "1") {
                    if ($("#ui_txtClickRedirect0" + b2).val() == "") {
                        valA123 = 1;
                    }
                    else if ($("#ui_txtClickRedirect0" + b2).val().indexOf("http") == -1) {
                        ExtnlVal2 = 1;
                    }
                    else if (urlregex.test($("#ui_txtClickRedirect0" + b2).val()) == false) {
                        ShowErrorMessage("Please enter the valid URL!");
                        return false;
                    }
                }
            }
            if ($("#ui_radIconYes0" + b2).is(':checked')) {
                SaveExtraButtonImages(b2 + 4);
            }
        }
    }
    if ($("#ui_txtNotificationName").val() == "")
        ShowErrorMessage("Please provide the Notification name!");
    else if ($("#ui_txtwlMsg").val() == "" && $("#dv_SimplePush:visible").length == 1)
        ShowErrorMessage("Please provide the Welcome message!");
    else if ($("#ui_txtwlcContent").val() == "" && $("#dv_SimplePush:visible").length == 1)
        ShowErrorMessage("Please provide the Content text!");
    /////////////////////////////////////////////////////////////////////////////// Redirection link
    else if ($("#ui_txtwlcLink").val() == "" && $("#dv_SimplePush:visible").length == 1)
        ShowErrorMessage("Please provide the Redirection link!");
    else if ($("#ui_txtwlcLink").val().indexOf("http") == -1 && $("#dv_SimplePush:visible").length == 1)
        ShowErrorMessage("Please provide the valid 'http/https' Url!");
    else if (urlregex.test($("#ui_txtwlcLink").val()) == false && $("#dv_SimplePush:visible").length == 1) {
        ShowErrorMessage("Please enter the valid URL!");
        return false;
    }
    /////////////////////////////////////////////////////////////////////////////// RSS feel
    else if ($("#ui_txtRssUrl").val() == "" && $("#dv_RSS:visible").length == 1)
        ShowErrorMessage("Please provide the RSS feel Url!");
    else if ($("#ui_txtRssUrl").val().indexOf("http") == -1 && $("#dv_RSS:visible").length == 1)
        ShowErrorMessage("Please provide the valid 'http/https' Url!");
    else if ((urlregex.test($("#ui_txtRssUrl").val())) == false && $("#dv_RSS:visible").length == 1) {
        ShowErrorMessage("Please enter the valid URL!");
        return false;
    }
    ///////////////////////////////////////////////////////////////////////////////
    else if ($("#chk_hideBox").is(':checked') && $("#ui_txthideNotif").val() < 1) {
        ShowErrorMessage("Please provide the visible duration more than 0 seconds!");
    }
    else if (($("#chk_hideImg").is(':checked')) && largeImage == 0) {
        ShowErrorMessage("Please upload the image!");
        return false;
    }
     else if (!$("#ui_chkSegment").is(':checked') && saveOrSend != 'Save') {
            ShowErrorMessage("Please select Group");
            return false;
        }
    else if (valA123 == 1) {
        for (var m3 = 0; m3 < hdnCount2; m3++) {
            var b3 = m3 === 0 ? "" : m3;
            if ($("#ui_txtActionName0" + b3).val() == "") {
                ShowErrorMessage("Please enter the Button Name!");
                return false;
            }
            else if ($("#ui_ddlAction0" + b3).val() != 0) {
                if ($("#ui_ddlAction0" + b3).val() == "1") {
                    if ($("#ui_txtClickRedirect0" + b3).val() == "") {
                        ShowErrorMessage("Please enter the Redirect URL!");
                        return false;
                    }
                }
            }
        }
    }
    else if (ExtnlVal2 == 1) {
        ShowErrorMessage("Please provide the valid 'http/https' Url!");
        return false;
    }
    else if (!ValidationOfRules()) {
        $("#dvLoading").hide();
        return false;
    }
    else {
        $("#dvLoading").show();
        //// Extra Buttons
        var extraBtn2 = "";
        for (var m4 = 0; m4 < hdnCount2; m4++) {
            var b4 = m4 === 0 ? "" : m4;
            extraBtn2 += $("#ui_txtActionName0" + b4).val();

            if ($("#ui_ddlAction0" + b4).val() == "1")
                extraBtn2 += "^" + $("#ui_txtClickRedirect0" + b4).val();
            else if ($("#ui_ddlAction0" + b4).val() == "2")
                extraBtn2 += "^" + "Event"
            else
                extraBtn2 += "^" + "Close"

            extraBtn2 += "~" + $("input[name=Hide0" + b4 + "]:checked").val();
            if ($("#ui_radIconYes0" + b4).is(':checked')) {
                if ($("#hdn_image" + (b4 + 4)).val() == "") {
                    if (b4 == 0 || b4 == "")
                        extraBtn2 += "^" + window.img_uploading4.src;
                    else if (b4 == 1)
                        extraBtn2 += "^" + window.img_uploading5.src;
                    else if (b4 == 2)
                        extraBtn2 += "^" + window.img_uploading6.src;
                }
                else {
                    extraBtn2 += "^" + cdnpath + 'WebNotificationUploads/' + $("#hdn_image" + (b4 + 4)).val();
                }
            }
            else {
                extraBtn2 += "^" + '';
            }
            extraBtn2 += ",";
        }
        extraBtn2 = extraBtn2.slice(0, -1);
        var imageUpld3, dur = 0, imageUpld7;
        if ($("#hdn_image3").val() == "")
            imageUpld3 = window.img_uploading3.src;
        else
            imageUpld3 = $("#hdn_image3").val();
        //if ($("#div_Rule_Content input[type='checkbox']:checked").length < 1)
        //    ShowErrorMessage("Please select Group");
        //$("#dvLoading").hide();
        //return false;
        if ($("#div_Rule_Content input[type='checkbox']:checked").length >= 1)
            ruleStatus = 1;
        if ($("#chk_hideBox").is(':checked'))
            dur = $("#ui_txthideNotif").val();
        else dur = 0;

        if ($("#chk_hideImg").is(':checked')) {
            if ($("#hdn_image7").val() == "")
                imageUpld7 = window.img_uploading7.src;
            else
                imageUpld7 = $("#hdn_image7").val();
        }
        else
            imageUpld7 = "";
        var inputs3 = {
            Action: "InsertReq3", ImageUrl: imageUpld3, Title: ($("#dv_SimplePush:visible").length == 1 ? $("#ui_txtwlMsg").val().trim() : "RSS Feed"),
            Message: ($("#dv_SimplePush:visible").length == 1 ? $("#ui_txtwlcContent").val().trim() : ""),
            Image: imageUpld7, RedirectTo: $("#ui_txtwlcLink").val(), WelcomeMsg: 0, NotificationName: $("#ui_txtNotificationName").val(), RedirectTo: $("#ui_txtwlcLink").val(),
            Duration: dur, RuleStatus: ruleStatus, BrowserPushId: pushId, SaveOrSend: saveOrSend, ExtraActions: extraBtn2,
            IsRssFeed: rss, RssFeelUrl: $("#ui_txtRssUrl").val()
        };
        $.ajax({
            url: "../Browser/SaveNPermissionData",
            type: "Post",
            data: JSON.stringify({ 'data3': inputs3 }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (parseInt(response) > 0 && saveOrSend === "SaveAndSend") {
                    ShowErrorMessage("Successfully created the Notification and started sending Notifications");
                    SaveBrowserRules((pushId == 0 ? response : pushId), 'createSend');
                }
                else if (parseInt(response) > 0) {
                    SaveBrowserRules(response, '');
                    ShowErrorMessage("Successfully created the Notification");
                    $("#dvLoading").hide();
                }
                else if (parseInt(response) === -3 && saveOrSend === "SaveAndSend") {
                    SaveBrowserRules(pushId, 'Send');
                }
                else if (parseInt(response) === -1) {
                    ShowErrorMessage("Notification Name already exists!");
                    $("#dvLoading").hide();
                }
                else if (parseInt(response) === -2) {
                    ShowErrorMessage("RSS feed Url already exists!");
                    $("#dvLoading").hide();
                }
                else if (parseInt(response) === -3) {
                    SaveBrowserRules(pushId, '');
                    ShowErrorMessage("Successfully updated the Notification");
                    $("#dvLoading").hide();
                }
                else if (parseInt(response) === -4) {
                    ShowErrorMessage("Push notification is disabled");
                    $("#dvLoading").hide();
                }
                else {
                    ShowErrorMessage("Something went wrong!");
                    $("#dvLoading").hide();
                }
            },
            error: function (objxmlRequest) {
                window.console.log(objxmlRequest.responseText);
                $("#dvLoading").hide();
            }
        });
    }
}
//Save Browser Rules
function SaveBrowserRules(id, val) {
    $("#dvLoading").show();
    RulesData(id);
    $.ajax({
        url: "../Browser/SaveBrowserRules",
        type: "Post",
        data: JSON.stringify({ 'ruleConditions': ruleConditions, 'browserCampaignId': id, 'saveOrSend': saveOrSend }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (parseInt(response) >= 0) {
                if (val == "Send")
                    ShowErrorMessage("Successfully notification has been sent, Number of notification sent is " + response);
                else if (val == 'createSend')
                    ShowErrorMessage("Successfully notification has been sent, Number of notification sent is " + response);
            }
            $("#dvLoading").hide();
        }
    });
}
//Bind Send Notification Settings
function BindNotification() {
    $.ajax({
        url: "../Browser/BindSendNotification",
        type: "Post",
        data: "{'pushId':'" + pushId + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response.Table.length > 0) {
                $.each(response.Table, function () {
                    changeradRSS(this.IsRssFeed);
                    $("#ui_txtNotificationName").val(this.CampaignName);
                    $("#ui_txtwlMsg").val(this.Title);
                    $("#ui_txtwlcContent").val(this.Message);
                    $("#ui_txtwlcLink").val(this.RedirectTo);

                    $("#ui_txtRssUrl").val(this.RSSFeedURL);

                    if (this.IsRssFeed == 1) {
                        $("#wlcm_Title").html(this.Title == "" ? "First 96 chars of your post title" : (this.Title.length > 90 ? this.Title.substring(0, 90) : this.Title));
                        $("#wlcm_content").html(this.Message == "" || this.Message== null ? "First 255 chars of your post message" : (this.Message.length > 255 ? this.Message.substring(0, 250) + ".." : this.Message));
                        ttl = (this.Title == "" ? "First 96 chars of your post title" : this.Title);
                        msg = (this.Message == "" ? "First 255 chars of your post message" : this.Message);
                    } else {
                        $("#wlcm_Title").html(this.Title == "" ? "&nbsp;" : this.Title);
                        $("#wlcm_content").html(this.Message == "" ? "&nbsp;" : this.Message);
                    }

                    $("#img_uploading3").attr("src", this.ImageUrl == "" ? "void(0)" : (this.ImageUrl.indexOf("http") > -1 || this.ImageUrl.indexOf("//www.") > -1 ||
                        (this.ImageUrl.indexOf("//") > -1 && this.ImageUrl.indexOf("/images") > -1) || this.ImageUrl.indexOf("www.") > -1) ?
                        this.ImageUrl : (cdnpath + "/WebNotificationUploads/" + this.ImageUrl));

                    if (this.Duration > 0) {
                        $("#chk_hideBox").attr("checked", true);
                        $("#di_hideNotif").show();
                        $("#ui_txthideNotif").val(this.Duration);
                    } else {
                        $("#chk_hideBox").attr("checked", false);
                        $("#di_hideNotif").hide();
                        $("#ui_txthideNotif").val(30);
                    }
                    if (this.Image == null || this.Image == '') {
                        $("#dv_LImg").hide();
                        $("#img_uploading7").attr("src", '');
                        $("#chk_hideImg").attr("checked", false);
                        $("#dv_AddLImg").hide();
                        $("#span_Img").hide();
                    }
                    else {
                        $("#dv_LImg").show();
                        $("#img_uploading7").attr("src", this.Image);
                        $("#dv_AddLImg").show();
                        $("#span_Img").show();
                        $("#chk_hideImg").attr("checked", true);
                        largeImage = 1;
                    }
                    if (this.ExtraActions != "" && this.ExtraActions != null && this.ExtraActions != 0) {
                        var ExtraBtns = this.ExtraActions.toString().split(",");
                        for (var n2 = 0; n2 < ExtraBtns.length; n2++) {
                            var ExtraSeparate = ExtraBtns[n2].split("^");
                            var a = n2 === 0 ? "" : n2;
                            $("#ui_txtActionName0" + a).val(ExtraSeparate[0]);
                            $("#dv_btn" + (a + 1)).show();
                            $("#imgbtn" + (a + 1)).attr('src', '');
                            $("#span_btn" + (a + 1)).html(ExtraSeparate[0]);
                            var hid = ExtraSeparate[1].split('~');
                            if (hid[0] == "Close")
                                $("#ui_ddlAction0" + a).val(0);
                            else if (hid[0] == "Event")
                                $("#ui_ddlAction0" + a).val(2);
                            else
                                $("#ui_ddlAction0" + a).val(1);
                            $("input[name=Hide0" + a + "][value=" + hid[1] + "]").prop('checked', 'checked');
                            if (ExtraSeparate[2] != '') {
                                $("input[name^=Icon0" + a + "][value='1']").attr("checked", true);
                                $("#dv_extImg0" + a).show();
                                $("#img_uploading" + (a + 4)).attr("src", ExtraSeparate[2]);
                                $("#imgbtn" + (a + 1)).attr('src', ExtraSeparate[2]);
                                $("#imgbtn" + (a + 1)).css('opacity', 1);
                                $("#span_btn" + (a + 1)).css("left", "3px");
                            }
                            else {
                                $("input[name=Icon0" + a + "][value=0]").prop('checked', 'checked');
                                $("#dv_extImg0" + a).hide();
                                $("#imgbtn" + (a + 1)).css('opacity', 0);
                                $("#span_btn" + (a + 1)).css("left", "-20px");
                            }
                            $("#dv_AddAction0" + a).show();
                            if (a == 1) {
                                $("#btnAction").hide();
                            }
                            if (hid[0] != "Close" && hid[0] != "Event") {
                                $("#dv_1" + a).show();
                                $("#ui_txtClickRedirect0" + a).val(hid[0]);
                            }
                        }
                    }
                    if (this.RuleStatus == 1)
                        BindBrowserRules(response.Table1[0]);
                    return;
                });
            }
        },
        error: function (objxmlRequest) {
            window.console.log(objxmlRequest.responseText);
        }
    });
}
//Bind Bowser Rules
function BindBrowserRules(data) {
    $("#div_Rule_Content").show();
    ruleConditions = data;
    BindAudienceData();
    BindBehaviorData();
    BindInteractionData();
    BindInteractionEventData();
    BindProfileData();
}
//Bind "Notification Settings"
function BindNotificationSettings() {
    $.ajax({
        url: "../Browser/BindNotificationSettings",
        type: "Post",
        data: "{'pushId':'" + pushId + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response.Table.length > 0) {
                $("#dvSetting").show();
                $("#dv_NotifStatus").hide();
                if (response.Table[0].PoweredByStatus == 1 || response.Table[0].PoweredByStatus == null) {
                    $('#lnkPoweredby').show();
                    $('#SpnPoweredby').show();
                    //$('#ui_btnAllow').css('margin-left', '18%')
                    $('#chk_Poweredby').prop("checked", true);
                }
                else {
                    //$('#ui_btnAllow').css('margin-left', '45%')
                    $('#lnkPoweredby').hide();
                    $('#SpnPoweredby').hide();
                    $('#chk_Poweredby').prop("checked", false);
                }
                $.each(response.Table, function () {
                    ShowHideDiv(this.WelcomeMsg, this.PushId);
                    switch (this.WelcomeMsg) {
                        case 1:
                        case 4:
                            changerad(this.WelcomeMsg, 'onload');
                            var ticker = this.Ticker == "" ? "imagewithText" : this.Ticker;
                            $("#drp_ticker").val(this.Ticker == "" ? "imagewithText" : this.Ticker);
                            $("#ui_txtdisplayTime").val(this.DisplayDuration == "" ? "0" : this.DisplayDuration);
                            $("#ui_txthideTime").val(this.Duration == "" ? "0" : this.Duration);

                            //if (ticker == "image") {
                            TitleSub(ticker);
                            $("#img_uploading1").attr("src",
                                this.ImageUrl == "" ? "void(0)" : (this.ImageUrl.indexOf("http") > -1 || this.ImageUrl.indexOf("//www.") > -1 ||
                                    (this.ImageUrl.indexOf("//") > -1 && this.ImageUrl.indexOf("/images") > -1)
                                    || this.ImageUrl.indexOf("www.") > -1) ? this.ImageUrl : (cdnpath + "/WebNotificationUploads/" + this.ImageUrl));
                            if (this.Custom == 1) {
                                $("#drp_positionWithImg").val("custom");
                                $("#ui_txtcustom").val(this.ExtraActions);
                                $("#ui_txtcustom").show();
                            } else {
                                $("#drp_positionWithImg").val(this.ExtraActions);
                            }
                            //} else {
                            if (ticker == "text") {
                                $("#dv_Images").hide();
                                $("#dv_img").hide();
                            }
                            else {
                                $("#img_uploading").attr("src", this.ImageUrl == "" ? "void(0)" : (this.ImageUrl.indexOf("http") > -1 || this.ImageUrl.indexOf("//www.") > -1 ||
                                    (this.ImageUrl.indexOf("//") > -1 && this.ImageUrl.indexOf("/images") > -1)
                                    || this.ImageUrl.indexOf("www.") > -1) ? this.ImageUrl : (cdnpath + "/WebNotificationUploads/" + this.ImageUrl));
                                $("#dv_Images").show();
                                $("#dv_img").show();
                            }
                            if (this.Custom == 1) {
                                $("#drp_positionWithTxt").val("custom");
                                $("#ui_txtcustom").val(this.ExtraActions);
                                $("#ui_txtcustom").show();
                            } else {
                                $("#drp_positionWithTxt").val(this.ExtraActions);
                            }
                            $("#title_preview").html(this.Title == "" ? "&nbsp;" : this.Title);
                            $("#ui_txtTitle").val(this.Title == "" ? "&nbsp;" : this.Title);
                            $("#subtitle_preview").html(this.Message == "" ? "&nbsp;" : this.Message);
                            $("#ui_txtSub").val(this.Message == "" ? "&nbsp;" : this.Message);
                            if (this.ButtonText != null && this.ButtonText != "") {
                                var btnTxt = this.ButtonText.split(",");
                                $("#ui_txtAllow").val(btnTxt[0]);
                                $("#ui_txtDisallow").val(btnTxt[1]);
                                $("#ui_btnAllow").val(btnTxt[0]);
                                $("#ui_btnDntAllow").val(btnTxt[1]);
                            }
                            ////Background
                            if (this.IsBackgroundCustomCss == 0) {
                                $("#ui_radBackgroundDefault").prop("checked", true);
                                $("#dv_standardBackground").show();
                                $("#dv_customBackground").hide();
                                if (this.BackgroundCss != null && this.BackgroundCss != "") {
                                    font = this.BackgroundCss.split(";")[0] + ";";
                                    bg = this.BackgroundCss.split(";")[1] + ";";
                                    bgcolor = this.BackgroundCss.split(";")[2] + ";";
                                    var BGCss = this.BackgroundCss.replace('font-family:', '').replace('background-color:', '').replace('border:', '').replace('1px solid ', '');
                                    BGCss = BGCss.split(";");
                                    $("#ui_txtbgColor").val(BGCss[1]);
                                    $("#ui_txtbgColor").css("background-color", BGCss[1] + ";");
                                    $("#dv_preview").css("background-color", BGCss[1] + ";");
                                    $("#ui_BorderColor").css("background-color", BGCss[2] + ";");
                                    $("#ui_BorderColor").val(BGCss[2]);
                                    $("#dv_preview").css("border", "1px solid " + BGCss[2] + ";");
                                }
                            }
                            else {
                                $("#ui_radBackgroundCustom").prop("checked", true);
                                $("#ui_txtcustomBackground").val(this.BackgroundCss);
                                var exStyle = $("#dv_preview").attr("style");
                                $("#dv_preview").attr("style", (exStyle == undefined ? "" : exStyle) + this.BackgroundCss);
                                $("#dv_customBackground").show();
                                $("#dv_standardBackground").hide();
                            }
                            //// Image
                            if (this.IsImageCustomCss == 0) {
                                $("#ui_radImageDefault").prop("checked", true);
                                $("#dv_standardImage").show();
                                $("#dv_customImage").hide();
                                if (this.ImageCss != null && this.ImageCss != "") {
                                    widthImg = this.ImageCss.split(";")[0] + ";";
                                    heightImg = this.ImageCss.split(";")[1] + ";";
                                    var ImgCss = this.ImageCss.replace('width:', '').replace('height:', '');
                                    ImgCss = ImgCss.split(";");
                                    $("#ui_txtImgW").val(ImgCss[0]);
                                    $("#ui_txtImgH").val(ImgCss[1]);
                                    if (ticker == "imagewithText") {
                                        $("#dv_img").css("width", ImgCss[0] + ";");
                                        $("#dv_img").css("height", ImgCss[1] + ";");
                                    }
                                    else if (ticker == "image") {
                                        $("#img_uploading1").css("width", ImgCss[0] + ";");
                                        $("#img_uploading1").css("height", ImgCss[1] + ";");
                                    }
                                }
                            }
                            else {
                                $("#ui_radImageCustom").prop("checked", true);
                                $("#ui_txtcustomImage").val(this.ImageCss);
                                if (ticker == "imagewithText") {
                                    var exStyle = $("#dv_img").attr("style");
                                    $("#dv_img").attr("style", (exStyle == undefined ? "" : exStyle) + this.ImageCss);
                                }
                                else if (ticker == "image") {
                                    var exStyle = $("#img_uploading1").attr("style");
                                    $("#img_uploading1").attr("style", (exStyle == undefined ? "" : exStyle) + this.ImageCss);
                                }
                                $("#dv_customImage").show();
                                $("#dv_standardImage").hide();
                            }
                            ////Title
                            if (this.IsTitleCustomCss == 0) {
                                $("#ui_radTtlDefault").prop("checked", true);
                                $("#dv_standardTitle").show();
                                $("#dv_customTitle").hide();
                                if (this.TitleCss != null && this.TitleCss != "") {
                                    font = this.TitleCss.split(";")[0] + ";";
                                    Ttlcolor = this.TitleCss.split(";")[1] + ";";
                                    sizeTtl = this.TitleCss.split(";")[2] + ";";
                                    var TCss = this.TitleCss.replace('font-family:', '').replace('color:', '').replace('font-size:', '');
                                    TCss = TCss.split(";");
                                    $("#ui_drpFntFmy").val(TCss[0]);
                                    $("#title_preview").css("font-family", TCss[0] + ";");
                                    $("#ui_txtTtlColor").val(TCss[1]);
                                    $("#ui_txtTtlColor").css("background-color", TCss[1] + ";");
                                    $("#title_preview").css("color", TCss[1] + ";");
                                    $("#ui_txtTtlFS").val(TCss[2]);
                                    $("#title_preview").css("font-size", parseInt(TCss[2]));
                                }
                            } else {
                                $("#ui_radTtlCustom").prop("checked", true);
                                $("#ui_txtcustomTitle").val(this.TitleCss);
                                var exStyle = $("#title_preview").attr("style");
                                $("#title_preview").attr("style", (exStyle == undefined ? "" : exStyle) + this.TitleCss);
                                $("#dv_customTitle").show();
                                $("#dv_standardTitle").hide();
                            }
                            ////Sub Title
                            if (this.IsSubTitleCustomCss == 0) {
                                $("#ui_radSubTtlDefault").prop("checked", true);
                                $("#dv_standardSubTitle").show();
                                $("#dv_customSubTitle").hide();
                                if (this.SubTitleCss != null && this.SubTitleCss != "") {
                                    font = this.SubTitleCss.split(";")[0] + ";";
                                    SubTtlcolor = this.SubTitleCss.split(";")[1] + ";";
                                    sizeSub = this.SubTitleCss.split(";")[2] + ";";
                                    var STCss = this.SubTitleCss.replace('font-family:', '').replace('color:', '').replace('font-size:', '');
                                    STCss = STCss.split(";");
                                    $("#subtitle_preview").css("font-family", STCss[0] + ";");
                                    $("#ui_txtSubTtlColor").val(STCss[1]);
                                    $("#ui_txtSubTtlColor").css("background-color", STCss[1] + ";");
                                    $("#subtitle_preview").css("color", STCss[1] + ";");
                                    $("#ui_txtSTtlFS").val(STCss[2]);
                                    $("#subtitle_preview").css("font-size", parseInt(STCss[2]));

                                }
                            } else {
                                $("#ui_radSubTtlCustom").prop("checked", true);
                                $("#ui_txtcustomSubTitle").val(this.SubTitleCss);
                                var exStyle = $("#subtitle_preview").attr("style");
                                $("#subtitle_preview").attr("style", (exStyle == undefined ? "" : exStyle) + this.SubTitleCss);
                                $("#dv_customSubTitle").show();
                                $("#dv_standardSubTitle").hide();
                            }

                            ////Allow
                            if (this.IsAllowCustomCss == 0) {
                                $("#ui_radAllowDefault").prop("checked", true);
                                $("#dv_standardAllow").show();
                                $("#dv_customAllow").hide();
                                if (this.AllowCss != null && this.AllowCss != "") {
                                    font = this.AllowCss.split(";")[0] + ";";
                                    bgAllow = this.AllowCss.split(";")[1] + ";";
                                    colorAllow = this.AllowCss.split(";")[2] + ";";
                                    var AllCss = this.AllowCss.replace('font-family:', '').replace('background-color:', '').replace('border:', '').replace('color:', '');
                                    AllCss = AllCss.split(";");
                                    $("#ui_btnAllow").css("font-family", AllCss[0] + ";");
                                    $("#ui_AllowtxtBtnBgColor").css("background-color", AllCss[1] + ";");
                                    $("#ui_AllowtxtBtnBgColor").val(AllCss[1]);
                                    $("#ui_btnAllow").css("background-color", AllCss[1] + ";");
                                    $("#ui_AllowtxtBtnFntColor").css("background-color", AllCss[2] + ";");
                                    $("#ui_AllowtxtBtnFntColor").val(AllCss[2]);
                                    $("#ui_btnAllow").css("color", AllCss[2] + ";");
                                }
                            }
                            else {
                                $("#ui_radAllowCustom").prop("checked", true);
                                $("#ui_txtcustomAllow").val(this.AllowCss);
                                var exStyle = $("#ui_btnAllow").attr("style");
                                $("#ui_btnAllow").attr("style", (exStyle == undefined ? "" : exStyle) + this.AllowCss);
                                $("#dv_customAllow").show();
                                $("#dv_standardAllow").hide();
                            }
                            ////Dis Allow
                            if (this.IsDisAllowCustomCss == 0) {
                                $("#ui_radDisAllowDefault").prop("checked", true);
                                $("#dv_standardDisAllow").show();
                                $("#dv_customDisAllow").hide();
                                if (this.DisAllowCss != null && this.DisAllowCss != "") {
                                    font = this.DisAllowCss.split(";")[0] + ";";
                                    bgDis = this.DisAllowCss.split(";")[1] + ";";
                                    colorDis = this.DisAllowCss.split(";")[2] + ";";
                                    var DisAllCss = this.DisAllowCss.replace('font-family:', '').replace('background-color:', '').replace('border:', '').replace('color:', '');
                                    DisAllCss = DisAllCss.split(";");
                                    $("#ui_btnDntAllow").css("font-family", DisAllCss[0]);
                                    $("#ui_DisallowtxtBtnBgColor").css("background-color", DisAllCss[1]);
                                    $("#ui_DisallowtxtBtnBgColor").val(DisAllCss[1]);
                                    $("#ui_btnDntAllow").css("background-color", DisAllCss[1]);
                                    $("#ui_DisallowtxtBtnFntColor").css("background-color", DisAllCss[2]);
                                    $("#ui_DisallowtxtBtnFntColor").val(DisAllCss[2]);
                                    $("#ui_btnDntAllow").css("color", DisAllCss[2]);
                                }
                            }
                            else {
                                $("#ui_radDisAllowCustom").prop("checked", true);
                                $("#ui_txtcustomDisAllow").val(this.DisAllowCss);
                                var exStyle = $("#ui_btnDntAllow").attr("style");
                                $("#ui_btnDntAllow").attr("style", (exStyle == undefined ? "" : exStyle) + this.DisAllowCss);
                                $("#dv_customDisAllow").show();
                                $("#dv_standardDisAllow").hide();
                            }
                            //}

                            ////Setting Rules

                            $("input[name='rad_Browser'][value='" + this.Browser + "']").prop("checked", true);
                            $("input[name='rad_showNbox'][value='" + this.ShowWelcomeMsg + "']").prop("checked", true);
                            if (this.ShowWelcomeMsg == 2) {
                                $("#dv_ShowPages").show();
                                $("#ui_txtShowPages").val(this.ShowPages);
                            } else {
                                $("#dv_ShowPages").hide();
                                $("#ui_txtShowPages").val("");
                            }
                            if (this.DontShowPages != null && this.DontShowPages != "") {
                                $("#ui_chkPages").prop("checked", true);
                                $("#ui_txtDntShowPages").val(this.DontShowPages);
                            }
                            break;
                        case 2:
                            if (this.Ticker == "Image") {
                                $("#ui_YesRNoImage").prop("checked", true);
                                $("#dv_DisImgs").show();
                                $("#img_uploading2").attr("src", this.ImageUrl == "" ? "void(0)" : (this.ImageUrl.indexOf("http") > -1 || this.ImageUrl.indexOf("//www.") > -1 ||
                                    (this.ImageUrl.indexOf("//") > -1 && this.ImageUrl.indexOf("/images") > -1)||
                                    this.ImageUrl.indexOf("www.") > -1) ? this.ImageUrl : (cdnpath + "/WebNotificationUploads/" + this.ImageUrl));
                                $("#dv_ImageIntermediate").show();
                            }
                            else {
                                $("#dv_DisImgs").hide();
                                $("#dv_ImageIntermediate").hide();
                                $("#ui_YesRNoImage").prop("checked", false);
                            }

                            $("#spn_Header").html(this.Title == "" ? "&nbsp;" : this.Title);
                            $("#ui_txtHeader").val(this.Title == "" ? "&nbsp;" : this.Title);
                            $("#spn_Content").html(this.Message == "" ? "&nbsp;" : this.Message);
                            $("#ui_txtContent").val(this.Message == "" ? "&nbsp;" : this.Message);

                            //// Image
                            if (this.IsInterPageImageCustomCss == 0) {
                                $("#ui_radImage2Default").prop("checked", true);
                                $("#dv_standardImage2").show();
                                $("#dv_customImage2").hide();
                                if (this.InterPageImageCss != null && this.InterPageImageCss != "") {
                                    widthImg2 = this.InterPageImageCss.split(";")[0] + ";";
                                    heightImg2 = this.InterPageImageCss.split(";")[1] + ";";
                                    var ImgCss = this.InterPageImageCss.replace('width:', '').replace('height:', '');
                                    ImgCss = ImgCss.split(";");
                                    $("#ui_txtImgW2").val(ImgCss[0]);
                                    $("#ui_txtImgH2").val(ImgCss[1]);
                                    $("#img_uploading2").css("width", ImgCss[0]);
                                    $("#img_uploading2").css("height", ImgCss[1]);
                                }
                            }
                            else {
                                $("#ui_radImage2Custom").prop("checked", true);
                                $("#ui_txtcustomImage2").val(this.InterPageImageCss);
                                var exStyle = $("#img_uploading2").attr("style");
                                $("#img_uploading2").attr("style", (exStyle == undefined ? "" : exStyle) + this.InterPageImageCss);
                                $("#dv_customImage2").show();
                                $("#dv_standardImage2").hide();
                            }
                            ////Header
                            if (this.IsHeaderCustomCss == 0) {
                                $("#ui_radHeaderDefault").prop("checked", true);
                                $("#dv_standardHeader").show();
                                $("#dv_customHeader").hide();
                                if (this.HeaderCss != null && this.HeaderCss != "") {
                                    FontH = this.HeaderCss.split(";")[0] + ";";
                                    sizeH = this.HeaderCss.split(";")[1] + ";";
                                    colorH = this.HeaderCss.split(";")[2] + ";";
                                    var HCss = this.HeaderCss.replace('font-family:', '').replace('color:', '').replace('font-size:', '');
                                    HCss = HCss.split(";");
                                    $("#ui_drpFntFmy2").val(HCss[0]);
                                    $("#ui_txtHeaderFS").val(HCss[1]);
                                    $("#spn_Header").css("font-size", parseInt(HCss[1]));
                                    $("#spn_Header").css("color", HCss[2]);
                                    $("#ui_txtHeaderColor").val(HCss[2]);
                                    $("#ui_txtHeaderColor").css("background-color", HCss[2]);
                                }
                            } else {
                                $("#ui_radHeaderCustom").prop("checked", true);
                                $("#ui_txtcustomHeader").val(this.HeaderCss);
                                var exStyle = $("#spn_Header").attr("style");
                                $("#spn_Header").attr("style", (exStyle == undefined ? "" : exStyle) + this.HeaderCss);
                                $("#dv_customHeader").show();
                                $("#dv_standardHeader").hide();
                            }
                            ////Content
                            if (this.IsContentCustomCss == 0) {
                                $("#ui_radContentDefault").prop("checked", true);
                                $("#dv_standardContent").show();
                                $("#dv_customContent").hide();
                                if (this.ContentCss != null && this.ContentCss != "") {
                                    FontH = this.ContentCss.split(";")[0] + ";";
                                    sizeC = this.ContentCss.split(";")[1] + ";";
                                    colorC = this.ContentCss.split(";")[2] + ";";
                                    var CCss = this.ContentCss.replace('font-family:', '').replace('color:', '').replace('font-size:', '');
                                    CCss = CCss.split(";");
                                    $("#ui_drpFntFmy2").val(CCss[0]);
                                    $("#ui_txtContentFS").val(CCss[1]);
                                    $("#spn_Content").css("font-size", parseInt(CCss[1]));
                                    $("#spn_Content").css("color", CCss[2]);
                                    $("#ui_txtContentColor").val(CCss[2]);
                                    $("#ui_txtContentColor").css("background-color", CCss[2]);
                                }
                            } else {
                                $("#ui_radContentCustom").prop("checked", true);
                                $("#ui_txtcustomContent").val(this.ContentCss);
                                var exStyle = $("#spn_Content").attr("style");
                                $("#spn_Content").attr("style", (exStyle == undefined ? "" : exStyle) + this.ContentCss);
                                $("#dv_customContent").show();
                                $("#dv_standardContent").hide();
                            }

                            break;
                        case 3:
                            $("#ui_txtNotificationName").val("Welcome Message").attr("readonly", "readonly").css("background-color", "rgb(232, 232, 232)");
                            if (this.Status == 0) {
                                $("#ui_mdchk").last().removeClass("md-checked");
                                $("#div_PBtnLinks_Content").hide('fade');
                                wlMsgStatus = 0;
                            }
                            else {
                                $("#ui_mdchk").last().addClass("md-checked");
                                $("#div_PBtnLinks_Content").show('fade');
                                wlMsgStatus = 1;

                                $("#img_uploading3").attr("src", this.ImageUrl == "" ? "void(0)" : (this.ImageUrl.indexOf("http") > -1 || this.ImageUrl.indexOf("//www.") > -1 ||
                                    (this.ImageUrl.indexOf("//") > -1 && this.ImageUrl.indexOf("/images") > -1) || this.ImageUrl.indexOf("www.") > -1) ?
                                    this.ImageUrl : (cdnpath + "/WebNotificationUploads/" + this.ImageUrl));
                                $("#ui_txtwlMsg").val(this.Title);
                                $("#ui_txtwlcContent").val(this.Message);
                                $("#ui_txtwlcLink").val(this.RedirectTo);

                                $("#wlcm_Title").html(this.Title == "" ? "&nbsp;" : this.Title);
                                $("#wlcm_content").html(this.Message == "" ? "&nbsp;" : this.Message);

                                if (this.ExtraActions != "" && this.ExtraActions != null && this.ExtraActions != 0) {
                                    var ExtraBtns = this.ExtraActions.toString().split(",");
                                    for (var n2 = 0; n2 < ExtraBtns.length; n2++) {
                                        var ExtraSeparate = ExtraBtns[n2].split("^");
                                        var a = n2 === 0 ? "" : n2;
                                        $("#ui_txtActionName0" + a).val(ExtraSeparate[0]);
                                        var hid = ExtraSeparate[1].split('~');
                                        if (hid[0] == "Close")
                                            $("#ui_ddlAction0" + a).val(0);
                                        else if (hid[0] == "Event")
                                            $("#ui_ddlAction0" + a).val(2);
                                        else
                                            $("#ui_ddlAction0" + a).val(1);
                                        $("input[name=Hide0" + a + "][value=" + hid[1] + "]").prop('checked', 'checked');
                                        if (ExtraSeparate[2] != '') {
                                            $("input[name^=Icon0" + a + "][value='1']").attr("checked", true);
                                            $("#dv_extImg0" + a).show();
                                            $("#img_uploading" + (a + 4)).attr("src", ExtraSeparate[2]);
                                            $("#imgbtn" + (a + 1)).attr('src', ExtraSeparate[2]);
                                        }
                                        else {
                                            $("input[name=Icon0" + a + "][value=0]").prop('checked', 'checked');
                                            $("#dv_extImg0" + a).hide();
                                        }
                                        $("#dv_AddAction0" + a).show();
                                        if (a == 1) {
                                            $("#btnAction").hide();
                                        }
                                        if (hid[0] != "Close" && hid[0] != "Event") {
                                            $("#dv_1" + a).show();
                                            $("#ui_txtClickRedirect0" + a).val(hid[0]);
                                        }
                                    }
                                }
                            }
                            break;
                    }
                });
            } else {
                $("#dv_NotifStatus").show();
                $("#ui_txtNotificationName").val("Welcome Message").attr("readonly", "readonly").css("background-color", "rgb(232, 232, 232)");
            }
        },
        error: function (objxmlRequest) {
            window.console.log(objxmlRequest.responseText);
        }
    });
}
//Show/Hide Div
function ShowHideDiv(welcomeMsg, dbPushId) {
    if (welcomeMsg == 1 && dbPushId == pushId) {
        $("#div_Pbox_Content").show();
        $("#div_PnativeBrowser_Content").hide();
        $("#div_PBtnLinks_Content").hide();
    }
    else if (welcomeMsg == 2 && dbPushId == pushId) {
        $("#div_Pbox_Content").hide();
        $("#div_PnativeBrowser_Content").show();
        $("#div_PBtnLinks_Content").hide();
    }
    else if (welcomeMsg == 3 && dbPushId == pushId) {
        $("#div_Pbox_Content").hide();
        $("#div_PnativeBrowser_Content").hide();
        $("#div_PBtnLinks_Content").show();
    }
}
function CheckWelcomeMsgStatus() {
    $.ajax({
        type: "POST",
        url: "/Browser/GetWelcomeMsgStatus",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response.Table.length > 0) {
                if (response.Table[0].Status == 0) {
                    //$('#togBtn .off').trigger('click');
                }
                else {
                    $('#togBtn').trigger('click');
                }
            }
        },
        error: function (response) {
        }
    });

}
function SetWelcomeMsgStatus() {
    $.ajax({
        type: "POST",
        url: "/Browser/UpdateWelcomeMsgStatus",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response.Table[0].Id == 0) {
                ShowErrorMessage("Welcome Message Disabled Successfully!");
            }
            else {
                ShowErrorMessage("Welcome Message Enabled Successfully!");
            }
            SettingUpStaticDictionary();
        },
        error: function (response) {
        }
    });
}
$('#chk_Poweredby').change(function () {
    if ($("#SpnPoweredby").is(':visible')) {
        //$("#lnkPoweredby").hide();
        $("#SpnPoweredby").hide();
        //$('#ui_btnAllow').css('margin-left', '45%');
    }
    else {
        //$('#ui_btnAllow').css('margin-left', '18%');
        //$("#lnkPoweredby").show();
        $("#SpnPoweredby").show();
    }
});
///// Number Validation
function isNumber(evt) {
    var iKeyCode = (evt.which) ? evt.which : evt.keyCode
    if (iKeyCode != 46 && iKeyCode > 31 && (iKeyCode < 48 || iKeyCode > 57)) {
        ShowErrorMessage("Please enter valid numbers");
        return false;
    }
    return true;
}
///Setting Up Notification - Static Dictionary
function SettingUpStaticDictionary() {
    for (var i = 0; i < 10; i++) {
        var jsForSettingUpNotification = p5trackerpath + "?AccountId=" + accountId + "&NotificationSet=True";
        jsForSettingUpNotification = 'https:' == document.location.protocol ? jsForSettingUpNotification.replace("http", "https") : jsForSettingUpNotification;
        var elem = document.createElement("img");
        elem.setAttribute("src", jsForSettingUpNotification);
        elem.setAttribute("height", "0");
        elem.setAttribute("width", "0");
        if (document.body != null && document.body != 'undefined') {
            document.body.appendChild(elem);
        } else {
            document.getElementsByTagName('body')[0].appendChild(elem);
        }
    }
}

var rss = 0, ttl = "", msg = "";
function changeradRSS(val) {
    if (val == 0 || val == undefined) {
        $("#ui_radRSS0").last().addClass("md-checked");
        $("#ui_radRSS1").last().removeClass("md-checked");
        $("#dv_SimplePush").show();
        $("#dv_RSS").hide();
        if ($("#ui_txtwlcContent").val() == "") {
            $("#ui_txtwlcContent").val("This is notification content");
        }
        if ($("#ui_txtwlMsg").val() == "") {
            $("#ui_txtwlMsg").val("This is notifications title :)");
        }
        $("#wlcm_Title").html($("#wlcm_Title").html() == "First 96 chars of your post title" ? "This is notification content" : ($("#wlcm_Title").html().length > 95 ? $("#wlcm_Title").html().substring(0, 95) + ".." : $("#wlcm_Title").html()));
        $("#wlcm_content").html($("#wlcm_content").html() == "First 255 chars of your post message" ? "This is notifications title :)" : ($("#wlcm_content").html().length > 255 ? $("#wlcm_content").html().substring(0, 255) + ".." : $("#wlcm_content").html()));

        rss = 0;
    } else {
        $("#ui_radRSS1").last().addClass("md-checked");
        $("#ui_radRSS0").last().removeClass("md-checked");
        $("#dv_SimplePush").hide();
        $("#dv_RSS").show();
        $("#wlcm_Title").html(ttl == "" ? "First 96 chars of your post title" : (ttl.length > 95 ? ttl.substring(0, 95) + ".." : ttl));
        $("#wlcm_content").html(msg == "" ? "First 255 chars of your post message" : (msg.length > 255 ? msg.substring(0, 255) + ".." : msg));
        rss = 1;
    }
}

//function RssFeedSend() {
//    var rssFeedUrl = "http://blackbox4.wordpress.com/feed/";
//    rssFeedUrl = document.location.protocol === "https:" ? rssFeedUrl.replace("http", "https") : rssFeedUrl;
//    YUI().use('yql', function (y) {
//        var rssContent = "";
//        var query = 'select * from rss(0,1) where url = "' + rssFeedUrl + "\"";
//        var q = y.YQL(query, function (r) {
//            //r now contains the result of the YQL Query as a JSON
//            var feed = r.query.results.item; // get feed as array of entries
//            for (var i = 0; i < feed.length; i++) {
//                rssContent += "<div style='width:100%;font-family:Source Sans Pro,sans-serif;float:left;display: inline-block;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;'><a class='tick' style='font-size:20px;color:#795548;' target='_blank' title='" +
//                    feed[i].title + "' href='" + feed[i].link + "'>" + feed[i].title + "</a></div>" +
//                    "<div style='width:100%;font-family:Source Sans Pro,sans-serif;font-size:15px;color: #646464;float:left'>" +
//                    (feed[i].description.length > 200 ? feed[i].description.toString().substring(0, 150) + "...<br>" : feed[i].description) + "<br></div>";
//            }
//            if (rssContent == "")
//                $("#dvContentThings").html("There is no published data at this time !!").attr("class", "descrip").css("font-size", "16px").attr("padding", "10px");
//            else
//                $("#dvContentThings").html(rssContent);
//        });
//    });
//}