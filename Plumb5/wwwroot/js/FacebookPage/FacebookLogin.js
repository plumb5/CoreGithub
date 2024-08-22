var PlumbFbAppId = "", PlumbFbSecretKey = "";

$(document).ready(function () {
    FacebookLogin.GetFacebookAppId();
});

var FacebookLogin = {
    GetFacebookAppId: function () {
        $.ajax({
            url: "/FacebookPage/FacebookLogin/GetFacebookAppId",
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != null) {
                    PlumbFbAppId = response;
                    FacebookLogin.GetFacebookSecretKey();
                }
                else
                    ShowErrorMessage(GlobalErrorList.FacebookLogin.AppId_Error);
            },
            error: ShowAjaxError
        });
    },
    GetFacebookSecretKey: function () {
        $.ajax({
            url: "/FacebookPage/FacebookLogin/GetFacebookSecretKey",
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != null) {
                    PlumbFbSecretKey = response;
                    // Load the SDK Asynchronously
                    (function (d) {
                        var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
                        if (d.getElementById(id)) { return; }
                        js = d.createElement('script'); js.id = id; js.async = true;
                        js.src = "//connect.facebook.net/en_US/all.js";
                        ref.parentNode.insertBefore(js, ref);
                    }(document));
                }
                else
                    ShowErrorMessage(GlobalErrorList.FacebookLogin.SecretKey_Error);
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },

};

window.fbAsyncInit = function () {
    FB.init({
        appId: PlumbFbAppId, // App ID
        status: true, // check login status
        cookie: true, // enable cookies to allow the server to access the session
        xfbml: true  // parse XFBML
    });

    // Additional initialization code here
    FB.Event.subscribe('auth.authResponseChange', function (response) {
        if (response.status === 'connected') {
            // the user is logged in and has authenticated your
            // app, and response.authResponse supplies
            // the user's ID, a valid access token, a signed
            // request, and the time the access token
            // and signed request each expire

            var uid = response.authResponse.userID;
            var accessToken = response.authResponse.accessToken;

            var form = document.createElement("form");
            form.setAttribute("method", 'post');
            form.setAttribute("action", 'dashboard.aspx');

            var field = document.createElement("input");
            field.setAttribute("type", "hidden");
            field.setAttribute("name", 'accessToken');
            field.setAttribute("value", accessToken);
            form.appendChild(field);
            document.body.appendChild(form);

            $.ajax({
                url: "/FacebookPage/FacebookLogin/SaveFacebookToken",
                type: 'POST',
                data: JSON.stringify({ 'AdsId': Plumb5AccountId, 'RequestAccessToken': accessToken }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) {
                    if (response) {
                        ShowSuccessMessage(GlobalErrorList.FacebookLogin.TokenSaved_Success);
                        setTimeout(function () { window.location.href = "/FacebookPage/Dashboard"; }, 3000);
                    }
                    else
                        ShowErrorMessage(GlobalErrorList.FacebookLogin.TokenSaved_Failed);
                    HidePageLoading();
                },
                error: ShowAjaxError
            });

            //uncomment form submit during implementation..this is commented for UI HTML
            //form.submit();
        }
        else if (response.status === 'not_authorized') {
            // the user is logged in to Facebook,
            // but has not authenticated your app
            ShowErrorMessage(GlobalErrorList.FacebookLogin.Authentication_Error);
        }
        else {
            // the user isn't logged in to Facebook.
            ShowErrorMessage(GlobalErrorList.FacebookLogin.Login_Error);
        }
    });
};



