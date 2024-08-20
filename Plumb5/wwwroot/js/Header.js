// P5 header JScript File

var regHeaderExpEmail = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
//var regHeaderDomain = /^www\.[a-zA-Z0-9-\.]+\.(com|org|net|mil|edu|ca|co.uk|com.au|gov|in|eu)$/;
var regHeaderDomain = /^www\.[a-zA-Z0-9-\.]+\.(com|org|net|mil|edu|ca|co.uk|com.au|gov|in|eu|biz|info|mobi|us|ly|cc|bz|tv|me|vg|ws|name|org.uk|me.uk|de|be|cn|gs|tc|ms)$/;

var getheader = "<table width='100%' border='0' align='center' cellpadding='0' cellspacing='0' bgcolor='#FFFFFF'><tr>" +
            "<td width='250' height='90' style='padding-left: 35px; padding-top: 10px;'>" +
                "<a href='http://www.plumb5.com'><img border='0px' src='images/plumb5_logo.jpg' alt='Plumb5' width='151' height='42' /></a></td>" +
            "<td valign='top' style='padding-bottom: 2px; padding-right: 20px; padding-top: 20px;'>" +
                "<div align='right'>" +
                    //"<div class='cartbox'>" +
                       // "<a class='lnkEdit' href='http://www.plumb5.com/contactus.html'><img border='0px' title='Contact Us' src='images/callico.jpg' width='25' height='24' /></a></div>" +
                    "<div class='cartbox' style='right: 20px;'>" +
                    "<a class='lnkEdit' href='http://www.plumb5.com/contactus.html'><img border='0px' title='Contact Us' src='images/callico.jpg' width='25' height='24' /></a>"+
                        //"<a class='lnkEdit' href='http://www.plumb5.com/Package.html'><img border='0px' title='My cart' id='dvMycart' src='images/chatico.jpg' width='27' height='24' /></a></div>" +
                "</div>"+
                "</td></tr></table>" +
   "<table width='100%' border='0' cellspacing='0' cellpadding='0'><tr><td width='20' bgcolor='#75A00E'></td><td>" +
                "<table width='100%' border='0' cellspacing='0' cellpadding='0'><tr>" +
                       " <td height='40' align='center' background='images/nvbg.jpg'>" +
                           " <table width='100%' border='0' cellspacing='0' cellpadding='0'><tr>" +
                                   " <td style='padding-left: 25px; width: 75%'>" +
                                       " <ul class='dd_menu'>" +
                                            "<li><a href='http://www.plumb5.com' style='color: #fff;'>Home</a></li>" +
                                           " <li><a href='#'>Features</a>" +
                                              "  <ul>" +
                                                  "<li><a href='http://www.plumb5.com/WebsiteAnalytics.html'>Visitor Analytics</a></li>" +
                                                    "<li><a href='http://www.plumb5.com/traffic.html'>Personalization</a></li>" +
                                                    "<li><a href='http://www.plumb5.com/content.html'>Content Measurement</a></li>" +
                                                    "<li><a href='http://www.plumb5.com/Chat.html'>Chat</a></li>" +
                                                    "<li><a href='http://www.plumb5.com/Mail.html'>Mail Campaigns</a></li>" +
                                                    "<li><a href='http://www.plumb5.com/Lead.html'>Lead Management</a></li>" +
                                                    "<li><a href='http://www.plumb5.com/engauge.html'>Communities</a></li>" +
                                                    "<li><a href='http://www.plumb5.com/offline.html'>Social Search</a></li>" +
                                                    "<li><a href='http://www.plumb5.com/mm.html'>Unified Profiles</a></li>" +
                                                "</ul>" +
                                            "</li>" +
                                            "<li><a href='#'>Resources</a>" +
                                                "<ul>" +
                                                    "<li><a href='http://www.plumb5.com/present.html'>Presentations</a></li>" +
                                                    "<li><a href='http://www.plumb5.com/contactus.html'>Pricing</a></li>" +
                                                    "<li><a href='http://www.plumb5.com/demos.html'>Demos</a></li>" +
                                                    "<li><a href='http://www.plumb5.com/cases.html'>Cases</a></li>" +
                                                    "<li><a href='http://www.plumb5.com/doclib.html'>Doclib</a></li>" +
                                                    "<li><a href='http://www.plumb5.com/release.html'>Release Notes</a></li>" +
                                                    "<li><a href='http://www.plumb5.com/questions.html'>Questions</a></li>" +
                                                "</ul>" +
                                                "<li><a href='#'>Partners</a>" +
                                                    "<ul>" +
                                                        "<li><a href='http://www.plumb5.com/partners.html'>About Partners</a></li>" +
                                                       // "<li><a href='http://www.plumb5.com/become.html'>Become a partner</a></li>" +
                                                        "<li><a href='http://www.plumb5.com/apppart.html'>App Partners</a></li>" +
                                                   " </ul>" +
                                                    "<li><a href='#'>Café</a>" +
                                                        "<ul>" +
                                                            "<li><a href='http://blackbox4.wordpress.com/' target='_blank'>Blog</a></li>" +
                                                            "<li><a href='http://cafe.plumb5.com/home/Page?CafeId=4146&AdsId=186&PageId=20' target='_blank'>Insight Center</a></li>" +
                                                            "<li><a href='http://www.plumb5.com/appstore.html'>App Store</a></li>" +
                                                        "</ul>" +
                                                    "</li>" +
                                                    "<li><a href='#'>Help</a>" +
                                                        "<ul>" +
                                                            "<li><a href='support/' target='_blank'>Documentation</a></li>" +
                                                            "<li><a href='http://www.weedioh.com/plumb5/' target='_blank'>Video Help</a></li>" +
                                                            "<li><a href='http://www.plumb5.com/developer.html'>For Developers</a></li>" +
                                                        "</ul>" +
                                                    "</li>" +
                                                    "<li><a href='#'>Contact Us</a>" +
                                                        "<ul>" +
                                                            "<li><a href='http://www.plumb5.com/aboutus.html'>About Us</a></li>" +
                                                            "<li><a href='http://www.plumb5.com/contactus.html'>Address</a></li>" +
                                                        "</ul>" +
                                                    "</li>" +
                                        "</ul>" +
                                    "</td>" +
                                    "<td style='width: 25%;' align='right'>" +
                                        "<div style='width: 200px; font-family: Signika Negative, sans-serif; background-color: #75a00e;border: 1px solid #75a00e; padding: 9px; right: 0px;'>" +

                                        //"<a href='http://www.plumb5.com/Account/register' style='color: #fff; text-decoration: none; padding-right: 20px;padding-left: 10px;'>Customer Login</a>"+
                                            "<a style='color: #fff; text-decoration: none; padding-right: 10px;' id='dvMyPage' ></a><span id='dvSeparator' style='color: #fff;'></span><a href='javascript:void(0)' onclick='Checksignin(1);' style='color: #fff; text-decoration: none; padding-right: 20px;padding-left: 10px;' id='dvUserLogin' ></a>" +
                                        "</div>" +
                                    "</td>" +
                               " </tr>" +
                            "</table>" +
                        "</td>" +
                    "</tr>" +
                "</table>" +
            "</td>" +
       " </tr>" +
    "</table>";


var getloginform = "<div id='dvLoginpanel' class='descat CurrentLogin'>" +
    "    <div class='newTitle'>" +
    "        Customer Login <span style='float: right;'>" +
    "             <img onclick='Closesignin()' title='Close' src='images/Lofinclose.jpg' /></span>" +
    "     </div>" +
    "     <div style='border-bottom: 1px solid #e8e8e8;'>" +
    "     </div>" +
    "     <div class='divPadding' style='margin-top:20px;'>" +
    "         Email Address</div>" +
    "     <input type='text' id='txtEmailIdP' class='boxe' size='10' style='width: 325px; margin-bottom: 10px;' />" +
    "     <div class='divPadding'>" +
    "         Password</div>" +
    "     <input type='password' id='txtPasswordP' class='boxe' size='10' style='width: 325px;' />" +
    "     <br />" +
    "     <div class='divPadding'>" +
    "         <input type='checkbox' id='chkRememberPassword' value='checkbox' />Remember Me?</div>" +
    "     <div>" +
    "         <div style='float: left;'>" +
    "             <input type='button' value='Sign In' id='btnSignIn' onclick='SignIn();' class='but' style='margin-top:10px;'/>" +
    "             <label class='error' id='lblErrorMessg'></label>" +
    "         </div>" +
    "         <div style='float: right;'>" +
    "             <a href='javascript:void(0);' onclick='OpenForgotPanel()' style='padding-left: 260px;" +
    "                 font-family: Signika Negative, sans-serif; font-size: 15px; color: #6b940c; text-decoration: none;'>" +
    "                 forgot password</a>" +
    "         </div>" +
    "     </div>" +
    " </div>" +
    " <div id='dvForgotpanel' class='descat CurrentLogin' style='display: none;'>" +
    "     <div class='newTitle'>" +
    "         Forgot Password?" +
    "         <img onclick='Closesignin()' title='Close' style='cursor: pointer; float: right'" +
    "             src='images/Lofinclose.jpg' /></div>" +
    "     <div style='border-bottom: 1px solid #e8e8e8;'>" +
    "     </div>" +
    "     <div class='divPadding' style='margin-top:20px;'>" +
    "         Email Address</div>" +
    "     <input type='text' id='txtForgotEmailId' class='boxe' size='10' style='width: 325px; margin-bottom: 10px;' /><br />" +
    "     <input type='button' value='Send' id='btnForgotPassword' onclick='ForgotPassword();' class='but' style='margin-top:10px;'/><label class='error' id='lblForgorPassMesg'></label>" +
    " </div>";

var loadingDiv = "<div style='position: fixed; z-index: 12; top: 50%; left: 45%; display: none;' id='dvLoading'>" +
    "<div style='position: absolute; z-index: 5; top: 30%; left: 48%;'>" +
    "    <img src='https://www.plumb5.com/images/al_loading.gif' alt='Loading..Please Wait'" +
    "        title='Loading..Please Wait..' />" +
    "    <br />" +
    "    <br />" +
    "</div>" +
    "</div>";

var TrialDiv = "<div id='dvTrial' class='descat CurrentLogin' style='display: none;'>" +
    "     <div class='newTitle'>" +
    "         Get a trial account" +
    "         <img onclick='Closesignin()' title='Close' style='cursor: pointer; float: right'" +
    "             src='images/Lofinclose.jpg' /></div>" +
    "     <div style='border-bottom: 1px solid #e8e8e8;'>" +
    "     </div>" +
    "     <div class='divPadding' style='margin-top:20px;'>" +
    "         User Name</div>" +
    "     <input type='text' id='txtTriUserName' class='boxe' size='10' style='width: 325px; margin-bottom: 10px;' />" +
    "     <div class='divPadding'>" +
    "         Email Address</div>" +
    "     <input type='text' class='boxe' id='txtTriEmailId' size='10' style='width: 325px; margin-bottom: 10px;' />" +
    "     <div class='divPadding'>" +
    "         Password</div>" +
    "     <input type='password' class='boxe' id='txtTriPassword' size='10' style='width: 325px; margin-bottom: 10px;' />" +
    "     <div class='divPadding'>" +
    "         Domain Name</div>" +
    "     <input type='text' id='txtTriDomainName' class='boxe' size='10' style='width: 325px; margin-bottom: 10px;' /><br />" +
    "     <input type='button' value='Send' id='btTriCreatAccount' class='but' style='margin-top:10px;'/> <label class='error' id='lblTriCreatAccount'></label>" +
    " </div>";



document.write(getheader + getloginform + loadingDiv + TrialDiv);


$(document).ready(function () {
    //CheckLoginDetails();
});


function CheckLoginDetails() {

    var url = "Handler/CheckLoginDetails.ashx";


    $.getJSON(url, function (json) {
        $.each(json, function (i, loginDetails) {
            if (loginDetails.IsSessionAlive == 1) {
                $("#dvMyPage").html("My Page");
                $("#dvSeparator").html("|");

                if (loginDetails.UserId == "6jqmS1Mz7jI=") {
                    $("#dvMyPage").attr("href", "Mydomain1.aspx");
                }
                else {
                    $("#dvMyPage").attr("href", "MydomainNew.aspx");
                }

                $("#dvUserLogin").html("Log out");
                $("#dvUserLogin").attr("onclick", "LogOut();");
            } else {

                $("#dvUserLogin").html("Customer Login");
                $("#dvUserLogin").attr("onclick", "Checksignin(1);");
            }
        });
    });
}

function Checksignin(action) {
    if (action == 0) {
        $("#popUp").hide();
        $("#dvTrial").hide();
        $("#dvLoginpanel").hide();
    }
    else if (action == 1) {
        $("#popUp").hide();
        $("#dvTrial").hide();
        $("#dvLoginpanel").hide();
        $("#dvForgotpanel").hide();
        $("#dvLoginpanel").show(1000);
    }
}

function LogOut() {

    var url = "Handler/LogInLogOut.ashx?Action=2";
    $.getJSON(url, function (json) {
        $.each(json, function (i, loginDetails) {
            $("#dvMyPage").html("");
            $("#dvSeparator").html("");
            $("#dvUserLogin").html("Customer Login");
            $("#dvUserLogin").attr("onclick", "Checksignin(1);");
            $("#dvMyPage").removeAttr("href");
            window.location.href = "http://www.plumb5.com";
        });
    });
}


function Closesignin() {
    $("#dvSkipe").hide(1000);
    $("#dvLoginpanel").hide(1000);
    $("#dvForgotpanel").hide(1000);
    $("#dvTrial").hide(1000);
    $("#popUp").hide();
}
function OpenForgotPanel() {
    $("#popUp").hide();
    $("#dvLoginpanel").hide();
    $("#dvTrial").hide();
    $("#dvForgotpanel").show();
}

function Checkmycart() {
    $("#dvMycart").attr("src", "images/chatico_act.jpg");
}


function SignIn() {

    if (!validation())
        return;

    if (window.location.href.toString().toLowerCase().indexOf("registerPrice.html") > 0) {
        $("#txtEmailId").val($("#txtEmailIdP").val());
        $("#txtPassword").val($("#txtPasswordP").val());
        $("#btnLoginIn").click();
    }
    else {
        var dynamicUserIdCookie = GetUserCookie("P5UserPayment");
        $("#dvLoading").show();


        var emailIdDetails = $.trim($("#txtEmailIdP").val());
        var passwordDetails = $("#txtPasswordP").val().replace(/#/g, "@$@");

        var url = "Handler/LogInLogOut.ashx?Action=1&EmailId=" + emailIdDetails + "&Password=" + passwordDetails + "&DynamicUserIdCookie=" + dynamicUserIdCookie + "";
        $.getJSON(url, function (json) {
            $.each(json, function (i, loginDetails) {
                if (loginDetails.CreateUserStatus == 0) {
                    $("#lblErrorMessg").html("Please enter correct details.");
                } else if (loginDetails.CreateUserStatus == 1 && window.location.href.toString().toLowerCase().indexOf("pricing.html") < 0 && window.location.href.toString().toLowerCase().indexOf("package.html") < 0 && window.location.href.toString().toLowerCase().indexOf("registerprice.html") < 0 && window.location.href.toString().toLowerCase().indexOf("addtocard.html") < 0) {

                    if (loginDetails.UserId == 1)
                        window.location.href = "MyDomain1.aspx";
                    else
                        window.location.href = "MyDomainNew.aspx";
                }
                else if (loginDetails.CreateUserStatus == 1) {

                    var Customize = urlParam("Customize");

                    if (Customize == "1") {
                        window.location.href = "AddtoCard.html?UserId=" + dynamicUserIdCookie + "&Customize=1";
                    }
                    else {
                        window.location.href = "AddtoCard.html?UserId=" + dynamicUserIdCookie + "";
                    }
                }
                $("#dvLoading").hide();
            });
        });

    }
}


function validation() {

    if ($("#txtEmailIdP").val().length == 0) {
        $("#lblErrorMessg").html("Please enter email Id.");
        return false;
    }
    if (!regHeaderExpEmail.test($("#txtEmailIdP").val())) {
        $("#lblErrorMessg").html("Please enter correct email id.");
        return false;
    }

    if ($("#txtPasswordP").val().length == 0) {
        $("#lblErrorMessg").html("Please enter passowrd.");
        return false;
    }

    $("#lblErrorMessg").html("");
    return true;

}

function ForgotPassword() {

    if (!regHeaderExpEmail.test($("#txtForgotEmailId").val())) {
        $("#lblForgorPassMesg").html("Please enter correct email id.");
        return;
    }
    $("#lblForgorPassMesg").html("");
    $("#dvLoading").show();
    var url = "Handler/LogInLogOut.ashx?Action=3&EmailId=" + $("#txtForgotEmailId").val() + "";
    $.getJSON(url, function (json) {
        $.each(json, function (i, loginDetails) {
            if (loginDetails.CreateUserStatus == 0) {
                $("#lblForgorPassMesg").html("Invalid email id.");
            } else if (loginDetails.CreateUserStatus == 1) {
                $("#lblForgorPassMesg").html("Your password is sent your email id.");
            }
            $("#dvLoading").hide();
        });
    });


}


function GetUserCookie(cname) {

    var i, x, y, arRcookies = document.cookie.split(";");
    for (i = 0; i < arRcookies.length; i++) {
        x = arRcookies[i].substr(0, arRcookies[i].indexOf("="));
        y = arRcookies[i].substr(arRcookies[i].indexOf("=") + 1);
        x = x.replace(/^\s+|\s+$/g, "");

        if (x == cname) {
            return unescape(y);
        }
    }
    return undefined;
}



function OpenTrialPanel(getFeature) {
    window.location.href = "trial.html";

    //$('html, body').animate({ scrollTop: 0 }, 'fast');
    //$("#popUp").hide();
    //$("#dvLoginpanel").hide(1000);
    //$("#dvForgotpanel").hide(1000);
    //$("#dvTrial").show(1000);
}


function OpenScheduleskype() {
    $('html, body').animate({ scrollTop: 0 }, 'fast');
    $("#popUp").hide();
    $("#dvLoginpanel").hide(1000);
    $("#dvForgotpanel").hide(1000);
    $("#dvTrial").hide(1000);
}


function OpenPopUp(image) {
    $("#popUp").html('<img src=' + image + ' border="0" /><img onclick="Closesignin()" title="Close" style="cursor: pointer; float: right;position: absolute;right:5px;;top:5px;" src="images/Lofinclose.jpg" /></div>');
    $("#popUp").show();
}


$(document).ready(function () {
    $("#txtEmailIdP, #txtPasswordP").bind("keydown", function (event) {
        // track enter key
        var keycode = (event.keyCode ? event.keyCode : (event.which ? event.which : event.charCode));
        if (keycode == 13) {
            SignIn();
            return false;
        }
        else {
            return true;
        }
    });

});






$("#btTriCreatAccount").click(function () {

    window.location.href = "trial.html";
    


    //$("#lblTriCreatAccount").html("");

    //if (!ValidationTrial())
    //    return false;
    //$("#dvLoading").show();
    //var domain = $("#txtTriDomainName").val();
    //domain = domain.replace("http://", "").replace("https://", "").replace("/", "");
    //var url = "Handler/TrialAccountCreat.ashx?callback=?&UserName=" + CleanText($("#txtTriUserName").val()) + "&EmailId=" + CleanText($("#txtTriEmailId").val()) + "&Password=" + CleanText($("#txtTriPassword").val()) + "&DomainName=" + CleanText(domain) + "";
    //$.getJSON(url, function (json) {
    //    $.each(json, function (i, trialAccount) {

    //        if (trialAccount.CreateAccount == 0) {
    //            $("#lblTriCreatAccount").html("With this email id already an account is registered.");
    //        }
    //        else if (trialAccount.CreateAccount == 1) {
    //            $("#lblTriCreatAccount").html("Account has been successfully created, Please check your mail.");
    //        }
    //        $("#dvLoading").hide();
    //    });
    //});
    //return false;
});


this.ValidationTrial = function () {

    if ($.trim($("#txtTriUserName").val()).length == 0) {
        $("#lblTriCreatAccount").html("Please enter user name.");
        return false;
    }
    if (!regHeaderExpEmail.test($("#txtTriEmailId").val())) {
        $("#lblTriCreatAccount").html("Please enter correct mail id.");
        return false;
    }

    if ($.trim($("#txtTriPassword").val()).length == 0) {
        $("#lblTriCreatAccount").html("Please enter password.");
        return false;
    }

    if ($.trim($("#txtTriPassword").val()).length < 6) {
        $("#lblTriCreatAccount").html("Please enter at least minimum 6 character.");
        return false;
    }
    if ($("#txtTriDomainName").val().length == 0) {
        $("#lblTriCreatAccount").html("Please enter the domain name.");
        return false;
    }
    var P5domain = $.trim($("#txtTriDomainName").val()).replace("http://", "").replace("https://", "").replace("/", "");
    if (!regHeaderDomain.test(P5domain)) {
        $("#lblTriCreatAccount").html("Please enter correct domain.");
        return false;
    }

    $("#lblTriCreatAccount").html("");
    return true;
}

this.CleanText = function (content) {

    content = content.replace(/'/g, "‘");
    content = content.replace(/>/g, "&gt;");
    content = content.replace(/</g, "&lt;");
    content = $.trim(content);

    return content;
}

function urlParam(name) {
    var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (!results) {
        return 0;
    }
    return results[1] || 0;
};
