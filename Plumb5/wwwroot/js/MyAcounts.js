
var totalAccount = 0;


$(document).ready(function () {

    //if (getCookie("mydomainbanner") == 1)
    //{ $("#dvAdvertisement").hide(); }

    //$("#dvHeader").hide();
    $("#dvLoading").show();
    BindMyAccount();
});

BindMyAccount = function () {
    $("#dvLoading").show();
    $.ajax({
        url: "Account/getMyAccounts",
        type: 'Post',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindData,
        error: function (objxmlRequest) {
            $("#dvLoading").hide();
            window.console.log(objxmlRequest.responseText);
        }
    });
};

function BindData(response) {

    if (response.d == "-10") window.location.href = "Register.aspx";

    var xmlDoc = $.parseXML(response.d);
    var xml = $(xmlDoc);
    if (xml.find("Table").length > 0) {


        var accountList = xml.find("Table");
        totalAccount = xml.find("Table").length;
        $.each(accountList, function (i) {

            var Updtodate = new Date($(this).find("AdDate").text());
            if (Updtodate != '') {
                var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                var expdate = Updtodate.getDate() + " " + monthNames[Updtodate.getMonth()] + " " + Updtodate.getFullYear();
                getdate = "Created Date : " + expdate;
            }
            var clickUrl = "";
            if (i != 0)
                clickUrl = "ShowAccountDetials(" + $(this).find("AdsId").text() + ");";

            var tdContent = "<div id='ui_lnkDomain_" + $(this).find("AdsId").text() + "' onclick='" + clickUrl + "' style='border: solid 1px #b2bba0;padding:20px 15px 35px 15px;margin-top:15px;cursor: pointer;'>" +
            "<div class='mydomainac' style='float:left;'><a href='javascript:void(0);' target='_blank'>" + $(this).find("AdName").text() + "</a></div>" +//http://" + $(this).find("DomainName").text() + "
            "<div style='float:right;font-family: Tahoma, Geneva, sans-serif; font-size:.85em; color:#878787;'>" + getdate + "</div>" +
            "</div><div id='feature-" + $(this).find("AdsId").text() + "'></div>";
            $("#dvAllUsers").append(tdContent);
            if (i == 0)
                ShowAccountDetials($(this).find("AdsId").text());

        });
        $("#dvAccountHeader, #dvAllUsers").show()
    }
    else {
        $("#dvEmptyUsers").show();
        $("#dvAccountHeader").hide()
        $("#dvAllUsers").hide();
    }

}



ShowAccountDetials = function (adsId) {
    $("#dvLoading").show();
    $.ajax({
        url: "MyDomainNew.aspx/GetFeatures",
        type: 'Post',
        data: "{'adsId':'" + adsId + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            BindFeaturesList(response, adsId);

        },
        error: function (objxmlRequest) {
            $("#dvLoading").hide();
            window.console.log(objxmlRequest.responseText);
        }
    });

};

function BindFeaturesList(response, adsId) {


    var xmlDoc = $.parseXML(response.d);
    var xml = $(xmlDoc);
    var tdContent = "", redirectUrl = "";
    if (xml.find("Table").length > 0) {

        var accountList = xml.find("Table");
        var accountStatus = false;
        $.each(accountList, function () {

            var imageUrl, redirectUrl, target = "javascript:window.location.href=";
            if ($(this).find("TranStatus").text() == "1") {

                if ($(this).find("Status").text() == "1") {
                    imageUrl = "<img width='17' height='17' src='" + cdnpath + "rite.png' title='working' alt='working' />";
                }
                else if ($(this).find("Status").text() == "2") {
                    imageUrl = "<img width='17' height='17' src='" + cdnpath + "clse.png' title='In active' alt='Inactive' />";
                }
                else if ($(this).find("Status").text() == "0") {
                    imageUrl = "<img width='17' height='17' src='" + cdnpath + "emails.png' title='not started' alt='not started' />";
                }
                else {
                    imageUrl = "<img width='17' height='17' src='" + cdnpath + "rite.png' title='working' alt='working' />";
                }
            }
            else {
                imageUrl = "<img width='17' height='17' src='" + cdnpath + "cart.png' title='purchase' alt='purchase' />";
            }

            if ($(this).find("RedirectUrl").text() != "javascript:AccessDenied();")
                redirectUrl = "javascript:window.open('" + $(this).find("RedirectUrl").text() + "','_self')";
            else
                redirectUrl = $(this).find("RedirectUrl").text();
            //bind content..........

            if ($(this).find("FeatureName").text() == "Visitor Analytics") {

                if ($(this).find("Status").text() == "0")
                    accountStatus = true;

                tdContent += "<div  onclick=\"" + redirectUrl + "\" class='fBox'  style='margin-left:20px;'><div class='icn'>" + imageUrl + "</a></div><br/><div class='mydomaintips' style='width: 37px;text-align: center;'>Analytics</div></div>";
            }
            else if ($(this).find("FeatureName").text() == "Personalization") {
                tdContent += "<div onclick=\"" + redirectUrl + "\" class='fBox'><div class='icn'>" + imageUrl + "</div><br/><div class='mydomaintips' style='margin-left: -17px;text-align: center;'>Forms & Widgets</div></div>";
            }
            else if ($(this).find("FeatureName").text() == "Chat") {
                tdContent += "<div onclick=\"" + redirectUrl + "\" class='fBox'><div class='icn'>" + imageUrl + "</div><br/><div class='mydomaintips' style='width: 37px;text-align: center;'>Chat</div></div>";
            }
            else if ($(this).find("FeatureName").text() == "Email Plan - Simple") {
                tdContent += "<div onclick=\"" + redirectUrl + "\" class='fBox'><div class='icn'>" + imageUrl + "</div><br/><div class='mydomaintips' style='width: 37px;text-align: center;'>Emails</div></div>";
            }
            else if ($(this).find("FeatureName").text() == "Email Plan -Super") {
                tdContent += "<div onclick=\"" + redirectUrl + "\" class='fBox'><div class='icn'>" + imageUrl + "</div><br/><div class='mydomaintips' style='width: 37px;text-align: center;'>Prospects</div></div>";
            }
            else if ($(this).find("FeatureName").text() == "Customer Search") {
                tdContent += "<div onclick=\"" + redirectUrl + "\" class='fBox'><div class='icn'>" + imageUrl + "</div><br/><div class='mydomaintips' style='width: 37px;text-align: center;'>Social</div></div>";
            }
            else if ($(this).find("FeatureName").text() == "Communities") {
                tdContent += "<div onclick=\"" + redirectUrl + "\" class='fBox'><div class='icn'>" + imageUrl + " </div><br/><div class='mydomaintips' style='width: 37px;text-align: center;'>Community</div></div>";
            }
            else if ($(this).find("FeatureName").text() == "Unified Profiles") {
                tdContent += "<div onclick=\"" + redirectUrl + "\" class='fBox'><div class='icn'>" + imageUrl + "</div><br/><div class='mydomaintips' style='margin-left: -10px;text-align: center;'>Custom Unifier</div></div>";
            }

        });
        var checkStatus = accountStatus ? "<img src='" + cdnpath + "scrpt.png' alt='' title='Check For your Script on web pages.' style='border:0px;position: absolute;cursor: pointer;' />" : "";
        var finalDiv = "<div style='border-left: solid 1px #b2bba0;border-right: solid 1px #b2bba0;border-bottom: solid 1px #b2bba0;;height:139px;'>" +
        "<div style='float:left;width:75%;padding-top:25px;'>" +

       "" + tdContent + "" +
        "</div>" +

        "<div style='float:right;width:24%;border-left:solid 1px #b2bba0;'>" +
        "<div class='mydomainmanage'><a style='font-size: 13px;text-decoration: none;' href='GetScript.aspx?AdsId=" + adsId + "'>Get Scripts</a>&nbsp;&nbsp;<label id='ui_lblScriptStatus_" + adsId + "' onclick='CheckScriptExistsOnPage(" + adsId + ");'>" + checkStatus + "</label></div>" +
        "<div class='mydomainmanage'><a style='font-size: 13px;text-decoration: none;' href='Alerts.aspx?AdsId=" + adsId + "'>Alerts</a></div>" +
        "<div class='mydomainmanage'><a style='font-size: 13px;text-decoration: none;' href='Configurations.aspx?AdsId=" + adsId + "'>Configure Connectors</a></div>" +
        "</div>" +
        "</div>"
        $("#feature-" + adsId).append(finalDiv);

        $("#ui_lnkDomain_" + adsId).attr("onclick", "ToogleFeatures(" + adsId + ");");
        setTimeout(function () { $("#dvLoading").hide(); }, 500)
    }

};


CheckScriptExistsOnPage = function (adsId) {

    var url = $("#ui_lnkDomain_" + adsId).attr("href");
    $("#dvLoading").show();
    $.ajax({
        url: "MyDomainNew.aspx/CheckScriptExistsOnPage",
        type: 'Post',
        data: "{'adsId':'" + adsId + "','url':'" + url + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response.d)
                ShowErrorMessage("Script is fine.");
            else
                ShowErrorMessage("Script does not exist in web pages.");
            $("#dvLoading").hide();
        },
        error: function (objxmlRequest) {
            $("#dvLoading").hide();
            window.console.log(objxmlRequest.responseText);
        }
    });
};


CreateAccountWithExistingDomain = function () {

    $("#dvLoading").show();

    //var url = "Handler/AccountCreation.ashx";
    var url = "http://www.plumb5.in/wcftrackimg/CreateNew.ashx?UserId=" + $("#ContentPlaceHolder1_hdn_UserId").val() + "&callback=?";
    $.getJSON(url, function (json) {
        $.each(json, function (i, weed) {

            if (weed.IsAccountCreated == 1) {
                window.location.href = "GetScript.aspx?AdsId=" + weed.FirstAdsId + "&ShowScript=1";
            } else {
                alert("Unable to create your account please contact plumb5 team or raise a ticket.");
            }
            $("#dvLoading").hide();
        });
    });
};

function ToogleFeatures(adsId) {
    if ($("#feature-" + adsId).is(":visible")) {
        $("#feature-" + adsId).hide();
    }
    else {
        $("#feature-" + adsId).show();
    }
}

function HideAccessDined() {
    $("#dvAccessDenied").hide();
}

function AccessDenied() {
    $("#dvAccessDenied").show();

    setTimeout(function () {
        $("#dvAccessDenied").hide();
    }, 9000);
}

function CloseBanner() {

    $("#dvAdvertisement").hide();
    document.cookie = "mydomainbanner=1; expires=Thu, 18 Dec 2019 12:00:00 GMT; path=/";

}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}