$(document).ready(function () {
    ShowBrowserDetails();
    BindSelectedFormTabs();
    HidePageLoading();
});

function BindSelectedFormTabs() {

    var UserAgent = navigator.userAgent.toLowerCase();
    if (UserAgent.indexOf("edg") != -1) {
        $('#brwsericon').addClass('fa fa-edge');
        $('.bwsername').html('Microsoft Edge');
        $("#dvTaggedForm").unbind('click').css("background-color", "#EAEAEA");
        $('#taggedfrm').prop('disabled', true);
    }
    else if (UserAgent.indexOf("chrome") != -1) {
        $('#brwsericon').addClass('fa fa-chrome');
        $('.bwsername').html('Google Chrome');
    }
    else if (UserAgent.indexOf("firefox") != -1) {
        $('#brwsericon').addClass('fa fa-firefox');
        $('.bwsername').html('Mozilla');
        $("#dvTaggedForm").unbind('click').css("background-color", "#EAEAEA");
        $('#taggedfrm').prop('disabled', true);

    }
    else if (UserAgent.indexOf("safari") != -1) {
        $('#brwsericon').addClass('fa fa-safari');
        $('.bwsername').html('Safari');
        $("#dvTaggedForm").unbind('click').css("background-color", "#EAEAEA");
        $('#taggedfrm').prop('disabled', true);

    }
    else if (UserAgent.indexOf("msie") != -1 || (UserAgent.indexOf("trident/") != -1 && UserAgent.indexOf(" rv:") != -1)) {
        $('#brwsericon').addClass('fa fa-internet-explorer');
        $('.bwsername').html('IE');
        $("#dvTaggedForm").unbind('click').css("background-color", "#EAEAEA");
        $('#taggedfrm').prop('disabled', true);

    }
    else {
        $('.bwsername').html('Unknown');
        $("#dvTaggedForm").unbind('click').css("background-color", "#EAEAEA");
        $('#taggedfrm').prop('disabled', true);

    }

    $("#dvEmbeddedForm,#dvPopUpForm,#dvTaggedForm").removeClass("selectedfrmtype");
    $("#embeddedfrm").prop("checked", false);
    $("#popupbxfrm").prop("checked", false);
    $("#taggedfrm").prop("checked", false);

    var FormType = urlParam("FormType");

    if (FormType != null && FormType != "") {
        if (FormType.toLowerCase() == "embeddedform") {
            $("#dvEmbeddedForm").addClass("selectedfrmtype");
            $("#embeddedfrm").prop("checked", true);
        }
        else if (FormType.toLowerCase() == "popupform") {
            $("#dvPopUpForm").addClass("selectedfrmtype");
            $("#popupbxfrm").prop("checked", true);
        }
        else if (FormType.toLowerCase() == "taggedform") {
            if (UserAgent.indexOf("chrome") != -1) {
                $("#dvTaggedForm").addClass("selectedfrmtype");
                if ($('#taggedfrm').prop('disabled') == true)
                    $("#taggedfrm").prop("checked", false);
                else
                    $("#taggedfrm").prop("checked", true);
            }
        }
    }
}

$(".box-frmtype-wrp").click(function () {
    $(".box-frmtype-wrp").removeClass("selectedfrmtype");
    $(this).addClass("selectedfrmtype");
    let getfrmtpechkbxid = $(this).children(".frmtypchkwrp").find("input").attr("id");
    let selectedfrmtypeval = $(this).children(".frmtypchkwrp").find("input").val();
    $("#" + getfrmtpechkbxid).prop("checked", true);

    if (selectedfrmtypeval == "embeddedform")
        $(".currtbrwsewrp").addClass("hideDiv");
    else if (selectedfrmtypeval == "popupboxform")
        $(".currtbrwsewrp").addClass("hideDiv");
    else if (selectedfrmtypeval == "taggedform")
        $(".currtbrwsewrp").removeClass("hideDiv");
});

function ExtensionExists() {
    try {
        var http = new XMLHttpRequest();
        http.open('HEAD', "chrome-extension://mkilmbkdaobkmpjhjjhmhcmibneacaib/js/divinject.js", false);
        http.send();
        return http.status != 404;
    }
    catch {
        return false;
    }
}

$("#ui_btnNext").click(function () {
    if ($("#embeddedfrm").is(":checked")) {
        window.location.href = "/CaptureForm/Create/EmbeddedForm?FormType=1";
    }
    else if ($("#popupbxfrm").is(":checked")) {
        window.location.href = "/CaptureForm/Create/PopUpForm?FormType=1";
    }
    else if ($("#taggedfrm").is(":checked")) {
        if (ExtensionExists()) 
            window.location.href = "/CaptureForm/Create/ConfigureTaggedForm";
        else 
            ShowErrorMessage(GlobalErrorList.CreateTaggedForm.ChromeExtensionNotExists);
    }
});

function ShowBrowserDetails() {
    var selectedfrmtypeval = urlParam("FormType");

    if (selectedfrmtypeval == "embeddedform")
        $(".currtbrwsewrp").addClass("hideDiv");
    else if (selectedfrmtypeval == "popupform")
        $(".currtbrwsewrp").addClass("hideDiv");
    else if (selectedfrmtypeval == "taggedform")
        $(".currtbrwsewrp").removeClass("hideDiv");
}