var googleWorkSpace = "";
var Id = 0;
var CustomerId = 0;
var GTM = {
    InitializeGoogleSignUp: function () {
        gapi.load('auth2', function () {
            auth2 = gapi.auth2.init({
                client_id: '683399030434-tstdhpf4ohto4g3hr1gsc5lins2kbjm5.apps.googleusercontent.com',
                scope: 'https://adwords.google.com/api/adwords'
            });
        });
    },
    signInCallback: function (authResult) {
        if (authResult['code']) {
            $.ajax({
                url: '/GoogleAds/Settings/GetGoogleAccessToken',
                type: 'POST',
                data: JSON.stringify({ 'accountId': Plumb5AccountId, 'code': authResult['code'], 'CustomerId': CustomerId, 'GetId': Id}),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (result) {                    
                    if (result) {
                        ShowSuccessMessage(GlobalErrorList.GoogleAdsSettings.Validate);
                        Id = 0;
                        GetDetails();
                        //$('#span_' + Id).html('Active');
                        //$('#span_' + Id).css('background-color', '#05681b');
                    } else {
                       
                        //$('#span_' + Id).html('Inactive');
                        //$('#span_' + Id).css('background-color', '#dc3545');
                        ShowErrorMessage(GlobalErrorList.GoogleAdsSettings.UnValidate);
                        Id = 0;
                        GetDetails(0);
                        GTM.ClosePop();
                    }
                },
                error: function (error) {
                    console.log(error);
                    ShowErrorMessage(GlobalErrorList.GoogleAdsSettings.UnValidate);
                }
            });
        } else {
            ShowErrorMessage(GlobalErrorList.GoogleAdsSettings.UnValidate);
        }
    }
    
};

$(document).ready(function () {
    GTM.InitializeGoogleSignUp();
});

function installGoogleTagManager(getId, getCustId) {
    Id = getId
    CustomerId = getCustId;
    auth2.grantOfflineAccess().then(GTM.signInCallback);
}


